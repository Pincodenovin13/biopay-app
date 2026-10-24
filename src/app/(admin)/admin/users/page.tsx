'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Search, Filter, Shield, Ban, CheckCircle2, MoreVertical, Phone, Calendar } from 'lucide-react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Badge } from '../../../../components/ui/Badge';

interface AdminUser {
  id: string;
  name: string;
  phone: string;
  role: 'USER' | 'ADMIN' | 'SUPPORT';
  status: 'ACTIVE' | 'SUSPENDED';
  referralCode: string;
  joinedAt: string;
  totalGmvToman: number;
}

const INITIAL_USERS: AdminUser[] = [
  {
    id: 'u1',
    name: 'مریم رضایی',
    phone: '09121112233',
    role: 'USER',
    status: 'ACTIVE',
    referralCode: 'MARYAM-88',
    joinedAt: '1403/06/15',
    totalGmvToman: 48500000,
  },
  {
    id: 'u2',
    name: 'امیرحسین کریمی',
    phone: '09123334455',
    role: 'USER',
    status: 'ACTIVE',
    referralCode: 'AMIR-77',
    joinedAt: '1403/05/20',
    totalGmvToman: 92300000,
  },
  {
    id: 'u3',
    name: 'سارا باقری',
    phone: '09351239876',
    role: 'USER',
    status: 'ACTIVE',
    referralCode: 'SARA-99',
    joinedAt: '1403/07/01',
    totalGmvToman: 24100000,
  },
  {
    id: 'u4',
    name: 'کامیار صبوحی',
    phone: '09198887766',
    role: 'USER',
    status: 'SUSPENDED',
    referralCode: 'KAMYAR-10',
    joinedAt: '1403/04/10',
    totalGmvToman: 11000000,
  },
  {
    id: 'u5',
    name: 'مدیر ارشد فنی',
    phone: '09120000000',
    role: 'ADMIN',
    status: 'ACTIVE',
    referralCode: 'SUPER-ADMIN',
    joinedAt: '1403/01/01',
    totalGmvToman: 0,
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'USER' | 'ADMIN'>('ALL');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery) ||
      u.referralCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newStatus = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          return { ...u, status: newStatus };
        }
        return u;
      })
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
            <Users className="w-5 h-5 text-rose-500" />
            <span>مدیریت کاربران و فروشندگان</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            کنترل وضعیت، دسترسی‌ها و تراکنش‌های فروشندگان در کل پلتفرم
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Input
            placeholder="جستجو با نام، شماره یا کد معرف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
          />
        </div>
      </div>

      <Card className="p-0 overflow-hidden bg-slate-950/80 border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="p-4 text-start">نام کاربر</th>
                <th className="p-4 text-start">شماره تماس</th>
                <th className="p-4 text-start">نقش</th>
                <th className="p-4 text-start">کد معرف</th>
                <th className="p-4 text-start">کل تراکنش (تومان)</th>
                <th className="p-4 text-start">تاریخ عضویت</th>
                <th className="p-4 text-start">وضعیت</th>
                <th className="p-4 text-end">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-4 font-bold text-white">{user.name}</td>
                  <td className="p-4 font-mono text-slate-400">{user.phone}</td>
                  <td className="p-4">
                    <Badge variant={user.role === 'ADMIN' ? 'error' : 'neutral'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="p-4 font-mono text-emerald-400">{user.referralCode}</td>
                  <td className="p-4 font-mono font-bold text-white tabular-nums">
                    {user.totalGmvToman > 0 ? user.totalGmvToman.toLocaleString('fa-IR') : '—'}
                  </td>
                  <td className="p-4 text-slate-400 font-mono">{user.joinedAt}</td>
                  <td className="p-4">
                    <Badge variant={user.status === 'ACTIVE' ? 'success' : 'error'}>
                      {user.status === 'ACTIVE' ? 'فعال' : 'مسدود'}
                    </Badge>
                  </td>
                  <td className="p-4 text-end">
                    <Button
                      variant={user.status === 'ACTIVE' ? 'ghost' : 'outline'}
                      size="sm"
                      onClick={() => handleToggleStatus(user.id)}
                      className={user.status === 'ACTIVE' ? 'text-rose-400 hover:text-rose-300' : 'text-emerald-400'}
                    >
                      {user.status === 'ACTIVE' ? 'مسدودسازی' : 'رفع انسداد'}
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
