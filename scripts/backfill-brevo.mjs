#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import brevoContactSync from '../lib/brevo-contact-sync.js';

const { getBrevoConfigError, syncWaitlistContactToBrevo } = brevoContactSync;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return;
  }

  const contents = readFileSync(filePath, 'utf8');

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) {
      continue;
    }

    const match = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);

    if (!match) {
      continue;
    }

    const [, key, rawValue] = match;

    if (process.env[key] !== undefined) {
      continue;
    }

    let value = rawValue.trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function getSupabaseServerKey() {
  return process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
}

function parseBatchSize() {
  const rawValue = process.env.BREVO_BACKFILL_BATCH_SIZE?.trim() ?? '200';
  const parsed = Number.parseInt(rawValue, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 200;
}

function logFatal(message) {
  console.error(`[backfill-brevo] ${message}`);
}

loadEnvFile(path.join(projectRoot, '.env.local'));
loadEnvFile(path.join(projectRoot, '.env'));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServerKey = getSupabaseServerKey();
const brevoConfigError = getBrevoConfigError(process.env);

if (!supabaseUrl) {
  logFatal('Missing NEXT_PUBLIC_SUPABASE_URL.');
  process.exit(1);
}

if (!supabaseServerKey) {
  logFatal('Missing SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

if (brevoConfigError) {
  logFatal(brevoConfigError);
  process.exit(1);
}

const batchSize = parseBatchSize();
const supabase = createClient(supabaseUrl, supabaseServerKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

let offset = 0;
let processed = 0;
let synced = 0;
let failed = 0;

console.log(`[backfill-brevo] Starting waitlist backfill with batch size ${batchSize}.`);

while (true) {
  const { data, error } = await supabase
    .from('waitlist')
    .select('email, name, gender, categories, favourite_designers, created_at')
    .order('created_at', { ascending: true, nullsFirst: false })
    .order('email', { ascending: true })
    .range(offset, offset + batchSize - 1);

  if (error) {
    logFatal(`Supabase query failed: ${error.message}`);
    process.exit(1);
  }

  if (!data?.length) {
    break;
  }

  for (const row of data) {
    processed += 1;

    const result = await syncWaitlistContactToBrevo({
      email: row.email,
      name: row.name,
      gender: row.gender,
      categories: row.categories,
      favouriteDesigners: row.favourite_designers,
    });

    if (result.ok) {
      synced += 1;
      continue;
    }

    failed += 1;

    console.error('[backfill-brevo] Brevo sync failed for contact.', {
      email: row.email,
      kind: result.kind,
      error: result.error,
      status: 'status' in result ? result.status : undefined,
      body: 'body' in result ? result.body : undefined,
    });
  }

  offset += data.length;

  console.log(
    `[backfill-brevo] Processed ${processed} contacts so far (${synced} synced, ${failed} failed).`
  );

  if (data.length < batchSize) {
    break;
  }
}

console.log(`[backfill-brevo] Finished. ${synced} synced, ${failed} failed, ${processed} total.`);

if (failed > 0) {
  process.exitCode = 1;
}
