import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Play, ShoppingBag, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { Button } from '../ui/Button';

interface HeroProps {
  onStartFree: () => void;
  onExploreDemo: () => void;
}

export function Hero({ onStartFree, onExploreDemo }: HeroProps) {
  const { t, direction } = useI18n();

  return (
    <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 bg-slate-950 text-white">
      {/* Background Animated Gradient Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -start-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -end-40 w-[30rem] h-[30rem] bg-emerald-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 start-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 text-start"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('hero.badge')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.2] text-white">
              {t('hero.title')}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              {t('hero.subtitle')}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={onStartFree}
                rightIcon={<ArrowRight className={`w-4 h-4 ${direction === 'rtl' ? 'rotate-180' : ''}`} />}
                className="shadow-glow"
              >
                {t('hero.ctaPrimary')}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={onExploreDemo}
                leftIcon={<Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />}
                className="border border-slate-700 bg-slate-900/80 hover:bg-slate-800"
              >
                {t('hero.ctaSecondary')}
              </Button>
            </div>

            {/* Social Trust Kicker */}
            <div className="pt-4 flex items-center gap-3 text-xs text-slate-400">
              <div className="flex -space-x-2 rtl:space-x-reverse overflow-hidden">
                <div className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 bg-amber-500 text-slate-950 font-bold text-center leading-7 text-[10px]">
                  MR
                </div>
                <div className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 bg-emerald-500 text-slate-950 font-bold text-center leading-7 text-[10px]">
                  AK
                </div>
                <div className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 bg-rose-500 text-white font-bold text-center leading-7 text-[10px]">
                  SB
                </div>
                <div className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 bg-indigo-500 text-white font-bold text-center leading-7 text-[10px]">
                  +
                </div>
              </div>
              <span className="font-medium text-slate-300">{t('hero.trustedBy')}</span>
            </div>
          </motion.div>

          {/* Right Column: Phone Mockup Storefront */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-[340px]">
              {/* Decorative Glow underneath phone */}
              <div className="absolute -inset-4 bg-linear-to-tr from-emerald-500/25 to-amber-500/20 rounded-[50px] blur-2xl -z-10" />

              {/* iPhone Hardware Frame */}
              <div className="w-full bg-slate-900 text-white rounded-[44px] p-3 shadow-2xl border-4 border-slate-700/80">
                {/* Dynamic Island / Notch */}
                <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto mb-3 flex items-center justify-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
                </div>

                {/* Simulated Storefront Screen */}
                <div className="bg-slate-950 rounded-[34px] p-4 text-center space-y-4 border border-slate-800">
                  {/* Store Profile */}
                  <div className="space-y-2">
                    <div className="w-16 h-16 rounded-full bg-linear-to-tr from-emerald-400 via-amber-400 to-rose-400 mx-auto p-0.5 shadow-lg">
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-black text-lg text-white">
                        TB
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1.5 font-bold text-sm text-white">
                        <span>بوتیک لباس تهرانو</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400 text-slate-950" />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">پوشاک ترند و مانتوهای لوکس بهاره</p>
                      <div className="mt-1 text-[11px] text-emerald-400 font-mono">biopay.me/tehrano_boutique</div>
                    </div>
                  </div>

                  {/* Interactive Product List Inside Phone */}
                  <div className="space-y-2.5 text-start">
                    {/* Item 1 */}
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs hover:border-emerald-500/50 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className="w-11 h-11 rounded-lg bg-emerald-950/80 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">کت لینن اورسایز بهاره</div>
                          <div className="text-[11px] text-emerald-400 font-mono tabular-nums font-bold">۷۸۰,۰۰۰ تومان</div>
                        </div>
                      </div>
                      <button
                        onClick={onExploreDemo}
                        className="px-3 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-btn transition-colors cursor-pointer"
                      >
                        خرید
                      </button>
                    </div>

                    {/* Item 2 */}
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs hover:border-emerald-500/50 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className="w-11 h-11 rounded-lg bg-amber-950/80 border border-amber-800/40 flex items-center justify-center text-amber-400">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">شومیز کرپ ژاکارد مجلسی</div>
                          <div className="text-[11px] text-emerald-400 font-mono tabular-nums font-bold">۵۲۰,۰۰۰ تومان</div>
                        </div>
                      </div>
                      <button
                        onClick={onExploreDemo}
                        className="px-3 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-btn transition-colors cursor-pointer"
                      >
                        خرید
                      </button>
                    </div>
                  </div>

                  {/* Fast Bank Checkout Pill */}
                  <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-[11px] text-emerald-300 flex items-center justify-center gap-1.5 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>پرداخت امن و تسویه خودکار روزانه</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
