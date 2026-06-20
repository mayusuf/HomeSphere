'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { SlidersHorizontal, X, Search, ArrowUpDown } from 'lucide-react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'

const listingForOptions = [
  { value: 'RENT', label: 'Rent' },
  { value: 'SALE', label: 'Sale' },
]

const houseTypeOptions = [
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'HOUSE', label: 'House' },
  { value: 'SINGLE_ROOM', label: 'Single Room' },
  { value: 'TOWNHOUSE', label: 'Townhouse' },
]

const bedroomOptions = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
]

const bathroomOptions = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
]

const sortByOptions = [
  { value: 'listedDate', label: 'Date Listed' },
  { value: 'price', label: 'Price' },
  { value: 'bedrooms', label: 'Bedrooms' },
  { value: 'bathrooms', label: 'Bathrooms' },
]

const sortDirectionOptions = [
  { value: 'desc', label: 'Newest first' },
  { value: 'asc', label: 'Oldest first' },
]

const EMPTY = {
  search: '',
  listingFor: '',
  houseType: '',
  city: '',
  bedrooms: '',
  bathrooms: '',
  sortBy: '',
  sortDirection: '',
}

const TYPE_TO_LISTING: Record<string, string> = { buy: 'SALE', rent: 'RENT' }

function readParams(searchParams: ReturnType<typeof useSearchParams>) {
  if (!searchParams) return EMPTY
  const type = searchParams.get('type')?.toLowerCase() ?? ''
  return {
    search: searchParams.get('search') ?? '',
    listingFor: searchParams.get('listingFor') ?? (TYPE_TO_LISTING[type] ?? ''),
    houseType: searchParams.get('houseType') ?? '',
    city: searchParams.get('city') ?? '',
    bedrooms: searchParams.get('bedrooms') ?? '',
    bathrooms: searchParams.get('bathrooms') ?? '',
    sortBy: searchParams.get('sortBy') ?? '',
    sortDirection: searchParams.get('sortDirection') ?? '',
  }
}

export default function FilterBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState(() => readParams(searchParams))

  useEffect(() => {
    setFilters(readParams(searchParams))
  }, [searchParams])

  function set(key: keyof typeof EMPTY, value: string) {
    setFilters((f) => ({ ...f, [key]: value }))
  }

  function applyFilters() {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    router.push(`${pathname}?${params.toString()}`)
  }

  function resetFilters() {
    setFilters(EMPTY)
    router.push('/search')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') applyFilters()
  }

  const hasFilters = Object.values(filters).some(Boolean)

  return (
    <div className="bg-white border border-border rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal size={16} className="text-primary" />
        <h2 className="text-sm font-semibold text-hs-text">Filter &amp; Sort</h2>
        {hasFilters && (
          <button
            onClick={resetFilters}
            className="ml-auto text-xs text-muted hover:text-error flex items-center gap-1 transition-colors"
            aria-label="Reset all filters"
          >
            <X size={12} />
            Reset all
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-2">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none mt-3" />
        <Input
          id="search"
          label="Search"
          placeholder="e.g. sea view, garden, modern..."
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-9"
        />
      </div>

      {/* Main filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-3">
        <Select
          id="listingFor"
          label="Listing For"
          value={filters.listingFor}
          onChange={(e) => set('listingFor', e.target.value)}
          options={listingForOptions}
          placeholder="Any"
        />
        <Select
          id="houseType"
          label="House Type"
          value={filters.houseType}
          onChange={(e) => set('houseType', e.target.value)}
          options={houseTypeOptions}
          placeholder="Any type"
        />
        <Input
          id="city"
          label="City"
          placeholder="e.g. Algiers"
          value={filters.city}
          onChange={(e) => set('city', e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Select
          id="bedrooms"
          label="Bedrooms"
          value={filters.bedrooms}
          onChange={(e) => set('bedrooms', e.target.value)}
          options={bedroomOptions}
          placeholder="Any"
        />
        <Select
          id="bathrooms"
          label="Bathrooms"
          value={filters.bathrooms}
          onChange={(e) => set('bathrooms', e.target.value)}
          options={bathroomOptions}
          placeholder="Any"
        />
      </div>

      {/* Sort */}
      <div className="flex flex-wrap items-end gap-3 mb-4">
        <ArrowUpDown size={15} className="text-muted mb-2.5 shrink-0" />
        <div className="w-44">
          <Select
            id="sortBy"
            label="Sort By"
            value={filters.sortBy}
            onChange={(e) => set('sortBy', e.target.value)}
            options={sortByOptions}
            placeholder="Default"
          />
        </div>
        <div className="w-44">
          <Select
            id="sortDirection"
            label="Direction"
            value={filters.sortDirection}
            onChange={(e) => set('sortDirection', e.target.value)}
            options={sortDirectionOptions}
            placeholder="—"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={applyFilters} size="sm">
          Apply Filters
        </Button>
        {hasFilters && (
          <Button variant="secondary" size="sm" onClick={resetFilters}>
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  )
}
