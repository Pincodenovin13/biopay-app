import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import faLocale from '../locales/fa.json';
import arLocale from '../locales/ar.json';
import enLocale from '../locales/en.json';

export type Locale = 'fa' | 'ar' | 'en';

type LocaleData = typeof faLocale;

const translations: Record<Locale, LocaleData> = {
  fa: faLocale,
  ar: arLocale as unknown as LocaleData,
  en: enLocale as unknown as LocaleData,
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  direction: 'rtl' | 'ltr';
  t: (path: string, params?: Record<string, string | number>) => string;
  formatNumber: (num: number | string) => string;
  formatPrice: (amount: number, currency?: string) => string;
  formatDate: (date: string | Date) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export function convertDigits(input: string | number, locale: Locale): string {
  const str = String(input);
  if (locale === 'fa') {
    return str.replace(/\d/g, (d) => PERSIAN_DIGITS[parseInt(d, 10)]);
  }
  if (locale === 'ar') {
    return str.replace(/\d/g, (d) => ARABIC_DIGITS[parseInt(d, 10)]);
  }
  return str;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('fa');

  const direction = locale === 'en' ? 'ltr' : 'rtl';

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [locale, direction]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('biopay_locale', newLocale);
    try {
      document.cookie = `biopay_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem('biopay_locale');
      if (!saved) {
        const match = document.cookie.match(/biopay_locale=([^;]+)/);
        if (match) saved = match[1];
      }
    } catch {
      // ignore
    }

    if (saved && (saved === 'fa' || saved === 'ar' || saved === 'en')) {
      setLocaleState(saved as Locale);
    } else if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language?.toLowerCase() || '';
      if (browserLang.startsWith('ar')) {
        setLocaleState('ar');
      } else if (browserLang.startsWith('en')) {
        setLocaleState('en');
      } else {
        setLocaleState('fa'); // Default to Persian for Iranian visitors
      }
    }
  }, []);

  const t = (path: string, params?: Record<string, string | number>): string => {
    const parts = path.split('.');
    let current: any = translations[locale] || translations.fa;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        // Fallback to English, then Persian
        let fallback: any = translations.en;
        for (const fpart of parts) {
          if (fallback && typeof fallback === 'object' && fpart in fallback) {
            fallback = fallback[fpart];
          } else {
            fallback = null;
            break;
          }
        }
        current = fallback || path;
        break;
      }
    }

    let text = typeof current === 'string' ? current : path;
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        const formattedVal = typeof val === 'number' ? convertDigits(val, locale) : String(val);
        text = text.replace(new RegExp(`\\{${key}\\}`, 'g'), formattedVal);
      });
    }
    return text;
  };

  const formatNumber = (num: number | string): string => {
    if (typeof num === 'number') {
      const formatted = num.toLocaleString(locale === 'en' ? 'en-US' : locale === 'ar' ? 'ar-SA' : 'fa-IR');
      return formatted;
    }
    return convertDigits(num, locale);
  };

  const formatPrice = (amount: number, currency: string = 'TOMAN'): string => {
    if (currency === 'USDT' || currency === 'USD') {
      const numStr = amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 4 });
      return `${convertDigits(numStr, locale)} USDT`;
    }
    const formatted = amount.toLocaleString(locale === 'en' ? 'en-US' : locale === 'ar' ? 'ar-SA' : 'fa-IR');
    const currencyName = (translations[locale] || translations.fa).common?.currencyToman || 'تومان';
    return `${formatted} ${currencyName}`;
  };

  const formatDate = (date: string | Date): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return String(date);
    if (locale === 'fa') {
      return d.toLocaleDateString('fa-IR');
    }
    if (locale === 'ar') {
      return d.toLocaleDateString('ar-SA');
    }
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        direction,
        t,
        formatNumber,
        formatPrice,
        formatDate,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
