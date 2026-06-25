import { shopifyFetch, CACHE_TAGS } from './client'
import { transformProduct, transformCollection } from './transforms'
import {
  GET_PRODUCT_BY_HANDLE, GET_ALL_PRODUCT_HANDLES,
  GET_PRODUCT_RECOMMENDATIONS, GET_COLLECTION_BY_HANDLE,
  GET_ALL_COLLECTION_HANDLES, GET_ALL_COLLECTIONS,
  SEARCH_PRODUCTS,
} from '@/lib/graphql/queries'
import type { ShopifyProduct, ShopifyCollection, Product, Collection } from '@/types'

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProductByHandle(handle: string): Promise<Product | null> {
  try {
    const data = await shopifyFetch<{ product: ShopifyProduct | null }>(
      GET_PRODUCT_BY_HANDLE,
      { handle },
      { tags: [CACHE_TAGS.products, CACHE_TAGS.product(handle)] }
    )
    return data.product ? transformProduct(data.product) : null
  } catch (err) {
    console.error('[Shopify] getProductByHandle:', err)
    return null
  }
}

export async function getAllProductHandles(): Promise<string[]> {
  try {
    const data = await shopifyFetch<{ products: { edges: { node: { handle: string } }[] } }>(
      GET_ALL_PRODUCT_HANDLES,
      {},
      { tags: [CACHE_TAGS.products] }
    )
    return data.products.edges.map(e => e.node.handle)
  } catch {
    return []
  }
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  try {
    const data = await shopifyFetch<{ productRecommendations: ShopifyProduct[] }>(
      GET_PRODUCT_RECOMMENDATIONS,
      { productId },
      { cache: 'no-store' }
    )
    return (data.productRecommendations || []).map(transformProduct).slice(0, 4)
  } catch {
    return []
  }
}

// ─── Collections ──────────────────────────────────────────────────────────────

export async function getCollectionByHandle(
  handle: string,
  options: { first?: number; after?: string; sortKey?: string; reverse?: boolean } = {}
): Promise<Collection | null> {
  const { first = 24, after, sortKey = 'COLLECTION_DEFAULT', reverse = false } = options
  try {
    const data = await shopifyFetch<{ collection: ShopifyCollection | null }>(
      GET_COLLECTION_BY_HANDLE,
      { handle, first, after, sortKey, reverse },
      { tags: [CACHE_TAGS.collections, CACHE_TAGS.collection(handle), CACHE_TAGS.products] }
    )
    return data.collection ? transformCollection(data.collection) : null
  } catch (err) {
    console.error('[Shopify] getCollectionByHandle:', err)
    return null
  }
}

export async function getAllCollectionHandles(): Promise<string[]> {
  try {
    const data = await shopifyFetch<{ collections: { edges: { node: { handle: string } }[] } }>(
      GET_ALL_COLLECTION_HANDLES,
      {},
      { tags: [CACHE_TAGS.collections] }
    )
    return data.collections.edges.map(e => e.node.handle)
  } catch {
    return []
  }
}

export async function getAllCollections(): Promise<Collection[]> {
  try {
    const data = await shopifyFetch<{ collections: { edges: { node: ShopifyCollection }[] } }>(
      GET_ALL_COLLECTIONS,
      { first: 50 },
      { tags: [CACHE_TAGS.collections] }
    )
    return data.collections.edges.map(e => transformCollection(e.node))
  } catch {
    return []
  }
}

// ─── Search ───────────────────────────────────────────────────────────────────

export async function searchProducts(query: string, first = 8) {
  if (!query || query.trim().length < 2) return { products: [], totalCount: 0 }
  try {
    const data = await shopifyFetch<{
      search: { totalCount: number; edges: { node: ShopifyProduct }[] }
    }>(
      SEARCH_PRODUCTS,
      { query: query.trim(), first },
      { cache: 'no-store' }
    )
    return {
      products: data.search.edges.map(e => transformProduct(e.node)).filter(Boolean),
      totalCount: data.search.totalCount,
    }
  } catch {
    return { products: [], totalCount: 0 }
  }
}

// ─── Named collections ────────────────────────────────────────────────────────

export const COLLECTION_HANDLES = {
  wardrobe: 'wardrobe',
  home: 'home',
  oddities: 'oddities',
  todaysMischief: 'todays-mischief',
} as const
