'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Store, Gift, ShieldAlert, ArrowRight, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { generateOtp, verifyOtp, setClientSession } from '../../../lib/auth';
import { useI18n } from '../../../lib/i18n';
import { LanguageDropdown } from '../../../components/ui/LanguageDropdown';

export type UserRoleChoice = 'seller' | 'referrer' | 'admin';

export default function RegisterPage() {
  const { t, locale } = useI18n();

  // Registration multi-step state
  const [step, setStep] = useState<'role' | 'details' | 'otp'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRoleChoice>('seller');

  // Form fields
  const [name, setName] = useState('');
  const [storeTitle, setStoreTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [payoutMethod, setPayoutMethod] = useState<'sheba' | 'tether'>('sheba');
  const [payoutValue, setPayoutValue] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectRole = (role: UserRoleChoice) => {
    if (role === 'admin') {
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
      return;
    }
    setSelectedRole(role);
    setStep('details');
  };

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
        // Save session with matching role
        const sessionWithRole = {
          ...res.session,
          role: selectedRole === 'seller' ? ('USER' as const) : ('USER' as const),
          storeSlug: selectedRole === 'seller' ? storeTitle.toLowerCase().replace(/\s+/g, '-') : undefined,
        };
        setClientSession(sessionWithRole);

        // Redirect based on selected role:
        // Seller -> /dashboard
        // Regular user -> /referral
        if (typeof window !== 'undefined') {
          window.location.href = selectedRole === 'seller' ? '/dashboard' : '/referral';
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

          {step === 'role' && (
            <>
              <h2 className="text-lg font-bold text-white">{t('auth.selectRoleTitle')}</h2>
              <p className="text-xs text-slate-400">{t('auth.selectRoleSubtitle')}</p>
            </>
          )}

          {step === 'details' && (
            <>
              <h2 className="text-lg font-bold text-white">
                {selectedRole === 'seller' ? t('auth.sellerRegisterTitle') : t('auth.userRegisterTitle')}
              </h2>
              <p className="text-xs text-slate-400">
                {selectedRole === 'seller' ? t('auth.sellerRegisterSubtitle') : t('auth.userRegisterSubtitle')}
              </p>
            </>
          )}

          {step === 'otp' && (
            <>
              <h2 className="text-lg font-bold text-white">{t('auth.verifyOtp')}</h2>
              <p className="text-xs text-slate-400">
                {t('auth.enterOtpSentTo', { phone })}
              </p>
            </>
          )}
        </div>

        {/* Main Card */}
        <Card className="p-6 bg-slate-900 border-slate-800 text-start space-y-5">
          {error && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* STEP 1: ROLE SELECTION */}
          {step === 'role' && (
            <div className="space-y-4">
              {/* Option A: Seller */}
              <button
                type="button"
                onClick={() => handleSelectRole('seller')}
                className="w-full p-4 rounded-xl border border-slate-700 bg-slate-950/80 hover:border-emerald-500 hover:bg-slate-800/80 transition flex items-start gap-3.5 text-start cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                  <Store className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="font-bold text-sm text-white flex items-center justify-between">
                    <span>{t('auth.roleSeller')}</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
                      {t('common.seller')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {t('auth.roleSellerDesc')}
                  </p>
                </div>
              </button>

              {/* Option B: Regular User / Referrer */}
              <button
                type="button"
                onClick={() => handleSelectRole('referrer')}
                className="w-full p-4 rounded-xl border border-slate-700 bg-slate-950/80 hover:border-teal-500 hover:bg-slate-800/80 transition flex items-start gap-3.5 text-start cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-teal-600/20 border border-teal-500/40 text-teal-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                  <Gift className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="font-bold text-sm text-white flex items-center justify-between">
                    <span>{t('auth.roleUser')}</span>
                    <span className="text-[10px] bg-teal-950 text-teal-400 px-2 py-0.5 rounded font-mono font-bold">
                      {t('common.regularUser')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {t('auth.roleUserDesc')}
                  </p>
                </div>
              </button>

              {/* Option C: Hidden Platform Admin Login Link */}
              <div className="pt-3 border-t border-slate-800 text-center">
                <a
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <Lock className="w-3 h-3" />
                  <span>{t('auth.roleAdmin')}</span>
                </a>
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS FORM */}
          {step === 'details' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <Input
                label={t('auth.fullName')}
                placeholder={t('auth.fullNamePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-950 border-slate-700 text-white"
                required
                autoFocus
              />

              {selectedRole === 'seller' ? (
                <>
                  <Input
                    label={t('auth.storeTitle')}
                    placeholder={t('auth.storeTitlePlaceholder')}
                    value={storeTitle}
                    onChange={(e) => setStoreTitle(e.target.value)}
                    className="bg-slate-950 border-slate-700 text-white"
                    required
                  />
                  <Input
                    label={t('auth.phone')}
                    placeholder={t('auth.phonePlaceholder')}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-slate-950 border-slate-700 text-white font-mono text-start"
                    required
                  />
                  <Input
                    label={t('auth.referralCodeOptional')}
                    placeholder={t('auth.referralCodePlaceholder')}
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    className="bg-slate-950 border-slate-700 text-white font-mono"
                  />
                </>
              ) : (
                <>
                  <Input
                    label="آیدی اینستاگرام (Instagram Handle)"
                    placeholder="example_page"
                    value={instagramHandle}
                    onChange={(e) => setInstagramHandle(e.target.value)}
                    className="bg-slate-950 border-slate-700 text-white font-mono text-start"
                    leftAddon="@"
                    required
                  />
                  <Input
                    label={t('auth.phone')}
                    placeholder={t('auth.phonePlaceholder')}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-slate-950 border-slate-700 text-white font-mono text-start"
                    required
                  />
                  <div>
                    <label className="text-xs text-slate-300 block mb-1.5 font-semibold">
                      روش دریافت کمیسیون (اختیاری):
                    </label>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => setPayoutMethod('sheba')}
                        className={`p-2 rounded-lg text-xs font-bold border cursor-pointer ${
                          payoutMethod === 'sheba'
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        شماره شبا (تومان)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPayoutMethod('tether')}
                        className={`p-2 rounded-lg text-xs font-bold border cursor-pointer ${
                          payoutMethod === 'tether'
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        کیف پول تتر (USDT TRC20)
                      </button>
                    </div>
                    <Input
                      label={payoutMethod === 'sheba' ? 'شماره شبا (IR...)' : 'آدرس تتر TRC20'}
                      placeholder={payoutMethod === 'sheba' ? 'IR120120000000001234567890' : 'TXYZ...'}
                      value={payoutValue}
                      onChange={(e) => setPayoutValue(e.target.value)}
                      className="bg-slate-950 border-slate-700 text-white font-mono text-start text-xs"
                    />
                  </div>
                </>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold"
                isLoading={loading}
              >
                {t('auth.sendOtp')}
              </Button>

              <button
                type="button"
                onClick={() => setStep('role')}
                className="w-full text-center text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ← تغییر نقش و بازگشت
              </button>
            </form>
          )}

          {/* STEP 3: OTP VERIFY */}
          {step === 'otp' && (
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
                {t('auth.completeRegister')}
              </Button>
              <button
                type="button"
                onClick={() => setStep('details')}
                className="w-full text-center text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                {t('auth.editInitialInfo')}
              </button>
            </form>
          )}

          <div className="pt-2 border-t border-slate-800 text-center text-xs text-slate-400">
            {t('auth.alreadyHaveAccount')}{' '}
            <a href="/login" className="text-emerald-400 hover:underline font-bold">
              {t('auth.loginLink')}
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
