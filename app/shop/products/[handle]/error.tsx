'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Product page error]', error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <p className="font-sans text-[9px] tracking-[0.5em] uppercase text-[#B5121B] mb-6">
        Something went wrong
      </p>
      <p
        className="font-serif italic font-light text-white/40 leading-[1.15] mb-10"
        style={{ fontSize: 'clamp(22px, 3vw, 36px)' }}
      >
        This piece got away from us.
      </p>
      <div className="flex items-center gap-6">
        <button
          onClick={reset}
          className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/40 hover:text-white transition-colors border border-white/15 hover:border-white/40 px-5 py-3"
        >
          Try again
        </button>
        <Link
          href="/shop/collections/wardrobe"
          className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/40 hover:text-white transition-colors"
        >
          Browse the wardrobe →
        </Link>
      </div>
    </div>
  )
}
