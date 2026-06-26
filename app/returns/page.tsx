import type { Metadata } from 'next'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'

export const metadata: Metadata = {
  title: 'Returns — The Daily Mischief',
  description: 'Return and exchange policy for The Daily Mischief.',
}

export default function ReturnsPage() {
  return (
    <>
      <Nav />
      <CartDrawer />
      <main className="min-h-screen pt-16 md:pt-[72px]">
        <header className="px-5 md:px-10 pt-20 md:pt-28 pb-14 border-b border-white/[0.08]">
          <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#B5121B] mb-6">Information</p>
          <h1 className="font-serif text-[clamp(36px,6vw,72px)] font-light leading-[0.95] tracking-tight">Returns</h1>
        </header>
        <section className="px-5 md:px-10 py-14 md:py-20 max-w-2xl space-y-10">
          {[
            {
              heading: '14-day returns',
              body: 'Changed your mind? You have 14 days from the delivery date to return any item in its original, unworn condition with tags attached. No questions asked.',
            },
            {
              heading: 'How to return',
              body: 'Email us at returns@thedailymischief.store with your order number and the item(s) you wish to return. We\'ll send you a prepaid return label within 24 hours.',
            },
            {
              heading: 'Refunds',
              body: 'Once we receive and inspect your return, we\'ll process your refund within 3–5 business days. Refunds are issued to your original payment method.',
            },
            {
              heading: 'Exchanges',
              body: 'We don\'t offer direct exchanges. Return the item for a refund and place a new order. Given our 24-hour drops, this is the quickest way to get the right size.',
            },
            {
              heading: 'Non-returnable items',
              body: 'Mystery Boxes, sale items marked as final sale, and items that have been worn, washed, or damaged cannot be returned.',
            },
          ].map((s) => (
            <div key={s.heading} className="border-t border-white/[0.08] pt-8">
              <h2 className="font-serif text-[18px] font-light mb-3">{s.heading}</h2>
              <p className="font-sans text-[12px] leading-[1.9] text-white/45">{s.body}</p>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </>
  )
}
