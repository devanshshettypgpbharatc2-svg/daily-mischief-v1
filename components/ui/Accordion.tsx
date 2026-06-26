'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

interface AccordionItemProps {
  label: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export function AccordionItem({ label, children, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-t border-white/[0.08]">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between py-4 text-left focus-visible:outline-2 focus-visible:outline-[#B5121B] focus-visible:outline-offset-2"
        aria-expanded={open}
      >
        <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-white/45">
          {label}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.28, ease: EASE }}
          className="text-white/30 text-[18px] leading-none font-light"
          aria-hidden="true"
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-6 pr-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
