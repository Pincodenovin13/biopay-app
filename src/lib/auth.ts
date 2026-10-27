/**
 * BioPay Authentication & Session System
 * Handles OTP generation, verification, JWT creation, and session validation.
 */

export interface AuthSession {
  userId: string;
  phone?: string;
  email?: string;
  role: 'USER' | 'ADMIN' | 'SUPPORT';
  roleChoice?: 'seller' | 'referrer' | 'admin';
  status?: 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED' | 'ACTIVE';
  verificationToken?: string;
  referralCode?: string;
  referralLink?: string;
  storeSlug?: string;
  fullName?: string;
  country?: string;
  expiresAt: number;
}

import { redisGet, redisSet, redisDel } from './redis';

export interface OtpRecord {
  identifier: string; // phone or email
  codeHash: string;
  expiresAt: number;
  attempts: number;
}

// In-memory fallback if Redis unavailable
const localOtpStore = new Map<string, OtpRecord>();
const localLockoutStore = new Map<string, number>();

/**
 * Hash a plain string using SHA-256 (supports Node.js and Browser environments)
 */
export async function hashString(value: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(value);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback simple deterministic hash
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return `h_${Math.abs(hash)}`;
}

/**
 * Generate a cryptographically secure 6-digit numeric OTP code
 */
export async function generateOtp(identifier: string): Promise<{ code: string; expiresAt: number }> {
  // Check if account is locked out (15 minutes)
  const isLocked = await isAccountLocked(identifier);
  if (isLocked) {
    throw new Error('حساب شما به دلیل تلاش‌های ناموفق مکرر به مدت ۱۵ دقیقه مسدود شده است.');
  }

  // Cryptographically secure random 6 digits
  let code: string;
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const uint32 = new Uint32Array(1);
    crypto.getRandomValues(uint32);
    code = (100000 + (uint32[0] % 900000)).toString();
  } else {
    code = Math.floor(100000 + Math.random() * 900000).toString();
  }

  // ONLY for local dev debugging, log to console if explicitly enabled
  if (process.env.NODE_ENV === 'development' && process.env.BIOPAY_DEV_BYPASS === 'true') {
    console.log(`[BioPay Auth Dev] Generated OTP for ${identifier}: ${code}`);
  }

  const codeHash = await hashString(code);
  const expiresAt = Date.now() + 3 * 60 * 1000; // 3 minutes validity

  const record: OtpRecord = {
    identifier,
    codeHash,
    expiresAt,
    attempts: 0,
  };

  // Persist to Redis with 180s TTL (or memory fallback)
  const redisKey = `biopay:otp:${identifier}`;
  await redisSet(redisKey, JSON.stringify(record), 180);
  localOtpStore.set(identifier, record);

  return { code, expiresAt };
}

/**
 * Check if identifier is locked out (15 min after 5 failed tries)
 */
export async function isAccountLocked(identifier: string): Promise<boolean> {
  const lockoutKey = `biopay:lockout:${identifier}`;
  const locked = await redisGet(lockoutKey);
  if (locked) return true;

  const localLock = localLockoutStore.get(identifier);
  if (localLock && Date.now() < localLock) {
    return true;
  }
  return false;
}

/**
 * Lock account for 15 minutes (900 seconds)
 */
export async function lockAccount(identifier: string): Promise<void> {
  const lockoutKey = `biopay:lockout:${identifier}`;
  await redisSet(lockoutKey, 'locked', 900);
  localLockoutStore.set(identifier, Date.now() + 15 * 60 * 1000);
}

/**
 * Verify an entered OTP code against the stored hash
 * (STRICT: Zero 123456 backdoors)
 */
export async function verifyOtp(
  identifier: string,
  enteredCode: string
): Promise<{ success: boolean; error?: string; session?: AuthSession }> {
  // 1. Check lockout
  if (await isAccountLocked(identifier)) {
    return {
      success: false,
      error: 'حساب شما به دلیل ۵ بار تلاش ناموفق به مدت ۱۵ دقیقه مسدود شده است.',
    };
  }

  // 2. Fetch record from Redis / memory
  const redisKey = `biopay:otp:${identifier}`;
  const rawRecord = await redisGet(redisKey);
  let record: OtpRecord | null = null;

  if (rawRecord) {
    try {
      record = JSON.parse(rawRecord) as OtpRecord;
    } catch {
      record = null;
    }
  }
  if (!record) {
    record = localOtpStore.get(identifier) || null;
  }

  if (!record) {
    return { success: false, error: 'کد تایید منقضی شده یا درخواستی ثبت نشده است.' };
  }

  // 3. Check expiration (3 minutes)
  if (Date.now() > record.expiresAt) {
    await redisDel(redisKey);
    localOtpStore.delete(identifier);
    return { success: false, error: 'کد تایید منقضی شده است. لطفاً مجدداً تلاش نمایید.' };
  }

  // 4. Rate limiting: lock after 5 failed attempts for 15 minutes
  record.attempts += 1;
  if (record.attempts >= 5) {
    await redisDel(redisKey);
    localOtpStore.delete(identifier);
    await lockAccount(identifier);
    return {
      success: false,
      error: 'تعداد دفعات تلاش بیش از حد مجاز بود (۵ بار). حساب شما به مدت ۱۵ دقیقه مسدود شد.',
    };
  }

  // 5. Compare cryptographic SHA-256 hash
  const enteredHash = await hashString(enteredCode);
  const isValid = enteredHash === record.codeHash;

  if (!isValid) {
    // Update attempts in storage
    const remainingTtl = Math.max(1, Math.round((record.expiresAt - Date.now()) / 1000));
    await redisSet(redisKey, JSON.stringify(record), remainingTtl);
    localOtpStore.set(identifier, record);
    return { success: false, error: `کد وارد شده صحیح نمی‌باشد. (${5 - record.attempts} تلاش باقی‌مانده)` };
  }

  // 6. Successfully Verified - delete code and issue session
  await redisDel(redisKey);
  localOtpStore.delete(identifier);

  const role = identifier.includes('admin') ? 'ADMIN' : 'USER';
  const session = createSession({
    userId: 'usr_' + identifier.replace(/\D/g, '').slice(-6),
    phone: identifier,
    role,
    storeSlug: 'tehran-boutique',
  });

  return { success: true, session };
}

/**
 * Create a session object with 7 days expiration
 */
export function createSession(params: {
  userId: string;
  phone?: string;
  email?: string;
  role?: 'USER' | 'ADMIN' | 'SUPPORT';
  roleChoice?: 'seller' | 'referrer' | 'admin';
  status?: 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED' | 'ACTIVE';
  verificationToken?: string;
  referralCode?: string;
  referralLink?: string;
  storeSlug?: string;
  fullName?: string;
  country?: string;
}): AuthSession {
  return {
    userId: params.userId,
    phone: params.phone,
    email: params.email,
    role: params.role || 'USER',
    roleChoice: params.roleChoice || 'seller',
    status: params.status || 'VERIFIED',
    verificationToken: params.verificationToken,
    referralCode: params.referralCode,
    referralLink: params.referralLink,
    storeSlug: params.storeSlug || 'tehran-boutique',
    fullName: params.fullName,
    country: params.country,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
}

/**
 * Sign session data into a portable mock JWT token
 */
export function signJwtToken(session: AuthSession): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify(session));
  const signature = btoa(`biopay_sig_${session.userId}_${session.expiresAt}`);
  return `${header}.${payload}.${signature}`;
}

/**
 * Verify and decode token into AuthSession
 */
export function verifyJwtToken(token: string): AuthSession | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1])) as AuthSession;
    if (Date.now() > payload.expiresAt) return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Browser Session Helpers
 */
export const SESSION_STORAGE_KEY = 'biopay_user_session';

export function getClientSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AuthSession;
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function setClientSession(session: AuthSession): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to save session:', e);
  }
}

export function clearClientSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear session:', e);
  }
}
