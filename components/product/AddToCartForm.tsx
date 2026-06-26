'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { MischiefButton, SoldOutButton } from '@/components/ui/Buttons'
import { cn, getVariantByOptions, formatMoney } from '@/utils'
import type { Product, SelectedOptions } from '@/types'

interface OptionSelectorProps {
  name: string
  values: string[]
  selected: string
  onSelect: (val: string) => void
  variants: Product['variants']
  currentOptions: SelectedOptions
}

function OptionSelector({ name, values, selected, onSelect, variants, currentOptions }: OptionSelectorProps) {
  function isAvailable(value: string) {
    const test = { ...currentOptions, [name]: value }
    const v = variants.find(v => Object.entries(test).every(([k, val]) => v.options[k] === val))
    return v?.available ?? false
  }

  return (
    <div className="mb-6">
      <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-white/40 mb-3">
        {name}{selected && <span className="text-white/70 ml-2">— {selected}</span>}
      </p>
      <div className="flex flex-wrap gap-2">
        {values.map(value => {
          const available = isAvailable(value)
          const isSelected = selected === value
          return (
            <button
              key={value}
              onClick={() => available && onSelect(value)}
              disabled={!available}
              aria-pressed={isSelected}
              aria-label={`${name}: ${value}${!available ? ' (unavailable)' : ''}`}
              className={cn(
                'min-w-[44px] min-h-[44px] px-4 py-2 font-sans text-[10px] tracking-[0.15em] uppercase transition-all duration-300 border',
                'focus-visible:outline-2 focus-visible:outline-[#B5121B] focus-visible:outline-offset-2',
                isSelected
                  ? 'border-white bg-white text-[#111111]'
                  : available
                  ? 'border-white/20 text-white/70 hover:border-white/50 hover:text-white'
                  : 'border-white/[0.08] text-white/20 line-through cursor-not-allowed'
              )}
            >
              {value}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function AddToCartForm({ product }: { product: Product }) {
  const { addItem, status } = useCart()
  const [added, setAdded] = useState(false)

  const hasOptions = product.options.length > 0 &&
    !(product.options.length === 1 && product.options[0].name === 'Title')

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>(() => {
    const first = product.variants.find(v => v.available) ?? product.variants[0]
    return first?.options ?? {}
  })

  const selectedVariant = getVariantByOptions(product.variants, selectedOptions)
  const isSoldOut = !selectedVariant?.available
  const isAdding = status === 'adding'

  async function handleAdd() {
    if (!selectedVariant || isSoldOut || isAdding) return
    await addItem(selectedVariant.id)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div>
      {hasOptions && product.options.map(opt => (
        <OptionSelector
          key={opt.id}
          name={opt.name}
          values={opt.values}
          selected={selectedOptions[opt.name] ?? ''}
          onSelect={val => setSelectedOptions(prev => ({ ...prev, [opt.name]: val }))}
          variants={product.variants}
          currentOptions={selectedOptions}
        />
      ))}

      <div className="mt-6 flex flex-col gap-4">
        {isSoldOut ? (
          <div>
            <SoldOutButton />
            <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/25 mt-4">
              Want it back?{' '}
              <a href="/resurrection-chamber" className="text-[#B5121B] hover:text-white transition-colors">
                Vote in the Resurrection Chamber.
              </a>
            </p>
          </div>
        ) : (
          <MischiefButton
            label={added ? 'Added to bag ✓' : 'Cause A Little Mischief'}
            loading={isAdding}
            onClick={handleAdd}
            disabled={!selectedVariant}
          />
        )}

        <button
          className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/30 hover:text-white/60 transition-colors self-start focus-visible:outline-2 focus-visible:outline-[#B5121B] focus-visible:outline-offset-2 py-1"
          aria-label="Save to wishlist"
        >
          Save For Later Trouble
        </button>
      </div>

      {/* Mobile sticky bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[600] bg-[#111111]/95 backdrop-blur-sm border-t border-white/[0.08] px-5 py-4 flex items-center gap-4">
        <div className="flex-shrink-0">
          {selectedVariant?.compareAtPrice && (
            <p className="font-sans text-[9px] text-white/30 line-through leading-none mb-0.5">
              {formatMoney(selectedVariant.compareAtPrice)}
            </p>
          )}
          <p className="font-serif text-[18px] font-light text-white leading-none">
            {selectedVariant ? formatMoney(selectedVariant.price) : '—'}
          </p>
        </div>
        <div className="flex-1">
          {isSoldOut ? (
            <SoldOutButton />
          ) : (
            <button
              onClick={handleAdd}
              disabled={!selectedVariant || isAdding}
              className={cn(
                'w-full py-3 font-sans text-[9px] tracking-[0.3em] uppercase transition-all duration-300 focus-visible:outline-2 focus-visible:outline-[#B5121B] focus-visible:outline-offset-2',
                added
                  ? 'bg-white/10 text-white/70'
                  : 'bg-white text-[#111111] hover:bg-white/90',
                (!selectedVariant || isAdding) && 'opacity-50 cursor-not-allowed'
              )}
            >
              {added ? 'Added ✓' : isAdding ? 'Adding…' : 'Add to Bag'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
