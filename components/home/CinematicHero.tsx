'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { MischiefButton } from '@/components/ui/Buttons'

const EASE = [0.16, 1, 0.3, 1] as const

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE },
  },
}

export function CinematicHero() {
  const prefersReduced = useReducedMotion()

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0d0d0d]">
      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-[900px]"
        variants={container}
        initial={prefersReduced ? false : 'hidden'}
        animate="show"
      >
        {/* Eyebrow */}
        <motion.p
          variants={item}
          className="font-sans text-[9px] tracking-[0.55em] uppercase text-[#B5121B] mb-10"
        >
          Today's Mischief
        </motion.p>

        {/* Brand name */}
        <motion.h1
          variants={item}
          className="font-serif font-light uppercase text-white leading-[0.88] tracking-[0.14em] mb-8 select-none"
          style={{ fontSize: 'clamp(46px, 10vw, 132px)' }}
        >
          The Daily
          <br />
          Mischief
        </motion.h1>

        {/* Divider */}
        <motion.div
          variants={item}
          className="w-16 h-px bg-white/15 mx-auto mb-10"
        />

        {/* Tagline */}
        <motion.p
          variants={item}
          className="font-serif italic font-light text-white/70 leading-[1.45] mb-9"
          style={{ fontSize: 'clamp(20px, 3vw, 34px)' }}
        >
          One piece.
          <br />
          Every day.
          <br />
          Twenty-four hours.
        </motion.p>

        {/* Body copy */}
        <motion.p
          variants={item}
          className="font-sans text-[11px] leading-[2.1] text-white/28 max-w-[240px] mx-auto mb-12 tracking-[0.03em]"
        >
          Every midnight the collection changes. What leaves today never comes
          back. This isn't fashion. It's a daily ritual.
        </motion.p>

        {/* CTA */}
        <motion.div variants={item}>
          <MischiefButton
            href="/shop/collections/todays-mischief"
            label="Explore Today's Drop"
          />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        initial={prefersReduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1.2, ease: 'easeOut' }}
        aria-hidden="true"
      >
        <div className="relative w-px h-12 bg-white/12 overflow-hidden">
          <motion.div
            className="absolute left-0 w-full bg-white/50"
            style={{ height: '50%' }}
            animate={{ top: ['-50%', '150%'] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2.4,
            }}
          />
        </div>
        <p className="font-sans text-[8px] tracking-[0.45em] uppercase text-white/18">
          Scroll
        </p>
      </motion.div>
    </section>
  )
}
