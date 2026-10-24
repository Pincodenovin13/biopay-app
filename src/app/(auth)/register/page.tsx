'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Store, ArrowRight, Sparkles } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { generateOtp, verifyOtp, setClientSession } from '../../../lib/auth';

export default function RegisterPage() {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [name, setName] = useState('');
  const [storeTitle, setStoreTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setError(null);
    setLoading(true);

    try {
      await generateOtp(phone);
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'خطا در ارسال کد تایید');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) return;
    setError(null);
    setLoading(true);

    try {
      const res = await verifyOtp(phone, otpCode);
      if (res.success && res.session) {
        setClientSession(res.session);
        if (typeof window !== 'undefined') {
          window.location.href = '/dashboard';
        }
      } else {
        setError(res.error || 'کد وارد شده نامعتبر است.');
      }
    } catch (err: any) {
      setError(err.message || 'خطا در تایید حساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md space-y-6"
      >
        {/* Brand */}
        <div className="text-center space-y-2">
          <a
            href="/"
            className="inline-flex items-center gap-2.5 text-xl font-black text-white hover:opacity-90 transition-opacity"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <Store className="w-5 h-5" />
            </div>
            <span>بایوپی | BioPay</span>
          </a>
          <h2 className="text-lg font-bold text-white">ساخت فروشگاه و شروع رایگان</h2>
          <p className="text-xs text-slate-400">
            فروشگاه اینستاگرامی اختصاصی خود را در کمتر از ۱ دقیقه فعال نمایید
          </p>
        </div>

        {/* Auth Card */}
        <Card className="p-6 bg-slate-900 border-slate-800 text-start space-y-5">
          {error && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300 text-xs">
              {error}
            </div>
          )}

          {step === 'details' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <Input
                label="نام و نام‌خانوادگی"
                placeholder="مثال: مریم رضایی"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-950 border-slate-700 text-white"
                required
              />
              <Input
                label="نام فروشگاه یا پیج اینستاگرام"
                placeholder="مثال: بوتیک تهرانو"
                value={storeTitle}
                onChange={(e) => setStoreTitle(e.target.value)}
                className="bg-slate-950 border-slate-700 text-white"
                required
              />
              <Input
                label="شماره موبایل"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-slate-950 border-slate-700 text-white font-mono text-start"
                required
              />
              <Input
                label="کد معرف (اختیاری)"
                placeholder="مثال: REF-99"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="bg-slate-950 border-slate-700 text-white font-mono"
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                isLoading={loading}
              >
                ادامه و دریافت کد تایید پیامکی
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-xs text-slate-400">
                کد ارسال شده به شماره <span className="font-mono text-emerald-400">{phone}</span> را وارد فرمایید (کد تستی: <span className="font-mono text-white">123456</span>):
              </div>
              <Input
                label="کد تایید ۶ رقمی"
                placeholder="123456"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="bg-slate-950 border-slate-700 text-white text-center font-mono text-xl tracking-widest"
                required
                autoFocus
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                isLoading={loading}
              >
                تکمیل ثبت‌نام و ورود به پنل
              </Button>
              <button
                type="button"
                onClick={() => setStep('details')}
                className="w-full text-center text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ویرایش اطلاعات اولیه
              </button>
            </form>
          )}

          <div className="pt-2 border-t border-slate-800 text-center text-xs text-slate-400">
            قبلاً ثبت‌نام کرده‌اید؟{' '}
            <a href="/login" className="text-emerald-400 hover:underline font-bold">
              ورود به حساب
            </a>
          </div>
        </Card>

        {/* Back Link */}
        <div className="text-center">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>بازگشت به صفحه اصلی</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
