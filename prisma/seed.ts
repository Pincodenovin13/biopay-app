import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const DEFAULT_PLANS = [
  {
    name: 'طرح پایه (Starter)',
    slug: 'starter',
    priceMonthly: BigInt(9_000_000), // 9 Million Toman
    priceAnnual: BigInt(86_400_000),  // 20% discount on annual
    priceUSDTMonthly: 26,             // 26 USDT
    priceUSDTAnnual: 250,
    maxProducts: 50,
    maxStores: 1,
    transactionFeePercent: 2.0,
    features: [
      'تا ۵۰ محصول فعال در ویترین',
      'درگاه پرداخت شتابی (زرین‌پال) و تتر TRC20',
      'کارمزد ۲٪ تراکنش‌های فروشگاه',
      'کمیسیون ارجاع ۱۰٪',
      'پشتیبانی استاندارد تلگرامی',
    ],
  },
  {
    name: 'طرح حرفه‌ای (Pro)',
    slug: 'pro',
    priceMonthly: BigInt(12_000_000), // 12 Million Toman
    priceAnnual: BigInt(115_200_000), // 20% discount on annual
    priceUSDTMonthly: 53,              // 53 USDT
    priceUSDTAnnual: 510,
    maxProducts: 500,
    maxStores: 3,
    transactionFeePercent: 1.0,
    features: [
      'محصولات نامحدود (تا ۵۰۰ در فاز اول)',
      'حذف نشان "قدرت‌گرفته از بایوپی"',
      'کارمزد ۱٪ ویژه روی تراکنش‌ها',
      'کمیسیون ارجاع ۱۵٪ برای همکاران',
      'دامنه اختصاصی و واریز اتوماتیک پایا و تتر',
      'پشتیبانی VIP اختصاصی ۲۴/۷',
    ],
  },
];

export const DEFINED_INDUSTRIES = [
  { name: 'پوشاک و مد و استایل', slug: 'clothing-fashion', icon: 'shirt', order: 1 },
  { name: 'آرایشی و مراقبت پوستی', slug: 'cosmetics-beauty', icon: 'sparkles', order: 2 },
  { name: 'زیورآلات، ساعت و اکسسوری', slug: 'accessories-jewelry', icon: 'gem', order: 3 },
  { name: 'خانه، دکوراسیون و آشپزخانه', slug: 'home-kitchen', icon: 'home', order: 4 },
  { name: 'لوازم دیجیتال و جانبی موبایل', slug: 'electronics-digital', icon: 'smartphone', order: 5 },
  { name: 'خوراکی، شیرینی‌جات و کافه', slug: 'food-sweets', icon: 'coffee', order: 6 },
  { name: 'صنایع دستی، تابلو و گالری هنری', slug: 'art-handicrafts', icon: 'palette', order: 7 },
  { name: 'ورزش، تناسب اندام و مکمل', slug: 'health-fitness', icon: 'activity', order: 8 },
  { name: 'کودک، نوزاد و اسباب‌بازی', slug: 'kids-toys', icon: 'smile', order: 9 },
  { name: 'کتاب، تحریر و دوره‌های آموزشی', slug: 'books-education', icon: 'book-open', order: 10 },
  { name: 'کیف، کفش و چرم طبیعی', slug: 'bags-shoes', icon: 'shopping-bag', order: 11 },
  { name: 'خدمات، طراحی و مشاوره تخصصی', slug: 'services-consultation', icon: 'briefcase', order: 12 },
];

export async function main() {
  console.log('Seeding BioPay Plans & Industries...');

  // 1. Seed Plans
  for (const plan of DEFAULT_PLANS) {
    await (prisma.plan as any).upsert({
      where: { slug: plan.slug },
      update: {
        name: plan.name,
        priceMonthly: plan.priceMonthly,
        priceAnnual: plan.priceAnnual,
        priceUSDTMonthly: plan.priceUSDTMonthly,
        priceUSDTAnnual: plan.priceUSDTAnnual,
        maxProducts: plan.maxProducts,
        maxStores: plan.maxStores,
        transactionFeePercent: plan.transactionFeePercent,
        features: plan.features,
        isActive: true,
      },
      create: {
        name: plan.name,
        slug: plan.slug,
        priceMonthly: plan.priceMonthly,
        priceAnnual: plan.priceAnnual,
        priceUSDTMonthly: plan.priceUSDTMonthly,
        priceUSDTAnnual: plan.priceUSDTAnnual,
        maxProducts: plan.maxProducts,
        maxStores: plan.maxStores,
        transactionFeePercent: plan.transactionFeePercent,
        features: plan.features,
        isActive: true,
      },
    });
    console.log(`Plan seeded: ${plan.slug} (${plan.name})`);
  }

  // 2. Seed Industries
  if ('industry' in prisma) {
    for (const ind of DEFINED_INDUSTRIES) {
      await (prisma as any).industry.upsert({
        where: { slug: ind.slug },
        update: {
          name: ind.name,
          icon: ind.icon,
          order: ind.order,
        },
        create: {
          name: ind.name,
          slug: ind.slug,
          icon: ind.icon,
          order: ind.order,
        },
      });
      console.log(`Industry seeded: ${ind.slug} - ${ind.name}`);
    }
  }

  console.log('BioPay seed completed successfully.');
}

if (process.env.NODE_ENV !== 'test') {
  main()
    .catch((e) => {
      console.error('Seed error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
