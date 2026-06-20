import Link from 'next/link'
import { Home } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <Home className="text-primary" size={20} />
              <span className="font-display text-lg font-bold text-primary">HomeSphere</span>
            </Link>
            <p className="text-sm text-muted leading-relaxed">
              Your trusted platform for finding and listing residential rentals.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-hs-text mb-3">Browse</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/search?houseType=apartment" className="hover:text-primary transition-colors">Apartments</Link></li>
              <li><Link href="/search?houseType=house" className="hover:text-primary transition-colors">Houses</Link></li>
              <li><Link href="/search?houseType=single-room" className="hover:text-primary transition-colors">Single Rooms</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-hs-text mb-3">Account</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/login" className="hover:text-primary transition-colors">Log In</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">Sign Up</Link></li>
              <li><Link href="/my-properties" className="hover:text-primary transition-colors">My Properties</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-hs-text mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li><span className="cursor-default">Help Center</span></li>
              <li><span className="cursor-default">Privacy Policy</span></li>
              <li><span className="cursor-default">Terms of Service</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted">
          &copy; {new Date().getFullYear()} HomeSphere. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
