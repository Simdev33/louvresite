import type { Metadata, Viewport } from 'next';
import { I18nProvider } from '@/i18n/context';
import './globals.css';

export const metadata: Metadata = {
  title: 'Louvresite – Paris tickets | Louvre, Eiffel, Seine',
  description: 'Buy tickets for the Louvre Museum, Eiffel Tower and Seine River cruise in Paris.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

import Footer from '@/components/Footer';
import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/*
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="4597954d-3783-47e0-8462-99cd7ad37a4f"
          data-blockingmode="auto"
        />
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <I18nProvider>
          {children}
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
