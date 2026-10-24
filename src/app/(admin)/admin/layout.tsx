'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Store,
  CreditCard,
  Wallet,
  Settings,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { LanguageDropdown } from '../../../components/ui/LanguageDropdown';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.includes('/users')) setActiveTab('users');
      else if (path.includes('/stores')) setActiveTab('stores');
      else if (path.includes('/payments')) setActiveTab('payments');
      else if (path.includes('/withdrawals')) setActiveTab('withdrawals');
      else if (path.includes('/settings')) setActiveTab('settings');
      else setActiveTab('dashboard');
    }
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'داشبورد نظارتی', href: '/admin', icon: TrendingUp },
    { id: 'users', label: 'کاربران و فروشندگان', href: '/admin/users', icon: Users },
    { id: 'stores', label: 'فروشگاه‌ها و ویترین‌ها', href: '/admin/stores', icon: Store },
    { id: 'payments', label: 'تراکنش‌ها و درآمد', href: '/admin/payments', icon: CreditCard },
    { id: 'withdrawals', label: 'تسویه‌حساب و پایا', href: '/admin/withdrawals', icon: Wallet },
    { id: 'settings', label: 'تنظیمات سامانه', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between text-start">
      {/* Admin Protected Header */}
      <header className="h-16 bg-slate-950 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shrink-0 shadow-sm">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              <span>سامانه مدیریت ارشد بایوپی (Super Admin)</span>
              <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded-full font-mono">
                محافظت‌شده
              </span>
            </h1>
            <div className="text-[10px] text-slate-400 font-mono hidden sm:block">
              ایزوله کامل از صفحات عمومی و موتورهای جستجو
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (typeof window !== 'undefined') window.location.href = '/';
            }}
            leftIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="border-slate-700 text-slate-300 hover:text-white"
          >
            خروج به صفحه اصلی
          </Button>
          <LanguageDropdown />
        </div>
      </header>

      {/* Admin Nav Bar */}
      <div className="bg-slate-950/60 border-b border-slate-800 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (typeof window !== 'undefined') window.location.href = item.href;
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex-1">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="h-12 bg-slate-950 border-t border-slate-800/80 px-6 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <div>BioPay Multi-Tenant Node: IR-TEH-1</div>
        <div>Prisma DB: Connected • Zarinpal: Active • TronGrid: Synced</div>
      </footer>
    </div>
  );
}
