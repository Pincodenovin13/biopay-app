'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, CheckCircle2, Send, Clock, Building2, Coins, AlertCircle } from 'lucide-react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { telegramBot } from '../../../../lib/telegram';

interface AdminPayoutItem {
  id: string;
  sellerName: string;
  storeSlug: string;
  amountToman: number;
  sheba: string;
  bank: string;
  method: 'SHABA' | 'USDT';
  status: 'PENDING' | 'SETTLED';
  requestedAt: string;
}

const INITIAL_PAYOUTS: AdminPayoutItem[] = [
  {
    id: 'w1',
    sellerName: 'مریم رضایی',
    storeSlug: 'tehrano_boutique',
    amountToman: 14200000,
    sheba: 'IR820120000000001234567890',
    bank: 'بانک ملت',
    method: 'SHABA',
    status: 'PENDING',
    requestedAt: '1403/08/01',
  },
  {
    id: 'w2',
    sellerName: 'امیرحسین کریمی',
    storeSlug: 'cafe_accessory',
    amountToman: 35000000,
    sheba: 'IR560560000000009876543210',
    bank: 'بانک سامان',
    method: 'SHABA',
    status: 'PENDING',
    requestedAt: '1403/07/30',
  },
  {
    id: 'w3',
    sellerName: 'سارا باقری',
    storeSlug: 'aria_silver',
    amountToman: 7500000,
    sheba: 'IR190180000000004561237890',
    bank: 'بانک پاسارگاد',
    method: 'SHABA',
    status: 'SETTLED',
    requestedAt: '1403/07/25',
  },
];

export default function AdminWithdrawalsPage() {
  const [payouts, setPayouts] = useState<AdminPayoutItem[]>(INITIAL_PAYOUTS);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = async (payout: AdminPayoutItem) => {
    setProcessingId(payout.id);
    const tracking = `PAYA-${Math.floor(1000000 + Math.random() * 9000000)}`;

    try {
      setPayouts((prev) =>
        prev.map((item) => (item.id === payout.id ? { ...item, status: 'SETTLED' } : item))
      );

      // Mask Shaba
      const maskedSheba = payout.sheba.slice(0, 4) + '...' + payout.sheba.slice(-4);

      // Broadcast to Telegram
      await telegramBot.broadcastWeeklyPayoutNotice({
        payoutId: payout.id,
        sellerName: payout.sellerName,
        storeSlug: payout.storeSlug,
        amountToman: payout.amountToman,
        shebaMasked: maskedSheba,
        bankName: payout.bank,
        trackingNumber: tracking,
        payoutDate: new Date().toLocaleDateString('fa-IR'),
      });

      alert(
        `تسویه با موفقیت تایید و پرداخت شد!\nکد پیگیری پایا: ${tracking}\nاطلاعیه در کانال تلگرام نیز منتشر شد.`
      );
    } catch (err: any) {
      alert(`خطا در ثبت تسویه: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 text-start"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-amber-500" />
            <span>مدیریت درخواست‌های تسویه‌حساب فروشندگان</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            تایید حواله پایا، واریز تتر و انتشار خودکار رسید در کانال رسمی تلگرام
          </p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden bg-slate-950/80 border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="p-4 text-start">فروشنده</th>
                <th className="p-4 text-start">مبلغ تسویه</th>
                <th className="p-4 text-start">شماره شبا و بانک</th>
                <th className="p-4 text-start">روش</th>
                <th className="p-4 text-start">تاریخ درخواست</th>
                <th className="p-4 text-start">وضعیت</th>
                <th className="p-4 text-end">عملیات تسویه</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {payouts.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-white">{item.sellerName}</div>
                    <div className="text-[10px] text-emerald-400 font-mono">/s/{item.storeSlug}</div>
                  </td>
                  <td className="p-4 font-mono font-bold text-white tabular-nums">
                    {item.amountToman.toLocaleString('fa-IR')} تومان
                  </td>
                  <td className="p-4">
                    <div className="font-mono text-slate-300 text-[11px]">{item.sheba}</div>
                    <div className="text-[10px] text-slate-500">{item.bank}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-[11px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                      {item.method}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-400">{item.requestedAt}</td>
                  <td className="p-4">
                    <Badge variant={item.status === 'SETTLED' ? 'success' : 'warning'}>
                      {item.status === 'SETTLED' ? 'تسویه شده' : 'در انتظار تایید'}
                    </Badge>
                  </td>
                  <td className="p-4 text-end">
                    {item.status === 'PENDING' ? (
                      <Button
                        variant="primary"
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => handleApprove(item)}
                        isLoading={processingId === item.id}
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                      >
                        تایید حواله و ارسال به تلگرام
                      </Button>
                    ) : (
                      <span className="text-[11px] text-emerald-400 font-medium flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>انجام شده</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}
