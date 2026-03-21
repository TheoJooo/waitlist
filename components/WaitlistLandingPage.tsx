'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import WaitlistForm from '@/components/WaitlistForm';
import { Accordion01 } from '@/components/ui/accordion-01-1';
import GlowTiltCard from '@/components/ui/glow-tilt-card';
import StarBorder from '@/components/ui/star-border';
import StepperForm from '@/components/StepperForm';
import ProfileCard from '@/components/ui/ProfileCard';
import logo from '@/public/logo.png';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type BackgroundPaperShadersType = typeof import('@/components/ui/background-paper-shaders').default;
type FlyingPostersType = typeof import('@/components/FlyingPosters').default;
type LightRaysType = typeof import('@/components/ui/light-rays').default;
type ImageTrailType = typeof import('@/components/ui/image-trail').default;
type WorldMapType = (typeof import('@/components/ui/map'))['WorldMap'];
type MobileBenefitVisual = {
  key: number;
  imageIndex: number;
  src: string;
  top: number;
  left: number;
  width: number;
  rotate: number;
};

const loadBackgroundPaperShaders = () => import('@/components/ui/background-paper-shaders').then((mod) => mod.default);
const loadFlyingPosters = () => import('@/components/FlyingPosters').then((mod) => mod.default);
const loadLightRays = () => import('@/components/ui/light-rays').then((mod) => mod.default);
const loadImageTrail = () => import('@/components/ui/image-trail').then((mod) => mod.default);
const loadWorldMap = () => import('@/components/ui/map').then((mod) => mod.WorldMap);

const POSTER_IMAGES = [
  '/images/flyingposter-img-0.webp',
  '/images/flyingposter-img-1.webp',
  '/images/flyingposter-img-2.webp',
  '/images/flyingposter-img-3.webp',
];

const BENEFIT_IMAGES = [
  '/images/benefits-img-1.webp',
  '/images/benefits-img-2.webp',
  '/images/benefits-img-3.webp',
  '/images/benefits-img-4.webp',
  '/images/benefits-img-5.webp',
];

const HERO_TITLE_LINES = [
  'The World\'s Best Luxury Vintage.',
  'Curated by Professionals.',
  'All in One Place.',
];

const FLYING_POSTERS_FADE_MASK =
  'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.92) 16%, #000 34%, #000 62%, rgba(0, 0, 0, 0.78) 76%, rgba(0, 0, 0, 0.28) 92%, transparent 100%)';
const HERO_TO_SOCIAL_PROOF_GRADIENT =
  'linear-gradient(to bottom, rgba(238, 238, 238, 0) 0%, rgba(238, 238, 238, 0.08) 18%, rgba(238, 238, 238, 0.32) 42%, rgba(238, 238, 238, 0.72) 74%, var(--body-background) 100%)';
const MOBILE_BENEFIT_FADE_IN_MS = 900;
const MOBILE_BENEFIT_HOLD_MS = 1500;
const MOBILE_BENEFIT_FADE_OUT_MS = 900;
const MOBILE_BENEFIT_GAP_MS = 260;

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

const FOOTER_MAP_DOTS = [
  // New York → London (W→E, court)
  {
    start: { lat: 40.7128, lng: -74.006, label: 'New York' },
    end: { lat: 51.5074, lng: -0.1278, label: 'London' },
  },
  // Tokyo → Paris (E→W, long arc Eurasie)
  {
    start: { lat: 35.6762, lng: 139.6503, label: 'Tokyo' },
    end: { lat: 48.8566, lng: 2.3522, label: 'Paris' },
  },
  // Los Angeles → Seoul (W→E, transpacifique)
  {
    start: { lat: 34.0522, lng: -118.2437, label: 'Los Angeles' },
    end: { lat: 37.5665, lng: 126.978, label: 'Seoul' },
  },
  // Seoul → Toronto (E→W, arc polaire retour)
  {
    start: { lat: 37.5665, lng: 126.978, label: 'Seoul' },
    end: { lat: 43.6532, lng: -79.3832, label: 'Toronto' },
  },
  // London → Bangkok (vers le sud-est)
  {
    start: { lat: 51.5074, lng: -0.1278, label: 'London' },
    end: { lat: 13.7563, lng: 100.5018, label: 'Bangkok' },
  },
  // Berlin → Hong Kong (vers le sud-est)
  {
    start: { lat: 52.52, lng: 13.405, label: 'Berlin' },
    end: { lat: 22.3193, lng: 114.1694, label: 'Hong Kong' },
  },
  // Shanghai → New York (E→W, route Pacifique)
  {
    start: { lat: 31.2304, lng: 121.4737, label: 'Shanghai' },
    end: { lat: 40.7128, lng: -74.006, label: 'New York' },
  },
];

function animateSoftSection(section: HTMLElement) {
  const items = Array.from(section.querySelectorAll<HTMLElement>('[data-reveal-item]'));

  if (!items.length) return;

  gsap.fromTo(
    items,
    { autoAlpha: 0, y: 24 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.72,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 82%',
        once: true,
      },
    }
  );
}

function animateFeatureGrid(section: HTMLElement) {
  const heading = section.querySelector<HTMLElement>('[data-reveal-heading]');
  const cards = Array.from(section.querySelectorAll<HTMLElement>('[data-reveal-card]'));
  const cta = section.querySelector<HTMLElement>('[data-reveal-cta]');

  if (!heading && !cards.length && !cta) return;

  const timeline = gsap.timeline({
    defaults: { ease: 'power3.out' },
    scrollTrigger: {
      trigger: section,
      start: 'top 76%',
      once: true,
    },
  });

  if (heading) {
    timeline.fromTo(
      heading,
      { autoAlpha: 0, y: 28 },
      { autoAlpha: 1, y: 0, duration: 0.82 }
    );
  }

  if (cards.length) {
    timeline.fromTo(
      cards,
      { autoAlpha: 0, y: 36 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.84,
        stagger: 0.12,
      },
      heading ? '-=0.42' : 0
    );
  }

  if (cta) {
    timeline.fromTo(
      cta,
      { autoAlpha: 0, y: 18 },
      { autoAlpha: 1, y: 0, duration: 0.68 },
      cards.length || heading ? '-=0.34' : 0
    );
  }
}

function animateStepsSection(section: HTMLElement) {
  const heading = section.querySelector<HTMLElement>('[data-reveal-heading]');
  const media = section.querySelector<HTMLElement>('[data-reveal-media]');
  const cards = Array.from(section.querySelectorAll<HTMLElement>('[data-reveal-card]'));

  if (!heading && !media && !cards.length) return;

  const timeline = gsap.timeline({
    defaults: { ease: 'power3.out' },
    scrollTrigger: {
      trigger: section,
      start: 'top 74%',
      once: true,
    },
  });

  if (heading) {
    timeline.fromTo(
      heading,
      { autoAlpha: 0, y: 26 },
      { autoAlpha: 1, y: 0, duration: 0.78 }
    );
  }

  if (media) {
    timeline.fromTo(
      media,
      { autoAlpha: 0, scale: 0.965 },
      { autoAlpha: 1, scale: 1, duration: 0.92, ease: 'power2.out' },
      heading ? '-=0.34' : 0
    );
  }

  if (cards.length) {
    timeline.fromTo(
      cards,
      { autoAlpha: 0, y: 28 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.78,
        stagger: 0.11,
      },
      media ? '-=0.52' : heading ? '-=0.28' : 0
    );
  }
}

function animateFooterSection(section: HTMLElement) {
  const visual = section.querySelector<HTMLElement>('[data-reveal-visual]');
  const content = section.querySelector<HTMLElement>('[data-reveal-content]');

  if (!visual && !content) return;

  const timeline = gsap.timeline({
    defaults: { ease: 'power3.out' },
    scrollTrigger: {
      trigger: section,
      start: 'top 75%',
      once: true,
    },
  });

  if (visual) {
    timeline.fromTo(
      visual,
      { autoAlpha: 0, x: -42, y: 24 },
      { autoAlpha: 1, x: 0, y: 0, duration: 0.9 }
    );
  }

  if (content) {
    timeline.fromTo(
      content,
      { autoAlpha: 0, x: 42, y: 24 },
      { autoAlpha: 1, x: 0, y: 0, duration: 0.9 },
      visual ? '-=0.66' : 0
    );
  }
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const check = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsMobile((prev) => {
          const next = window.innerWidth < 768;
          return prev === next ? prev : next;
        });
      }, 200);
    };
    // Initial check without debounce
    setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => { window.removeEventListener('resize', check); clearTimeout(timer); };
  }, []);
  return isMobile;
}

function useIsLowEndDevice() {
  const [isLowEnd, setIsLowEnd] = useState(false);
  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 4;
    const conn = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
    const slowNetwork = conn?.effectiveType === '2g' || conn?.effectiveType === 'slow-2g';
    setIsLowEnd(cores <= 2 || !!slowNetwork);
  }, []);
  return isLowEnd;
}

function useDeferredMount<T extends HTMLElement>(rootMargin = '320px') {
  const ref = useRef<T>(null);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    if (shouldMount) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldMount(true);
        observer.disconnect();
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, shouldMount]);

  return [ref, shouldMount] as const;
}

function useSectionInView<T extends HTMLElement>(ref: RefObject<T | null>, rootMargin = '0px') {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin, threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return isInView;
}

function useLazyClientComponent<T>(load: () => Promise<T>, enabled: boolean) {
  const [component, setComponent] = useState<T | null>(null);

  useEffect(() => {
    if (!enabled || component) return;

    let cancelled = false;

    load().then((loaded) => {
      if (cancelled) return;
      setComponent(() => loaded);
    });

    return () => {
      cancelled = true;
    };
  }, [enabled, load, component]);

  return component;
}

function getRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function createMobileBenefitVisual(previousIndex: number): MobileBenefitVisual {
  const candidateIndexes = BENEFIT_IMAGES
    .map((_, index) => index)
    .filter((index) => index !== previousIndex);
  const imageIndex = candidateIndexes[Math.floor(Math.random() * candidateIndexes.length)];

  return {
    key: Date.now() + Math.random(),
    imageIndex,
    src: BENEFIT_IMAGES[imageIndex],
    top: getRandomNumber(18, 82),
    left: getRandomNumber(20, 80),
    width: getRandomNumber(38, 56),
    rotate: getRandomNumber(-14, 14),
  };
}

function useMobileBenefitBackground(enabled: boolean) {
  const [visual, setVisual] = useState<MobileBenefitVisual | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setVisual(null);
      setIsVisible(false);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let previousIndex = -1;
    let cancelled = false;
    const timers = new Set<ReturnType<typeof setTimeout>>();

    const schedule = (callback: () => void, delay: number) => {
      const timer = setTimeout(() => {
        timers.delete(timer);
        callback();
      }, delay);

      timers.add(timer);
    };

    const clearTimers = () => {
      timers.forEach(clearTimeout);
      timers.clear();
    };

    const showNext = () => {
      if (cancelled) return;

      const nextVisual = createMobileBenefitVisual(previousIndex);
      previousIndex = nextVisual.imageIndex;

      setIsVisible(false);
      setVisual(nextVisual);

      if (prefersReducedMotion) {
        setIsVisible(true);
        return;
      }

      schedule(() => {
        if (!cancelled) setIsVisible(true);
      }, 60);

      schedule(() => {
        if (!cancelled) setIsVisible(false);
      }, MOBILE_BENEFIT_FADE_IN_MS + MOBILE_BENEFIT_HOLD_MS);

      schedule(showNext, MOBILE_BENEFIT_FADE_IN_MS + MOBILE_BENEFIT_HOLD_MS + MOBILE_BENEFIT_FADE_OUT_MS + MOBILE_BENEFIT_GAP_MS);
    };

    showNext();

    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [enabled]);

  return { visual, isVisible };
}

export default function Home() {
  const isMobile = useIsMobile();
  const isLowEnd = useIsLowEndDevice();
  const pageRef = useRef<HTMLElement>(null);
  const [showHeroShader, setShowHeroShader] = useState(false);
  const [benefitsVisualRef, showBenefitsVisuals] = useDeferredMount<HTMLElement>('340px');
  const [stepsVisualRef, showStepsVisuals] = useDeferredMount<HTMLElement>('340px');
  const [footerVisualRef, showFooterVisuals] = useDeferredMount<HTMLElement>('340px');
  const BackgroundPaperShadersComponent =
    useLazyClientComponent<BackgroundPaperShadersType>(loadBackgroundPaperShaders, showHeroShader);
  const FlyingPostersComponent =
    useLazyClientComponent<FlyingPostersType>(loadFlyingPosters, showStepsVisuals && !isLowEnd);
  const LightRaysComponent =
    useLazyClientComponent<LightRaysType>(loadLightRays, showBenefitsVisuals && !isMobile && !isLowEnd);
  const ImageTrailComponent =
    useLazyClientComponent<ImageTrailType>(loadImageTrail, showBenefitsVisuals && !isMobile && !isLowEnd);
  const WorldMapComponent =
    useLazyClientComponent<WorldMapType>(loadWorldMap, showFooterVisuals);
  const isBenefitsInView = useSectionInView(benefitsVisualRef, '-10% 0px -10% 0px');
  const { visual: mobileBenefitVisual, isVisible: isMobileBenefitVisible } =
    useMobileBenefitBackground(showBenefitsVisuals && isMobile && !isLowEnd && isBenefitsInView);

  useEffect(() => {
    setShowHeroShader(true);
  }, []);

  useGSAP(
    () => {
      const page = pageRef.current;
      if (!page) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const heroLogo = page.querySelector<HTMLElement>('[data-hero-logo]');
      const heroEyebrow = page.querySelector<HTMLElement>('[data-hero-eyebrow]');
      const heroLines = Array.from(page.querySelectorAll<HTMLElement>('[data-hero-line]'));
      const heroCopy = page.querySelector<HTMLElement>('[data-hero-copy]');
      const heroCard = page.querySelector<HTMLElement>('[data-hero-card]');

      const heroTimeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.12,
      });

      if (heroLogo) {
        heroTimeline.fromTo(
          heroLogo,
          { autoAlpha: 0, y: -16 },
          { autoAlpha: 1, y: 0, duration: 0.55 }
        );
      }

      if (heroEyebrow) {
        heroTimeline.fromTo(
          heroEyebrow,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.55 },
          heroLogo ? '-=0.24' : 0
        );
      }

      if (heroLines.length) {
        heroTimeline.fromTo(
          heroLines,
          { autoAlpha: 0, yPercent: 115 },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1.02,
            stagger: 0.12,
            ease: 'power4.out',
          },
          heroEyebrow || heroLogo ? '-=0.16' : 0
        );
      }

      if (heroCopy) {
        heroTimeline.fromTo(
          heroCopy,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.7 },
          heroLines.length ? '-=0.58' : 0
        );
      }

      if (heroCard) {
        heroTimeline.fromTo(
          heroCard,
          { autoAlpha: 0, y: 48, rotateX: 8, transformPerspective: 1200, transformOrigin: '50% 0%' },
          { autoAlpha: 1, y: 0, rotateX: 0, duration: 1.02 },
          heroCopy || heroLines.length ? '-=0.66' : 0
        );
      }

      // Defer scroll-triggered animations so they don't compete with hero paint
      const setupScrollAnimations = () => {
        Array.from(page.querySelectorAll<HTMLElement>('[data-reveal-group="soft"]')).forEach(animateSoftSection);
        Array.from(page.querySelectorAll<HTMLElement>('[data-reveal-group="feature-grid"]')).forEach(animateFeatureGrid);
        Array.from(page.querySelectorAll<HTMLElement>('[data-reveal-group="steps"]')).forEach(animateStepsSection);
        Array.from(page.querySelectorAll<HTMLElement>('[data-reveal-group="footer-cta"]')).forEach(animateFooterSection);
      };
      if ('requestIdleCallback' in window) {
        (window as Window).requestIdleCallback(setupScrollAnimations, { timeout: 1500 });
      } else {
        setTimeout(setupScrollAnimations, 300);
      }
    },
    { scope: pageRef, dependencies: [isMobile], revertOnUpdate: true }
  );

  return (
    <main ref={pageRef} className="min-h-screen bg-(--body-background) text-(--main-black)">

      {/* Hero */}
      <section id="hero-form" className="relative w-full min-h-[100svh] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_42%_18%,rgba(64,64,64,0.9)_0%,rgba(26,26,26,0.96)_44%,rgba(0,0,0,1)_100%)]" />
        <div
          className={`absolute inset-0 transition-opacity duration-500 ease-out ${
            showHeroShader ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {BackgroundPaperShadersComponent ? <BackgroundPaperShadersComponent /> : null}
          <div
            className="pointer-events-none absolute inset-0 z-1"
            style={{
              background: 'radial-gradient(ellipse 100% 30% at 50% 100%, #eee 0%, rgba(238,238,238,0.85) 25%, rgba(238,238,238,0.5) 55%, rgba(238,238,238,0.15) 75%, transparent 90%)',
            }}
          />
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-2 h-40 md:h-52"
          style={{ background: HERO_TO_SOCIAL_PROOF_GRADIENT }}
        />

        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-5xl flex-col px-6 pt-6 pb-8">
          <header data-hero-logo className="flex shrink-0 items-center justify-center">
            <Image src={logo} alt="Various Archives logo" width={160} height={36} priority />
          </header>

          <div className="flex flex-1 items-center">
          <div className="w-full grid gap-10 md:grid-cols-2 md:gap-10 md:pb-12">
            <div>
              <p data-hero-eyebrow className="text-xs uppercase tracking-[0.08em] text-[var(--silver)]">Early Access Waitlist</p>
              <h1 className="mt-2 text-3xl font-semibold leading-thin text-[var(--text-white)] md:mt-3 md:text-2xl">
                {HERO_TITLE_LINES.map((line) => (
                  <span key={line} className="block overflow-hidden">
                    <span data-hero-line className="block">
                      {line}
                    </span>
                  </span>
                ))}
              </h1>
              <p data-hero-copy className="mt-5 max-w-xl text-base leading-relaxed text-[var(--alt-grey)] md:mt-6">
                Various Archives connects you with vintage designer pieces from trusted boutiques worldwide.<br />
                Skip the noise. Discover what matters.
              </p>
            </div>

            <div data-hero-card className="md:self-end md:pb-[22px]">
              <GlowTiltCard className="translate-y-5 px-5 py-5 md:px-8 md:py-8">
                <WaitlistForm location="hero" />
              </GlowTiltCard>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="relative z-10 -mt-16 w-full overflow-hidden md:-mt-28" data-reveal-group="soft">
        <div className="relative mx-auto max-w-5xl px-6 pt-32 pb-28 text-center md:pt-28 md:pb-24">
          <p data-reveal-item className="text-lg font-medium">Join 1,000+ luxury fashion collectors who&apos;ve secured their early access.</p>
          <p data-reveal-item className="mt-2 text-sm text-[var(--text-grey)] hidden md:block">
            56k+ community · 172 designers · Selected professional sellers
          </p>
          <div data-reveal-item className="mt-2 flex flex-col gap-1 md:hidden">
            <p className="text-sm text-[var(--text-grey)]">56k+ community · 172 designers</p>
            <p className="text-sm text-[var(--text-grey)]">Selected professional sellers</p>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* Pain points */}
      <section className="relative w-full bg-white overflow-hidden">
        <div className="mx-auto max-w-5xl px-6 pt-24 pb-32 md:border-t md:border-[var(--outline)] md:py-32" data-reveal-group="feature-grid">
          <h2 data-reveal-heading className="text-2xl font-semibold px-4 md:px-0">The problem with luxury vintage today</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {PAIN_POINTS.map((item) => (
              <article key={item.number} data-reveal-card className="p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-[var(--silver)]">{item.number}</p>
                <h3 className="mt-2 text-lg font-medium">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-grey)]">{item.description}</p>
              </article>
            ))}
          </div>
          <div data-reveal-cta className="mt-16 md:mt-8 flex justify-center">
            <StarBorder
              as="button"
              type="button"
              onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}
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
      <section id="benefits" ref={benefitsVisualRef} className="relative w-full bg-[var(--main-black)] overflow-hidden">
        {/* ImageTrail — desktop only, pointer-events-none so content stays clickable */}
        {showBenefitsVisuals && ImageTrailComponent ? (
          <div className="hidden md:block absolute inset-0 z-20">
            <ImageTrailComponent items={BENEFIT_IMAGES} />
          </div>
        ) : null}
        {mobileBenefitVisual ? (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden md:hidden">
            <div
              key={mobileBenefitVisual.key}
              className={`absolute aspect-[3/4] overflow-hidden rounded-none border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.45)] transition-opacity ease-out ${
                isMobileBenefitVisible ? 'opacity-40 duration-[900ms]' : 'opacity-0 duration-[900ms]'
              }`}
              style={{
                top: `${mobileBenefitVisual.top}%`,
                left: `${mobileBenefitVisual.left}%`,
                width: `${mobileBenefitVisual.width}vw`,
                transform: `translate(-50%, -50%) rotate(${mobileBenefitVisual.rotate}deg)`,
                willChange: 'opacity, transform',
              }}
            >
              <Image
                src={mobileBenefitVisual.src}
                alt=""
                fill
                sizes={`${Math.round(mobileBenefitVisual.width)}vw`}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/35" />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.14)_38%,rgba(0,0,0,0.4)_100%)]" />
          </div>
        ) : null}
        {showBenefitsVisuals && !isMobile && LightRaysComponent ? (
          <div className="absolute inset-0">
            <LightRaysComponent
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
        ) : null}
        <div className="relative z-30 mx-auto max-w-5xl px-6 py-44" data-reveal-group="feature-grid">
          <h2 data-reveal-heading className="text-2xl font-semibold text-white">What Various Archives brings you</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <article key={benefit.title} data-reveal-card className="border border-white/10 bg-black/20 backdrop-blur-md px-4 pt-4 pb-6">
                <h3 className="text-lg font-medium text-white">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-300">{benefit.description}</p>
              </article>
            ))}
          </div>
          <div data-reveal-cta className="mt-8 border-t border-white/10 pt-8 flex flex-col items-center">
            <StepperForm location="benefits" />
          </div>
        </div>
      </section>

      {/* Steps + Flying Posters */}
      <section ref={stepsVisualRef} className="relative mx-auto w-full max-w-5xl overflow-hidden" data-reveal-group="steps">
        {/* Mobile: FlyingPosters as background */}
        {isMobile && showStepsVisuals && (
          <div
            data-reveal-media
            className="absolute top-0 bottom-0 opacity-60"
            style={{
              width: '100vw',
              left: 'calc(50% - 50vw)',
              maskImage: FLYING_POSTERS_FADE_MASK,
              WebkitMaskImage: FLYING_POSTERS_FADE_MASK,
            }}
          >
            {FlyingPostersComponent ? (
              <FlyingPostersComponent
                items={POSTER_IMAGES}
                planeWidth={220}
                planeHeight={280}
                distortion={3}
                scrollEase={0.05}
                cameraFov={45}
                cameraZ={20}
                autoScrollSpeed={-0.01}
                bleed={90}
                disableInteraction
              />
            ) : null}
          </div>
        )}

        <div className="relative z-10 px-6 py-32">
          <h2 data-reveal-heading className="text-2xl font-semibold">What happens next</h2>

          {/* Mobile: stacked */}
          <ol className="mt-5 grid gap-4 md:hidden">
            <li data-reveal-card className="border border-[var(--alt-grey)]/60 bg-white/40 backdrop-blur-md p-4" onClick={() => document.getElementById('footer-form')?.scrollIntoView({ behavior: 'smooth' })}>
              <p className="text-xs uppercase tracking-[0.08em] text-[var(--silver)]">Step 1</p>
              <h3 className="mt-2 text-lg font-medium">Sign up</h3>
              <p className="mt-2 text-sm text-[var(--text-grey)]">Enter your email and you&apos;re on the list.</p>
            </li>
            <li data-reveal-card className="border border-[var(--alt-grey)]/60 bg-white/40 backdrop-blur-md p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-[var(--silver)]">Step 2</p>
              <h3 className="mt-2 text-lg font-medium">Get early updates</h3>
              <p className="mt-2 text-sm text-[var(--text-grey)]">
                We&apos;ll share progress, new sellers, and first looks before anyone else.
              </p>
            </li>
            <li data-reveal-card className="border border-[var(--alt-grey)]/60 bg-white/40 backdrop-blur-md p-4">
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
              <article data-reveal-card className="col-start-1 row-start-1 self-center border border-[var(--alt-grey)]/60 bg-white/40 backdrop-blur-md p-4" onClick={() => document.getElementById('footer-form')?.scrollIntoView({ behavior: 'smooth' })}>
                <p className="text-xs uppercase tracking-[0.08em] text-[var(--silver)]">Step 1</p>
                <h3 className="mt-2 text-lg font-medium">Sign up</h3>
                <p className="mt-2 text-sm text-[var(--text-grey)]">Enter your email and you&apos;re on the list.</p>
              </article>

              {/* FlyingPosters — center, all 3 rows */}
              <div
                data-reveal-media
                className="col-start-2 row-start-1 row-span-3 h-full"
                style={{
                  maskImage: FLYING_POSTERS_FADE_MASK,
                  WebkitMaskImage: FLYING_POSTERS_FADE_MASK,
                }}
              >
                {showStepsVisuals && FlyingPostersComponent ? (
                  <FlyingPostersComponent
                    items={POSTER_IMAGES}
                    planeWidth={220}
                    planeHeight={280}
                    distortion={3}
                    scrollEase={0.05}
                    cameraFov={45}
                    cameraZ={20}
                    autoScrollSpeed={-0.01}
                    bleed={90}
                  />
                ) : null}
              </div>

              {/* Step 2 — right, row 2 */}
              <article data-reveal-card className="col-start-3 row-start-2 self-center border border-[var(--alt-grey)]/60 bg-white/40 backdrop-blur-md p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-[var(--silver)]">Step 2</p>
                <h3 className="mt-2 text-lg font-medium">Get early updates</h3>
                <p className="mt-2 text-sm text-[var(--text-grey)]">
                  We&apos;ll share progress, new sellers, and first looks before anyone else.
                </p>
              </article>

              {/* Step 3 — left, row 3 */}
              <article data-reveal-card className="col-start-1 row-start-3 self-center border border-[var(--alt-grey)]/60 bg-white/40 backdrop-blur-md p-4">
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
      <section className="mx-auto w-full max-w-5xl md:border-t md:border-[var(--outline)] px-6 py-32" data-reveal-group="soft">
        <h2 data-reveal-item className="text-2xl font-semibold">Good to know</h2>
        <div data-reveal-item className="mt-5">
          <Accordion01 items={FAQ_ITEMS} />
        </div>
      </section>

      {/* Final CTA + Footer */}
      <section id="footer-form" ref={footerVisualRef} className="relative w-full bg-[var(--main-black)] overflow-hidden">
        {showFooterVisuals && WorldMapComponent ? (
          <div className="absolute inset-0 pointer-events-none">
            <WorldMapComponent
              dots={FOOTER_MAP_DOTS}
              lineColor="#e8e8e8"
              showLabels={false}
              animationDuration={2.4}
              loop
              interactive={false}
              className="h-full w-full rounded-none bg-transparent dark:bg-transparent aspect-auto opacity-50"
            />
          </div>
        ) : null}
        <div className="absolute inset-0 bg-[var(--main-black)]/60 md:bg-[var(--main-black)]/72 pointer-events-none" />

        <div className="relative z-10 mx-auto flex min-h-[760px] max-w-6xl items-center px-12 py-32 md:min-h-[820px] md:py-28" data-reveal-group="footer-cta">
          <div className="grid w-full gap-16 md:grid-cols-2 md:items-center">
            <div data-reveal-visual className="flex justify-center md:justify-end md:items-center order-first md:order-none">
              <ProfileCard
                name="Various Archives"
                title="Vintage Curator"
                avatarUrl=""
                behindGlowColor="rgba(180, 160, 130, 0.4)"
                idNumber="VA-####-####"
                enableMobileTilt={true}
                mobileTiltSensitivity={6}
              />
            </div>

            <div data-reveal-content className="flex flex-col items-center text-center md:items-start md:text-left">
              <h2 className="text-3xl font-semibold text-white">Don&apos;t miss the opening.</h2>
              <p className="mt-3 text-[var(--alt-grey)]">Early access is limited to the waitlist.<br/>Free, takes 10 seconds.</p>
              <div className="mt-10 flex w-full max-w-lg justify-center md:justify-start">
                <StepperForm location="footer" />
              </div>
            </div>
          </div>
        </div>

        <footer className="relative z-10 border-t border-white/10 px-6 py-8 text-sm text-center">
          <div className="flex justify-center gap-5 mb-3">
            <a
              href="https://instagram.com/various.archives"
              target="_blank"
              rel="noreferrer"
              className="text-white/70 hover:text-white transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://tiktok.com/@various.archives"
              target="_blank"
              rel="noreferrer"
              className="text-white/70 hover:text-white transition-colors"
            >
              TikTok
            </a>
          </div>
          <p className="text-white/70">
            © 2026 Various Archives ·{' '}
            <Link href="/privacy" target="_blank" rel="noreferrer" className="text-white/70 hover:text-white transition-colors">Privacy Policy</Link>
            {' '}·{' '}
            <a href="mailto:contact@various-archives.com" className="text-white/70 hover:text-white transition-colors">Contact</a>
          </p>
        </footer>
      </section>
    </main>
  );
}
