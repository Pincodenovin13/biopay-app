'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Store, Lock, ArrowRight, CheckCircle2, AlertTriangle, KeyRound } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useI18n } from '../../../lib/i18n';
import { LanguageDropdown } from '../../../components/ui/LanguageDropdown';
import { resetPasswordWithToken, resetPasswordSchema } from '../../../lib/userStore';

export default function ResetPasswordPage() {
  const { t } = useI18n();
  const [token, setToken] = useState<string>('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token') || '';
      setToken(urlToken);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Zod validation
    const validation = resetPasswordSchema.safeParse({ password, confirmPassword });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || 'اطلاعات وارد شده نامعتبر است.');
      return;
    }

    if (!token) {
      setError('توکن بازیابی رمز عبور یافت نشد. لطفاً از طریق لینک ارسال شده به ایمیل وارد شوید.');
      return;
    }

    setLoading(true);

    try {
      const res = await resetPasswordWithToken(token, password);
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(res.error || 'خطا در بازنشانی رمز عبور');
      }
    } catch (err: any) {
      setError(err.message || 'خطا در برقراری ارتباط');
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
          <h1 className="text-xl font-bold text-white">تنظیم رمز عبور جدید</h1>
          <p className="text-xs text-slate-400">
            رمز عبور جدید خود را وارد و تایید فرمایید
          </p>
        </div>

        <Card className="p-6 bg-slate-900/95 border-slate-800 rounded-2xl shadow-xl space-y-5">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  رمز عبور جدید (حداقل ۸ کاراکتر)
                </label>
                <Input
                  type="password"
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white dir-ltr text-start"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  تکرار رمز عبور جدید
                </label>
                <Input
                  type="password"
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white dir-ltr text-start"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/50"
              >
                {loading ? 'در حال ثبت رمز جدید...' : 'ذخیره رمز عبور جدید'}
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Button>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-white">رمز عبور با موفقیت به‌روزرسانی شد!</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  رمز عبور شما با موفقیت تغییر یافت. اکنون می‌توانید با اطلاعات جدید وارد حساب خود شوید.
                </p>
              </div>

              <a
                href="/login"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
              >
                <span>ورود به حساب کاربری</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </a>
            </div>
          )}

          <div className="text-center pt-2">
            <a
              href="/login"
              className="text-xs text-slate-400 hover:text-white transition font-medium"
            >
              بازگشت به صفحه ورود
            </a>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
