'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Store, ExternalLink, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Badge } from '../../../../components/ui/Badge';

interface AdminStore {
  id: string;
  slug: string;
  title: string;
  ownerName: string;
  ownerPhone: string;
  industry: string;
  productCount: number;
  orderCount: number;
  totalGmvToman: number;
  plan: 'STARTER' | 'PRO';
  isActive: boolean;
}

const INITIAL_STORES: AdminStore[] = [
  {
    id: 's1',
    slug: 'tehrano_boutique',
    title: 'بوتیک لباس و مد تهرانو',
    ownerName: 'مریم رضایی',
    ownerPhone: '09121112233',
    industry: 'پوشاک و مد بانوان',
    productCount: 18,
    orderCount: 124,
    totalGmvToman: 48500000,
    plan: 'PRO',
    isActive: true,
  },
  {
    id: 's2',
    slug: 'cafe_accessory',
    title: 'گالری اکسسوری و ساعت کافه',
    ownerName: 'امیرحسین کریمی',
    ownerPhone: '09123334455',
    industry: 'زیورآلات و ساعت',
    productCount: 45,
    orderCount: 218,
    totalGmvToman: 92300000,
    plan: 'PRO',
    isActive: true,
  },
  {
    id: 's3',
    slug: 'aria_silver',
    title: 'نقره‌جات و دست‌سازهای آریا',
    ownerName: 'سارا باقری',
    ownerPhone: '09351239876',
    industry: 'صنایع دستی و نقره',
    productCount: 12,
    orderCount: 65,
    totalGmvToman: 24100000,
    plan: 'STARTER',
    isActive: true,
  },
  {
    id: 's4',
    slug: 'techno_now',
    title: 'تکنو نو - لوازم جانبی هوشمند',
    ownerName: 'کامیار صبوحی',
    ownerPhone: '09198887766',
    industry: 'لوازم دیجیتال و جانبی',
    productCount: 8,
    orderCount: 19,
    totalGmvToman: 11000000,
    plan: 'STARTER',
    isActive: false,
  },
];

export default function AdminStoresPage() {
  const [stores, setStores] = useState<AdminStore[]>(INITIAL_STORES);
  const [search, setSearch] = useState('');

  const filteredStores = stores.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.slug.toLowerCase().includes(search.toLowerCase()) ||
      s.ownerName.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleStore = (id: string) => {
    setStores((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
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
            <Store className="w-5 h-5 text-blue-500" />
            <span>فروشگاه‌ها و ویترین‌های فعال بایوپی</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            بررسی آدرس‌های اینترنتی (/s/slug)، پلن اشتراک و فروش هر ویترین
          </p>
        </div>

        <Input
          placeholder="جستجوی فروشگاه یا آدرس..."
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
                <th className="p-4 text-start">فروشگاه</th>
                <th className="p-4 text-start">مالک</th>
                <th className="p-4 text-start">حوزه فعالیت</th>
                <th className="p-4 text-start">پلن</th>
                <th className="p-4 text-start">محصولات</th>
                <th className="p-4 text-start">سفارش‌ها</th>
                <th className="p-4 text-start">کل فروش (تومان)</th>
                <th className="p-4 text-start">وضعیت</th>
                <th className="p-4 text-end">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredStores.map((store) => (
                <tr key={store.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-white">{store.title}</div>
                    <a
                      href={`/s/${store.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-emerald-400 text-[11px] hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <span>/s/{store.slug}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="p-4">
                    <div className="text-white font-medium">{store.ownerName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{store.ownerPhone}</div>
                  </td>
                  <td className="p-4 text-slate-400">{store.industry}</td>
                  <td className="p-4">
                    <Badge variant={store.plan === 'PRO' ? 'warning' : 'neutral'}>
                      {store.plan}
                    </Badge>
                  </td>
                  <td className="p-4 font-mono">{store.productCount}</td>
                  <td className="p-4 font-mono">{store.orderCount}</td>
                  <td className="p-4 font-mono font-bold text-white tabular-nums">
                    {store.totalGmvToman.toLocaleString('fa-IR')}
                  </td>
                  <td className="p-4">
                    <Badge variant={store.isActive ? 'success' : 'error'}>
                      {store.isActive ? 'فعال' : 'غیرفعال'}
                    </Badge>
                  </td>
                  <td className="p-4 text-end">
                    <Button
                      variant={store.isActive ? 'ghost' : 'outline'}
                      size="sm"
                      onClick={() => handleToggleStore(store.id)}
                      className={store.isActive ? 'text-rose-400 hover:text-rose-300' : 'text-emerald-400'}
                    >
                      {store.isActive ? 'تعلیق ویترین' : 'فعال‌سازی'}
                    </Button>
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
