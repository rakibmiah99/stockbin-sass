'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'
import { forgotPasswordAction, verifyOtpAction, resetPasswordAction } from '@/actions/auth'
import { FormAlert } from '@/components/ui/FormAlert'
import { InputGroup } from '@/components/ui/InputGroup'
import { Button } from '@/components/ui/Button'

export function ForgotPasswordForm() {
  // Remounting the wizard on "start over" gives every step a fresh useActionState
  // instead of needing an effect to walk `step` back after a state already succeeded.
  const [attempt, setAttempt] = useState(0)
  return <Wizard key={attempt} onRestart={() => setAttempt(a => a + 1)} />
}

function Wizard({ onRestart }: { onRestart: () => void }) {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')

  const [sendState, sendAction, sendPending] = useActionState(forgotPasswordAction, undefined)
  const [verifyState, verifyAction, verifyPending] = useActionState(verifyOtpAction, undefined)
  const [resetState, resetAction, resetPending] = useActionState(resetPasswordAction, undefined)

  if (verifyState?.success) {
    return (
      <form action={resetAction} className="space-y-4">
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="otp" value={otp} />
        {resetState?.error && <FormAlert>{resetState.error}</FormAlert>}
        <InputGroup id="password" name="password" type="password" label="New password" required minLength={8} />
        <InputGroup id="password_confirmation" name="password_confirmation" type="password" label="Confirm new password" required minLength={8} />
        <Button type="submit" disabled={resetPending} className="w-full">
          {resetPending ? 'Resetting…' : 'Reset password'}
        </Button>
      </form>
    )
  }

  if (sendState?.success) {
    return (
      <form action={verifyAction} className="space-y-4">
        <input type="hidden" name="email" value={email} />
        {verifyState?.error && <FormAlert>{verifyState.error}</FormAlert>}
        <p className="text-sm text-muted-foreground">
          We sent a 4-digit code to <span className="font-600 text-foreground">{email}</span>.
        </p>
        <InputGroup
          id="otp" name="otp" label="Verification code" required maxLength={4} inputMode="numeric"
          value={otp} onChange={e => setOtp(e.target.value)}
          className="text-center tracking-[0.5em] font-mono"
        />
        <Button type="submit" disabled={verifyPending} className="w-full">
          {verifyPending ? 'Verifying…' : 'Verify code'}
        </Button>
        <Button
          type="button" variant="ghost" onClick={onRestart}
          className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
        >
          Use a different email
        </Button>
      </form>
    )
  }

  return (
    <form action={sendAction} className="space-y-4">
      {sendState?.error && <FormAlert>{sendState.error}</FormAlert>}
      <InputGroup
        id="email" name="email" type="email" label="Email address" required
        value={email} onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com"
      />
      <Button type="submit" disabled={sendPending} className="w-full">
        {sendPending ? 'Sending code…' : 'Send reset code'}
      </Button>
      <p className="text-center text-sm text-muted-foreground mt-6">
        Remembered it?{' '}
        <Link href="/login" className="text-primary font-600 hover:underline">Back to sign in</Link>
      </p>
    </form>
  )
}
