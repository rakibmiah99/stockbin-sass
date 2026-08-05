import { getCurrentUser } from '@/lib/auth/session'
import { usersApi } from '@/lib/api/users'
import { UsersTable } from '@/components/users/UsersTable'

export default async function UsersPage() {
  const user = await getCurrentUser()

  if (user.role !== 'admin') {
    return (
      <div className="p-6">
        <div className="bg-card border border-border rounded-xl p-8 text-center text-sm text-muted-foreground">
          Only admins can manage users.
        </div>
      </div>
    )
  }

  const response = await usersApi.list()
  const users = response.success ? response.data : []

  return (
    <div className="p-6">
      <UsersTable users={users} currentUserId={user.id} />
    </div>
  )
}
