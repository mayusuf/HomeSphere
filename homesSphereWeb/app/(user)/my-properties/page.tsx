import Link from 'next/link'
import { Plus, Edit2, Eye } from 'lucide-react'
import { getPropertiesByUser } from '@/lib/api/properties'
import { getServerUserId } from '@/lib/api/getServerToken'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import { formatPrice, formatDate } from '@/lib/utils'
import Button from '@/components/ui/Button'
import DeletePropertyButton from './DeletePropertyButton'

export default async function MyPropertiesPage() {
  const userId = await getServerUserId()
  const properties = userId
    ? await getPropertiesByUser(userId, true).catch(() => [])
    : []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-hs-text">My Properties</h1>
          <p className="text-sm text-muted mt-1">Manage your property listings</p>
        </div>
        <Link href="/my-properties/new">
          <Button size="sm">
            <Plus size={16} />
            Add Property
          </Button>
        </Link>
      </div>

      {properties.length === 0 ? (
        <EmptyState
          title="No properties yet"
          description="Create your first property listing to start receiving inquiries from tenants."
          action={{ label: 'Add New Property', href: '/my-properties/new' }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Property</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide hidden md:table-cell">Price</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide hidden lg:table-cell">Listed</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide hidden sm:table-cell">Views</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {properties.map((property) => (
                <tr key={property.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-hs-text line-clamp-1">{property.title}</p>
                    <p className="text-xs text-muted">{property.address.city}, {property.address.state}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell font-mono text-primary font-medium">
                    {formatPrice(property.price)}{property.listingFor === 'RENT' ? '/mo' : ''}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted">
                    {formatDate(property.listedDate)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={property.status} />
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-muted">
                    <span className="flex items-center gap-1">
                      <Eye size={13} /> {property.viewCount}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/my-properties/${property.id}/edit`} aria-label={`Edit ${property.title}`}>
                        <Button variant="ghost" size="sm"><Edit2 size={14} /></Button>
                      </Link>
                      <DeletePropertyButton propertyId={property.id} propertyTitle={property.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
