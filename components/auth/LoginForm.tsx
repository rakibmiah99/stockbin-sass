'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { loginAction } from '@/actions/auth'
import { FormAlert } from '@/components/ui/FormAlert'
import { InputGroup } from '@/components/ui/InputGroup'
import { Button } from '@/components/ui/Button'

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, undefined)

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && <FormAlert>{state.error}</FormAlert>}
      <InputGroup
        id="email" name="email" type="email" label="Email address" required
        placeholder="you@example.com"
      />
      <InputGroup
        id="password" name="password" type="password" label="Password" required
        action={<Link href="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>}
      />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? 'Signing in…' : 'Sign in'}
      </Button>
      <p className="text-center text-sm text-muted-foreground mt-6">
        No account?{' '}
        <Link href="/register" className="text-primary font-600 hover:underline">Create one</Link>
      </p>
    </form>
  )
}
