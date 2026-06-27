import { NextResponse } from 'next/server'
import { GET_COLLECTION_BY_HANDLE, GET_PRODUCT_BY_HANDLE } from '@/lib/graphql/queries'

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
    })
    simpleResult = await res.json()
  } catch (err) {
    simpleResult = { error: String(err) }
  }

  // Test 2: the ACTUAL production query with fragments
  let fragmentResult: unknown = null
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: GET_COLLECTION_BY_HANDLE,
        variables: { handle: 'wardrobe', first: 5, sortKey: 'COLLECTION_DEFAULT', reverse: false },
      }),
      cache: 'no-store',
    })
    fragmentResult = await res.json()
  } catch (err) {
    fragmentResult = { error: String(err) }
  }

  // Test 3: direct product query by handle
  let productResult: unknown = null
  try {
    const res = await fetch(endpoint, {
     