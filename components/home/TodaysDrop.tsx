'use client'

import Image from 'next/image'
import { useCountdown } from '@/hooks/useCountdown'
import { MischiefButton } from '@/components/ui/Buttons'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { formatMoney, getShopifyImageUrl, getProductUrl } from '@/utils'
import { cn } from '@/utils'
import type { Product } from '@/types'

interface TodaysDropProps {
  product: Product | null
}

export function TodaysDrop({ product }: TodaysDropProps) {
  const { display, isUrgent } = useCountdown()

  if (!product) {
    return (
      <section className="border-t border-white/[0.06] py-section-lg px-5 md:px-10 text-center">
        <ScrollReveal>
          <p className="font-sans text-[9px] tracking-[0.5em] uppercase text-[#B5121B] mb-6">
            Today's Drop
          </p>
          <p
            className="font-serif italic font-light text-white/35 mb-8"
            style={{ fontSize: 'clamp(24px, 3.5vw, 44px)' }}
          >
            The collection is between drops.
          </p>
          <p className="font-sans text-[11px] text-white/22 mb-10 tracking-[0.05em]">
            A new piece releases every midnight.
          </p>
          <MischiefButton href="/shop/collections/wardrobe" label="Browse the Wardrobe" />
        </ScrollReveal>
      </section>
    )
  }

  const heroImage = product.images[0]
  const price = product.variants[0]?.price ?? product.priceRange.min

  return (
    <section className="border-t border-white/[0.06] grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      {/* Image — left */}
      <div className="relative aspect-[3/4] lg:aspect-auto lg:min-h-screen overflow-hidden bg-[#0d0d0d]">
        {heroImage ? (
          <Image
            src={getShopifyImageUrl(heroImage.url, 1200)}
            alt={heroImage.alt || product.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            quality={90}
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[#141414]" />
        )}
        {/* Subtle right-edge fade into the info panel */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, transparent 70%, rgba(17,17,17,0.3) 100%)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Info — right */}
      <div className="flex flex-col justify-center px-8 md:px-12 lg:px-16 py-16 lg:py-0 bg-[#111111]">
        <ScrollReveal y={28}>
          <p className="font-sans text-[9px] tracking-[0.55em] uppercase text-[#B5121B] mb-8">
            Today's Drop
          </p>

          <h2
            className="font-serif font-light text-white leading-[0.92] tracking-tight mb-6"
            style={{ fontSize: 'clamp(32px, 5vw, 72px)' }}
          >
            {product.title}
          </h2>

          {product.description && (
            <p className="font-sans text-[12px] leading-[1.9] text-white/38 max-w-sm mb-8">
              {product.description.slice(0, 140)}
              {product.description.length > 140 ? '…' : ''}
            </p>
          )}

          <p className="font-serif font-light text-white mb-8" style={{ fontSize: 'clamp(24px,3vw,36px)' }}>
            {formatMoney(price)}
          </p>

          {/* Countdown */}
          <div className="mb-10">
            <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/28 mb-3">
              Available for
            </p>
            <p
              className={cn(
                'font-sans font-light tracking-[0.06em] tabular-nums transition-colors duration-700',
                isUrgent ? 'text-[#B5121B]' : 'text-white/80'
              )}
              style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
            >
              {display}
            </p>
          </div>

          <MischiefButton
            href={getProductUrl(product.handle)}
            label="Shop This Drop"
          />
        </ScrollReveal>
      </div>
    </section>
  )
}
