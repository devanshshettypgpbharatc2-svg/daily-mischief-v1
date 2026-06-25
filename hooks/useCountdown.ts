'use client'

import { useState, useEffect } from 'react'
import { getNextDropTime, formatCountdown } from '@/utils'

export function useCountdown() {
  const [display, setDisplay] = useState('00:00:00')
  const [msLeft, setMsLeft] = useState(0)

  useEffect(() => {
    function tick() {
      const now = new Date()
      const next = getNextDropTime()
      const ms = next.getTime() - now.getTime()
      setMsLeft(ms)
      setDisplay(formatCountdown(ms))
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return {
    display,
    msLeft,
    isUrgent: msLeft > 0 && msLeft < 3600 * 1000, // under 1 hour
  }
}
