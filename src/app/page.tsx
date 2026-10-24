'use client';

import React, { useState } from 'react';
import { Hero } from '../components/landing/Hero';
import { SocialProof } from '../components/landing/SocialProof';
import { StatsSection } from '../components/landing/StatsSection';
import { FeaturesGrid } from '../components/landing/FeaturesGrid';
import { PricingSection } from '../components/landing/PricingSection';
import { FaqAccordion } from '../components/landing/FaqAccordion';
import { LandingFooter } from '../components/landing/LandingFooter';
import { LanguageDropdown } from '../components/ui/LanguageDropdown';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useI18n } from '../lib/i18n';
import { Store, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const { t, direction } = useI18n();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [authStep, setAuthStep] = useState<'phone' | 'otp'>('phone');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStartFree = () => {
    setIsAuthModalOpen(true);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuthStep('otp');
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsAuthModalOpen(false);
      window.location.href = '/dashboard';
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Top Marketing Navigation - Strict 3-Zone Contract with Language Dropdown in Zone 3 */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand wordmark (single element) */}
          <a
            href="/"
            className="flex items-center gap-2.5 text-lg font-black tracking-tight text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Store className="w-4 h-4" />
            </div>
            <span>{t('common.appName')}</span>
          </a>

          {/* Zone 2: Navigation Links (single line, NO ADMIN LINK) */}
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

          {/* Zone 3: Language Dropdown + Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <LanguageDropdown />
            <Button
              variant="primary"
              size="sm"
              onClick={handleStartFree}
            >
              {t('nav.startFree')}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Landing Page Content */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          onStartFree={handleStartFree}
          onExploreDemo={() => {
            window.location.href = '/s/tehran-boutique';
          }}
        />

        {/* 2. Social Proof Section */}
        <SocialProof />

        {/* 3. Stats Section with Circular Progress Rings */}
        <StatsSection />

        {/* 4. Features Section */}
        <FeaturesGrid />

        {/* 5. Pricing Section */}
        <PricingSection onSelectPlan={() => handleStartFree()} />

        {/* 6. FAQ Accordion */}
        <FaqAccordion />
      </main>

      {/* 7. Footer */}
      <LandingFooter
        onGoHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onOpenAuth={handleStartFree}
      />

      {/* Fast Sign-up Modal */}
      <Modal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title={authStep === 'phone' ? 'ورود و ساخت فروشگاه' : 'تایید شماره موبایل'}
        description={
          authStep === 'phone'
            ? 'شماره موبایل خود را وارد نمایید تا کد تایید برای شما پیامک گردد.'
            : `کد ۶ رقمی ارسال شده به ${phoneInput} را وارد فرمایید:`
        }
      >
        {authStep === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4 text-start">
            <Input
              label="شماره موبایل"
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              value={phoneInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneInput(e.target.value)}
              autoFocus
              required
            />
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              دریافت کد تایید یکبارمصرف
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-start">
            <Input
              label="کد تایید پیامک‌شده"
              placeholder="123456"
              maxLength={6}
              value={otpCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtpCode(e.target.value)}
              className="text-center font-mono text-lg tracking-widest"
              autoFocus
              required
            />
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              ورود به داشبورد فروشنده
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
