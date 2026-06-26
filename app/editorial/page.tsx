import type { Metadata } from 'next'
import Link from 'next/link'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'

export const metadata: Metadata = {
  title: 'Editorial — The Daily Mischief',
  description: 'Stories, ideas, and the thinking behind the pieces.',
}

const EDITORIALS = [
  {
    slug: 'dressed-for-the-wrong-occasion',
    issue: 'Issue 001',
    title: 'Dressed for the Wrong Occasion',
    subtitle: 'On wearing things that make rooms recalibrate.',
    date: 'June 2025',
    tag: 'Identity',
    body: 'There is a specific kind of person who walks into a room and makes everyone subtly reassess what they are wearing. They are not loud. They are not trying. They have simply made one decision — one piece — that the room cannot quite account for.',
  },
  {
    slug: 'the-problem-with-quiet-luxury',
    issue: 'Issue 002',
    title: 'The Problem with Quiet Luxury',
    subtitle: 'When restraint becomes its own kind of noise.',
    date: 'July 2025',
    tag: 'Culture',
    body: 'Quiet luxury started as a refusal. No logos, no excess, no need to announce. But somewhere between the idea and the trend, it became a uniform — and a uniform is never quiet. It just whispers instead of shouts.',
  },
  {
    slug: 'on-buying-less',
    issue: 'Issue 003',
    title: 'On Buying Less',
    subtitle: 'A case for 24-hour decisions and 10-year wardrobes.',
    date: 'August 2025',
    tag: 'Thinking',
    body: 'The average person buys 68 pieces of clothing a year and wears each of them 7 times. We think the math is wrong. Not because 68 is too many — though it is — but because 7 is too few. A piece you wear 7 times was never really yours.',
  },
  {
    slug: 'what-a-jacket-says',
    issue: 'Issue 004',
    title: 'What a Jacket Says',
    subtitle: 'The non-verbal vocabulary of outerwear.',
    date: 'September 2025',
    tag: 'Design',
    body: 'A jacket communicates before you say anything. It tells the room how seriously to take you, how much effort you are willing to make, how you understand the occasion. The question is not whether your jacket is saying something. It is whether you know what it is saying.',
  },
]

export default function EditorialPage() {
  return (
    <>
      <Nav />
      <CartDrawer />
      <main className="min-h-screen pt-16 md:pt-[72px]">
        {/* Header */}
        <header className="px-5 md:px-10 pt-20 md:pt-28 pb-14 md:pb-20 border-b border-white/[0.08]">
          <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#B5121B] mb-6">
            Editorial
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h1 className="font-serif text-[clamp(36px,6vw,80px)] font-light leading-[0.95] tracking-tight">
              The Journal
            </h1>
            <p className="font-sans text-[11px] leading-[1.8] text-white/35 max-w-xs md:pb-2">
              Stories, ideas, and the thinking behind the pieces. Published when we have something worth saying.
            </p>
          </div>
        </header>

        {/* Featured */}
        <section className="border-b border-white/[0.08]">
          <Link href={`/editorial/${EDITORIALS[0].slug}`} className="group grid grid-cols-1 md:grid-cols-2">
            <div className="aspect-[4/3] bg-[#1a0c0e] relative overflow-hidden flex items-end p-8 md:p-12">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0506]/80 to-transparent" />
              <p className="relative z-10 font-serif italic text-[clamp(28px,4vw,52px)] font-light leading-[1.1] text-white max-w-sm">
                "{EDITORIALS[0].title}"
              </p>
            </div>
            <div className="px-8 md:px-12 py-12 md:py-16 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/[0.08]">
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <span className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#B5121B]">{EDITORIALS[0].issue}</span>
                  <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/25">{EDITORIALS[0].tag}</span>
                </div>
                <h2 className="font-serif text-[clamp(22px,3vw,38px)] font-light leading-[1.1] mb-4">
                  {EDITORIALS[0].title}
                </h2>
                <p className="font-sans text-[12px] leading-[1.9] text-white/45 max-w-md">
                  {EDITORIALS[0].body}
                </p>
              </div>
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/[0.06]">
                <span className="font-sans text-[10px] tracking-[0.15em] text-white/25">{EDITORIALS[0].date}</span>
                <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-white group-hover:text-[#B5121B] transition-colors flex items-center gap-2">
                  Read
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
                    <path d="M8.5 1L13 5M13 5L8.5 9M13 5H1" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </section>

        {/* Grid */}
        <section className="px-5 md:px-10 py-14 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            {EDITORIALS.slice(1).map((e) => (
              <Link key={e.slug} href={`/editorial/${e.slug}`} className="group border-t border-white/[0.08] pt-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#B5121B]">{e.issue}</span>
                  <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/25">{e.tag}</span>
                </div>
                <h3 className="font-serif text-[20px] font-light leading-[1.15] mb-3 group-hover:text-white/70 transition-colors">
                  {e.title}
                </h3>
                <p className="font-sans text-[11px] leading-[1.8] text-white/35 mb-6">{e.subtitle}</p>
                <div className="flex items-center justify-between">
                  <span className="font-sans text-[10px] tracking-[0.15em] text-white/20">{e.date}</span>
                  <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/30 group-hover:text-[#B5121B] transition-colors">Read →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
