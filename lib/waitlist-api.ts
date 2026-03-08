import type { UTMProperties } from '@/lib/analytics';

type ApiResult = { ok: true } | { ok: false; error: string };

type WaitlistSignupRequest = {
  email: string;
  formLocation: string;
  utmProperties: UTMProperties;
  landingArrivedAt: string | null;
  timeToSignupMs: number | null;
};

type WaitlistPreferencesRequest = {
  email: string;
  gender: "Women's" | "Men's" | 'Both' | null;
  categories: string[];
  favouriteDesigners: string;
  name: string;
};

async function postJson(path: string, payload: unknown): Promise<ApiResult> {
  try {
    const response = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return { ok: true };
    }

    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    return {
      ok: false,
      error: body?.error ?? 'Something went wrong. Please try again.',
    };
  } catch {
    return {
      ok: false,
      error: 'Unable to reach the server. Please try again.',
    };
  }
}

export function submitWaitlistSignup(payload: WaitlistSignupRequest) {
  return postJson('/api/waitlist', payload);
}

export function saveWaitlistPreferences(payload: WaitlistPreferencesRequest) {
  return postJson('/api/waitlist/preferences', payload);
}
