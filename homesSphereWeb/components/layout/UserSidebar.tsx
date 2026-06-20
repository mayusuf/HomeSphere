'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Heart, MessageSquare, Home, Building2, KeyRound } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/profile',         label: 'My Profile',     icon: User },
  { href: '/change-password', label: 'Change Password', icon: KeyRound },
  { href: '/my-properties',   label: 'My Properties',  icon: Building2 },
  { href: '/favorites',       label: 'Favorites',      icon: Heart },
  { href: '/inquiries',       label: 'My Inquiries',   icon: MessageSquare },
]

export default function UserSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <nav className="bg-white rounded-xl border border-border p-4 sticky top-24" aria-label="User navigation">
        <Link href="/" className="flex items-center gap-2 mb-6 px-2">
          <Home size={18} className="text-primary" />
          <span className="font-display text-base font-bold text-primary">HomeSphere</span>
        </Link>
        <ul className="space-y-1">
          {links.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted hover:bg-surface hover:text-hs-text'
                )}
                aria-current={pathname === href ? 'page' : undefined}
              >
                <Icon size={18} />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
