'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search } from 'lucide-react'

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?city=${encodeURIComponent(query.trim())}`)
    } else {
      router.push('/search')
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
      <div className="relative flex-1">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by city..."
          className="w-full pl-10 pr-4 py-3 rounded-lg text-hs-text bg-white border-0 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
          aria-label="Search by city"
        />
      </div>
      <button
        type="submit"
        className="bg-accent text-white font-semibold px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors text-sm"
      >
        Search
      </button>
    </form>
  )
}
