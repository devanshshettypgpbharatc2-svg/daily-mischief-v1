'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import type { Customer } from '@/lib/shopify/customer'

function formatCurrency(amount: string, currencyCode: string) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: currencyCode, minimumFractionDigits: 0 }).format(Number(amount))
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function AccountPage() {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    fetch('/api/account/me')
      .then(r => r.json())
      .then(data => {
        if (!data.customer) {
          router.replace('/account/login')
        } else {
          setCustomer(data.customer)
        }
      })
      .catch(() => router.replace('/account/login'))
      .finally(() => setLoading(false))
  }, [router])

  const handleLogout = async () => {
    setLoggingOut(true)
    await fetch('/api/account/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <>
        <Nav />
        <main className="min-h-screen pt-16 md:pt-[72px] flex items-center justify-center">
          <div className="w-6 h-6 border border-white/20 border-t-white/60 rounded-full animate-spin" />
        </main>
      </>
    )
  }

  if (!customer) return null

  const orders = customer.orders.edges.map(e => e.node)
  const firstName = customer.firstName || customer.email.split('@')[0]

  return (
    <>
      <Nav />
      <CartDrawer />
      <main className="min-h-screen pt-16 md:pt-[72px]">
        {/* Header */}
        <header className="px-5 md:px-10 pt-16 md:pt-20 pb-10 border-b border-white/[0.08]">
          <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#B5121B] mb-4">My Account</p>
          <div className="flex items-end justify-between">
            <h1 className="font-serif text-[clamp(28px,4vw,52px)] font-light leading-[1.05]">
              Hello, {firstName}.
            </h1>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/25 hover:text-white transition-colors pb-1"
            >
              {loggingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </header>

        <div className="px-5 md:px-10 py-10 md:py-14 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
          {/* Details */}
          <div className="md:col-span-1">
            <div className="border-t border-white/[0.08] pt-8">
              <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/30 mb-6">Account Details</p>
              <div className="space-y-3">
                {customer.firstName && (
                  <p className="font-sans text-[13px] text-white/70">
                    {customer.firstName} {customer.lastName}
                  </p>
                )}
                <p className="font-sans text-[12px] text-white/45">{customer.email}</p>
                <p className="font-sans text-[11px] text-white/25">Member since {formatDate(customer.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="md:col-span-2">
            <div className="border-t border-white/[0.08] pt-8">
              <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/30 mb-6">
                Order History {orders.length > 0 && `(${orders.length})`}
              </p>

              {orders.length === 0 ? (
                <div className="py-12">
                  <p className="font-serif italic text-[20px] font-light text-white/20 mb-3">
                    No orders yet.
                  </p>
                  <p className="font-sans text-[11px] text-white/25 mb-6">
                    Check back after your first drop.
                  </p>
                  <Link
                    href="/shop/collections/todays-mischief"
                    className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/50 hover:text-white transition-colors"
                  >
                    Shop Today's Drop →
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-white/[0.08] p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                        <div>
                          <p className="font-sans text-[11px] text-white/60">Order #{order.orderNumber}</p>
                          <p className="font-sans text-[10px] text-white/25 mt-0.5">{formatDate(order.processedAt)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`font-sans text-[9px] tracking-[0.25em] uppercase px-3 py-1.5 ${
                            order.fulfillmentStatus === 'FULFILLED'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : order.fulfillmentStatus === 'IN_PROGRESS'
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-white/[0.05] text-white/30'
                          }`}>
                            {order.fulfillmentStatus.replace('_', ' ')}
                          </span>
                          <span className="font-sans text-[12px] text-white/70">
                            {formatCurrency(order.totalPrice.amount, order.totalPrice.currencyCode)}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {order.lineItems.edges.slice(0, 3).map((li, i) => (
                          <div key={i} className="flex items-center gap-4">
                            {li.node.variant?.image && (
                              <div className="w-12 h-12 relative flex-shrink-0 overflow-hidden bg-white/[0.04]">
                                <Image
                                  src={li.node.variant.image.url}
                                  alt={li.node.variant.image.altText || li.node.title}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-sans text-[12px] text-white/60 truncate">{li.node.title}</p>
                              {li.node.variant?.title && li.node.variant.title !== 'Default Title' && (
                                <p className="font-sans text-[10px] text-white/30">{li.node.variant.title}</p>
                              )}
                            </div>
                            <p className="font-sans text-[11px] text-white/40 flex-shrink-0">×{li.node.quantity}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
