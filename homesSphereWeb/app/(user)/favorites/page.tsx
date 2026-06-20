import { Heart } from 'lucide-react'
import PropertyGrid from '@/components/property/PropertyGrid'
import EmptyState from '@/components/ui/EmptyState'
import { getPropertyById } from '@/lib/api/properties'

const SAVED_IDS = ['prop_001', 'prop_007']

export default async function FavoritesPage() {
  const properties = await Promise.all(SAVED_IDS.map((id) => getPropertyById(id,true)))
  const valid = properties.filter(Boolean) as Awaited<ReturnType<typeof getPropertyById> & {}>[]

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="font-display text-2xl font-bold text-hs-text">Favorites</h1>
        <span className="text-sm text-muted">({valid.length})</span>
      </div>

      {valid.length === 0 ? (
        <EmptyState
          title="No saved properties"
          description="Browse listings and save your favorites to view them here."
          icon={<Heart size={28} />}
          action={{ label: 'Browse Properties', href: '/search' }}
        />
      ) : (
        <PropertyGrid properties={valid as any} />
      )}
    </div>
  )
}
