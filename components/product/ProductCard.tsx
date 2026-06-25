'use client'

import Link from 'next/link'
import Image from 'next/image'
import { cn, formatMoney, getProductUrl, getShopifyImageUrl } from '@/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const firstImage = product.images[0]
  const secondImage = product.images[1]
  const firstVariant = product.variants[0]
  const isSoldOut = !product.available

  const price = firstVariant?.price ?? product.priceRange.min
  const compareAt = firstVariant?.compareAtPrice ?? null

  return (
    <Link
      href={getProductUrl(product.handle)}
      className="group block"
      aria-label={`${product.title} — ${formatMoney(price)}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4] bg-[#0d0607]">
        {firstImage ? (
          <>
            <Image
              src={getShopifyImageUrl(firstImage.url, 600)}
              alt={firstImage.alt || product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
              className={cn(
                'object-cover transition-all duration-700',
                secondImage
                  ? 'group-hover:opacity-0'
                  : 'group-hover:scale-[1.03]'
              )}
              style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
            />
            {secondImage && (
              <Image
                src={getShopifyImageUrl(secondImage.url, 600)}
                alt={`${product.title} — alternate view`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-[#0d0607]" />
        )}

        {/* Sold out overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/55 border border-white/20 px-4 py-2">
              Gone Missing
            </span>
          </div>
        )}

        {/* Quick view bar */}
        {!isSoldOut && (
          <div
            className="absolute bottom-0 left-0 right-0 py-3 bg-[#111111]/90 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
            style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
            aria-hidden="true"
          >
            <p className="font-sans text-[9px] tracking-[0.28em] uppercase text-white text-center">
              View Piece
            </p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-serif text-[15px] font-light text-white leading-tight truncate">
            {product.title}
          </p>
          {product.type && (
            <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/30 mt-0.5">
              {product.type}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 text-right">
          {compareAt ? (
            <>
              <p className="font-serif text-[13px] font-light text-[#B5121B] line-through">{formatMoney(compareAt)}</p>
              <p className="font-serif text-[14px] font-light text-white">{formatMoney(price)}</p>
            </>
          ) : (
            <p className="font-serif text-[14px] font-light text-white/70">{formatMoney(price)}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-[2px]">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 4} />
      ))}
    </div>
  )
}
