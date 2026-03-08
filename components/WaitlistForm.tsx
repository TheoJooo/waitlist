'use client';

import { startTransition, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { capturePosthogEvent, getUtmFromWindow, identifyPosthogUser } from '@/lib/analytics';
import { EMAIL_RGX } from '@/lib/waitlist';
import { submitWaitlistSignup } from '@/lib/waitlist-api';
import { getWaitlistSignupTiming } from '@/lib/waitlist-timing';
import StarBorder from '@/components/ui/star-border';

type WaitlistFormProps = {
  location: 'hero' | 'mid' | 'footer';
  title?: string;
  buttonLabel?: string;
};

export default function WaitlistForm({ location, title, buttonLabel }: WaitlistFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasTrackedStart = useRef(false);

  useEffect(() => { router.prefetch('/waitlist/thank-you'); }, [router]);
  const isHero = location === 'hero';

  const inputClassName = isHero
    ? 'h-11 w-full rounded-none border border-white/45 bg-white/8 px-3 text-neutral-50 caret-white outline-none transition placeholder:text-neutral-400 focus:border-white focus:bg-white/12'
    : 'h-11 w-full rounded-none border border-neutral-300 bg-white px-3 text-black outline-none transition focus:border-black';
  const errorClassName = isHero ? 'text-sm text-red-300' : 'text-sm text-red-700';
  const buttonEffectColor = isHero ? 'rgba(255, 255, 255, 0.95)' : 'rgba(17, 17, 17, 0.75)';
  const ctaLabel = buttonLabel ?? 'Get Early Access';

  const trackFormStart = () => {
    if (hasTrackedStart.current) return;
    hasTrackedStart.current = true;
    capturePosthogEvent('waitlist_signup_started', {
      form_location: location,
      ...getUtmFromWindow(),
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailError('');
    setGeneralError('');
    trackFormStart();

    if (!EMAIL_RGX.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      capturePosthogEvent('waitlist_signup_failed', {
        form_location: location,
        error_type: 'validation',
      });
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    const utmProperties = getUtmFromWindow();
    const signupTiming = getWaitlistSignupTiming();

    setIsSubmitting(true);

    const result = await submitWaitlistSignup({
      email: trimmedEmail,
      formLocation: location,
      utmProperties,
      ...signupTiming,
    });

    if (!result.ok) {
      capturePosthogEvent('waitlist_signup_failed', {
        form_location: location,
        error_type: 'server',
        error_message: result.error,
        time_to_signup_ms: signupTiming.timeToSignupMs,
        ...utmProperties,
      });
      setGeneralError(result.error);
      setIsSubmitting(false);
      return;
    }

    try { sessionStorage.setItem('waitlist_email', trimmedEmail); } catch {}
    identifyPosthogUser(trimmedEmail, {
      email: trimmedEmail,
      form_location: location,
      ...utmProperties,
    });
    capturePosthogEvent('waitlist_signup_succeeded', {
      form_location: location,
      time_to_signup_ms: signupTiming.timeToSignupMs,
      ...utmProperties,
    });

    startTransition(() => {
      router.push('/waitlist/thank-you');
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2" noValidate>
      {title ? (
        <h3 className={isHero ? 'text-xl font-semibold tracking-tight text-neutral-100' : 'text-xl font-semibold tracking-tight'}>
          {title}
        </h3>
      ) : null}

      <div>
        <input
          type="email"
          value={email}
          onFocus={trackFormStart}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="Your email"
          required
          className={inputClassName}
        />
        {emailError && <p className={`mt-1 ${errorClassName}`}>{emailError}</p>}
      </div>

      <StarBorder
        as="button"
        type="submit"
        disabled={isSubmitting}
        className="w-full"
        color={buttonEffectColor}
        speed="3.5s"
        thickness={1.5}
      >
        {isSubmitting ? 'Submitting...' : ctaLabel}
      </StarBorder>

      <p className={isHero ? 'text-xs text-neutral-400 text-center' : 'text-xs text-neutral-600 text-center'}>
        No spam. Unsubscribe anytime.
      </p>

      {generalError && <p className={errorClassName}>{generalError}</p>}
    </form>
  );
}
