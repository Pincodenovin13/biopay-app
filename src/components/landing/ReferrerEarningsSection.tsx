import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Coins, TrendingUp, DollarSign, ArrowUpRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useI18n } from '../../lib/i18n';

interface ReferrerEarningsSectionProps {
  onOpenReferral?: () => void;
}

export function ReferrerEarningsSection({ onOpenReferral }: ReferrerEarningsSectionProps) {
  const { t, locale, region } = useI18n();
  const [selectedPlanTier, setSelectedPlanTier] = useState<'starter' | 'pro' | 'business'>('business');

  const isIran = region === 'iran';

  const tiers = {
    starter: {
      name: t('pricing.starterTitle'),
      percent: locale === 'fa' ? '۱۰٪' : locale === 'ar' ? '١٠٪' : '10%',
      tomanPerSale: 500_000,
      usdtPerSale: 2.7,
      chartData: [500000, 1500000, 3500000, 6000000, 9500000, 14000000],
    },
    pro: {
      name: t('pricing.proTitle'),
      percent: locale === 'fa' ? '۱۵٪' : locale === 'ar' ? '١٥٪' : '15%',
      tomanPerSale: 1_350_000,
      usdtPerSale: 7.8,
      chartData: [1350000, 4050000, 8100000, 14850000, 22950000, 33750000],
    },
    business: {
      name: t('pricing.businessTitle'),
      percent: locale === 'fa' ? '۲۰٪' : locale === 'ar' ? '٢٠٪' : '20%',
      tomanPerSale: 2_400_000,
      usdtPerSale: 15.0,
      chartData: [2400000, 7200000, 16800000, 31200000, 52800000, 84000000],
    },
  };

  const currentTier = tiers[selectedPlanTier];

  return (
    <section id="earnings-section" className="py-20 lg:py-28 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-x-hidden border-b border-slate-800">
      {/* Floating Animated Coins & Currency Symbols */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Coin 1 */}
        <motion.div
          animate={{
            y: [0, -25, 0],
            rotate: [0, 15, -15, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-16 start-12 text-amber-400/40 text-4xl"
        >
          🪙
        </motion.div>

        {/* Floating Coin 2 */}
        <motion.div
          animate={{
            y: [0, 30, 0],
            rotate: [0, -20, 20, 0],
          }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 end-16 text-emerald-400/30 text-5xl"
        >
          <DollarSign className="w-12 h-12" />
        </motion.div>

        {/* Floating Coin 3 */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 start-1/4 text-amber-400/30 text-4xl"
        >
          🪙
        </motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Coins className="w-3.5 h-3.5" />
            <span>{t('earnings.badge')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {t('earnings.title')} <br />
            <span className="bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
              {t('earnings.titleAccent')}
            </span>
          </h2>

          <p className="text-xs sm:text-sm font-mono text-emerald-400 uppercase tracking-widest font-semibold">
            {t('earnings.subheadline')}
          </p>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t('earnings.desc')}
          </p>
        </div>

        {/* Commission Tier Selector */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 gap-1.5 shadow-md">
            {(['starter', 'pro', 'business'] as const).map((tierKey) => (
              <button
                key={tierKey}
                onClick={() => setSelectedPlanTier(tierKey)}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedPlanTier === tierKey
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tiers[tierKey].name} ({tiers[tierKey].percent})
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Preview & Chart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Left: Summary Card */}
          <div className="lg:col-span-5 space-y-4 text-start">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{t('earnings.commissionPerSale')}</span>
                <span className="font-bold text-amber-400 text-sm">{currentTier.percent} {t('earnings.cashReward')}</span>
              </div>

              <div className="space-y-1">
                <div className="text-3xl font-black text-white font-mono">
                  {isIran ? (
                    <>
                      {currentTier.tomanPerSale.toLocaleString(locale === 'fa' ? 'fa-IR' : 'en-US')}{' '}
                      <span className="text-sm font-normal text-slate-400">{t('common.currencyToman')}</span>
                    </>
                  ) : (
                    <>
                      {currentTier.usdtPerSale} <span className="text-sm font-normal text-slate-400">USDT</span>
                    </>
                  )}
                </div>
                <div className="text-xs font-mono text-emerald-400 font-semibold">
                  {isIran
                    ? `${t('earnings.equivalentUsdt')} ${currentTier.usdtPerSale} USDT ${t('earnings.tetherNetwork')}`
                    : `${currentTier.tomanPerSale.toLocaleString('en-US')} Toman`}
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t('earnings.instantPayoutNotice')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t('earnings.unlimitedReferralsNotice')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t('earnings.analyticsDashboardNotice')}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenReferral}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition shadow-md cursor-pointer"
              >
                <span>{t('earnings.getReferralLink')}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Animated SVG Line Chart Showing Growth Over 6 Months */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl text-start">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>{t('earnings.chartTitle')}</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {t('earnings.chartSubtitle')}
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800">
                +{currentTier.percent}
              </span>
            </div>

            {/* SVG Animated Chart */}
            <div className="relative pt-6 pb-2">
              <svg className="w-full h-44 overflow-visible" viewBox="0 0 500 160">
                {/* Horizontal grid lines */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="#334155" strokeDasharray="4 4" strokeWidth="0.8" />
                <line x1="0" y1="80" x2="500" y2="80" stroke="#334155" strokeDasharray="4 4" strokeWidth="0.8" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#334155" strokeDasharray="4 4" strokeWidth="0.8" />

                {/* Animated Line */}
                <motion.path
                  key={selectedPlanTier}
                  d="M 20 140 Q 110 120, 200 95 T 380 50 T 480 20"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                />

                {/* Area under curve gradient */}
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
                <path
                  d="M 20 140 Q 110 120, 200 95 T 380 50 T 480 20 L 480 150 L 20 150 Z"
                  fill="url(#chartGradient)"
                />

                {/* Data Points */}
                <circle cx="20" cy="140" r="4" fill="#34d399" />
                <circle cx="110" cy="120" r="4" fill="#34d399" />
                <circle cx="200" cy="95" r="4" fill="#34d399" />
                <circle cx="290" cy="72" r="4" fill="#34d399" />
                <circle cx="380" cy="50" r="4" fill="#34d399" />
                <circle cx="480" cy="20" r="6" fill="#10b981" stroke="#fff" strokeWidth="2" />
              </svg>

              {/* Month X Labels */}
              <div className="flex justify-between text-[11px] text-slate-400 font-mono pt-3">
                <span>{t('earnings.month1')}</span>
                <span>{t('earnings.month2')}</span>
                <span>{t('earnings.month3')}</span>
                <span>{t('earnings.month4')}</span>
                <span>{t('earnings.month5')}</span>
                <span className="text-emerald-400 font-bold">{t('earnings.month6')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
