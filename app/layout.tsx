import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';
import { Suspense } from 'react';
import 'styles/globals.scss';
import Monitor from 'components/Monitor';
import CookieConsent from 'components/CookieConsent';
import Analytics from 'components/Analytics';
import { GA_TRACKING_ID } from 'lib/gtag';

export const metadata: Metadata = {
  title: 'Infinite Monkey Lab',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  themeColor: '#000',
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body>
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <Script id="gtag-init">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        <Suspense fallback={null}>
          <Analytics />
        </Suspense>

        <Monitor>
          {children}
          <CookieConsent />
        </Monitor>
      </body>
    </html>
  );
};

export default RootLayout;
