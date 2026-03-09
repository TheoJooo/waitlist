'use client';

import Link from 'next/link';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  capturePosthogEvent,
  extractUtmProperties,
  getTrackingConsent,
  setTrackingConsent,
  type TrackingConsent,
} from '@/lib/analytics';
import { markWaitlistArrival } from '@/lib/waitlist-timing';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';
const posthogSnippet = posthogKey
  ? `!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session reset isFeatureEnabled onFeatureFlags onSessionId getFeatureFlag getFeatureFlagPayload reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getEarlyAccessFeaturesEnrollment getSurveys onSessionId getSessionId getDistinctId getGroups setPersonProperties identify setGroup group removeGroup setPersonPropertiesForFlags setGroupPropertiesForFlags resetGroups opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing startSessionRecording stopSessionRecording on".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);posthog.init(${JSON.stringify(
      posthogKey
    )},{api_host:${JSON.stringify(
      posthogHost
    )},capture_pageview:false,capture_pageleave:true,person_profiles:"identified_only"});`
  : null;

function CookieConsentBanner({
  onChoice,
}: {
  onChoice: (consent: Exclude<TrackingConsent, 'pending'>) => void;
}) {
  return (
    <div className="fixed inset-x-4 bottom-4 z-120 mx-auto max-w-xl border border-(--outline) bg-(--body-background) p-4 shadow-[0_18px_60px_rgba(0,0,0,0.12)]">
      <p className="mt-2 text-sm leading-6 text-(--text-grey)">
        We use cookies to improve your experience. <Link href="/privacy" className="underline underline-offset-2">Privacy policy</Link>.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => onChoice('denied')}
          className="h-11 self-start px-2 text-sm font-medium text-(--text-grey) transition-colors hover:text-(--main-black)"
        >
          Reject
        </button>
        <button
          type="button"
          onClick={() => onChoice('granted')}
          className="h-11 cursor-pointer border border-(--main-black) bg-(--main-black) px-5 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:min-w-44"
        >
          Accept
        </button>
      </div>
    </div>
  );
}

export default function AnalyticsManager() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [consent, setConsent] = useState<TrackingConsent>('pending');
  const [isPostHogReady, setIsPostHogReady] = useState(false);

  const currentUrlSearch = useMemo(() => searchParams?.toString() ?? '', [searchParams]);

  useEffect(() => {
    setConsent(getTrackingConsent());
  }, []);

  useEffect(() => {
    if (consent !== 'granted') {
      setIsPostHogReady(false);
      return;
    }

    if (window.posthog) {
      setIsPostHogReady(true);
      return;
    }

    const pollId = window.setInterval(() => {
      if (!window.posthog) return;

      window.clearInterval(pollId);
      window.posthog.opt_in_capturing();
      setIsPostHogReady(true);
    }, 50);

    return () => window.clearInterval(pollId);
  }, [consent]);

  useEffect(() => {
    if (pathname !== '/waitlist') return;

    markWaitlistArrival();
  }, [pathname]);

  useEffect(() => {
    if (consent !== 'granted' || !isPostHogReady || !pathname) return;

    const utmProps = extractUtmProperties(searchParams);
    capturePosthogEvent('waitlist_page_view', {
      page_path: pathname,
      ...utmProps,
    });

    if (pathname === '/waitlist/thank-you') {
      capturePosthogEvent('waitlist_thank_you_view', {
        page_path: pathname,
      });
    }
  }, [consent, isPostHogReady, pathname, currentUrlSearch, searchParams]);

  if (!posthogSnippet) {
    return null;
  }

  return (
    <>
      {consent === 'granted' ? (
        <Script
          id="posthog-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: posthogSnippet }}
        />
      ) : null}
      {consent === 'pending' ? <CookieConsentBanner onChoice={(value) => {
        setTrackingConsent(value);
        setConsent(value);
      }} /> : null}
    </>
  );
}
