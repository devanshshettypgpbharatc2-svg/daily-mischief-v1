'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Nav } from '@/components/layout/Nav'
import { CartDrawer } from '@/components/cart/CartDrawer'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/account/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error || 'Registration failed. Please try again.')
        return
      }
      if (data.redirect) {
        router.push(data.redirect)
      } else {
        router.push('/account')
        router.refresh()
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Nav />
      <CartDrawer />
      <main className="min-h-screen pt-16 md:pt-[72px] flex items-center justify-center px-5">
        <div className="w-full max-w-sm py-16">
          <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#B5121B] mb-6">Account</p>
          <h1 className="font-serif text-[clamp(28px,4vw,40px)] font-light leading-[1.05] mb-10">
            Join the mischief.
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'firstName', label: 'First Name', autoComplete: 'given-name' },
                { id: 'lastName', label: 'Last Name', autoComplete: 'family-name' },
              ].map((f) => (
                <div key={f.id}>
                  <label htmlFor={f.id} className="block font-sans text-[9px] tracking-[0.3em] uppercase text-white/30 mb-2">
                    {f.label}
                  </label>
                  <input
                    id={f.id}
                    type="text"
                    autoComplete={f.autoComplete}
                    value={form[f.id as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))}
                    className="w-full bg-transparent border-b border-white/[0.15] py-3 font-sans text-[13px] text-white placeholder-white/20 focus:border-white/40 focus:outline-none transition-colors"
                  />
                </div>
              ))}
            </div>

            {[
              { id: 'email', label: 'Email', type: 'email', autoComplete: 'email', required: true },
              { id: 'password', label: 'Password', type: 'password', autoComplete: 'new-password', required: true },
            ].map((f) => (
              <div key={f.id}>
                <label htmlFor={f.id} className="block font-sans text-[9px] tracking-[0.3em] uppercase text-white/30 mb-2">
                  {f.label}
                </label>
                <input
                  id={f.id}
                  type={f.type}
                  autoComplete={f.autoComplete}
                  required={f.required}
                  value={form[f.id as keyof typeof form]}
                  onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))}
                  className="w-full bg-transparent border-b border-white/[0.15] py-3 font-sans text-[13px] text-white placeholder-white/20 focus:border-white/40 focus:outline-none transition-colors"
                />
              </div>
            ))}

            {error && (
              <p className="font-sans text-[11px] text-[#B5121B]">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden border border-white/20 px-7 py-4 font-sans text-[10px] tracking-[0.28em] uppercase text-white hover:border-[#B5121B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-center"
            >
              <span className="absolute inset-0 bg-[#B5121B] -translate-x-full group-hover:translate-x-0 transition-transform duration-[600ms]" style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }} aria-hidden="true" />
              <span className="relative z-10">{loading ? 'Creating account…' : 'Create Account'}</span>
            </button>
          </form>

          <p className="mt-8 font-sans text-[11px] text-white/30 text-center">
            Already have an account?{' '}
            <Link href="/account/login" className="text-white/60 hover:text-white transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}
