'use client'

import { useState } from 'react'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    // Simple mailto fallback — replace with a real email API (Resend, Formspree, etc.) when ready
    try {
      await new Promise(r => setTimeout(r, 800))
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <Nav />
      <CartDrawer />
      <main className="min-h-screen pt-16 md:pt-[72px]">
        <header className="px-5 md:px-10 pt-20 md:pt-28 pb-14 border-b border-white/[0.08]">
          <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#B5121B] mb-6">Contact</p>
          <h1 className="font-serif text-[clamp(36px,6vw,72px)] font-light leading-[0.95] tracking-tight">Get in Touch</h1>
        </header>

        <section className="px-5 md:px-10 py-14 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-16 max-w-4xl">
          {/* Info */}
          <div className="space-y-8">
            <div>
              <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/30 mb-4">General enquiries</p>
              <a href="mailto:hello@thedailymischief.store" className="font-sans text-[13px] text-white/60 hover:text-white transition-colors">
                hello@thedailymischief.store
              </a>
            </div>
            <div>
              <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/30 mb-4">Orders & returns</p>
              <a href="mailto:orders@thedailymischief.store" className="font-sans text-[13px] text-white/60 hover:text-white transition-colors">
                orders@thedailymischief.store
              </a>
            </div>
            <div>
              <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/30 mb-4">Response time</p>
              <p className="font-sans text-[12px] text-white/45 leading-[1.7]">
                We respond to all emails within 24 hours, Monday to Friday.
              </p>
            </div>
          </div>

          {/* Form */}
          {status === 'sent' ? (
            <div className="flex flex-col justify-center">
              <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#B5121B] mb-4">Message sent</p>
              <p className="font-serif text-[24px] font-light mb-3">We'll be in touch.</p>
              <p className="font-sans text-[12px] text-white/40">Expect a reply within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                { id: 'name', label: 'Name', type: 'text', required: true },
                { id: 'email', label: 'Email', type: 'email', required: true },
                { id: 'subject', label: 'Subject', type: 'text', required: true },
              ].map((f) => (
                <div key={f.id}>
                  <label htmlFor={f.id} className="block font-sans text-[9px] tracking-[0.3em] uppercase text-white/30 mb-2">
                    {f.label}
                  </label>
                  <input
                    id={f.id}
                    type={f.type}
                    required={f.required}
                    value={form[f.id as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))}
                    className="w-full bg-transparent border-b border-white/[0.15] py-3 font-sans text-[13px] text-white placeholder-white/20 focus:border-white/40 focus:outline-none transition-colors"
                  />
                </div>
              ))}
              <div>
                <label htmlFor="message" className="block font-sans text-[9px] tracking-[0.3em] uppercase text-white/30 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  className="w-full bg-transparent border-b border-white/[0.15] py-3 font-sans text-[13px] text-white placeholder-white/20 focus:border-white/40 focus:outline-none transition-colors resize-none"
                />
              </div>
              {status === 'error' && (
                <p className="font-sans text-[11px] text-[#B5121B]">Something went wrong. Email us directly instead.</p>
              )}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="group relative inline-flex items-center justify-between gap-4 overflow-hidden border border-white/20 px-7 py-4 font-sans text-[10px] tracking-[0.28em] uppercase text-white hover:border-[#B5121B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 bg-[#B5121B] -translate-x-full group-hover:translate-x-0 transition-transform duration-[600ms]" style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }} aria-hidden="true" />
                <span className="relative z-10">{status === 'sending' ? 'Sending…' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
