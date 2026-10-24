import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Sparkles } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface PricingSectionProps {
  onSelectPlan: (planName: string) => void;
}

export function PricingSection({ onSelectPlan }: PricingSectionProps) {
  const { t, locale } = useI18n();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const currencyLabel = locale === 'en' ? 'USD / mo' : `${t('common.currencyToman')} / ماه`;

  return (
    <section id="pricing-section" className="py-24 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('pricing.title')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t('pricing.subtitle')}
          </p>

          {/* Monthly / Annual Billing Toggle */}
          <div className="pt-2 flex items-center justify-center">
            <div className="inline-flex items-center p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t('pricing.monthly')}
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{t('pricing.annual')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Plan 1: Free */}
          <Card hoverEffect className="p-8 flex flex-col justify-between text-start border-slate-200 dark:border-slate-800">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('pricing.freeTitle')}</h3>
                <p className="text-xs text-slate-500 leading-relaxed min-h-[32px]">{t('pricing.freeDesc')}</p>
                <div className="pt-3 text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
                  {t('pricing.freePrice')}{' '}
                  <span className="text-xs font-normal text-slate-500">{currencyLabel}</span>
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-6">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('pricing.freeFeat1')}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('pricing.freeFeat2')}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('pricing.freeFeat3')}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('pricing.freeFeat4')}</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onSelectPlan('free')}
              >
                {t('pricing.choosePlan')}
              </Button>
            </div>
          </Card>

          {/* Plan 2: Pro (Featured with Glow Effect) */}
          <div className="relative flex flex-col">
            {/* Subtle glow backdrop */}
            <div className="absolute -inset-1 bg-linear-to-r from-emerald-500 to-teal-500 rounded-[16px] blur-sm opacity-70 -z-10" />

            <Card
              hoverEffect
              className="p-8 flex flex-col justify-between text-start border-2 border-emerald-500 shadow-glow bg-white dark:bg-slate-900 h-full relative"
            >
              {/* Most Popular Badge */}
              <div className="absolute top-0 end-8 -translate-y-1/2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md">
                  <Sparkles className="w-3 h-3" />
                  <span>محبوب‌ترین انتخاب</span>
                </span>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('pricing.proTitle')}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed min-h-[32px]">{t('pricing.proDesc')}</p>
                  <div className="pt-3 text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                    {billingCycle === 'annual' ? t('pricing.proPriceAnnual') : t('pricing.proPriceMonthly')}{' '}
                    <span className="text-xs font-normal text-slate-500">{currencyLabel}</span>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-6">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-900 dark:text-white">{t('pricing.proFeat1')}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t('pricing.proFeat2')}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-900 dark:text-white">{t('pricing.proFeat3')}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t('pricing.proFeat4')}</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <Button
                  variant="primary"
                  className="w-full shadow-glow"
                  onClick={() => onSelectPlan('pro')}
                >
                  {t('pricing.choosePlan')}
                </Button>
              </div>
            </Card>
          </div>

          {/* Plan 3: Enterprise */}
          <Card hoverEffect className="p-8 flex flex-col justify-between text-start border-slate-200 dark:border-slate-800">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('pricing.enterpriseTitle')}</h3>
                <p className="text-xs text-slate-500 leading-relaxed min-h-[32px]">{t('pricing.enterpriseDesc')}</p>
                <div className="pt-3 text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
                  {billingCycle === 'annual' ? t('pricing.enterprisePriceAnnual') : t('pricing.enterprisePriceMonthly')}{' '}
                  <span className="text-xs font-normal text-slate-500">{currencyLabel}</span>
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-6">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-900 dark:text-white">{t('pricing.enterpriseFeat1')}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('pricing.enterpriseFeat2')}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-900 dark:text-white">{t('pricing.enterpriseFeat3')}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('pricing.enterpriseFeat4')}</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onSelectPlan('enterprise')}
              >
                {t('pricing.choosePlan')}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
