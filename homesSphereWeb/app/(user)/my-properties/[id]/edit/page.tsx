import { notFound } from 'next/navigation'
import { getPropertyById } from '@/lib/api/properties'
import ListingForm from '@/components/forms/ListingForm'

interface EditPropertyPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params
  const property = await getPropertyById(id,true)

  if (!property) notFound()

  const defaultValues = {
    descriptionHtml:   property.descriptionHtml,
    houseType:         property.houseType,
    listingFor:        (property.listingFor ?? 'RENT') as 'SALE' | 'RENT',
    price:             property.price,
    bedrooms:          property.bedrooms,
    bathrooms:         property.bathrooms,
    squareFootage:     property.squareFootage,
    street:            property.address.street,
    city:              property.address.city,
    state:             property.address.state,
    zip:               property.address.zip,
    listingAgentName:  property.listingAgentName,
    listingAgentPhone: property.listingAgentPhone,
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-hs-text mb-2">Edit Property</h1>
      <p className="text-sm text-muted mb-6">Update property details.</p>
      <div className="bg-white rounded-xl border border-border p-6">
        <ListingForm
          defaultValues={defaultValues}
          isEdit
          propertyId={id}
          successRedirect="/my-properties"
          existingImages={property.images}
          propertyStatus={property.status}
        />
      </div>
    </div>
  )
}
