import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { ProductCard } from '@/components/product/ProductCard'
import { getCollectionByHandle } from '@/lib/shopify'
import { getShopifyImageUrl } from '@/utils'

export const metadata: Metadata = {
  title: 'The Daily Mischief',
  description: 'One piece. Every day. 24 hours at its lowest price.',
}

export const revalidate = 3600

async function HeroProduct() {
  const collection = await getCollectionByHandle('todays-mischief', { first: 1 })
  const product = collection?.products[0]

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center px-5">
          <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#B5121B] mb-6">SS 2025</p>
          <h1 className="font-serif text-[clamp(52px,8vw,110px)] font-light leading-[0.92] tracking-tight text-white mb-8">
            Dressed for the<br />Wrong Occasion.
          </h1>
          <p className="font-sans text-[11px] tracking-[0.1em] text-white/55 mb-10">
            One piece. Every day. 24 hours.
          </p>
          <Link
            href="/shop/collections/wardrobe"
            className="group relative inline-flex items-center justify-between gap-4 overflow-hidden border border-white/20 px-7 py-4 font-sans text-[10px] tracking-[0.28em] uppercase text-white hover:border-[#B5121B] transition-colors"
          >
            <span className="absolute inset-0 bg-[#B5121B] -translate-x-full group-hover:translate-x-0 transition-transform duration-[600ms]" style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }} aria-hidden="true" />
            <span className="relative z-10">Explore the Wardrobe</span>
            <svg className="relative z-10" width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
              <path d="M8.5 1L13 5M13 5L8.5 9M13 5H1"/>
            </svg>
          </Link>
        </div>
      </div>
    )
  }

  const heroImage = product.images[0]

  return (
    <section className="relative min-h-screen flex flex-col justify-end pb-10 md:pb-14 px-5 md:px-10 overflow-hidden">
      {/* Background image */}
      {heroImage && (
        <div className="absolute inset-0">
          <Image
            src={getShopifyImageUrl(heroImage.url, 1600)}
            alt={heroImage.alt || product.title}
            fill
            priority
            quality={90}
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent" />
        </div>
      )}
      {!heroImage && <div className="absolute inset-0 bg-[#111111]" />}

      {/* Content */}
      <div className="relative z-10">
        <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#B5121B] mb-6">
          Today's Mischief — SS 2025
        </p>
        <h1 className="font-serif text-[clamp(40px,7vw,96px)] font-light leading-[0.92] tracking-tight text-white mb-5 max-w-3xl">
          {product.title}
        </h1>
        {product.description && (
          <p className="font-sans text-[11px] tracking-[0.08em] text-white/55 max-w-sm mb-10 leading-relaxed">
            {product.description.slice(0, 120)}{product.description.length > 120 ? '…' : ''}
          </p>
        )}
        <Link
          href={`/shop/products/${product.handle}`}
          className="group relative inline-flex items-center justify-between gap-4 overflow-hidden border border-white/20 px-7 py-4 font-sans text-[10px] tracking-[0.28em] uppercase text-white hover:border-[#B5121B] transition-colors"
        >
          <span className="absolute inset-0 bg-[#B5121B] -translate-x-full group-hover:translate-x-0 transition-transform duration-[600ms]" style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }} aria-hidden="true" />
          <span className="relative z-10">Cause A Little Mischief</span>
          <svg className="relative z-10" width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
            <path d="M8.5 1L13 5M13 5L8.5 9M13 5H1"/>
          </svg>
        </Link>
      </div>

      {/* Footer bar */}
      <div className="relative z-10 flex items-center justify-between mt-10 pt-5 border-t border-white/[0.12]">
        <p className="font-sans text-[9px] tracking-[0.25em] uppercase text-white/30">
          Where the hell did you find this?
        </p>
        <div className="flex items-center gap-3">
          <div className="w-8 h-px bg-white/25 relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-full bg-white animate-[scrollLine_2.4s_ease-in-out_infinite]" />
          </div>
          <span className="font-sans text-[9px] tracking-[0.25em] uppercase text-white/30">Scroll</span>
        </div>
      </div>
    </section>
  )
}

async function FeaturedCollection() {
  const collection = await getCollectionByHandle('wardrobe', { first: 6 })
  if (!collection?.products.length) return null

  return (
    <section className="py-section-md px-5 md:px-10">
      <div className="flex items-baseline justify-between mb-14 pb-6 border-b border-white/[0.08]">
        <h2 className="font-serif text-[clamp(22px,3vw,36px)] font-light">The Wardrobe</h2>
        <Link href="/shop/collections/wardrobe" className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors flex items-center gap-2">
          View all
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
            <path d="M7 1L11 4M11 4L7 7M11 4H1"/>
          </svg>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-[2px]">
        {collection.products.slice(0, 6).map((p, i) => (
          <ProductCard key={p.id} product={p} priority={i < 2} />
        ))}
      </div>
    </section>
  )
}

export default async function HomePage() {
  return (
    <>
      <Nav />
      <CartDrawer />
      <main>
        {/* Hero */}
        <Suspense fallback={<div className="h-screen bg-[#111111]" />}>
          <HeroProduct />
        </Suspense>

        {/* Marquee */}
        <div className="border-t border-b border-white/[0.08] py-5 overflow-hidden" aria-hidden="true">
          <div className="flex whitespace-nowrap animate-[marquee_28s_linear_infinite]">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className="inline-flex gap-12 mr-12">
                {['The Daily Mischief', 'SS 2025', 'Dressed for the wrong occasion', 'Where did you find this', 'Premium Mischief', 'Against the ordinary'].map(t => (
                  <span key={t} className="font-serif italic text-[14px] font-light text-white/22 tracking-wide">
                    {t} <span className="text-[#B5121B]">◆</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* Editorial intro */}
        <section className="py-section-md px-5 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
          <div>
            <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#B5121B] mb-10">
              Manifesto — 001
            </p>
            <blockquote className="font-serif italic text-[clamp(22px,3vw,40px)] font-light leading-[1.2]">
              "We don't make clothes. We make the reason someone stops you on the street."
            </blockquote>
          </div>
          <div className="md:pt-16">
            <div className="w-12 h-px bg-[#B5121B] mb-8" />
            <p className="font-sans text-[12px] leading-[1.9] text-white/55 mb-5">
              Every piece in the Mischief Collection is an act of quiet defiance. Designed for the person who walks into a room and makes it recalibrate.
            </p>
            <p className="font-sans text-[12px] leading-[1.9] text-white/55 mb-8">
              No logos. No noise. Just something you can't quite place — but can't stop looking at.
            </p>
            <Link href="/about" className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/40 hover:text-white transition-colors flex items-center gap-2">
              Read our story
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
                <path d="M7 1L11 4M11 4L7 7M11 4H1"/>
              </svg>
            </Link>
          </div>
        </section>

        {/* Featured collection */}
        <Suspense fallback={<div className="h-64 bg-[#111111]" />}>
          <FeaturedCollection />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
