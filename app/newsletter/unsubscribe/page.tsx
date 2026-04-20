import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Aurora from '@/components/Aurora';
import logo from '@/public/logo.png';

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/various.archives',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/various-archives',
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@various.archives',
  },
] as const;

export const metadata: Metadata = {
  title: 'Unsubscribed | Various Archives',
  description: 'You have been removed from the Various Archives newsletter.',
  alternates: {
    canonical: '/newsletter/unsubscribe',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewsletterUnsubscribePage() {
  return (
    <main className="relative isolate min-h-[100svh] overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <Aurora
          colorStops={['#e6e6e6', '#6b7280', '#050505']}
          amplitude={0.8}
          blend={0.45}
          speed={0.35}
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),rgba(255,255,255,0.03)_24%,rgba(0,0,0,0)_48%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.12),rgba(0,0,0,0.56)_58%,rgba(0,0,0,0.88)_100%)]" />
      <div className="absolute inset-y-0 left-[-10%] w-[36%] bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.98),rgba(0,0,0,0.78)_54%,rgba(0,0,0,0)_100%)] blur-3xl" />
      <div className="absolute inset-y-0 right-[-10%] w-[36%] bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.98),rgba(0,0,0,0.78)_54%,rgba(0,0,0,0)_100%)] blur-3xl" />

      <section className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl items-center justify-center px-6 py-12">
        <div className="flex w-full max-w-md flex-col items-center text-center">
          <Image
            src={logo}
            alt="Various Archives logo"
            width={160}
            priority
            className="h-auto w-[132px] sm:w-[160px]"
          />

          <p className="mt-8 text-xs uppercase tracking-[0.08em] text-[var(--silver)]">
            Newsletter
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Done. You&apos;ve been removed.
          </h1>

          <p className="mt-4 max-w-sm text-sm leading-6 text-white/58 sm:text-base sm:leading-7">
            If you change your mind, we&apos;ll be at{' '}
            <Link
              href="/"
              className="text-white/76 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white"
            >
              various-archives.com
            </Link>
            .
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex h-11 items-center justify-center border border-white bg-white px-8 text-sm font-semibold text-black transition-colors hover:bg-neutral-200"
          >
            Back to home
          </Link>

          <div className="mt-10 h-px w-16 bg-white/12" />

          <p className="mt-10 text-sm text-white/35">Still curious?</p>

          <nav className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-white/55 sm:gap-x-8">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          </nav>
        </div>
      </section>
    </main>
  );
}
