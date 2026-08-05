'use client'

import { usePathname } from 'next/navigation'
import { navItems } from './nav-items'
import { logoutAction } from '@/actions/auth'
import type { AuthenticatedUser } from '@/types/Auth'

function initials(name: string) {
  return name.split(' ').filter(Boolean).map(part => part[0]).slice(0, 2).join('').toUpperCase()
}

export function Topbar({ dark, user, onToggleDark, onToggleSidebar }: {
  dark: boolean; user: AuthenticatedUser; onToggleDark: () => void; onToggleSidebar: () => void
}) {
  const pathname = usePathname()
  const pageLabel = navItems.find(n => n.href === pathname)?.label
    ?? navItems.find(n => n.children?.some(c => c.href === pathname))?.label
    ?? ''

  return (
    <header className="h-16 bg-card border-b border-border flex items-center px-4 gap-4 flex-shrink-0">
      <button onClick={onToggleSidebar} className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-secondary">
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Store</span>
        <span className="text-muted-foreground">/</span>
        <span className="font-600 text-foreground">{pageLabel}</span>
      </div>
      <div className="flex-1" />
      {/* Search */}
      <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-muted border border-border text-sm text-muted-foreground w-52">
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <span>Search…</span>
        <kbd className="ml-auto text-[10px] font-mono bg-border px-1 rounded">⌘K</kbd>
      </div>
      {/* Actions */}
      <button className="relative text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-secondary">
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
      </button>
      <button
        onClick={onToggleDark}
        className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        title={dark ? 'Light mode' : 'Dark mode'}
      >
        {dark ? (
          <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        ) : (
          <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        )}
      </button>
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-700" title={user.name}>
        {initials(user.name)}
      </div>
      <form action={logoutAction}>
        <button
          type="submit"
          title="Sign out"
          className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </form>
    </header>
  )
}
