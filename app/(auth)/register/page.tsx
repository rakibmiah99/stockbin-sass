import { AuthLayout } from '@/components/auth/AuthLayout'
import { RegisterForm } from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <AuthLayout title="Create your account" sub="Start your 14-day free trial — no card required">
      <RegisterForm />
    </AuthLayout>
  )
}
