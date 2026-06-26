'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { getShopifyImageUrl } from '@/utils'
import type { Product } from '@/types'

const EASE = [0.16, 1, 0.3, 1] as const

export function ProductGallery({ product }: { product: Product }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const images = product.images

  if (!images.length) {
    return <div className="aspect-[3/4] bg-[#0f0607]" />
  }

  return (
    <div className="flex flex-col lg:flex-row-reverse gap-[2px]">
      {/* Main image */}
      <div className="flex-1 relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <Image
              src={getShopifyImageUrl(images[activeIndex].url, 1400)}
              alt={images[activeIndex].alt || product.title}
              fill
              priority
              quality={90}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex lg:flex-col gap-[2px] lg:w-[76px] overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto scrollbar-none">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              aria-label={`View image ${i + 1}`}
              className="relative flex-shrink-0 w-[72px] lg:w-full overflow-hidden transition-opacity duration-300"
              style={{ aspectRatio: '3/4' }}
            >
              <Image
                src={getShopifyImageUrl(img.url, 200)}
                alt={img.alt || `${product.title} view ${i + 1}`}
                fill
                sizes="76px"
                className="object-cover"
              />
              {/* Active ring + dim overlay */}
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-300"
                style={{
                  outline: i === activeIndex ? '1px solid rgba(255,255,255,0.45)' : '1px solid transparent',
                  outlineOffset: '-1px',
                  backgroundColor: i === activeIndex ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.52)',
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
