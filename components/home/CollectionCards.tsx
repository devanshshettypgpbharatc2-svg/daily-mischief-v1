'use client'

import Link from 'next/link'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const COLLECTIONS = [
  {
    index: '01',
    name: 'Wardrobe',
    handle: 'wardrobe',
    label: 'Ready to wear',
    description: 'The daily essentials. Pieces built for recurrence — not occasion.',
  },
  {
    index: '02',
    name: 'Home',
    handle: 'home',
    label: 'Interiors',
    description: 'Objects that change how a room feels before anyone notices them.',
  },
  {
    index: '03',
    name: 'Oddities',
    handle: 'oddities',
    label: 'Rare objects',
    description: 'The uncategorisable. Each piece is its own argument.',
  },
]

export function CollectionCards() {
  return (
    <section className="border-t border-white/[0.06]">
      {/* Header */}
      <div className="px-5 md:px-10 py-10 md:py-12 border-b border-white/[0.06]">
        <ScrollReveal>
          <p className="font-sans text-[9px] tracking-[0.5em] uppercase text-[#B5121B]">
            The Collections
          </p>
        </ScrollReveal>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3">
        {COLLECTIONS.map((col, i) => (
          <ScrollReveal key={col.handle} delay={i * 0.08}>
            <Link
              href={`/shop/collections/${col.handle}`}
              className="group block border-b md:border-b-0 md:border-r border-white/[0.06] last:border-r-0 px-8 md:px-10 lg:px-14 py-14 md:py-20 hover:bg-white/[0.015] transition-colors duration-500 h-full"
            >
              {/* Number + arrow */}
              <div className="flex items-start justify-between mb-10">
                <span className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/18">
                  {col.index}
                </span>
                <span className="font-sans text-[10px] text-[#B5121B] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-1 group-hover:translate-x-0 transition-transform">
                  →
                </span>
              </div>

              {/* Label */}
              <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/22 mb-5">
                {col.label}
              </p>

              {/* Collection name */}
              <h3
                className="font-serif font-light text-white uppercase tracking-[0.08em] leading-[0.9] mb-7 transition-colors duration-400 group-hover:text-white/65"
                style={{ fontSize: 'clamp(34px, 4vw, 58px)' }}
              >
                {col.name}
              </h3>

              {/* Description */}
              <p className="font-sans text-[11px] leading-[1.88] text-white/28 max-w-[210px] mb-8">
                {col.description}
              </p>

              {/* Animated underline */}
              <div className="w-8 h-px bg-white/14 transition-all duration-500 group-hover:w-14 group-hover:bg-[#B5121B]" />
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
