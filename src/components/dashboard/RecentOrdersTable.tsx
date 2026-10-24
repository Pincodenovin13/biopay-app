import React from 'react';
import { ShoppingBag, Eye, MessageCircle } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  productTitle: string;
  amountToman: number;
  status: 'PAID' | 'SHIPPED' | 'PENDING';
  date: string;
}

const SAMPLE_ORDERS: OrderItem[] = [
  {
    id: 'ord_1',
    orderNumber: '#BP-8921',
    customerName: 'فاطمه حسینی',
    customerPhone: '09121234567',
    productTitle: 'کت تک لینن اورسایز (کرم)',
    amountToman: 780000,
    status: 'PAID',
    date: 'امروز، ۱۱:۴۵',
  },
  {
    id: 'ord_2',
    orderNumber: '#BP-8920',
    customerName: 'علی رضایی',
    customerPhone: '09359876543',
    productTitle: 'شومیز کرپ ژاکارد مجلسی (سایز ۲)',
    amountToman: 520000,
    status: 'SHIPPED',
    date: 'امروز، ۰۹:۳۰',
  },
  {
    id: 'ord_3',
    orderNumber: '#BP-8919',
    customerName: 'زهرا موسوی',
    customerPhone: '09191122334',
    productTitle: 'شلوار واید بگ تابستانه (مشکی)',
    amountToman: 440000,
    status: 'PAID',
    date: 'دیروز، ۱۸:۲۰',
  },
  {
    id: 'ord_4',
    orderNumber: '#BP-8918',
    customerName: 'مهسا نوری',
    customerPhone: '09105556677',
    productTitle: 'کت تک لینن اورسایز (سبز سدری)',
    amountToman: 780000,
    status: 'SHIPPED',
    date: 'دیروز، ۱۴:۱۰',
  },
];

interface RecentOrdersTableProps {
  onViewOrder?: (order: OrderItem) => void;
}

export function RecentOrdersTable({ onViewOrder }: RecentOrdersTableProps) {
  const { t } = useI18n();

  return (
    <Card className="text-start overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {t('dashboard.recentOrdersTitle')}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            سفارش‌های جدید ثبت‌شده توسط خریداران در ویترین فروشگاه
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-start">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-3.5 font-semibold">شناسه / محصول</th>
              <th className="p-3.5 font-semibold">مشتری</th>
              <th className="p-3.5 font-semibold">مبلغ کل</th>
              <th className="p-3.5 font-semibold">وضعیت پرداخت</th>
              <th className="p-3.5 font-semibold">زمان ثبت</th>
              <th className="p-3.5 font-semibold text-end">پیام به خریدار</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {SAMPLE_ORDERS.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-3.5">
                  <div className="font-bold text-slate-900 dark:text-white">{order.productTitle}</div>
                  <div className="font-mono text-slate-500 text-[11px] mt-0.5">{order.orderNumber}</div>
                </td>
                <td className="p-3.5">
                  <div className="font-medium text-slate-800 dark:text-slate-200">{order.customerName}</div>
                  <div className="font-mono text-slate-500 text-[11px]">{order.customerPhone}</div>
                </td>
                <td className="p-3.5 font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                  {order.amountToman.toLocaleString('fa-IR')} تومان
                </td>
                <td className="p-3.5">
                  <Badge variant={order.status === 'PAID' ? 'success' : 'neutral'}>
                    {order.status === 'PAID' ? 'پرداخت شده' : 'ارسال شده'}
                  </Badge>
                </td>
                <td className="p-3.5 text-slate-500 font-medium">{order.date}</td>
                <td className="p-3.5 text-end">
                  <a
                    href={`https://wa.me/?text=سلام%20خانم%20${encodeURIComponent(order.customerName)}%20سفارش%20شما%20آماده%20ارسال%20می‌باشد.`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-md hover:bg-emerald-100 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>واتساپ</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
