import type { UTMProperties } from '@/lib/analytics';

export const EMAIL_RGX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;
const ALLOWED_GENDERS = ["Women's", "Men's", 'Both'] as const;
const MAX_TEXT_LENGTH = 200;

type AllowedGender = (typeof ALLOWED_GENDERS)[number];

type PlainObject = Record<string, unknown>;

export type WaitlistSignupInput = {
  email: string;
  formLocation: string;
  utmProperties: UTMProperties;
  landingArrivedAt: string | null;
  timeToSignupMs: number | null;
};

export type WaitlistPreferencesInput = {
  email: string;
  gender: AllowedGender | null;
  categories: string | null;
  favouriteDesigners: string | null;
  name: string | null;
};

function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sanitizeText(value: unknown, maxLength = MAX_TEXT_LENGTH) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
}

function sanitizeEmail(value: unknown) {
  const email = sanitizeText(value)?.toLowerCase() ?? '';
  return EMAIL_RGX.test(email) ? email : null;
}

function sanitizeFormLocation(value: unknown) {
  return sanitizeText(value, 64) ?? 'unknown';
}

function sanitizeUtmProperties(value: unknown): UTMProperties {
  if (!isPlainObject(value)) {
    return {};
  }

  const result: UTMProperties = {};

  for (const key of UTM_KEYS) {
    const sanitizedValue = sanitizeText(value[key], MAX_TEXT_LENGTH);

    if (sanitizedValue) {
      result[key] = sanitizedValue;
    }
  }

  return result;
}

function sanitizeLandingArrivedAt(value: unknown) {
  if (typeof value !== 'string') {
    return null;
  }

  const timestamp = Date.parse(value);

  if (!Number.isFinite(timestamp)) {
    return null;
  }

  return new Date(timestamp).toISOString();
}

function sanitizeTimeToSignupMs(value: unknown) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }

  const rounded = Math.round(value);

  if (rounded < 0 || rounded > 86_400_000) {
    return null;
  }

  return rounded;
}

function sanitizeGender(value: unknown): AllowedGender | null {
  if (typeof value !== 'string') {
    return null;
  }

  return ALLOWED_GENDERS.includes(value as AllowedGender) ? (value as AllowedGender) : null;
}

function sanitizeCategories(value: unknown) {
  const values = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(',')
      : [];

  const categories = Array.from(
    new Set(
      values
        .map((item) => sanitizeText(item, 64))
        .filter((item): item is string => Boolean(item))
    )
  );

  return categories.length ? categories.join(', ') : null;
}

export function parseWaitlistSignupPayload(payload: unknown) {
  if (!isPlainObject(payload)) {
    return { error: 'Invalid request body.' };
  }

  const email = sanitizeEmail(payload.email);

  if (!email) {
    return { error: 'Please enter a valid email address.' };
  }

  return {
    data: {
      email,
      formLocation: sanitizeFormLocation(payload.formLocation),
      utmProperties: sanitizeUtmProperties(payload.utmProperties),
      landingArrivedAt: sanitizeLandingArrivedAt(payload.landingArrivedAt),
      timeToSignupMs: sanitizeTimeToSignupMs(payload.timeToSignupMs),
    } satisfies WaitlistSignupInput,
  };
}

export function parseWaitlistPreferencesPayload(payload: unknown) {
  if (!isPlainObject(payload)) {
    return { error: 'Invalid request body.' };
  }

  const email = sanitizeEmail(payload.email);

  if (!email) {
    return { error: 'Missing waitlist email.' };
  }

  return {
    data: {
      email,
      gender: sanitizeGender(payload.gender),
      categories: sanitizeCategories(payload.categories),
      favouriteDesigners: sanitizeText(payload.favouriteDesigners),
      name: sanitizeText(payload.name ?? payload.firstName),
    } satisfies WaitlistPreferencesInput,
  };
}

export function buildWaitlistSignupRow(input: WaitlistSignupInput) {
  return {
    email: input.email,
    form_location: input.formLocation,
    landing_arrived_at: input.landingArrivedAt,
    time_to_signup_ms: input.timeToSignupMs,
    ...input.utmProperties,
  };
}

export function buildWaitlistPreferencesRow(input: WaitlistPreferencesInput) {
  return {
    email: input.email,
    gender: input.gender,
    categories: input.categories,
    favourite_designers: input.favouriteDesigners,
    name: input.name,
  };
}
