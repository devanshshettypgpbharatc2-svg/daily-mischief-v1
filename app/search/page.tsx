'use client'

import { useState, useEffect, useRef } from 'react'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { ProductGrid } from '@/components/product/ProductCard'
import type { Product } from '@/types'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (query.trim().length < 2) {
      setResults([])
      setTotal(0)
      return
    }
    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
        const data = await res.json()
        setResults(data.products ?? [])
        setTotal(data.totalCount ?? 0)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 350)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  return (
    <>
      <Nav />
      <CartDrawer />
      <main className="min-h-screen pt-16 md:pt-[72px]">
        {/* Search input */}
        <div className="px-5 md:px-10 pt-16 md:pt-20 pb-10 border-b border-white/[0.08]">
          <label htmlFor="search" className="block font-sans text-[9px] tracking-[0.4em] uppercase text-[#B5121B] mb-6">
            Search
          </label>
          <div className="flex items-center gap-4">
            <input
              ref={inputRef}
              id="search"
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="flex-1 bg-transparent border-b border-white/[0.15] pb-4 font-serif text-[clamp(22px,4vw,48px)] font-light text-white placeholder-white/15 focus:border-white/40 focus:outline-none transition-colors"
            />
            {loading && (
              <div className="w-4 h-4 border border-white/20 border-t-white/60 rounded-full animate-spin flex-shrink-0" />
            )}
          </div>
          {query.trim().length >= 2 && !loading && (
            <p className="font-sans text-[10px] tracking-[0.2em] text-white/25 mt-4">
              {total === 0 ? 'No results' : `${total} result${total === 1 ? '' : 's'}`}
            </p>
          )}
        </div>

        {/* Results */}
        <div className="px-5 md:px-10 py-10 md:py-14">
          {results.length > 0 ? (
            <ProductGrid products={results} />
          ) : query.trim().length >= 2 && !loading ? (
            <div className="py-24 text-center">
              <p className="font-serif italic text-[clamp(20px,3vw,32px)] font-light text-white/20 mb-4">
                Nothing found for "{query}"
              </p>
              <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/15">
                Try something else
              </p>
            </div>
          ) : query.trim().length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-serif italic text-[clamp(20px,3vw,32px)] font-light text-white/15">
                Start typing to search
              </p>
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  )
}
