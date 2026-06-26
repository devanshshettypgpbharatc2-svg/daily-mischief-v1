import type { Metadata } from 'next'
import Link from 'next/link'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'

export const metadata: Metadata = {
  title: 'About — The Daily Mischief',
  description: 'We don't make clothes. We make the reason someone stops you on the street.',
}

export default function AboutPage() {
  return (
    <>
      <Nav />
      <CartDrawer />
      <main className="min-h-screen pt-16 md:pt-[72px]">
        {/* Hero */}
        <section className="px-5 md:px-10 pt-20 md:pt-28 pb-16 md:pb-20 border-b border-white/[0.08]">
          <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#B5121B] mb-8">
            About — 001
          </p>
          <h1 className="font-serif text-[clamp(40px,7vw,96px)] font-light leading-[0.92] tracking-tight max-w-4xl">
            We don't make clothes.<br />
            We make the reason<br />
            someone stops you<br />
            on the street.
          </h1>
        </section>

        {/* Story */}
        <section className="px-5 md:px-10 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 border-b border-white/[0.08]">
          <div>
            <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#B5121B] mb-8">
              The Origin
            </p>
            <p className="font-serif italic text-[clamp(20px,2.5vw,30px)] font-light leading-[1.3] text-white/90">
              "We started with a single overshirt and a theory: that the best clothes are the ones you can't quite explain."
            </p>
          </div>
          <div className="space-y-5 md:pt-12">
            <p className="font-sans text-[12px] leading-[1.9] text-white/55">
              The Daily Mischief began as a quiet experiment. One piece, released every day, for 24 hours, at its lowest price. No restocks. No second chances. No noise.
            </p>
            <p className="font-sans text-[12px] leading-[1.9] text-white/55">
              We believed that scarcity wasn't a gimmick — it was respect. Respect for the people who actually pay attention. The ones who show up, choose deliberately, and wear things like they mean it.
            </p>
            <p className="font-sans text-[12px] leading-[1.9] text-white/55">
              Every piece we make starts with the same question: would we stop someone in the street to ask where they got this? If the answer is yes, we make it.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="px-5 md:px-10 py-16 md:py-24 border-b border-white/[0.08]">
          <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#B5121B] mb-12">
            What We Stand For
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            {[
              {
                num: '01',
                title: 'One piece, one day.',
                body: 'We release one item every 24 hours. After that, it\'s gone. This isn\'t a tactic — it\'s the only way we know how to make something feel like it matters.',
              },
              {
                num: '02',
                title: 'No logos. No noise.',
                body: 'We don\'t put our name on our clothes. The people who wear The Daily Mischief don\'t need a logo to announce themselves. Neither do we.',
              },
              {
                num: '03',
                title: 'Built to last.',
                body: 'We work with a small network of manufacturers who share our allergy to shortcuts. Every piece is made to exist for longer than a season.',
              },
            ].map((v) => (
              <div key={v.num} className="border-t border-white/[0.08] pt-8">
                <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/20 mb-5">{v.num}</p>
                <h3 className="font-serif text-[20px] font-light mb-4">{v.title}</h3>
                <p className="font-sans text-[12px] leading-[1.9] text-white/45">{v.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Numbers */}
        <section className="px-5 md:px-10 py-16 md:py-24 border-b border-white/[0.08]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { n: '2024', label: 'Founded' },
              { n: '1/day', label: 'Drops per day' },
              { n: '24h', label: 'To decide' },
              { n: '0', label: 'Restocks. Ever.' },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-serif text-[clamp(32px,4vw,56px)] font-light text-white mb-2">{s.n}</p>
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/30">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 md:px-10 py-16 md:py-24 flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
          <h2 className="font-serif text-[clamp(28px,4vw,52px)] font-light leading-[1.05] tracking-tight max-w-xl">
            Ready to cause a little<br />
            mischief?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/shop/collections/todays-mischief"
              className="group relative inline-flex items-center justify-between gap-4 overflow-hidden border border-white/20 px-7 py-4 font-sans text-[10px] tracking-[0.28em] uppercase text-white hover:border-[#B5121B] transition-colors"
            >
              <span className="absolute inset-0 bg-[#B5121B] -translate-x-full group-hover:translate-x-0 transition-transform duration-[600ms]" style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }} aria-hidden="true" />
              <span className="relative z-10">Today's Mischief</span>
              <svg className="relative z-10" width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
                <path d="M8.5 1L13 5M13 5L8.5 9M13 5H1" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-7 py-4 font-sans text-[10px] tracking-[0.28em] uppercase text-white/40 hover:text-white transition-colors"
            >
              Get in touch
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
