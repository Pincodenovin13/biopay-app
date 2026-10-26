import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Play, ShoppingBag, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { Button } from '../ui/Button';

interface HeroProps {
  onStartFree: () => void;
  onExploreDemo: () => void;
}

export function Hero({ onStartFree, onExploreDemo }: HeroProps) {
  const { t, direction } = useI18n();

  return (
    <section className="relative overflow-x-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-slate-950 text-white min-h-[90vh] flex items-center">
      {/* Animated Moving Gradient Background Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            x: [0, 60, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-40 -start-40 w-[36rem] h-[36rem] bg-emerald-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 0.9, 1.2],
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/3 -end-40 w-[38rem] h-[38rem] bg-teal-500/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [0.9, 1.3, 0.9],
            x: [0, 40, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-20 start-1/4 w-[32rem] h-[32rem] bg-amber-500/10 rounded-full blur-3xl"
        />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:28px_28px] opacity-25" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Text & Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 text-start"
          >
            {/* Animated Pill Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span>{t('hero.badge')}</span>
            </motion.div>

            {/* Main Headline: Animated Text */}
            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.2] text-white"
              >
                {t('hero.title')} <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                  {t('hero.titleAccent')}
                </span>
              </motion.h1>

              {/* Sub-headline animated marquee / badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xs sm:text-sm font-mono text-emerald-400/90 font-semibold tracking-wider uppercase pt-1"
              >
                {t('hero.subheadline')}
              </motion.div>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              {t('hero.subtitle')}
            </p>

            {/* CTAs with Pulsing Primary Button */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <motion.div
                animate={{
                  scale: [1, 1.03, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(16, 185, 129, 0.4)',
                    '0 0 0 14px rgba(16, 185, 129, 0)',
                    '0 0 0 0 rgba(16, 185, 129, 0)',
                  ],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="rounded-xl"
              >
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onStartFree}
                  rightIcon={<ArrowRight className={`w-4 h-4 ${direction === 'rtl' ? 'rotate-180' : ''}`} />}
                  className="shadow-glow font-extrabold text-sm sm:text-base px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400"
                >
                  {t('hero.ctaPrimary')}
                </Button>
              </motion.div>

              <Button
                variant="secondary"
                size="lg"
                onClick={onExploreDemo}
                leftIcon={<Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />}
                className="border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-sm sm:text-base"
              >
                {t('hero.ctaSecondary')}
              </Button>
            </div>

            {/* Social Trust Kicker */}
            <div className="pt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <div className="flex -space-x-2 rtl:space-x-reverse overflow-hidden">
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-amber-500 text-slate-950 font-bold text-center leading-8 text-[11px]">
                  MR
                </div>
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-emerald-500 text-slate-950 font-bold text-center leading-8 text-[11px]">
                  AK
                </div>
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-rose-500 text-white font-bold text-center leading-8 text-[11px]">
                  SB
                </div>
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-indigo-500 text-white font-bold text-center leading-8 text-[11px]">
                  +10k
                </div>
              </div>
              <span className="font-medium text-slate-300">
                {t('hero.trustedBy')}
              </span>
            </div>
          </motion.div>

          {/* Right Column: Floating 3D Phone Mockup Storefront */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center"
          >
            <motion.div
              animate={{
                y: [0, -12, 0],
                rotateZ: [0, 0.6, 0, -0.6, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative w-full max-w-[340px]"
            >
              {/* 3D Drop Glow Shadow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/30 via-teal-500/20 to-amber-500/20 rounded-[50px] blur-2xl -z-10" />

              {/* Hardware Frame (iPhone 3D look) */}
              <div className="w-full bg-slate-900 text-white rounded-[44px] p-3 shadow-2xl border-4 border-slate-700/80 backdrop-blur-xl">
                {/* Dynamic Island Notch */}
                <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto mb-3 flex items-center justify-center gap-1.5 shadow-inner">
                  <div className="w-2 h-2 rounded-full bg-emerald-500/70" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                </div>

                {/* Simulated Storefront Screen */}
                <div className="bg-slate-950 rounded-[34px] p-4 text-center space-y-4 border border-slate-800">
                  {/* Store Profile */}
                  <div className="space-y-2">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-400 via-amber-400 to-rose-400 mx-auto p-0.5 shadow-lg">
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-black text-lg text-white">
                        TB
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1.5 font-bold text-sm text-white">
                        <span>{t('hero.previewStoreName')}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400 text-slate-950" />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{t('hero.previewStoreBio')}</p>
                      <div className="mt-1 text-[11px] text-emerald-400 font-mono">biopay.me/s/tehrano_boutique</div>
                    </div>
                  </div>

                  {/* Interactive Product List Inside Phone */}
                  <div className="space-y-2 text-start">
                    {/* Item 1 */}
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs hover:border-emerald-500/50 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800/40 flex items-center justify-center text-emerald-400 shrink-0">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div className="truncate">
                          <div className="font-semibold text-white truncate">{t('hero.item1Title')}</div>
                          <div className="text-[11px] text-emerald-400 font-mono font-bold">{t('hero.item1Price')}</div>
                        </div>
                      </div>
                      <button
                        onClick={onExploreDemo}
                        className="px-3 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        {t('hero.buy')}
                      </button>
                    </div>

                    {/* Item 2 */}
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs hover:border-emerald-500/50 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-lg bg-amber-950/80 border border-amber-800/40 flex items-center justify-center text-amber-400 shrink-0">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div className="truncate">
                          <div className="font-semibold text-white truncate">{t('hero.item2Title')}</div>
                          <div className="text-[11px] text-emerald-400 font-mono font-bold">{t('hero.item2Price')}</div>
                        </div>
                      </div>
                      <button
                        onClick={onExploreDemo}
                        className="px-3 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        {t('hero.buy')}
                      </button>
                    </div>
                  </div>

                  {/* Fast Bank Checkout Pill */}
                  <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-[11px] text-emerald-300 flex items-center justify-center gap-1.5 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{t('hero.secureCheckoutBadge')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
