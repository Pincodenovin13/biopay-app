import React from 'react';
import { Store, Instagram, Send, Mail, ShieldCheck, Headphones, Zap } from 'lucide-react';
import { useI18n } from '../../lib/i18n';

interface LandingFooterProps {
  onGoHome: () => void;
  onOpenAuth: () => void;
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
}

export function LandingFooter({ onGoHome, onOpenAuth }: LandingFooterProps) {
  const { t } = useI18n();

  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-start">
          {/* Brand Info Column */}
          <div className="col-span-2 space-y-4">
            <button
              onClick={onGoHome}
              className="flex items-center gap-2.5 text-white font-black text-xl hover:opacity-90 transition-opacity cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                <Store className="w-5 h-5" />
              </div>
              <span>{t('common.appName')}</span>
            </button>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              {t('common.tagline')}. {t('footer.aboutText')}
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
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t('footer.productTitle')}</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#features-section" className="hover:text-white transition-colors">
                  {t('footer.linkBio')}
                </a>
              </li>
              <li>
                <a href="#pricing-section" className="hover:text-white transition-colors">
                  {t('footer.plansPricing')}
                </a>
              </li>
              <li>
                <button onClick={onOpenAuth} className="hover:text-white transition-colors cursor-pointer text-start">
                  {t('footer.merchantRegister')}
                </button>
              </li>
              <li>
                <a href="#faq-section" className="hover:text-white transition-colors">
                  {t('footer.payoutGuide')}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t('footer.companyTitle')}</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#testimonials" className="hover:text-white transition-colors">
                  {t('footer.customerStories')}
                </a>
              </li>
              <li>
                <a href="#features-section" className="hover:text-white transition-colors">
                  {t('footer.aboutUs')}
                </a>
              </li>
              <li>
                <a href="mailto:careers@biopay.me" className="hover:text-white transition-colors">
                  {t('footer.careers')}
                </a>
              </li>
              <li>
                <a href="mailto:support@biopay.me" className="hover:text-white transition-colors">
                  {t('footer.contactSupport')}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t('footer.legalTitle')}</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/terms" className="hover:text-white transition-colors">
                  {t('footer.termsOfService')}
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-white transition-colors">
                  {t('footer.privacyPolicy')}
                </a>
              </li>
              <li>
                <a href="#pricing-section" className="hover:text-white transition-colors">
                  {t('footer.payoutGuarantee')}
                </a>
              </li>
              <li>
                <a href="#features-section" className="hover:text-white transition-colors">
                  {t('footer.securityProtocols')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            {t('footer.copyright')}
          </div>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t('footer.shetabSecurity')}</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t('footer.dedicatedSupport')}</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t('footer.dailyAutoPayouts')}</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
