/**
 * BioPay Plan Types & Central Config
 * Safe for both browser and server imports (zero Node/DB dependencies).
 */

export type BioPayPlanSlug = 'starter' | 'pro' | 'business';

export interface PlanConfig {
  slug: BioPayPlanSlug;
  name: string;
  durationMonths: number;
  priceToman: number;
  oldPriceToman: number;
  priceUSDT: number;
  oldPriceUSDT: number;
  referralCommissionPercent: number;
  maxProducts: number;
  maxImagesPerProduct: number;
  features: string[];
}

export const BIOPAY_PLANS: Record<BioPayPlanSlug, PlanConfig> = {
  starter: {
    slug: 'starter',
    name: 'استارتر (Starter)',
    durationMonths: 1,
    priceToman: 5_000_000,
    oldPriceToman: 9_000_000,
    priceUSDT: 27,
    oldPriceUSDT: 45,
    referralCommissionPercent: 10,
    maxProducts: 12,
    maxImagesPerProduct: 3,
    features: [
      'مدت اشتراک: ۱ ماه',
      'حداکثر ۱۲ محصول فعال در ویترین فروشگاه',
      'حداکثر ۳ تصویر به ازای هر محصول (فشرده‌سازی WebP)',
      'درگاه پرداخت شاپرک (زرین‌پال) و کریپتو TRC20',
      'کارمزد ۲٪ تراکنش‌های فروشگاه',
      'پورسانت همکاری در فروش ۱۰٪',
    ],
  },
  pro: {
    slug: 'pro',
    name: 'حرفه‌ای (Pro)',
    durationMonths: 2,
    priceToman: 9_000_000,
    oldPriceToman: 15_000_000,
    priceUSDT: 52,
    oldPriceUSDT: 80,
    referralCommissionPercent: 15,
    maxProducts: 24,
    maxImagesPerProduct: 4,
    features: [
      'مدت اشتراک: ۲ ماه (محبوب‌ترین)',
      'حداکثر ۲۴ محصول فعال در ویترین فروشگاه',
      'حداکثر ۴ تصویر به ازای هر محصول',
      'درگاه مستقیم و واریز ۲۴ ساعته پایا و تتر',
      'کارمزد ۱.۵٪ روی تراکنش‌های فروشگاه',
      'پورسانت همکاری در فروش ۱۵٪ برای معرف',
      'حذف نشان تبلیغاتی بایوپی از فوتر ویترین',
    ],
  },
  business: {
    slug: 'business',
    name: 'سازمانی (Business)',
    durationMonths: 3,
    priceToman: 12_000_000,
    oldPriceToman: 20_000_000,
    priceUSDT: 75,
    oldPriceUSDT: 110,
    referralCommissionPercent: 20,
    maxProducts: 40,
    maxImagesPerProduct: 5,
    features: [
      'مدت اشتراک: ۳ ماه (بیشترین تخفیف)',
      'حداکثر ۴۰ محصول فعال در ویترین فروشگاه',
      'حداکثر ۵ تصویر به ازای هر محصول',
      'تا ۵ فروشگاه مجزا روی یک حساب کاربری',
      'کمترین کارمزد تراکنش: فقط ۱.۰٪',
      'بالاترین پورسانت ارجاع: ۲۰٪ نقدی به ازای هر خرید',
      'اتصال به دامنه اختصاصی (Custom Domain)',
    ],
  },
};
