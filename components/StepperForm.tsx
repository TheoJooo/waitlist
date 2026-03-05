'use client';

import { createClient, type PostgrestError } from '@supabase/supabase-js';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { capturePosthogEvent, getUtmFromWindow } from '@/lib/analytics';
import StarBorder from '@/components/ui/star-border';

const EMAIL_RGX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RGX = /^[\d+\-().\s]{7,20}$/;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

function splitFullName(fullName: string) {
  const clean = fullName.trim().replace(/\s+/g, ' ');
  if (!clean) return { firstName: '', lastName: '' };
  const [firstName, ...rest] = clean.split(' ');
  return { firstName, lastName: rest.join(' ') };
}

type StepperFormProps = {
  location: string;
};

export default function StepperForm({ location }: StepperFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const hasTrackedStart = useRef(false);

  const trackStart = () => {
    if (hasTrackedStart.current) return;
    hasTrackedStart.current = true;
    capturePosthogEvent('waitlist_form_started', {
      form_location: location,
      ...getUtmFromWindow(),
    });
  };

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setGeneralError('');
    trackStart();

    if (!EMAIL_RGX.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    const utmProperties = getUtmFromWindow();

    if (supabase) {
      // Insert email immediately — even if user abandons step 2
      const { error } = await supabase.from('waitlist').insert({
        email: email.trim().toLowerCase(),
        form_location: location,
        ...utmProperties,
      });

      // 23505 = duplicate, that's fine — email already captured
      if (error && error.code !== '23505') {
        // Try minimal fallback
        const fallback = await supabase.from('waitlist').insert({ email: email.trim().toLowerCase() });
        if (fallback.error && fallback.error.code !== '23505') {
          setGeneralError('Something went wrong. Please try again.');
          setIsLoading(false);
          return;
        }
      }
    }

    capturePosthogEvent('waitlist_email_captured', { form_location: location, ...utmProperties });

    try { sessionStorage.setItem('waitlist_email', email.trim().toLowerCase()); } catch {}

    setIsLoading(false);
    setStep(2);
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError('');
    setPhoneError('');
    setGeneralError('');

    let hasError = false;
    if (!fullName.trim()) { setNameError('Name is required.'); hasError = true; }
    if (!PHONE_RGX.test(phone.trim())) { setPhoneError('Please enter a valid phone number.'); hasError = true; }
    if (hasError) return;

    setIsLoading(true);
    const utmProperties = getUtmFromWindow();
    const { firstName, lastName } = splitFullName(fullName);

    if (supabase) {
      // Update the row we just inserted with name + phone
      await supabase.from('waitlist')
        .update({
          full_name: fullName.trim(),
          first_name: firstName,
          last_name: lastName,
          phone: phone.trim(),
        })
        .eq('email', email.trim().toLowerCase());
    }

    capturePosthogEvent('waitlist_signup_submitted', { form_location: location, ...utmProperties });

    setIsLoading(false);
    router.push('/thank-you');
  };

  const inputClass = 'h-9 w-full border border-white/35 bg-white/12 px-3 text-white caret-white outline-none transition placeholder:text-neutral-400 focus:border-white/60 focus:bg-white/18 text-sm';
  const errorClass = 'mt-1 text-xs text-red-400';

  return (
    <div className="w-full max-w-sm">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`h-px flex-1 transition-colors ${step >= 1 ? 'bg-white/25' : 'bg-white/10'}`} />
        <span className="text-[11px] text-neutral-600 tabular-nums">{step} / 2</span>
        <div className={`h-px flex-1 transition-colors ${step >= 2 ? 'bg-white/25' : 'bg-white/10'}`} />
      </div>

      {step === 1 && (
        <form onSubmit={handleStep1} noValidate>
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
            <button
              type="submit"
              disabled={isLoading}
              className="shrink-0 h-9 px-4 border border-white/40 bg-white/15 text-white text-xs font-semibold uppercase tracking-widest whitespace-nowrap transition hover:bg-white/25 disabled:opacity-50"
            >
              {isLoading ? '...' : 'Continue →'}
            </button>
          </div>
          {emailError && <p className={errorClass}>{emailError}</p>}
          {generalError && <p className={`${errorClass} mt-1`}>{generalError}</p>}
          <p className="mt-2 text-[11px] text-neutral-600">No spam. Unsubscribe anytime.</p>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleStep2} noValidate>
          <p className="text-xs text-neutral-500 mb-3">
            One last step — we&apos;ll personalise your experience.
          </p>
          <div className="space-y-2">
            <div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full name"
                autoComplete="name"
                required
                className={inputClass}
              />
              {nameError && <p className={errorClass}>{nameError}</p>}
            </div>
            <div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                autoComplete="tel"
                required
                className={inputClass}
              />
              {phoneError && <p className={errorClass}>{phoneError}</p>}
            </div>
          </div>
          {generalError && <p className={`${errorClass} mt-1`}>{generalError}</p>}
          <div className="mt-3 flex items-center gap-4">
            <StarBorder
              as="button"
              type="submit"
              disabled={isLoading}
              color="rgba(255,255,255,0.95)"
              speed="3.5s"
              thickness={1.5}
              className="!text-xs !px-4"
            >
              {isLoading ? 'Saving...' : 'Secure My Spot'}
            </StarBorder>
            <button
              type="button"
              onClick={() => router.push('/thank-you')}
              className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors"
            >
              Skip for now
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
