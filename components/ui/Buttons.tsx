'use client'

import { cn } from '@/utils'
import type { ButtonHTMLAttributes } from 'react'

const ArrowRight = ({ className }: { className?: string }) => (
  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className={className} aria-hidden="true">
    <path d="M8.5 1L13 5M13 5L8.5 9M13 5H1" stroke="currentColor" strokeWidth="1"/>
  </svg>
)

interface MischiefButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
  loading?: boolean
  href?: string
  fullWidth?: boolean
}

export function MischiefButton({
  label = 'Cause A Little Mischief',
  loading = false,
  href,
  fullWidth = false,
  className,
  disabled,
  ...props
}: MischiefButtonProps) {
  const base = cn(
    'group relative inline-flex items-center justify-between gap-4 overflow-hidden',
    'border border-white/20 px-7 py-4',
    'font-sans text-[10px] font-light tracking-[0.28em] uppercase text-white',
    'transition-colors duration-500',
    'hover:border-[#B5121B]',
    'focus-visible:outline-2 focus-visible:outline-[#B5121B] focus-visible:outline-offset-2',
    fullWidth && 'w-full',
    (disabled || loading) && 'opacity-50 pointer-events-none',
    className
  )

  const inner = (
    <>
      <span
        className="absolute inset-0 bg-[#B5121B] -translate-x-full group-hover:translate-x-0 transition-transform duration-[600ms]"
        style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
        aria-hidden="true"
      />
      <span className="relative z-10">{loading ? 'One moment…' : label}</span>
      {!loading && <ArrowRight className="relative z-10 transition-transform duration-400 group-hover:translate-x-1" />}
    </>
  )

  if (href) {
    return (
      <a href={href} className={base}>
        {inner}
      </a>
    )
  }

  return (
    <button {...props} disabled={disabled || loading} className={base}>
      {inner}
    </button>
  )
}

export function GhostButton({
  label, href, onClick, className,
}: {
  label: string
  href?: string
  onClick?: () => void
  className?: string
}) {
  const base = cn(
    'inline-flex items-center gap-2 font-sans text-[10px] font-light tracking-[0.25em] uppercase',
    'text-white/55 hover:text-white transition-colors duration-300',
    'focus-visible:outline-2 focus-visible:outline-[#B5121B] focus-visible:outline-offset-2',
    className
  )
  const inner = (
    <>
      {label}
      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true">
        <path d="M7 1L11 4M11 4L7 7M11 4H1" stroke="currentColor" strokeWidth="1"/>
      </svg>
    </>
  )
  if (href) return <a href={href} className={base}>{inner}</a>
  return <button onClick={onClick} className={base}>{inner}</button>
}

export function SoldOutButton() {
  return (
    <div className="inline-flex items-center gap-4 px-7 py-4 border border-white/10 font-sans text-[10px] tracking-[0.28em] uppercase text-white/30">
      Gone Missing
    </div>
  )
}
