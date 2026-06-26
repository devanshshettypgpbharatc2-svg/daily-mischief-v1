import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { MischiefButton } from '@/components/ui/Buttons'
import { getCollectionByHandle } from '@/lib/shopify'
import { formatMoney, getShopifyImageUrl, getProductUrl } from '@/utils'
import type { Product } from '@/types'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'The Regret Tax — The Daily Mischief',
  description:
    'You had 24 hours. You hesitated. These pieces are still available — just not at the price they deserved.',
}

function RegretCard({ product, index }: { product: Product; index: number }) {
  const firstImage = product.images[0]
  const secondImage = product.images[1]
  const variant = product.variants[0]
  const currentPrice = variant?.price ?? product.priceRange.min
  const originalPrice = variant?.compareAtPrice ?? null
  const regretAmount =
    originalPrice ? currentPrice.amount - originalPrice.amount : null

  return (
    <ScrollReveal delay={(index % 3) * 0.08} y={24}>
      <Link
        href={getProductUrl(product.handle)}
        className="group block"
        aria-label={product.title}
      >
        {/* Image */}
        <div className="relative overflow-hidden aspect-[3/4] bg-[#0d0607]">
          {firstImage ? (
            <>
              <Image
                src={getShopifyImageUrl(firstImage.url, 800)}
                alt={firstImage.alt || product.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={index < 3}
                className={`object-cover transition-all duration-700 ${
                  secondImage ? 'group-hover:opacity-0' : 'group-hover:scale-[1.04]'
                }`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
              />
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

          {/* Regret tax badge */}
          {regretAmount !== null && regretAmount > 0 && (
            <div className="absolute top-3 left-3 z-10 bg-[#B5121B] px-2 py-1">
              <span className="font-sans text-[8px] tracking-[0.25em] uppercase text-white">
                +{formatMoney({ ...currentPrice, amount: regretAmount })} regret tax
              </span>
            </div>
          )}

          {/* View Piece bar */}
          <div
            className="absolute bottom-0 left-0 right-0 py-3.5 bg-[#111111]/92 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-500"
            style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
            aria-hidden="true"
          >
            <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-white/80 text-center">
              Pay the Tax
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="pt-3 border-t border-white/[0.07]">
          <div className="flex items-start justify-between gap-3">
            <p className="font-serif text-[15px] font-light text-white leading-snug group-hover:text-white/75 transition-colors duration-300 truncate flex-1">
              {product.title}
            </p>
            <div className="flex-shrink-0 text-right">
              {originalPrice && (
                <p className="font-sans text-[10px] text-white/35 line-through leading-none mb-0.5">
                  {formatMoney(originalPrice)}
                </p>
              )}
              <p className="font-serif text-[14px] font-light text-[#B5121B]">
                {formatMoney(currentPrice)}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </ScrollReveal>
  )
}

export default async function RegretTaxPage() {
  const collection = await getCollectionByHandle('regret-tax', { first: 24 })

  return (
    <>
      <Nav />
      <CartDrawer />
      <main className="min-h-screen pt-16 md:pt-[72px]">

        {/* Header */}
        <header className="px-5 md:px-10 pt-16 md:pt-24 pb-16 md:pb-20 border-b border-white/[0.08] max-w-5xl">
          <ScrollReveal y={16}>
            <p className="font-sans text-[9px] tracking-[0.5em] uppercase text-[#B5121B] mb-8">
              The Regret Tax
            </p>
          </ScrollReveal>

          <ScrollReveal y={24} delay={0.06}>
            <h1
              className="font-serif font-light text-white leading-[0.92] tracking-tight mb-10"
              style={{ fontSize: 'clamp(36px, 7vw, 96px)' }}
            >
              You had<br />
              24 hours.
            </h1>
          </ScrollReveal>

          <ScrollReveal y={16} delay={0.12}>
            <p className="font-sans text-[12px] leading-[2] text-white/45 max-w-lg mb-6">
              Every piece in The Daily Mischief has a window. Twenty-four hours
              at its lowest price. After that, it doesn&apos;t disappear — it just
              costs what hesitation is worth.
            </p>
            <p className="font-sans text-[12px] leading-[2] text-white/45 max-w-lg">
              This is the Regret Tax. The difference between what you paid and
              what you could have. It&apos;s not a punishment. It&apos;s just the price
              of waiting.
            </p>
          </ScrollReveal>

          {/* Tax formula */}
          <ScrollReveal y={12} delay={0.18}>
            <div className="mt-12 inline-flex items-center gap-4 border border-white/[0.08] px-6 py-4">
              <span className="font-serif italic text-[13px] text-white/40">Drop price</span>
              <span className="font-sans text-[10px] text-white/20">+</span>
              <span className="font-serif italic text-[13px] text-[#B5121B]">Regret</span>
              <span className="font-sans text-[10px] text-white/20">=</span>
              <span className="font-serif italic text-[13px] text-white/60">What you pay now</span>
            </div>
          </ScrollReveal>
        </header>

        {/* Products */}
        <section className="px-5 md:px-10 py-12 md:py-16">
          {!collection || collection.products.length === 0 ? (
            <div className="py-32 text-center max-w-lg mx-auto">
              <ScrollReveal>
                <p className="font-sans text-[9px] tracking-[0.5em] uppercase text-[#B5121B] mb-8">
                  Nothing here yet
                </p>
                <p
                  className="font-serif italic font-light text-white/30 leading-[1.1] mb-10"
                  style={{ fontSize: 'clamp(24px, 4vw, 48px)' }}
                >
                  No past drops.<br />
                  Check back tomorrow.
                </p>
                <p className="font-sans text-[11px] leading-[1.9] text-white/25 mb-10">
                  Every midnight, today&apos;s piece moves here. The regret tax begins.
                </p>
                <MischiefButton
                  href="/shop/collections/todays-mischief"
                  label="Buy Before the Tax Applies"
                />
              </ScrollReveal>
            </div>
          ) : (
            <>
              <ScrollReveal>
                <div className="flex items-center justify-between mb-8 pb-5 border-b border-white/[0.06]">
                  <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/25">
                    {collection.products.length} past {collection.products.length === 1 ? 'drop' : 'drops'}
                  </p>
                  <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/20">
                    All prices include regret tax
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-[2px]">
                {collection.products.map((product, i) => (
                  <RegretCard key={product.id} product={product} index={i} />
                ))}
              </div>
            </>
          )}
        </section>

        {/* Bottom CTA */}
        <section className="border-t border-white/[0.08] px-5 md:px-10 py-16 md:py-20 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <ScrollReveal>
            <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/25 mb-3">
              Avoid the tax
            </p>
            <p
              className="font-serif font-light text-white leading-[1.1]"
              style={{ fontSize: 'clamp(22px, 3vw, 40px)' }}
            >
              Tomorrow&apos;s drop.<br />
              No regrets.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <MischiefButton
              href="/shop/collections/todays-mischief"
              label="Today's Mischief"
            />
          </ScrollReveal>
        </section>

      </main>
      <Footer />
    </>
  )
}
