import React from 'react';
import { Store, Instagram, Send, Mail } from 'lucide-react';
import { useI18n } from '../../lib/i18n';

interface LandingFooterProps {
  onGoHome: () => void;
  onOpenAuth: () => void;
}

export function LandingFooter({ onGoHome, onOpenAuth }: LandingFooterProps) {
  const { t } = useI18n();

  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-start">
          {/* Brand Info Column */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 text-white font-black text-xl">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Store className="w-5 h-5" />
              </div>
              <span>{t('common.appName')}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              {t('common.tagline')}. پلتفرم تخصصی تجارت اجتماعی برای رشد پایدار و تسویه سریع فروشندگان آنلاین.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="mailto:support@biopay.me"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">محصول</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#features-section" className="hover:text-white transition-colors">
                  ویترین در بیو
                </a>
              </li>
              <li>
                <a href="#pricing-section" className="hover:text-white transition-colors">
                  تعرفه‌ها و پلن‌ها
                </a>
              </li>
              <li>
                <button onClick={onOpenAuth} className="hover:text-white transition-colors cursor-pointer">
                  ثبت‌نام فروشندگان
                </button>
              </li>
              <li>
                <a href="#faq-section" className="hover:text-white transition-colors">
                  راهنمای تسویه
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">شرکت</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#testimonials" className="hover:text-white transition-colors">
                  داستان مشتریان
                </a>
              </li>
              <li>
                <span className="text-slate-500">درباره ما</span>
              </li>
              <li>
                <span className="text-slate-500">فرصت‌های شغلی</span>
              </li>
              <li>
                <span className="text-slate-500">تماس با پشتیبانی</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">حقوقی و امنیت</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-500">قوانین و مقررات</span>
              </li>
              <li>
                <span className="text-slate-500">حفظ حریم خصوصی</span>
              </li>
              <li>
                <span className="text-slate-500">ضمانت تسویه وجوه</span>
              </li>
              <li>
                <span className="text-slate-500">پروتکل‌های امنیتی</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 BioPay Inc. تمامی حقوق برای پلتفرم تجارت اجتماعی بایوپی محفوظ است.
          </div>
          <div className="flex items-center gap-6">
            <span>امنیت شتاب و شاپرک</span>
            <span>·</span>
            <span>پشتیبانی اختصاصی</span>
            <span>·</span>
            <span>تسویه خودکار روزانه</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
