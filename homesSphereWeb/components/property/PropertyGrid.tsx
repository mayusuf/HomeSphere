import type { Property } from '@/lib/api/properties'
import PropertyCard from './PropertyCard'
import EmptyState from '@/components/ui/EmptyState'
import { Search } from 'lucide-react'

interface PropertyGridProps {
  properties: Property[]
  showStatus?: boolean
}

export default function PropertyGrid({ properties, showStatus = false }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <EmptyState
        title="No matching properties found"
        description="Try adjusting your search filters or browse all available listings."
        icon={<Search size={28} />}
        action={{ label: 'Reset Filters', href: '/search' }}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} showStatus={showStatus} />
      ))}
    </div>
  )
}
