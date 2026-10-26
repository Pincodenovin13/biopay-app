import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { CircularProgress } from '../ui/CircularProgress';
import { Card } from '../ui/Card';
import { useI18n } from '../../lib/i18n';

interface CounterProps {
  end: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
  locale: string;
}

function AnimatedCounter({ end, suffix = '', decimals = 0, duration = 2, locale }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const startTime = performance.now();
    const totalMs = duration * 1000;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / totalMs, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = start + (end - start) * ease;
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(tick);
  }, [isInView, end, duration]);

  const numVal = decimals > 0 ? count.toFixed(decimals) : Math.floor(count);
  const formatted =
    locale === 'fa'
      ? Number(numVal).toLocaleString('fa-IR')
      : locale === 'ar'
      ? Number(numVal).toLocaleString('ar-SA')
      : Number(numVal).toLocaleString('en-US');

  return (
    <span ref={ref} className="font-mono font-black tabular-nums">
      {formatted}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  const { t, locale } = useI18n();

  const stats = [
    {
      percentage: 95,
      targetNum: 10,
      suffix: 'K+',
      title: t('stats.sellersTitle'),
      caption: t('stats.sellersCaption'),
      color: '#10b981', // Emerald
    },
    {
      percentage: 88,
      targetNum: 250,
      suffix: locale === 'en' ? 'M+' : 'M',
      title: t('stats.volumeTitle'),
      caption: t('stats.volumeCaption'),
      color: '#f59e0b', // Amber
    },
    {
      percentage: 99.9,
      targetNum: 99.9,
      suffix: '%',
      decimals: 1,
      title: t('stats.uptimeTitle'),
      caption: t('stats.uptimeCaption'),
      color: '#059669', // Dark Emerald
    },
    {
      percentage: 98.6,
      targetNum: 98.6,
      suffix: '%',
      decimals: 1,
      title: t('stats.satisfactionTitle'),
      caption: t('stats.satisfactionCaption'),
      color: '#3b82f6', // Blue
    },
  ];

  return (
    <section className="py-20 lg:py-24 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            {t('stats.badge')}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('stats.title')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t('stats.subtitle')}
          </p>
        </div>

        {/* 4 Cards with Circular Progress Rings & Animated Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card hoverEffect className="p-6 text-center space-y-5 h-full flex flex-col items-center justify-between">
                {/* Circular Progress Ring */}
                <CircularProgress
                  percentage={item.percentage}
                  size={120}
                  strokeWidth={10}
                  color={item.color}
                  label={
                    <div className="text-sm font-black text-slate-900 dark:text-white">
                      <AnimatedCounter
                        end={item.targetNum}
                        suffix={item.suffix}
                        decimals={item.decimals}
                        locale={locale}
                      />
                    </div>
                  }
                />

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.caption}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
