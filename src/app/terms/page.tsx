'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  ShieldCheck,
  CreditCard,
  UserCheck,
  Scale,
  Clock,
  ArrowRight,
  Store,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { LanguageDropdown } from '../../components/ui/LanguageDropdown';
import { Card } from '../../components/ui/Card';

export default function TermsPage() {
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
            <Scale className="w-3.5 h-3.5" />
            <span>قوانین و مقررات رسمی پلتفرم</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            {locale === 'fa' && 'شرایط و ضوابط استفاده از بایوپی (BioPay)'}
            {locale === 'en' && 'Terms of Service - BioPay International'}
            {locale === 'ar' && 'الشروط والأحكام - منصة بايوپي'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            آخرین به‌روزرسانی: فوریه ۲۰۲۶ | این سند توافق‌نامه حقوقی و الزام‌آور بین کاربر و پلتفرم بایوپی است.
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-6">
          {/* Section 1 */}
          <Card className="p-6 bg-slate-900/90 border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-base">
              <UserCheck className="w-5 h-5" />
              <h2>۱. مسئولیت‌های کاربر و هویت حساب (User Responsibilities)</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              هر کاربر با ثبت‌نام در بایوپی متعهد می‌شود که اطلاعات هویتی و ارتباطی صحیح (شامل ایمیل، آیدی اینستاگرام و موقعیت جغرافیایی) ارائه دهد. فروشندگان متعهدند که از عرضه هرگونه کالای غیرمجاز، قاچاق، جعلی، ممنوعه طبق قوانین داخلی و بین‌المللی خودداری نمایند. هرگونه تخلف به تعلیق آنی فروشگاه و مسدودی کیف پول خواهد انجامید.
            </p>
          </Card>

          {/* Section 2 */}
          <Card className="p-6 bg-slate-900/90 border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center gap-2.5 text-sky-400 font-bold text-base">
              <CreditCard className="w-5 h-5" />
              <h2>۲. شرایط پرداخت و تسویه حساب (Payment Terms)</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              • <strong>تراکنش‌های ریالی داخل ایران:</strong> از طریق درگاه‌های امن شاپرکی (زرین‌پال و پرداخت‌یارهای مجاز) پردازش شده و تسویه حساب‌ها طبق چرخه پایا به شماره شبای ثبت‌شده فروشنده واریز می‌شود.<br />
              • <strong>تراکنش‌های بین‌المللی:</strong> پردازش پرداخت‌ها از طریق تتر شبکه ترون (USDT TRC20) صورت می‌پذیرد. کارمزد انتقال شبکه بر عهده کاربر بوده و تسویه دلاری پس از ثبت تراکنش بر روی بلاکچین انجام می‌گیرد.<br />
              • <strong>پلن‌های اشتراک:</strong> پلن استارتر (۵ میلیون تومان / ۲۷ تتر)، حرفه‌ای (۹ میلیون تومان / ۵۲ تتر) و سازمانی (۱۲ میلیون تومان / ۷۵ تتر) بلافاصله پس از پرداخت فعال می‌شوند.
            </p>
          </Card>

          {/* Section 3 */}
          <Card className="p-6 bg-slate-900/90 border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center gap-2.5 text-purple-400 font-bold text-base">
              <FileText className="w-5 h-5" />
              <h2>۳. قوانین پورسانت و سیستم همکاری در فروش (Referral Commissions)</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              کارمزد سیستم همکاری بر اساس پلن معرفی‌شده به صورت ۱۰٪ (استارتر)، ۱۵٪ (حرفه‌ای) و ۲۰٪ (سازمانی) محاسبه می‌شود. پورسانت‌ها به کیف پول کاربر در حساب بایوپی واریز شده و حداقل موجودی جهت ثبت درخواست تسویه ۱۰۰,۰۰۰ تومان یا ۱۰ تتر می‌باشد. استفاده از شیوه‌های متقلبانه جهت ثبت کاربر فیک ممنوع بوده و موجب سلب عضویت خواهد شد.
            </p>
          </Card>

          {/* Section 4 */}
          <Card className="p-6 bg-slate-900/90 border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center gap-2.5 text-amber-400 font-bold text-base">
              <Clock className="w-5 h-5" />
              <h2>۴. سیاست غیرفعال‌سازی و حذف حساب‌های راکد (Account Deletion Policy)</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              جهت بهینه‌سازی منابع، حساب‌هایی که بیش از ۹۰ روز هیچ فعالیتی نداشته باشند ابتدا اخطار ۷ روزه از طریق ایمیل و تلگرام دریافت خواهند کرد. در صورت عدم مراجعه تا ۳۰ روز پس از اخطار، حساب کاربری و ویترین فروشگاه طبق رویه امنیتی پاکسازی می‌گردد.
            </p>
          </Card>

          {/* Section 5 */}
          <Card className="p-6 bg-slate-900/90 border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center gap-2.5 text-rose-400 font-bold text-base">
              <ShieldCheck className="w-5 h-5" />
              <h2>۵. حل اختلاف و سلب مسئولیت (Dispute Resolution & Limitation of Liability)</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              بایوپی به عنوان بستر ارائه‌دهنده زیرساخت فنی فروشگاهی و درگاه پرداخت عمل می‌کند و طرف قرارداد معاملات بین خریدار نهایی و فروشنده نمی‌باشد. در صورت بروز اختلاف بین خریدار و فروشنده، تیم پشتیبانی مدارک تراکنش و رسید را در اختیار مراجع مربوطه قرار خواهد داد.
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
