'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Chevron } from './Chevron'
import { navItems } from './nav-items'
import type { AuthenticatedUser } from '@/types/Auth'

function initials(name: string) {
  return name.split(' ').filter(Boolean).map(part => part[0]).slice(0, 2).join('').toUpperCase()
}

export function Sidebar({ collapsed, user }: { collapsed: boolean; user: AuthenticatedUser }) {
  const pathname = usePathname()
  const defaultOpen = navItems
    .filter(item => item.children?.some(c => c.href === pathname))
    .map(item => item.id)
  const [openGroups, setOpenGroups] = useState<string[]>(defaultOpen)

  const toggleGroup = (id: string) => {
    setOpenGroups(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id])
  }

  return (
    <aside
      className="h-full bg-card border-r border-border flex flex-col transition-all duration-300 overflow-hidden"
      style={{ width: collapsed ? 68 : 232 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-800 text-base flex-shrink-0">S</div>
        {!collapsed && <span className="font-700 text-base text-foreground">ShopDash</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-0.5">
        {navItems.map(item => {
          const hasChildren = !!item.children?.length
          const isOpen = openGroups.includes(item.id)
          const isParentActive = pathname === item.href || item.children?.some(c => c.href === pathname)

          return (
            <div key={item.id}>
              {/* Parent row — collapsed sidebars have no room for a submenu, so items with
                  children fall back to a direct link instead of the expand toggle. */}
              {hasChildren && !collapsed ? (
                <button
                  onClick={() => toggleGroup(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-500 transition-all duration-150 ${
                    isParentActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <span className="text-[17px] flex-shrink-0 leading-none">{item.icon}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                  <span className={isParentActive ? 'text-foreground/60' : 'text-muted-foreground/60'}>
                    <Chevron open={isOpen} />
                  </span>
                </button>
              ) : (
                <Link
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-500 transition-all duration-150 ${
                    isParentActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <span className="text-[17px] flex-shrink-0 leading-none">{item.icon}</span>
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className={`text-[10px] font-600 px-1.5 py-0.5 rounded-full ${isParentActive ? 'bg-white/20 text-white' : 'bg-primary/15 text-primary'}`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              )}

              {/* Children — animated expand */}
              {hasChildren && !collapsed && (
                <div
                  style={{
                    maxHeight: isOpen ? `${(item.children!.length) * 44}px` : '0px',
                    overflow: 'hidden',
                    transition: 'max-height 0.25s cubic-bezier(0.4,0,0.2,1)',
                  }}
                >
                  <div className="ml-3 mt-0.5 pl-3 border-l-2 border-border space-y-0.5 pb-1">
                    {item.children!.map(child => {
                      const childActive = pathname === child.href
                      return (
                        <Link
                          key={child.label}
                          href={child.href}
                          className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-[13px] font-500 transition-all duration-150 ${
                            childActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${childActive ? 'bg-primary' : 'bg-border'}`} />
                            {child.label}
                          </span>
                          {child.badge && (
                            <span className={`text-[10px] font-600 px-1.5 py-0.5 rounded-full ${childActive ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
                              {child.badge}
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-border">
        <div className={`flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-secondary transition-colors cursor-pointer ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex-shrink-0 flex items-center justify-center text-white text-xs font-700">{initials(user.name)}</div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-600 text-foreground truncate">{user.name}</div>
              <div className="text-[10px] text-muted-foreground truncate">{user.email}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
