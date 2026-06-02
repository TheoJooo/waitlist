import type { MetadataRoute } from 'next';

const BASE_URL = 'https://www.various-archives.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Static, indexable routes. The marketplace (product/category pages) will be
  // added here later, generated dynamically from the database.
  return [
    {
      url: `${BASE_URL}/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/waitlist`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/support`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];
}
