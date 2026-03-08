'use client';

import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { capturePosthogEvent, identifyPosthogUser } from '@/lib/analytics';
import { saveWaitlistPreferences } from '@/lib/waitlist-api';
import StarBorder from '@/components/ui/star-border';
import SplitText from '@/components/ui/SplitText';

const CATEGORIES = ['Bags', 'Clothing', 'Shoes', 'Accessories', 'Jewelry'];
const SOCIAL_LINKS = [
  {
    label: 'Follow on Instagram',
    href: 'https://instagram.com/various.archives',
  },
  {
    label: 'Follow on TikTok',
    href: 'https://tiktok.com/@variousarchives',
  },
];
const CONTACT_EMAIL = 'contact@various-archives.com';
const PAGE_VERTICAL_PADDING = 64;
const CONTENT_REVEAL_DELAY_MS = 230;
const MOTION_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const LAYOUT_TRANSITION = {
  duration: 1,
  ease: MOTION_EASE,
};
const CONTENT_VARIANTS: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};
const CONTENT_ITEM_VARIANTS: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.72,
      ease: MOTION_EASE,
    },
  },
};

type Gender = 'Women\'s' | 'Men\'s' | 'Both' | null;

export default function ThankYouPage() {
  const prefersReducedMotion = useReducedMotion();
  const introRef = useRef<HTMLElement>(null);
  const revealTimerRef = useRef<number | null>(null);
  const hasScheduledRevealRef = useRef(false);
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<Gender>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [designers, setDesigners] = useState('');
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [introOffset, setIntroOffset] = useState(0);
  const [showSubline, setShowSubline] = useState(false);
  const [showPreferenceContent, setShowPreferenceContent] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('waitlist_email');
      if (stored) setEmail(stored);
    } catch {}
  }, []);

  useLayoutEffect(() => {
    if (prefersReducedMotion) {
      setIntroOffset(0);
      return;
    }

    const measureIntroOffset = () => {
      const introHeight = introRef.current?.getBoundingClientRect().height ?? 0;
      const centeredOffset = Math.max(
        window.innerHeight / 2 - introHeight / 2 - PAGE_VERTICAL_PADDING,
        0
      );
      setIntroOffset(centeredOffset);
    };

    measureIntroOffset();

    const introElement = introRef.current;
    const resizeObserver =
      typeof ResizeObserver === 'undefined' || !introElement
        ? null
        : new ResizeObserver(measureIntroOffset);

    if (resizeObserver && introElement) {
      resizeObserver.observe(introElement);
    }
    window.addEventListener('resize', measureIntroOffset);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', measureIntroOffset);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!prefersReducedMotion) return;

    setShowSubline(true);
    hasScheduledRevealRef.current = true;
    setShowPreferenceContent(true);
  }, [prefersReducedMotion]);

  useEffect(() => {
    return () => {
      if (revealTimerRef.current !== null) {
        window.clearTimeout(revealTimerRef.current);
      }
    };
  }, []);

  const revealPreferenceContent = () => {
    if (prefersReducedMotion || hasScheduledRevealRef.current) return;

    hasScheduledRevealRef.current = true;
    revealTimerRef.current = window.setTimeout(() => {
      setShowPreferenceContent(true);
    }, CONTENT_REVEAL_DELAY_MS);
  };

  const revealSubline = () => {
    if (prefersReducedMotion) return;

    setShowSubline(true);
  };

  const toggleCategory = (cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSave = async () => {
    if (!email) {
      setSaveError('Missing waitlist email. Go back to the waitlist form and try again.');
      return;
    }

    setIsSaving(true);
    setSaveError('');

    const result = await saveWaitlistPreferences({
      email,
      gender,
      categories,
      favouriteDesigners: designers,
      name,
    });

    setIsSaving(false);

    if (!result.ok) {
      capturePosthogEvent('waitlist_preferences_save_failed', {
        error_message: result.error,
      });
      setSaveError(result.error);
      return;
    }

    identifyPosthogUser(email, {
      email,
      gender,
      categories,
      favourite_designers: designers.trim() || null,
      name: name.trim() || null,
    });
    capturePosthogEvent('waitlist_preferences_saved', {
      has_name: Boolean(name.trim()),
      gender,
      category_count: categories.length,
      has_favourite_designers: Boolean(designers.trim()),
    });
    setSaved(true);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[var(--body-background)] text-[var(--main-black)]">
      <motion.div
        layout
        className="mx-auto w-full max-w-xl px-6 py-16"
        transition={{ layout: LAYOUT_TRANSITION }}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none"
          initial={false}
          animate={{ height: prefersReducedMotion || showPreferenceContent ? 0 : introOffset }}
          transition={prefersReducedMotion ? { duration: 0 } : LAYOUT_TRANSITION}
        />

        {/* Zone 1 — Confirmation */}
        <motion.section
          ref={introRef}
          layout="position"
          transition={{ layout: LAYOUT_TRANSITION }}
        >
          <h1 className="text-3xl font-semibold">
            {prefersReducedMotion ? (
              <span>You&apos;re on the list.</span>
            ) : (
              <SplitText
                text="You're on the list."
                tag="span"
                splitType="chars"
                delay={30}
                duration={0.65}
                ease="power3.out"
                from={{ opacity: 0, y: 30 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.2}
                rootMargin="0px"
                textAlign="left"
                onLetterAnimationComplete={revealSubline}
              />
            )}
          </h1>
          <AnimatePresence initial={false}>
            {showSubline ? (
              <motion.p
                key="subline"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : {
                        duration: 0.5,
                        ease: MOTION_EASE,
                      }
                }
                onAnimationComplete={revealPreferenceContent}
                className="mt-3 text-base text-[var(--text-grey)]"
              >
                We&apos;ll be in touch with early access details and first looks.<br/>Check your inbox for a confirmation.
              </motion.p>
            ) : null}
          </AnimatePresence>
        </motion.section>

        {/* Zone 2 — Preferences */}
        <AnimatePresence initial={false}>
          {showPreferenceContent ? (
            <motion.section
              key="preferences"
              layout
              initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={prefersReducedMotion ? { duration: 0 } : LAYOUT_TRANSITION}
              className="mt-12 border-t border-[var(--outline)] pt-10"
            >
              <motion.div
                variants={CONTENT_VARIANTS}
                initial={prefersReducedMotion ? false : 'hidden'}
                animate="visible"
              >
                {saved ? (
                  <>
                    <motion.div
                      variants={CONTENT_ITEM_VARIANTS}
                      className="border border-[var(--alt-grey)] bg-white/50 p-5"
                    >
                      <p className="text-base font-medium">Preferences saved.</p>
                      <p className="mt-1 text-sm text-[var(--text-grey)]">
                        You can update these anytime.
                      </p>
                    </motion.div>

                    <motion.div variants={CONTENT_ITEM_VARIANTS} className="mt-8">
                      <p className="text-xs uppercase tracking-[0.08em] text-[var(--silver)]">
                        Follow along
                      </p>
                      <h2 className="mt-2 text-xl font-semibold">
                        Keep up with the launch on social.
                      </h2>
                      <p className="mt-2 max-w-lg text-sm text-[var(--text-grey)]">
                        We share first looks, seller highlights, and launch updates on Instagram and TikTok first.
                      </p>
                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        {SOCIAL_LINKS.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex min-h-12 w-full items-center justify-center border border-[var(--main-black)] bg-[var(--main-black)] px-5 text-sm font-medium uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-85 sm:w-auto"
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="mt-4 inline-flex text-sm text-[var(--text-grey)] underline-offset-4 transition-colors hover:text-[var(--main-black)] hover:underline"
                      >
                        Contact us
                      </a>
                    </motion.div>
                  </>
                ) : (
                  <div className="mt-8 space-y-5">
                    <motion.div variants={CONTENT_ITEM_VARIANTS}>
                      <h2 className="text-xl font-semibold">Tell us what you&apos;re looking for.</h2>
                      <p className="mt-2 text-sm text-[var(--text-grey)]">
                        Optional. 20 seconds. So we show you the right pieces first.
                      </p>
                    </motion.div>

                    {/* Gender */}
                    <motion.div variants={CONTENT_ITEM_VARIANTS}>
                      <p className="mb-3 text-sm font-medium">I&apos;m looking for</p>
                      <div className="flex flex-wrap gap-2">
                        {(["Women's", "Men's", "Both"] as const).map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setGender(g)}
                            className={`border px-4 py-2 text-sm transition-colors ${
                              gender === g
                                ? 'border-[var(--main-black)] bg-[var(--main-black)] text-white'
                                : 'border-[var(--alt-grey)] hover:border-[var(--main-black)]'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </motion.div>

                    {/* Categories */}
                    <motion.div variants={CONTENT_ITEM_VARIANTS}>
                      <p className="mb-3 text-sm font-medium">I&apos;m interested in</p>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => toggleCategory(cat)}
                            className={`border px-4 py-2 text-sm transition-colors ${
                              categories.includes(cat)
                                ? 'border-[var(--main-black)] bg-[var(--main-black)] text-white'
                                : 'border-[var(--alt-grey)] hover:border-[var(--main-black)]'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </motion.div>

                    {/* Designers */}
                    <motion.div variants={CONTENT_ITEM_VARIANTS}>
                      <label className="mb-2 block text-sm font-medium" htmlFor="designers">
                        Favourite designers
                      </label>
                      <input
                        id="designers"
                        type="text"
                        value={designers}
                        onChange={(e) => setDesigners(e.target.value)}
                        placeholder="e.g. Margiela, Prada, Helmut Lang"
                        className="h-11 w-full border border-neutral-300 bg-white px-3 text-black outline-none transition focus:border-black"
                      />
                    </motion.div>

                    {/* Name */}
                    <motion.div variants={CONTENT_ITEM_VARIANTS}>
                      <label className="mb-2 block text-sm font-medium" htmlFor="name">
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder=""
                        className="h-11 w-full border border-neutral-300 bg-white px-3 text-black outline-none transition focus:border-black"
                      />
                    </motion.div>

                    <motion.div variants={CONTENT_ITEM_VARIANTS}>
                      <StarBorder
                        as="button"
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full"
                        color="rgba(17, 17, 17, 0.75)"
                        speed="3.5s"
                        thickness={1.5}
                      >
                        {isSaving ? 'Saving...' : 'Save my preferences'}
                      </StarBorder>
                      <p className="mt-3 text-xs text-neutral-500">You can update these anytime.</p>
                      {saveError ? <p className="mt-2 text-sm text-red-700">{saveError}</p> : null}
                    </motion.div>

                  </div>
                )}
              </motion.div>
            </motion.section>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
