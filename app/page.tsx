'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import WaitlistForm from '@/components/WaitlistForm';
import PostHogPageView from '@/components/PostHogPageView';
import BackgroundPaperShaders from '@/components/ui/background-paper-shaders';
import { Accordion01 } from '@/components/ui/accordion-01-1';
import GlowTiltCard from '@/components/ui/glow-tilt-card';
import FlyingPosters from '@/components/FlyingPosters';
import StarBorder from '@/components/ui/star-border';
import LightRays from '@/components/ui/light-rays';
import ImageTrail from '@/components/ui/image-trail';
import StepperForm from '@/components/StepperForm';
import logo from '@/public/logo.png';

const POSTER_IMAGES = [
  'https://cdn.cosmos.so/b973f593-b691-4e3d-a806-b15166d04291?format=jpeg',
  'https://cdn.cosmos.so/570eced8-0101-48ee-94e2-07ab6f1810e0?format=jpeg',
  '/images/flyingposter-img-1.jpg',
];

const PAIN_POINTS = [
  {
    number: '1',
    title: 'The best pieces are local',
    description:
      'The archive items worth owning are with sellers in Tokyo, Paris, New York, and cities you haven\'t explored yet. Without the right access, they sell to someone closer.',
  },
  {
    number: '2',
    title: 'Trust shouldn\'t be a question',
    description:
      'Investing in a piece means knowing exactly what you\'re getting. Most platforms leave you guessing on authenticity, condition, and seller credibility.',
  },
  {
    number: '3',
    title: 'Discovery takes too much effort',
    description:
      'The best sellers are scattered across platforms, countries, and languages. Finding the right pieces still depends on luck, algorithms, or knowing the right people.',
  },
];

const BENEFITS = [
  {
    title: 'Global access, one destination',
    description:
      'Shop specialist sellers across Tokyo, Paris, New York, and beyond. Inventory that was once local is now open to you, wherever you are.',
  },
  {
    title: 'Selected professional sellers',
    description:
      'Every seller on Various Archives is a professional with real expertise in luxury vintage. Clearer listings, accurate descriptions, and the credibility that comes with years in the business.',
  },
  {
    title: 'One search, every seller',
    description:
      'No more jumping between platforms, countries, and languages. Browse multiple specialist inventories in one place, with a cleaner path from discovery to purchase.',
  },
];

const FAQ_ITEMS = [
  {
    id: '01',
    title: 'When does access open?',
    content:
      'We\'re launching soon.\nWaitlist members get invited first, before the platform opens to the public.',
  },
  {
    id: '02',
    title: 'What will be on the platform?',
    content:
      'A curated selection of luxury vintage and archival designer pieces.\nSourced from professional boutiques and specialist sellers across multiple countries and eras.',
  },
  {
    id: '03',
    title: 'How do you ensure trust and authenticity?',
    content:
      'Every seller is a vetted professional with established expertise in luxury vintage.\nListings follow stricter standards on descriptions, condition, and seller context than typical resale platforms.',
  },
  {
    id: '04',
    title: 'How often will I receive emails?',
    content:
      'Only for early access, drop previews, and key updates.\nNo daily emails. Unsubscribe anytime.',
  },
  {
    id: '05',
    title: 'Is the waitlist free?',
    content: 'Yes. No payment, no obligation.',
  },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

export default function Home() {
  const isMobile = useIsMobile();

  return (
    <main className="min-h-screen bg-[var(--body-background)] text-[var(--main-black)]">
      <PostHogPageView />

      {/* Hero */}
      <section id="hero-form" className="relative w-full min-h-[100svh] overflow-hidden">
        <BackgroundPaperShaders />
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background: 'radial-gradient(ellipse 100% 30% at 50% 100%, #eee 0%, rgba(238,238,238,0.85) 25%, rgba(238,238,238,0.5) 55%, rgba(238,238,238,0.15) 75%, transparent 90%)',
          }}
        />

        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-5xl flex-col px-6 pt-4 md:pt-6 pb-8">
          <header className="flex items-center justify-center md:justify-start">
            <Image src={logo} alt="Various Archives logo" width={160} height={36} priority />
          </header>

          <div className="grid flex-1 items-center gap-10 pb-12 mt-10 md:mt-0 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-[var(--silver)]">Early Access Waitlist</p>
              <h1 className="mt-3 text-3xl font-semibold leading-thin text-[var(--text-white)]">
                The World&apos;s Best Luxury Vintage.<br />Curated by Professionals.<br />All in One Place.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--alt-grey)]">
                Various Archives connects you with vintage designer pieces from trusted boutiques worldwide.<br />
                Skip the noise.<br />
                Discover what matters.
              </p>
            </div>

            <GlowTiltCard className="p-5">
              <WaitlistForm location="hero" />
            </GlowTiltCard>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="relative w-full overflow-hidden">
        <div className="mx-auto max-w-5xl px-6 pt-10 pb-24 text-center">
          <p className="text-sm font-medium">Join 1,000+ luxury fashion collectors who&apos;ve secured their early access.</p>
          <p className="mt-2 text-sm text-[var(--text-grey)] hidden md:block">
            56k+ community · 172 designers · Selected professional sellers
          </p>
          <div className="mt-2 flex flex-col gap-1 md:hidden">
            <p className="text-sm text-[var(--text-grey)]">56k+ community</p>
            <p className="text-sm text-[var(--text-grey)]">172 designers</p>
            <p className="text-sm text-[var(--text-grey)]">Selected professional sellers</p>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* Pain points */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-5xl md:border-t md:border-[var(--outline)] px-6 py-32">
          <h2 className="text-2xl font-semibold px-4 md:px-0">The problem with luxury vintage today</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {PAIN_POINTS.map((item) => (
              <article key={item.number} className="p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-[var(--silver)]">{item.number}</p>
                <h3 className="mt-2 text-lg font-medium">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-grey)]">{item.description}</p>
              </article>
            ))}
          </div>
          <div className="mt-16 md:mt-8 flex justify-center md:justify-start">
            <StarBorder
              as="button"
              type="button"
              onClick={() => document.getElementById('footer-form')?.scrollIntoView({ behavior: 'smooth' })}
              color="rgba(17, 17, 17, 0.75)"
              speed="3.5s"
              thickness={1.5}
            >
              Get Early Access
            </StarBorder>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative w-full bg-[var(--main-black)] overflow-hidden">
        {/* ImageTrail — desktop only, pointer-events-none so content stays clickable */}
        <div className="hidden md:block absolute inset-0 z-20">
          <ImageTrail items={POSTER_IMAGES} />
        </div>
        <div className="absolute inset-0">
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={0.6}
            lightSpread={1.4}
            rayLength={2.5}
            fadeDistance={0.9}
            saturation={0.3}
            mouseInfluence={0.08}
          />
        </div>
        <div className="relative z-30 mx-auto max-w-5xl px-6 py-44">
          <h2 className="text-2xl font-semibold text-white">What Various Archives brings you</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <article key={benefit.title} className="border border-white/10 bg-black/50 backdrop-blur-md p-4">
                <h3 className="text-lg font-medium text-white">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-300">{benefit.description}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 border-t border-white/10 pt-8 flex flex-col items-center">
            <p className="text-xs uppercase tracking-[0.08em] text-neutral-500 mb-4">Join the waitlist</p>
            <StepperForm location="benefits" />
          </div>
        </div>
      </section>


      {/* Steps + Flying Posters */}
      <section className="relative mx-auto w-full max-w-5xl border-t border-[var(--outline)] overflow-hidden">
        {/* Mobile: FlyingPosters as background */}
        {isMobile && (
          <div
            className="absolute top-0 bottom-0 opacity-60"
            style={{
              width: '100vw',
              left: 'calc(50% - 50vw)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
            }}
          >
            <FlyingPosters
              items={POSTER_IMAGES}
              planeWidth={220}
              planeHeight={280}
              distortion={3}
              scrollEase={0.05}
              cameraFov={45}
              cameraZ={20}
              autoScrollSpeed={-0.01}
              disableInteraction
            />
          </div>
        )}

        <div className="relative z-10 px-6 py-32">
          <h2 className="text-2xl font-semibold">What happens next</h2>

          {/* Mobile: stacked */}
          <ol className="mt-5 grid gap-4 md:hidden">
            <li className="border border-[var(--alt-grey)]/60 bg-white/40 backdrop-blur-md p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-[var(--silver)]">Step 1</p>
              <h3 className="mt-2 text-lg font-medium">Sign up</h3>
              <p className="mt-2 text-sm text-[var(--text-grey)]">Enter your email and you&apos;re on the list.</p>
            </li>
            <li className="border border-[var(--alt-grey)]/60 bg-white/40 backdrop-blur-md p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-[var(--silver)]">Step 2</p>
              <h3 className="mt-2 text-lg font-medium">Get early updates</h3>
              <p className="mt-2 text-sm text-[var(--text-grey)]">
                We&apos;ll share progress, new sellers, and first looks before anyone else.
              </p>
            </li>
            <li className="border border-[var(--alt-grey)]/60 bg-white/40 backdrop-blur-md p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-[var(--silver)]">Step 3</p>
              <h3 className="mt-2 text-lg font-medium">Shop first</h3>
              <p className="mt-2 text-sm text-[var(--text-grey)]">
                When we launch, you get priority access to the full catalogue.
              </p>
            </li>
          </ol>

          {/* Desktop: alternating left/center/right */}
          {!isMobile && (
            <div className="mt-8 grid grid-cols-[1fr_220px_1fr] grid-rows-3 gap-x-16 gap-y-8 h-[480px]">
              {/* Step 1 — left, row 1 */}
              <article className="col-start-1 row-start-1 self-center border border-[var(--alt-grey)]/60 bg-white/40 backdrop-blur-md p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-[var(--silver)]">Step 1</p>
                <h3 className="mt-2 text-lg font-medium">Sign up</h3>
                <p className="mt-2 text-sm text-[var(--text-grey)]">Enter your email and you&apos;re on the list.</p>
              </article>

              {/* FlyingPosters — center, all 3 rows */}
              <div
                className="col-start-2 row-start-1 row-span-3 h-full"
                style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)' }}
              >
                <FlyingPosters
                  items={POSTER_IMAGES}
                  planeWidth={220}
                  planeHeight={280}
                  distortion={3}
                  scrollEase={0.05}
                  cameraFov={45}
                  cameraZ={20}
                  autoScrollSpeed={-0.01}
                />
              </div>

              {/* Step 2 — right, row 2 */}
              <article className="col-start-3 row-start-2 self-center border border-[var(--alt-grey)]/60 bg-white/40 backdrop-blur-md p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-[var(--silver)]">Step 2</p>
                <h3 className="mt-2 text-lg font-medium">Get early updates</h3>
                <p className="mt-2 text-sm text-[var(--text-grey)]">
                  We&apos;ll share progress, new sellers, and first looks before anyone else.
                </p>
              </article>

              {/* Step 3 — left, row 3 */}
              <article className="col-start-1 row-start-3 self-center border border-[var(--alt-grey)]/60 bg-white/40 backdrop-blur-md p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-[var(--silver)]">Step 3</p>
                <h3 className="mt-2 text-lg font-medium">Shop first</h3>
                <p className="mt-2 text-sm text-[var(--text-grey)]">
                  When we launch, you get priority access to the full catalogue.
                </p>
              </article>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-5xl border-t border-[var(--outline)] px-6 py-32">
        <h2 className="text-2xl font-semibold">Good to know</h2>
        <div className="mt-5">
          <Accordion01 items={FAQ_ITEMS} defaultValue="01" />
        </div>
      </section>

      {/* Final CTA */}
      <section id="footer-form" className="mx-auto w-full max-w-5xl border-t border-[var(--outline)] px-6 py-44">
        <h2 className="text-3xl font-semibold">Don&apos;t miss the opening.</h2>
        <p className="mt-2 text-[var(--text-grey)]">Early access is limited to the waitlist. Free, takes 10 seconds.</p>
        <div className="mt-5 border border-[var(--alt-grey)] p-5">
          <WaitlistForm location="footer" variant="compact" />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--outline)] px-6 py-8 text-sm text-center">
        <div className="flex justify-center gap-5 mb-3">
          <a
            href="https://instagram.com/various.archives"
            target="_blank"
            rel="noreferrer"
            className="text-[var(--text-grey)] hover:text-[var(--main-black)] transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://tiktok.com/@variousarchives"
            target="_blank"
            rel="noreferrer"
            className="text-[var(--text-grey)] hover:text-[var(--main-black)] transition-colors"
          >
            TikTok
          </a>
        </div>
        <p className="text-[var(--text-grey)]">
          © 2026 Various Archives ·{' '}
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          {' '}·{' '}
          <a href="mailto:contact@various-archives.com" className="hover:underline">Contact</a>
        </p>
      </footer>
    </main>
  );
}
