'use client'

import NextImage from 'next/image'
import { useState } from 'react'
import { cn, getShopifyImageUrl } from '@/utils'
import type { Image } from '@/types'

function GhostFallback({ className }: { className?: string }) {
  return (
    <div className={cn('bg-[#0f0607] flex items-center justify-center', className)} aria-hidden="true">
      <svg viewBox="0 0 200 280" className="w-1/3 opacity-20" xmlns="http://www.w3.org/2000/svg">
        <rect x="60" y="30" width="80" height="160" rx="2" fill="white"/>
        <rect x="48" y="30" width="15" height="95" rx="2" fill="white"/>
        <rect x="137" y="30" width="15" height="95" rx="2" fill="white"/>
        <ellipse cx="100" cy="70" rx="28" ry="34" fill="#0f0607"/>
        <rect x="70" y="104" width="60" height="80" rx="1" fill="#0f0607"/>
      </svg>
    </div>
  )
}

interface MischiefImageProps {
  image: Image | null
  alt?: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  className?: string
  containerClassName?: string
  sizes?: string
}

export function MischiefImage({
  image, alt, width, height, fill = false, priority = false,
  className, containerClassName,
  sizes = '(max-width: 768px) 100vw, 50vw',
}: MischiefImageProps) {
  const [error, setError] = useState(false)

  if (!image || error) {
    return <GhostFallback className={cn('w-full h-full', containerClassName, !fill && className)} />
  }

  const src = getShopifyImageUrl(image.url, width || 1200)

  if (fill) {
    return (
      <div className={cn('relative overflow-hidden', containerClassName)}>
        <NextImage
          src={src} alt={alt ?? image.alt} fill sizes={sizes}
          quality={85} priority={priority}
          className={cn('object-cover', className)}
          onError={() => setError(true)}
        />
      </div>
    )
  }

  return (
    <NextImage
      src={src} alt={alt ?? image.alt}
      width={width ?? image.width ?? 800}
      height={height ?? image.height ?? 1000}
      sizes={sizes} quality={85} priority={priority}
      className={cn('block w-full h-auto', className)}
      onError={() => setError(true)}
    />
  )
}
