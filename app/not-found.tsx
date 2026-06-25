import Link from 'next/link'
import { Nav } from '@/components/layout/Nav'
import { CartDrawer } from '@/components/cart/CartDrawer'

export default function NotFound() {
  return (
    <>
      <Nav />
      <CartDrawer />
      <main className="min-h-screen flex items-center justify-center px-5 pt-16">
        <div className="text-center max-w-xl">
          <div className="mb-10 flex justify-center" aria-hidden="true">
            <svg viewBox="0 0 200 280" className="w-24 opacity-20" xmlns="http://www.w3.org/2000/svg">
              <rect x="60" y="30" width="80" height="160" rx="2" fill="white"/>
              <rect x="48" y="30" width="15" height="95" rx="2" fill="white"/>
              <rect x="137" y="30" width="15" height="95" rx="2" fill="white"/>
              <ellipse cx="100" cy="70" rx="28" ry="34" fill="#111111"/>
              <rect x="70" y="104" width="60" height="80" rx="1" fill="#111111"/>
              <line x1="100" y1="190" x2="100" y2="230" stroke="#111111" strokeWidth="8"/>
              <ellipse cx="100" cy="240" rx="25" ry="12" fill="#111111" opacity="0.7"/>
            </svg>
          </div>
          <h1 className="font-serif italic text-[clamp(22px,4vw,40px)] font-light text-white/80 leading-tight mb-4">
            This one left without saying goodbye.
          </h1>
          <p className="font-sans text-[11px] tracking-[0.1em] text-white/30 mb-10 leading-relaxed">
            The page you were looking for knew when to make an exit.
          </p>
          <div className="w-10 h-px bg-[#B5121B] mx-auto mb-10" aria-hidden="true" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="group relative inline-flex items-center justify-between gap-4 overflow-hidden border border-white/20 px-7 py-4 font-sans text-[10px] tracking-[0.28em] uppercase text-white hover:border-[#B5121B] transition-colors"
            >
              <span className="absolute inset-0 bg-[#B5121B] -translate-x-full group-hover:translate-x-0 transition-transform duration-[600ms]" style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }} aria-hidden="true" />
              <span className="relative z-10">Return to Mischief</span>
              <svg className="relative z-10" width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
                <path d="M8.5 1L13 5M13 5L8.5 9M13 5H1"/>
              </svg>
            </Link>
            <Link
              href="/shop/collections/wardrobe"
              className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/35 hover:text-white transition-colors flex items-center justify-center"
            >
              Browse the Wardrobe
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
