import { getAllProperties } from '@/lib/api/properties'
import { getUsers } from '@/lib/api/users'
import { getAllInquiries } from '@/lib/api/inquiries'
import { Home, Users, MessageSquare, TrendingUp } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const [properties, users, inquiries] = await Promise.all([
    getAllProperties(true),
    getUsers(true),
    getAllInquiries(),
  ])

  const activeListings = properties.filter((p) => p.status === 'approved').length
  const pendingListings = properties.filter((p) => p.status === 'pending').length
  const totalUsers = users.length

  const stats = [
    { label: 'Active Listings', value: activeListings, icon: Home, color: 'text-primary bg-primary/10' },
    { label: 'Pending Review', value: pendingListings, icon: TrendingUp, color: 'text-amber-500 bg-amber-50' },
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'text-blue-500 bg-blue-50' },
    { label: 'Total Inquiries', value: inquiries.length, icon: MessageSquare, color: 'text-success bg-success/10' },
  ]

  const mostViewed = [...properties].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5)

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-hs-text mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-border p-5">
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-hs-text font-mono">{stat.value}</p>
            <p className="text-sm text-muted mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-hs-text">Most Viewed Properties</h2>
            <Link href="/admin/reports" className="text-xs text-primary hover:underline">Reports</Link>
          </div>
          <div className="space-y-3">
            {mostViewed.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-hs-text truncate">{p.title}</p>
                  <p className="text-xs text-muted">{p.address.city} · {formatPrice(p.price)}{p.listingFor === 'RENT' ? '/mo' : ''}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono text-muted">{p.viewCount} views</span>
                  <Badge status={p.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-hs-text">Pending Moderation</h2>
            <Link href="/admin/moderation" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          {properties.filter((p) => p.status === 'pending').length === 0 ? (
            <p className="text-sm text-muted">No listings pending review.</p>
          ) : (
            <div className="space-y-3">
              {properties.filter((p) => p.status === 'pending').map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-hs-text truncate">{p.title}</p>
                    <p className="text-xs text-muted">{p.address.city}</p>
                  </div>
                  <Link
                    href={`/admin/moderation/${p.id}`}
                    className="text-xs text-primary hover:underline shrink-0"
                  >
                    Review →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
