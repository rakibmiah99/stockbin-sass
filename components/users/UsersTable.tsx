'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { UserFormModal } from './UserFormModal'
import { DeleteUserButton } from './DeleteUserButton'
import { UserStatusToggle } from './UserStatusToggle'
import type { ManagedUser } from '@/types/User'

const ROLE_STYLES: Record<string, string> = {
  admin: 'bg-primary/15 text-primary',
  manager: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400',
  salesman: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
}

export function UsersTable({ users, currentUserId }: { users: ManagedUser[]; currentUserId: number }) {
  const [modal, setModal] = useState<{ open: boolean; user: ManagedUser | null }>({ open: false, user: null })

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-700">Users</h1>
        <Button onClick={() => setModal({ open: true, user: null })}>+ Add user</Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden mt-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Name', 'Email', 'Role', 'Status', ''].map(h => (
                  <th key={h} className="text-left text-xs font-600 text-muted-foreground px-5 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-foreground">No users yet.</td></tr>
              ) : users.map((u, i) => {
                const isSelf = u.id === currentUserId
                return (
                  <tr key={u.id} className={`hover:bg-muted/40 transition-colors ${i < users.length - 1 ? 'border-b border-border' : ''}`}>
                    <td className="px-5 py-3.5 font-500">{u.name}{isSelf && <span className="text-xs text-muted-foreground"> (you)</span>}</td>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={`font-mono text-[11px] font-500 px-2 py-0.5 rounded-full capitalize ${ROLE_STYLES[u.role] ?? ''}`}>{u.role}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <UserStatusToggle id={u.id} isActive={u.is_active} disabled={isSelf} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Button variant="link" onClick={() => setModal({ open: true, user: u })}>Edit</Button>
                        {!isSelf && <DeleteUserButton id={u.id} name={u.name} />}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <UserFormModal
        open={modal.open}
        user={modal.user}
        onClose={() => setModal({ open: false, user: null })}
      />
    </>
  )
}
