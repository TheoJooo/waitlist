import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Aurora from '@/components/Aurora';
import SpotlightCard from '@/components/SpotlightCard';
import logo from '@/public/logo.png';

export const metadata: Metadata = {
  title: 'Various Archives',
  description:
    'Various Archives is building a curated destination for luxury vintage and archival fashion.',
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <Aurora
          colorStops={['#e6e6e6', '#6b7280', '#050505']}
          amplitude={0.8}
          blend={0.45}
          speed={0.55}
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),rgba(255,255,255,0.03)_24%,rgba(0,0,0,0)_48%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.12),rgba(0,0,0,0.56)_58%,rgba(0,0,0,0.88)_100%)]" />
      <div className="absolute inset-y-0 left-[-10%] w-[36%] bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.98),rgba(0,0,0,0.78)_54%,rgba(0,0,0,0)_100%)] blur-3xl" />
      <div className="absolute inset-y-0 right-[-10%] w-[36%] bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.98),rgba(0,0,0,0.78)_54%,rgba(0,0,0,0)_100%)] blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-12">
        <section className="flex w-full max-w-md flex-col items-center text-center">
          <Image
            src={logo}
            alt="Various Archives logo"
            width={196}
            priority
            className="h-auto w-[168px] sm:w-[196px]"
          />

          <SpotlightCard
            spotlightColor="rgba(255, 255, 255, 0.16)"
            className="mt-10 w-full max-w-[420px] border-white/10 bg-black/18 px-5 py-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_20px_80px_rgba(0,0,0,0.68)] backdrop-blur-[4px] sm:px-8 sm:py-7"
          >
            <p className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Private Beta
            </p>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/58">
              Early access to a curated destination for luxury vintage and archival fashion.
            </p>

            <Link
              href="/waitlist"
              className="mt-6 inline-flex h-11 w-full items-center justify-center border border-white bg-white px-6 text-sm font-semibold text-black transition-colors hover:bg-neutral-200"
            >
              Join the waitlist
            </Link>
          </SpotlightCard>

          <p className="mt-7 max-w-xs text-[13px] leading-6 text-white/68">
            By continuing, you agree to our<br/>{' '}
            <Link href="/terms" className="underline underline-offset-2 hover:text-white">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-white">
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
