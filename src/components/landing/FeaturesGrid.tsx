import React from 'react';
import { motion } from 'motion/react';
import { Smartphone, CreditCard, MessageCircle, Image, Gift, ShieldCheck } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { Card } from '../ui/Card';

export function FeaturesGrid() {
  const { t } = useI18n();

  const features = [
    {
      icon: <Smartphone className="w-6 h-6 text-emerald-600" />,
      title: t('features.item1Title'),
      desc: t('features.item1Desc'),
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    },
    {
      icon: <CreditCard className="w-6 h-6 text-emerald-600" />,
      title: t('features.item2Title'),
      desc: t('features.item2Desc'),
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-emerald-600" />,
      title: t('features.item3Title'),
      desc: t('features.item3Desc'),
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    },
    {
      icon: <Image className="w-6 h-6 text-emerald-600" />,
      title: t('features.item4Title'),
      desc: t('features.item4Desc'),
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    },
    {
      icon: <Gift className="w-6 h-6 text-emerald-600" />,
      title: t('features.item5Title'),
      desc: t('features.item5Desc'),
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: t('features.item6Title'),
      desc: t('features.item6Desc'),
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    },
  ];

  return (
    <section id="features-section" className="py-24 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('features.title')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t('features.subtitle')}
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card
                hoverEffect
                className="p-8 h-full flex flex-col justify-between text-start border-slate-200/90 dark:border-slate-800"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl ${feat.bg} flex items-center justify-center shadow-xs`}>
                    {feat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {feat.desc}
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
