import ListingForm from '@/components/forms/ListingForm'

export default function NewPropertyPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-hs-text mb-2">Add New Property</h1>
      <p className="text-sm text-muted mb-6">
        Fill in the details below. Your listing will be submitted for review before going live.
      </p>
      <div className="bg-white rounded-xl border border-border p-6">
        <ListingForm successRedirect="/my-properties" />
      </div>
    </div>
  )
}
