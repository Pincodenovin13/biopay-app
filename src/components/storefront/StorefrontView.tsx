import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  CheckCircle2,
  Instagram,
  MessageCircle,
  Send,
  Search,
  ArrowRight,
  ShieldCheck,
  X,
  CreditCard,
  Heart,
  PackageOpen,
  Sparkles,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { LanguageDropdown } from '../ui/LanguageDropdown';

export interface StorefrontProduct {
  id: string;
  title: string;
  description: string;
  priceToman: number;
  compareAtToman?: number;
  category: string;
  stock: number;
  image: string;
}

export interface StorefrontData {
  title: string;
  slug: string;
  bio: string;
  industry: string;
  avatarUrl?: string;
  bannerUrl?: string;
  whatsappNumber?: string;
  telegramHandle?: string;
  plan: 'STARTER' | 'PRO';
  isVerified?: boolean;
}

const DEFAULT_PRODUCTS: StorefrontProduct[] = [
  {
    id: 'sp_1',
    title: 'کت تک لینن اورسایز بهاره مدل صبا',
    description: 'پارچه ۱۰۰٪ لینن طبیعی سنگ‌شور شده، بسیار سبک و خنک با تنخور آزاد',
    priceToman: 780000,
    compareAtToman: 950000,
    category: 'کت و مانتو',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'sp_2',
    title: 'شومیز کرپ ژاکارد طرحدار مجلسی',
    description: 'یقه کراواتی مدرن، آستین مچ‌دار، مناسب مهمانی و دورهمی بهاره',
    priceToman: 520000,
    compareAtToman: 640000,
    category: 'شومیز و بلوز',
    stock: 8,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'sp_3',
    title: 'شلوار واید بگ تابستانه لینن',
    description: 'کمر کشی کشسانی بالا با دوخت دوبل، پارچه نرم و بادوام',
    priceToman: 440000,
    category: 'شلوار',
    stock: 19,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'sp_4',
    title: 'دورس کتان پنبه سبک بهاره',
    description: 'طرح مینیمال گلدوزی، یقه گرد کشبافت مناسب استایل کژوال',
    priceToman: 610000,
    compareAtToman: 750000,
    category: 'دورس و سویشرت',
    stock: 6,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
  },
];

interface StorefrontViewProps {
  storeSlug?: string;
  storeData?: StorefrontData;
  products?: StorefrontProduct[];
  onGoHome?: () => void;
}

export function StorefrontView({
  storeSlug = 'tehrano_boutique',
  storeData,
  products = DEFAULT_PRODUCTS,
  onGoHome,
}: StorefrontViewProps) {
  const { t, formatPrice } = useI18n();

  const store: StorefrontData = storeData || {
    title: 'بوتیک لباس و مد تهرانو',
    slug: storeSlug,
    bio: 'طراحی و دوخت مانتو و پوشاک شیک بانوان با ارسال رایگان و سریع به سراسر کشور',
    industry: 'پوشاک و مد بانوان',
    whatsappNumber: '09121112233',
    telegramHandle: 'tehran_boutique',
    plan: 'PRO',
    isVerified: true,
  };

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<StorefrontProduct | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Derive categories from products
  const productCategories = Array.from(new Set(products.map((p) => p.category)));
  const categories = ['all', ...productCategories];

  const filteredProducts = products.filter((prod) => {
    const matchesCategory = activeCategory === 'all' || prod.category === activeCategory;
    const matchesSearch = prod.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenCheckout = (product: StorefrontProduct) => {
    setSelectedProduct(product);
    setIsCheckoutOpen(true);
    setIsSuccess(false);
  };

  const handleDirectWhatsApp = (product: StorefrontProduct) => {
    const phone = store.whatsappNumber ? store.whatsappNumber.replace(/[^0-9]/g, '') : '989121112233';
    const message = `سلام، من مایل به ثبت سفارش «${product.title}» با قیمت ${product.priceToman.toLocaleString(
      'fa-IR'
    )} تومان از طریق فروشگاه بیو شما هستم.`;
    window.open(`https://wa.me/${phone.startsWith('0') ? '98' + phone.substring(1) : phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;
    setIsSuccess(true);
  };

  // Structured Data (JSON-LD) for SEO
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: store.title,
    description: store.bio,
    url: `https://biopay.me/s/${store.slug}`,
    telephone: store.whatsappNumber,
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 7,
    },
    makesOffer: products.map((prod) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Product',
        name: prod.title,
        description: prod.description,
        image: prod.image,
      },
      price: prod.priceToman,
      priceCurrency: 'IRR',
      availability: prod.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    })),
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between text-start">
      {/* Inject JSON-LD Schema.org for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          {onGoHome ? (
            <button
              onClick={onGoHome}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <span>{t('landing.heroBadge')}</span>
            </button>
          ) : (
            <div className="text-xs font-bold text-slate-400 font-mono">biopay.me/s/{store.slug}</div>
          )}

          <div className="flex items-center gap-3">
            {store.isVerified !== false && (
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500 text-white" />
                <span>ویترین تاییدشده رسمی</span>
              </span>
            )}
            <LanguageDropdown />
          </div>
        </div>
      </header>

      {/* Quick Contact Bar: Sticky bar with WhatsApp & Telegram buttons */}
      {(store.whatsappNumber || store.telegramHandle) && (
        <div className="sticky top-14 z-30 bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md text-white py-2 px-4 shadow-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-medium hidden sm:inline">ارتباط مستقیم و ثبت سفارش فوری با فروشگاه:</span>
              <span className="font-bold sm:hidden">پشتیبانی:</span>
            </div>

            <div className="flex items-center gap-2">
              {store.whatsappNumber && (
                <a
                  href={`https://wa.me/${store.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>واتساپ</span>
                </a>
              )}
              {store.telegramHandle && (
                <a
                  href={`https://t.me/${store.telegramHandle.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#229ED9] hover:bg-[#1d8bc0] text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>تلگرام</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Store Area */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8 w-full flex-1">
        {/* Store Profile Card with Header gradient background */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4 overflow-hidden"
        >
          {/* Subtle gradient behind header */}
          <div className="absolute inset-0 bg-linear-to-b from-emerald-500/10 via-teal-500/5 to-transparent pointer-events-none" />

          {/* Store Avatar */}
          <div className="relative w-28 h-28 rounded-full bg-linear-to-tr from-emerald-500 via-teal-400 to-amber-400 mx-auto p-1 shadow-lg">
            {store.avatarUrl ? (
              <img
                src={store.avatarUrl}
                alt={store.title}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-black text-3xl text-white">
                {store.title.substring(0, 2)}
              </div>
            )}
          </div>

          {/* Store Details */}
          <div className="relative space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {store.title}
              </h1>
              {store.isVerified !== false && (
                <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-500 text-white" />
              )}
            </div>

            <div className="flex items-center justify-center gap-2">
              <Badge variant="neutral">{store.industry}</Badge>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
              {store.bio}
            </p>
          </div>
        </motion.div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Categories Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white dark:bg-emerald-600 shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                {cat === 'all' ? 'همه محصولات' : cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-72">
            <Input
              placeholder="جستجوی محصول در فروشگاه..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftAddon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
              <PackageOpen className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                {t('storefront.emptyProducts')}
              </h3>
              <p className="text-xs text-slate-500">
                فروشنده در حال بروزرسانی کالکشن و موجودی انبار می‌باشد.
              </p>
            </div>
          </div>
        ) : (
          /* Products Grid: Responsive: 2 cols on mobile, 3 cols on tablet, 4 cols on desktop */
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.08 },
              },
            }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Product Image Container with Zoom Effect */}
                <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Stock Tag */}
                  <div className="absolute top-2.5 start-2.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-md shadow-xs">
                      {product.stock} موجود
                    </span>
                  </div>

                  {/* Slide-Up WhatsApp Button on Hover */}
                  <div className="absolute inset-x-2.5 bottom-2.5 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={() => handleDirectWhatsApp(product)}
                      className="w-full py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg backdrop-blur-md transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{t('storefront.orderOnWhatsapp')}</span>
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-3.5 sm:p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {product.category}
                    </span>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug">
                      {product.title}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                    <div className="flex items-baseline justify-between">
                      <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-mono tabular-nums">
                        {formatPrice(product.priceToman, 'TOMAN')}
                      </div>
                      {product.compareAtToman && (
                        <div className="text-[10px] text-slate-400 line-through font-mono tabular-nums">
                          {formatPrice(product.compareAtToman, 'TOMAN')}
                        </div>
                      )}
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => handleOpenCheckout(product)}
                      leftIcon={<ShoppingBag className="w-3 h-3" />}
                    >
                      {t('dashboard.instantCheckout')}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Checkout Modal */}
      <Modal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        title={isSuccess ? 'سفارش شما با موفقیت ثبت شد!' : 'خرید آنلاین و تسویه فوری'}
        description={
          isSuccess
            ? 'پیامک تایید و شناسه سفارش به تلفن همراه شما ارسال گردید.'
            : selectedProduct?.title
        }
        maxWidth="md"
      >
        {isSuccess ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                با تشکر از خرید شما، {customerName}
              </h4>
              <p className="text-xs text-slate-500">
                فروشگاه سفارش شما را بررسی کرده و کد رهگیری پستی را به شماره {customerPhone} پیامک خواهد کرد.
              </p>
            </div>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => setIsCheckoutOpen(false)}
            >
              بستن و بازگشت به ویترین
            </Button>
          </div>
        ) : (
          <form onSubmit={handleCompleteOrder} className="space-y-4 text-start">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-300">مبلغ قابل پرداخت:</span>
              <span className="text-emerald-600 font-bold font-mono text-sm tabular-nums">
                {selectedProduct ? formatPrice(selectedProduct.priceToman, 'TOMAN') : '۰'}
              </span>
            </div>

            <Input
              label="نام و نام خانوادگی خریدار"
              placeholder="مثلاً: مریم احمدی"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />

            <Input
              label="شماره موبایل (جهت دریافت پیامک تایید)"
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />

            <Input
              label="آدرس دقیق پستی و کد پستی"
              placeholder="تهران، خیابان ولیعصر، پلاک..."
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              required
            />

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>پرداخت مستقیم از طریق تمامی کارت‌های بانکی عضو شتاب</span>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              leftIcon={<CreditCard className="w-4 h-4" />}
            >
              پرداخت آنلاین و نهایی‌سازی سفارش
            </Button>
          </form>
        )}
      </Modal>

      {/* Storefront Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © 2026 {store.title}
          </div>

          {/* "Powered by BioPay" badge - ONLY shown if plan is NOT PRO */}
          {store.plan !== 'PRO' ? (
            <div className="flex items-center gap-1.5 font-bold text-slate-600 dark:text-slate-400">
              <span>{t('storefront.poweredBy')}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>تسویه امن بانکی و ضمانت تحویل کالا</span>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
