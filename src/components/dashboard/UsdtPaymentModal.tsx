import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, Copy, Check, Clock, ShieldCheck, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useI18n } from '../../lib/i18n';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { UsdtPaymentSession, usdtService } from '../../modules/payments/usdt.service';

interface UsdtPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: 'Starter' | 'Pro' | 'Business' | 'ReferrerRenewal';
  onPlanActivated: (planName: string, txHash: string) => void;
}

export function UsdtPaymentModal({ isOpen, onClose, planName, onPlanActivated }: UsdtPaymentModalProps) {
  const { t, formatPrice } = useI18n();
  const [session, setSession] = useState<UsdtPaymentSession | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(1800); // 30 minutes
  const [isSimulatingCheck, setIsSimulatingCheck] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const newSession = usdtService.createSession(planName);
      setSession(newSession);
      setSecondsLeft(1800);
      setIsConfirmed(false);
    }
  }, [isOpen, planName]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || secondsLeft <= 0 || isConfirmed) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, secondsLeft, isConfirmed]);

  const handleCopy = (text: string, type: 'address' | 'amount') => {
    navigator.clipboard?.writeText(text);
    if (type === 'address') {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } else {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    }
  };

  const handleSimulatePaymentDetection = () => {
    setIsSimulatingCheck(true);
    setTimeout(() => {
      setIsSimulatingCheck(false);
      setIsConfirmed(true);
      // Trigger festive confetti animation
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#059669', '#34d399', '#f59e0b'],
        });
      } catch {
        // ignore
      }
      setTimeout(() => {
        onPlanActivated(planName, `0x${Math.random().toString(16).slice(2, 18)}`);
      }, 2500);
    }, 1500);
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!session) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('usdtPayment.modalTitle')}
      description={t('usdtPayment.modalDesc')}
      maxWidth="md"
    >
      <div className="space-y-6 text-start">
        {isConfirmed ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="py-8 text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {t('usdtPayment.paidConfirmed')}
              </h3>
              <p className="text-xs text-slate-500">
                شبکه ترون ۳ تاییدیه تراکنش را صادر کرد. پلن فروشگاه شما ارتقا یافت.
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Countdown Banner */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{t('usdtPayment.timeRemaining')}</span>
              </div>
              <span className="font-mono text-sm tracking-wider tabular-nums font-extrabold">
                {formatTimer(secondsLeft)}
              </span>
            </div>

            {/* Exact Amount Display */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{t('usdtPayment.exactAmount')}</span>
                <span className="text-[11px] text-emerald-600 font-semibold">مبلغ شامل شناسه یکتا برای تایید خودکار</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black font-mono text-slate-900 dark:text-white tabular-nums tracking-wide">
                  {session.exactAmountUsdt} <span className="text-emerald-500 font-sans text-lg">USDT</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(String(session.exactAmountUsdt), 'amount')}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedAmount ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAmount ? t('common.copied') : t('common.copyLink')}</span>
                </button>
              </div>
            </div>

            {/* Deposit Address Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t('usdtPayment.depositAddress')}
              </label>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={session.depositAddress}
                  className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 select-all"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(session.depositAddress, 'address')}
                  leftIcon={copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                >
                  {copiedAddress ? t('common.copied') : t('common.copyLink')}
                </Button>
              </div>
            </div>

            {/* SVG Visual QR Code Matrix */}
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center space-y-3">
              <span className="text-xs font-semibold text-slate-500">
                {t('usdtPayment.qrCode')}
              </span>
              <div className="w-44 h-44 bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Outer corner finders */}
                  <rect x="5" y="5" width="26" height="26" rx="4" fill="#0f172a" />
                  <rect x="9" y="9" width="18" height="18" rx="2" fill="#ffffff" />
                  <rect x="13" y="13" width="10" height="10" rx="1" fill="#0f172a" />

                  <rect x="69" y="5" width="26" height="26" rx="4" fill="#0f172a" />
                  <rect x="73" y="9" width="18" height="18" rx="2" fill="#ffffff" />
                  <rect x="77" y="13" width="10" height="10" rx="1" fill="#0f172a" />

                  <rect x="5" y="69" width="26" height="26" rx="4" fill="#0f172a" />
                  <rect x="9" y="73" width="18" height="18" rx="2" fill="#ffffff" />
                  <rect x="13" y="77" width="10" height="10" rx="1" fill="#0f172a" />

                  {/* QR Data Grid Matrix */}
                  <rect x="36" y="8" width="6" height="6" fill="#10b981" />
                  <rect x="46" y="8" width="6" height="6" fill="#0f172a" />
                  <rect x="56" y="8" width="6" height="6" fill="#0f172a" />

                  <rect x="36" y="18" width="6" height="6" fill="#0f172a" />
                  <rect x="46" y="18" width="6" height="6" fill="#10b981" />
                  <rect x="56" y="18" width="6" height="6" fill="#0f172a" />

                  <rect x="8" y="36" width="6" height="6" fill="#0f172a" />
                  <rect x="18" y="36" width="6" height="6" fill="#10b981" />
                  <rect x="28" y="36" width="6" height="6" fill="#0f172a" />
                  <rect x="38" y="36" width="6" height="6" fill="#0f172a" />
                  <rect x="48" y="36" width="6" height="6" fill="#10b981" />
                  <rect x="58" y="36" width="6" height="6" fill="#0f172a" />
                  <rect x="68" y="36" width="6" height="6" fill="#0f172a" />
                  <rect x="78" y="36" width="6" height="6" fill="#10b981" />
                  <rect x="88" y="36" width="6" height="6" fill="#0f172a" />

                  <rect x="8" y="46" width="6" height="6" fill="#0f172a" />
                  <rect x="28" y="46" width="6" height="6" fill="#10b981" />
                  <rect x="38" y="46" width="6" height="6" fill="#0f172a" />
                  <rect x="48" y="46" width="6" height="6" fill="#0f172a" />
                  <rect x="68" y="46" width="6" height="6" fill="#10b981" />
                  <rect x="88" y="46" width="6" height="6" fill="#0f172a" />

                  <rect x="8" y="56" width="6" height="6" fill="#10b981" />
                  <rect x="18" y="56" width="6" height="6" fill="#0f172a" />
                  <rect x="28" y="56" width="6" height="6" fill="#0f172a" />
                  <rect x="48" y="56" width="6" height="6" fill="#0f172a" />
                  <rect x="58" y="56" width="6" height="6" fill="#10b981" />
                  <rect x="78" y="56" width="6" height="6" fill="#0f172a" />

                  <rect x="36" y="68" width="6" height="6" fill="#0f172a" />
                  <rect x="46" y="68" width="6" height="6" fill="#0f172a" />
                  <rect x="56" y="68" width="6" height="6" fill="#10b981" />
                  <rect x="68" y="68" width="6" height="6" fill="#0f172a" />
                  <rect x="78" y="68" width="6" height="6" fill="#0f172a" />
                  <rect x="88" y="68" width="6" height="6" fill="#10b981" />

                  <rect x="36" y="78" width="6" height="6" fill="#10b981" />
                  <rect x="46" y="78" width="6" height="6" fill="#0f172a" />
                  <rect x="68" y="78" width="6" height="6" fill="#0f172a" />
                  <rect x="88" y="78" width="6" height="6" fill="#0f172a" />

                  <rect x="36" y="88" width="6" height="6" fill="#0f172a" />
                  <rect x="56" y="88" width="6" height="6" fill="#0f172a" />
                  <rect x="68" y="88" width="6" height="6" fill="#10b981" />
                  <rect x="78" y="88" width="6" height="6" fill="#0f172a" />
                  <rect x="88" y="88" width="6" height="6" fill="#0f172a" />
                </svg>
              </div>
              <span className="text-[11px] font-mono text-slate-400">TRON Network (TRC-20)</span>
            </div>

            {/* Polling TronGrid status */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isSimulatingCheck ? 'animate-spin' : ''}`} />
                <span>{t('usdtPayment.waitingTx')}</span>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSimulatePaymentDetection}
                isLoading={isSimulatingCheck}
              >
                بررسی واریز (تست تایید آنی)
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
