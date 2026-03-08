import type { Metadata } from 'next';
import ThankYouPage from '@/components/ThankYouPage';

export const metadata: Metadata = {
  title: 'Thank You | Various Archives',
  description: 'Confirm your preferences after joining the Various Archives waitlist.',
  alternates: {
    canonical: '/waitlist/thank-you',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function WaitlistThankYouPage() {
  return <ThankYouPage />;
}
