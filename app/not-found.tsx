import Image from 'next/image';
import Link from 'next/link';
import Aurora from '@/components/Aurora';
import logo from '@/public/logo.png';

export default function NotFound() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-black text-white">
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

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-6 py-12 text-center">
        <Image
          src={logo}
          alt="Various Archives logo"
          width={140}
          priority
          className="h-auto w-[120px] sm:w-[140px]"
        />

        <p className="mt-12 text-[120px] font-semibold leading-none tracking-tighter text-white/10 sm:text-[160px]">
          404
        </p>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
          Page not found
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/50">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center justify-center border border-white bg-white px-8 text-sm font-semibold text-black transition-colors hover:bg-neutral-200"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
