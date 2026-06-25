import type { ShopifyAPIResponse } from '@/types'

const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!
const version = process.env.SHOPIFY_API_VERSION || '2024-10'

if (!domain || !token) {
  if (typeof window === 'undefined' && process.env.NODE_ENV !== 'test') {
    console.warn(
      '[Shopify] Missing env vars: NEXT_PUBLIC_SHOPIFY_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN'
    )
  }
}

const endpoint = `https://${domain}/api/${version}/graphql.json`

export const CACHE_TAGS = {
  products: 'products',
  collections: 'collections',
  cart: 'cart',
  product: (handle: string) => `product:${handle}`,
  collection: (handle: string) => `collection:${handle}`,
} as const

interface FetchOptions {
  cache?: RequestCache
  tags?: string[]
  revalidate?: number
}

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  options: FetchOptions = {}
): Promise<T> {
  const { cache = 'force-cache', tags = [], revalidate } = options

  const next: RequestInit['next'] = {}

  if (tags.length) next.tags = tags
  if (revalidate !== undefined) next.revalidate = revalidate

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    cache,
    next,
  })

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status} ${res.statusText}`)
  }

  const json: ShopifyAPIResponse<T> = await res.json()

  if (json.errors?.length) {
    throw new Error(
      `GraphQL: ${json.errors.map((e) => e.message).join(', ')}`
    )
  }

  if (!json.data) {
    throw new Error('No data returned from Shopify')
  }

  return json.data
}