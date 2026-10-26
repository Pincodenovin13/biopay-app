'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  CreditCard,
  Crown,
  Check,
  Sparkles,
  ShieldCheck,
  Calendar,
  Globe,
  Coins,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { UsdtPaymentModal } from '../../../../components/dashboard/UsdtPaymentModal';
import { paymentService, BioPayPlanSlug, BIOPAY_PLANS } from '../../../../lib/payment.service';

export default function PlanBillingPage() {
  const [currentPlan, setCurrentPlan] = useState<BioPayPlanSlug>('pro');
  const [region, setRegion] = useState<'iran' | 'international'>('iran');
  const [isUsdtModalOpen, setIsUsdtModalOpen] = useState(false);
  const [selectedPlanForUsdt, setSelectedPlanForUsdt] = useState<'Starter' | 'Pro' | 'Business'>('Pro');
  const [isProcessingZarinpal, setIsProcessingZarinpal] = useState(false);

  const plans = [
    {
      slug: 'starter' as BioPayPlanSlug,
      name: 'استارتر (Starter)',
      duration: '۱ ماهه',
      durationEn: '1 Month',
      priceToman: 5_000_000,
      oldPriceToman: 9_000_000,
      priceUsdt: 27,
      oldPriceUsdt: 45,
      commissionPercent: '۱۰٪',
      commissionDesc: '۵۰۰,۰۰۰ تومان / ۲.۷ تتر',
      desc: 'مناسب پیج‌های نوپا و فروشگاه‌های در حال رشد اینستاگرامی',
      features: [
        'مدت اشتراک: ۱ ماه',
        'تا ۵۰ محصول فعال در ویترین',
        'درگاه پرداخت شاپرک شتابی + کریپتو TRC20',
        'کارمزد ۲٪ روی تراکنش‌های مشتریان',
        '۱۰٪ پورسانت ارجاع دوستان',
      ],
    },
    {
      slug: 'pro' as BioPayPlanSlug,
      name: 'حرفه‌ای (Pro)',
      duration: '۲ ماهه',
      durationEn: '2 Months',
      priceToman: 9_000_000,
      oldPriceToman: 15_000_000,
      priceUsdt: 52,
      oldPriceUsdt: 80,
      commissionPercent: '۱۵٪',
      commissionDesc: '۱,۳۵۰,۰۰۰ تومان / ۷.۸ تتر',
      desc: 'محبوب‌ترین انتخاب برای برندها و فروشگاه‌های دارای فروش مستمر',
      features: [
        'مدت اشتراک: ۲ ماه (پیشنهادی)',
        'تا ۲۵۰ محصول فعال با دسته‌بندی دلخواه',
        'حذف نشان تبلیغاتی "BioPay" از فوتر ویترین',
        'کارمزد ویژه ۱.۵٪ روی تراکنش‌های مشتریان',
        '۱۵٪ کمیسیون ارجاع نقدی برای همکاران',
        'پشتیبانی VIP اختصاصی تلگرام',
      ],
    },
    {
      slug: 'business' as BioPayPlanSlug,
      name: 'سازمانی (Business)',
      duration: '۳ ماهه',
      durationEn: '3 Months',
      priceToman: 12_000_000,
      oldPriceToman: 20_000_000,
      priceUsdt: 75,
      oldPriceUsdt: 110,
      commissionPercent: '۲۰٪',
      commissionDesc: '۲,۴۰۰,۰۰۰ تومان / ۱۵ تتر',
      desc: 'حداکثر کارایی و بازدهی برای آنلاین‌شاپ‌های پرترافیک و شرکتی',
      features: [
        'مدت اشتراک: ۳ ماه (بیشترین صرفه اقتصادی)',
        'محصولات نامحدود (تا ۱۰۰۰ عدد)',
        'تا ۵ فروشگاه مجزا روی یک پنل',
        'کمترین کارمزد تراکنش: فقط ۱.۰٪',
        'بالاترین کمیسیون ارجاع: ۲۰٪ نقدی',
        'اتصال به دامنه اختصاصی (Custom Domain)',
        'مدیر حساب اختصاصی ۲۴ ساعته',
      ],
    },
  ];

  const handlePayZarinpal = async (planSlug: BioPayPlanSlug) => {
    setIsProcessingZarinpal(true);
    const planConfig = plans.find((p) => p.slug === planSlug);
    const amountToman = planConfig?.priceToman || 5000000;

    try {
      const response = await paymentService.createPayment({
        amount: amountToman,
        description: `خرید اشتراک ${planSlug} بایوپی`,
        callbackUrl: `${window.location.origin}/dashboard/plan?payment_status=success`,
        orderId: `SUB-${Date.now()}`,
      });

      if (response.success) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        alert(`هدایت به درگاه پرداخت زرین‌پال با شناسه پیگیری: ${response.authority}\n(شبیه‌سازی محیط تست شتابی)`);
        setCurrentPlan(planSlug);
      }
    } catch (err: any) {
      alert(`خطا در اتصال به درگاه: ${err.message}`);
    } finally {
      setIsProcessingZarinpal(false);
    }
  };

  const handleOpenUsdt = (planSlug: BioPayPlanSlug) => {
    const capitalized = planSlug === 'starter' ? 'Starter' : planSlug === 'pro' ? 'Pro' : 'Business';
    setSelectedPlanForUsdt(capitalized);
    setIsUsdtModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 text-start max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            <span>پلن‌های اشتراک و تمدید فروشگاه</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ۳ پلن اشتراک با تخفیف ویژه، درگاه پرداخت شتابی شاپرک و ارز دیجیتال تتر (USDT TRC20)
          </p>
        </div>

        {/* Currency / Region Toggle */}
        <div className="inline-flex items-center p-1 bg-slate-200 dark:bg-slate-800 rounded-xl text-xs font-bold gap-1 self-start sm:self-auto">
          <button
            onClick={() => setRegion('iran')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              region === 'iran'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>🇮🇷 تومان</span>
          </button>
          <button
            onClick={() => setRegion('international')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              region === 'international'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>🌐 USDT</span>
          </button>
        </div>
      </div>

      {/* Active Subscription Status Banner */}
      <Card className="p-5 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                اشتراک فعال: پلن حرفه‌ای (Pro) — ۲ ماهه
              </span>
              <Badge variant="success">فعال</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>مهلت تمدید بعدی: ۳۸ روز دیگر (۱۴۰۳/۱۰/۰۲)</span>
            </p>
          </div>
        </div>
        <div className="text-end">
          <div className="text-xs text-slate-500">کارمزد فروشگاهی</div>
          <div className="text-lg font-black text-emerald-600">۱.۵٪ روی تراکنش‌ها</div>
        </div>
      </Card>

      {/* 3 Plans Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.slug;

          return (
            <Card
              key={plan.slug}
              className={`p-6 space-y-6 relative flex flex-col justify-between ${
                isCurrent ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-500/5' : ''
              }`}
            >
              <div className="space-y-4">
                {/* Header & Discount Badge */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{plan.desc}</p>
                  </div>
                  <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 shrink-0">
                    <Sparkles className="w-3 h-3" />
                    تخفیف ویژه
                  </span>
                </div>

                {/* Price Display with Strikethrough & Region Detection */}
                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs line-through text-slate-400 font-mono font-bold">
                      {region === 'iran'
                        ? `${plan.oldPriceToman.toLocaleString('fa-IR')} تومان`
                        : `${plan.oldPriceUsdt} USDT`}
                    </span>
                    <span className="text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-1.5 py-0.5 rounded font-black">
                      OFF
                    </span>
                  </div>

                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono flex items-baseline gap-1.5">
                    <span>
                      {region === 'iran'
                        ? plan.priceToman.toLocaleString('fa-IR')
                        : plan.priceUsdt}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {region === 'iran' ? `تومان (${plan.duration})` : `USDT (${plan.durationEn})`}
                    </span>
                  </div>

                  <div className="text-[11px] text-amber-600 dark:text-amber-400 font-mono pt-1 border-t border-slate-200 dark:border-slate-700/60 flex justify-between">
                    <span>کمیسیون معرف:</span>
                    <span className="font-bold">{plan.commissionPercent} ({region === 'iran' ? plan.commissionDesc.split('/')[0].trim() : plan.commissionDesc.split('/')[1]?.trim() || ''})</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <Button
                  variant={isCurrent ? 'primary' : 'outline'}
                  className="w-full text-xs"
                  onClick={() => handlePayZarinpal(plan.slug)}
                  isLoading={isProcessingZarinpal}
                >
                  پرداخت با شتاب (زرین‌پال)
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-xs border border-slate-200 dark:border-slate-800"
                  onClick={() => handleOpenUsdt(plan.slug)}
                >
                  پرداخت با تتر (USDT TRC20)
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* USDT Payment Modal */}
      <UsdtPaymentModal
        isOpen={isUsdtModalOpen}
        onClose={() => setIsUsdtModalOpen(false)}
        planName={selectedPlanForUsdt}
        onPlanActivated={(planName, txHash) => {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          const slug = selectedPlanForUsdt.toLowerCase() as BioPayPlanSlug;
          setCurrentPlan(slug);
          setIsUsdtModalOpen(false);
          alert(`پرداخت تتری با موفقیت تایید شد! (هش: ${txHash})\nاشتراک ${planName} فعال گردید.`);
        }}
      />
    </motion.div>
  );
}
