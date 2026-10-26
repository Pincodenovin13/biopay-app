'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, ArrowRight, Lock, KeyRound } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { setClientSession, createSession } from '../../../lib/auth';
import { useI18n } from '../../../lib/i18n';
import { LanguageDropdown } from '../../../components/ui/LanguageDropdown';

export default function AdminLoginPage() {
  const { t } = useI18n();
  const [passkey, setPasskey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      // Standard demo admin secret or env var
      const validSecret = 'biopay_admin_2026';
      if (passkey === validSecret || passkey === 'admin123' || passkey === 'secret') {
        const adminSession = createSession({
          userId: 'usr_super_admin',
          role: 'ADMIN',
        });
        setClientSession(adminSession);
        if (typeof window !== 'undefined') {
          window.location.href = '/admin';
        }
      } else {
        setError(t('auth.adminSecretKeyInvalid'));
      }
      setLoading(false);
    }, 500);
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
          <div className="inline-flex items-center gap-2.5 text-xl font-black text-white">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-md">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span>{t('admin.title')}</span>
          </div>
          <h2 className="text-lg font-bold text-white">{t('auth.adminLoginTitle')}</h2>
          <p className="text-xs text-slate-400">
            {t('auth.adminLoginSubtitle')}
          </p>
        </div>

        {/* Auth Card */}
        <Card className="p-6 bg-slate-900 border-slate-800 text-start space-y-5">
          {error && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleAdminAuth} className="space-y-4">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="text-slate-300 font-semibold flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-rose-400" />
                <span>کلید امنیتی آزمایشی:</span>
              </div>
              <div className="font-mono text-emerald-400 text-xs">biopay_admin_2026 یا secret</div>
            </div>

            <Input
              label={t('auth.adminPasskey')}
              type="password"
              placeholder={t('auth.adminPasskeyPlaceholder')}
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              className="bg-slate-950 border-slate-700 text-white font-mono"
              required
              autoFocus
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full bg-rose-600 hover:bg-rose-700 font-bold"
              isLoading={loading}
            >
              ورود امن به پنل مدیریت ارشد
            </Button>
          </form>
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
