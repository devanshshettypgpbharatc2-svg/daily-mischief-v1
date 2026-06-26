'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { cn, formatMoney, getProductUrl, getShopifyImageUrl } from '@/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  priority?: boolean
  index?: number
}

export function ProductCard({ product, priority = false, index = 0 }: ProductCardProps) {
  const prefersReduced = useReducedMotion()
  const firstImage = product.images[0]
  const secondImage = product.images[1]
  const firstVariant = product.variants[0]
  const isSoldOut = !product.available

  const price = firstVariant?.price ?? product.priceRange.min
  const compareAt = firstVariant?.compareAtPrice ?? null

  // Stagger delay: cascade within each row of 3
  const staggerDelay = (index % 3) * 0.08

  return (
    <ScrollReveal delay={staggerDelay} y={24}>
      <Link
        href={getProductUrl(product.handle)}
        className="group block"
        aria-label={`${product.title} — ${formatMoney(price)}`}
      >
        {/* Image */}
        <div className="relative overflow-hidden aspect-[3/4] bg-[#0d0607]">
          {firstImage ? (
            <>
              {/* Primary image */}
              <Image
                src={getShopifyImageUrl(firstImage.url, 800)}
                alt={firstImage.alt || product.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={priority}
                className={cn(
                  'object-cover transition-all duration-700',
                  secondImage
                    ? 'group-hover:opacity-0'
                    : 'group-hover:scale-[1.04]'
                )}
                style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
              />

              {/* Secondary image — scale in on hover for depth */}
              {secondImage && (
                <Image
                  src={getShopifyImageUrl(secondImage.url, 800)}
                  alt={`${product.title} — alternate view`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover opacity-0 scale-[1.04] group-hover:opacity-100 group-hover:scale-100 transition-all duration-700"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 bg-[#0d0607]" />
          )}

          {/* Product type chip — top left */}
          {product.type && (
            <div className="absolute top-3 left-3 z-10">
              <span className="font-sans text-[8px] tracking-[0.3em] uppercase text-white/50 bg-black/40 backdrop-blur-sm px-2 py-1">
                {product.type}
              </span>
            </div>
          )}

          {/* Compare-at / sale badge — top right */}
          {compareAt && !isSoldOut && (
            <div className="absolute top-3 right-3 z-10">
              <span className="font-sans text-[8px] tracking-[0.25em] uppercase text-white bg-[#B5121B] px-2 py-1">
                Sale
              </span>
            </div>
          )}

          {/* Sold out overlay */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/55 border border-white/20 px-4 py-2">
                Gone Missing
              </span>
            </div>
          )}

          {/* View Piece bar */}
          {!isSoldOut && (
            <div
              className="absolute bottom-0 left-0 right-0 py-3.5 bg-[#111111]/92 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-500"
              style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
              aria-hidden="true"
            >
              <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-white/80 text-center">
                View Piece
              </p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-0 pt-3 border-t border-white/[0.07]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-serif text-[15px] font-light text-white leading-snug group-hover:text-white/75 transition-colors duration-300 truncate">
                {product.title}
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              {compareAt ? (
                <div className="flex flex-col items-end">
                  <p className="font-sans text-[10px] font-light text-white/35 line-through leading-none mb-0.5">
                    {formatMoney(compareAt)}
                  </p>
                  <p className="font-serif text-[14px] font-light text-[#B5121B]">
                    {formatMoney(price)}
                  </p>
                </div>
              ) : (
                <p className="font-serif text-[14px] font-light text-white/60">
                  {formatMoney(price)}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </ScrollReveal>
  )
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-[2px]">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 4} index={i} />
      ))}
    </div>
  )
}
