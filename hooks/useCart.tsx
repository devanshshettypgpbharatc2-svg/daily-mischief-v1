'use client'

import {
  createContext, useContext, useReducer, useCallback,
  useEffect, type ReactNode,
} from 'react'
import type { Cart, CartStatus } from '@/types'
import { safeLS, setLS } from '@/utils'

const CART_ID_KEY = 'tdm_cart_id'

// ─── State ────────────────────────────────────────────────────────────────────

interface CartState {
  cart: Cart | null
  isOpen: boolean
  status: CartStatus
  error: string | null
}

type CartAction =
  | { type: 'SET_CART'; cart: Cart }
  | { type: 'SET_STATUS'; status: CartStatus }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, cart: action.cart, status: 'idle', error: null }
    case 'SET_STATUS':
      return { ...state, status: action.status }
    case 'SET_ERROR':
      return { ...state, error: action.error, status: 'error' }
    case 'OPEN':
      return { ...state, isOpen: true }
    case 'CLOSE':
      return { ...state, isOpen: false }
    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface CartContextValue extends CartState {
  addItem: (variantId: string, quantity?: number) => Promise<void>
  removeItem: (lineId: string) => Promise<void>
  updateQuantity: (lineId: string, quantity: number) => Promise<void>
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    cart: null,
    isOpen: false,
    status: 'idle',
    error: null,
  })

  useEffect(() => {
    const id = safeLS<string | null>(CART_ID_KEY, null)
    if (!id) return
    fetch(`/api/cart?cartId=${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(cart => {
        if (cart) dispatch({ type: 'SET_CART', cart })
        else localStorage.removeItem(CART_ID_KEY)
      })
      .catch(() => localStorage.removeItem(CART_ID_KEY))
  }, [])

  const mutate = useCallback(async (body: Record<string, unknown>) => {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error('Cart mutation failed')
    const { cart } = await res.json()
    setLS(CART_ID_KEY, cart.id)
    dispatch({ type: 'SET_CART', cart })
    return cart as Cart
  }, [])

  const addItem = useCallback(async (variantId: string, quantity = 1) => {
    // Prevent double-fire
    if (state.status === 'adding') return
    dispatch({ type: 'SET_STATUS', status: 'adding' })
    try {
      const cartId = safeLS<string | null>(CART_ID_KEY, null)
      await mutate({ action: 'add', cartId, lines: [{ merchandiseId: variantId, quantity }] })
      dispatch({ type: 'OPEN' })
    } catch {
      dispatch({ type: 'SET_ERROR', error: 'Something went sideways. Try again.' })
    }
  }, [state.status, mutate])

  const removeItem = useCallback(async (lineId: string) => {
    dispatch({ type: 'SET_STATUS', status: 'removing' })
    try {
      const cartId = safeLS<string | null>(CART_ID_KEY, null)
      if (!cartId) throw new Error('No cart')
      await mutate({ action: 'remove', cartId, lineIds: [lineId] })
    } catch {
      dispatch({ type: 'SET_ERROR', error: 'Could not remove item.' })
    }
  }, [mutate])

  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    if (quantity < 1) return removeItem(lineId)
    dispatch({ type: 'SET_STATUS', status: 'updating' })
    try {
      const cartId = safeLS<string | null>(CART_ID_KEY, null)
      if (!cartId) throw new Error('No cart')
      await mutate({ action: 'update', cartId, lines: [{ id: lineId, quantity }] })
    } catch {
      dispatch({ type: 'SET_ERROR', error: 'Could not update quantity.' })
    }
  }, [removeItem, mutate])

  const openCart = useCallback(() => dispatch({ type: 'OPEN' }), [])
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE' }), [])

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, updateQuantity, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
