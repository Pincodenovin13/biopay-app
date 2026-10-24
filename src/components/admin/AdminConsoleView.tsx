import React, { useState } from 'react';
import { motion } from 'motion/react';
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
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { LanguageDropdown } from '../ui/LanguageDropdown';
import { telegramBot } from '../../lib/telegram';

interface AdminConsoleViewProps {
  onExitAdmin: () => void;
}

export function AdminConsoleView({ onExitAdmin }: AdminConsoleViewProps) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'overview' | 'merchants' | 'withdrawals' | 'telegram'>('overview');
  const [adminAuthPassed, setAdminAuthPassed] = useState(true);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Sample Merchant data
  const [merchants, setMerchants] = useState([
    { id: '1', name: 'مریم رضایی', store: 'tehrano_boutique', gmv: 48500000, orders: 94, status: 'ACTIVE' },
    { id: '2', name: 'امیرحسین کریمی', store: 'cafe_accessory', gmv: 92300000, orders: 162, status: 'ACTIVE' },
    { id: '3', name: 'سارا باقری', store: 'aria_silver', gmv: 24100000, orders: 38, status: 'ACTIVE' },
    { id: '4', name: 'کامیار صبوحی', store: 'techno_now', gmv: 11000000, orders: 19, status: 'SUSPENDED' },
  ]);

  // Sample Payouts
  const [withdrawals, setWithdrawals] = useState([
    { id: 'w1', name: 'مریم رضایی', amount: 14200000, sheba: 'IR820120000000001234567890', bank: 'بانک ملت', status: 'PENDING' },
    { id: 'w2', name: 'امیرحسین کریمی', amount: 35000000, sheba: 'IR560560000000009876543210', bank: 'بانک سامان', status: 'PENDING' },
  ]);

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
      payoutDate: new Date().toLocaleDateString('fa-IR'),
    });
    alert(`تسویه انجام شد و اطلاعیه در کانال تلگرام منتشر گردید (پیگیری: ${tracking})`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between text-start">
      {/* Admin Protected Header */}
      <header className="h-16 bg-slate-950 border-b border-slate-800 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">سامانه مدیریت ارشد بایوپی (Super Admin)</h1>
            <div className="text-[10px] text-slate-400 font-mono">ایزوله شده از صفحات عمومی</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onExitAdmin}
            leftIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            خروج به صفحه اصلی
          </Button>
          <LanguageDropdown />
        </div>
      </header>

      {/* Main Admin Area */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            داشبورد کلی
          </button>
          <button
            onClick={() => setActiveTab('merchants')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'merchants'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            فروشندگان
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'withdrawals'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            صف تسویه پایا
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-xs text-slate-400">گردش مالی کل پردازش‌شده</span>
                <div className="text-2xl font-black text-white font-mono tabular-nums">
                  ۱۷۵,۹۰۰,۰۰۰ تومان
                </div>
                <div className="text-xs text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+۲۴.۵٪ نسبت به ماه قبل</span>
                </div>
              </div>

              <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-xs text-slate-400">فروشندگان فعال</span>
                <div className="text-2xl font-black text-white font-mono tabular-nums">
                  {merchants.length} فروشگاه
                </div>
                <div className="text-xs text-slate-400">۱۰۰٪ احراز هویت پیامکی</div>
              </div>

              <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-xs text-slate-400">تسویه‌های در انتظار پایا</span>
                <div className="text-2xl font-black text-amber-400 font-mono tabular-nums">
                  {withdrawals.filter((w) => w.status === 'PENDING').length} درخواست
                </div>
                <div className="text-xs text-slate-400">مجموع: ۴۹,۲۰۰,۰۰۰ تومان</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'merchants' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 font-bold text-sm text-white">
              فهرست فروشندگان ثبت‌شده در سامانه
            </div>
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
                    <td className="p-3.5 font-mono tabular-nums">{m.gmv.toLocaleString('fa-IR')} تومان</td>
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
        )}

        {activeTab === 'withdrawals' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 font-bold text-sm text-white">
              درخواست‌های تسویه حساب بانکی پایا
            </div>
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
                      {w.amount.toLocaleString('fa-IR')} تومان
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
        )}
      </main>

      <footer className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        سیستم مدیریت متمرکز BioPay · دسترسی منحصر به مدیران ارشد مجاز
      </footer>
    </div>
  );
}
