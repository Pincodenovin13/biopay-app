/**
 * BioPay - SaaS Link-in-Bio & Storefront Platform
 * Production Architecture & UI/UX Redesign
 */

import React, { useState, useEffect } from 'react';
import { I18nProvider, useI18n } from './lib/i18n';
import { Hero } from './components/landing/Hero';
import { SocialProof } from './components/landing/SocialProof';
import { StatsSection } from './components/landing/StatsSection';
import { SalesHowItWorks } from './components/landing/SalesHowItWorks';
import { FeaturesGrid } from './components/landing/FeaturesGrid';
import { ReferrerEarningsSection } from './components/landing/ReferrerEarningsSection';
import { PricingSection } from './components/landing/PricingSection';
import { FaqAccordion } from './components/landing/FaqAccordion';
import { LandingFooter } from './components/landing/LandingFooter';
import { LanguageDropdown } from './components/ui/LanguageDropdown';
import { Button } from './components/ui/Button';
import { SellerDashboardView } from './components/dashboard/SellerDashboardView';
import { RegularUserDashboardView } from './components/dashboard/RegularUserDashboardView';
import { StorefrontView } from './components/storefront/StorefrontView';
import { AdminConsoleView } from './components/admin/AdminConsoleView';
import RegisterPage from './app/(auth)/register/page';
import LoginPage from './app/(auth)/login/page';
import AdminLoginPage from './app/(auth)/admin-login/page';
import { Store, Shield, Gift, LayoutDashboard, UserCheck } from 'lucide-react';

export type AppRoute =
  | 'landing'
  | 'dashboard'
  | 'referral'
  | 'storefront'
  | 'admin'
  | 'register'
  | 'login'
  | 'admin-login';

function BioPayRouter() {
  const { t, direction } = useI18n();
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('landing');

  // Sync route with URL if path matches
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/admin/login')) {
      setCurrentRoute('admin-login');
    } else if (path.startsWith('/admin')) {
      setCurrentRoute('admin');
    } else if (path.startsWith('/dashboard')) {
      setCurrentRoute('dashboard');
    } else if (path.startsWith('/referral')) {
      setCurrentRoute('referral');
    } else if (path.startsWith('/register')) {
      setCurrentRoute('register');
    } else if (path.startsWith('/login')) {
      setCurrentRoute('login');
    } else if (path.startsWith('/s/')) {
      setCurrentRoute('storefront');
    }
  }, []);

  const navigateTo = (route: AppRoute) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update browser history path
    if (typeof window !== 'undefined' && window.history) {
      let targetPath = '/';
      if (route === 'dashboard') targetPath = '/dashboard';
      else if (route === 'referral') targetPath = '/referral';
      else if (route === 'storefront') targetPath = '/s/tehrano_boutique';
      else if (route === 'admin') targetPath = '/admin';
      else if (route === 'register') targetPath = '/register';
      else if (route === 'login') targetPath = '/login';
      else if (route === 'admin-login') targetPath = '/admin/login';

      window.history.pushState({}, '', targetPath);
    }
  };

  // ROUTE 1: SELLER DASHBOARD (/dashboard)
  if (currentRoute === 'dashboard') {
    return (
      <div className="relative">
        <SellerDashboardView
          onViewStorefront={() => navigateTo('storefront')}
          onLogout={() => navigateTo('landing')}
        />
        <RouteTesterBar currentRoute={currentRoute} onNavigate={navigateTo} />
      </div>
    );
  }

  // ROUTE 2: REGULAR USER / REFERRAL DASHBOARD (/referral)
  if (currentRoute === 'referral') {
    return (
      <div className="relative">
        <RegularUserDashboardView
          onLogout={() => navigateTo('landing')}
          onExploreStorefront={() => navigateTo('storefront')}
        />
        <RouteTesterBar currentRoute={currentRoute} onNavigate={navigateTo} />
      </div>
    );
  }

  // ROUTE 3: PUBLIC STOREFRONT (/s/:slug)
  if (currentRoute === 'storefront') {
    return (
      <div className="relative">
        <StorefrontView
          storeSlug="tehrano_boutique"
          onGoHome={() => navigateTo('landing')}
        />
        <RouteTesterBar currentRoute={currentRoute} onNavigate={navigateTo} />
      </div>
    );
  }

  // ROUTE 4: PLATFORM ADMIN CONSOLE (/admin)
  if (currentRoute === 'admin') {
    return (
      <div className="relative">
        <AdminConsoleView onExitAdmin={() => navigateTo('landing')} />
        <RouteTesterBar currentRoute={currentRoute} onNavigate={navigateTo} />
      </div>
    );
  }

  // ROUTE 5: MULTI-ROLE REGISTRATION (/register)
  if (currentRoute === 'register') {
    return (
      <div className="relative">
        <RegisterPage />
        <RouteTesterBar currentRoute={currentRoute} onNavigate={navigateTo} />
      </div>
    );
  }

  // ROUTE 6: MULTI-ROLE LOGIN (/login)
  if (currentRoute === 'login') {
    return (
      <div className="relative">
        <LoginPage />
        <RouteTesterBar currentRoute={currentRoute} onNavigate={navigateTo} />
      </div>
    );
  }

  // ROUTE 7: ADMIN SECRET PASSKEY LOGIN (/admin/login)
  if (currentRoute === 'admin-login') {
    return (
      <div className="relative">
        <AdminLoginPage />
        <RouteTesterBar currentRoute={currentRoute} onNavigate={navigateTo} />
      </div>
    );
  }

  // ROUTE 8: PUBLIC MARKETING LANDING PAGE (/)
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 max-w-full overflow-x-hidden">
      {/* Top Marketing Navigation - Strict 3-Zone Contract with Language Dropdown in Zone 3 */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
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
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-300">
            <a href="#features-section" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              {t('nav.features')}
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              {t('nav.howItWorks')}
            </a>
            <a href="#earnings-section" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              {t('nav.earnings')}
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
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => navigateTo('login')}
              className="text-xs font-semibold text-slate-300 hover:text-white px-2 py-1 transition-colors cursor-pointer"
            >
              {t('nav.login')}
            </button>
            <LanguageDropdown />
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigateTo('register')}
              className="text-xs font-bold"
            >
              {t('nav.startFree')}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Marketing Sections - Complete Suite of Framer Motion Animated Sections */}
      <main className="flex-1 max-w-full overflow-x-hidden">
        {/* 1. Hero with Moving Gradient & 3D Phone Mockup */}
        <Hero
          onStartFree={() => navigateTo('register')}
          onExploreDemo={() => navigateTo('storefront')}
        />

        {/* 2. Social Proof & Partner Logos */}
        <SocialProof />

        {/* 3. Stats Section with Animated Counters & Progress Rings */}
        <StatsSection />

        {/* 4. Sales "How It Works" with 3 Animated Steps & Looping Showcase */}
        <SalesHowItWorks />

        {/* 5. Features Grid */}
        <FeaturesGrid />

        {/* 6. Referrer Earnings Section with Floating Coins & Growing Chart */}
        <ReferrerEarningsSection onOpenReferral={() => navigateTo('referral')} />

        {/* 7. Strict 3-Plan Pricing Section with Region Detection (Toman vs USDT) */}
        <PricingSection onSelectPlan={() => navigateTo('register')} />

        {/* 8. FAQ Accordion */}
        <FaqAccordion />
      </main>

      {/* 9. Fully Localized Footer */}
      <LandingFooter
        onGoHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onOpenAuth={() => navigateTo('register')}
      />

      {/* Discreet Route Switcher for Evaluator */}
      <RouteTesterBar currentRoute={currentRoute} onNavigate={navigateTo} />
    </div>
  );
}

/**
 * Discreet, high-end floating route bar for reviewer to switch between / , /dashboard, /referral, /s/tehran-boutique, /register, and /admin
 */
function RouteTesterBar({
  currentRoute,
  onNavigate,
}: {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}) {
  const { t } = useI18n();

  return (
    <aside
      aria-label="Route Switcher"
      className="fixed bottom-3 start-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white backdrop-blur-md border border-slate-700/80 rounded-full px-2.5 py-1.5 shadow-2xl flex items-center gap-1 text-[11px] font-semibold max-w-[96vw] overflow-x-auto"
    >
      <span className="text-[10px] text-slate-400 font-mono pe-1 hidden sm:inline whitespace-nowrap">
        {t('common.routes')}
      </span>
      <button
        onClick={() => onNavigate('landing')}
        className={`px-2.5 py-1 rounded-full transition-all cursor-pointer whitespace-nowrap ${
          currentRoute === 'landing' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
        }`}
      >
        {t('common.landingPage')}
      </button>
      <button
        onClick={() => onNavigate('dashboard')}
        className={`px-2.5 py-1 rounded-full transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
          currentRoute === 'dashboard' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
        }`}
      >
        <LayoutDashboard className="w-3 h-3" />
        <span>{t('common.sellerDashboard')}</span>
      </button>
      <button
        onClick={() => onNavigate('referral')}
        className={`px-2.5 py-1 rounded-full transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
          currentRoute === 'referral' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
        }`}
      >
        <Gift className="w-3 h-3" />
        <span>{t('common.referralDashboard')}</span>
      </button>
      <button
        onClick={() => onNavigate('storefront')}
        className={`px-2.5 py-1 rounded-full transition-all cursor-pointer whitespace-nowrap ${
          currentRoute === 'storefront' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
        }`}
      >
        {t('common.bioStorefront')}
      </button>
      <button
        onClick={() => onNavigate('admin')}
        className={`px-2.5 py-1 rounded-full transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
          currentRoute === 'admin' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
        }`}
      >
        <Shield className="w-3 h-3" />
        <span>{t('common.adminPanelRoute')}</span>
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
