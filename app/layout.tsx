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

import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

import CookieBanner from '@/components/CookieBanner';
import TrackingScripts from '@/components/TrackingScripts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={dmSans.className}>
        <I18nProvider>
          <TrackingScripts />
          {children}
          <Footer />
          <CookieBanner />
        </I18nProvider>
      </body>
    </html>
  );
}
