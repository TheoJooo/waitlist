'use client';

import { createClient } from '@supabase/supabase-js';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { capturePosthogEvent, getUtmFromWindow } from '@/lib/analytics';
import StarBorder from '@/components/ui/star-border';

const EMAIL_RGX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

type StepperFormProps = {
  location: string;
};

export default function StepperForm({ location }: StepperFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const hasTrackedStart = useRef(false);

  useEffect(() => { router.prefetch('/thank-you'); }, [router]);

  const trackStart = () => {
    if (hasTrackedStart.current) return;
    hasTrackedStart.current = true;
    capturePosthogEvent('waitlist_form_started', { form_location: location, ...getUtmFromWindow() });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    trackStart();

    if (!EMAIL_RGX.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    const utmProperties = getUtmFromWindow();

    try { sessionStorage.setItem('waitlist_email', trimmedEmail); } catch {}
    capturePosthogEvent('waitlist_signup_submitted', { form_location: location, ...utmProperties });
    router.push('/thank-you');

    if (supabase) {
      supabase.from('waitlist').insert({ email: trimmedEmail, form_location: location, ...utmProperties });
    }
  };

  const inputClass = 'h-11 w-full border border-white/35 bg-white/12 px-3 text-white caret-white outline-none transition placeholder:text-neutral-400 focus:border-white/60 focus:bg-white/18 text-sm';
  const errorClass = 'mt-1 text-xs text-red-400';

  return (
    <div className="w-full max-w-sm">
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            color="rgba(255,255,255,0.85)"
            speed="3.5s"
            thickness={1.5}
          >
            Secure My Spot
          </StarBorder>
        </div>
        {emailError && <p className={errorClass}>{emailError}</p>}
        <p className="mt-2 text-[11px] text-neutral-600">No spam. Unsubscribe anytime.</p>
      </form>
    </div>
  );
}
