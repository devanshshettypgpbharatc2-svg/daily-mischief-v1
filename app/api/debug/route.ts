import { NextResponse } from 'next/server'

export async function GET() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN
  const privateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN
  const publicToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
  const version = process.env.SHOPIFY_API_VERSION || '2024-10'

  const endpoint = `https://${domain}/api/${version}/graphql.json`

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(privateToken
          ? { 'Shopify-Storefront-Private-Token': privateToken }
          : { 'X-Shopify-Storefront-Access-Token': publicToken ?? '' }),
      },
      body: JSON.stringify({
        query: `{
          shop { name }
          collections(first: 5) { edges { node { handle title } } }
          collection(handle: "wardrobe") { title products(first: 3) { edges { node { title } } } }
        }`,
      }),
      cache: 'no-store',
    })

    const json = await res.json()

    return NextResponse.json({
      status: res.status,
      domain,
      usingPrivateToken: !!privateToken,
      tokenPrefix: (privateToken ?? publicToken)?.slice(0, 8) + '...',
      endpoint,
      response: json,
    })
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err), domain, usingPrivateToken: !!privateToken })
  }
}
