import React from 'react';
import { motion } from 'motion/react';
import { Check, Sparkles, Globe, Zap } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useI18n } from '../../lib/i18n';

interface PricingSectionProps {
  onSelectPlan: (planSlug: string) => void;
}

export function PricingSection({ onSelectPlan }: PricingSectionProps) {
  const { t, locale, region, setRegion } = useI18n();

  const isIran = region === 'iran';

  const plans = [
    {
      slug: 'starter',
      name: t('pricing.starterTitle'),
      duration: isIran ? t('pricing.starterDuration') : t('pricing.starterDurationEn'),
      priceToman: 5_000_000,
      oldPriceToman: 9_000_000,
      priceUsdt: 27,
      oldPriceUsdt: 45,
      commissionPercent: locale === 'fa' ? '۱۰٪' : locale === 'ar' ? '١٠٪' : '10%',
      commissionToman: '۵۰۰,۰۰۰ تومان',
      commissionUsdt: '2.7 USDT',
      desc: t('pricing.starterDesc'),
      features: [
        t('pricing.starterFeat1'),
        t('pricing.starterFeat2'),
        t('pricing.starterFeat3'),
        t('pricing.starterFeat4'),
        t('pricing.starterFeat5'),
        t('pricing.starterFeat6'),
      ],
      popular: false,
    },
    {
      slug: 'pro',
      name: t('pricing.proTitle'),
      duration: isIran ? t('pricing.proDuration') : t('pricing.proDurationEn'),
      priceToman: 9_000_000,
      oldPriceToman: 15_000_000,
      priceUsdt: 52,
      oldPriceUsdt: 80,
      commissionPercent: locale === 'fa' ? '۱۵٪' : locale === 'ar' ? '١٥٪' : '15%',
      commissionToman: '۱,۳۵۰,۰۰۰ تومان',
      commissionUsdt: '7.8 USDT',
      desc: t('pricing.proDesc'),
      features: [
        t('pricing.proFeat1'),
        t('pricing.proFeat2'),
        t('pricing.proFeat3'),
        t('pricing.proFeat4'),
        t('pricing.proFeat5'),
        t('pricing.proFeat6'),
        t('pricing.proFeat7'),
      ],
      popular: true,
    },
    {
      slug: 'business',
      name: t('pricing.businessTitle'),
      duration: isIran ? t('pricing.businessDuration') : t('pricing.businessDurationEn'),
      priceToman: 12_000_000,
      oldPriceToman: 20_000_000,
      priceUsdt: 75,
      oldPriceUsdt: 110,
      commissionPercent: locale === 'fa' ? '۲۰٪' : locale === 'ar' ? '٢٠٪' : '20%',
      commissionToman: '۲,۴۰۰,۰۰۰ تومان',
      commissionUsdt: '15 USDT',
      desc: t('pricing.businessDesc'),
      features: [
        t('pricing.businessFeat1'),
        t('pricing.businessFeat2'),
        t('pricing.businessFeat3'),
        t('pricing.businessFeat4'),
        t('pricing.businessFeat5'),
        t('pricing.businessFeat6'),
        t('pricing.businessFeat7'),
      ],
      popular: false,
    },
  ];

  return (
    <section id="pricing-section" className="py-20 lg:py-28 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Zap className="w-3.5 h-3.5" />
            <span>{t('pricing.badge')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('pricing.title')}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t('pricing.subtitle')}
          </p>

          {/* Region Detection / Currency Toggle Switch */}
          <div className="pt-3 flex justify-center items-center">
            <div className="inline-flex items-center p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm gap-1">
              <button
                type="button"
                onClick={() => setRegion('iran')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isIran
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>🇮🇷 {t('pricing.iranCurrency')}</span>
              </button>
              <button
                type="button"
                onClick={() => setRegion('international')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  !isIran
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>🌐 {t('pricing.internationalCurrency')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan) => {
            const isPro = plan.popular;

            return (
              <div key={plan.slug} className="relative flex flex-col">
                {isPro && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 rounded-[20px] blur-sm opacity-70 -z-10" />
                )}

                <Card
                  hoverEffect
                  className={`p-7 flex flex-col justify-between text-start h-full relative ${
                    isPro
                      ? 'border-2 border-emerald-500 shadow-xl bg-white dark:bg-slate-900'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black bg-rose-500 text-white shadow-xs">
                      <Sparkles className="w-3 h-3" />
                      <span>{t('pricing.specialDiscount')}</span>
                    </span>

                    {isPro ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {t('pricing.mostPopular')}
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-500 font-mono">
                        {plan.duration}
                      </span>
                    )}
                  </div>

                  {/* Title & Desc */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 min-h-[36px] leading-relaxed">
                        {plan.desc}
                      </p>
                    </div>

                    {/* Price Section with Old Price Strikethrough & Region Detection */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-2">
                        {/* Strikethrough Old Price */}
                        <span className="text-sm line-through text-slate-400 font-mono tabular-nums font-bold">
                          {isIran
                            ? `${plan.oldPriceToman.toLocaleString(locale === 'fa' ? 'fa-IR' : 'en-US')} ${t('common.currencyToman')}`
                            : `${plan.oldPriceUsdt} USDT`}
                        </span>
                        <span className="text-[10px] bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 px-2 py-0.5 rounded font-black">
                          {t('pricing.off')}
                        </span>
                      </div>

                      {/* Current New Discounted Price */}
                      <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono tabular-nums flex items-baseline gap-1.5">
                        <span>
                          {isIran
                            ? plan.priceToman.toLocaleString(locale === 'fa' ? 'fa-IR' : 'en-US')
                            : plan.priceUsdt}
                        </span>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                          {isIran ? `${t('common.currencyToman')} / ${plan.duration}` : `USDT / ${plan.duration}`}
                        </span>
                      </div>

                      {/* Referral Commission Badge */}
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">{t('pricing.referralCommission')}</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
                          {plan.commissionPercent} ({isIran ? plan.commissionToman : plan.commissionUsdt})
                        </span>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                      {plan.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                    <Button
                      variant={isPro ? 'primary' : 'outline'}
                      className={`w-full py-3 text-xs sm:text-sm font-bold ${isPro ? 'shadow-glow' : ''}`}
                      onClick={() => onSelectPlan(plan.slug)}
                    >
                      {t('pricing.selectPlan')} {plan.duration}
                    </Button>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
