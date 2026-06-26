'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { CartItemSkeleton } from '@/components/skeletons'
import { cn, formatMoney, getShopifyImageUrl, getProductUrl } from '@/utils'
import type { CartItem } from '@/types'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]
const FREE_SHIPPING_THRESHOLD = 2000 // ₹

// ─── Free shipping bar ────────────────────────────────────────────────────────

function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const progress = Math.min(subtotal / FREE_SHIPPING_THRESHOLD, 1)
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0)
  const qualified = progress >= 1

  return (
    <div className="px-7 py-4 border-b border-white/[0.06]">
      <div className="flex items-center justify-between mb-2.5">
        <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/35">
          {qualified
            ? 'Free Pan India delivery unlocked'
            : `₹${remaining.toFixed(0)} away from free delivery`}
        </p>
        {qualified && (
          <span className="font-sans text-[8px] tracking-[0.2em] uppercase text-[#B5121B]">
            ✓
          </span>
        )}
      </div>
      <div className="h-px bg-white/[0.08] w-full overflow-hidden">
        <motion.div
          className={cn('h-full', qualified ? 'bg-[#B5121B]' : 'bg-white/40')}
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: progress }}
          transition={{ duration: 0.7, ease: EASE }}
        />
      </div>
    </div>
  )
}

// ─── Quantity controls ────────────────────────────────────────────────────────

function QtyControl({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem, status } = useCart()
  const loading = status === 'updating' || status === 'removing'
  const prevQty = useRef(item.quantity)

  useEffect(() => {
    prevQty.current = item.quantity
  }, [item.quantity])

  return (
    <div className="flex items-center mt-3" role="group" aria-label="Quantity">
      <button
        onClick={() =>
          item.quantity === 1 ? removeItem(item.lineId) : updateQuantity(item.lineId, item.quantity - 1)
        }
        disabled={loading}
        aria-label="Decrease quantity"
        className={cn(
          'w-11 h-11 md:w-7 md:h-7 flex items-center justify-center',
          'border border-white/12 text-white/55 font-light text-base',
          'hover:border-white/40 hover:text-white active:scale-90',
          'transition-all duration-200 disabled:opacity-30',
          'focus-visible:outline-2 focus-visible:outline-[#B5121B] focus-visible:outline-offset-2'
        )}
      >
        −
      </button>

      {/* Animated quantity number */}
      <div
        className={cn(
          'w-10 md:w-9 h-11 md:h-7 flex items-center justify-center overflow-hidden',
          'border-t border-b border-white/12'
        )}
        aria-live="polite"
        aria-label={`Quantity: ${item.quantity}`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={item.quantity}
            initial={{ y: item.quantity > prevQty.current ? 14 : -14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: item.quantity > prevQty.current ? -14 : 14, opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
            className={cn(
              'font-sans text-[11px] tracking-[0.15em] text-white',
              loading && 'text-[#B5121B]'
            )}
          >
            {item.quantity}
          </motion.span>
        </AnimatePresence>
      </div>

      <button
        onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
        disabled={loading}
        aria-label="Increase quantity"
        className={cn(
          'w-11 h-11 md:w-7 md:h-7 flex items-center justify-center',
          'border border-white/12 text-white/55 font-light text-base',
          'hover:border-white/40 hover:text-white active:scale-90',
          'transition-all duration-200 disabled:opacity-30',
          'focus-visible:outline-2 focus-visible:outline-[#B5121B] focus-visible:outline-offset-2'
        )}
      >
        +
      </button>
    </div>
  )
}

// ─── Cart line item ───────────────────────────────────────────────────────────

function CartLineItem({ item }: { item: CartItem }) {
  const { removeItem } = useCart()

  const variantLabel = Object.entries(item.variant.options)
    .filter(([k]) => k.toLowerCase() !== 'title')
    .map(([, v]) => v)
    .join(' / ')

  const imgSrc = item.product.image
    ? getShopifyImageUrl(item.product.image.url, 200)
    : null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="flex gap-4 py-[22px] border-b border-white/[0.06]"
    >
      {/* Thumbnail */}
      <div className="w-[68px] h-[84px] flex-shrink-0 bg-[#1a0a0c] overflow-hidden">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={item.product.title}
            width={136}
            height={168}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#1a0a0c]" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={getProductUrl(item.product.handle)}
          className="block font-serif text-[15px] font-light text-white hover:text-white/70 transition-colors truncate"
        >
          {item.product.title}
        </Link>
        {variantLabel && (
          <p className="font-sans text-[9px] tracking-[0.22em] uppercase text-white/35 mt-0.5">
            {variantLabel}
          </p>
        )}
        <p className="font-serif text-[14px] font-light text-white/60 mt-0.5">
          {formatMoney(item.price)}
        </p>
        <QtyControl item={item} />
      </div>

      {/* Remove */}
      <button
        onClick={() => removeItem(item.lineId)}
        aria-label="Remove item"
        className="self-start mt-0.5 p-2 -m-2 text-white/20 hover:text-white/60 transition-colors text-[11px] font-sans tracking-[0.1em] focus-visible:outline-2 focus-visible:outline-[#B5121B] focus-visible:outline-offset-2"
      >
        ✕
      </button>
    </motion.div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center">
      <div
        className="w-14 h-14 border border-white/[0.08] flex items-center justify-center mb-7"
        aria-hidden="true"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        >
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      </div>
      <p className="font-serif italic text-[20px] font-light text-white/45 leading-[1.3] mb-8">
        Looks like you&apos;re
        <br />
        behaving today.
      </p>
      <button
        onClick={onClose}
        className="group relative inline-flex items-center gap-3 overflow-hidden border border-white/18 px-6 py-3.5 font-sans text-[9px] tracking-[0.28em] uppercase text-white transition-colors hover:border-[#B5121B] focus-visible:outline-2 focus-visible:outline-[#B5121B] focus-visible:outline-offset-2"
      >
        <span
          className="absolute inset-0 bg-[#B5121B] -translate-x-full group-hover:translate-x-0 transition-transform duration-[600ms]"
          style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
          aria-hidden="true"
        />
        <span className="relative z-10">Go Cause Some Trouble</span>
        <svg
          className="relative z-10"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          aria-hidden="true"
        >
          <path d="M7 1L11 4M11 4L7 7M11 4H1" />
        </svg>
      </button>
    </div>
  )
}

// ─── Cart drawer ──────────────────────────────────────────────────────────────

export function CartDrawer() {
  const { cart, isOpen, closeCart, status } = useCart()
  const closeRef = useRef<HTMLButtonElement>(null)
  const isLoading = status === 'loading'
  const qty = cart?.totalQuantity ?? 0
  const subtotalAmount = cart?.subtotal?.amount ?? 0

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeCart()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, closeCart])

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Focus close button on open
  useEffect(() => {
    if (isOpen) setTimeout(() => closeRef.current?.focus(), 100)
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/55 backdrop-blur-[4px] z-[900]"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease: EASE }}
            className="fixed top-0 right-0 bottom-0 z-[901] w-full max-w-[420px] bg-[#111111] border-l border-white/[0.08] flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
          >
            {/* Header */}
            <div className="flex items-start justify-between px-7 pt-6 pb-5 border-b border-white/[0.07] flex-shrink-0">
              <div>
                <h2 className="font-serif text-[22px] font-light">Your Bag</h2>
                <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-white/30 mt-1">
                  {qty === 0
                    ? 'Nothing here yet'
                    : `${qty} piece${qty !== 1 ? 's' : ''} of mischief`}
                </p>
              </div>
              <button
                ref={closeRef}
                onClick={closeCart}
                className="font-sans text-[9px] tracking-[0.25em] uppercase text-white/35 hover:text-white transition-colors mt-0.5 p-2 -m-2 focus-visible:outline-2 focus-visible:outline-[#B5121B] focus-visible:outline-offset-2"
                aria-label="Close bag"
              >
                Close
              </button>
            </div>

            {/* Free shipping bar */}
            {cart && cart.items.length > 0 && (
              <FreeShippingBar subtotal={subtotalAmount} />
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-7 [&::-webkit-scrollbar]:w-px [&::-webkit-scrollbar-thumb]:bg-white/10">
              {isLoading ? (
                <div>
                  <CartItemSkeleton />
                  <CartItemSkeleton />
                </div>
              ) : !cart || cart.items.length === 0 ? (
                <EmptyCart onClose={closeCart} />
              ) : (
                <AnimatePresence mode="popLayout">
                  {cart.items.map(item => (
                    <CartLineItem key={item.lineId} item={item} />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            <AnimatePresence>
              {cart && cart.items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="flex-shrink-0 border-t border-white/[0.07] px-7 pt-5 pb-7"
                >
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/35">
                      Subtotal
                    </span>
                    <span className="font-serif text-[24px] font-light">
                      {formatMoney(cart.subtotal)}
                    </span>
                  </div>
                  <p className="font-sans text-[9px] tracking-[0.08em] leading-[1.6] text-white/22 mb-5">
                    Taxes & shipping calculated at checkout.
                  </p>
                  <a
                    href={cart.checkoutUrl}
                    className="group relative w-full flex items-center justify-between overflow-hidden border border-white/22 px-6 py-[17px] font-sans text-[10px] tracking-[0.25em] uppercase text-white hover:border-[#B5121B] transition-colors focus-visible:outline-2 focus-visible:outline-[#B5121B] focus-visible:outline-offset-2"
                  >
                    <span
                      className="absolute inset-0 bg-[#B5121B] -translate-x-full group-hover:translate-x-0 transition-transform duration-[600ms]"
                      style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
                      aria-hidden="true"
                    />
                    <span className="relative z-10">Proceed to Checkout</span>
                    <svg
                      className="relative z-10 transition-transform duration-400 group-hover:translate-x-[5px]"
                      width="14"
                      height="10"
                      viewBox="0 0 14 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      aria-hidden="true"
                    >
                      <path d="M8.5 1L13 5M13 5L8.5 9M13 5H1" />
                    </svg>
                  </a>
                  {status === 'error' && (
                    <p className="font-sans text-[9px] tracking-[0.1em] text-white/50 italic text-center mt-4">
                      Something went sideways. Try again.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
