import { shopifyFetch } from './client'
import { transformCart } from './transforms'
import { CREATE_CART, GET_CART, ADD_TO_CART, UPDATE_CART_LINES, REMOVE_FROM_CART } from '@/lib/graphql/mutations'
import type { ShopifyCart, Cart } from '@/types'

export async function createCart(lines?: { merchandiseId: string; quantity: number }[]): Promise<Cart> {
  const data = await shopifyFetch<{ cartCreate: { cart: ShopifyCart } }>(
    CREATE_CART, { lines: lines ?? [] }, { cache: 'no-store' }
  )
  return transformCart(data.cartCreate.cart)
}

export async function getCart(cartId: string): Promise<Cart | null> {
  try {
    const data = await shopifyFetch<{ cart: ShopifyCart | null }>(
      GET_CART, { cartId }, { cache: 'no-store' }
    )
    return data.cart ? transformCart(data.cart) : null
  } catch {
    return null
  }
}

export async function addToCart(cartId: string, lines: { merchandiseId: string; quantity: number }[]): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: ShopifyCart } }>(
    ADD_TO_CART, { cartId, lines }, { cache: 'no-store' }
  )
  return transformCart(data.cartLinesAdd.cart)
}

export async function updateCartLines(cartId: string, lines: { id: string; quantity: number }[]): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: ShopifyCart } }>(
    UPDATE_CART_LINES, { cartId, lines }, { cache: 'no-store' }
  )
  return transformCart(data.cartLinesUpdate.cart)
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: ShopifyCart } }>(
    REMOVE_FROM_CART, { cartId, lineIds }, { cache: 'no-store' }
  )
  return transformCart(data.cartLinesRemove.cart)
}
