import { buildWaitlistPreferencesRow, parseWaitlistPreferencesPayload } from '@/lib/waitlist';
import { getSupabaseServerClient } from '@/lib/supabase-server';

async function persistWaitlistPreferences(row: Record<string, string | null>) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return 'Supabase server configuration is missing. Set SUPABASE_SECRET_KEY.';
  }

  const result = await supabase
    .from('waitlist')
    .upsert(row, { onConflict: 'email', ignoreDuplicates: false });

  return result.error ? result.error.message : null;
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

  return Response.json({ ok: true });
}
