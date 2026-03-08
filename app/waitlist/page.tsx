import type { Metadata } from 'next';
import WaitlistLandingPage from '@/components/WaitlistLandingPage';

const waitlistSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Various Archives Waitlist',
  description:
    'Join the Various Archives early access list for curated luxury vintage and archival designer pieces.',
  url: 'https://various-archives.com/waitlist',
  mainEntity: {
    '@type': 'Organization',
    name: 'Various Archives',
    url: 'https://various-archives.com',
    sameAs: ['https://instagram.com/variousarchives'],
  },
};

export const metadata: Metadata = {
  title: 'Various Archives | Early Access Waitlist',
  description:
    'The world’s best luxury vintage, curated by professionals. Join the Various Archives waitlist.',
  alternates: {
    canonical: '/waitlist',
  },
};

export default function WaitlistPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(waitlistSchema) }}
      />
      <WaitlistLandingPage />
    </>
  );
}
