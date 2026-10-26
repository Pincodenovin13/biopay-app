'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Store, Gift, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { generateOtp, verifyOtp, setClientSession } from '../../../lib/auth';
import { useI18n } from '../../../lib/i18n';
import { LanguageDropdown } from '../../../components/ui/LanguageDropdown';

export default function LoginPage() {
  const { t } = useI18n();
  const [role, setRole] = useState<'seller' | 'referrer'>('seller');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
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
          // Direct to corresponding dashboard
          window.location.href = role === 'seller' ? '/dashboard' : '/referral';
        }
      } else {
        setError(res.error || 'کد وارد شده نامعتبر است.');
      }
    } catch (err: any) {
      setError(err.message || 'خطا در اعتبارسنجی کد');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100">
      <div className="absolute top-4 end-4">
        <LanguageDropdown />
      </div>

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
            <span>{t('common.appName')} | BioPay</span>
          </a>
          <h2 className="text-lg font-bold text-white">
            {role === 'seller' ? t('auth.sellerLoginTitle') : t('auth.userLoginTitle')}
          </h2>
          <p className="text-xs text-slate-400">
            {role === 'seller' ? t('auth.sellerLoginSubtitle') : t('auth.userLoginSubtitle')}
          </p>
        </div>

        {/* Role Segmented Selector */}
        <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => setRole('seller')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              role === 'seller' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>{t('common.seller')}</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('referrer')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              role === 'referrer' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>{t('common.regularUser')}</span>
          </button>
        </div>

        {/* Auth Card */}
        <Card className="p-6 bg-slate-900 border-slate-800 text-start space-y-5">
          {error && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300 text-xs">
              {error}
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <Input
                label={t('auth.phone')}
                placeholder={t('auth.phonePlaceholder')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-slate-950 border-slate-700 text-white font-mono text-start"
                required
                autoFocus
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold"
                isLoading={loading}
              >
                {t('auth.sendOtp')}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-xs text-slate-400">
                {t('auth.testOtpHint')}
              </div>
              <Input
                label={t('auth.otpCodeLabel')}
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
                className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold"
                isLoading={loading}
              >
                {t('auth.verifyOtp')}
              </Button>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-center text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                {t('auth.editInitialInfo')}
              </button>
            </form>
          )}

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div>
              {t('auth.dontHaveAccount')}{' '}
              <a href="/register" className="text-emerald-400 hover:underline font-bold">
                {t('auth.registerFree')}
              </a>
            </div>
            <a href="/admin/login" className="text-slate-500 hover:text-slate-300 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>{t('common.admin')}</span>
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
            <span>{t('auth.backToHome')}</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
