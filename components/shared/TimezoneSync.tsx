'use client'

import { useEffect } from 'react'
import { TIMEZONE_COOKIE } from '@/lib/auth/constants'

export function TimezoneSync() {
  useEffect(() => {
    if (document.cookie.includes(`${TIMEZONE_COOKIE}=`)) return
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    document.cookie = `${TIMEZONE_COOKIE}=${timezone}; path=/; max-age=${60 * 60 * 24 * 365}`
  }, [])

  return null
}
