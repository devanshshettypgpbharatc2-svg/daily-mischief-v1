import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { AddToCartForm } from '@/components/product/AddToCartForm'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductGallery } from '@/components/product/ProductGallery'
import { AccordionItem } from '@/components/ui/Accordion'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { getProductByHandle, getAllProductHandles, getProductRecommendations } from '@/lib/shopify'
import { formatMoney } from '@/utils'
import type { Product } from '@/types'

export const revalidate = 3600

export async function generateStaticParams() {
  const handles = await getAllProductHandles()
  return handles.map(handle => ({ handle }))
}

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const product = await getProductByHandle(params.handle)
  if (!product) return {}
  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    openGraph: {
      title: product.seo.title || product.title,
      description: product.seo.description,
      images: product.images[0] ? [{ url: product.images[0].url, alt: product.images[0].alt }] : [],
    },
  }
}

async function Recommendations({ productId }: { productId: string }) {
  const recs = await getProductRecommendations(productId)
  if (!recs.length) return null
  return (
    <section className="px-5 md:px-10 py-section-md border-t border-white/[0.08]">
      <ScrollReveal>
        <h2 className="font-serif text-[clamp(20px,2.5vw,30px)] font-light mb-10">
          More Mischief
        </h2>
      </ScrollReveal>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px]">
        {recs.map((p, i) => (
          <ProductCard key={p.id} product={p} priority={false} index={i} />
        ))}
      </div>
    </section>
  )
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProductByHandle(params.handle)
  if (!product) notFound()

  const firstVariant = product.variants[0]
  const showPriceRange = product.priceRange.min.amount !== product.priceRange.max.amount

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images[0]?.url,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop/products/${product.handle}`,
    offers: product.variants.map(v => ({
      '@type': 'Offer',
      price: v.price.amount,
      priceCurrency: v.price.currencyCode,
      availability: v.available
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      sku: v.sku,
    })),
  }

  // Build tag key-value pairs for accordion
  const tagPairs = product.tags
    .slice(0, 6)
    .map(tag => (tag.includes(':') ? tag.split(':') : [tag, null]))
    .filter((pair): pair is [string, string] => pair[1] !== null)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <CartDrawer />
      <main className="min-h-screen pt-16 md:pt-[72px]">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Gallery — sticky on desktop */}
          <div className="lg:sticky lg:top-[72px] lg:self-start lg:max-h-[calc(100vh-72px)] overflow-hidden">
            <ProductGallery product={product} />
          </div>

          {/* Info panel */}
          <div className="px-5 md:px-10 py-10 md:py-14 lg:py-16 flex flex-col gap-8 pb-24 md:pb-14">
            {/* Breadcrumb */}
            <ScrollReveal y={16}>
              <nav aria-label="Breadcrumb">
                <p className="font-sans text-[9px] tracking-[0.25em] uppercase text-white/30">
                  <Link
                    href={`/shop/collections/${product.type?.toLowerCase().replace(/\s+/g, '-') || 'wardrobe'}`}
                    className="hover:text-white transition-colors duration-300"
                  >
                    {product.type || 'Wardrobe'}
                  </Link>
                  <span className="mx-2 text-white/15">→</span>
                  <span className="text-white/50">{product.title}</span>
                </p>
              </nav>
            </ScrollReveal>

            {/* Title + price */}
            <div>
              <ScrollReveal y={20} delay={0.05}>
                <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#B5121B] mb-4 flex items-center gap-3">
                  <span className="w-5 h-px bg-[#B5121B]" aria-hidden="true" />
                  {product.type || 'The Collection'}
                </p>
              </ScrollReveal>

              <ScrollReveal y={20} delay={0.1}>
                <h1 className="font-serif text-[clamp(26px,4vw,52px)] font-light leading-[1.06] tracking-tight mb-6">
                  {product.title}
                </h1>
              </ScrollReveal>

              <ScrollReveal y={16} delay={0.14}>
                <div className="mb-6">
                  <p className="font-serif text-[28px] md:text-[34px] font-light leading-none">
                    {showPriceRange
                      ? `${formatMoney(product.priceRange.min)} – ${formatMoney(product.priceRange.max)}`
                      : formatMoney(firstVariant?.price ?? product.priceRange.min)
                    }
                  </p>
                  {firstVariant?.compareAtPrice && (
                    <p className="font-sans text-[13px] font-light text-white/35 line-through mt-2">
                      {formatMoney(firstVariant.compareAtPrice)}
                    </p>
                  )}
                </div>
              </ScrollReveal>

              {product.description && (
                <ScrollReveal y={16} delay={0.18}>
                  <p className="font-sans text-[12px] leading-[1.92] text-white/50 max-w-sm">
                    {product.description}
                  </p>
                </ScrollReveal>
              )}
            </div>

            {/* Add to cart */}
            <ScrollReveal y={16} delay={0.22}>
              <AddToCartForm product={product} />
            </ScrollReveal>

            {/* Accordion sections */}
            <ScrollReveal y={12} delay={0.26}>
              <div className="border-b border-white/[0.08]">
                {/* The Details */}
                {(tagPairs.length > 0 || product.vendor || product.type) && (
                  <AccordionItem label="The Details" defaultOpen>
                    <div className="space-y-3">
                      {product.vendor && (
                        <div className="flex justify-between items-baseline">
                          <span className="font-sans text-[10px] tracking-[0.1em] text-white/28">Vendor</span>
                          <span className="font-sans text-[10px] tracking-[0.1em] text-white/55">{product.vendor}</span>
                        </div>
                      )}
                      {product.type && (
                        <div className="flex justify-between items-baseline">
                          <span className="font-sans text-[10px] tracking-[0.1em] text-white/28">Type</span>
                          <span className="font-sans text-[10px] tracking-[0.1em] text-white/55">{product.type}</span>
                        </div>
                      )}
                      {tagPairs.map(([key, val]) => (
                        <div key={key} className="flex justify-between items-baseline">
                          <span className="font-sans text-[10px] tracking-[0.1em] text-white/28 capitalize">
                            {key.trim()}
                          </span>
                          <span className="font-sans text-[10px] tracking-[0.1em] text-white/55 capitalize">
                            {val.trim()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </AccordionItem>
                )}

                {/* Care & Composition */}
                <AccordionItem label="Care & Composition">
                  <div className="space-y-2">
                    <p className="font-sans text-[11px] leading-[1.85] text-white/40">
                      Handle with the same level of attention you give your most considered decisions.
                    </p>
                    <p className="font-sans text-[11px] leading-[1.85] text-white/40">
                      Cold wash. Lay flat to dry. No tumble drying. Iron inside out on low.
                    </p>
                    <p className="font-sans text-[11px] leading-[1.85] text-white/40">
                      Composition details are printed on the interior label.
                    </p>
                  </div>
                </AccordionItem>

                {/* Delivery & Returns */}
                <AccordionItem label="Delivery & Returns">
                  <div className="space-y-2">
                    <p className="font-sans text-[11px] leading-[1.85] text-white/40">
                      3–5 business days. Worth the wait.
                    </p>
                    <p className="font-sans text-[11px] leading-[1.85] text-white/40">
                      Free delivery on orders over £200.
                    </p>
                    <p className="font-sans text-[11px] leading-[1.85] text-white/40">
                      Changed your mind? 14 days. No questions asked.
                    </p>
                  </div>
                </AccordionItem>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Recommendations */}
        <Suspense fallback={<div className="h-32" />}>
          <Recommendations productId={product.id} />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
