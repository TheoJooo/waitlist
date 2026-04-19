import brevoContactSync, { type BrevoSyncResult } from '@/lib/brevo-contact-sync.js';
import { buildWaitlistPreferencesRow, parseWaitlistPreferencesPayload } from '@/lib/waitlist';
import { getSupabaseServerClient } from '@/lib/supabase-server';

const { syncWaitlistContactToBrevo } = brevoContactSync;

async function persistWaitlistPreferences(row: Record<string, string | null>) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return 'Supabase server configuration is missing. Set SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY.';
  }

  const result = await supabase
    .from('waitlist')
    .upsert(row, { onConflict: 'email', ignoreDuplicates: false });

  return result.error ? result.error.message : null;
}

function logBrevoSyncFailure(email: string, result: Exclude<BrevoSyncResult, { ok: true }>) {
  console.error('Brevo waitlist preference sync failed.', {
    email,
    kind: result.kind,
    error: result.error,
    status: 'status' in result ? result.status : undefined,
    body: 'body' in result ? result.body : undefined,
  });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = parseWaitlistPreferencesPayload(body);

  if ('error' in parsed) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  const error = await persistWaitlistPreferences(buildWaitlistPreferencesRow(parsed.data));

  if (error) {
    return Response.json({ error }, { status: 500 });
  }

  const brevoResult = await syncWaitlistContactToBrevo({
    email: parsed.data.email,
    name: parsed.data.name,
    gender: parsed.data.gender,
    categories: parsed.data.categories,
    favouriteDesigners: parsed.data.favouriteDesigners,
  });

  if (!brevoResult.ok) {
    logBrevoSyncFailure(parsed.data.email, brevoResult);
  }

  return Response.json({ ok: true });
}
