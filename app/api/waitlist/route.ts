import type { PostgrestError } from '@supabase/supabase-js';
import brevoContactSync, { type BrevoSyncResult } from '@/lib/brevo-contact-sync.js';
import { buildWaitlistSignupRow, parseWaitlistSignupPayload } from '@/lib/waitlist';
import { getSupabaseServerClient } from '@/lib/supabase-server';

const { syncWaitlistContactToBrevo } = brevoContactSync;

function isUniqueViolation(error: PostgrestError) {
  return error.code === '23505' || /duplicate key/i.test(error.message);
}

function isMissingOnConflictConstraint(error: PostgrestError) {
  return error.code === '42P10' || /on conflict/i.test(error.message);
}

async function persistWaitlistRow(
  row: Record<string, string | number | null | undefined>
) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return 'Supabase server configuration is missing. Set SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY.';
  }

  const payload = Object.fromEntries(
    Object.entries(row).filter(([, value]) => value !== undefined)
  );

  const upsertResult = await supabase
    .from('waitlist')
    .upsert(payload, { onConflict: 'email', ignoreDuplicates: false });

  if (!upsertResult.error || isUniqueViolation(upsertResult.error)) {
    return null;
  }

  if (!isMissingOnConflictConstraint(upsertResult.error)) {
    return upsertResult.error.message;
  }

  const updatePayload = Object.fromEntries(
    Object.entries(payload).filter(([key]) => key !== 'email')
  );

  if (Object.keys(updatePayload).length > 0) {
    const updateResult = await supabase
      .from('waitlist')
      .update(updatePayload)
      .eq('email', payload.email);

    if (!updateResult.error) {
      return null;
    }
  }

  const insertResult = await supabase.from('waitlist').insert(payload);

  if (!insertResult.error || isUniqueViolation(insertResult.error)) {
    return null;
  }

  return insertResult.error.message;
}

function logBrevoSyncFailure(email: string, result: Exclude<BrevoSyncResult, { ok: true }>) {
  console.error('Brevo waitlist signup sync failed.', {
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

  const parsed = parseWaitlistSignupPayload(body);

  if ('error' in parsed) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  const error = await persistWaitlistRow(buildWaitlistSignupRow(parsed.data));

  if (error) {
    return Response.json({ error }, { status: 500 });
  }

  const brevoResult = await syncWaitlistContactToBrevo({
    email: parsed.data.email,
  });

  if (!brevoResult.ok) {
    logBrevoSyncFailure(parsed.data.email, brevoResult);
  }

  return Response.json({ ok: true });
}
