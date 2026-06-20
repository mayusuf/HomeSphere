'use client'

import { useEffect } from 'react'
import Button from '@/components/ui/Button'
import { AlertTriangle } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle size={28} className="text-error" />
      </div>
      <h1 className="font-display text-3xl font-bold text-hs-text mb-3">Something went wrong</h1>
      <p className="text-muted mb-8 max-w-sm">
        An unexpected error occurred. Please try again or contact support if the problem persists.
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  )
}
