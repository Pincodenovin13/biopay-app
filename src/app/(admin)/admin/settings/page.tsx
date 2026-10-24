'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Save, CheckCircle2, Shield, Lock, Bell, Coins } from 'lucide-react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';

export default function AdminSettingsPage() {
  const [starterCommission, setStarterCommission] = useState('10');
  const [proCommission, setProCommission] = useState('15');
  const [zarinpalMerchantId, setZarinpalMerchantId] = useState('4ced0a1e-4ad8-4309-9668-3ea3ae8e8897');
  const [isSandbox, setIsSandbox] = useState(true);
  const [usdtMasterWallet, setUsdtMasterWallet] = useState('TLyEzSampleTronGridMasterWalletAddress2026');
  const [telegramChannel, setTelegramChannel] = useState('@BioPay_Settlements');
  const [savedToast, setSavedToast] = useState(false);

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
      className="space-y-6 text-start max-w-4xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-400" />
            <span>تنظیمات سراسری سامانه بایوپی</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            پیکربندی درگاه‌های بانکی، کارمزد همکاران، کیف‌پول ارزی و اعلان‌های تلگرام
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Referral Commissions */}
        <Card className="p-6 bg-slate-950/80 border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Coins className="w-4 h-4 text-emerald-400" />
            <span>نرخ کمیسیون برنامه همکاری و ارجاع (Referral Program)</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="درصد کمیسیون پلن استارتر (Starter)"
              type="number"
              value={starterCommission}
              onChange={(e) => setStarterCommission(e.target.value)}
              className="bg-slate-900 border-slate-700 text-white"
            />
            <Input
              label="درصد کمیسیون پلن حرفه‌ای (Pro)"
              type="number"
              value={proCommission}
              onChange={(e) => setProCommission(e.target.value)}
              className="bg-slate-900 border-slate-700 text-white"
            />
          </div>
        </Card>

        {/* Payment Gateways */}
        <Card className="p-6 bg-slate-950/80 border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-400" />
            <span>پیکربندی درگاه پرداخت شتابی (Zarinpal)</span>
          </h3>
          <div className="space-y-4">
            <Input
              label="کد پذیرنده زرین‌پال (Merchant ID)"
              value={zarinpalMerchantId}
              onChange={(e) => setZarinpalMerchantId(e.target.value)}
              className="bg-slate-900 border-slate-700 text-white font-mono"
            />
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isSandbox}
                onChange={(e) => setIsSandbox(e.target.checked)}
                className="rounded border-slate-700 text-rose-600 focus:ring-rose-500"
              />
              <span>فعال‌بودن حالت سندباکس و آزمایشی (Sandbox) جهت تست بدون کسر وجه واقعی</span>
            </label>
          </div>
        </Card>

        {/* Crypto TronGrid */}
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

        {/* Telegram Bot */}
        <Card className="p-6 bg-slate-950/80 border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <span>بات اطلاع‌رسانی تلگرام</span>
          </h3>
          <Input
            label="آیدی کانال رسمی پخش اطلاعیه‌های تسویه"
            value={telegramChannel}
            onChange={(e) => setTelegramChannel(e.target.value)}
            className="bg-slate-900 border-slate-700 text-white font-mono"
          />
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            className="bg-rose-600 hover:bg-rose-700 text-white"
            leftIcon={<Save className="w-4 h-4" />}
          >
            ذخیره تغییرات پیکربندی
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
            <span>تنظیمات سراسری سامانه با موفقیت ذخیره گردید.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
