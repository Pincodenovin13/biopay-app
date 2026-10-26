'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Store, Mail, ArrowRight, CheckCircle2, AlertTriangle, KeyRound, ExternalLink } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useI18n } from '../../../lib/i18n';
import { LanguageDropdown } from '../../../components/ui/LanguageDropdown';
import { requestPasswordReset } from '../../../lib/userStore';

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = requestPasswordReset(email);
      if (res.ok && res.resetToken) {
        setResetToken(res.resetToken);
      } else {
        setError(res.error || 'خطا در ارسال ایمیل بازیابی');
      }
    } catch (err: any) {
      setError(err.message || 'خطا در برقراری ارتباط');
    } finally {
      setLoading(false);
    }
  };

  const resetUrl = resetToken ? `/reset-password?token=${resetToken}` : '';

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
          <h1 className="text-xl font-bold text-white">بازیابی رمز عبور</h1>
          <p className="text-xs text-slate-400">
            ایمیل حساب کاربری خود را جهت دریافت لینک بازنشانی رمز عبور وارد نمایید
          </p>
        </div>

        <Card className="p-6 bg-slate-900/95 border-slate-800 rounded-2xl shadow-xl space-y-5">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!resetToken ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  ایمیل حساب کاربری
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

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/50"
              >
                {loading ? 'در حال ارسال ایمیل...' : 'ارسال لینک بازیابی'}
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Button>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-white">ایمیل بازیابی رمز عبور ارسال شد!</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  لینک بازنشانی رمز عبور برای ایمیل <span className="text-emerald-400 font-mono">{email}</span> ارسال گردید (اعتبار: ۱ ساعت).
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-start">
                <span className="text-[11px] text-slate-400 block font-semibold">
                  لینک شبیه‌سازی شده دریافت شده در ایمیل:
                </span>
                <a
                  href={resetUrl}
                  className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>باز کردن صفحه تنظیم رمز عبور جدید</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>
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
