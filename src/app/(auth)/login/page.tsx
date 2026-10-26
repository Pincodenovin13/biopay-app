'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Store,
  Gift,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Mail,
  Send,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  KeyRound,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useI18n } from '../../../lib/i18n';
import { LanguageDropdown } from '../../../components/ui/LanguageDropdown';
import { loginWithEmailPassword, StoredUser, usersMap, approveUserVerification } from '../../../lib/userStore';
import { setClientSession, createSession } from '../../../lib/auth';

export default function LoginPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Status banners
  const [statusBanner, setStatusBanner] = useState<{
    type: 'PENDING_VERIFICATION' | 'REJECTED';
    message: string;
    token?: string;
    userId?: string;
  } | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatusBanner(null);
    setLoading(true);

    try {
      const res = await loginWithEmailPassword(email, password);

      if (!res.ok || !res.user) {
        setError(res.error || 'ایمیل یا رمز عبور اشتباه است.');
        setLoading(false);
        return;
      }

      const user = res.user;

      // PART 3: Check user verification status
      if (user.status === 'PENDING_VERIFICATION') {
        setStatusBanner({
          type: 'PENDING_VERIFICATION',
          message: 'حساب شما در انتظار تایید است. لطفاً به تلگرام بروید.',
          token: user.verificationToken,
          userId: user.id,
        });
        setLoading(false);
        return;
      }

      if (user.status === 'REJECTED') {
        setStatusBanner({
          type: 'REJECTED',
          message: 'مدارک شما رد شد. لطفاً با پشتیبانی تماس بگیرید.',
          userId: user.id,
        });
        setLoading(false);
        return;
      }

      // User is VERIFIED or ACTIVE -> issue session and redirect to dashboard
      const session = createSession({
        userId: user.id,
        email: user.email,
        role: 'USER',
        roleChoice: user.role,
        status: user.status,
        storeSlug: user.storeSlug || 'tehrano_boutique',
        referralCode: user.referralCode,
        referralLink: user.referralLink,
        fullName: user.fullName,
        country: user.country,
      });

      setClientSession(session);

      if (typeof window !== 'undefined') {
        window.location.href = user.role === 'seller' ? '/dashboard' : '/referral';
      }
    } catch (err: any) {
      setError(err.message || 'خطا در ورود به حساب');
    } finally {
      setLoading(false);
    }
  };

  // Instant simulation helper to approve pending user on demand
  const handleSimulateInstantApproval = (userId: string) => {
    const res = approveUserVerification(userId);
    if (res.ok && res.user) {
      const session = createSession({
        userId: res.user.id,
        email: res.user.email,
        role: 'USER',
        roleChoice: res.user.role,
        status: 'VERIFIED',
        storeSlug: res.user.storeSlug || 'tehrano_boutique',
        referralCode: res.user.referralCode,
        referralLink: res.user.referralLink,
        fullName: res.user.fullName,
        country: res.user.country,
      });
      setClientSession(session);
      if (typeof window !== 'undefined') {
        window.location.href = res.user.role === 'seller' ? '/dashboard' : '/referral';
      }
    }
  };

  const handleFillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setError(null);
    setStatusBanner(null);
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
          <h1 className="text-xl font-bold text-white">ورود به حساب کاربری</h1>
          <p className="text-xs text-slate-400">
            ایمیل و رمز عبور خود را جهت ورود به پنل وارد نمایید
          </p>
        </div>

        {/* Status Banners according to PART 3 */}
        <AnimatePresence>
          {statusBanner?.type === 'PENDING_VERIFICATION' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl space-y-3"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h2 className="text-xs font-bold text-amber-300">
                    حساب شما در انتظار تایید است. لطفاً به تلگرام بروید.
                  </h2>
                  <p className="text-[11px] text-amber-200/80 leading-relaxed">
                    جهت فعالسازی نهایی و دسترسی به ویترین فروشگاه و پلن‌ها، باید احراز هویت متنی را در ربات تلگرام تکمیل فرمایید.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <a
                  href={`https://t.me/BioPayBot?start=verify_${statusBanner.token || 'demo'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <Send className="w-4 h-4" />
                  <span>تایید هویت در تلگرام</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>

                {statusBanner.userId && (
                  <button
                    type="button"
                    onClick={() => handleSimulateInstantApproval(statusBanner.userId!)}
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold rounded-lg transition cursor-pointer"
                  >
                    تایید آنی (تست ادمین)
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {statusBanner?.type === 'REJECTED' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-rose-500/10 border-2 border-rose-500/40 rounded-2xl flex items-start gap-3"
            >
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h2 className="text-xs font-bold text-rose-300">
                  مدارک شما رد شد. لطفاً با پشتیبانی تماس بگیرید.
                </h2>
                <p className="text-[11px] text-rose-200/80 leading-relaxed">
                  اطلاعات ارسال شده توسط مدیریت تایید نگردید. می‌توانید با تیم پشتیبانی در تلگرام یا ایمیل در ارتباط باشید.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <Card className="p-6 bg-slate-900/95 border-slate-800 rounded-2xl shadow-xl space-y-5">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                ایمیل (Email)
              </label>
              <Input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-950 border-slate-800 text-white dir-ltr text-start"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  رمز عبور (Password)
                </label>
                <a
                  href="/forgot-password"
                  className="text-[11px] text-emerald-400 hover:underline font-medium"
                >
                  فراموشی رمز عبور؟
                </a>
              </div>
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-950 border-slate-800 text-white dir-ltr text-start"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/50"
            >
              {loading ? 'در حال ورود...' : 'ورود به حساب'}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Button>
          </form>

          {/* Quick Demo Credentials for Reviewers */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 block">
              حساب‌های نمونه جهت تست سریع (رمز: Password123!):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('seller@biopay.app')}
                className="p-2 text-start bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-lg text-[10px] text-slate-300 transition cursor-pointer"
              >
                <span className="font-bold text-emerald-400 block">فروشنده تایید شده</span>
                seller@biopay.app
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('pending@biopay.app')}
                className="p-2 text-start bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-lg text-[10px] text-slate-300 transition cursor-pointer"
              >
                <span className="font-bold text-amber-400 block">در انتظار تایید تلگرام</span>
                pending@biopay.app
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">
              هنوز حساب کاربری ندارید؟{' '}
              <a href="/register" className="text-emerald-400 font-bold hover:underline">
                ثبت‌نام رایگان
              </a>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
