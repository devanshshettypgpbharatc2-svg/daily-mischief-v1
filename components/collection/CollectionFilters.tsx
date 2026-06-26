'use client'

import { useState, useMemo } from 'react'
import { ProductCard } from '@/components/product/ProductCard'
import { cn } from '@/utils'
import type { Product } from '@/types'

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name-asc'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Featured' },
  { key: 'price-asc', label: 'Price ↑' },
  { key: 'price-desc', label: 'Price ↓' },
  { key: 'name-asc', label: 'A – Z' },
]

function sortProducts(products: Product[], sort: SortKey): Product[] {
  const arr = [...products]
  switch (sort) {
    case 'price-asc':
      return arr.sort((a, b) =>
        parseFloat(a.priceRange.min.amount) - parseFloat(b.priceRange.min.amount)
      )
    case 'price-desc':
      return arr.sort((a, b) =>
        parseFloat(b.priceRange.min.amount) - parseFloat(a.priceRange.min.amount)
      )
    case 'name-asc':
      return arr.sort((a, b) => a.title.localeCompare(b.title))
    default:
      return arr
  }
}

export function CollectionFilters({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortKey>('featured')

  const sorted = useMemo(() => sortProducts(products, sort), [products, sort])

  if (products.length === 0) return null

  return (
    <div>
      {/* Sort bar */}
      <div className="flex items-center justify-between mb-8 pb-5 border-b border-white/[0.06]">
        <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/25">
          {products.length} {products.length === 1 ? 'piece' : 'pieces'}
        </p>
        <div className="flex items-center gap-1">
          <span className="font-sans text-[9px] tracking-[0.25em] uppercase text-white/20 mr-3 hidden sm:inline">
            Sort
          </span>
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.key}
              onClick={() => setSort(opt.key)}
              className={cn(
                'font-sans text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 transition-all duration-200',
                sort === opt.key
                  ? 'text-white border-b border-white/60'
                  : 'text-white/30 hover:text-white/60'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-[2px]">
        {sorted.map((p, i) => (
          <ProductCard key={p.id} product={p} priority={i < 4} index={i} />
        ))}
      </div>
    </div>
  )
}
