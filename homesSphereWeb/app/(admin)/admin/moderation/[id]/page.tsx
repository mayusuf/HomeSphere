import { notFound } from 'next/navigation'
import { getPropertyByIdAdmin } from '@/lib/api/properties'
import { BedDouble, Bath, MapPin, CalendarCheck } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { formatPrice, formatDate } from '@/lib/utils'
import ModerationActions from './ModerationActions'
import Link from 'next/link'
import PropertyGallery from '@/components/property/PropertyGallery'

interface ModerationDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ModerationDetailPage({ params }: ModerationDetailPageProps) {
  const { id } = await params
  const property = await getPropertyByIdAdmin(id, true)

  if (!property) notFound()

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Link href="/admin/moderation" className="text-sm text-muted hover:text-primary transition-colors">
          ← Back to Queue
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <h1 className="font-display text-2xl font-bold text-hs-text">{property.title}</h1>
        <Badge status={property.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <PropertyGallery
            images={property.images.map((img) => img.imageUrl)}
            title={property.title}
          />

          <div className="bg-white rounded-xl border border-border p-5 space-y-4">
            <div className="flex items-start gap-2 text-muted">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              <span className="text-sm">
                {property.address.street}, {property.address.city}, {property.address.state} {property.address.zip}
              </span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-muted">
              <span className="flex items-center gap-1.5"><BedDouble size={16} /> {property.bedrooms} bedrooms</span>
              <span className="flex items-center gap-1.5"><Bath size={16} /> {property.bathrooms} bathrooms</span>
              {property.squareFootage && <span className="flex items-center gap-1.5">📐 {property.squareFootage} sqft</span>}
              {/* <span className="flex items-center gap-1.5"><CalendarCheck size={16} /> Available {formatDate(property.availableFrom)}</span> */}
            </div>
            <div>
              <h2 className="font-semibold text-hs-text mb-2">Description</h2>
              <div className="text-sm text-muted leading-relaxed" dangerouslySetInnerHTML={{ __html: property.descriptionHtml }} />
            </div>
            <div>
              <p className="text-sm text-muted">Owner contact name: <span className="font-medium text-hs-text">{property.listingAgentName}</span></p>
              <p className="text-sm text-muted">Owner contact phone: <span className="font-medium text-hs-text">{property.listingAgentPhone}</span></p>
              <p className="text-sm text-muted">Submitted: <span className="font-medium text-hs-text">{formatDate(property.listedDate)}</span></p>

            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-border p-5">
            <p className="text-3xl font-mono font-bold text-primary mb-1">
              {formatPrice(property.price)}
              {property.listingFor === 'RENT' && <span className="text-muted text-sm font-normal">/mo</span>}
            </p>
            <p className="text-sm text-muted capitalize mb-4">{property.houseType.replace('-', ' ')}</p>
            <div className="border-t border-border pt-3 mb-4 space-y-2 text-sm">
              <p className="text-muted">
                Listing for: <span className="font-medium text-hs-text">{property.listingFor === 'RENT' ? 'Rent' : 'Sale'}</span>
              </p>
              <p className="text-muted">
                Views: <span className="font-medium text-hs-text">{property.viewCount}</span>
              </p>
            </div>
            <ModerationActions propertyId={property.id} propertyStatus={property.status} />
          </div>
        </div>
      </div>
    </div>
  )
}
