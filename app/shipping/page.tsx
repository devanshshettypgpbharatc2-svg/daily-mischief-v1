import type { Metadata } from 'next'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'

export const metadata: Metadata = {
  title: 'Shipping — The Daily Mischief',
  description: 'Delivery information for The Daily Mischief orders.',
}

const SECTIONS = [
  {
    title: 'Delivery times',
    items: [
      { label: 'Standard (India)', value: '3–5 business days' },
      { label: 'Express (India)', value: '1–2 business days' },
      { label: 'International', value: '7–14 business days' },
    ],
  },
  {
    title: 'Shipping rates',
    items: [
      { label: 'India — orders under ₹2,000', value: '₹99' },
      { label: 'India — orders over ₹2,000', value: 'Free' },
      { label: 'International — flat rate', value: '₹999' },
    ],
  },
  {
    title: 'Order cut-off',
    items: [
      { label: 'Same-day dispatch', value: 'Orders placed before 2:00 PM IST' },
      { label: 'Processing time', value: '1 business day' },
      { label: 'Tracking', value: 'Emailed once dispatched' },
    ],
  },
]

export default function ShippingPage() {
  return (
    <>
      <Nav />
      <CartDrawer />
      <main className="min-h-screen pt-16 md:pt-[72px]">
        <header className="px-5 md:px-10 pt-20 md:pt-28 pb-14 border-b border-white/[0.08]">
          <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#B5121B] mb-6">Information</p>
          <h1 className="font-serif text-[clamp(36px,6vw,72px)] font-light leading-[0.95] tracking-tight">Shipping</h1>
        </header>
        <section className="px-5 md:px-10 py-14 md:py-20 max-w-2xl">
          <div className="space-y-12">
            {SECTIONS.map((s) => (
              <div key={s.title}>
                <h2 className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/40 mb-6">{s.title}</h2>
                <div className="space-y-4">
                  {s.items.map((item) => (
                    <div key={item.label} className="flex items-baseline justify-between border-b border-white/[0.06] pb-4">
                      <span className="font-sans text-[12px] text-white/50">{item.label}</span>
                      <span className="font-sans text-[12px] text-white/80">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <p className="font-sans text-[11px] leading-[1.9] text-white/30">
              All orders are dispatched from Mumbai. Once your order ships, you'll receive a tracking link via email. For questions, contact us at{' '}
              <a href="mailto:orders@thedailymischief.store" className="text-white/50 hover:text-white transition-colors underline underline-offset-2">
                orders@thedailymischief.store
              </a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
