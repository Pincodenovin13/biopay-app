import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package,
  ShoppingBag,
  CreditCard,
  Plus,
  Search,
  ExternalLink,
  Copy,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Crown,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useI18n } from '../../lib/i18n';
import { DashboardSidebar, DashboardTab } from './DashboardSidebar';
import { SalesChart } from './SalesChart';
import { RecentOrdersTable } from './RecentOrdersTable';
import { ProductManagementView, ProductItem } from './ProductManagementView';
import { CategoryManagementView } from './CategoryManagementView';
import { StoreSettingsView, StoreProfileSettings } from './StoreSettingsView';
import { ReferralView } from './ReferralView';
import { WithdrawalsView } from './WithdrawalsView';
import { NotificationDropdown } from './NotificationDropdown';
import { UsdtPaymentModal } from './UsdtPaymentModal';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { CircularProgress } from '../ui/CircularProgress';
import { LanguageDropdown } from '../ui/LanguageDropdown';

const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod_1',
    title: 'کت تک لینن اورسایز بهاره مدل صبا',
    description: 'پارچه ۱۰۰٪ لینن طبیعی سنگ‌شور شده، بسیار سبک و خنک با تنخور آزاد',
    price: 780000,
    compareAtPrice: 950000,
    stock: 14,
    category: 'کت و مانتو',
    salesCount: 42,
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    id: 'prod_2',
    title: 'شومیز کرپ ژاکارد مجلسی',
    description: 'یقه کراواتی مدرن، آستین مچ‌دار، مناسب مهمانی و دورهمی بهاره',
    price: 520000,
    compareAtPrice: 640000,
    stock: 8,
    category: 'شومیز و بلوز',
    salesCount: 29,
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    id: 'prod_3',
    title: 'شلوار واید بگ تابستانه',
    description: 'کمر کشی کشسانی بالا با دوخت دوبل، پارچه نرم و بادوام',
    price: 440000,
    stock: 22,
    category: 'شلوار',
    salesCount: 35,
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    id: 'prod_4',
    title: 'دورس کتان پنبه سبک بهاره',
    description: 'طرح مینیمال گلدوزی، یقه گرد کشبافت مناسب استایل کژوال',
    price: 610000,
    compareAtPrice: 750000,
    stock: 5,
    category: 'دورس و سویشرت',
    salesCount: 18,
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
    isActive: true,
  },
];

interface SellerDashboardViewProps {
  onViewStorefront: () => void;
  onLogout: () => void;
}

export function SellerDashboardView({ onViewStorefront, onLogout }: SellerDashboardViewProps) {
  const { t, formatPrice } = useI18n();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [currentPlan, setCurrentPlan] = useState<'STARTER' | 'PRO'>('PRO');
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Payment upgrade modals
  const [isUsdtModalOpen, setIsUsdtModalOpen] = useState(false);
  const [selectedPlanForUsdt, setSelectedPlanForUsdt] = useState<'Starter' | 'Pro'>('Pro');
  const [isZarinpalModalOpen, setIsZarinpalModalOpen] = useState(false);
  const [selectedPlanForZarinpal, setSelectedPlanForZarinpal] = useState<'Starter' | 'Pro'>('Pro');

  // Store information
  const [storeInfo, setStoreInfo] = useState<StoreProfileSettings>({
    title: 'بوتیک لباس و مد تهرانو',
    slug: 'tehrano_boutique',
    bio: 'جدیدترین کالکشن مانتو و لباس‌های مجلسی بهاره با تضمین کیفیت و ارسال سریع به سراسر ایران',
    industry: 'پوشاک و مد بانوان',
    whatsappNumber: '09121112233',
    telegramHandle: 'tehran_boutique',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyStoreLink = () => {
    navigator.clipboard?.writeText(`https://biopay.me/s/${storeInfo.slug}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Products CRUD
  const handleAddProduct = (newProd: Omit<ProductItem, 'id' | 'salesCount'>) => {
    const created: ProductItem = {
      ...newProd,
      id: `prod_${Date.now()}`,
      salesCount: 0,
    };
    setProducts((prev) => [created, ...prev]);
    showToast('محصول جدید با موفقیت به ویترین افزوده شد.');
  };

  const handleUpdateProduct = (updated: ProductItem) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast('تغییرات محصول با موفقیت ذخیره شد.');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('محصول با موفقیت از ویترین حذف شد.');
  };

  // Zarinpal Sandbox Activation
  const handleTriggerZarinpal = (planName: 'Starter' | 'Pro') => {
    setSelectedPlanForZarinpal(planName);
    setIsZarinpalModalOpen(true);
  };

  const handleCompleteZarinpal = () => {
    setCurrentPlan(selectedPlanForZarinpal === 'Pro' ? 'PRO' : 'STARTER');
    setIsZarinpalModalOpen(false);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    showToast(`پلن ${selectedPlanForZarinpal} از درگاه زرین‌پال با موفقیت فعال شد!`);
  };

  // USDT Activation
  const handleTriggerUsdt = (planName: 'Starter' | 'Pro') => {
    setSelectedPlanForUsdt(planName);
    setIsUsdtModalOpen(true);
  };

  const handleUsdtSuccess = (planName: string) => {
    setCurrentPlan(planName === 'Pro' ? 'PRO' : 'STARTER');
    setIsUsdtModalOpen(false);
    showToast(`پلن ${planName} از طریق واریز تتر (USDT TRC20) تایید و فعال شد!`);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden text-slate-900 dark:text-slate-100">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onViewStorefront={onViewStorefront}
        onLogout={onLogout}
        storeSlug={storeInfo.slug}
        storeTitle={storeInfo.title}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Bar with Language Selector, Notifications, and Store Action */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 text-start">
            <h1 className="text-base font-bold text-slate-900 dark:text-white">
              {t('dashboard.title')}
            </h1>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-xs text-slate-500 font-medium">
              {storeInfo.title}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
              <Crown className="w-3 h-3 text-amber-500" />
              <span>پلن {currentPlan === 'PRO' ? 'پرو' : 'استارتر'}</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyStoreLink}
              leftIcon={<Copy className="w-3.5 h-3.5 text-slate-500" />}
            >
              {copiedLink ? t('common.copied') : t('common.copyLink')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onViewStorefront}
              rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
            >
              {t('common.viewStore')}
            </Button>

            {/* In-App Notifications Bell */}
            <NotificationDropdown />

            {/* Language Dropdown */}
            <LanguageDropdown />
          </div>
        </header>

        {/* Scrollable View Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* 4 Circular Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Stat 1: Revenue */}
                <Card className="p-5 flex items-center justify-between text-start">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-500">
                      {t('dashboard.totalRevenue')}
                    </span>
                    <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                      ۲۸,۴۵۰,۰۰۰
                    </div>
                    <div className="text-[11px] text-slate-500">{t('common.currencyToman')}</div>
                  </div>
                  <CircularProgress
                    percentage={78}
                    size={64}
                    strokeWidth={6}
                    color="#10b981"
                    label="۷۸٪"
                  />
                </Card>

                {/* Stat 2: Total Orders */}
                <Card className="p-5 flex items-center justify-between text-start">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-500">
                      {t('dashboard.totalOrders')}
                    </span>
                    <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                      ۱۲۴
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold">+۱۴ این هفته</div>
                  </div>
                  <CircularProgress
                    percentage={85}
                    size={64}
                    strokeWidth={6}
                    color="#059669"
                    label="۸۵٪"
                  />
                </Card>

                {/* Stat 3: Active Products */}
                <Card className="p-5 flex items-center justify-between text-start">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-500">
                      {t('dashboard.activeProducts')}
                    </span>
                    <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                      {products.length}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {currentPlan === 'PRO' ? 'ظرفیت نامحدود' : 'از ۱۵ مجاز'}
                    </div>
                  </div>
                  <CircularProgress
                    percentage={Math.min(100, Math.round((products.length / 15) * 100))}
                    size={64}
                    strokeWidth={6}
                    color="#f59e0b"
                    label={`${products.length}/15`}
                  />
                </Card>

                {/* Stat 4: Plan Days Left */}
                <Card className="p-5 flex items-center justify-between text-start">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-500">
                      {t('dashboard.planDaysLeft')}
                    </span>
                    <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                      ۲۴ روز
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold">اشتراک حرفه‌ای فعال</div>
                  </div>
                  <CircularProgress
                    percentage={80}
                    size={64}
                    strokeWidth={6}
                    color="#0ea5e9"
                    label="۲۴"
                  />
                </Card>
              </div>

              {/* Sales Chart Section */}
              <SalesChart />

              {/* Recent Orders Section */}
              <RecentOrdersTable />
            </motion.div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === 'products' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProductManagementView
                products={products}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                onUpgradePlan={() => setActiveTab('plan')}
                plan={currentPlan}
              />
            </motion.div>
          )}

          {/* TAB 3: CATEGORIES */}
          {activeTab === 'categories' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CategoryManagementView />
            </motion.div>
          )}

          {/* TAB 4: ORDERS */}
          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <RecentOrdersTable />
            </motion.div>
          )}

          {/* TAB 5: WITHDRAWALS */}
          {activeTab === 'withdrawals' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <WithdrawalsView />
            </motion.div>
          )}

          {/* TAB 6: REFERRAL & PARTNER PROGRAM */}
          {activeTab === 'referral' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ReferralView
                onOpenWithdrawalModal={() => setActiveTab('withdrawals')}
                onOpenRenewalModal={() => {
                  setSelectedPlanForUsdt('Starter');
                  setIsUsdtModalOpen(true);
                }}
              />
            </motion.div>
          )}

          {/* TAB 7: PLAN & BILLING */}
          {activeTab === 'plan' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 text-start"
            >
              {/* Header */}
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-emerald-600" />
                  <span>طرح‌های اشتراک و تمدید حساب</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  پشتیبانی از پرداخت آنلاین شتابی زرین‌پال و ارز دیجیتال تتر (USDT TRC20)
                </p>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Plan 1: Starter */}
                <Card className={`p-6 space-y-5 relative ${currentPlan === 'STARTER' ? 'ring-2 ring-emerald-500' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">پلن استارتر (Starter)</h3>
                      <p className="text-xs text-slate-500">مناسب پیج‌های تازه تاسیس و فروشگاه‌های خرد</p>
                    </div>
                    {currentPlan === 'STARTER' && <Badge variant="success">پلن فعال شما</Badge>}
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
                    <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
                      ۹,۰۰۰,۰۰۰ <span className="text-xs font-normal text-slate-500">تومان سالانه</span>
                    </div>
                    <div className="text-xs font-bold text-teal-600 font-mono">
                      معادل: 26 USDT (TRC20)
                    </div>
                    <div className="text-[11px] text-slate-400">کمیسیون معرف: ۱۰٪ (۹۰۰,۰۰۰ تومان / 2.6 USDT)</div>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>حداکثر ۱۵ محصول همزمان در ویترین</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>تا ۳ تصویر با فرمت WebP برای هر محصول</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>لینک مستقیم سفارش در واتساپ و تلگرام</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>تسویه حساب هفتگی بانکی هر جمعه</span>
                    </li>
                  </ul>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTriggerZarinpal('Starter')}
                    >
                      پرداخت شتاب (زرین‌پال)
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleTriggerUsdt('Starter')}
                    >
                      پرداخت تتر (26 USDT)
                    </Button>
                  </div>
                </Card>

                {/* Plan 2: Pro */}
                <Card className={`p-6 space-y-5 relative border-emerald-500/50 bg-linear-to-b from-white to-emerald-50/20 dark:from-slate-900 dark:to-emerald-950/20 ${currentPlan === 'PRO' ? 'ring-2 ring-emerald-500' : ''}`}>
                  <div className="absolute top-4 end-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-white flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-3 h-3" />
                      پیشنهاد ویژه
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">پلن حرفه‌ای (Pro)</h3>
                      <p className="text-xs text-slate-500">برای آنلاین‌شاپ‌های پرفروش اینستاگرام</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-emerald-200 dark:border-emerald-800 space-y-1">
                    <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
                      ۱۲,۰۰۰,۰۰۰ <span className="text-xs font-normal text-slate-500">تومان سالانه</span>
                    </div>
                    <div className="text-xs font-bold text-teal-600 font-mono">
                      معادل: 53 USDT (TRC20)
                    </div>
                    <div className="text-[11px] text-slate-400">کمیسیون معرف: ۱۵٪ (۱,۸۰۰,۰۰۰ تومان / 7.95 USDT)</div>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="font-bold text-slate-900 dark:text-white">تعداد نامحدود محصولات در ویترین</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>تا ۵ تصویر فوق‌سریع WebP برای هر کالا</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>حذف نشان "Powered by BioPay" از فوتر</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>دسترسی کامل به درگاه پرداخت مستقیم آنلاین</span>
                    </li>
                  </ul>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTriggerZarinpal('Pro')}
                    >
                      پرداخت شتاب (زرین‌پال)
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleTriggerUsdt('Pro')}
                    >
                      پرداخت تتر (53 USDT)
                    </Button>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {/* TAB 8: SETTINGS */}
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <StoreSettingsView
                onSaveToast={(msg) => {
                  showToast(msg);
                }}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* USDT Payment Modal */}
      <UsdtPaymentModal
        isOpen={isUsdtModalOpen}
        onClose={() => setIsUsdtModalOpen(false)}
        planName={selectedPlanForUsdt}
        onPlanActivated={handleUsdtSuccess}
      />

      {/* Zarinpal Sandbox Modal */}
      <Modal
        isOpen={isZarinpalModalOpen}
        onClose={() => setIsZarinpalModalOpen(false)}
        title="درگاه پرداخت زرین‌پال (Sandbox)"
        description={`پرداخت امن شتاب برای فعال‌سازی پلن ${selectedPlanForZarinpal}`}
        maxWidth="md"
      >
        <div className="space-y-4 text-start">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs space-y-1">
            <div className="font-bold text-amber-900 dark:text-amber-200">محیط سندباکس زرین‌پال (تست)</div>
            <p className="text-amber-800 dark:text-amber-300">
              این تراکنش در محیط آزمایشی زرین‌پال شبیه‌سازی می‌شود و مستقیماً تایید می‌گردد.
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between text-xs font-semibold">
            <span>مبلغ قابل پرداخت:</span>
            <span className="text-emerald-600 font-mono text-base font-bold tabular-nums">
              {selectedPlanForZarinpal === 'Pro' ? '۱۲,۰۰۰,۰۰۰ تومان' : '۹,۰۰۰,۰۰۰ تومان'}
            </span>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>اتصال امن شاپرک به تمامی کارت‌های بانکی عضو شبکه شتاب ایران</span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setIsZarinpalModalOpen(false)}>
              انصراف
            </Button>
            <Button variant="primary" onClick={handleCompleteZarinpal}>
              تایید و پرداخت در زرین‌پال
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
