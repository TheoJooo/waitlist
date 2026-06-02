import type { MetadataRoute } from 'next';

const BASE_URL = 'https://www.various-archives.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/newsletter/unsubscribe'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
