'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Lock,
  EyeOff,
  Database,
  Server,
  Key,
  ArrowRight,
  Store,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { LanguageDropdown } from '../../components/ui/LanguageDropdown';
import { Card } from '../../components/ui/Card';

export default function PrivacyPage() {
  const { t, locale } = useI18n();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur sticky top-0 z-40 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/" className="inline-flex items-center gap-2.5 text-lg font-black text-white">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
              <Store className="w-4 h-4" />
            </div>
            <span>{t('common.appName')} | BioPay</span>
          </a>

          <div className="flex items-center gap-3">
            <LanguageDropdown />
            <a
              href="/register"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
            >
              ثبت‌نام
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>سیاست حفظ حریم خصوصی و امنیت داده‌ها</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            {locale === 'fa' && 'سیاست حفظ حریم خصوصی بایوپی (BioPay Privacy Policy)'}
            {locale === 'en' && 'Privacy Policy - BioPay International'}
            {locale === 'ar' && 'سياسة الخصوصية - منصة بايوپي'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            حفاظت از اطلاعات کاربری، تراکنش‌ها و امنیت فروشگاه‌های شما اولویت بنیادین بایوپی است.
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-6">
          <Card className="p-6 bg-slate-900/90 border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-base">
              <EyeOff className="w-5 h-5" />
              <h2>۱. عدم ذخیره رمز عبور به صورت خام (Zero-Plaintext Password Policy)</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              تمام گذرواژه‌های کاربران با الگوریتم رمزنگاری یک‌طرفه Bcrypt با Salt Round بالا هش می‌شوند. هیچ عضوی از تیم فنی یا مدیریت به رمز عبور شما دسترسی ندارد و رمزها هرگز در تلگرام یا پیامک ارسال نمی‌شوند.
            </p>
          </Card>

          <Card className="p-6 bg-slate-900/90 border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center gap-2.5 text-sky-400 font-bold text-base">
              <Database className="w-5 h-5" />
              <h2>۲. داده‌های جمع‌آوری شده و موارد استفاده (Data Collection)</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              ما صرفاً داده‌های ضروری جهت راه‌اندازی فروشگاه و احراز هویت شامل ایمیل، آیدی اینستاگرام، کشور و اطلاعات پرداخت را ذخیره می‌کنیم. بایوپی هرگز اطلاعات شما را به شرکت‌ها یا پلتفرم‌های تبلیغاتی ثالث واگذار نخواهد کرد.
            </p>
          </Card>

          <Card className="p-6 bg-slate-900/90 border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center gap-2.5 text-purple-400 font-bold text-base">
              <Key className="w-5 h-5" />
              <h2>۳. احراز هویت متنی بدون نیاز به تصویر (Text-Only Verification)</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              جهت حفظ امنیت و محرمانگی حداکثری کاربران، فرآیند احراز هویت در ربات تلگرام بایوپی صرفاً به صورت متنی انجام شده و هیچ‌گونه تصویر کارت ملی، گذرنامه یا اسناد هویتی فیزیکی دریافت یا نگهداری نمی‌شود.
            </p>
          </Card>

          <Card className="p-6 bg-slate-900/90 border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center gap-2.5 text-amber-400 font-bold text-base">
              <Server className="w-5 h-5" />
              <h2>۴. امنیت تراکنش‌های مالی و رمزنگاری داده‌ها (Encryption & Data Security)</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              تمامی ارتباطات تحت پروتکل امن TLS 1.3 رمزنگاری شده و داده‌های نشست‌ها و احراز هویت با ساختار ضد دستکاری مدیریت می‌شوند. در صورت تمایل به بستن حساب کاربری، می‌توانید درخواست حذف دائم سوابق را ثبت فرمایید.
            </p>
          </Card>
        </div>

        {/* Back Link */}
        <div className="pt-6 text-center">
          <a
            href="/register"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition"
          >
            <span>بازگشت به صفحه ثبت‌نام</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </a>
        </div>
      </main>
    </div>
  );
}
