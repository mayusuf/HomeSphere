import { Suspense } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FilterBar from '@/components/filters/FilterBar'
import Badge from '@/components/ui/Badge'
import Pagination from '@/components/ui/Pagination'
import EmptyState from '@/components/ui/EmptyState'
import { PropertyGridSkeleton } from '@/components/ui/Skeleton'
import { getPropertiesPagedAdmin, type PropertyFilters } from '@/lib/api/properties'
import { formatPrice, formatDate } from '@/lib/utils'
import ToastContainer from '@/components/ui/Toast'

interface ModerationPageProps {
  searchParams: Promise<PropertyFilters>
}

async function Results({ searchParams }: { searchParams: PropertyFilters }) {
  const { items, totalPages, totalElements, currentPage } = await getPropertiesPagedAdmin(searchParams, true)

  if (items.length === 0) {
    return (
      <EmptyState
        title="No properties pending moderation"
        description="There are no listings matching the current filters. Try resetting the filters or adjusting your search."
        action={{ label: 'Reset Filters', href: '/admin/moderation' }}
      />
    )
  }

  return (
    <>
      <div className="overflow-x-auto bg-white rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Property</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide hidden md:table-cell">Location</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide hidden lg:table-cell">Price</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide hidden sm:table-cell">Listed</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide hidden sm:table-cell">Listed</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((property) => (
              <tr key={property.id} className="hover:bg-surface/50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-hs-text line-clamp-1">{property.title}</p>
                  <p className="text-xs text-muted line-clamp-1">{property.houseType.replace('-', ' ')}</p>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-muted">
                  {property.address.city}, {property.address.state}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell font-mono text-primary font-medium">
                  {formatPrice(property.price)}{property.listingFor === 'RENT' ? '/mo' : ''}
                </td>
                 <td className="px-4 py-3">
                  {property.listingFor && (
                    <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      property.listingFor === 'SALE' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
                    }`}>
                      {property.listingFor === 'SALE' ? 'Sale' : 'Rent'}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge status={property.status} />
                </td>
                <td className="px-4 py-3 hidden sm:table-cell text-muted">
                  {formatDate(property.listedDate)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/moderation/${property.id}`} className="text-sm text-primary hover:underline">
                    Review
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Suspense>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={totalElements}
        />
      </Suspense>
    </>
  )
}

export default async function ModerationPage({ searchParams }: ModerationPageProps) {
  const params = await searchParams

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex flex-col">
        <h1 className="font-display text-3xl font-bold text-hs-text mb-6">Moderation</h1>

        <Suspense fallback={null}>
          <FilterBar />
        </Suspense>

        <div className="mt-8">
          <Suspense fallback={<PropertyGridSkeleton />}>
            <Results searchParams={params} />
          </Suspense>
        </div>
      </div>
    </>
  )
}
