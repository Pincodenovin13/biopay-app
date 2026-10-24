'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Search, CheckCircle2, Clock, XCircle, ExternalLink } from 'lucide-react';
import { Card } from '../../../../components/ui/Card';
import { Input } from '../../../../components/ui/Input';
import { Badge } from '../../../../components/ui/Badge';

interface PaymentLog {
  id: string;
  gateway: 'ZARINPAL' | 'TRONGRID_USDT';
  amount: number;
  currency: 'TOMAN' | 'USDT';
  customer: string;
  trackingCode: string;
  refId?: string;
  txHash?: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  date: string;
  purpose: string;
}

const INITIAL_PAYMENTS: PaymentLog[] = [
  {
    id: 'p1',
    gateway: 'ZARINPAL',
    amount: 12000000,
    currency: 'TOMAN',
    customer: '09121112233 (مریم رضایی)',
    trackingCode: 'ZP-84910248',
    refId: '109284729',
    status: 'SUCCESS',
    date: '1403/08/01 - 14:20',
    purpose: 'خرید اشتراک ماهانه Pro',
  },
  {
    id: 'p2',
    gateway: 'TRONGRID_USDT',
    amount: 53,
    currency: 'USDT',
    customer: '09123334455 (امیرحسین کریمی)',
    trackingCode: 'USDT-718293',
    txHash: '0x9fae120bc94...2198ab71',
    status: 'SUCCESS',
    date: '1403/07/29 - 18:05',
    purpose: 'خرید اشتراک سالانه Pro',
  },
  {
    id: 'p3',
    gateway: 'ZARINPAL',
    amount: 9000000,
    currency: 'TOMAN',
    customer: '09351239876 (سارا باقری)',
    trackingCode: 'ZP-99182374',
    refId: '448102938',
    status: 'SUCCESS',
    date: '1403/07/28 - 11:45',
    purpose: 'خرید اشتراک Starter',
  },
  {
    id: 'p4',
    gateway: 'TRONGRID_USDT',
    amount: 26,
    currency: 'USDT',
    customer: '09198887766 (کامیار صبوحی)',
    trackingCode: 'USDT-665123',
    status: 'PENDING',
    date: '1403/07/27 - 09:12',
    purpose: 'تمدید اشتراک Starter',
  },
];

export default function AdminPaymentsPage() {
  const [payments] = useState<PaymentLog[]>(INITIAL_PAYMENTS);
  const [search, setSearch] = useState('');

  const filtered = payments.filter(
    (p) =>
      p.customer.toLowerCase().includes(search.toLowerCase()) ||
      p.trackingCode.toLowerCase().includes(search.toLowerCase()) ||
      (p.refId && p.refId.includes(search))
  );

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
            <CreditCard className="w-5 h-5 text-emerald-500" />
            <span>گزارش تراکنش‌ها و درگاه‌های پرداخت</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            سوابق پرداخت‌های شتابی زرین‌پال و واریزی‌های تتری TronGrid TRC20
          </p>
        </div>

        <Input
          placeholder="جستجوی کد رهگیری یا شماره..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
        />
      </div>

      <Card className="p-0 overflow-hidden bg-slate-950/80 border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="p-4 text-start">شناسه و درگاه</th>
                <th className="p-4 text-start">مبلغ</th>
                <th className="p-4 text-start">کاربر</th>
                <th className="p-4 text-start">بابت</th>
                <th className="p-4 text-start">کد پیگیری / RefId</th>
                <th className="p-4 text-start">زمان</th>
                <th className="p-4 text-end">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-4">
                    <div className="font-mono text-white font-bold">{item.id}</div>
                    <span className="text-[10px] text-emerald-400 font-medium">
                      {item.gateway === 'ZARINPAL' ? 'زرین‌پال (شتاب)' : 'تتر (TRC20)'}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold text-white tabular-nums">
                    {item.currency === 'TOMAN'
                      ? `${item.amount.toLocaleString('fa-IR')} تومان`
                      : `${item.amount} USDT`}
                  </td>
                  <td className="p-4 text-slate-300 font-mono text-[11px]">{item.customer}</td>
                  <td className="p-4 text-slate-400">{item.purpose}</td>
                  <td className="p-4 font-mono text-[11px] text-slate-300">
                    <div>{item.trackingCode}</div>
                    {item.refId && <div className="text-[10px] text-slate-500">Ref: {item.refId}</div>}
                    {item.txHash && <div className="text-[10px] text-blue-400 truncate max-w-[120px]">{item.txHash}</div>}
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-[11px]">{item.date}</td>
                  <td className="p-4 text-end">
                    <Badge
                      variant={
                        item.status === 'SUCCESS' ? 'success' : item.status === 'PENDING' ? 'warning' : 'error'
                      }
                    >
                      {item.status === 'SUCCESS' ? 'تایید شده' : item.status === 'PENDING' ? 'در انتظار' : 'ناموفق'}
                    </Badge>
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
