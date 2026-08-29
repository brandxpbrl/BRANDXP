import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { mellProducts } from '@/config/mell-stone.content';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/felatours`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/felatours/experiencias`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.89,
    },
    {
      url: `${siteConfig.url}/felatours/international`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.88,
    },
    {
      url: `${siteConfig.url}/felatours/international/experiences`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.87,
    },
    {
      url: `${siteConfig.url}/zaptdeliverybz`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...[
      ['/mell-stone', 'weekly', 0.86],
      ['/mell-stone/shop', 'weekly', 0.78],
      ['/mell-stone/collections', 'weekly', 0.72],
      ['/mell-stone/materials', 'monthly', 0.68],
      ['/mell-stone/about', 'monthly', 0.62],
      ['/mell-stone/contact', 'monthly', 0.62],
    ].map(([path, changeFrequency, priority]) => ({
      url: `${siteConfig.url}${path}`,
      lastModified: now,
      changeFrequency: changeFrequency as 'weekly' | 'monthly',
      priority: priority as number,
    })),
    ...mellProducts.map((product) => ({
      url: `${siteConfig.url}/mell-stone/product/${product.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.58,
    })),
  ];
}
