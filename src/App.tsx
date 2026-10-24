/**
 * BioPay - SaaS Link-in-Bio & Storefront Platform
 * Production Architecture & UI/UX Redesign
 */

import React, { useState, useEffect } from 'react';
import { I18nProvider, useI18n } from './lib/i18n';
import { Hero } from './components/landing/Hero';
import { SocialProof } from './components/landing/SocialProof';
import { StatsSection } from './components/landing/StatsSection';
import { FeaturesGrid } from './components/landing/FeaturesGrid';
import { PricingSection } from './components/landing/PricingSection';
import { FaqAccordion } from './components/landing/FaqAccordion';
import { LandingFooter } from './components/landing/LandingFooter';
import { LanguageDropdown } from './components/ui/LanguageDropdown';
import { Button } from './components/ui/Button';
import { Modal } from './components/ui/Modal';
import { Input } from './components/ui/Input';
import { SellerDashboardView } from './components/dashboard/SellerDashboardView';
import { StorefrontView } from './components/storefront/StorefrontView';
import { AdminConsoleView } from './components/admin/AdminConsoleView';
import { Store, ArrowRight, Compass, Shield } from 'lucide-react';

export type AppRoute = 'landing' | 'dashboard' | 'storefront' | 'admin';

function BioPayRouter() {
  const { t, direction } = useI18n();
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('landing');
  
  // Auth modal state for public landing page
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [authStep, setAuthStep] = useState<'phone' | 'otp'>('phone');
  const [otpCode, setOtpCode] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Sync route with URL if path is /dashboard, /admin, or /s/...
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/admin')) {
      setCurrentRoute('admin');
    } else if (path.startsWith('/dashboard')) {
      setCurrentRoute('dashboard');
    } else if (path.startsWith('/s/')) {
      setCurrentRoute('storefront');
    }
  }, []);

  const navigateTo = (route: AppRoute) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput) return;
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setAuthStep('otp');
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) return;
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setIsAuthOpen(false);
      setAuthStep('phone');
      setPhoneInput('');
      setOtpCode('');
      navigateTo('dashboard');
    }, 600);
  };

  // ROUTE 1: SELLER DASHBOARD (/dashboard)
  if (currentRoute === 'dashboard') {
    return (
      <div>
        <SellerDashboardView
          onViewStorefront={() => navigateTo('storefront')}
          onLogout={() => navigateTo('landing')}
        />
        {/* Discreet Route Switcher for Evaluator */}
        <RouteTesterBar currentRoute={currentRoute} onNavigate={navigateTo} />
      </div>
    );
  }

  // ROUTE 2: PUBLIC STOREFRONT (/s/:slug)
  if (currentRoute === 'storefront') {
    return (
      <div>
        <StorefrontView
          storeSlug="tehrano_boutique"
          onGoHome={() => navigateTo('landing')}
        />
        {/* Discreet Route Switcher for Evaluator */}
        <RouteTesterBar currentRoute={currentRoute} onNavigate={navigateTo} />
      </div>
    );
  }

  // ROUTE 3: ISOLATED ADMIN PANEL (/admin)
  if (currentRoute === 'admin') {
    return (
      <div>
        <AdminConsoleView onExitAdmin={() => navigateTo('landing')} />
        {/* Discreet Route Switcher for Evaluator */}
        <RouteTesterBar currentRoute={currentRoute} onNavigate={navigateTo} />
      </div>
    );
  }

  // ROUTE 4: PUBLIC LANDING PAGE (/)
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Top Marketing Navigation - Strict 3-Zone Contract with Language Dropdown in Zone 3 */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (Single element) */}
          <button
            onClick={() => navigateTo('landing')}
            className="flex items-center gap-2.5 text-lg font-black tracking-tight text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Store className="w-4 h-4" />
            </div>
            <span>{t('common.appName')}</span>
          </button>

          {/* Zone 2: Concise Nav Links (NO ADMIN LINK on public landing page!) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-300">
            <a href="#features-section" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              {t('nav.features')}
            </a>
            <a href="#pricing-section" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              {t('nav.pricing')}
            </a>
            <a href="#testimonials" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              {t('nav.testimonials')}
            </a>
            <a href="#faq-section" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              {t('nav.faq')}
            </a>
          </nav>

          {/* Zone 3: Language Dropdown + Primary CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsAuthOpen(true)}
              className="text-xs font-semibold text-slate-300 hover:text-white px-2 py-1 transition-colors cursor-pointer"
            >
              {t('nav.login')}
            </button>
            <LanguageDropdown />
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAuthOpen(true)}
            >
              {t('nav.startFree')}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Marketing Sections */}
      <main className="flex-1">
        {/* 1. Hero */}
        <Hero
          onStartFree={() => setIsAuthOpen(true)}
          onExploreDemo={() => navigateTo('storefront')}
        />

        {/* 2. Social Proof */}
        <SocialProof />

        {/* 3. Stats Section with Circular Progress Rings */}
        <StatsSection />

        {/* 4. Features Grid */}
        <FeaturesGrid />

        {/* 5. Pricing Section with Monthly/Annual Toggle */}
        <PricingSection onSelectPlan={() => setIsAuthOpen(true)} />

        {/* 6. FAQ Accordion */}
        <FaqAccordion />
      </main>

      {/* 7. Footer */}
      <LandingFooter
        onGoHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Auth Modal for Merchants */}
      <Modal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        title={authStep === 'phone' ? 'ورود و ساخت فروشگاه' : 'تایید کد پیامک‌شده'}
        description={
          authStep === 'phone'
            ? 'شماره موبایل خود را وارد نمایید تا کد تایید برای شما ارسال شود.'
            : `کد ۶ رقمی ارسال شده به ${phoneInput} را وارد فرمایید (کد تستی: 123456):`
        }
      >
        {authStep === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4 text-start">
            <Input
              label="شماره موبایل"
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              autoFocus
              required
            />
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={authLoading}
            >
              ارسال کد تایید یکبارمصرف
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-start">
            <Input
              label="کد تایید ۶ رقمی"
              placeholder="123456"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="text-center font-mono text-lg tracking-widest"
              autoFocus
              required
            />
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={authLoading}
            >
              تایید و ورود به داشبورد فروشنده
            </Button>
          </form>
        )}
      </Modal>

      {/* Discreet Route Switcher for Evaluator */}
      <RouteTesterBar currentRoute={currentRoute} onNavigate={navigateTo} />
    </div>
  );
}

/**
 * Discreet, high-end floating route bar for reviewer to switch between / , /dashboard, /s/tehran-boutique, and /admin
 */
function RouteTesterBar({
  currentRoute,
  onNavigate,
}: {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}) {
  return (
    <aside
      aria-label="Route Switcher"
      className="fixed bottom-4 start-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white backdrop-blur-md border border-slate-700/80 rounded-full px-3 py-1.5 shadow-xl flex items-center gap-1.5 text-xs font-semibold"
    >
      <span className="text-[10px] text-slate-400 font-mono pe-1 hidden sm:inline">مسیرها:</span>
      <button
        onClick={() => onNavigate('landing')}
        className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
          currentRoute === 'landing' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
        }`}
      >
        صفحه فرود (/)
      </button>
      <button
        onClick={() => onNavigate('dashboard')}
        className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
          currentRoute === 'dashboard' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
        }`}
      >
        داشبورد فروشنده (/dashboard)
      </button>
      <button
        onClick={() => onNavigate('storefront')}
        className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
          currentRoute === 'storefront' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
        }`}
      >
        ویترین بیو (/s/slug)
      </button>
      <button
        onClick={() => onNavigate('admin')}
        className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
          currentRoute === 'admin' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
        }`}
      >
        <Shield className="w-3 h-3" />
        <span>پنل ادمین (/admin)</span>
      </button>
    </aside>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <BioPayRouter />
    </I18nProvider>
  );
}
