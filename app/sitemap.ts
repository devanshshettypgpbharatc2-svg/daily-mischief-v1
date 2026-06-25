import { MetadataRoute } from 'next'
import { getAllProductHandles, getAllCollectionHandles } from '@/lib/shopify'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://thedailymischief.com'
  const [productHandles, collectionHandles] = await Promise.all([
    getAllProductHandles(),
    getAllCollectionHandles(),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/editorial`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ]

  const productPages: MetadataRoute.Sitemap = productHandles.map(handle => ({
    url: `${base}/shop/products/${handle}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  const collectionPages: MetadataRoute.Sitemap = collectionHandles.map(handle => ({
    url: `${base}/shop/collections/${handle}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...productPages, ...collectionPages]
}
