import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Store,
  Upload,
  CheckCircle2,
  Instagram,
  MessageCircle,
  Send,
  Eye,
  Camera,
  Save,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { compressImageToWebp, verifyImageMagicBytes } from '../../modules/uploads/upload.service';

export interface StoreProfileSettings {
  title: string;
  slug: string;
  bio: string;
  industry: string;
  whatsappNumber: string;
  telegramHandle: string;
  avatarUrl?: string;
  bannerUrl?: string;
}

interface StoreSettingsViewProps {
  onSaveToast: (msg: string) => void;
}

export function StoreSettingsView({ onSaveToast }: StoreSettingsViewProps) {
  const { t } = useI18n();

  const [settings, setSettings] = useState<StoreProfileSettings>({
    title: 'بوتیک لباس و مد تهرانو',
    slug: 'tehrano_boutique',
    bio: 'جدیدترین کالکشن مانتو و لباس‌های مجلسی بهاره با تضمین کیفیت و ارسال سریع به سراسر ایران',
    industry: 'پوشاک و مد بانوان',
    whatsappNumber: '09121112233',
    telegramHandle: 'tehran_boutique',
    avatarUrl: '',
    bannerUrl: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('حجم تصویر نباید بیشتر از ۲ مگابایت باشد.');
      return;
    }
    const buffer = await file.arrayBuffer();
    if (!verifyImageMagicBytes(new Uint8Array(buffer)).isValid) {
      alert('فرمت فایل نامعتبر است.');
      return;
    }
    const compressed = await compressImageToWebp(file, 0.82);
    setAvatarPreview(URL.createObjectURL(compressed));
  };

  const handleBannerFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('حجم تصویر نباید بیشتر از ۲ مگابایت باشد.');
      return;
    }
    const buffer = await file.arrayBuffer();
    if (!verifyImageMagicBytes(new Uint8Array(buffer)).isValid) {
      alert('فرمت فایل نامعتبر است.');
      return;
    }
    const compressed = await compressImageToWebp(file, 0.85);
    setBannerPreview(URL.createObjectURL(compressed));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onSaveToast(t('common.savedSuccess'));
    }, 800);
  };

  return (
    <div className="space-y-8 text-start max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {t('settings.title')}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {t('settings.subtitle')}
        </p>
      </div>

      {/* Live Store Header Preview (What customers see) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Eye className="w-4 h-4 text-emerald-600" />
          <span>{t('settings.livePreview')}</span>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          {/* Banner */}
          <div className="relative h-28 bg-linear-to-r from-emerald-600 via-teal-700 to-slate-900">
            {bannerPreview && (
              <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-black/15" />
          </div>

          {/* Profile Header Content */}
          <div className="p-6 text-center -mt-12 space-y-3 relative z-10">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full ring-4 ring-white dark:ring-slate-900 bg-linear-to-tr from-emerald-500 to-amber-500 mx-auto p-0.5 shadow-md">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-black text-xl text-white">
                  {settings.title.slice(0, 2)}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  {settings.title || 'عنوان فروشگاه'}
                </h3>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500 text-white" />
              </div>
              <span className="inline-block text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                {settings.industry || 'صنف کاری'}
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto pt-1 leading-relaxed">
                {settings.bio || 'توضیحات و بیوگرافی فروشگاه...'}
              </p>
            </div>

            {/* Quick Contact Bar Preview */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {settings.whatsappNumber && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold shadow-xs">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{t('storefront.chatWhatsApp')}</span>
                </div>
              )}
              {settings.telegramHandle && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-semibold shadow-xs">
                  <Send className="w-3.5 h-3.5" />
                  <span>{t('storefront.viewTelegram')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <Card className="p-6">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('settings.storeTitle')}
              value={settings.title}
              onChange={(e) => setSettings({ ...settings, title: e.target.value })}
              required
            />
            <Input
              label={t('settings.storeSlug')}
              value={settings.slug}
              onChange={(e) => setSettings({ ...settings, slug: e.target.value })}
              leftAddon="biopay.me/s/"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('settings.industry')}
              value={settings.industry}
              onChange={(e) => setSettings({ ...settings, industry: e.target.value })}
              placeholder="مثلاً: پوشاک بانوان، کیف و کفش، زیورآلات"
            />
            <Input
              label={t('settings.whatsapp')}
              value={settings.whatsappNumber}
              onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
              placeholder="09121112233"
              leftAddon={<MessageCircle className="w-4 h-4 text-emerald-600" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('settings.telegram')}
              value={settings.telegramHandle}
              onChange={(e) => setSettings({ ...settings, telegramHandle: e.target.value })}
              placeholder="channel_id or username"
              leftAddon={<Send className="w-4 h-4 text-sky-500" />}
            />

            {/* Avatar Upload */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t('settings.avatar')} (WebP فشرده خودکار)
              </label>
              <label className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors text-xs text-slate-600 dark:text-slate-300">
                <Camera className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">انتخاب تصویر لوگو (حداکثر ۲MB)</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />
              </label>
            </div>
          </div>

          {/* Banner Upload */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t('settings.banner')} (تصویر افقی بنر هدر)
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors text-xs text-slate-600 dark:text-slate-300">
              <Upload className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>انتخاب تصویر بنر ویترین (ابعاد پیشنهادی ۱۲۰۰x۳۰۰ پیکسل)</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleBannerFile} />
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t('settings.storeBio')}
            </label>
            <textarea
              rows={3}
              value={settings.bio}
              onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end pt-3">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              {t('settings.saveChanges')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
