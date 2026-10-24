import React from 'react';
import { motion } from 'motion/react';
import { useI18n } from '../../lib/i18n';
import { CircularProgress } from '../ui/CircularProgress';
import { Card } from '../ui/Card';

export function StatsSection() {
  const { t } = useI18n();

  const stats = [
    {
      percentage: 95,
      label: t('stats.sellers'),
      sublabel: t('stats.sellersLabel'),
      color: '#10b981', // Emerald
      caption: 'بیش از ۱۰ هزار آنلاین‌شاپ فعال و رو به رشد',
    },
    {
      percentage: 88,
      label: t('stats.volume'),
      sublabel: t('stats.volumeLabel'),
      color: '#f59e0b', // Amber
      caption: 'گردش مالی ثبت‌شده در شبکه فروشگاهی',
    },
    {
      percentage: 99.9,
      label: t('stats.uptime'),
      sublabel: t('stats.uptimeLabel'),
      color: '#059669', // Dark Emerald
      caption: 'پایداری بدون قطعی حتی در ساعات اوج خرید',
    },
    {
      percentage: 98.6,
      label: t('stats.satisfaction'),
      sublabel: t('stats.satisfactionLabel'),
      color: '#3b82f6', // Blue
      caption: 'شاخص رضایت خریداران در تجربه تسویه',
    },
  ];

  return (
    <section className="py-24 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('stats.title')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t('stats.subtitle')}
          </p>
        </div>

        {/* 4 Cards with Circular Progress Rings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
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
                  label={item.label}
                />

                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.sublabel}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
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
