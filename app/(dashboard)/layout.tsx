import { getCurrentUser } from '@/lib/auth/session'
import { DashboardShell } from '@/components/layout/DashboardShell'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  return <DashboardShell user={user}>{children}</DashboardShell>
}
