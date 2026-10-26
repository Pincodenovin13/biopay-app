import React from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Wallet,
  Settings,
  Gift,
  CreditCard,
  ExternalLink,
  LogOut,
  Store,
  X,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';

export type DashboardTab =
  | 'overview'
  | 'products'
  | 'categories'
  | 'orders'
  | 'withdrawals'
  | 'referral'
  | 'plan'
  | 'settings';

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onViewStorefront: () => void;
  onLogout: () => void;
  storeSlug: string;
  storeTitle: string;
  onCloseMobileDrawer?: () => void;
  isMobileDrawer?: boolean;
}

export function DashboardSidebar({
  activeTab,
  onTabChange,
  onViewStorefront,
  onLogout,
  storeSlug,
  storeTitle,
  onCloseMobileDrawer,
  isMobileDrawer = false,
}: DashboardSidebarProps) {
  const { t } = useI18n();

  const menuItems = [
    { id: 'overview' as DashboardTab, label: t('dashboard.overview'), icon: LayoutDashboard },
    { id: 'products' as DashboardTab, label: t('dashboard.products'), icon: Package },
    { id: 'categories' as DashboardTab, label: t('dashboard.categories'), icon: Layers },
    { id: 'orders' as DashboardTab, label: t('dashboard.orders'), icon: ShoppingBag },
    { id: 'withdrawals' as DashboardTab, label: t('withdrawals.title'), icon: Wallet },
    { id: 'referral' as DashboardTab, label: t('dashboard.referral'), icon: Gift },
    { id: 'plan' as DashboardTab, label: t('dashboard.plan'), icon: CreditCard },
    { id: 'settings' as DashboardTab, label: t('dashboard.settings'), icon: Settings },
  ];

  return (
    <aside
      className={`bg-white dark:bg-slate-900 flex flex-col justify-between shrink-0 h-full ${
        isMobileDrawer
          ? 'w-72 shadow-2xl z-50'
          : 'w-64 border-e border-slate-200 dark:border-slate-800 hidden md:flex'
      }`}
    >
      <div className="p-5 space-y-5 overflow-y-auto">
        {/* Brand Header & Mobile Close Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-extrabold text-lg">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Store className="w-4 h-4" />
            </div>
            <span>{t('common.appName')}</span>
          </div>

          {isMobileDrawer && onCloseMobileDrawer && (
            <button
              onClick={onCloseMobileDrawer}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Store Card / Direct Link Button */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2 text-start">
          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
            {storeTitle}
          </div>
          <button
            onClick={() => {
              onViewStorefront();
              if (onCloseMobileDrawer) onCloseMobileDrawer();
            }}
            className="w-full flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
          >
            <span className="font-mono truncate">/s/{storeSlug}</span>
            <ExternalLink className="w-3 h-3 shrink-0" />
          </button>
        </div>

        {/* Nav Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  if (onCloseMobileDrawer) onCloseMobileDrawer();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout button at bottom */}
      <div className="p-5 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('common.logout')}</span>
        </button>
      </div>
    </aside>
  );
}
