'use client'

import Link from 'next/link'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const JOURNAL = [
  {
    slug: 'dressed-for-the-wrong-occasion',
    issue: 'Issue 001',
    title: 'Dressed for the Wrong Occasion',
    subtitle: 'On wearing things that make rooms recalibrate.',
    date: 'June 2025',
    tag: 'Identity',
    excerpt:
      'There is a specific kind of person who walks into a room and makes everyone subtly reassess what they are wearing. They are not loud. They are not trying.',
  },
  {
    slug: 'the-problem-with-quiet-luxury',
    issue: 'Issue 002',
    title: 'The Problem with Quiet Luxury',
    subtitle: 'When restraint becomes its own kind of noise.',
    date: 'July 2025',
    tag: 'Culture',
    excerpt:
      'Quiet luxury started as a refusal. No logos, no excess, no need to announce. But somewhere between the idea and the trend, it became a uniform.',
  },
]

export function JournalSection() {
  return (
    <section className="border-t border-white/[0.06] py-section-md px-5 md:px-10">
      {/* Header */}
      <ScrollReveal>
        <div className="flex items-baseline justify-between mb-14 pb-6 border-b border-white/[0.06]">
          <h2 className="font-serif font-light" style={{ fontSize: 'clamp(22px, 3vw, 36px)' }}>
            The Journal
          </h2>
          <Link
            href="/editorial"
            className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.25em] uppercase text-white/28 hover:text-white transition-colors duration-300"
          >
            All issues
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
        </div>
      </ScrollReveal>

      {/* Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px]">
        {JOURNAL.map((article, i) => (
          <ScrollReveal key={article.slug} delay={i * 0.1}>
            <Link
              href={`/editorial/${article.slug}`}
              className="group block border border-white/[0.06] p-8 md:p-10 hover:border-white/[0.12] transition-colors duration-400 h-full"
            >
              {/* Meta */}
              <div className="flex items-center gap-4 mb-8">
                <span className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#B5121B]">
                  {article.issue}
                </span>
                <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/20">
                  {article.tag}
                </span>
              </div>

              {/* Title */}
              <h3
                className="font-serif font-light leading-[1.12] mb-3 group-hover:text-white/65 transition-colors duration-300"
                style={{ fontSize: 'clamp(20px, 2.5vw, 30px)' }}
              >
                {article.title}
              </h3>

              {/* Subtitle */}
              <p className="font-sans text-[11px] text-white/28 leading-[1.8] mb-6">
                {article.subtitle}
              </p>

              {/* Excerpt */}
              <p className="font-sans text-[11px] leading-[1.92] text-white/22 mb-8">
                {article.excerpt}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-white/[0.06] pt-5">
                <span className="font-sans text-[10px] tracking-[0.15em] text-white/18">
                  {article.date}
                </span>
                <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/28 group-hover:text-[#B5121B] transition-colors duration-300">
                  Read →
                </span>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
