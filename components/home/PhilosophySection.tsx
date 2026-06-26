'use client'

import Link from 'next/link'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export function PhilosophySection() {
  return (
    <section className="border-t border-white/[0.06] py-section-lg px-5 md:px-10">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <p className="font-sans text-[9px] tracking-[0.5em] uppercase text-[#B5121B] mb-12">
            Manifesto — 001
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <blockquote
            className="font-serif italic font-light text-white leading-[1.15] mb-16"
            style={{ fontSize: 'clamp(26px, 4.5vw, 62px)' }}
          >
            "We don't make clothes.
            <br />
            We make the reason someone
            <br />
            stops you on the street."
          </blockquote>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
          {/* Left intentionally empty for editorial whitespace */}
          <div />

          <ScrollReveal delay={0.14}>
            <div className="w-10 h-px bg-[#B5121B] mb-8" />
            <p className="font-sans text-[12px] leading-[1.95] text-white/42 mb-5">
              Every piece in the Mischief Collection is an act of quiet
              defiance. Designed for the person who walks into a room and makes
              it recalibrate.
            </p>
            <p className="font-sans text-[12px] leading-[1.95] text-white/42 mb-10">
              No logos. No noise. Just something you can't quite place — but
              can't stop looking at.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.3em] uppercase text-white/32 hover:text-white transition-colors duration-300"
            >
              Read our story
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                aria-hidden="true"
              >
                <path d="M7 1L11 4M11 4L7 7M11 4H1" />
              </svg>
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
