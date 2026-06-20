import Link from 'next/link'
import { Home } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Home size={24} className="text-primary" />
        <span className="font-display text-2xl font-bold text-primary">HomeSphere</span>
      </Link>
      <div className="w-full max-w-md bg-white rounded-xl border border-border shadow-sm p-8">
        {children}
      </div>
    </div>
  )
}
