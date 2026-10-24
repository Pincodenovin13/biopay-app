import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Gift,
  Copy,
  Check,
  CreditCard,
  Upload,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { CircularProgress } from '../ui/CircularProgress';

interface ReferredSeller {
  id: string;
  sellerIdentifier: string;
  planName: string;
  date: string;
  commissionToman: number;
  commissionUsdt: number;
}

const SAMPLE_REFERRED: ReferredSeller[] = [
  {
    id: 'ref_1',
    sellerIdentifier: '0912***4455 (بوتیک شیراز)',
    planName: 'Pro',
    date: '1403/08/01',
    commissionToman: 1800000,
    commissionUsdt: 7.95,
  },
  {
    id: 'ref_2',
    sellerIdentifier: '0935***9988 (کافه اکسسوری)',
    planName: 'Starter',
    date: '1403/07/28',
    commissionToman: 900000,
    commissionUsdt: 2.6,
  },
  {
    id: 'ref_3',
    sellerIdentifier: 'seller_dubai@gmail.com',
    planName: 'Pro',
    date: '1403/07/25',
    commissionToman: 1800000,
    commissionUsdt: 7.95,
  },
];

interface ReferralViewProps {
  onOpenWithdrawalModal: () => void;
  onOpenRenewalModal?: () => void;
  onPayRenewalZarinpal?: () => void;
  onPayRenewalUsdt?: () => void;
}

export function ReferralView({
  onOpenWithdrawalModal,
  onOpenRenewalModal,
  onPayRenewalZarinpal,
  onPayRenewalUsdt,
}: ReferralViewProps) {
  const { t, formatNumber, formatPrice } = useI18n();

  const [referralCode] = useState('BIO_A1B2C3');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Status & Verification state
  const [isVerified, setIsVerified] = useState(true); // Instagram follower check
  const [isPartnerActive, setIsPartnerActive] = useState(true); // Monthly renewal status
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedScreenshot, setUploadedScreenshot] = useState<string | null>(null);

  const referralLink = `https://biopay.app/ref/${referralCode}`;

  const totalCommissionToman = SAMPLE_REFERRED.reduce((acc, curr) => acc + curr.commissionToman, 0);
  const totalCommissionUsdt = SAMPLE_REFERRED.reduce((acc, curr) => acc + curr.commissionUsdt, 0);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedScreenshot(URL.createObjectURL(file));
      alert('اسکرین‌شات پیج بارگذاری شد و در نوبت بررسی ادمین قرار گرفت.');
      setIsUploadModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 text-start max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t('referral.title')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('referral.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={isPartnerActive ? 'success' : 'warning'}>
            {isPartnerActive ? t('referral.statusActive') : t('referral.statusInactive')}
          </Badge>
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenWithdrawalModal}
            leftIcon={<CreditCard className="w-4 h-4" />}
          >
            {t('referral.requestWithdrawal')}
          </Button>
        </div>
      </div>

      {/* Verification Warning Banner if not verified */}
      {!isVerified && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
              {t('referral.instagramVerification')}
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              برای فعال‌سازی لینک معرف و دریافت پاداش‌ها، تصویر پیج اینستاگرام با حداقل ۵۰۰ دنبال‌کننده را بارگذاری فرمایید.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsUploadModalOpen(true)}
            leftIcon={<Upload className="w-3.5 h-3.5" />}
          >
            {t('referral.uploadProof')}
          </Button>
        </div>
      )}

      {/* Code & Link Sharing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Referral Code Card */}
        <Card className="p-5 space-y-3">
          <span className="text-xs font-semibold text-slate-500">{t('referral.yourCode')}</span>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono text-lg font-black text-emerald-600 dark:text-emerald-400">
            <span>{referralCode}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              leftIcon={copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copiedCode ? t('common.copied') : t('common.copyLink')}
            </Button>
          </div>
          <p className="text-[11px] text-slate-400">
            فروشندگان هنگام ثبت‌نام و پرداخت می‌توانند این کد را وارد نمایند.
          </p>
        </Card>

        {/* Referral Link Card */}
        <Card className="p-5 space-y-3">
          <span className="text-xs font-semibold text-slate-500">{t('referral.yourLink')}</span>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-200 select-all truncate">
            <span className="truncate pe-2">{referralLink}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              leftIcon={copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copiedLink ? t('common.copied') : t('common.copyLink')}
            </Button>
          </div>
          <p className="text-[11px] text-slate-400">
            لینک مستقیم با اعمال خودکار کد تخفیف و انتساب معرف.
          </p>
        </Card>
      </div>

      {/* Two Animated Total Commission Cards (Toman & USDT) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Toman Commission Card */}
        <Card className="p-6 text-start flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-500">
              {t('referral.commissionToman')}
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
              {formatPrice(totalCommissionToman, 'TOMAN')}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>آماده درخواست تسویه شبا</span>
            </div>
          </div>
          <CircularProgress
            percentage={85}
            size={72}
            strokeWidth={7}
            color="#10b981"
            label="۸۵٪"
          />
        </Card>

        {/* USDT Commission Card */}
        <Card className="p-6 text-start flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-500">
              {t('referral.commissionUsdt')}
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
              {formatPrice(totalCommissionUsdt, 'USDT')}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>قابل انتقال به کیف پول TRC20</span>
            </div>
          </div>
          <CircularProgress
            percentage={92}
            size={72}
            strokeWidth={7}
            color="#f59e0b"
            label="۹۲٪"
          />
        </Card>
      </div>

      {/* Monthly Partner Renewal Box */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {t('referral.monthlyRenewal')}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('referral.renewalDesc')}
            </p>
          </div>
          <Badge variant="brand">تمدید تا ۲۴ روز دیگر</Badge>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-6 text-xs font-mono">
            <div>
              <span className="text-slate-500">مبلغ ریالی: </span>
              <span className="font-bold text-slate-900 dark:text-white">{t('referral.renewalToman')}</span>
            </div>
            <div>
              <span className="text-slate-500">مبلغ تتر: </span>
              <span className="font-bold text-emerald-600">{t('referral.renewalUsdt')}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onPayRenewalZarinpal}
            >
              پرداخت شتابی (زرین‌پال)
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onPayRenewalUsdt}
            >
              پرداخت با تتر (USDT)
            </Button>
          </div>
        </div>
      </Card>

      {/* Referred Sellers Table */}
      <Card className="text-start overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white">
          {t('referral.referredList')}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5 font-semibold">{t('referral.sellerIdentifier')}</th>
                <th className="p-3.5 font-semibold">{t('referral.planType')}</th>
                <th className="p-3.5 font-semibold">{t('referral.earnedDate')}</th>
                <th className="p-3.5 font-semibold text-end">{t('referral.commissionAmount')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {SAMPLE_REFERRED.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                    {row.sellerIdentifier}
                  </td>
                  <td className="p-3.5">
                    <Badge variant={row.planName === 'Pro' ? 'brand' : 'neutral'}>
                      {row.planName}
                    </Badge>
                  </td>
                  <td className="p-3.5 text-slate-500 font-medium">{row.date}</td>
                  <td className="p-3.5 text-end font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                    {formatPrice(row.commissionToman, 'TOMAN')} / {row.commissionUsdt} USDT
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Instagram Screenshot Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title={t('referral.uploadProof')}
        description="جهت تایید هویت همکار فروش، تصویر پروفایل اینستاگرام با تعداد دنبال‌کننده قابل مشاهده را بارگذاری فرمایید."
      >
        <div className="space-y-4 text-start">
          <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center block cursor-pointer hover:border-emerald-500 transition-colors">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <span className="text-xs text-slate-600 dark:text-slate-300 block font-semibold">
              کلیک برای انتخاب تصویر اسکرین‌شات
            </span>
            <span className="text-[11px] text-slate-400">حداکثر ۲ مگابایت</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleScreenshotUpload} />
          </label>
        </div>
      </Modal>
    </div>
  );
}
