'use client';

import { useEffect } from 'react';
import { capturePosthogEvent, extractUtmProperties } from '@/lib/analytics';

export default function PostHogPageView() {
  useEffect(() => {
    const pathname = window.location.pathname;
    const utmProps = extractUtmProperties(new URLSearchParams(window.location.search));
    capturePosthogEvent('waitlist_page_view', {
      page_path: pathname,
      ...utmProps,
    });
  }, []);

  return null;
}
