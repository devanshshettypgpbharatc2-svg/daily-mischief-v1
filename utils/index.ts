import type { Money, Image, Product } from '@/types'

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatMoney(m: Money): string {
  return m.formatted
}

export function getShopifyImageUrl(url: string, width: number): string {
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}width=${width}&format=webp`
}

export function getProductUrl(handle: string): string {
  return `/shop/products/${handle}`
}

export function getCollectionUrl(handle: string): string {
  return `/shop/collections/${handle}`
}

export function getVariantByOptions(
  variants: Product['variants'],
  selected: Record<string, string>
) {
  return variants.find(v =>
    Object.entries(selected).every(([k, val]) => v.options[k] === val)
  )
}

export function truncate(str: string, max: number): string {
  return str.length <= max ? str : str.slice(0, max).trimEnd() + '…'
}

// ─── Drop countdown — 4:00 AM IST = 22:30 UTC (previous day) ─────────────────
// IST is UTC+5:30, so 4:00 AM IST = 22:30 UTC the night before.

export function getNextDropTime(): Date {
  const now = new Date()
  // Build today's reset at 22:30 UTC
  const reset = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    22, 30, 0, 0
  ))
  // If we've already passed 22:30 UTC today, next reset is tomorrow
  if (now >= reset) {
    reset.setUTCDate(reset.getUTCDate() + 1)
  }
  return reset
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return '00:00:00'
  const totalSeconds = Math.floor(ms / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return [h, m, s].map(n => String(n).padStart(2, '0')).join(':')
}

const CLOTHING_TYPES = [
  'shirt', 'tshirt', 't-shirt', 'top', 'jacket', 'coat', 'hoodie',
  'sweatshirt', 'sweater', 'dress', 'trouser', 'pant', 'jeans',
  'shorts', 'skirt', 'kurta', 'kurti', 'clothing', 'apparel',
  'wardrobe', 'wear',
]

export function isClothingProduct(type?: string): boolean {
  if (!type) return false
  const lower = type.toLowerCase()
  return CLOTHING_TYPES.some(t => lower.includes(t))
}

export function safeLS<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

export function setLS(key: string, value: unknown): void {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}
