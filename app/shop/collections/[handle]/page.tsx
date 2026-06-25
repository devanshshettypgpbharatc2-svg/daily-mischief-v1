import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { ProductGrid } from '@/components/product/ProductCard'
import { getCollectionByHandle, getAllCollectionHandles } from '@/lib/shopify'

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

  return (
    <>
      <Nav />
      <CartDrawer />
      <main className="min-h-screen pt-16 md:pt-[72px]">
        {/* Header */}
        <header className="px-5 md:px-10 pt-12 md:pt-16 pb-10 md:pb-14 border-b border-white/[0.08]">
          <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#B5121B] mb-5">
            Collection
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h1 className="font-serif text-[clamp(36px,6vw,80px)] font-light leading-[0.95] tracking-tight">
              {collection.title}
            </h1>
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/25 md:pb-2">
              {collection.products.length} {collection.products.length === 1 ? 'piece' : 'pieces'}
            </p>
          </div>
          {collection.description && (
            <p className="font-sans text-[12px] leading-[1.85] text-white/40 mt-5 max-w-md">
              {collection.description}
            </p>
          )}
        </header>

        {/* Products */}
        <section className="px-5 md:px-10 py-10 md:py-14">
          {collection.products.length === 0 ? (
            <div className="py-32 text-center">
              <p className="font-serif italic text-[clamp(20px,3vw,32px)] font-light text-white/25 leading-tight mb-6">
                The {collection.title} collection<br />is between mischief.
              </p>
              <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-white/20">
                Check back soon
              </p>
            </div>
          ) : (
            <ProductGrid products={collection.products} />
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
