import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';
import '@/styles/globals.scss';
import Monitor from '@/components/Monitor';

const terminalFont = localFont({
  src: '../public/fonts/MajorMonoDisplay-Regular.woff2',
  display: 'swap',
  variable: '--font-terminal',
});

export const metadata: Metadata = {
  // resolves relative OpenGraph/Twitter image URLs; falls back to localhost outside Vercel
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000'
  ),
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
    <html lang="en" className={terminalFont.variable}>
      <body>
        <Monitor>{children}</Monitor>

        <Analytics />
      </body>
    </html>
  );
};

export default RootLayout;
