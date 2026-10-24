import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { Card } from '../ui/Card';

const PARTNER_LOGOS = [
  { name: 'Tehran Fashion', symbol: 'TF' },
  { name: 'Barista Brew Lab', symbol: 'BL' },
  { name: 'Arya Silver Studio', symbol: 'AS' },
  { name: 'Rayan Digital Gear', symbol: 'RD' },
  { name: 'Shiraz Leather Co.', symbol: 'SL' },
  { name: 'Luxe Cosmetics', symbol: 'LC' },
];

export function SocialProof() {
  const { t } = useI18n();

  return (
    <section className="py-20 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Logo Cloud */}
        <div className="text-center space-y-6">
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">
            {t('hero.trustedBy')}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center justify-items-center opacity-70 hover:opacity-100 transition-opacity">
            {PARTNER_LOGOS.map((logo, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-sm tracking-tight px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono text-xs font-extrabold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                  {logo.symbol}
                </div>
                <span>{logo.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {t('testimonials.title')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {t('testimonials.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <Card hoverEffect className="p-6 flex flex-col justify-between text-start relative">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  "{t('testimonials.t1Content')}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                  MR
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {t('testimonials.t1Name')}
                  </div>
                  <div className="text-[11px] text-slate-500">{t('testimonials.t1Role')}</div>
                </div>
              </div>
            </Card>

            {/* Testimonial 2 */}
            <Card hoverEffect className="p-6 flex flex-col justify-between text-start relative">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  "{t('testimonials.t2Content')}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-sm">
                  AK
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {t('testimonials.t2Name')}
                  </div>
                  <div className="text-[11px] text-slate-500">{t('testimonials.t2Role')}</div>
                </div>
              </div>
            </Card>

            {/* Testimonial 3 */}
            <Card hoverEffect className="p-6 flex flex-col justify-between text-start relative">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  "{t('testimonials.t3Content')}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-sm">
                  SB
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {t('testimonials.t3Name')}
                  </div>
                  <div className="text-[11px] text-slate-500">{t('testimonials.t3Role')}</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
