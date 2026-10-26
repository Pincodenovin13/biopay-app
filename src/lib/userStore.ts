/**
 * BioPay User Store & Identity Verification Service
 * Handles:
 * - Email + Password registration with Zod validation
 * - Bcrypt password hashing (min 10 salt rounds)
 * - 24-hour verification token generation (UUID)
 * - UserStatus state machine (PENDING_VERIFICATION -> VERIFIED / REJECTED)
 * - Rate limiting (max 5 registration attempts per IP per hour)
 * - Password reset tokens (1-hour expiry)
 */

import { z } from 'zod';
import bcrypt from 'bcryptjs';

export type UserRole = 'seller' | 'referrer' | 'admin';

export type UserStatus = 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED' | 'ACTIVE';

export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  country: string;
  city?: string;
  fullName?: string;
  instagramId?: string;
  telegramId?: string;
  telegramChatId?: string;
  verificationToken?: string;
  verificationTokenExpiry?: number; // timestamp ms (24h expiry)
  resetPasswordToken?: string;
  resetPasswordExpiry?: number;
  referralCode: string;
  referralLink: string;
  storeSlug?: string;
  selectedPlan?: 'starter' | 'pro' | 'business';
  hasPaidPlan?: boolean;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

// Zod schema for registration validation
export const registrationSchema = z.object({
  email: z.string().trim().email({ message: 'ایمیل وارد شده معتبر نمی‌باشد.' }),
  password: z
    .string()
    .min(8, { message: 'رمز عبور باید حداقل ۸ کاراکتر باشد.' }),
  confirmPassword: z.string(),
  country: z.string().min(2, { message: 'لطفاً کشور خود را انتخاب فرمایید.' }),
  role: z.enum(['seller', 'referrer', 'admin']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'رمز عبور با تکرار آن مطابقت ندارد.',
  path: ['confirmPassword'],
});

// Zod schema for password reset
export const resetPasswordSchema = z.object({
  password: z.string().min(8, { message: 'رمز عبور جدید باید حداقل ۸ کاراکتر باشد.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'رمز عبور با تکرار آن مطابقت ندارد.',
  path: ['confirmPassword'],
});

// IP Rate limiter store: maps IP to array of request timestamps
const ipRegistrationAttempts = new Map<string, number[]>();
const MAX_ATTEMPTS_PER_HOUR = 5;
const ONE_HOUR_MS = 60 * 60 * 1000;
const TOKEN_EXPIRY_24H_MS = 24 * 60 * 60 * 1000;

export function checkRegistrationRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const attempts = ipRegistrationAttempts.get(ip) || [];
  // Filter out attempts older than 1 hour
  const recentAttempts = attempts.filter((timestamp) => now - timestamp < ONE_HOUR_MS);

  if (recentAttempts.length >= MAX_ATTEMPTS_PER_HOUR) {
    ipRegistrationAttempts.set(ip, recentAttempts);
    return { allowed: false, remaining: 0 };
  }

  recentAttempts.push(now);
  ipRegistrationAttempts.set(ip, recentAttempts);
  return { allowed: true, remaining: MAX_ATTEMPTS_PER_HOUR - recentAttempts.length };
}

// In-memory User storage initialized with demo users
export const usersMap = new Map<string, StoredUser>();

// Helper to generate UUID
export function generateUuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Generate referral code helper
export function generateReferralCode(email: string): string {
  const clean = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BIO_${clean || 'REF'}_${rand}`;
}

// Seed initial users for testing and demo
(async () => {
  const defaultSalt = await bcrypt.genSalt(10);
  const defaultPassHash = await bcrypt.hash('Password123!', defaultSalt);

  const demoVerifiedSeller: StoredUser = {
    id: 'usr_seller_verified',
    email: 'seller@biopay.app',
    passwordHash: defaultPassHash,
    role: 'seller',
    status: 'VERIFIED',
    country: 'Iran',
    city: 'Tehran',
    fullName: 'امیررضا صادقی',
    instagramId: 'tehran_boutique',
    telegramId: '12345678',
    referralCode: 'BIO_SELLER_8890',
    referralLink: 'https://biopay.app/ref/BIO_SELLER_8890',
    storeSlug: 'tehrano_boutique',
    selectedPlan: 'starter',
    hasPaidPlan: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const demoPendingSeller: StoredUser = {
    id: 'usr_seller_pending',
    email: 'pending@biopay.app',
    passwordHash: defaultPassHash,
    role: 'seller',
    status: 'PENDING_VERIFICATION',
    country: 'Iran',
    verificationToken: '550e8400-e29b-41d4-a716-446655440000',
    verificationTokenExpiry: Date.now() + TOKEN_EXPIRY_24H_MS,
    referralCode: 'BIO_PEND_1122',
    referralLink: 'https://biopay.app/ref/BIO_PEND_1122',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const demoReferrer: StoredUser = {
    id: 'usr_referrer_01',
    email: 'referrer@biopay.app',
    passwordHash: defaultPassHash,
    role: 'referrer',
    status: 'VERIFIED',
    country: 'United Arab Emirates',
    city: 'Dubai',
    fullName: 'کامران بهرامی',
    instagramId: 'kamran_dubai',
    telegramId: '87654321',
    referralCode: 'BIO_DUBAI_7788',
    referralLink: 'https://biopay.app/ref/BIO_DUBAI_7788',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  usersMap.set(demoVerifiedSeller.email, demoVerifiedSeller);
  usersMap.set(demoPendingSeller.email, demoPendingSeller);
  usersMap.set(demoReferrer.email, demoReferrer);
})();

/**
 * Register a new user with Email + Password
 */
export async function registerNewUser(params: {
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  role: UserRole;
  clientIp?: string;
}): Promise<{ ok: boolean; user?: StoredUser; error?: string; verificationToken?: string }> {
  // 1. Zod Validation
  const validation = registrationSchema.safeParse(params);
  if (!validation.success) {
    const firstError = validation.error.issues[0]?.message || 'اطلاعات وارد شده نامعتبر است.';
    return { ok: false, error: firstError };
  }

  // 2. Rate limiting check (max 5 per IP per hour)
  const ip = params.clientIp || '127.0.0.1';
  const rateLimit = checkRegistrationRateLimit(ip);
  if (!rateLimit.allowed) {
    return {
      ok: false,
      error: 'تعداد دفعات ثبت‌نام از این آدرس بیش از حد مجاز است. لطفاً ۱ ساعت دیگر تلاش کنید.',
    };
  }

  // 3. Check duplicate email
  const normalizedEmail = params.email.trim().toLowerCase();
  if (usersMap.has(normalizedEmail)) {
    return { ok: false, error: 'این ایمیل قبلاً در سیستم ثبت‌نام شده است.' };
  }

  // 4. Hash password with bcrypt (10 rounds)
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(params.password, salt);

  // 5. Generate 24-hour verification token (UUID)
  const verificationToken = generateUuid();
  const verificationTokenExpiry = Date.now() + TOKEN_EXPIRY_24H_MS;

  const referralCode = generateReferralCode(normalizedEmail);
  const referralLink = `https://biopay.app/ref/${referralCode}`;
  const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const newUser: StoredUser = {
    id: userId,
    email: normalizedEmail,
    passwordHash,
    role: params.role,
    status: 'PENDING_VERIFICATION',
    country: params.country,
    verificationToken,
    verificationTokenExpiry,
    referralCode,
    referralLink,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  usersMap.set(normalizedEmail, newUser);

  return {
    ok: true,
    user: newUser,
    verificationToken,
  };
}

/**
 * Validate verification token and link telegramId
 */
export function verifyUserToken(token: string, telegramId?: string): { ok: boolean; user?: StoredUser; error?: string } {
  for (const user of usersMap.values()) {
    if (user.verificationToken === token) {
      // Check 24 hour expiry
      if (user.verificationTokenExpiry && Date.now() > user.verificationTokenExpiry) {
        return { ok: false, error: 'لینک یا توکن تایید هویت منقضی شده است (حداکثر ۲۴ ساعت).' };
      }

      if (telegramId) {
        user.telegramId = telegramId;
        user.telegramChatId = telegramId;
        user.updatedAt = new Date().toISOString();
      }

      return { ok: true, user };
    }
  }

  return { ok: false, error: 'توکن تایید هویت یافت نشد یا نامعتبر است.' };
}

/**
 * Save user identity documents (pure text fields: instagramId, fullName, country, city)
 */
export function saveUserDocuments(params: {
  userId: string;
  instagramId: string;
  fullName: string;
  country: string;
  city: string;
}): { ok: boolean; user?: StoredUser; error?: string } {
  for (const user of usersMap.values()) {
    if (user.id === params.userId) {
      user.instagramId = params.instagramId.replace(/^@/, '').trim();
      user.fullName = params.fullName.trim();
      user.country = params.country.trim();
      user.city = params.city.trim();
      user.updatedAt = new Date().toISOString();
      return { ok: true, user };
    }
  }
  return { ok: false, error: 'کاربر یافت نشد.' };
}

/**
 * Admin approves user verification
 */
export function approveUserVerification(userId: string): {
  ok: boolean;
  user?: StoredUser;
  referralLink?: string;
  storeLink?: string;
  error?: string;
} {
  for (const user of usersMap.values()) {
    if (user.id === userId) {
      user.status = 'VERIFIED';
      user.verificationToken = undefined;
      user.verificationTokenExpiry = undefined;
      user.rejectionReason = undefined;

      const storeSlug = user.storeSlug || (user.instagramId ? user.instagramId.toLowerCase() : `store_${user.id.slice(-6)}`);
      user.storeSlug = storeSlug;
      user.updatedAt = new Date().toISOString();

      const storeLink = `https://biopay.app/s/${storeSlug}`;
      return {
        ok: true,
        user,
        referralLink: user.referralLink,
        storeLink,
      };
    }
  }
  return { ok: false, error: 'کاربر یافت نشد.' };
}

/**
 * Admin rejects user verification
 */
export function rejectUserVerification(userId: string, reason?: string): { ok: boolean; user?: StoredUser; error?: string } {
  for (const user of usersMap.values()) {
    if (user.id === userId) {
      user.status = 'REJECTED';
      user.rejectionReason = reason || 'اطلاعات ارسالی با معیارهای اعتبارسنجی همخوانی ندارد.';
      user.updatedAt = new Date().toISOString();
      return { ok: true, user };
    }
  }
  return { ok: false, error: 'کاربر یافت نشد.' };
}

/**
 * Login user with Email + Password
 */
export async function loginWithEmailPassword(
  email: string,
  pass: string
): Promise<{ ok: boolean; user?: StoredUser; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = usersMap.get(normalizedEmail);

  if (!user) {
    return { ok: false, error: 'کاربری با این ایمیل یافت نشد.' };
  }

  const isPasswordValid = await bcrypt.compare(pass, user.passwordHash);
  if (!isPasswordValid) {
    return { ok: false, error: 'رمز عبور وارد شده نادرست است.' };
  }

  return { ok: true, user };
}

/**
 * Request password reset link
 */
export function requestPasswordReset(email: string): { ok: boolean; resetToken?: string; error?: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const user = usersMap.get(normalizedEmail);

  if (!user) {
    // For security reasons, don't reveal email presence, but return ok
    return { ok: true, resetToken: generateUuid() };
  }

  const resetToken = generateUuid();
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpiry = Date.now() + ONE_HOUR_MS; // 1 hour expiry
  user.updatedAt = new Date().toISOString();

  return { ok: true, resetToken };
}

/**
 * Reset password using token
 */
export async function resetPasswordWithToken(
  token: string,
  newPassword: string
): Promise<{ ok: boolean; error?: string }> {
  for (const user of usersMap.values()) {
    if (user.resetPasswordToken === token) {
      if (user.resetPasswordExpiry && Date.now() > user.resetPasswordExpiry) {
        return { ok: false, error: 'لینک بازیابی رمز عبور منقضی شده است (حداکثر ۱ ساعت).' };
      }

      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(newPassword, salt);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiry = undefined;
      user.updatedAt = new Date().toISOString();

      return { ok: true };
    }
  }

  return { ok: false, error: 'لینک بازیابی رمز عبور نامعتبر است.' };
}

/**
 * Find user by ID or token
 */
export function findUserById(userId: string): StoredUser | undefined {
  for (const user of usersMap.values()) {
    if (user.id === userId) return user;
  }
  return undefined;
}

export function findUserByVerificationToken(token: string): StoredUser | undefined {
  for (const user of usersMap.values()) {
    if (user.verificationToken === token) return user;
  }
  return undefined;
}
