import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { CollectionFilters } from '@/components/collection/CollectionFilters'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { getCollectionByHandle, getAllCollectionHandles } from '@/lib/shopify'
import { getShopifyImageUrl } from '@/utils'

export const revalidate = 3600

export async function generateStaticParams() {
  const handles = await getAllCollectionHandles()
  return handles.map(handle => ({ handle }))
}

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const collection = await getCollectionByHandle(params.handle)
  if (!collection) return {}
  return {
    title: collection.seo.title || collection.title,
    description: collection.seo.description || collection.description,
    openGraph: {
      title: collection.seo.title || collection.title,
      description: collection.seo.description || collection.description,
      images: collection.image ? [{ url: collection.image.url }] : [],
    },
  }
}

export default async function CollectionPage({ params }: { params: { handle: string } }) {
  const collection = await getCollectionByHandle(params.handle, { first: 24 })
  if (!collection) notFound()

  const hasImage = !!collection.image

  return (
    <>
      <Nav />
      <CartDrawer />
      <main className="min-h-screen pt-16 md:pt-[72px]">

        {/* Header — cinematic if image exists, editorial text if not */}
        {hasImage ? (
          <header className="relative h-[55vh] md:h-[65vh] overflow-hidden flex items-end">
            <Image
              src={getShopifyImageUrl(collection.image!.url, 1600)}
              alt={collection.image!.alt || collection.title}
              fill
              priority
              sizes="100vw"
              quality={85}
              className="object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(17,17,17,0.92) 0%, rgba(17,17,17,0.35) 55%, rgba(17,17,17,0.12) 100%)',
              }}
            />
            <div className="relative z-10 px-5 md:px-10 pb-10 md:pb-14 w-full">
              <ScrollReveal y={16}>
                <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#B5121B] mb-4">
                  Collection
                </p>
              </ScrollReveal>
              <ScrollReveal y={20} delay={0.06}>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                  <h1 className="font-serif text-[clamp(36px,6vw,80px)] font-light leading-[0.95] tracking-tight text-white">
                    {collection.title}
                  </h1>
                  <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/35 md:pb-1">
                    {collection.products.length}{' '}
                    {collection.products.length === 1 ? 'piece' : 'pieces'}
                  </p>
                </div>
              </ScrollReveal>
              {collection.description && (
                <ScrollReveal y={16} delay={0.1}>
                  <p className="font-sans text-[12px] leading-[1.85] text-white/45 mt-4 max-w-md">
                    {collection.description}
                  </p>
                </ScrollReveal>
              )}
            </div>
          </header>
        ) : (
          <header className="px-5 md:px-10 pt-12 md:pt-16 pb-10 md:pb-14 border-b border-white/[0.08]">
            <ScrollReveal y={16}>
              <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#B5121B] mb-5">
                Collection
              </p>
            </ScrollReveal>
            <ScrollReveal y={20} delay={0.06}>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <h1 className="font-serif text-[clamp(36px,6vw,80px)] font-light leading-[0.95] tracking-tight">
                  {collection.title}
                </h1>
                <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/25 md:pb-2">
                  {collection.products.length}{' '}
                  {collection.products.length === 1 ? 'piece' : 'pieces'}
                </p>
              </div>
            </ScrollReveal>
            {collection.description && (
              <ScrollReveal y={16} delay={0.1}>
                <p className="font-sans text-[12px] leading-[1.85] text-white/40 mt-5 max-w-md">
                  {collection.description}
                </p>
              </ScrollReveal>
            )}
          </header>
        )}

        {/* Products + sort */}
        <section className="px-5 md:px-10 py-10 md:py-14">
          {collection.products.length === 0 ? (
            <div className="py-32 text-center">
              <p className="font-serif italic text-[clamp(20px,3vw,32px)] font-light text-white/25 leading-tight mb-6">
                The {collection.title} collection
                <br />
                is between mischief.
              </p>
              <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-white/20">
                Check back soon
              </p>
            </div>
          ) : (
            <CollectionFilters products={collection.products} />
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
