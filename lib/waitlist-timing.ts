'use client';

let waitlistArrivedAt: string | null = null;

export function markWaitlistArrival() {
  waitlistArrivedAt = new Date().toISOString();
}

export function getWaitlistSignupTiming() {
  if (!waitlistArrivedAt) {
    return {
      landingArrivedAt: null,
      timeToSignupMs: null,
    };
  }

  const parsedArrivalTimestamp = Date.parse(waitlistArrivedAt);

  if (!Number.isFinite(parsedArrivalTimestamp)) {
    return {
      landingArrivedAt: null,
      timeToSignupMs: null,
    };
  }

  const timeToSignupMs = Math.max(Date.now() - parsedArrivalTimestamp, 0);

  return {
    landingArrivedAt: waitlistArrivedAt,
    timeToSignupMs,
  };
}
