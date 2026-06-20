'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number   // 0-indexed
  totalPages: number
  totalElements: number
}

const btnBase =
  'flex items-center justify-center rounded-lg border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30'
const btnPage = `${btnBase} w-9 h-9 border-border text-hs-text hover:border-primary hover:text-primary`
const btnActive = `${btnBase} w-9 h-9 border-primary bg-primary text-white`
const btnNav = `${btnBase} p-2 border-border text-muted hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed`

export default function Pagination({ currentPage, totalPages, totalElements }: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams?.toString() ?? '')
    params.set('page', String(page))
    router.push(`${pathname}?${params.toString()}`)
  }

  const MAX = 5
  let start = Math.max(0, currentPage - Math.floor(MAX / 2))
  const end = Math.min(totalPages, start + MAX)
  if (end - start < MAX) start = Math.max(0, end - MAX)
  const pages = Array.from({ length: end - start }, (_, i) => start + i)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8">
      <p className="text-sm text-muted order-2 sm:order-1">
        {totalElements} {totalElements === 1 ? 'property' : 'properties'} found
      </p>

      <div className="flex items-center gap-1 order-1 sm:order-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 0}
          className={btnNav}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {start > 0 && (
          <>
            <button onClick={() => goToPage(0)} className={btnPage}>1</button>
            {start > 1 && <span className="w-9 text-center text-muted text-sm">…</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={page === currentPage ? btnActive : btnPage}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page + 1}
          </button>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="w-9 text-center text-muted text-sm">…</span>}
            <button onClick={() => goToPage(totalPages - 1)} className={btnPage}>
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className={btnNav}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
