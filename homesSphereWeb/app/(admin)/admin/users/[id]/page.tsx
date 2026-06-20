import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getUserByIdAdmin } from '@/lib/api/users'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import EditUserForm from './EditUserForm'

interface UserDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params
  const user = await getUserByIdAdmin(id, true)

  if (!user) notFound()

  return (
    <div>
      <div className="mb-4">
        <Link href="/admin/users" className="text-sm text-muted hover:text-primary transition-colors">
          ← Back to Users
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <h1 className="font-display text-2xl font-bold text-hs-text">
          {user.first_name} {user.last_name}
        </h1>
        <Badge status={user.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Edit form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="font-semibold text-hs-text mb-4">Edit Information</h2>
            <EditUserForm user={user} />
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-border p-5 space-y-3">
            <h2 className="font-semibold text-hs-text">Account Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">User ID</span>
                <span className="font-mono text-xs text-hs-text">{user.user_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Role</span>
                <span className="font-medium text-hs-text">{user.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Status</span>
                <Badge status={user.status} />
              </div>
              {user.createdAt && (
                <div className="flex justify-between">
                  <span className="text-muted">Joined</span>
                  <span className="text-hs-text">{formatDate(user.createdAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
