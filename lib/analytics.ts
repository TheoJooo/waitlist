type SearchParamsLike = {
  get: (key: string) => string | null;
};

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;

export type UTMProperties = Partial<Record<(typeof UTM_KEYS)[number], string>>;

declare global {
  interface Window {
    posthog?: {
      capture: (eventName: string, properties?: Record<string, unknown>) => void;
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

export function capturePosthogEvent(
  eventName: string,
  properties: Record<string, unknown> = {}
) {
  if (typeof window === 'undefined') return;
  window.posthog?.capture(eventName, properties);
}
