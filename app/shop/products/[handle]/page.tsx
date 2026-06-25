import { notFound, redirect } from 'next/navigation'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { AddToCartForm } from '@/components/product/AddToCartForm'
import { ProductCard } from '@/components/product/ProductCard'
import { getProductByHandle, getAllProductHandles, getProductRecommendations } from '@/lib/shopify'
import { getShopifyImageUrl, formatMoney } from '@/utils'
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

function ProductImages({ product }: { product: Product }) {
  if (!product.images.length) {
    return (
      <div className="aspect-[3/4] bg-[#0f0607]" />
    )
  }

  return (
    <div className="space-y-[2px]">
      {product.images.map((img, i) => (
        <div key={img.id} className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
          <Image
            src={getShopifyImageUrl(img.url, 1200)}
            alt={img.alt || product.title}
            fill
            priority={i === 0}
            quality={i === 0 ? 90 : 75}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  )
}

async function Recommendations({ productId }: { productId: string }) {
  const recs = await getProductRecommendations(productId)
  if (!recs.length) return null
  return (
    <section className="px-5 md:px-10 py-section-md border-t border-white/[0.08]">
      <h2 className="font-serif text-[clamp(20px,2.5vw,30px)] font-light mb-10">More Mischief</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px]">
        {recs.map((p, i) => <ProductCard key={p.id} product={p} priority={false} />)}
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <CartDrawer />
      <main className="min-h-screen pt-16 md:pt-[72px]">
        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Images */}
          <div className="lg:sticky lg:top-[72px] lg:self-start">
            <ProductImages product={product} />
          </div>

          {/* Info */}
          <div className="px-5 md:px-10 py-10 md:py-14 lg:py-16 flex flex-col gap-8">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb">
              <p className="font-sans text-[9px] tracking-[0.25em] uppercase text-white/30">
                <Link href="/shop/collections/wardrobe" className="hover:text-white transition-colors">
                  Wardrobe
                </Link>
                <span className="mx-2 text-white/15">→</span>
                <span className="text-white/50">{product.title}</span>
              </p>
            </nav>

            {/* Title and price */}
            <div>
              <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#B5121B] mb-4 flex items-center gap-3">
                <span className="w-5 h-px bg-[#B5121B]" aria-hidden="true" />
                {product.type || 'The Collection'}
              </p>
              <h1 className="font-serif text-[clamp(26px,4vw,48px)] font-light leading-[1.08] tracking-tight mb-5">
                {product.title}
              </h1>

              {/* Price */}
              <div className="mb-6">
                <p className="font-serif text-[28px] md:text-[32px] font-light">
                  {showPriceRange
                    ? `${formatMoney(product.priceRange.min)} – ${formatMoney(product.priceRange.max)}`
                    : formatMoney(firstVariant?.price ?? product.priceRange.min)
                  }
                </p>
                {firstVariant?.compareAtPrice && (
                  <p className="font-serif text-[16px] font-light text-white/40 line-through mt-1">
                    {formatMoney(firstVariant.compareAtPrice)}
                  </p>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="font-sans text-[12px] leading-[1.9] text-white/55 max-w-sm">
                  {product.description}
                </p>
              )}
            </div>

            {/* Add to cart */}
            <AddToCartForm product={product} />

            {/* Specs */}
            <div className="pt-8 border-t border-white/[0.08]">
              <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-white/25 mb-5">
                Specifications
              </p>
              <div className="space-y-3">
                {product.vendor && (
                  <div className="flex justify-between items-baseline">
                    <span className="font-sans text-[10px] tracking-[0.1em] text-white/30">Vendor</span>
                    <span className="font-sans text-[10px] tracking-[0.1em] text-white/60">{product.vendor}</span>
                  </div>
                )}
                {product.type && (
                  <div className="flex justify-between items-baseline">
                    <span className="font-sans text-[10px] tracking-[0.1em] text-white/30">Type</span>
                    <span className="font-sans text-[10px] tracking-[0.1em] text-white/60">{product.type}</span>
                  </div>
                )}
                {product.tags.slice(0, 4).map(tag => {
                  const [key, val] = tag.includes(':') ? tag.split(':') : [tag, null]
                  if (!val) return null
                  return (
                    <div key={tag} className="flex justify-between items-baseline">
                      <span className="font-sans text-[10px] tracking-[0.1em] text-white/30 capitalize">{key.trim()}</span>
                      <span className="font-sans text-[10px] tracking-[0.1em] text-white/60 capitalize">{val.trim()}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Shipping note */}
            <div className="border border-white/[0.06] px-5 py-4">
              <p className="font-sans text-[10px] tracking-[0.08em] text-white/35 leading-[1.7]">
                3–5 days. Worth the wait. Free UK delivery on orders over £200.<br />
                Changed your mind? 14 days. No questions.
              </p>
            </div>
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
