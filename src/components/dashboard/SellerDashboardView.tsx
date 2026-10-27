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
  Menu,
  LayoutDashboard,
  Wallet,
  Settings,
  Gift,
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
import { SellerAnalyticsView } from './SellerAnalyticsView';
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
  const { t, formatPrice, locale, region } = useI18n();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [currentPlan, setCurrentPlan] = useState<'STARTER' | 'PRO'>('PRO');
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

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
    showToast(locale === 'en' ? 'Product added successfully!' : 'محصول جدید با موفقیت به ویترین افزوده شد.');
  };

  const handleUpdateProduct = (updated: ProductItem) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(t('common.savedSuccess'));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(locale === 'en' ? 'Product deleted.' : 'محصول با موفقیت از ویترین حذف شد.');
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
    showToast(`${selectedPlanForZarinpal} ${t('common.active')}`);
  };

  // USDT Activation
  const handleTriggerUsdt = (planName: 'Starter' | 'Pro') => {
    setSelectedPlanForUsdt(planName);
    setIsUsdtModalOpen(true);
  };

  const handleUsdtSuccess = (planName: string) => {
    setCurrentPlan(planName === 'Pro' ? 'PRO' : 'STARTER');
    setIsUsdtModalOpen(false);
    showToast(`${planName} ${t('common.active')}`);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden text-slate-900 dark:text-slate-100 relative max-w-full">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar Navigation */}
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onViewStorefront={onViewStorefront}
        onLogout={onLogout}
        storeSlug={storeInfo.slug}
        storeTitle={storeInfo.title}
      />

      {/* Mobile Drawer Sidebar Navigation */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative z-50 h-full max-w-xs w-full bg-white dark:bg-slate-900 shadow-2xl flex"
            >
              <DashboardSidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onViewStorefront={onViewStorefront}
                onLogout={onLogout}
                storeSlug={storeInfo.slug}
                storeTitle={storeInfo.title}
                isMobileDrawer={true}
                onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full max-w-full">
        {/* Top Bar with Mobile Hamburger, Language Selector, Notifications, and Store Action */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0 gap-3">
          <div className="flex items-center gap-3 text-start truncate">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
              {t('dashboard.title')}
            </h1>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
            <span className="text-xs text-slate-500 font-medium hidden md:inline truncate max-w-xs">
              {storeInfo.title}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyStoreLink}
              leftIcon={<Copy className="w-3.5 h-3.5 text-slate-500" />}
              className="hidden sm:inline-flex text-xs"
            >
              {copiedLink ? t('common.copied') : t('common.copyLink')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onViewStorefront}
              rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              {t('common.viewStore')}
            </Button>

            {/* In-App Notifications Bell */}
            <NotificationDropdown />

            {/* Language Dropdown */}
            <LanguageDropdown />
          </div>
        </header>

        {/* Scrollable View Content - Note pb-28 to avoid overlap with fixed bottom navigation! */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-28 sm:pb-32 space-y-6 max-w-full">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 max-w-full"
            >
              {/* 4 Stat Cards: Stacked 1 col on mobile, 2 on tablet, 4 on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* Stat 1: Revenue */}
                <Card className="p-5 flex items-center justify-between text-start">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-500">
                      {t('dashboard.totalRevenue')}
                    </span>
                    <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                      {region === 'iran' ? '۲۸,۴۵۰,۰۰۰' : '1,420'}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {region === 'iran' ? t('common.currencyToman') : 'USDT'}
                    </div>
                  </div>
                  <CircularProgress
                    percentage={78}
                    size={64}
                    strokeWidth={6}
                    color="#10b981"
                    label="78%"
                  />
                </Card>

                {/* Stat 2: Total Orders */}
                <Card className="p-5 flex items-center justify-between text-start">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-500">
                      {t('dashboard.totalOrders')}
                    </span>
                    <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                      124
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold">+14 this week</div>
                  </div>
                  <CircularProgress
                    percentage={85}
                    size={64}
                    strokeWidth={6}
                    color="#059669"
                    label="85%"
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
                      {currentPlan === 'PRO' ? t('common.active') : '15 max'}
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
                      24
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold">Pro Plan Active</div>
                  </div>
                  <CircularProgress
                    percentage={80}
                    size={64}
                    strokeWidth={6}
                    color="#0ea5e9"
                    label="24d"
                  />
                </Card>
              </div>

              {/* Sales Chart Section */}
              <SalesChart />

              {/* Recent Orders Section */}
              <RecentOrdersTable />
            </motion.div>
          )}

          {/* TAB 1.5: ANALYTICS & VISITOR TRACKING */}
          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-full"
            >
              <SellerAnalyticsView storeSlug={storeInfo.slug || 'tehrano_boutique'} />
            </motion.div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === 'products' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-full"
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
              className="max-w-full"
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
              className="max-w-full"
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
              className="max-w-full"
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
              className="max-w-full"
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
              className="space-y-6 text-start max-w-full"
            >
              {/* Header */}
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-emerald-600 shrink-0" />
                  <span>{t('pricing.title')}</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {t('pricing.subtitle')}
                </p>
              </div>

              {/* 3 Plans Grid (Starter, Pro, Business) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Plan 1: Starter */}
                <Card className={`p-6 space-y-4 relative ${currentPlan === 'STARTER' ? 'ring-2 ring-emerald-500' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('pricing.starterTitle')}</h3>
                      <p className="text-xs text-slate-500">{t('pricing.starterDesc')}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
                    <div className="text-xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
                      {region === 'iran' ? '۵,۰۰۰,۰۰۰ تومان' : '27 USDT'}
                    </div>
                    <div className="text-xs text-slate-400 line-through font-mono">
                      {region === 'iran' ? '۹,۰۰۰,۰۰۰ تومان' : '45 USDT'}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold">
                      {t('pricing.referralCommission')} 10%
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => handleTriggerZarinpal('Starter')}>
                      زرین‌پال (تومان)
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => handleTriggerUsdt('Starter')}>
                      تتر (27 USDT)
                    </Button>
                  </div>
                </Card>

                {/* Plan 2: Pro */}
                <Card className={`p-6 space-y-4 relative border-emerald-500/60 ${currentPlan === 'PRO' ? 'ring-2 ring-emerald-500' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('pricing.proTitle')}</h3>
                      <p className="text-xs text-slate-500">{t('pricing.proDesc')}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
                    <div className="text-xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
                      {region === 'iran' ? '۹,۰۰۰,۰۰۰ تومان' : '52 USDT'}
                    </div>
                    <div className="text-xs text-slate-400 line-through font-mono">
                      {region === 'iran' ? '۱۵,۰۰۰,۰۰۰ تومان' : '80 USDT'}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold">
                      {t('pricing.referralCommission')} 15%
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => handleTriggerZarinpal('Pro')}>
                      زرین‌پال (تومان)
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => handleTriggerUsdt('Pro')}>
                      تتر (52 USDT)
                    </Button>
                  </div>
                </Card>

                {/* Plan 3: Business */}
                <Card className="p-6 space-y-4 relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('pricing.businessTitle')}</h3>
                      <p className="text-xs text-slate-500">{t('pricing.businessDesc')}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
                    <div className="text-xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
                      {region === 'iran' ? '۱۲,۰۰۰,۰۰۰ تومان' : '75 USDT'}
                    </div>
                    <div className="text-xs text-slate-400 line-through font-mono">
                      {region === 'iran' ? '۲۰,۰۰۰,۰۰۰ تومان' : '110 USDT'}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold">
                      {t('pricing.referralCommission')} 20%
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => handleTriggerZarinpal('Pro')}>
                      زرین‌پال (تومان)
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => handleTriggerUsdt('Pro')}>
                      تتر (75 USDT)
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
              className="max-w-full"
            >
              <StoreSettingsView
                onSaveToast={(msg) => {
                  showToast(msg);
                }}
              />
            </motion.div>
          )}
        </div>

        {/* Mobile Fixed Bottom Navigation Bar (Higher z-index z-40, does not overlap content) */}
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around py-2 px-1 shadow-lg"
        >
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center gap-1 p-1 text-[11px] font-semibold transition cursor-pointer ${
              activeTab === 'overview' ? 'text-emerald-600' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>{t('dashboard.overview')}</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex flex-col items-center gap-1 p-1 text-[11px] font-semibold transition cursor-pointer ${
              activeTab === 'products' ? 'text-emerald-600' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Package className="w-5 h-5" />
            <span>{t('dashboard.products')}</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center gap-1 p-1 text-[11px] font-semibold transition cursor-pointer ${
              activeTab === 'orders' ? 'text-emerald-600' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>{t('dashboard.orders')}</span>
          </button>

          <button
            onClick={() => setActiveTab('referral')}
            className={`flex flex-col items-center gap-1 p-1 text-[11px] font-semibold transition cursor-pointer ${
              activeTab === 'referral' ? 'text-emerald-600' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Gift className="w-5 h-5" />
            <span>{t('dashboard.referral')}</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 p-1 text-[11px] font-semibold transition cursor-pointer ${
              activeTab === 'settings' ? 'text-emerald-600' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>{t('dashboard.settings')}</span>
          </button>
        </nav>
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
              {selectedPlanForZarinpal === 'Pro' ? '۹,۰۰۰,۰۰۰ تومان' : '۵,۰۰۰,۰۰۰ تومان'}
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
