'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Store,
  Gift,
  ShieldCheck,
  Send,
  ExternalLink,
  CheckCircle2,
  Lock,
  Mail,
  Globe,
  ChevronRight,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Bot,
  UserCheck,
  Building,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useI18n } from '../../../lib/i18n';
import { LanguageDropdown } from '../../../components/ui/LanguageDropdown';
import { registerNewUser, StoredUser, usersMap } from '../../../lib/userStore';
import { telegramBot } from '../../../lib/telegram';
import { setClientSession, createSession } from '../../../lib/auth';

export type UserRoleChoice = 'seller' | 'referrer' | 'admin';

const COUNTRIES = [
  { code: 'IR', nameFa: 'ایران', nameEn: 'Iran' },
  { code: 'AE', nameFa: 'امارات متحده عربی', nameEn: 'United Arab Emirates' },
  { code: 'TR', nameFa: 'ترکیه', nameEn: 'Turkey' },
  { code: 'DE', nameFa: 'آلمان', nameEn: 'Germany' },
  { code: 'GB', nameFa: 'بریتانیا (انگلستان)', nameEn: 'United Kingdom' },
  { code: 'CA', nameFa: 'کانادا', nameEn: 'Canada' },
  { code: 'US', nameFa: 'ایالات متحده آمریکا', nameEn: 'United States' },
  { code: 'OTHER', nameFa: 'سایر کشورها', nameEn: 'Other International' },
];

export default function RegisterPage() {
  const { t, locale } = useI18n();

  // Multi-step state: 'role' -> 'form' -> 'verification'
  const [step, setStep] = useState<'role' | 'form' | 'verification'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRoleChoice>('seller');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState(locale === 'fa' ? 'ایران' : 'Iran');

  // Status & Token
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredUser, setRegisteredUser] = useState<StoredUser | null>(null);
  const [verificationToken, setVerificationToken] = useState<string>('');

  // Telegram In-App Verification Simulation State
  const [showBotSimulator, setShowBotSimulator] = useState(false);
  const [botChatHistory, setBotChatHistory] = useState<Array<{ sender: 'bot' | 'user' | 'admin'; text: string; time: string }>>([]);
  const [instaInput, setInstaInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [cityInput, setCityInput] = useState(locale === 'fa' ? 'تهران' : 'Tehran');
  const [botSubmitting, setBotSubmitting] = useState(false);
  const [isBotApproved, setIsBotApproved] = useState(false);

  // Set default country based on region
  useEffect(() => {
    if (locale === 'fa') {
      setCountry('ایران');
    } else {
      setCountry('United Arab Emirates');
    }
  }, [locale]);

  const handleRoleSelect = (role: UserRoleChoice) => {
    if (role === 'admin') {
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
      return;
    }
    setSelectedRole(role);
    setStep('form');
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await registerNewUser({
        email,
        password,
        confirmPassword,
        country,
        role: selectedRole,
        clientIp: '127.0.0.1', // Mock or real client IP
      });

      if (!res.ok || !res.user || !res.verificationToken) {
        setError(res.error || 'خطا در ثبت‌نام کاربر');
        setLoading(false);
        return;
      }

      setRegisteredUser(res.user);
      setVerificationToken(res.verificationToken);
      setStep('verification');

      // Initialize bot simulation history
      setBotChatHistory([
        {
          sender: 'bot',
          text: `👋 به ربات رسمی بایوپی خوش آمدید!\nتوکن اعتبارسنجی (${res.verificationToken.slice(0, 8)}...) تایید گردید.\n\nلطفاً برای تایید هویت، اطلاعات زیر را ارسال کنید:\n• آیدی اینستاگرام (بدون @)\n• اسم و فامیل\n• شهر و کشور\n\n(بدون نیاز به ارسال هیچ‌گونه عکس یا مدارک شناسایی)`,
          time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      setError(err.message || 'خطا در برقراری ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  // Simulate Telegram bot questionnaire submission
  const handleBotSubmitDocs = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registeredUser) return;
    if (!instaInput || !nameInput) {
      setError('لطفاً آیدی اینستاگرام و نام خود را وارد فرمایید.');
      return;
    }

    setBotSubmitting(true);
    setError(null);

    // 1. Add user reply to bot history
    const userMessage = `${instaInput.replace(/^@/, '')}\n${nameInput}\n${cityInput} - ${country}`;
    setBotChatHistory((prev) => [
      ...prev,
      {
        sender: 'user',
        text: userMessage,
        time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    // 2. Process via TelegramService
    const update = {
      message: {
        chat: { id: registeredUser.id },
        text: userMessage,
        from: { id: registeredUser.id, first_name: nameInput },
      },
    };

    setTimeout(async () => {
      const botResponse = await telegramBot.handleUpdate(update);

      setBotChatHistory((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botResponse.reply,
          time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        },
        {
          sender: 'admin',
          text: `🔔 پیام ادمین سیستم:\nمدارک متنی کاربر (${nameInput} - @${instaInput}) دریافت شد. تایید توسط مدیریت در حال پردازش است...`,
          time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      // Automatically simulate admin approval after 1.5s
      setTimeout(async () => {
        const adminDecision = await telegramBot.executeAdminDecision(registeredUser.id, 'approve');

        setIsBotApproved(true);
        setBotChatHistory((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: adminDecision.reply,
            time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);

        // Establish verified session
        const verifiedSession = createSession({
          userId: registeredUser.id,
          email: registeredUser.email,
          role: 'USER',
          roleChoice: selectedRole,
          status: 'VERIFIED',
          storeSlug: instaInput.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'tehrano_boutique',
          referralCode: registeredUser.referralCode,
          referralLink: registeredUser.referralLink,
          fullName: nameInput,
          country,
        });
        setClientSession(verifiedSession);
        setBotSubmitting(false);
      }, 1500);
    }, 600);
  };

  const handleGoToDashboard = () => {
    if (typeof window !== 'undefined') {
      window.location.href = selectedRole === 'seller' ? '/dashboard' : '/referral';
    }
  };

  const telegramLink = `https://t.me/BioPayBot?start=verify_${verificationToken}`;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100">
      {/* Top Navbar items */}
      <div className="absolute top-4 end-4">
        <LanguageDropdown />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg space-y-6"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <a
            href="/"
            className="inline-flex items-center gap-2.5 text-xl font-black text-white hover:opacity-90 transition-opacity"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <Store className="w-5 h-5" />
            </div>
            <span>{t('common.appName')} | BioPay</span>
          </a>
          <h1 className="text-xl font-extrabold text-white">
            {step === 'role'
              ? t('auth.chooseRoleTitle')
              : step === 'form'
              ? selectedRole === 'seller'
                ? t('auth.sellerRegisterTitle')
                : t('auth.userRegisterTitle')
              : t('auth.telegramVerifyTitle')}
          </h1>
          <p className="text-xs text-slate-400">
            {step === 'role'
              ? t('auth.chooseRoleSubtitle')
              : step === 'form'
              ? selectedRole === 'seller'
                ? t('auth.sellerRegisterSubtitle')
                : t('auth.userRegisterSubtitle')
              : t('auth.telegramVerifySubtitle')}
          </p>
        </div>

        {/* STEP 1: ROLE SELECTION */}
        {step === 'role' && (
          <div className="space-y-4">
            {/* Card 1: Seller */}
            <Card
              onClick={() => handleRoleSelect('seller')}
              className="p-5 border-2 border-slate-800 hover:border-emerald-500 bg-slate-900/90 transition-all cursor-pointer rounded-2xl group hover:shadow-xl hover:shadow-emerald-950/40"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-emerald-500 group-hover:text-white transition">
                  <Store className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-white group-hover:text-emerald-400 transition">
                      {t('auth.roleSellerTitle')}
                    </h2>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                      فروشگاهی
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {t('auth.roleSellerDesc')}
                  </p>
                </div>
              </div>
            </Card>

            {/* Card 2: Regular User / Referrer */}
            <Card
              onClick={() => handleRoleSelect('referrer')}
              className="p-5 border-2 border-slate-800 hover:border-cyan-500 bg-slate-900/90 transition-all cursor-pointer rounded-2xl group hover:shadow-xl hover:shadow-cyan-950/40"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-cyan-500 group-hover:text-white transition">
                  <Gift className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-white group-hover:text-cyan-400 transition">
                      {t('auth.roleUserTitle')}
                    </h2>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                      پورسانت نقدی
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {t('auth.roleUserDesc')}
                  </p>
                </div>
              </div>
            </Card>

            {/* Existing Login link */}
            <div className="text-center pt-2">
              <p className="text-xs text-slate-400">
                {t('auth.hasAccount')}{' '}
                <a href="/login" className="text-emerald-400 font-bold hover:underline">
                  {t('auth.loginLink')}
                </a>
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: REGISTRATION FORM (EMAIL + PASSWORD + COUNTRY) */}
        {step === 'form' && (
          <Card className="p-6 bg-slate-900/95 border-slate-800 rounded-2xl shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                {selectedRole === 'seller' ? <Store className="w-4 h-4" /> : <Gift className="w-4 h-4" />}
                {selectedRole === 'seller' ? 'ثبت‌نام فروشنده' : 'ثبت‌نام معرف و کاربر عادی'}
              </span>
              <button
                type="button"
                onClick={() => setStep('role')}
                className="text-xs text-slate-400 hover:text-white transition cursor-pointer"
              >
                تغییر نقش
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  ایمیل (Email)
                </label>
                <Input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white dir-ltr text-start"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  رمز عبور (حداقل ۸ کاراکتر)
                </label>
                <Input
                  type="password"
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white dir-ltr text-start"
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  تکرار رمز عبور
                </label>
                <Input
                  type="password"
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white dir-ltr text-start"
                />
              </div>

              {/* Country Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  کشور محل سکونت (Country)
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-hidden focus:border-emerald-500"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={locale === 'fa' ? c.nameFa : c.nameEn}>
                      {locale === 'fa' ? `${c.nameFa} (${c.nameEn})` : c.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/50"
              >
                {loading ? 'در حال ثبت اطلاعات...' : 'ثبت‌نام و مرحله بعد'}
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Button>
            </form>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-400">
                {t('auth.hasAccount')}{' '}
                <a href="/login" className="text-emerald-400 font-bold hover:underline">
                  {t('auth.loginLink')}
                </a>
              </p>
            </div>
          </Card>
        )}

        {/* STEP 3: TELEGRAM VERIFICATION REQUIRED */}
        {step === 'verification' && registeredUser && (
          <Card className="p-6 bg-slate-900/95 border-slate-800 rounded-2xl shadow-xl space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
                <Send className="w-8 h-8 -rotate-12" />
              </div>
              <h2 className="text-lg font-black text-white">
                ثبت‌نام شما انجام شد.
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                برای تایید هویت و فعالسازی، روی دکمه بالا بزنید.
              </p>
            </div>

            {/* Direct Telegram Deep Link Button */}
            <div className="space-y-3">
              <a
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2.5 shadow-lg shadow-sky-950/40 text-sm transition"
              >
                <Send className="w-5 h-5" />
                <span>تایید هویت در تلگرام</span>
                <ExternalLink className="w-4 h-4 opacity-75" />
              </a>

              <p className="text-[11px] text-center text-slate-400">
                لینک ربات: <span className="dir-ltr text-sky-400 font-mono text-[10px]">t.me/BioPayBot?start=verify_{verificationToken.slice(0, 8)}...</span>
              </p>
            </div>

            {/* Interactive Bot Simulator / Tester Accordion */}
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
              <button
                type="button"
                onClick={() => setShowBotSimulator(!showBotSimulator)}
                className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-slate-200 hover:bg-slate-900/50 transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span>تست آنی اعتبارسنجی تلگرام در همین صفحه</span>
                </div>
                <span className="text-[11px] text-cyan-400 underline">
                  {showBotSimulator ? 'بستن شبیه‌ساز' : 'باز کردن شبیه‌ساز'}
                </span>
              </button>

              {showBotSimulator && (
                <div className="p-4 border-t border-slate-800 space-y-4">
                  {/* Chat messages view */}
                  <div className="space-y-2 max-h-52 overflow-y-auto p-2 bg-slate-950 rounded-lg border border-slate-850 text-xs">
                    {botChatHistory.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl max-w-[88%] text-[11px] leading-relaxed ${
                          msg.sender === 'user'
                            ? 'ms-auto bg-emerald-600/90 text-white'
                            : msg.sender === 'admin'
                            ? 'me-auto bg-amber-500/10 border border-amber-500/30 text-amber-200'
                            : 'me-auto bg-slate-850 text-slate-200 border border-slate-750'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>
                        <span className="block text-[9px] text-slate-400 text-end mt-1">{msg.time}</span>
                      </div>
                    ))}
                  </div>

                  {/* Simulator text questionnaire form */}
                  {!isBotApproved ? (
                    <form onSubmit={handleBotSubmitDocs} className="space-y-3 pt-1">
                      <p className="text-[11px] text-slate-400">
                        فرم متنی مدارک هویتی ربات (بدون نیاز به آپلود هیچ‌گونه تصویر):
                      </p>
                      <div className="space-y-2">
                        <Input
                          placeholder="آیدی اینستاگرام (مثال: tehran_boutique)"
                          value={instaInput}
                          onChange={(e) => setInstaInput(e.target.value)}
                          className="bg-slate-900 border-slate-800 text-xs text-white"
                          required
                        />
                        <Input
                          placeholder="نام و نام خانوادگی (مثال: علی رضایی)"
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          className="bg-slate-900 border-slate-800 text-xs text-white"
                          required
                        />
                        <Input
                          placeholder="شهر (مثال: تهران یا دبی)"
                          value={cityInput}
                          onChange={(e) => setCityInput(e.target.value)}
                          className="bg-slate-900 border-slate-800 text-xs text-white"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={botSubmitting}
                        className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg cursor-pointer"
                      >
                        {botSubmitting ? 'در حال ارسال و تایید ادمین...' : 'ارسال مشخصات متنی به ربات'}
                      </Button>
                    </form>
                  ) : (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        حساب کاربری شما با موفقیت تایید شد!
                      </div>
                      <p className="text-[11px] text-slate-300">
                        اکنون می‌توانید وارد پنل شده، پلن خود را انتخاب و فروشگاه را راه‌اندازی کنید.
                      </p>
                      <Button
                        type="button"
                        onClick={handleGoToDashboard}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg cursor-pointer"
                      >
                        ورود به داشبورد و انتخاب پلن
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Back to Login */}
            <div className="text-center">
              <a
                href="/login"
                className="text-xs text-slate-400 hover:text-white transition flex items-center justify-center gap-1.5"
              >
                <span>بازگشت به صفحه ورود</span>
              </a>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
