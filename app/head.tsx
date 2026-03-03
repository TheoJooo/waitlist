const waitlistSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Various Archives Waitlist',
  description:
    'Join the Various Archives early access list for curated luxury vintage and archival designer pieces.',
  mainEntity: {
    '@type': 'Organization',
    name: 'Various Archives',
    url: 'https://variousarchives.com',
    sameAs: ['https://instagram.com/variousarchives'],
  },
};

export default function Head() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(waitlistSchema) }}
      />
    </>
  );
}
