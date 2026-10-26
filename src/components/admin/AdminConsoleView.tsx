import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  Users,
  Store,
  CreditCard,
  Send,
  Upload,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  Search,
  Trash2,
  RefreshCw,
  AlertTriangle,
  Sliders,
  DollarSign,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { LanguageDropdown } from '../ui/LanguageDropdown';
import { telegramBot } from '../../lib/telegram';
import { runInactiveAccountCleanup } from '../../lib/accountCleanup.service';

interface AdminConsoleViewProps {
  onExitAdmin: () => void;
}

interface PlanConfig {
  slug: string;
  name: string;
  durationMonths: number;
  priceToman: number;
  oldPriceToman: number;
  priceUsdt: number;
  oldPriceUsdt: number;
  commissionPercent: number;
  isActive: boolean;
}

export function AdminConsoleView({ onExitAdmin }: AdminConsoleViewProps) {
  const { t, locale } = useI18n();
  const [activeTab, setActiveTab] = useState<'overview' | 'merchants' | 'withdrawals' | 'plans' | 'cleanup'>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCleaning, setIsCleaning] = useState(false);

  // 3 Primary Plans config
  const [plans, setPlans] = useState<PlanConfig[]>([
    {
      slug: 'starter',
      name: 'استارتر (Starter)',
      durationMonths: 1,
      priceToman: 5_000_000,
      oldPriceToman: 9_000_000,
      priceUsdt: 27,
      oldPriceUsdt: 45,
      commissionPercent: 10,
      isActive: true,
    },
    {
      slug: 'pro',
      name: 'حرفه‌ای (Pro)',
      durationMonths: 2,
      priceToman: 9_000_000,
      oldPriceToman: 15_000_000,
      priceUsdt: 52,
      oldPriceUsdt: 80,
      commissionPercent: 15,
      isActive: true,
    },
    {
      slug: 'business',
      name: 'سازمانی (Business)',
      durationMonths: 3,
      priceToman: 12_000_000,
      oldPriceToman: 20_000_000,
      priceUsdt: 75,
      oldPriceUsdt: 110,
      commissionPercent: 20,
      isActive: true,
    },
  ]);

  // Sample Merchant data
  const [merchants, setMerchants] = useState([
    { id: '1', name: 'مریم رضایی', store: 'tehrano_boutique', gmv: 48500000, orders: 94, status: 'ACTIVE' },
    { id: '2', name: 'امیرحسین کریمی', store: 'cafe_accessory', gmv: 92300000, orders: 162, status: 'ACTIVE' },
    { id: '3', name: 'سارا باقری', store: 'aria_silver', gmv: 24100000, orders: 38, status: 'ACTIVE' },
    { id: '4', name: 'کامیار صبوحی', store: 'techno_now', gmv: 11000000, orders: 19, status: 'SUSPENDED' },
  ]);

  // Sample Inactive Accounts
  const [inactiveAccounts, setInactiveAccounts] = useState([
    { id: 'usr_inact_01', name: 'حسین مرادی', phone: '09351112233', role: 'SELLER', daysInactive: 8, warningSent: true },
    { id: 'usr_inact_02', name: 'مهسا کاظمی', phone: '09194445566', role: 'USER', daysInactive: 14, warningSent: true },
    { id: 'usr_inact_03', name: 'پیمان یوسفی', phone: '09127778899', role: 'SELLER', daysInactive: 31, warningSent: true },
  ]);

  // Sample Payouts
  const [withdrawals, setWithdrawals] = useState([
    { id: 'w1', name: 'مریم رضایی', amount: 14200000, sheba: 'IR820120000000001234567890', bank: 'بانک ملت', status: 'PENDING' },
    { id: 'w2', name: 'امیرحسین کریمی', amount: 35000000, sheba: 'IR560560000000009876543210', bank: 'بانک سامان', status: 'PENDING' },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApprovePayout = async (id: string, name: string, amount: number) => {
    const tracking = `PAYA-${Math.floor(1000000 + Math.random() * 9000000)}`;
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: 'SETTLED' } : w))
    );
    await telegramBot.broadcastWeeklyPayoutNotice({
      payoutId: id,
      sellerName: name,
      storeSlug: 'tehrano_boutique',
      amountToman: amount,
      shebaMasked: 'IR82...7890',
      bankName: 'بانک ملت',
      trackingNumber: tracking,
      payoutDate: new Date().toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'en-US'),
    });
    showToast(`تسویه انجام شد و اطلاعیه در کانال منتشر گردید (${tracking})`);
  };

  const handleTriggerCleanup = async () => {
    setIsCleaning(true);
    try {
      const result = await runInactiveAccountCleanup();
      // Remove accounts > 30 days
      setInactiveAccounts((prev) => prev.filter((acc) => acc.daysInactive <= 30));
      showToast(`${t('admin.cleanupSuccess')} (${result.deletedAccountsCount} حساب حذف شد)`);
    } catch {
      showToast('عملیات با خطا مواجه شد');
    } finally {
      setIsCleaning(false);
    }
  };

  const handleTogglePlan = (slug: string) => {
    setPlans((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, isActive: !p.isActive } : p))
    );
    showToast('وضعیت فعال بودن پلن به‌روز شد.');
  };

  const handlePriceChange = (slug: string, field: 'priceToman' | 'oldPriceToman' | 'priceUsdt' | 'oldPriceUsdt', val: number) => {
    setPlans((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, [field]: val } : p))
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between text-start max-w-full overflow-x-hidden">
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

      {/* Admin Protected Header */}
      <header className="h-16 bg-slate-950 border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">{t('admin.title')}</h1>
            <div className="text-[10px] text-slate-400 font-mono">{t('admin.isolatedNotice')}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onExitAdmin}
            leftIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            {t('admin.exitHome')}
          </Button>
          <LanguageDropdown />
        </div>
      </header>

      {/* Main Admin Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0 ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {t('admin.tabOverview')}
          </button>
          <button
            onClick={() => setActiveTab('merchants')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0 ${
              activeTab === 'merchants'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {t('admin.tabMerchants')}
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0 ${
              activeTab === 'withdrawals'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {t('admin.tabWithdrawals')}
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'plans'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{t('admin.tabPlans')}</span>
          </button>
          <button
            onClick={() => setActiveTab('cleanup')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'cleanup'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t('admin.tabCleanup')}</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-xs text-slate-400">{t('admin.totalGmv')}</span>
                <div className="text-2xl font-black text-white font-mono tabular-nums">
                  ۱۷۵,۹۰۰,۰۰۰ تومان
                </div>
                <div className="text-xs text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+۲۴.۵٪ نسبت به ماه قبل</span>
                </div>
              </div>

              <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-xs text-slate-400">{t('admin.activeMerchants')}</span>
                <div className="text-2xl font-black text-white font-mono tabular-nums">
                  {merchants.length} فروشگاه
                </div>
                <div className="text-xs text-slate-400">۱۰۰٪ احراز هویت پیامکی</div>
              </div>

              <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-xs text-slate-400">{t('admin.pendingWithdrawals')}</span>
                <div className="text-2xl font-black text-amber-400 font-mono tabular-nums">
                  {withdrawals.filter((w) => w.status === 'PENDING').length} درخواست
                </div>
                <div className="text-xs text-slate-400">مجموع: ۴۹,۲۰۰,۰۰۰ تومان</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Merchants */}
        {activeTab === 'merchants' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 font-bold text-sm text-white">
              {t('admin.tabMerchants')}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">نام فروشنده</th>
                    <th className="p-3.5">آدرس فروشگاه</th>
                    <th className="p-3.5">فروش کل</th>
                    <th className="p-3.5">سفارش‌ها</th>
                    <th className="p-3.5">وضعیت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {merchants.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-900/50">
                      <td className="p-3.5 font-bold text-white">{m.name}</td>
                      <td className="p-3.5 font-mono text-emerald-400">biopay.me/s/{m.store}</td>
                      <td className="p-3.5 font-mono tabular-nums">{m.gmv.toLocaleString(locale === 'fa' ? 'fa-IR' : 'en-US')} تومان</td>
                      <td className="p-3.5 font-mono tabular-nums">{m.orders}</td>
                      <td className="p-3.5">
                        <Badge variant={m.status === 'ACTIVE' ? 'success' : 'error'}>
                          {m.status === 'ACTIVE' ? 'فعال' : 'معلق'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Withdrawals */}
        {activeTab === 'withdrawals' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 font-bold text-sm text-white">
              {t('admin.tabWithdrawals')}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">فروشنده</th>
                    <th className="p-3.5">مبلغ درخواستی</th>
                    <th className="p-3.5">شماره شبا و بانک</th>
                    <th className="p-3.5">وضعیت</th>
                    <th className="p-3.5 text-end">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {withdrawals.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-900/50">
                      <td className="p-3.5 font-bold text-white">{w.name}</td>
                      <td className="p-3.5 font-mono tabular-nums text-emerald-400 font-bold">
                        {w.amount.toLocaleString(locale === 'fa' ? 'fa-IR' : 'en-US')} تومان
                      </td>
                      <td className="p-3.5 font-mono">
                        <div>{w.sheba}</div>
                        <div className="text-slate-400 text-[11px]">{w.bank}</div>
                      </td>
                      <td className="p-3.5">
                        <Badge variant={w.status === 'SETTLED' ? 'success' : 'warning'}>
                          {w.status === 'SETTLED' ? 'تسویه شده' : 'در صف پایا'}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-end">
                        {w.status === 'PENDING' ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleApprovePayout(w.id, w.name, w.amount)}
                          >
                            تایید و انتشار فیش در تلگرام
                          </Button>
                        ) : (
                          <span className="text-emerald-400 font-semibold flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>تسویه شده</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Plans Management (PART 9) */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{t('admin.plansManagement')}</h3>
                <p className="text-xs text-slate-400 mt-0.5">ویرایش قیمت‌های تومانی و تتری، قیمت‌های خط خورده و وضعیت فعال بودن</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((p) => (
                <Card key={p.slug} className="p-6 bg-slate-950 border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{p.name}</span>
                    <button
                      onClick={() => handleTogglePlan(p.slug)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition ${
                        p.isActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {p.isActive ? 'فعال' : 'غیرفعال'}
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">قیمت جدید (تومان):</label>
                      <input
                        type="number"
                        value={p.priceToman}
                        onChange={(e) => handlePriceChange(p.slug, 'priceToman', Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">قیمت قدیم خط‌خورده (تومان):</label>
                      <input
                        type="number"
                        value={p.oldPriceToman}
                        onChange={(e) => handlePriceChange(p.slug, 'oldPriceToman', Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-slate-400 block mb-1">USDT جدید:</label>
                        <input
                          type="number"
                          value={p.priceUsdt}
                          onChange={(e) => handlePriceChange(p.slug, 'priceUsdt', Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">USDT قدیم:</label>
                        <input
                          type="number"
                          value={p.oldPriceUsdt}
                          onChange={(e) => handlePriceChange(p.slug, 'oldPriceUsdt', Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white font-mono"
                        />
                      </div>
                    </div>
                    <div className="text-emerald-400 font-mono text-[11px] pt-1">
                      کمیسیون معرف: {p.commissionPercent}٪
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Inactive Accounts Cleanup (PART 9) */}
        {activeTab === 'cleanup' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden space-y-4 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span>{t('admin.inactiveAccounts')}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  هشدار پیامکی در روز ۷ (حذف در ۲۳ روز آینده) و حذف دائم در روز ۳۰ عدم فعالیت
                </p>
              </div>

              <Button
                variant="primary"
                onClick={handleTriggerCleanup}
                isLoading={isCleaning}
                leftIcon={<RefreshCw className="w-4 h-4" />}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                {t('admin.cleanupNow')}
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">شناسه و نام</th>
                    <th className="p-3.5">شماره موبایل</th>
                    <th className="p-3.5">نقش</th>
                    <th className="p-3.5">روزهای عدم فعالیت</th>
                    <th className="p-3.5">وضعیت هشدار ۷ روز</th>
                    <th className="p-3.5 text-end">وضعیت پاکسازی</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {inactiveAccounts.map((acc) => (
                    <tr key={acc.id} className="hover:bg-slate-900/50">
                      <td className="p-3.5 font-bold text-white">{acc.name}</td>
                      <td className="p-3.5 font-mono text-slate-300">{acc.phone}</td>
                      <td className="p-3.5">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                          {acc.role}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-amber-400">
                        {acc.daysInactive} روز
                      </td>
                      <td className="p-3.5 text-emerald-400">
                        {acc.warningSent ? '✓ ارسال شده' : '—'}
                      </td>
                      <td className="p-3.5 text-end">
                        {acc.daysInactive >= 30 ? (
                          <span className="text-rose-400 font-bold text-[11px] bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">
                            آماده حذف دائم
                          </span>
                        ) : (
                          <span className="text-amber-400 text-[11px]">
                            {30 - acc.daysInactive} روز تا حذف
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        {t('admin.footerNotice')}
      </footer>
    </div>
  );
}
