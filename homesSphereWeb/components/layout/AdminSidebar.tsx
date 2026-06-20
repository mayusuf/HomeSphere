'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Shield, Users, BarChart3, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/moderation', label: 'Moderation', icon: Shield },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <nav className="bg-white rounded-xl border border-border p-4 sticky top-24" aria-label="Admin navigation">
        <Link href="/admin/dashboard" className="flex items-center gap-2 mb-6 px-2">
          <Home size={18} className="text-primary" />
          <span className="font-display text-base font-bold text-primary">Admin Panel</span>
        </Link>
        <ul className="space-y-1">
          {links.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href))
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
