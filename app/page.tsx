'use client';

import Image from 'next/image';
import Link from 'next/link';
import WaitlistForm from '@/components/WaitlistForm';
import PostHogPageView from '@/components/PostHogPageView';
import BackgroundPaperShaders from '@/components/ui/background-paper-shaders';
import { Accordion01 } from '@/components/ui/accordion-01-1';
import GlowTiltCard from '@/components/ui/glow-tilt-card';
import FlyingPosters from '@/components/FlyingPosters';
import StarBorder from '@/components/ui/star-border';
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
      'We\'re launching soon. Waitlist members get invited first, before the platform opens to the public.',
  },
  {
    id: '02',
    title: 'What will be on the platform?',
    content:
      'A curated selection of luxury vintage and archival designer pieces, sourced from professional boutiques and specialist sellers across multiple countries and eras.',
  },
  {
    id: '03',
    title: 'How do you ensure trust and authenticity?',
    content:
      'Every seller is a vetted professional with established expertise in luxury vintage. Listings follow stricter standards on descriptions, condition, and seller context than typical resale platforms.',
  },
  {
    id: '04',
    title: 'How often will I receive emails?',
    content:
      'Only for early access, drop previews, and key updates. No daily emails. Unsubscribe anytime.',
  },
  {
    id: '05',
    title: 'Is the waitlist free?',
    content: 'Yes. No payment, no obligation.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--body-background)] text-[var(--main-black)]">
      <PostHogPageView />

      {/* Hero */}
      <section id="hero-form" className="relative w-full min-h-[100svh] overflow-hidden">
        <BackgroundPaperShaders />

        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-5xl flex-col px-6 pt-6 pb-8">
          <header className="flex items-center">
            <Image src={logo} alt="Various Archives logo" width={160} height={36} priority />
          </header>

          <div className="grid flex-1 items-center gap-10 pb-12 md:grid-cols-2">
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
      <section className="mx-auto w-full max-w-5xl px-6 py-10">
        <p className="text-sm text-[var(--text-grey)]">
          56k+ community · 172 designers · Selected professional sellers
        </p>
      </section>

      {/* Pain points */}
      <section className="mx-auto w-full max-w-5xl border-t border-[var(--outline)] px-6 py-10">
        <h2 className="text-2xl font-semibold">The problem with luxury vintage today</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {PAIN_POINTS.map((item) => (
            <article key={item.number} className="border border-[var(--alt-grey)] p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-[var(--silver)]">{item.number}</p>
              <h3 className="mt-2 text-lg font-medium">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-grey)]">{item.description}</p>
            </article>
          ))}
        </div>
        <div className="mt-8">
          <StarBorder
            as="a"
            href="#hero-form"
            color="rgba(17, 17, 17, 0.75)"
            speed="3.5s"
            thickness={1.5}
          >
            Get Early Access
          </StarBorder>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto w-full max-w-5xl border-t border-[var(--outline)] px-6 py-10">
        <h2 className="text-2xl font-semibold">What Various Archives brings you</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {BENEFITS.map((benefit) => (
            <article key={benefit.title} className="border border-[var(--alt-grey)] p-4">
              <h3 className="text-lg font-medium">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-grey)]">{benefit.description}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 border border-[var(--alt-grey)] p-5">
          <WaitlistForm location="mid" variant="compact" buttonLabel="Secure My Spot" />
        </div>
      </section>

      {/* Steps + Flying Posters */}
      <section className="mx-auto w-full max-w-5xl border-t border-[var(--outline)] px-6 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">What happens next</h2>
            <ol className="mt-5 grid gap-4">
              <li className="border border-[var(--alt-grey)] p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-[var(--silver)]">Step 1</p>
                <h3 className="mt-2 text-lg font-medium">Sign up</h3>
                <p className="mt-2 text-sm text-[var(--text-grey)]">Enter your email and you&apos;re on the list.</p>
              </li>
              <li className="border border-[var(--alt-grey)] p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-[var(--silver)]">Step 2</p>
                <h3 className="mt-2 text-lg font-medium">Get early updates</h3>
                <p className="mt-2 text-sm text-[var(--text-grey)]">
                  We&apos;ll share progress, new sellers, and first looks before anyone else.
                </p>
              </li>
              <li className="border border-[var(--alt-grey)] p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-[var(--silver)]">Step 3</p>
                <h3 className="mt-2 text-lg font-medium">Shop first</h3>
                <p className="mt-2 text-sm text-[var(--text-grey)]">
                  When we launch, you get priority access to the full catalogue.
                </p>
              </li>
            </ol>
          </div>
          <div className="h-[480px] w-full md:w-64 shrink-0">
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
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-5xl border-t border-[var(--outline)] px-6 py-10">
        <h2 className="text-2xl font-semibold">Good to know</h2>
        <div className="mt-5">
          <Accordion01 items={FAQ_ITEMS} defaultValue="01" />
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto w-full max-w-5xl border-t border-[var(--outline)] px-6 py-10">
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
