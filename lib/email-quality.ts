export const EMAIL_RGX = /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9-]+(?:\.[A-Z0-9-]+)+$/i;

const MAX_EMAIL_LENGTH = 254;
const MAX_LOCAL_PART_LENGTH = 64;
const MAX_LABEL_LENGTH = 63;
const MAX_TLD_LENGTH = 24;

const COMMON_EMAIL_DOMAINS = [
  'gmail.com',
  'googlemail.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'msn.com',
  'yahoo.com',
  'ymail.com',
  'aol.com',
  'proton.me',
  'protonmail.com',
  'gmx.com',
  'mail.com',
  'wanadoo.fr',
  'orange.fr',
  'free.fr',
  'laposte.net',
  'sfr.fr',
  'bbox.fr',
  'gmx.fr',
  'gmx.de',
  'web.de',
  't-online.de',
  'freenet.de',
  'yahoo.de',
  'hotmail.de',
  'outlook.de',
  'yahoo.co.uk',
  'hotmail.co.uk',
  'outlook.co.uk',
  'btinternet.com',
  'sky.com',
  'virginmedia.com',
  'libero.it',
  'virgilio.it',
  'alice.it',
  'tin.it',
  'yahoo.it',
  'telefonica.net',
  'terra.es',
  'yahoo.es',
  'hotmail.es',
  'outlook.es',
  'ziggo.nl',
  'planet.nl',
  'kpnmail.nl',
  'yahoo.co.jp',
  'docomo.ne.jp',
  'ezweb.ne.jp',
  'softbank.ne.jp',
  'i.softbank.jp',
  'naver.com',
  'kakao.com',
  'daum.net',
  'hanmail.net',
  'yahoo.co.kr',
  'gmail.co.kr',
  'bigpond.com',
  'yahoo.com.au',
] as const;

const COMMON_TLDS = [
  'au',
  'at',
  'be',
  'ch',
  'com',
  'co',
  'cz',
  'de',
  'dk',
  'es',
  'eu',
  'fi',
  'fr',
  'gr',
  'io',
  'ie',
  'it',
  'jp',
  'kr',
  'me',
  'nl',
  'no',
  'net',
  'org',
  'pl',
  'pt',
  'se',
  'sg',
  'uk',
  'ca',
  'us',
] as const;

const EMAIL_TYPO_OVERRIDES: Record<string, string> = {
  'gnail.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.comm': 'gmail.com',
  'gmail.om': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotnail.com': 'hotmail.com',
  'hotmail.co': 'hotmail.com',
  'hotmail.con': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outlook.co': 'outlook.com',
  'outlook.con': 'outlook.com',
  'yaho.com': 'yahoo.com',
  'yahoo.co': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  'icloud.co': 'icloud.com',
  'icloud.con': 'icloud.com',
  'protonmail.co': 'protonmail.com',
  'proton.me.com': 'proton.me',
  'gmx.d': 'gmx.de',
  'gmz.de': 'gmx.de',
  'web.d': 'web.de',
  'we.de': 'web.de',
  't-online.d': 't-online.de',
  'orange.f': 'orange.fr',
  'free.f': 'free.fr',
  'sfr.f': 'sfr.fr',
  'libero.i': 'libero.it',
  'virgilio.i': 'virgilio.it',
  'yaho.co.jp': 'yahoo.co.jp',
  'yahoo.co.j': 'yahoo.co.jp',
  'docomo.ne.j': 'docomo.ne.jp',
  'naver.con': 'naver.com',
  'kakao.con': 'kakao.com',
  'daum.ne': 'daum.net',
  'hanmail.ne': 'hanmail.net',
};

function splitEmail(email: string) {
  const trimmed = email.trim().toLowerCase();
  const atIndex = trimmed.lastIndexOf('@');

  if (atIndex <= 0 || atIndex !== trimmed.indexOf('@')) {
    return null;
  }

  return {
    localPart: trimmed.slice(0, atIndex),
    domain: trimmed.slice(atIndex + 1),
  };
}

function hasValidDomainLabels(domain: string) {
  const labels = domain.split('.');
  const tld = labels.at(-1);

  if (labels.length < 2 || !tld || tld.length < 2 || tld.length > MAX_TLD_LENGTH || !/^[a-z]+$/i.test(tld)) {
    return false;
  }

  return labels.every((label) => (
    label.length > 0 &&
    label.length <= MAX_LABEL_LENGTH &&
    /^[a-z0-9-]+$/i.test(label) &&
    !label.startsWith('-') &&
    !label.endsWith('-')
  ));
}

export function normalizeEmail(value: unknown) {
  if (typeof value !== 'string') {
    return null;
  }

  const email = value.trim().toLowerCase();
  const parts = splitEmail(email);

  if (
    !parts ||
    email.length > MAX_EMAIL_LENGTH ||
    parts.localPart.length > MAX_LOCAL_PART_LENGTH ||
    parts.localPart.includes('..') ||
    parts.domain.includes('..') ||
    !EMAIL_RGX.test(email) ||
    !hasValidDomainLabels(parts.domain)
  ) {
    return null;
  }

  return email;
}

export function isValidEmail(value: string) {
  return normalizeEmail(value) !== null;
}

function levenshteinDistance(a: string, b: string) {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  const current = new Array<number>(b.length + 1);

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;

    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + cost
      );
    }

    previous.splice(0, previous.length, ...current);
  }

  return previous[b.length];
}

function getClosestDomain(domain: string) {
  const override = EMAIL_TYPO_OVERRIDES[domain];

  if (override) {
    return override;
  }

  let closestDomain: string | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const commonDomain of COMMON_EMAIL_DOMAINS) {
    const distance = levenshteinDistance(domain, commonDomain);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestDomain = commonDomain;
    }
  }

  return closestDistance <= 2 ? closestDomain : null;
}

export function getEmailSuggestion(value: string) {
  const parts = splitEmail(value);

  if (!parts || !parts.localPart || !parts.domain || parts.domain.includes('..')) {
    return null;
  }

  const closestDomain = getClosestDomain(parts.domain);

  if (!closestDomain || closestDomain === parts.domain) {
    return null;
  }

  return `${parts.localPart}@${closestDomain}`;
}

export function getEmailDomain(value: string) {
  return splitEmail(value)?.domain ?? null;
}

export function isCommonEmailDomain(domain: string) {
  return COMMON_EMAIL_DOMAINS.includes(domain as (typeof COMMON_EMAIL_DOMAINS)[number]);
}

export function isSuspiciousEmailDomain(domain: string) {
  if (isCommonEmailDomain(domain)) {
    return false;
  }

  const tld = domain.split('.').at(-1);

  return Boolean(
    EMAIL_TYPO_OVERRIDES[domain] ||
    getClosestDomain(domain) ||
    (tld && !COMMON_TLDS.includes(tld as (typeof COMMON_TLDS)[number]))
  );
}
