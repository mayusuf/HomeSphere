import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FilterBar from '@/components/filters/FilterBar'
import PropertyGrid from '@/components/property/PropertyGrid'
import Pagination from '@/components/ui/Pagination'
import { PropertyGridSkeleton } from '@/components/ui/Skeleton'
import { getPropertiesPaged, type PropertyFilters } from '@/lib/api/properties'
import ToastContainer from '@/components/ui/Toast'

interface SearchPageProps {
  searchParams: Promise<PropertyFilters>
}

async function Results({ searchParams }: { searchParams: PropertyFilters }) {
  const { items, totalPages, totalElements, currentPage } = await getPropertiesPaged(searchParams)
  return (
    <>
      <PropertyGrid properties={items} />
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

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams

  return (
    <>
      <Navbar />
      <ToastContainer />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h1 className="font-display text-3xl font-bold text-hs-text mb-6">Browse Properties</h1>

        <Suspense fallback={null}>
          <FilterBar />
        </Suspense>

        <div className="mt-8">
          <Suspense fallback={<PropertyGridSkeleton />}>
            <Results searchParams={params} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
