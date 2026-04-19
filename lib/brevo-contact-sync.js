const BREVO_CONTACTS_API_URL = 'https://api.brevo.com/v3/contacts';
const EMAIL_RGX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeText(value, maxLength = 200) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
}

function sanitizeEmail(value) {
  const email = sanitizeText(value, 320)?.toLowerCase() ?? '';
  return EMAIL_RGX.test(email) ? email : null;
}

function sanitizeCategories(value) {
  const values = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(',')
      : [];

  const categories = Array.from(
    new Set(
      values
        .map((item) => sanitizeText(item, 64))
        .filter((item) => Boolean(item))
    )
  );

  return categories.length ? categories : null;
}

function splitName(value) {
  const normalizedName = sanitizeText(value);

  if (!normalizedName) {
    return { firstName: null, lastName: null };
  }

  const parts = normalizedName.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return {
      firstName: parts[0],
      lastName: null,
    };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
}

function normalizeWaitlistContact(contact) {
  if (!contact || typeof contact !== 'object' || Array.isArray(contact)) {
    return null;
  }

  const email = sanitizeEmail(contact.email);

  if (!email) {
    return null;
  }

  const { firstName, lastName } = splitName(contact.name);

  return {
    email,
    firstName,
    lastName,
    gender: sanitizeText(contact.gender, 64),
    categories: sanitizeCategories(contact.categories),
    favouriteDesigners: sanitizeText(contact.favouriteDesigners),
  };
}

function getBrevoConfig(env = process.env) {
  const apiKey = env.BREVO_API_KEY?.trim();

  if (!apiKey) {
    return { error: 'Brevo configuration is missing. Set BREVO_API_KEY.' };
  }

  const rawListId = env.BREVO_WAITLIST_LIST_ID?.trim();
  const listId = Number.parseInt(rawListId ?? '', 10);

  if (!Number.isInteger(listId) || listId <= 0) {
    return {
      error: 'Brevo configuration is missing. Set BREVO_WAITLIST_LIST_ID to a positive integer.',
    };
  }

  return { apiKey, listId };
}

function getBrevoConfigError(env = process.env) {
  const config = getBrevoConfig(env);
  return 'error' in config ? config.error : null;
}

function buildBrevoAttributes(contact) {
  const attributes = {};

  if (contact.firstName) {
    attributes.PRENOM = contact.firstName;
  }

  if (contact.lastName) {
    attributes.NOM = contact.lastName;
  }

  if (contact.gender) {
    attributes.GENDER_PIECES = contact.gender;
  }

  if (contact.categories?.length) {
    attributes.CATEGORIES = contact.categories;
  }

  if (contact.favouriteDesigners) {
    attributes.FAVOURITE_DESIGNERS = contact.favouriteDesigners;
  }

  return attributes;
}

function buildBrevoContactPayload(contact, env = process.env) {
  const normalizedContact = normalizeWaitlistContact(contact);

  if (!normalizedContact) {
    return null;
  }

  const config = getBrevoConfig(env);

  if ('error' in config) {
    return null;
  }

  const attributes = buildBrevoAttributes(normalizedContact);
  const payload = {
    email: normalizedContact.email,
    listIds: [config.listId],
    updateEnabled: true,
  };

  if (Object.keys(attributes).length > 0) {
    payload.attributes = attributes;
  }

  return payload;
}

async function readResponseBody(response) {
  try {
    const body = await response.text();
    return body ? body.slice(0, 1000) : undefined;
  } catch {
    return undefined;
  }
}

async function syncWaitlistContactToBrevo(contact, options = {}) {
  const env = options.env ?? process.env;
  const fetchImpl = options.fetchImpl ?? fetch;
  const normalizedContact = normalizeWaitlistContact(contact);

  if (!normalizedContact) {
    return {
      ok: false,
      kind: 'invalid_input',
      error: 'Waitlist contact is missing a valid email.',
    };
  }

  const config = getBrevoConfig(env);

  if ('error' in config) {
    return {
      ok: false,
      kind: 'config',
      error: config.error,
    };
  }

  const payload = buildBrevoContactPayload(normalizedContact, env);

  if (!payload) {
    return {
      ok: false,
      kind: 'invalid_input',
      error: 'Unable to build a valid Brevo payload for this contact.',
    };
  }

  try {
    const response = await fetchImpl(BREVO_CONTACTS_API_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'api-key': config.apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return { ok: true, status: response.status };
    }

    return {
      ok: false,
      kind: 'response',
      error: `Brevo contact sync failed with status ${response.status}.`,
      status: response.status,
      body: await readResponseBody(response),
    };
  } catch (error) {
    return {
      ok: false,
      kind: 'request',
      error: error instanceof Error ? error.message : 'Unknown Brevo request error.',
    };
  }
}

module.exports = {
  getBrevoConfigError,
  buildBrevoContactPayload,
  syncWaitlistContactToBrevo,
};
