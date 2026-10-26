import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Store, PlusCircle, Share2, Instagram, Check, Copy, ExternalLink, Sparkles } from 'lucide-react';
import { useI18n } from '../../lib/i18n';

export function SalesHowItWorks() {
  const { t } = useI18n();
  const [activeStep, setActiveStep] = useState(0);
  const [copied, setCopied] = useState(false);

  // Auto-cycle through the 3 steps every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    {
      step: 1,
      title: t('howItWorks.step1Title'),
      desc: t('howItWorks.step1Desc'),
      icon: Store,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      step: 2,
      title: t('howItWorks.step2Title'),
      desc: t('howItWorks.step2Desc'),
      icon: PlusCircle,
      color: 'from-amber-500 to-orange-500',
    },
    {
      step: 3,
      title: t('howItWorks.step3Title'),
      desc: t('howItWorks.step3Desc'),
      icon: Share2,
      color: 'from-rose-500 to-purple-500',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('howItWorks.badge')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            {t('howItWorks.title')}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        {/* 3 Animated Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = activeStep === index;

            return (
              <motion.div
                key={index}
                onClick={() => setActiveStep(index)}
                whileHover={{ scale: 1.02 }}
                className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden text-start ${
                  isActive
                    ? 'bg-slate-800/90 border-emerald-500 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Active Indicator Top Line */}
                {isActive && (
                  <motion.div
                    layoutId="activeStepLine"
                    className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400"
                  />
                )}

                <div className="space-y-4">
                  {/* Step Icon */}
                  <motion.div
                    animate={
                      isActive
                        ? index === 0
                          ? { rotate: [0, -10, 10, 0] }
                          : index === 1
                          ? { scale: [1, 1.2, 1] }
                          : { scale: [1, 1.15, 1], rotate: [0, 15, -15, 0] }
                        : {}
                    }
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </motion.div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Video / Animated Showcase Display */}
        <div className="max-w-4xl mx-auto rounded-3xl p-4 sm:p-6 bg-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute top-0 end-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Player Topbar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="font-mono text-slate-300 ms-2">{t('howItWorks.liveShowcase')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE SHOWCASE</span>
            </div>
          </div>

          {/* Simulated Looping Showcase Canvas */}
          <div className="py-6 sm:py-8 px-2 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-start">
            {/* Left: Animated Step Visuals */}
            <div className="space-y-4">
              {activeStep === 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-3"
                >
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-white text-base">
                        MS
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">{t('howItWorks.sampleStoreName')}</div>
                        <div className="text-xs text-emerald-400 font-mono">biopay.me/s/mezon_salimi</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-300">
                      {t('howItWorks.fastRegistration')}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-3"
                >
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-400">{t('howItWorks.quickUpload')}</span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded">{t('howItWorks.inStock')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-lg bg-emerald-900/40 border border-emerald-700/50 flex items-center justify-center text-emerald-300">
                        <Store className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">{t('howItWorks.sampleProductTitle')}</div>
                        <div className="text-xs font-mono font-bold text-emerald-400">{t('howItWorks.sampleProductPrice')}</div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {activeStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-3"
                >
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <Instagram className="w-4 h-4 text-pink-500" />
                      <span>{t('howItWorks.bioLinkHint')}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 justify-between">
                      <span className="truncate">https://biopay.me/s/mezon_salimi</span>
                      <button
                        onClick={() => {
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-sans flex items-center gap-1 transition cursor-pointer shrink-0"
                      >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? t('howItWorks.copied') : t('howItWorks.copyLink')}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right: Simulated Instagram Bio Card Preview */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{t('howItWorks.previewBioTitle')}</span>
                <span className="text-pink-400 flex items-center gap-1 text-[11px]">
                  <Instagram className="w-3.5 h-3.5" />
                  Instagram
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 p-0.5">
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-bold text-white text-sm">
                    MS
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white">mezon_salimi</div>
                  <div className="text-[11px] text-slate-400">{t('howItWorks.sampleStoreBio')}</div>
                </div>
              </div>

              {/* Pulsing Bio Link */}
              <motion.div
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 flex items-center justify-between text-xs font-semibold"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="font-mono">biopay.me/s/mezon_salimi</span>
                </div>
                <span className="text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded font-black">
                  {t('howItWorks.onlineShoppingBadge')}
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
