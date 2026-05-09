'use client';

import { startTransition, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { capturePosthogEvent, getUtmFromWindow, identifyPosthogUser } from '@/lib/analytics';
import { getEmailSuggestion, isValidEmail } from '@/lib/email-quality';
import { submitWaitlistSignup } from '@/lib/waitlist-api';
import { getWaitlistSignupTiming } from '@/lib/waitlist-timing';
import StarBorder from '@/components/ui/star-border';

type StepperFormProps = {
  location: string;
};

export default function StepperForm({ location }: StepperFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forceSubmitEmail, setForceSubmitEmail] = useState('');
  const hasTrackedStart = useRef(false);

  useEffect(() => { router.prefetch('/waitlist/thank-you'); }, [router]);
  const emailSuggestion = getEmailSuggestion(email);
  const normalizedEmail = email.trim().toLowerCase();

  const trackStart = () => {
    if (hasTrackedStart.current) return;
    hasTrackedStart.current = true;
    capturePosthogEvent('waitlist_signup_started', {
      form_location: location,
      ...getUtmFromWindow(),
    });
  };

  const submitEmail = async (allowSuggestionOverride = false) => {
    if (isSubmitting) return;

    setEmailError('');
    setGeneralError('');
    trackStart();

    if (!email.trim()) {
      setEmailError('Please enter your email address.');
      capturePosthogEvent('waitlist_signup_failed', {
        form_location: location,
        error_type: 'validation',
      });
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address.');
      capturePosthogEvent('waitlist_signup_failed', {
        form_location: location,
        error_type: 'validation',
      });
      return;
    }

    if (emailSuggestion && !allowSuggestionOverride && forceSubmitEmail !== normalizedEmail) {
      setEmailError('Please choose an option before continuing.');
      capturePosthogEvent('waitlist_signup_failed', {
        form_location: location,
        error_type: 'suggestion_confirmation',
      });
      return;
    }

    const trimmedEmail = normalizedEmail;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submitEmail();
  };

  const inputClass = 'h-11 w-full border border-white/35 bg-white/12 px-3 text-white caret-white outline-none transition placeholder:text-neutral-400 focus:border-white/60 focus:bg-white/18 text-sm';
  const alertClass = 'mt-2 border border-white/20 bg-black/45 px-3 py-2 text-xs text-neutral-300 shadow-[0_16px_40px_rgba(0,0,0,0.25)] backdrop-blur-md';
  const alertActionClass = 'inline-flex min-h-9 cursor-pointer items-center justify-center border border-white/15 px-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:border-white/45 hover:bg-white/10';

  return (
    <div className="w-full max-w-sm">
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setForceSubmitEmail('');
              }}
              onFocus={trackStart}
              placeholder="Your email"
              autoComplete="email"
              required
              className={inputClass}
            />
          </div>
          <StarBorder
            as="button"
            type="submit"
            disabled={isSubmitting}
            color="rgba(255,255,255,0.85)"
            speed="3.5s"
            thickness={1.5}
          >
            {isSubmitting ? 'Submitting...' : 'Secure My Spot'}
          </StarBorder>
        </div>
        {emailSuggestion && (
          <div className={alertClass}>
            <p>Did you mean {emailSuggestion}?</p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                className={alertActionClass}
                onClick={() => {
                  setEmail(emailSuggestion);
                  setEmailError('');
                  setForceSubmitEmail('');
                }}
              >
                Use suggestion
              </button>
              <button
                type="button"
                className={alertActionClass}
                onClick={() => {
                  setForceSubmitEmail(normalizedEmail);
                  setEmailError('');
                  void submitEmail(true);
                }}
              >
                Submit anyway
              </button>
            </div>
          </div>
        )}
        {emailError && <p className={alertClass}>{emailError}</p>}
        {generalError && <p className={alertClass}>{generalError}</p>}
        <p className="mt-2 text-[11px] text-neutral-600">No spam. Unsubscribe anytime.</p>
      </form>
    </div>
  );
}
