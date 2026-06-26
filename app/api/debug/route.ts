import { NextResponse } from 'next/server'

export async function GET() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
  const version = process.env.SHOPIFY_API_VERSION || '2024-10'

  const endpoint = `https://${domain}/api/${version}/graphql.json`

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token ?? '',
      },
      body: JSON.stringify({
        query: `{ collection(handle: "wardrobe") { title products(first: 3) { edges { node { title } } } } }`,
      }),
      cache: 'no-store',
    })

    const json = await res.json()

    return NextResponse.json({
      status: res.status,
      domain,
      tokenPrefix: token?.slice(0, 8) + '...',
      endpoint,
      response: json,
    })
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err), domain, tokenPrefix: token?.slice(0, 8) + '...' })
  }
}
