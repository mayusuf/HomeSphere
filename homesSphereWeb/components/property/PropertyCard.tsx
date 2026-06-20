import Link from 'next/link'
import Image from 'next/image'
import { BedDouble, Bath, MapPin } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import type { Property } from '@/lib/api/properties'

interface PropertyCardProps {
  property: Property
  showStatus?: boolean
}

export default function PropertyCard({ property, showStatus = false }: PropertyCardProps) {
  return (
    <article className="group bg-white rounded-xl overflow-hidden border-l-4 border-primary border border-border hover:border-primary/40 hover:shadow-md motion-safe:transition-all duration-200">
      <Link href={`/property/${property.id}`} className="block">
        <div className="relative h-48 bg-surface overflow-hidden">
          <Image
            src={property.images[0]?.imageUrl ?? '/mock/placeholder.jpg'}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 motion-safe:transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            {showStatus && <Badge status={property.status} />}
            <span className="bg-white/90 backdrop-blur-sm text-xs font-medium px-2 py-0.5 rounded-full text-hs-text capitalize">
              {property.houseType.replace('-', ' ')}
            </span>
            {property.listingFor && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                property.listingFor === 'SALE'
                  ? 'bg-accent/90 text-white'
                  : 'bg-primary/90 text-white'
              }`}>
                {property.listingFor === 'SALE' ? 'For Sale' : 'For Rent'}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/property/${property.id}`}>
          <h3 className="font-semibold text-hs-text line-clamp-1 hover:text-primary transition-colors mb-1">
            {property.title}
          </h3>
        </Link>
        <div className="flex items-center gap-1 text-muted text-xs mb-3">
          <MapPin size={12} />
          <span>{property.address.city}, {property.address.state}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted mb-4">
          <span className="flex items-center gap-1">
            <BedDouble size={15} />
            {property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <Bath size={15} />
            {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono font-bold text-primary text-lg">
            {formatPrice(property.price)}
            {property.listingFor === 'RENT' && <span className="text-muted font-normal text-xs">/mo</span>}
          </span>
          <Link
            href={`/property/${property.id}`}
            className="text-xs font-medium text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}
