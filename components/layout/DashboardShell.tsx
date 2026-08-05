'use client'

import { useState, useSyncExternalStore } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import type { AuthenticatedUser } from '@/types/Auth'

const themeListeners = new Set<() => void>()

function subscribeTheme(onChange: () => void) {
  themeListeners.add(onChange)
  return () => themeListeners.delete(onChange)
}

function getThemeSnapshot() {
  return document.documentElement.classList.contains('dark')
}

// Matches the fallback used by the blocking theme-init script in app/layout.tsx,
// so hydration never mismatches before this store takes over.
function getThemeServerSnapshot() {
  return false
}

function setDark(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark)
  try {
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  } catch {}
  themeListeners.forEach(listener => listener())
}

export function DashboardShell({ user, children }: { user: AuthenticatedUser; children: React.ReactNode }) {
  const dark = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} user={user} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          dark={dark}
          user={user}
          onToggleDark={() => setDark(!dark)}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
