'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Users,
  Store,
  CreditCard,
  Wallet,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

export default function AdminDashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* 4 Super Admin Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-5 bg-slate-950/80 border-slate-800 text-start space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>کل تراکنش‌های شبکه (GMV)</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums">
            ۱۷۵,۹۳۰,۰۰۰
          </div>
          <div className="text-[11px] text-emerald-400 font-medium">+۲۳.۴٪ رشد نسبت به ماه قبل</div>
        </Card>

        <Card className="p-5 bg-slate-950/80 border-slate-800 text-start space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>فروشگاه‌های فعال</span>
            <Store className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums">
            ۱,۴۸۲
          </div>
          <div className="text-[11px] text-blue-400 font-medium">۹۴ فروشگاه جدید این هفته</div>
        </Card>

        <Card className="p-5 bg-slate-950/80 border-slate-800 text-start space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>کاربران و همکاران فروش</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums">
            ۳,۲۴۰
          </div>
          <div className="text-[11px] text-purple-400 font-medium">۶۸۲ پارتنر فعال در برنامه ارجاع</div>
        </Card>

        <Card className="p-5 bg-slate-950/80 border-slate-800 text-start space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>تسویه‌های در انتظار تایید</span>
            <Wallet className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono tabular-nums">
            ۲ فقره
          </div>
          <div className="text-[11px] text-amber-300 font-medium">مجموع: ۴۹,۲۰۰,۰۰۰ تومان</div>
        </Card>
      </div>

      {/* Gateway & Node Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 bg-slate-950/80 border-slate-800 space-y-5 text-start">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>وضعیت سرویس‌های هسته بایوپی</span>
            </h3>
            <Badge variant="success">تمام سرویس‌ها نرمال</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">درگاه شتابی زرین‌پال</div>
              <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>متصل (v4 REST)</span>
              </div>
              <div className="text-[10px] text-slate-500">پینگ: ۸۴ میلی‌ثانیه</div>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">شبکه TronGrid USDT</div>
              <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>سینک شده (TRC20)</span>
              </div>
              <div className="text-[10px] text-slate-500">آخرین بلاک: ۶۷۲,۹۱۴</div>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">بات اطلاع‌رسانی تلگرام</div>
              <div className="text-sm font-bold text-blue-400 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                <span>فعال و آماده پخش</span>
              </div>
              <div className="text-[10px] text-slate-500">کانال: @BioPay_Settlements</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-2 flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (typeof window !== 'undefined') window.location.href = '/admin/withdrawals';
              }}
            >
              بررسی تسویه‌های باز
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (typeof window !== 'undefined') window.location.href = '/admin/users';
              }}
            >
              مدیریت دسترسی کاربران
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (typeof window !== 'undefined') window.location.href = '/admin/stores';
              }}
            >
              مشاهده فروشگاه‌ها
            </Button>
          </div>
        </Card>

        {/* Live Broadcast Panel */}
        <Card className="p-6 bg-slate-950/80 border-slate-800 space-y-4 text-start">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">پخش تلگرامی تسویه‌ها</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            اطلاعیه‌های واریز هفتگی و تسویه‌حساب‌های پایا به صورت خودکار با فرمت رسمی و ماسک‌کردن شماره شبا در کانال تلگرام ارسال می‌گردند.
          </p>
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 space-y-1">
            <div>[BOT] Telegram Bot API: Online</div>
            <div>[BROADCAST] Target: Channel</div>
            <div>[SECURITY] Shaba Masking: Enabled</div>
          </div>
          <Button
            variant="primary"
            size="sm"
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => alert('تست پینگ بات تلگرام با موفقیت انجام شد.')}
          >
            تست ارسال پیام آزمایشی بات
          </Button>
        </Card>
      </div>
    </motion.div>
  );
}
