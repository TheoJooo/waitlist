import type { Metadata } from 'next';
import Link from 'next/link';

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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 py-16 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_40%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.06),transparent_38%)]"
      />

      <section className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/90">
          Various Archives
        </p>

        <h1 className="mt-12 text-3xl font-semibold tracking-tight sm:text-4xl">
          Done. You&apos;ve been removed.
        </h1>

        <p className="mt-4 max-w-md text-sm leading-7 text-white/60 sm:text-base">
          If you change your mind, we&apos;ll be at{' '}
          <Link
            href="/"
            className="underline decoration-white/30 underline-offset-4 transition-colors hover:text-white"
          >
            various-archives.com
          </Link>
          .
        </p>

        <div className="mt-14 h-px w-14 bg-white/12" />

        <p className="mt-14 text-sm text-white/35">Still curious?</p>

        <nav className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/55">
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
      </section>
    </main>
  );
}
