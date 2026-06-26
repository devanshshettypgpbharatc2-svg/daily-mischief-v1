'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { MischiefButton } from '@/components/ui/Buttons'

const EASE = [0.16, 1, 0.3, 1] as const

const LINES = ['What leaves', 'today', 'never comes back.']

export function ManifestoSection() {
  const prefersReduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-15%' })

  return (
    <section
      ref={ref}
      className="border-t border-white/[0.06] min-h-screen flex flex-col items-center justify-center text-center px-6 py-section-lg"
    >
      <div className="max-w-4xl">
        {/* Label */}
        <motion.p
          className="font-sans text-[9px] tracking-[0.5em] uppercase text-[#B5121B] mb-14"
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          The Promise
        </motion.p>

        {/* Lines */}
        <div className="mb-14 space-y-1">
          {LINES.map((line, i) => (
            <motion.p
              key={line}
              className="font-serif font-light text-white uppercase leading-[0.88] tracking-[0.05em]"
              style={{ fontSize: 'clamp(44px, 9vw, 128px)' }}
              initial={prefersReduced ? false : { opacity: 0, y: 40 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
              }
              transition={{
                duration: 1,
                delay: 0.2 + i * 0.15,
                ease: EASE,
              }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.75, ease: EASE }}
        >
          <MischiefButton
            href="/shop/collections/todays-mischief"
            label="Cause A Little Mischief"
          />
        </motion.div>
      </div>
    </section>
  )
}
