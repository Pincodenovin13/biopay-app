import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { useI18n } from '../../lib/i18n';

const PARTNER_LOGOS = [
  { name: 'Tehran Fashion', symbol: 'TF' },
  { name: 'Barista Brew Lab', symbol: 'BL' },
  { name: 'Arya Silver Studio', symbol: 'AS' },
  { name: 'Rayan Digital Gear', symbol: 'RD' },
  { name: 'Shiraz Leather Co.', symbol: 'SL' },
  { name: 'Luxe Cosmetics', symbol: 'LC' },
];

export function SocialProof() {
  const { t, direction } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: t('testimonials.t1Name'),
      role: t('testimonials.t1Role'),
      avatar: 'MR',
      color: 'bg-emerald-600',
      type: t('testimonials.t1Badge'),
      content: t('testimonials.t1Quote'),
      rating: 5,
    },
    {
      id: 2,
      name: t('testimonials.t2Name'),
      role: t('testimonials.t2Role'),
      avatar: 'SB',
      color: 'bg-rose-600',
      type: t('testimonials.t2Badge'),
      content: t('testimonials.t2Quote'),
      rating: 5,
    },
    {
      id: 3,
      name: t('testimonials.t3Name'),
      role: t('testimonials.t3Role'),
      avatar: 'AK',
      color: 'bg-amber-600',
      type: t('testimonials.t3Badge'),
      content: t('testimonials.t3Quote'),
      rating: 5,
    },
    {
      id: 4,
      name: t('testimonials.t4Name'),
      role: t('testimonials.t4Role'),
      avatar: 'NA',
      color: 'bg-purple-600',
      type: t('testimonials.t4Badge'),
      content: t('testimonials.t4Quote'),
      rating: 5,
    },
  ];

  // 5-second auto-rotating carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const current = testimonials[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 lg:py-28 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Partner Logos */}
        <div className="text-center space-y-6">
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">
            {t('testimonials.trustedByBrands')}
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

        {/* Testimonials Auto-Rotating Carousel */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {t('testimonials.badge')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {t('testimonials.title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {t('testimonials.subtitle')}
            </p>
          </div>

          <div className="max-w-3xl mx-auto relative px-4">
            <Card hoverEffect className="p-8 sm:p-10 relative overflow-hidden bg-slate-50/80 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800">
              <Quote className="absolute top-6 end-8 w-16 h-16 text-slate-200 dark:text-slate-800 -z-0 opacity-40 pointer-events-none" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6 relative z-10 text-start"
                >
                  {/* Rating Stars & Badge */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(current.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {current.type}
                    </span>
                  </div>

                  {/* Testimonial Quote */}
                  <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    "{current.content}"
                  </p>

                  {/* Author Meta */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-full ${current.color} text-white font-bold flex items-center justify-center text-sm shadow-sm`}>
                        {current.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{current.name}</span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{current.role}</div>
                      </div>
                    </div>

                    {/* Progress Dots */}
                    <div className="flex items-center gap-1.5">
                      {testimonials.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          onClick={() => setCurrentIndex(dotIdx)}
                          className={`h-2 rounded-full transition-all cursor-pointer ${
                            currentIndex === dotIdx
                              ? 'w-6 bg-emerald-500'
                              : 'w-2 bg-slate-300 dark:bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </Card>

            {/* Prev/Next Navigation Controls */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                aria-label="Previous testimonial"
              >
                {direction === 'rtl' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                aria-label="Next testimonial"
              >
                {direction === 'rtl' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
