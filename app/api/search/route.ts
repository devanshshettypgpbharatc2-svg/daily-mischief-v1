import { NextRequest, NextResponse } from 'next/server'
import { searchProducts } from '@/lib/shopify'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? ''
  const first = parseInt(req.nextUrl.searchParams.get('first') ?? '8', 10)
  const result = await searchProducts(q, first)
  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
