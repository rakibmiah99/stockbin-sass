'use client'

import { useState, useTransition } from 'react'
import { Toggle } from '@/components/ui/Toggle'
import { updateUserStatusAction } from '@/actions/users'

export function UserStatusToggle({ id, isActive, disabled }: { id: number; isActive: boolean; disabled?: boolean }) {
  const [active, setActive] = useState(isActive)
  const [, startTransition] = useTransition()

  function handleChange(next: boolean) {
    setActive(next)
    startTransition(async () => {
      const result = await updateUserStatusAction(id, next)
      if (result?.error) {
        setActive(!next)
      }
    })
  }

  return <Toggle on={active} onChange={handleChange} disabled={disabled} />
}
