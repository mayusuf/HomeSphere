import { getUsers } from '@/lib/api/users'
import { getServerUserId } from '@/lib/api/getServerToken'
import { formatDate } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import DeleteUserButton from './DeleteUserButton'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Plus } from 'lucide-react'

export default async function AdminUsersPage() {
  const currentAdminId = await getServerUserId()
  const users = await getUsers(true).catch(() => [])


  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-hs-text mb-6">User Management</h1>
      <Link href="/admin/users/new" className="mb-4 inline-block">
        <Button size="sm">
          <Plus size={16} />
          Add admin
        </Button>
      </Link>
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">User</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide hidden sm:table-cell">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide hidden lg:table-cell">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.user_id} className="hover:bg-surface/50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-hs-text">{user.first_name} {user.last_name}</p>
                  <p className="text-xs text-muted">{user.email}</p>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="text-sm text-muted">{user.role}</span>
                </td>
                <td className="px-4 py-3">
                  <Badge status={user.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="mr-2 inline-block">
                    <Link href={`/admin/users/${user.user_id}`} className="text-xs text-primary hover:underline">Manage</Link>
                  </span>
                  <DeleteUserButton
                    userId={user.user_id}
                    userName={`${user.first_name} ${user.last_name}`}
                    currentAdminId={currentAdminId} currentStatus={''} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
