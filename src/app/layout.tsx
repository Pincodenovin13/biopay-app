import React, { ReactNode } from 'react';
import { I18nProvider } from '../lib/i18n';
import '../index.css';

export const metadata = {
  title: 'BioPay - Sell on Instagram. Get paid instantly.',
  description: 'Enterprise-grade SaaS Link-in-Bio and digital storefront platform engineered for social commerce sellers across Iran and the Middle East.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Vazirmatn:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
