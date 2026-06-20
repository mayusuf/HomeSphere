import { notFound } from 'next/navigation'
import { BedDouble, Bath, MapPin, Mail, Ruler, CalendarCheck, Phone, User, Tag } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PropertyGallery from '@/components/property/PropertyGallery'
import Badge from '@/components/ui/Badge'
import { getPropertyById } from '@/lib/api/properties'
import { formatPrice, formatDate } from '@/lib/utils'
import InquiryButton from './InquiryButton'
import ToastContainer from '@/components/ui/Toast'

export const dynamic = 'force-dynamic'

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params
  const property = await getPropertyById(id, false)

  if (!property) notFound()

  const isForSale = property.listingFor === 'SALE'

  return (
    <>
      <Navbar />
      <ToastContainer />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* Header */}
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge status={property.status} />
          <span className="text-sm text-muted capitalize">{property.houseType.replace('-', ' ')}</span>
          {property.listingFor && (
            <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              isForSale ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
            }`}>
              <Tag size={11} />
              {isForSale ? 'For Sale' : 'For Rent'}
            </span>
          )}
        </div>

        {property.title && (
          <h1 className="font-display text-3xl font-bold text-hs-text mb-4">{property.title}</h1>
        )}

        <PropertyGallery images={property.images.map((img) => img.imageUrl)} title={property.title || 'Property'} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Address */}
            <div className="flex items-start gap-2 text-muted">
              <MapPin size={18} className="shrink-0 mt-0.5" />
              <span>
                {[property.address.street, property.address.city, property.address.state, property.address.zip]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <div className="flex items-center gap-2 text-sm text-muted">
                <BedDouble size={16} className="text-primary" />
                <span>{property.bedrooms} bedroom{property.bedrooms !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <Bath size={16} className="text-primary" />
                <span>{property.bathrooms} bathroom{property.bathrooms !== 1 ? 's' : ''}</span>
              </div>
              {property.squareFootage != null && (
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Ruler size={16} className="text-primary" />
                  <span>{property.squareFootage.toLocaleString()} m²</span>
                </div>
              )}
              {property.availableFrom && (
                <div className="flex items-center gap-2 text-sm text-muted">
                  <CalendarCheck size={16} className="text-primary" />
                  <span>Available {formatDate(property.availableFrom)}</span>
                </div>
              )}
              {property.listedDate && (
                <div className="text-sm text-muted">
                  Listed {formatDate(property.listedDate)}
                </div>
              )}
            </div>

            {/* Description */}
            {property.descriptionHtml && (
              <div>
                <h2 className="font-display text-xl font-bold text-hs-text mb-3">About This Property</h2>
                <div
                  className="prose prose-sm max-w-none text-muted"
                  dangerouslySetInnerHTML={{ __html: property.descriptionHtml }}
                />
              </div>
            )}

            {/* Agent */}
            {(property.listingAgentName || property.listingAgentPhone || property.ownerContact) && (
              <div className="bg-surface rounded-xl p-4 border border-border space-y-3">
                <h2 className="font-semibold text-hs-text flex items-center gap-2">
                  <User size={16} className="text-primary" />
                  Listing Agent
                </h2>
                {property.listingAgentName && (
                  <p className="text-sm text-hs-text font-medium">{property.listingAgentName}</p>
                )}
                {property.listingAgentPhone && (
                  <a
                    href={`tel:${property.listingAgentPhone}`}
                    className="flex items-center gap-2 text-sm text-primary hover:underline w-fit"
                  >
                    <Phone size={14} />
                    {property.listingAgentPhone}
                  </a>
                )}
                {property.ownerContact && (
                  <a
                    href={`mailto:${property.ownerContact}`}
                    className="flex items-center gap-2 text-sm text-primary hover:underline w-fit"
                  >
                    <Mail size={14} />
                    {property.ownerContact}
                  </a>
                )}
              </div>
            )}

            {/* Map placeholder */}
            <div className="bg-surface rounded-xl p-4 border border-border">
              <h3 className="text-sm font-medium text-muted mb-2">Location</h3>
              <div className="h-40 bg-border/40 rounded-lg flex items-center justify-center text-muted text-sm">
                {property.address.city}{property.address.state ? `, ${property.address.state}` : ''}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-border p-5 sticky top-24 space-y-4">

              {/* Price */}
              <div>
                <span className="font-mono text-3xl font-bold text-primary">
                  {formatPrice(property.price)}
                </span>
                {property.listingFor === 'RENT' && (
                  <span className="text-muted text-sm"> /mo</span>
                )}
              </div>

              {/* Quick details */}
              <div className="grid grid-cols-2 gap-2 text-sm border-t border-border pt-4">
                <div>
                  <p className="text-xs text-muted">Type</p>
                  <p className="font-medium text-hs-text capitalize">{property.houseType.replace('-', ' ')}</p>
                </div>
                {property.listingFor && (
                  <div>
                    <p className="text-xs text-muted">Listing</p>
                    <p className="font-medium text-hs-text">{isForSale ? 'For Sale' : 'For Rent'}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted">Bedrooms</p>
                  <p className="font-medium text-hs-text">{property.bedrooms}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Bathrooms</p>
                  <p className="font-medium text-hs-text">{property.bathrooms}</p>
                </div>
                {property.squareFootage != null && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted">Area</p>
                    <p className="font-medium text-hs-text">{property.squareFootage.toLocaleString()} m²</p>
                  </div>
                )}
                {property.availableFrom && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted">Available From</p>
                    <p className="font-medium text-hs-text">{formatDate(property.availableFrom)}</p>
                  </div>
                )}
              </div>

              <InquiryButton propertyTitle={property.title || 'this property'} />

              {property.viewCount >= -1 && (
                <p className="text-xs text-muted text-center">
                  {property.viewCount} people viewed this listing
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
