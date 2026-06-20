import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-6">
        <span className="font-display text-8xl font-bold text-primary/20">404</span>
      </div>
      <h1 className="font-display text-3xl font-bold text-hs-text mb-3">Page not found</h1>
      <p className="text-muted mb-8 max-w-sm">
        Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-primary text-white font-medium px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
      >
        <Home size={18} />
        Back to Home
      </Link>
    </div>
  )
}
