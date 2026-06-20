import { PropertyGridSkeleton } from '@/components/ui/Skeleton'

export default function GlobalLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="h-8 bg-border/60 rounded-lg w-48 mb-8 animate-pulse" />
      <PropertyGridSkeleton count={6} />
    </div>
  )
}
