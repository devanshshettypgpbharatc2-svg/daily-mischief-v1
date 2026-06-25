'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Product } from '@/types'

const RECENT_KEY = 'tdm_recent_searches'
const DEBOUNCE = 320

export function useSearch() {
  const [query, setQueryState] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [isOpen, setIsOpen] = useState(false)
  const [recent, setRecent] = useState<string[]>([])
  const abortRef = useRef<AbortController | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY)
      if (stored) setRecent(JSON.parse(stored))
    } catch {}
  }, [])

  const search = useCallback(async (q: string) => {
    if (!q || q.trim().length < 2) {
      setResults([])
      setTotalCount(0)
      setStatus('idle')
      return
    }
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    setStatus('loading')
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(q.trim())}&first=8`,
        { signal: abortRef.current.signal }
      )
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      setResults(data.products)
      setTotalCount(data.totalCount)
      setStatus('success')
    } catch (e: unknown) {
      if ((e as Error).name !== 'AbortError') setStatus('error')
    }
  }, [])

  const setQuery = useCallback((q: string) => {
    setQueryState(q)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => search(q), DEBOUNCE)
  }, [search])

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => {
    setIsOpen(false)
    setQueryState('')
    setResults([])
    setStatus('idle')
  }, [])

  const addRecent = useCallback((q: string) => {
    if (!q.trim()) return
    setRecent(prev => {
      const next = [q, ...prev.filter(s => s.toLowerCase() !== q.toLowerCase())].slice(0, 6)
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const clearRecent = useCallback(() => {
    setRecent([])
    try { localStorage.removeItem(RECENT_KEY) } catch {}
  }, [])

  useEffect(() => () => {
    abortRef.current?.abort()
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  return {
    query, setQuery, results, totalCount, status,
    isOpen, open, close, recent, addRecent, clearRecent,
  }
}
