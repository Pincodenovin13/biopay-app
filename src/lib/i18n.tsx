import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import faLocale from '../locales/fa.json';
import arLocale from '../locales/ar.json';
import enLocale from '../locales/en.json';

export type Locale = 'fa' | 'ar' | 'en';
export type Region = 'iran' | 'international';

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
  region: Region;
  setRegion: (region: Region) => void;
  currency: 'TOMAN' | 'USDT';
  setCurrency: (curr: 'TOMAN' | 'USDT') => void;
  t: (path: string, params?: Record<string, string | number>) => string;
  formatNumber: (num: number | string) => string;
  formatPrice: (amount: number, overrideCurrency?: 'TOMAN' | 'USDT') => string;
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
  // English strictly uses English digits
  return str;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('fa');
  const [region, setRegionState] = useState<Region>('iran');
  const [currency, setCurrencyState] = useState<'TOMAN' | 'USDT'>('TOMAN');

  const direction = locale === 'en' ? 'ltr' : 'rtl';

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [locale, direction]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    // Automatic region and currency alignment:
    // If English -> International & USDT.
    // If Persian -> Iran & Toman.
    if (newLocale === 'en') {
      setRegionState('international');
      setCurrencyState('USDT');
    } else if (newLocale === 'fa') {
      setRegionState('iran');
      setCurrencyState('TOMAN');
    } else {
      setRegionState('international');
      setCurrencyState('USDT');
    }

    try {
      localStorage.setItem('biopay_locale', newLocale);
      document.cookie = `biopay_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
      
      // Update URL search param ?lang= without full page reload if supported
      if (typeof window !== 'undefined' && window.history) {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', newLocale);
        window.history.replaceState({}, '', url.toString());
      }
    } catch {
      // ignore
    }
  };

  const setRegion = (newRegion: Region) => {
    setRegionState(newRegion);
    setCurrencyState(newRegion === 'iran' ? 'TOMAN' : 'USDT');
  };

  const setCurrency = (newCurrency: 'TOMAN' | 'USDT') => {
    setCurrencyState(newCurrency);
    setRegionState(newCurrency === 'TOMAN' ? 'iran' : 'international');
  };

  useEffect(() => {
    let saved: string | null = null;
    try {
      // 1. Check URL query param ?lang=
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const urlLang = params.get('lang');
        if (urlLang === 'fa' || urlLang === 'en' || urlLang === 'ar') {
          saved = urlLang;
        }
      }

      // 2. Check localStorage & cookie
      if (!saved) {
        saved = localStorage.getItem('biopay_locale');
      }
      if (!saved) {
        const match = document.cookie.match(/biopay_locale=([^;]+)/);
        if (match) saved = match[1];
      }
    } catch {
      // ignore
    }

    if (saved && (saved === 'fa' || saved === 'ar' || saved === 'en')) {
      const chosen = saved as Locale;
      setLocaleState(chosen);
      if (chosen === 'en') {
        setRegionState('international');
        setCurrencyState('USDT');
      } else {
        setRegionState(chosen === 'fa' ? 'iran' : 'international');
        setCurrencyState(chosen === 'fa' ? 'TOMAN' : 'USDT');
      }
    } else if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language?.toLowerCase() || '';
      if (browserLang.startsWith('ar')) {
        setLocaleState('ar');
        setRegionState('international');
        setCurrencyState('USDT');
      } else if (browserLang.startsWith('en')) {
        setLocaleState('en');
        setRegionState('international');
        setCurrencyState('USDT');
      } else {
        setLocaleState('fa');
        setRegionState('iran');
        setCurrencyState('TOMAN');
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

  const formatPrice = (amount: number, overrideCurrency?: 'TOMAN' | 'USDT'): string => {
    const activeCurrency = overrideCurrency || currency;
    if (activeCurrency === 'USDT') {
      // In English/International mode: English digits (e.g., 27 USDT)
      const numStr = amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
      return `${locale === 'en' ? numStr : convertDigits(numStr, locale)} USDT`;
    }

    // In Iranian mode: Persian digits with Toman currency label
    const formatted = amount.toLocaleString(locale === 'fa' ? 'fa-IR' : locale === 'ar' ? 'ar-SA' : 'en-US');
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
        region,
        setRegion,
        currency,
        setCurrency,
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
