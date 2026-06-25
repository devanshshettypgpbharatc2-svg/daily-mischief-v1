import { NextRequest, NextResponse } from 'next/server'
import { createCart, getCart, addToCart, updateCartLines, removeFromCart } from '@/lib/shopify'

export async function GET(req: NextRequest) {
  const cartId = req.nextUrl.searchParams.get('cartId')
  if (!cartId) return NextResponse.json({ error: 'cartId required' }, { status: 400 })
  const cart = await getCart(cartId)
  if (!cart) return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
  return NextResponse.json(cart)
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  try {
    let cart
    const { action, cartId, lines, lineIds } = body as {
      action: string
      cartId?: string
      lines?: { merchandiseId: string; quantity: number }[] | { id: string; quantity: number }[]
      lineIds?: string[]
    }

    switch (action) {
      case 'add':
        cart = cartId
          ? await addToCart(cartId, lines as { merchandiseId: string; quantity: number }[])
          : await createCart(lines as { merchandiseId: string; quantity: number }[])
        break
      case 'update':
        if (!cartId) throw new Error('cartId required')
        cart = await updateCartLines(cartId, lines as { id: string; quantity: number }[])
        break
      case 'remove':
        if (!cartId || !lineIds) throw new Error('cartId and lineIds required')
        cart = await removeFromCart(cartId, lineIds)
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ cart })
  } catch (err) {
    console.error('[API/cart]', err)
    return NextResponse.json({ error: 'Cart operation failed' }, { status: 500 })
  }
}
