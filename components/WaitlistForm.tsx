'use client';

import { createClient, type PostgrestError } from '@supabase/supabase-js';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { capturePosthogEvent, getUtmFromWindow } from '@/lib/analytics';
import StarBorder from '@/components/ui/star-border';

const EMAIL_RGX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

type WaitlistFormProps = {
  location: 'hero' | 'mid' | 'footer';
  title?: string;
  buttonLabel?: string;
};

async function insertInWaitlist(payload: Record<string, string>) {
  if (!supabase) {
    return {
      error: null as PostgrestError | null,
      fallbackMessage:
        'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    };
  }

  const primaryInsert = await supabase.from('waitlist').insert(payload);

  if (!primaryInsert.error) {
    return { error: null as PostgrestError | null, fallbackMessage: '' };
  }

  const unknownColumns =
    primaryInsert.error.code === 'PGRST204' ||
    /column/i.test(primaryInsert.error.message) ||
    /schema cache/i.test(primaryInsert.error.message);

  if (!unknownColumns) {
    return { error: primaryInsert.error, fallbackMessage: '' };
  }

  const fallbackInsert = await supabase.from('waitlist').insert({ email: payload.email });
  return { error: fallbackInsert.error, fallbackMessage: '' };
}

export default function WaitlistForm({ location, title, buttonLabel }: WaitlistFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const hasTrackedStart = useRef(false);

  useEffect(() => { router.prefetch('/thank-you'); }, [router]);
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
    capturePosthogEvent('waitlist_form_started', { form_location: location, ...getUtmFromWindow() });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailError('');
    setGeneralError('');
    trackFormStart();

    if (!EMAIL_RGX.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    const utmProperties = getUtmFromWindow();

    try { sessionStorage.setItem('waitlist_email', trimmedEmail); } catch {}
    capturePosthogEvent('waitlist_signup_submitted', { form_location: location, ...utmProperties });
    router.push('/thank-you');

    insertInWaitlist({ email: trimmedEmail, form_location: location, ...utmProperties });
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
        className="w-full"
        color={buttonEffectColor}
        speed="3.5s"
        thickness={1.5}
      >
        {ctaLabel}
      </StarBorder>

      <p className={isHero ? 'text-xs text-neutral-400 text-center' : 'text-xs text-neutral-600 text-center'}>
        No spam. Unsubscribe anytime.
      </p>

      {generalError && <p className={errorClassName}>{generalError}</p>}
    </form>
  );
}
