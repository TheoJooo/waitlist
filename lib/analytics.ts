type SearchParamsLike = {
  get: (key: string) => string | null;
};

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
const TRACKING_CONSENT_STORAGE_KEY = 'va_tracking_consent';

export type UTMProperties = Partial<Record<(typeof UTM_KEYS)[number], string>>;
export type TrackingConsent = 'granted' | 'denied' | 'pending';

declare global {
  interface Window {
    posthog?: {
      capture: (eventName: string, properties?: Record<string, unknown>) => void;
      identify: (distinctId: string, properties?: Record<string, unknown>) => void;
      reset: () => void;
      opt_in_capturing: () => void;
      opt_out_capturing: () => void;
    };
  }
}

export function extractUtmProperties(searchParams: SearchParamsLike | null): UTMProperties {
  if (!searchParams) return {};

  return UTM_KEYS.reduce<UTMProperties>((acc, key) => {
    const value = searchParams.get(key);
    if (value) acc[key] = value;
    return acc;
  }, {});
}

export function getUtmFromWindow(): UTMProperties {
  if (typeof window === 'undefined') return {};
  return extractUtmProperties(new URLSearchParams(window.location.search));
}

export function getTrackingConsent(): TrackingConsent {
  if (typeof window === 'undefined') {
    return 'pending';
  }

  const storedValue = window.localStorage.getItem(TRACKING_CONSENT_STORAGE_KEY);

  if (storedValue === 'granted' || storedValue === 'denied') {
    return storedValue;
  }

  return 'pending';
}

export function setTrackingConsent(consent: Exclude<TrackingConsent, 'pending'>) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(TRACKING_CONSENT_STORAGE_KEY, consent);

  if (consent === 'granted') {
    window.posthog?.opt_in_capturing();
  } else {
    window.posthog?.opt_out_capturing();
    window.posthog?.reset();
  }
}

function hasTrackingConsent() {
  return getTrackingConsent() === 'granted';
}

export function capturePosthogEvent(
  eventName: string,
  properties: Record<string, unknown> = {}
) {
  if (typeof window === 'undefined' || !hasTrackingConsent()) return;
  window.posthog?.capture(eventName, properties);
}

export function identifyPosthogUser(
  distinctId: string,
  properties: Record<string, unknown> = {}
) {
  if (typeof window === 'undefined' || !hasTrackingConsent()) return;
  window.posthog?.identify(distinctId, properties);
}
