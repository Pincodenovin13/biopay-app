/**
 * BioPay Client-Side Authentication & Session Management
 * Pure browser-safe utilities for storing and retrieving session state.
 * NO Node.js, Redis, or database dependencies.
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

export const SESSION_STORAGE_KEY = 'biopay_user_session';

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
