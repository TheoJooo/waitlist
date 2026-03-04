'use client';

import { createClient, type PostgrestError } from '@supabase/supabase-js';
import { useRef, useState } from 'react';
import { capturePosthogEvent, getUtmFromWindow } from '@/lib/analytics';

const EMAIL_RGX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RGX = /^[\d+\-().\s]{7,20}$/;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

type WaitlistFormProps = {
  location: 'hero' | 'footer';
  title?: string;
};

type FormValues = {
  fullName: string;
  email: string;
  phone: string;
};

const INITIAL_VALUES: FormValues = {
  fullName: '',
  email: '',
  phone: '',
};

function buildErrorMessage(error: PostgrestError | null, fallbackMessage?: string) {
  if (fallbackMessage) return fallbackMessage;
  if (!error) return 'An error occurred. Please try again later.';
  if (error.code === '23505') return 'This email is already registered.';
  return 'An error occurred. Please try again later.';
}

function validate(values: FormValues) {
  if (!values.fullName.trim()) return 'Name is required.';
  if (!EMAIL_RGX.test(values.email.trim())) return 'Please enter a valid email address.';
  if (!PHONE_RGX.test(values.phone.trim())) return 'Please enter a valid phone number.';
  return '';
}

function splitFullName(fullName: string) {
  const clean = fullName.trim().replace(/\s+/g, ' ');
  if (!clean) return { firstName: '', lastName: '' };
  const [firstName, ...rest] = clean.split(' ');
  return {
    firstName,
    lastName: rest.join(' '),
  };
}

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

  const fallbackInsert = await supabase
    .from('waitlist')
    .insert({ email: payload.email });

  return { error: fallbackInsert.error, fallbackMessage: '' };
}

export default function WaitlistForm({ location, title }: WaitlistFormProps) {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasTrackedStart = useRef(false);

  const trackFormStart = () => {
    if (hasTrackedStart.current) return;
    hasTrackedStart.current = true;
    capturePosthogEvent('waitlist_form_started', {
      form_location: location,
      ...getUtmFromWindow(),
    });
  };

  const updateField = (field: keyof FormValues, value: string) => {
    trackFormStart();
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg('');
    trackFormStart();

    const validationError = validate(values);
    const utmProperties = getUtmFromWindow();

    if (validationError) {
      setErrorMsg(validationError);
      capturePosthogEvent('waitlist_signup_failed', {
        form_location: location,
        error_code: 'validation_error',
        error_message: validationError,
        ...utmProperties,
      });
      return;
    }

    setIsSubmitting(true);

    const nameParts = splitFullName(values.fullName);

    const payload = {
      first_name: nameParts.firstName,
      last_name: nameParts.lastName,
      full_name: values.fullName.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone.trim(),
      form_location: location,
      ...utmProperties,
    };

    const { error, fallbackMessage } = await insertInWaitlist(payload);

    if (error || fallbackMessage) {
      const message = buildErrorMessage(error, fallbackMessage);
      setErrorMsg(message);
      capturePosthogEvent('waitlist_signup_failed', {
        form_location: location,
        error_code: error?.code ?? (fallbackMessage ? 'missing_env' : 'unknown'),
        error_message: message,
        ...utmProperties,
      });
      setIsSubmitting(false);
      return;
    }

    setSuccess(true);
    setValues(INITIAL_VALUES);
    setIsSubmitting(false);

    capturePosthogEvent('waitlist_signup_submitted', {
      form_location: location,
      ...utmProperties,
    });
  };

  if (success) {
    return (
      <div className="border border-neutral-300 p-5">
        <h3 className="text-2xl font-semibold">You&apos;re on the list.</h3>
        <p className="mt-2 text-sm text-neutral-700">
          Thanks for joining. Early access invitations are sent in waves before public launch.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {title ? (
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      ) : null}

      <div className="space-y-3">
        <label className="block space-y-1 text-sm text-neutral-700">
          <span>Name</span>
          <div className="transition-transform duration-200 ease-out hover:scale-[1.01] focus-within:scale-[1.01]">
            <input
              value={values.fullName}
              onFocus={trackFormStart}
              onChange={(event) => updateField('fullName', event.target.value)}
              autoComplete="name"
              required
              className="h-11 w-full rounded-none border border-neutral-300 bg-white px-3 text-black outline-none transition focus:border-black"
            />
          </div>
        </label>
        <label className="block space-y-1 text-sm text-neutral-700">
          <span>Email</span>
          <div className="transition-transform duration-200 ease-out hover:scale-[1.01] focus-within:scale-[1.01]">
            <input
              type="email"
              value={values.email}
              onFocus={trackFormStart}
              onChange={(event) => updateField('email', event.target.value)}
              autoComplete="email"
              required
              className="h-11 w-full rounded-none border border-neutral-300 bg-white px-3 text-black outline-none transition focus:border-black"
            />
          </div>
        </label>
        <label className="block space-y-1 text-sm text-neutral-700">
          <span>Phone number</span>
          <div className="transition-transform duration-200 ease-out hover:scale-[1.01] focus-within:scale-[1.01]">
            <input
              type="tel"
              value={values.phone}
              onFocus={trackFormStart}
              onChange={(event) => updateField('phone', event.target.value)}
              autoComplete="tel"
              required
              className="h-11 w-full rounded-none border border-neutral-300 bg-white px-3 text-black outline-none transition focus:border-black"
            />
          </div>
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-11 w-full items-center justify-center rounded-none border border-black bg-black px-4 text-sm font-semibold uppercase tracking-[0.06em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? 'Submitting...' : 'Get Early Access'}
      </button>

      <p className="text-xs text-neutral-600">No spam, ever. Unsubscribe anytime.</p>

      {errorMsg ? <p className="text-sm text-red-700">{errorMsg}</p> : null}
    </form>
  );
}
