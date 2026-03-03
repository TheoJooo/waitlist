'use client';

import Image from 'next/image';
import Link from 'next/link';
import WaitlistForm from '@/components/WaitlistForm';
import PostHogPageView from '@/components/PostHogPageView';
import BackgroundPaperShaders from '@/components/ui/background-paper-shaders';
import { Accordion01 } from '@/components/ui/accordion-01-1';
import logo from '@/public/logo.png';

const BENEFITS = [
  {
    title: 'Professional boutiques only',
    description:
      'Every seller is a vetted business with real expertise in archival and luxury second hand.',
  },
  {
    title: 'Curated, not cluttered',
    description: 'Less noise, fewer low quality listings. The focus stays on pieces worth keeping.',
  },
  {
    title: 'Clearer buying confidence',
    description:
      'Consistent listing standards, better context, and fewer unknowns when buying high value pieces.',
  },
  {
    title: 'Find rare pieces faster',
    description:
      'Access boutique inventories that are easy to miss, without spending hours scrolling.',
  },
];

const FAQ_ITEMS = [
  {
    id: '01',
    title: 'What is Various Archives?',
    content:
      'Various Archives is a curated marketplace for luxury vintage and archival designer pieces, sourced from professional boutiques and specialist sellers.',
  },
  {
    id: '02',
    title: 'Why join the waitlist?',
    content:
      'Waitlist members get early access before public opening, plus drop previews and updates tied to what they are actually looking for.',
  },
  {
    id: '03',
    title: 'Is it free to join?',
    content: 'Yes. Joining the waitlist is free.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--body-background)] text-[var(--main-black)]">
      <PostHogPageView />

      <section className="relative w-full min-h-[100svh] overflow-hidden">
        <BackgroundPaperShaders />

        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-5xl flex-col px-6 pt-6 pb-8">
          <header className="flex items-center">
            <Image src={logo} alt="Various Archives logo" width={160} height={36} priority />
          </header>

          <div className="grid flex-1 items-center gap-10 pt-3 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-[var(--silver)]">Early Access Waitlist</p>
              <h1 className="mt-3 text-3xl font-semibold leading-thin text-[var(--text-white)]">
                The world&apos;s best luxury vintage,<br/>curated by professionals,<br/>all in one place.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--alt-grey)]">
                Various Archives connects you with vintage designer pieces from trusted boutiques worldwide.<br/>
                Skip the uncertainty and endless scrolling.<br/>
                Discover rare pieces curated by experts who live and breathe fashion history.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--outline)] bg-[rgba(242,242,242,0.92)] p-5 backdrop-blur-sm">
              <WaitlistForm location="hero" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-20">
        <p className="text-sm leading-relaxed text-[var(--text-grey)]">
          Join <span className="font-semibold">50,000+</span> luxury fashion enthusiasts who follow
          Various Archives for curated luxury vintage.
        </p>
        <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
          <p className="border border-[var(--alt-grey)] p-3">50k+ community across social</p>
          <p className="border border-[var(--alt-grey)] p-3">Professional boutiques only</p>
          <p className="border border-[var(--alt-grey)] p-3">1000+ early access signups</p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl border-t border-[var(--outline)] px-6 py-10">
        <h2 className="text-2xl font-semibold">Curated archival fashion, made simpler</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {BENEFITS.map((benefit) => (
            <article key={benefit.title} className="border border-[var(--alt-grey)] p-4">
              <h3 className="text-lg font-medium">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-grey)]">{benefit.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl border-t border-[var(--outline)] px-6 py-10">
        <h2 className="text-2xl font-semibold">From signup to early access</h2>
        <ol className="mt-5 grid gap-4 md:grid-cols-2">
          <li className="border border-[var(--alt-grey)] p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-[var(--silver)]">Step 1</p>
            <h3 className="mt-2 text-lg font-medium">Join the waitlist</h3>
            <p className="mt-2 text-sm text-[var(--text-grey)]">
              One form submission. Early access invites are sent before the public launch.
            </p>
          </li>
          <li className="border border-[var(--alt-grey)] p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-[var(--silver)]">Step 2</p>
            <h3 className="mt-2 text-lg font-medium">Get invited in waves</h3>
            <p className="mt-2 text-sm text-[var(--text-grey)]">
              Early access opens in small groups. You receive a heads-up before each access window.
            </p>
          </li>
        </ol>
      </section>

      <section className="mx-auto w-full max-w-5xl border-t border-[var(--outline)] px-6 py-10">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <div className="mt-5">
          <Accordion01 items={FAQ_ITEMS} defaultValue="01" />
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl border-t border-[var(--outline)] px-6 py-10">
        <h2 className="text-3xl font-semibold">Ready to shop the world&apos;s best archives?</h2>
        <p className="mt-2 text-[var(--text-grey)]">Get early access before we open to the public.</p>
        <div className="mt-5 rounded-xl border border-[var(--alt-grey)] p-5">
          <WaitlistForm location="footer" title="Get on the list before public launch" />
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-5xl flex-col gap-3 border-t border-[var(--outline)] px-6 py-8 text-sm md:flex-row md:items-center md:justify-between">
        <p>Various Archives</p>
        <nav className="flex gap-4">
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
          <a href="https://instagram.com/variousarchives" target="_blank" rel="noreferrer" className="hover:underline">
            Instagram
          </a>
        </nav>
      </footer>
    </main>
  );
}
