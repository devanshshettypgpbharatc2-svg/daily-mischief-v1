import { NextResponse } from 'next/server'
import { GET_COLLECTION_BY_HANDLE } from '@/lib/graphql/queries'

export async function GET() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN
  const privateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN
  const publicToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
  const version = process.env.SHOPIFY_API_VERSION || '2024-10'
  const endpoint = `https://${domain}/api/${version}/graphql.json`
  const headers = {
    'Content-Type': 'application/json',
    ...(privateToken
      ? { 'Shopify-Storefront-Private-Token': privateToken }
      : { 'X-Shopify-Storefront-Access-Token': publicToken ?? '' }),
  }

  // Test 1: simple inline query (sanity check)
  let simpleResult: unknown = null
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: `{ shop { name } collection(handle: "wardrobe") { title products(first: 3) { edges { node { title } } } } }`,
      }),
      cache: 'no-store',
    