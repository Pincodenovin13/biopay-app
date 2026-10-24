/**
 * Shared validation schemas using Zod for BioPay API & Client forms
 */

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
}

export const IRAN_PHONE_REGEX = /^(\+98|0)?9\d{9}$/;
export const SHEBA_REGEX = /^IR\d{24}$/;
export const STORE_SLUG_REGEX = /^[a-z0-9_-]{3,30}$/;

export function validateIdentifier(identifier: string): { isValid: boolean; type: 'phone' | 'email' | 'invalid'; formatted: string } {
  const clean = identifier.trim().toLowerCase();
  
  if (clean.includes('@')) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(clean)) {
      return { isValid: true, type: 'email', formatted: clean };
    }
    return { isValid: false, type: 'invalid', formatted: clean };
  }

  // Normalize Iranian phone number
  let phone = clean.replace(/[\s-]/g, '');
  if (phone.startsWith('+98')) {
    phone = '0' + phone.substring(3);
  } else if (phone.startsWith('0098')) {
    phone = '0' + phone.substring(4);
  } else if (phone.length === 10 && phone.startsWith('9')) {
    phone = '0' + phone;
  }

  if (/^09\d{9}$/.test(phone)) {
    return { isValid: true, type: 'phone', formatted: phone };
  }

  return { isValid: false, type: 'invalid', formatted: clean };
}

export function validateOtpCode(code: string): boolean {
  return /^\d{6}$/.test(code.trim());
}

export function validateSheba(sheba: string): { isValid: boolean; formatted: string; bankName?: string } {
  let clean = sheba.trim().toUpperCase().replace(/[\s-]/g, '');
  if (!clean.startsWith('IR')) {
    clean = 'IR' + clean;
  }

  if (!SHEBA_REGEX.test(clean)) {
    return { isValid: false, formatted: clean };
  }

  // Identify Iranian Bank by Sheba prefix (digits 3 to 5)
  const bankCode = clean.substring(2, 5);
  const bankDirectory: Record<string, string> = {
    '012': 'بانک ملت (Mellat)',
    '013': 'بانک رفاه کارگران (Refah)',
    '014': 'بانک مسکن (Maskan)',
    '015': 'بانک سپه (Sepah)',
    '017': 'بانک ملی ایران (Melli)',
    '018': 'بانک تجارت (Tejarat)',
    '019': 'بانک صادرات ایران (Saderat)',
    '020': 'بانک توسعه صادرات (EDBI)',
    '021': 'پست بانک ایران (Post Bank)',
    '054': 'بانک پارسیان (Parsian)',
    '055': 'بانک اقتصاد نوین (EN Bank)',
    '056': 'بانک سامان (Saman)',
    '057': 'بانک پاسارگاد (Pasargad)',
    '061': 'بانک شهر (Shahr)',
    '062': 'بانک آینده (Ayandeh)',
    '070': 'بانک رسالت (Resalat)',
    '078': 'بانک مهر ایران (Mehr Iran)',
  };

  return {
    isValid: true,
    formatted: clean,
    bankName: bankDirectory[bankCode] || 'شبکه بانکی شتاب',
  };
}

export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
