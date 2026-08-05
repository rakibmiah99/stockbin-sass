import { AuthLayout } from '@/components/auth/AuthLayout'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title="Reset your password" sub="We'll email you a code to get back into your account">
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
