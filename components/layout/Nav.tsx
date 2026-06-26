'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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

export function Nav() {
  const { cart, openCart } = useCart()
  const { display, isUrgent } = useCountdown()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const qty = cart?.totalQuantity ?? 0

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-[800]',
          'transition-colors duration-500',
          scrolled ? 'bg-[#111111]/95 backdrop-blur-sm border-b border-white/[0.06]' : 'bg-transparent'
        )}
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between px-5 md:px-10 h-16 md:h-[72px]">
          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-[13px] md:text-[15px] font-light tracking-[0.22em] uppercase text-white hover:text-white/70 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            The Daily Mischief
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {/* Today's Mischief with countdown */}
            <Link
              href="/shop/collections/todays-mischief"
              className="flex items-center gap-3 font-sans text-[10px] tracking-[0.2em] uppercase text-white hover:text-white/70 transition-colors"
            >
              Today's Mischief
              <span className={cn(
                'font-sans text-[10px] tracking-[0.15em] tabular-nums transition-colors duration-300',
                isUrgent ? 'text-white/70' : 'text-white/40'
              )}>
                {display}
              </span>
            </Link>

            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/55 hover:text-white transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Account + Cart + mobile menu */}
          <div className="flex items-center gap-4">
            {/* Account link */}
            <Link
              href="/account"
              className="hidden md:flex font-sans text-[10px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors"
              aria-label="My account"
            >
              Account
            </Link>
            {/* Cart button */}
            <button
              onClick={openCart}
              className="flex items-center gap-2 font-sans text-[10px] tracking-[0.2em] uppercase text-white hover:text-white/70 transition-colors focus-visible:outline-2 focus-visible:outline-[#B5121B] focus-visible:outline-offset-2 p-2 -m-2"
              aria-label={`Open bag, ${qty} ${qty === 1 ? 'item' : 'items'}`}
            >
              <span className="hidden sm:inline">Bag</span>
              {qty > 0 && (
                <span className="flex items-center justify-center w-4 h-4 bg-[#B5121B] rounded-full text-[9px] text-white leading-none">
                  {qty}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col justify-center gap-[5px] p-3 -m-3 focus-visible:outline-2 focus-visible:outline-[#B5121B] focus-visible:outline-offset-2"
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span className={cn(
                'block w-5 h-px bg-white transition-all duration-300',
                menuOpen && 'translate-y-[6px] rotate-45'
              )} />
              <span className={cn(
                'block w-5 h-px bg-white transition-all duration-300',
                menuOpen && 'opacity-0'
              )} />
              <span className={cn(
                'block w-5 h-px bg-white transition-all duration-300',
                menuOpen && '-translate-y-[6px] -rotate-45'
              )} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          'fixed inset-0 z-[700] bg-[#111111] flex flex-col pt-16 md:hidden',
          'transition-transform duration-500',
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-hidden={!menuOpen}
      >
        <div className="flex flex-col px-6 py-8 gap-1 border-b border-white/[0.06]">
          <Link
            href="/shop/collections/todays-mischief"
            onClick={() => setMenuOpen(false)}
            className="py-4 flex items-center justify-between font-serif text-[22px] font-light text-white border-b border-white/[0.06]"
          >
            Today's Mischief
            <span className={cn(
              'font-sans text-[12px] tracking-[0.15em] tabular-nums',
              isUrgent ? 'text-white/70' : 'text-white/35'
            )}>
              {display}
            </span>
          </Link>
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="py-4 font-serif text-[22px] font-light text-white/70 hover:text-white transition-colors border-b border-white/[0.06]"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="px-6 py-6 flex items-center justify-between">
          <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/25">
            One piece. Every day.
          </p>
          <Link
            href="/account"
            onClick={() => setMenuOpen(false)}
            className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/35 hover:text-white transition-colors"
          >
            Account
          </Link>
        </div>
      </div>
    </>
  )
}
