import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Wallet,
  ArrowDownLeft,
  Building2,
  Coins,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  ShieldCheck,
  Send,
  Calendar,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

export interface WithdrawalRecord {
  id: string;
  method: 'SHABA' | 'USDT_TRC20';
  amount: number;
  currency: 'TOMAN' | 'USDT';
  fee: number;
  destination: string;
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';
  createdAt: string;
  adminNote?: string;
  txHash?: string;
}

const INITIAL_WITHDRAWALS: WithdrawalRecord[] = [
  {
    id: 'w_1',
    method: 'SHABA',
    amount: 7200000,
    currency: 'TOMAN',
    fee: 0,
    destination: 'IR580120000000012345678901',
    status: 'PAID',
    createdAt: '1403/07/26',
    adminNote: 'واریز شد - کد پیگیری پایا: 9812401',
  },
  {
    id: 'w_2',
    method: 'USDT_TRC20',
    amount: 45,
    currency: 'USDT',
    fee: 1,
    destination: 'TQj8e9m3Kz7L9uA2Qc5xP1s4Z9w8v7b6a',
    status: 'PAID',
    createdAt: '1403/07/19',
    adminNote: 'ارسال شد روی ترون گرید',
    txHash: 'e6b4...d901',
  },
  {
    id: 'w_3',
    method: 'SHABA',
    amount: 5400000,
    currency: 'TOMAN',
    fee: 0,
    destination: 'IR580120000000012345678901',
    status: 'PENDING',
    createdAt: '1403/08/02',
    adminNote: 'در صف تسویه جمعه پیش‌رو ساعت ۱۴:۰۰',
  },
];

export function WithdrawalsView() {
  const { t, formatPrice, formatDate } = useI18n();

  const [availableToman, setAvailableToman] = useState(12800000);
  const [availableUsdt, setAvailableUsdt] = useState(64.5);

  const [method, setMethod] = useState<'SHABA' | 'USDT_TRC20'>('SHABA');
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');
  const [history, setHistory] = useState<WithdrawalRecord[]>(INITIAL_WITHDRAWALS);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [telegramNotified, setTelegramNotified] = useState(false);

  const minToman = 5000000;
  const minUsdt = 5;
  const usdtFee = 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setTelegramNotified(false);

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('لطفاً مبلغ معتبری وارد نمایید.');
      return;
    }

    if (method === 'SHABA') {
      if (numAmount < minToman) {
        setError(`حداقل مبلغ برداشت تومانی ۵,۰۰۰,۰۰۰ تومان است.`);
        return;
      }
      if (numAmount > availableToman) {
        setError('موجودی تومانی شما برای این مبلغ کافی نیست.');
        return;
      }
      const cleanShaba = destination.trim().toUpperCase();
      if (!cleanShaba.startsWith('IR') || cleanShaba.length < 26) {
        setError('شماره شبا باید با IR شروع شده و ۲۶ کاراکتر باشد (مثال: IR580120000000012345678901)');
        return;
      }

      const newRec: WithdrawalRecord = {
        id: `w_${Date.now()}`,
        method: 'SHABA',
        amount: numAmount,
        currency: 'TOMAN',
        fee: 0,
        destination: cleanShaba,
        status: 'PENDING',
        createdAt: 'امروز',
        adminNote: 'ثبت شد؛ در نوبت تسویه گروهی جمعه ساعت ۱۴:۰۰',
      };

      setAvailableToman((prev) => prev - numAmount);
      setHistory([newRec, ...history]);
      setAmount('');
      setSuccessMsg('درخواست تسویه با موفقیت ثبت شد و در صف پرداخت جمعه قرار گرفت.');
      setTelegramNotified(true);
    } else {
      if (numAmount < minUsdt) {
        setError('حداقل مبلغ برداشت تتر ۵ USDT است.');
        return;
      }
      if (numAmount > availableUsdt) {
        setError('موجودی تتری شما برای این مبلغ کافی نیست.');
        return;
      }
      const cleanAddr = destination.trim();
      if (!cleanAddr.startsWith('T') || cleanAddr.length < 30) {
        setError('آدرس کیف پول ترون (TRC20) نامعتبر است (باید با T شروع شود).');
        return;
      }

      const newRec: WithdrawalRecord = {
        id: `w_${Date.now()}`,
        method: 'USDT_TRC20',
        amount: numAmount,
        currency: 'USDT',
        fee: usdtFee,
        destination: cleanAddr,
        status: 'PENDING',
        createdAt: 'امروز',
        adminNote: 'ثبت شد؛ ارسال خودکار در دسته جمعه از طریق ترون گرید',
      };

      setAvailableUsdt((prev) => prev - numAmount);
      setHistory([newRec, ...history]);
      setAmount('');
      setSuccessMsg('درخواست تسویه تتر ثبت شد (۱ دلار کارمزد شبکه از دریافتی کسر می‌شود).');
      setTelegramNotified(true);
    }
  };

  const getStatusBadge = (status: WithdrawalRecord['status']) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3 h-3" />
            در انتظار تسویه
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <CheckCircle2 className="w-3 h-3" />
            تایید شده
          </span>
        );
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3" />
            واریز شده
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <XCircle className="w-3 h-3" />
            رد شده
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <Wallet className="w-6 h-6 text-emerald-600" />
          <span>{t('withdrawals.title')}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t('withdrawals.subtitle')}
        </p>
      </div>

      {/* Balances Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-5 border-l-4 border-l-emerald-500 bg-linear-to-br from-white to-emerald-50/30 dark:from-slate-900 dark:to-emerald-950/20">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">موجودی قابل برداشت (تومان)</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
                {formatPrice(availableToman, 'TOMAN')}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            {t('withdrawals.minAmountToman')}
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-teal-500 bg-linear-to-br from-white to-teal-50/30 dark:from-slate-900 dark:to-teal-950/20">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">موجودی قابل برداشت (تتر USDT)</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
                {availableUsdt.toFixed(2)} USDT
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center">
              <Coins className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            {t('withdrawals.minAmountUsdt')}
          </div>
        </Card>
      </div>

      {/* Friday Batch Schedule Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-start gap-3">
        <Calendar className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <div className="font-bold text-amber-900 dark:text-amber-200">
            برنامه تسویه حساب هفتگی
          </div>
          <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
            {t('withdrawals.fridayNotice')}
          </p>
          <div className="pt-1 flex items-center gap-2">
            <a
              href="https://t.me/BioPayPayouts"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-bold text-amber-700 dark:text-amber-400 hover:underline"
            >
              <Send className="w-3.5 h-3.5" />
              <span>مشاهده رسیدهای پرداخت در کانال تلگرام @BioPayPayouts</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* New Request Form */}
      <Card className="p-6">
        <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
          <span>{t('withdrawals.newRequest')}</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Method selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t('withdrawals.method')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMethod('SHABA')}
                className={`p-4 rounded-xl border text-start flex items-center gap-3 transition-all cursor-pointer ${
                  method === 'SHABA'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Building2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="font-bold text-xs">{t('withdrawals.methodShaba')}</div>
                  <div className="text-[11px] text-slate-500">تسویه پایا به شماره شبا بانک‌های ایران</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMethod('USDT_TRC20')}
                className={`p-4 rounded-xl border text-start flex items-center gap-3 transition-all cursor-pointer ${
                  method === 'USDT_TRC20'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Coins className="w-5 h-5 text-teal-600" />
                <div>
                  <div className="font-bold text-xs">{t('withdrawals.methodUsdt')}</div>
                  <div className="text-[11px] text-slate-500">انتقال بر بستر شبکه Tron TRC20</div>
                </div>
              </button>
            </div>
          </div>

          {/* Amount input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('withdrawals.amount')}
              placeholder={method === 'SHABA' ? 'مثلاً: ۵۰۰۰۰۰۰' : 'مثلاً: ۱۰'}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              helperText={
                method === 'SHABA'
                  ? t('withdrawals.minAmountToman')
                  : `${t('withdrawals.minAmountUsdt')} · کارمزد شبکه: ۱ USDT`
              }
              required
            />

            <Input
              label={
                method === 'SHABA'
                  ? t('withdrawals.destinationShaba')
                  : t('withdrawals.destinationWallet')
              }
              placeholder={
                method === 'SHABA'
                  ? 'IR580120000000012345678901'
                  : 'TQj8e9m3Kz7L9uA2Qc5xP1s4Z9w8v7b6a'
              }
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>

          {method === 'USDT_TRC20' && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
              <span>{t('withdrawals.networkFee')}</span>
              <span className="font-bold font-mono text-emerald-600">1.00 USDT</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {telegramNotified && (
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <Send className="w-4 h-4 shrink-0" />
              <span>پیام هشدار تسویه برای ادمین به بات تلگرام ارسال گردید.</span>
            </div>
          )}

          <Button type="submit" variant="primary" leftIcon={<ArrowDownLeft className="w-4 h-4" />}>
            {t('withdrawals.submitRequest')}
          </Button>
        </form>
      </Card>

      {/* History Table */}
      <Card className="p-6">
        <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">
          {t('withdrawals.history')}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                <th className="py-3 px-3 text-start">شناسه</th>
                <th className="py-3 px-3 text-start">{t('withdrawals.method')}</th>
                <th className="py-3 px-3 text-start">{t('withdrawals.amount')}</th>
                <th className="py-3 px-3 text-start">{t('withdrawals.destination')}</th>
                <th className="py-3 px-3 text-start">وضعیت</th>
                <th className="py-3 px-3 text-start">{t('withdrawals.adminNote')}</th>
                <th className="py-3 px-3 text-start">تاریخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-3 font-mono font-medium text-slate-400">{item.id}</td>
                  <td className="py-3 px-3 font-bold">
                    {item.method === 'SHABA' ? 'شبا ایران' : 'تتر TRC20'}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold tabular-nums">
                    {item.currency === 'TOMAN'
                      ? formatPrice(item.amount, 'TOMAN')
                      : `${item.amount} USDT`}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400 max-w-xs truncate">
                    {item.destination}
                  </td>
                  <td className="py-3 px-3">{getStatusBadge(item.status)}</td>
                  <td className="py-3 px-3 text-slate-500">{item.adminNote || '—'}</td>
                  <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{item.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
