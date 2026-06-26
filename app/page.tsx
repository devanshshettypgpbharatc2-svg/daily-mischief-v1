import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { CinematicHero } from '@/components/home/CinematicHero'
import { TodaysDrop } from '@/components/home/TodaysDrop'
import { PhilosophySection } from '@/components/home/PhilosophySection'
import { CollectionCards } from '@/components/home/CollectionCards'
import { JournalSection } from '@/components/home/JournalSection'
import { ManifestoSection } from '@/components/home/ManifestoSection'
import { getCollectionByHandle } from '@/lib/shopify'

export const metadata: Metadata = {
  title: 'The Daily Mischief',
  description: 'One piece. Every day. 24 hours at its lowest price.',
}

export const revalidate = 3600

async function TodaysDropServer() {
  const collection = await getCollectionByHandle('todays-mischief', { first: 1 })
  const product = collection?.products[0] ?? null
  return <TodaysDrop product={product} />
}

export default async function HomePage() {
  return (
    <>
      <Nav />
      <CartDrawer />
      <main>
        <CinematicHero />

        <Suspense fallback={<div className="min-h-screen border-t border-white/[0.06] bg-[#111111]" />}>
          <TodaysDropServer />
        </Suspense>

        <PhilosophySection />
        <CollectionCards />
        <JournalSection />
        <ManifestoSection />
      </main>
      <Footer />
    </>
  )
}