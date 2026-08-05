'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { registerAction } from '@/actions/auth'
import { FormAlert } from '@/components/ui/FormAlert'
import { InputGroup } from '@/components/ui/InputGroup'
import { Button } from '@/components/ui/Button'

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, undefined)

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && <FormAlert>{state.error}</FormAlert>}
      <InputGroup id="name" name="name" label="Your name" required />
      <InputGroup id="email" name="email" type="email" label="Work email" required />
      <InputGroup id="password" name="password" type="password" label="Password" required />
      <InputGroup id="password_confirmation" name="password_confirmation" type="password" label="Confirm password" required />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? 'Creating account…' : 'Create account'}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have one?{' '}
        <Link href="/login" className="text-primary font-600 hover:underline">Sign in</Link>
      </p>
    </form>
  )
}
