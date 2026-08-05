'use client'

import { useState, useTransition } from 'react'
import { createUserAction, updateUserAction } from '@/actions/users'
import { Modal } from '@/components/ui/Modal'
import { FormAlert } from '@/components/ui/FormAlert'
import { InputGroup } from '@/components/ui/InputGroup'
import { Label } from '@/components/ui/Label'
import { Button } from '@/components/ui/Button'
import type { ManagedUser } from '@/types/User'

export function UserFormModal({ open, onClose, user }: {
  open: boolean; onClose: () => void; user: ManagedUser | null
}) {
  const isEdit = Boolean(user)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = isEdit
        ? await updateUserAction(user!.id, formData)
        : await createUserAction(formData)
      if (result?.error) {
        setError(result.error)
        return
      }
      onClose()
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit user' : 'Add user'}>
      <form action={handleSubmit} className="space-y-4">
        {error && <FormAlert>{error}</FormAlert>}
        <InputGroup id="name" name="name" label="Full name" required defaultValue={user?.name} />
        <InputGroup id="email" name="email" type="email" label="Email" required defaultValue={user?.email} />
        <div>
          <Label htmlFor="role" className="block mb-1.5">Role</Label>
          <select
            id="role" name="role" defaultValue={user?.role ?? 'salesman'}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-card-foreground text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="salesman">Salesman</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <InputGroup
          id="password" name="password" type="password"
          label={isEdit ? 'New password (optional)' : 'Password'}
          required={!isEdit} minLength={8}
        />
        <InputGroup
          id="password_confirmation" name="password_confirmation" type="password"
          label={isEdit ? 'Confirm new password' : 'Confirm password'}
          required={!isEdit} minLength={8}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? 'Saving…' : isEdit ? 'Save changes' : 'Add user'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
