import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import 'styles/globals.scss';
import Monitor from 'components/Monitor';
import CookieConsent from 'components/CookieConsent';
import ConsentProvider from 'components/ConsentProvider';
import GoogleTagManager from 'components/GoogleTagManager';
import Analytics from 'components/Analytics';

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
        <ConsentProvider>
          <GoogleTagManager />

          <Suspense fallback={null}>
            <Analytics />
          </Suspense>

          <Monitor>
            {children}
            <CookieConsent />
          </Monitor>
        </ConsentProvider>
      </body>
    </html>
  );
};

export default RootLayout;
