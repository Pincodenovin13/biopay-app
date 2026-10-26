import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Wallet, ArrowRight, CheckCircle2, Store, CreditCard, LogOut } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { ReferralView } from './ReferralView';
import { WithdrawalsView } from './WithdrawalsView';
import { LanguageDropdown } from '../ui/LanguageDropdown';
import { Button } from '../ui/Button';
import { UsdtPaymentModal } from './UsdtPaymentModal';

interface RegularUserDashboardViewProps {
  onLogout: () => void;
  onExploreStorefront?: () => void;
}

export function RegularUserDashboardView({ onLogout, onExploreStorefront }: RegularUserDashboardViewProps) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'referral' | 'withdrawals'>('referral');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUsdtModalOpen, setIsUsdtModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between max-w-full overflow-x-hidden">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white">
              {t('common.referralDashboard')}
            </h1>
            <div className="text-[10px] text-emerald-600 font-bold">
              {t('common.regularUser')}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageDropdown />
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
          >
            {t('common.logout')}
          </Button>
        </div>
      </header>

      {/* Navigation Tabs for Regular User */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 space-y-6 pb-28">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('referral')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'referral'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>{t('dashboard.referral')}</span>
          </button>

          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'withdrawals'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>{t('withdrawals.title')}</span>
          </button>
        </div>

        {activeTab === 'referral' && (
          <ReferralView
            onOpenWithdrawalModal={() => setActiveTab('withdrawals')}
            onOpenRenewalModal={() => setIsUsdtModalOpen(true)}
            onPayRenewalZarinpal={() => showToast('درگاه زرین‌پال تمدید معرف آماده است')}
            onPayRenewalUsdt={() => setIsUsdtModalOpen(true)}
          />
        )}

        {activeTab === 'withdrawals' && <WithdrawalsView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-slate-500">
        {t('footer.copyright')}
      </footer>

      {/* Renewal USDT Modal */}
      <UsdtPaymentModal
        isOpen={isUsdtModalOpen}
        onClose={() => setIsUsdtModalOpen(false)}
        planName="Starter"
        onPlanActivated={() => {
          setIsUsdtModalOpen(false);
          showToast('اشتراک ماهانه معرف با موفقیت فعال شد!');
        }}
      />
    </div>
  );
}
