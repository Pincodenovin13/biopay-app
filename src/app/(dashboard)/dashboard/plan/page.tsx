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
  Layers,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { UsdtPaymentModal } from '../../../../components/dashboard/UsdtPaymentModal';
import { paymentService } from '../../../../lib/payment.service';

export default function PlanBillingPage() {
  const [currentPlan, setCurrentPlan] = useState<'STARTER' | 'PRO'>('PRO');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [isUsdtModalOpen, setIsUsdtModalOpen] = useState(false);
  const [selectedPlanForUsdt, setSelectedPlanForUsdt] = useState<'Starter' | 'Pro'>('Pro');
  const [isProcessingZarinpal, setIsProcessingZarinpal] = useState(false);

  const handlePayZarinpal = async (plan: 'Starter' | 'Pro') => {
    setIsProcessingZarinpal(true);
    const amountToman = plan === 'Starter'
      ? (billingPeriod === 'monthly' ? 9000000 : 86400000)
      : (billingPeriod === 'monthly' ? 12000000 : 115200000);

    try {
      const response = await paymentService.createPayment({
        amount: amountToman,
        description: `خرید اشتراک ${plan} بایوپی`,
        callbackUrl: `${window.location.origin}/dashboard/plan?payment_status=success`,
        orderId: `SUB-${Date.now()}`,
      });

      if (response.success) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        alert(`هدایت به درگاه پرداخت زرین‌پال با شناسه پیگیری: ${response.authority}\n(شبیه‌سازی محیط تست شتاب)`);
        setCurrentPlan(plan === 'Starter' ? 'STARTER' : 'PRO');
      }
    } catch (err: any) {
      alert(`خطا در اتصال به درگاه: ${err.message}`);
    } finally {
      setIsProcessingZarinpal(false);
    }
  };

  const handleOpenUsdt = (plan: 'Starter' | 'Pro') => {
    setSelectedPlanForUsdt(plan);
    setIsUsdtModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 text-start max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            <span>طرح‌های اشتراک و تمدید حساب</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            پشتیبانی از پرداخت آنلاین شتابی زرین‌پال و ارز دیجیتال تتر (USDT TRC20)
          </p>
        </div>

        {/* Monthly / Annual Toggle */}
        <div className="flex items-center gap-2 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto text-xs font-bold">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              billingPeriod === 'monthly'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ماهانه
          </button>
          <button
            onClick={() => setBillingPeriod('annual')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              billingPeriod === 'annual'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>سالانه</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded-md">
              ۲۰٪ تخفیف
            </span>
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
                اشتراک فعال: پلن حرفه‌ای (Pro)
              </span>
              <Badge variant="success">فعال</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>تمدید خودکار بعدی: ۲۴ روز دیگر (۱۴۰۳/۰۹/۲۰)</span>
            </p>
          </div>
        </div>
        <div className="text-end">
          <div className="text-xs text-slate-500">کارمزد فروشگاهی</div>
          <div className="text-lg font-black text-emerald-600">۱.۰٪ روی تراکنش‌ها</div>
        </div>
      </Card>

      {/* Plans Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Starter Plan */}
        <Card className={`p-6 space-y-6 relative ${currentPlan === 'STARTER' ? 'ring-2 ring-emerald-500' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">پلن استارتر (Starter)</h3>
              <p className="text-xs text-slate-500 mt-0.5">مناسب پیج‌های نوپا و فروشگاه‌های در حال رشد</p>
            </div>
            {currentPlan === 'STARTER' && <Badge variant="success">پلن فعلی</Badge>}
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                {billingPeriod === 'monthly' ? '۹,۰۰۰,۰۰۰' : '۸۶,۴۰۰,۰۰۰'}
              </span>
              <span className="text-xs text-slate-500">تومان / {billingPeriod === 'monthly' ? 'ماهانه' : 'سالانه'}</span>
            </div>
            <div className="text-xs font-mono text-emerald-600 font-semibold">
              معادل ۲۶ USDT (تتر TRC20)
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>تا ۵۰ محصول فعال در ویترین</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>درگاه شتابی زرین‌پال + پرداخت تتری TRC20</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>کارمزد ۲٪ روی تراکنش‌های مشتریان</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>۱۰٪ کمیسیون ارجاع دوستان</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handlePayZarinpal('Starter')}
              isLoading={isProcessingZarinpal}
            >
              پرداخت با زرین‌پال
            </Button>
            <Button
              variant="ghost"
              className="flex-1 border border-slate-200 dark:border-slate-800"
              onClick={() => handleOpenUsdt('Starter')}
            >
              پرداخت با تتر (USDT)
            </Button>
          </div>
        </Card>

        {/* Pro Plan */}
        <Card className={`p-6 space-y-6 relative border-emerald-500/50 ${currentPlan === 'PRO' ? 'ring-2 ring-emerald-500 bg-emerald-500/5' : ''}`}>
          <div className="absolute -top-3 end-6">
            <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              پیشنهاد ویژه
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">پلن حرفه‌ای (Pro)</h3>
              <p className="text-xs text-slate-500 mt-0.5">برای فروشگاه‌های حرفه‌ای با تیراژ فروش بالا</p>
            </div>
            {currentPlan === 'PRO' && <Badge variant="success">پلن فعال شما</Badge>}
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                {billingPeriod === 'monthly' ? '۱۲,۰۰۰,۰۰۰' : '۱۱۵,۲۰۰,۰۰۰'}
              </span>
              <span className="text-xs text-slate-500">تومان / {billingPeriod === 'monthly' ? 'ماهانه' : 'سالانه'}</span>
            </div>
            <div className="text-xs font-mono text-emerald-600 font-semibold">
              معادل ۵۳ USDT (تتر TRC20)
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold text-slate-900 dark:text-white">محصولات نامحدود (تا ۵۰۰ محصول)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>حذف کامل لوگو و برندینگ "BioPay"</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold text-emerald-600">کارمزد فوق‌العاده ۱٪ روی تراکنش‌ها</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold text-emerald-600">۱۵٪ کمیسیون ارجاع برای همکاران</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>پشتیبانی VIP اختصاصی ۲۴/۷ تلگرام</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => handlePayZarinpal('Pro')}
              isLoading={isProcessingZarinpal}
            >
              تمدید با زرین‌پال
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleOpenUsdt('Pro')}
            >
              پرداخت با تتر (USDT)
            </Button>
          </div>
        </Card>
      </div>

      {/* USDT Payment Modal */}
      <UsdtPaymentModal
        isOpen={isUsdtModalOpen}
        onClose={() => setIsUsdtModalOpen(false)}
        planName={selectedPlanForUsdt}
        onPlanActivated={(planName, txHash) => {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          setCurrentPlan(selectedPlanForUsdt === 'Starter' ? 'STARTER' : 'PRO');
          setIsUsdtModalOpen(false);
          alert(`پرداخت تتری تایید شد! (هش تراکنش: ${txHash})\nاشتراک ${planName} شما با موفقیت فعال گردید.`);
        }}
      />
    </motion.div>
  );
}
