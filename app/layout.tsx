import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/next';
import 'styles/globals.scss';
import Monitor from 'components/Monitor';

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
        <Monitor>{children}</Monitor>

        <Analytics />
      </body>
    </html>
  );
};

export default RootLayout;
