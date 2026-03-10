import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Analytics as VercelAnalytics } from '@vercel/analytics/next';
import AnalyticsManager from '@/components/AnalyticsManager';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://various-archives.com'),
  title: 'Various Archives',
  description:
    'A curated destination for luxury vintage and archival fashion, with early access available via the waitlist.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://us.i.posthog.com" />
        <link rel="dns-prefetch" href="https://us.i.posthog.com" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <Suspense fallback={null}>
          <AnalyticsManager />
        </Suspense>
        <VercelAnalytics />
      </body>
    </html>
  );
}
