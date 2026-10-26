'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings,
  Save,
  CheckCircle2,
  Shield,
  Lock,
  Bell,
  Coins,
  Layers,
  Trash2,
  AlertTriangle,
  Clock,
  RefreshCw,
  UserX,
  Mail,
  Smartphone,
} from 'lucide-react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Badge } from '../../../../components/ui/Badge';
import {
  accountCleanupService,
  InactiveAccountRecord,
  CleanupExecutionReport,
} from '../../../../lib/accountCleanup.service';

export default function AdminSettingsPage() {
  // 3 Plans Management State
  const [plans, setPlans] = useState([
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

  // Gateways & Keys
  const [zarinpalMerchantId, setZarinpalMerchantId] = useState('4ced0a1e-4ad8-4309-9668-3ea3ae8e8897');
  const [isSandbox, setIsSandbox] = useState(true);
  const [usdtMasterWallet, setUsdtMasterWallet] = useState('TLyEzSampleTronGridMasterWalletAddress2026');
  const [telegramChannel, setTelegramChannel] = useState('@BioPay_Settlements');
  const [savedToast, setSavedToast] = useState(false);

  // Inactive Accounts Review & Cleanup
  const [inactiveAccounts, setInactiveAccounts] = useState<InactiveAccountRecord[]>([]);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [cleanupReport, setCleanupReport] = useState<CleanupExecutionReport | null>(null);

  useEffect(() => {
    loadInactiveAccounts();
  }, []);

  const loadInactiveAccounts = async () => {
    const list = await accountCleanupService.getInactiveAccounts();
    setInactiveAccounts(list);
  };

  const handleTriggerCleanup = async () => {
    setIsCleaningUp(true);
    try {
      const report = await accountCleanupService.triggerAccountCleanup();
      setCleanupReport(report);
      await loadInactiveAccounts();
    } catch (err: any) {
      alert(`خطا در پاکسازی: ${err.message}`);
    } finally {
      setIsCleaningUp(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 text-start max-w-5xl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-400" />
            <span>تنظیمات سامانه و مدیریت پلن‌ها و کاربران</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            پیکربندی ۳ پلن اشتراک، پاکسازی خودکار حساب‌های غیرفعال، درگاه شتابی و کریپتو
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Management of 3 Plans */}
        <Card className="p-6 bg-slate-950/80 border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>مدیریت ۳ پلن رسمی اشتراک بایوپی</span>
            </h3>
            <span className="text-xs text-slate-400">فقط ۳ پلن فعال مجاز است</span>
          </div>

          <div className="space-y-6">
            {plans.map((p, idx) => (
              <div
                key={p.slug}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-white text-sm">{p.name}</h4>
                    <span className="text-xs font-mono text-slate-400">({p.durationMonths} ماهه)</span>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={p.isActive}
                      onChange={(e) => {
                        const updated = [...plans];
                        updated[idx].isActive = e.target.checked;
                        setPlans(updated);
                      }}
                      className="rounded border-slate-700 text-emerald-500"
                    />
                    <span>پلن فعال</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">قیمت جدید (تومان)</label>
                    <input
                      type="number"
                      value={p.priceToman}
                      onChange={(e) => {
                        const updated = [...plans];
                        updated[idx].priceToman = parseInt(e.target.value, 10) || 0;
                        setPlans(updated);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">قیمت خط‌خورده قبلی (تومان)</label>
                    <input
                      type="number"
                      value={p.oldPriceToman}
                      onChange={(e) => {
                        const updated = [...plans];
                        updated[idx].oldPriceToman = parseInt(e.target.value, 10) || 0;
                        setPlans(updated);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-rose-300 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">قیمت جدید (USDT)</label>
                    <input
                      type="number"
                      value={p.priceUsdt}
                      onChange={(e) => {
                        const updated = [...plans];
                        updated[idx].priceUsdt = parseFloat(e.target.value) || 0;
                        setPlans(updated);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-emerald-400 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">پورسانت معرف (%)</label>
                    <input
                      type="number"
                      value={p.commissionPercent}
                      onChange={(e) => {
                        const updated = [...plans];
                        updated[idx].commissionPercent = parseFloat(e.target.value) || 0;
                        setPlans(updated);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-amber-400 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Section 2: Inactive Account Cleanup */}
        <Card className="p-6 bg-slate-950/80 border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-400" />
                <span>پاکسازی خودکار حساب‌های غیرفعال (Inactivity Cleanup)</span>
              </h3>
              <p className="text-xs text-slate-400">
                ارسال هشدار SMS/ایمیل پس از ۷ روز عدم فعالیت • حذف دائمی حساب و فروشگاه‌ها پس از ۳۰ روز
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              isLoading={isCleaningUp}
              onClick={handleTriggerCleanup}
              className="border-rose-500/50 text-rose-400 hover:bg-rose-950/30 shrink-0 font-bold"
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              اجرای فوری پاکسازی (Cleanup Now)
            </Button>
          </div>

          {/* Cleanup Execution Live Feedback */}
          {cleanupReport && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>گزارش آخرین پاکسازی انجام شده ({new Date(cleanupReport.timestamp).toLocaleTimeString('fa-IR')}):</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">کاربران بررسی‌شده</span>
                  <span className="font-mono font-bold text-white text-sm">{cleanupReport.totalUsersChecked}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">هشدارهای ارسالی (۷ روز)</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">{cleanupReport.warningDispatchedCount}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">حذف دائمی (۳۰ روز)</span>
                  <span className="font-mono font-bold text-rose-400 text-sm">{cleanupReport.deletedAccountsCount}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">فروشگاه‌های حذف‌شده</span>
                  <span className="font-mono font-bold text-slate-300 text-sm">{cleanupReport.affectedStoresCount}</span>
                </div>
              </div>
            </div>
          )}

          {/* Inactive Accounts Review Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold">کاربر / فروشگاه</th>
                  <th className="pb-3 font-semibold">تماس</th>
                  <th className="pb-3 font-semibold">مدت عدم ورود</th>
                  <th className="pb-3 font-semibold">فروشگاه / محصول</th>
                  <th className="pb-3 font-semibold">وضعیت هشدار و حذف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {inactiveAccounts.map((account) => {
                  const isWarningSent = !!account.warningSentAt;
                  const isPendingDeletion = account.daysInactive >= 30;

                  return (
                    <tr key={account.id} className="hover:bg-slate-900/40">
                      <td className="py-3 font-medium text-white">
                        <div>{account.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{account.id}</div>
                      </td>
                      <td className="py-3 font-mono text-slate-300">
                        {account.phone || account.email}
                      </td>
                      <td className="py-3 font-mono">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            account.daysInactive >= 30
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {account.daysInactive} روز پیش
                        </span>
                      </td>
                      <td className="py-3 text-slate-300">
                        {account.storesCount} فروشگاه ({account.productsCount} محصول)
                      </td>
                      <td className="py-3">
                        {isPendingDeletion ? (
                          <Badge variant="error">آماده حذف دائمی (۳۰+ روز)</Badge>
                        ) : isWarningSent ? (
                          <Badge variant="warning">هشدار ارسال شد (حذف در ۲۳ روز)</Badge>
                        ) : (
                          <Badge variant="neutral">عدم فعالیت (در صف هشدار)</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Section 3: Payment Gateways & Telegram Bot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="p-6 bg-slate-950/80 border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>پیکربندی درگاه شتابی زرین‌پال</span>
            </h3>
            <Input
              label="کد پذیرنده زرین‌پال (Merchant ID)"
              value={zarinpalMerchantId}
              onChange={(e) => setZarinpalMerchantId(e.target.value)}
              className="bg-slate-900 border-slate-700 text-white font-mono"
            />
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isSandbox}
                onChange={(e) => setIsSandbox(e.target.checked)}
                className="rounded border-slate-700 text-emerald-500"
              />
              <span>فعال بودن حالت سندباکس (تست بدون کسر وجه واقعی)</span>
            </label>
          </Card>

          <Card className="p-6 bg-slate-950/80 border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>کیف‌پول مرجع تتر TRC20 (TronGrid)</span>
            </h3>
            <Input
              label="آدرس ولت دریافت واریزی‌های تتری"
              value={usdtMasterWallet}
              onChange={(e) => setUsdtMasterWallet(e.target.value)}
              className="bg-slate-900 border-slate-700 text-white font-mono"
            />
          </Card>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            variant="primary"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3"
            leftIcon={<Save className="w-4 h-4" />}
          >
            ذخیره تمامی تغییرات سامانه
          </Button>
        </div>
      </form>

      <AnimatePresence>
        {savedToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 end-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>تنظیمات سراسری و پلن‌های ۳گانه با موفقیت ذخیره گردید.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
