'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useCart } from '@/hooks/useCart'
import { useCountdown } from '@/hooks/useCountdown'
import { cn } from '@/utils'

const NAV_LINKS = [
  { label: 'Wardrobe', href: '/shop/collections/wardrobe' },
  { label: 'Home', href: '/shop/collections/home' },
  { label: 'Oddities', href: '/shop/collections/oddities' },
  { label: 'Editorial', href: '/editorial' },
  { label: 'About', href: '/about' },
]

const EASE = [0.16, 1, 0.3, 1] as const

const mobileMenuVariants = {
  closed: {
    x: '100%',
    transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] as const },
  },
  open: {
    x: 0,
    transition: { duration: 0.5, ease: EASE },
  },
}

const mobileLinkVariants = {
  closed: { opacity: 0, x: 24 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: EASE, delay: 0.08 + i * 0.065 },
  }),
}

// Desktop nav link with animated underline
function NavLink({
  href,
  children,
  dimmed = false,
}: {
  href: string
  children: React.ReactNode
  dimmed?: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'relative font-sans text-[10px] tracking-[0.2em] uppercase transition-colors duration-300',
        dimmed ? 'text-white/55 hover:text-white' : 'text-white hover:text-white/80'
      )}
    >
      {children}
      <motion.span
        className="absolute left-0 h-px bg-white/50 pointer-events-none"
        style={{ bottom: '-3px', width: '100%', originX: 0 }}
        initial={false}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: EASE }}
      />
    </Link>
  )
}

export function Nav() {
  const { cart, openCart } = useCart()
  const { display, isUrgent } = useCountdown()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 60)
      if (y > 120) {
        setHidden(y > lastScrollY.current)
      } else {
        setHidden(false)
      }
      lastScrollY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const qty = cart?.totalQuantity ?? 0

  const allMobileLinks: Array<{ label: string; href: string; isTodays?: boolean }> = [
    { label: "Today's Mischief", href: '/shop/collections/todays-mischief', isTodays: true },
    ...NAV_LINKS,
  ]

  return (
    <>
      <motion.nav
        className={cn(
          'fixed top-0 left-0 right-0 z-[800]',
          'transition-colors duration-500',
          scrolled
            ? 'bg-[#111111]/95 backdrop-blur-sm border-b border-white/[0.06]'
            : 'bg-transparent'
        )}
        animate={prefersReduced ? {} : { y: hidden && !menuOpen ? '-100%' : '0%' }}
        transition={{ duration: 0.35, ease: EASE }}
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between px-5 md:px-10 h-16 md:h-[72px]">
          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-[13px] md:text-[15px] font-light tracking-[0.22em] uppercase text-white hover:text-white/70 transition-colors duration-300"
            onClick={() => setMenuOpen(false)}
          >
            The Daily Mischief
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {/* Today's Mischief + countdown */}
            <NavLink href="/shop/collections/todays-mischief">
              <span className="inline-flex items-center gap-3">
                Today&apos;s Mischief
                <span
                  className={cn(
                    'font-sans text-[10px] tracking-[0.15em] tabular-nums transition-colors duration-300',
                    isUrgent ? 'text-white/70' : 'text-white/40'
                  )}
                >
                  {display}
                </span>
              </span>
            </NavLink>

            {NAV_LINKS.map(link => (
              <NavLink key={link.href} href={link.href} dimmed>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right: Account + Cart + hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="/account"
              className="hidden md:flex font-sans text-[10px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors duration-300"
              aria-label="My account"
            >
              Account
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="flex items-center gap-2 font-sans text-[10px] tracking-[0.2em] uppercase text-white hover:text-white/70 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-[#B5121B] focus-visible:outline-offset-2 p-2 -m-2"
              aria-label={`Open bag, ${qty} ${qty === 1 ? 'item' : 'items'}`}
            >
              <span className="hidden sm:inline">Bag</span>
              <AnimatePresence mode="popLayout">
                {qty > 0 && (
                  <motion.span
                    key={qty}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: EASE }}
                    className="flex items-center justify-center w-4 h-4 bg-[#B5121B] rounded-full text-[9px] text-white leading-none"
                  >
                    {qty}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col justify-center items-center gap-[5px] w-10 h-10 focus-visible:outline-2 focus-visible:outline-[#B5121B] focus-visible:outline-offset-2"
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <motion.span
                className="block w-5 h-px bg-white"
                animate={menuOpen ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                style={{ originX: '50%', originY: '50%' }}
              />
              <motion.span
                className="block w-5 h-px bg-white"
                animate={menuOpen ? { opacity: 0, scaleX: 0.3 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block w-5 h-px bg-white"
                animate={menuOpen ? { y: -6, rotate: -45 } : { y: 0, rotate: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                style={{ originX: '50%', originY: '50%' }}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-[700] bg-[#111111] flex flex-col pt-16 md:hidden"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col px-6 py-8 border-b border-white/[0.06]">
              {allMobileLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  custom={i}
                  variants={prefersReduced ? undefined : mobileLinkVariants}
                  initial="closed"
                  animate="open"
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      'py-4 flex items-center justify-between font-serif text-[22px] font-light border-b border-white/[0.06] transition-colors duration-300',
                      link.isTodays ? 'text-white' : 'text-white/70 hover:text-white'
                    )}
                  >
                    {link.label}
                    {link.isTodays && (
                      <span
                        className={cn(
                          'font-sans text-[12px] tracking-[0.15em] tabular-nums',
                          isUrgent ? 'text-white/70' : 'text-white/35'
                        )}
                      >
                        {display}
                      </span>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="px-6 py-6 flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/25">
                One piece. Every day.
              </p>
              <Link
                href="/account"
                onClick={() => setMenuOpen(false)}
                className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/35 hover:text-white transition-colors duration-300"
              >
                Account
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
