/**
 * BioPay Server-Side Authentication & OTP System
 * Server-only operations: OTP generation, hash verification, Redis lockout & persistence.
 */

if (typeof window !== 'undefined') {
  throw new Error('Server auth methods cannot be used in the browser.');
}

import { redisGet, redisSet, redisDel } from './redis.server';
import { AuthSession, createSession } from './auth.client';

export interface OtpRecord {
  identifier: string;
  codeHash: string;
  expiresAt: number;
  attempts: number;
}

const localOtpStore = new Map<string, OtpRecord>();
const localLockoutStore = new Map<string, number>();

export async function hashString(value: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(value);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return `h_${Math.abs(hash)}`;
}

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

export async function lockAccount(identifier: string): Promise<void> {
  const lockoutKey = `biopay:lockout:${identifier}`;
  await redisSet(lockoutKey, 'locked', 900);
  localLockoutStore.set(identifier, Date.now() + 15 * 60 * 1000);
}

export async function generateOtp(identifier: string): Promise<{ code: string; expiresAt: number }> {
  const isLocked = await isAccountLocked(identifier);
  if (isLocked) {
    throw new Error('حساب شما به دلیل تلاش‌های ناموفق مکرر به مدت ۱۵ دقیقه مسدود شده است.');
  }

  let code: string;
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const uint32 = new Uint32Array(1);
    crypto.getRandomValues(uint32);
    code = (100000 + (uint32[0] % 900000)).toString();
  } else {
    code = Math.floor(100000 + Math.random() * 900000).toString();
  }

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

  const redisKey = `biopay:otp:${identifier}`;
  await redisSet(redisKey, JSON.stringify(record), 180);
  localOtpStore.set(identifier, record);

  return { code, expiresAt };
}

export async function verifyOtp(
  identifier: string,
  enteredCode: string
): Promise<{ success: boolean; error?: string; session?: AuthSession }> {
  if (await isAccountLocked(identifier)) {
    return {
      success: false,
      error: 'حساب شما به دلیل ۵ بار تلاش ناموفق به مدت ۱۵ دقیقه مسدود شده است.',
    };
  }

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

  if (Date.now() > record.expiresAt) {
    await redisDel(redisKey);
    localOtpStore.delete(identifier);
    return { success: false, error: 'کد تایید منقضی شده است. لطفاً مجدداً تلاش نمایید.' };
  }

  record.attempts += 1;
  if (record.attempts >= 5) {
    await redisDel(redisKey);
    localOtpStore.delete(identifier);
    await lockAccount(identifier);
    return {
      success: false,
      error: 'تعداد دفعات اشتباه بیش از حد مجاز بود. حساب به مدت ۱۵ دقیقه مسدود شد.',
    };
  }

  const enteredHash = await hashString(enteredCode);
  const isValid = enteredHash === record.codeHash;

  if (!isValid) {
    await redisSet(redisKey, JSON.stringify(record), Math.max(1, Math.floor((record.expiresAt - Date.now()) / 1000)));
    localOtpStore.set(identifier, record);
    return {
      success: false,
      error: `کد وارد شده صحیح نمی‌باشد. (${5 - record.attempts} تلاش باقی‌مانده)`,
    };
  }

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

export * from './auth.client';
