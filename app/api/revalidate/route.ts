import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/shopify'

export async function GET() {
  revalidateTag(CACHE_TAGS.products)
  revalidateTag(CACHE_TAGS.collections)
  return NextResponse.json({ revalidated: true, timestamp: new Date().toISOString() })
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-shopify-webhook-secret')
  const webhookSecret = process.env.SHOPIFY_WEBHOOK_SECRET

  if (webhookSecret && secret !== webhookSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const topic = req.headers.get('x-shopify-topic') ?? ''

  if (topic.startsWith('products/')) {
    revalidateTag(CACHE_TAGS.products)
    try {
      const body = await req.json()
      if (body.handle) revalidateTag(CACHE_TAGS.product(body.handle))
    } catch {}
  }

  if (topic.startsWith('collections/')) {
    revalidateTag(CACHE_TAG