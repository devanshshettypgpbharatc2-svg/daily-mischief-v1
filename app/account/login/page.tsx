'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Nav } from '@/components/layout/Nav'
import { CartDrawer } from '@/components/cart/CartDrawer'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/account/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error || 'Login failed. Please try again.')
        return
      }
      router.push('/account')
      router.refresh()
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
            Welcome back.
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              { id: 'email', label: 'Email', type: 'email', autocomplete: 'email' },
              { id: 'password', label: 'Password', type: 'password', autocomplete: 'current-password' },
            ].map((f) => (
              <div key={f.id}>
                <label htmlFor={f.id} className="block font-sans text-[9px] tracking-[0.3em] uppercase text-white/30 mb-2">
                  {f.label}
                </label>
                <input
                  id={f.id}
                  type={f.type}
                  autoComplete={f.autocomplete}
                  required
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
              <span className="relative z-10">{loading ? 'Signing in…' : 'Sign In'}</span>
            </button>
          </form>

          <p className="mt-8 font-sans text-[11px] text-white/30 text-center">
            Don't have an account?{' '}
            <Link href="/account/register" className="text-white/60 hover:text-white transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}
