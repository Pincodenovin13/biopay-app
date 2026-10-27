/**
 * BioPay Central Configuration
 */

export const BIOPAY_CONFIG = {
  APP_NAME: 'BioPay',
  APP_URL: process.env.VITE_APP_URL || 'https://biopay.app',
  TELEGRAM_BOT_USERNAME: 'BioPay_App_Bot',
  TELEGRAM_BOT_URL: 'https://t.me/BioPay_App_Bot',
  SUPPORT_TELEGRAM: 'https://t.me/BioPay_Support',
  SUPPORT_EMAIL: 'support@biopay.app',
  PLANS: {
    STARTER: {
      id: 'starter',
      slug: 'STARTER',
      nameFa: 'استارتر (Starter)',
      priceToman: 5_000_000,
      priceUsdt: 27,
      commissionPercent: 10,
      maxProducts: 12,
      maxImagesPerProduct: 3,
    },
    PRO: {
      id: 'pro',
      slug: 'PRO',
      nameFa: 'حرفه‌ای (Pro)',
      priceToman: 9_000_000,
      priceUsdt: 52,
      commissionPercent: 15,
      maxProducts: 24,
      maxImagesPerProduct: 4,
    },
    BUSINESS: {
      id: 'business',
      slug: 'BUSINESS',
      nameFa: 'سازمانی (Business)',
      priceToman: 12_000_000,
      priceUsdt: 75,
      commissionPercent: 20,
      maxProducts: 40,
      maxImagesPerProduct: 5,
    },
  },
} as const;

export default BIOPAY_CONFIG;
