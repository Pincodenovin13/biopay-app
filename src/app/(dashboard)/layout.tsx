'use client';

import React, { ReactNode, useState } from 'react';
import { DashboardSidebar, DashboardTab } from '../../components/dashboard/DashboardSidebar';
import { LanguageDropdown } from '../../components/ui/LanguageDropdown';
import { Button } from '../../components/ui/Button';
import { ExternalLink, Copy } from 'lucide-react';
import { useI18n } from '../../lib/i18n';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [copiedLink, setCopiedLink] = useState(false);

  const storeSlug = 'tehran-boutique';
  const storeTitle = 'بوتیک لباس و مد تهرانو';

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(`https://biopay.me/s/${storeSlug}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onViewStorefront={() => {
          window.location.href = `/s/${storeSlug}`;
        }}
        onLogout={() => {
          window.location.href = '/';
        }}
        storeSlug={storeSlug}
        storeTitle={storeTitle}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between shrink-0">
          <div className="text-start">
            <h1 className="text-sm font-bold text-slate-900 dark:text-white">
              {t('dashboard.title')}
            </h1>
            <span className="text-xs text-slate-500 font-mono">/s/{storeSlug}</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              leftIcon={<Copy className="w-3.5 h-3.5" />}
            >
              {copiedLink ? t('common.copied') : t('common.copyLink')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                window.location.href = `/s/${storeSlug}`;
              }}
              rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
            >
              {t('common.viewStore')}
            </Button>
            <LanguageDropdown />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
