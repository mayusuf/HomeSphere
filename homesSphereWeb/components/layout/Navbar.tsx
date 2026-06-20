'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Home, User, LayoutDashboard, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))
  return match ? match[1] : null
}

function accountHref(role: string): string {
  if (role === 'ADMIN') return '/profile'
  return '/profile'
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [role, setRole] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  useEffect(() => {
    setRole(getCookie('hs_role'))
  }, [pathname])

  const navLinks = [
    { href: '/search?type=buy', label: 'Buy' },
    { href: '/search?type=rent', label: 'Rent' },
  ]

  function clearSession() {
    const expired = '; path=/; max-age=0'
    document.cookie = `hs_role=${expired}`
    document.cookie = `hs_token=${expired}`
    document.cookie = `hs_refresh_token=${expired}`
    document.cookie = `hs_user_id=${expired}`
    localStorage.removeItem('hs_token')
    localStorage.removeItem('hs_refresh_token')
    localStorage.removeItem('hs_user_id')
    setRole(null)
    router.push('/')
  }

  async function handleLogout() {
    const refreshToken =
      localStorage.getItem('hs_refresh_token') ??
      document.cookie.match(/(?:^|;\s*)hs_refresh_token=([^;]+)/)?.[1]

    try {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })
    } catch {
      // proceed with local logout even if the API call fails
    }

    clearSession()
  }

  const isLoggedIn = !!role

  const AuthButtons = ({ mobile = false }: { mobile?: boolean }) => (
    isLoggedIn ? (
      <div className={`flex ${mobile ? 'flex-col' : 'items-center'} gap-2`}>
        {role === 'ADMIN' && (
          <Link href="/admin/dashboard">
            <Button variant="secondary" size="sm" className={mobile ? 'w-full justify-start' : ''}>
              <LayoutDashboard size={15} />
              Admin
            </Button>
          </Link>
        )}
        {role === 'USER' && (
          <Link href={accountHref(role!)}>
            <Button variant="secondary" size="sm" className={mobile ? 'w-full justify-start' : ''}>
              <User size={15} />
              Account
            </Button>
          </Link>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className={`text-muted hover:text-error ${mobile ? 'w-full justify-start' : ''}`}
        >
          <LogOut size={15} />
          Log out
        </Button>
      </div>
    ) : (
      <div className={`flex ${mobile ? 'flex-col' : 'items-center'} gap-2`}>
        <Button
          variant="secondary"
          size="sm"
          className={mobile ? 'w-full' : ''}
          onClick={() => { router.push('/login'); setMobileOpen(false) }}
        >
          Log in
        </Button>
        <Button
          size="sm"
          className={mobile ? 'w-full' : ''}
          onClick={() => { router.push('/register'); setMobileOpen(false) }}
        >
          Sign up
        </Button>
      </div>
    )
  )

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Home className="text-primary" size={24} />
            <span className="font-display text-xl font-bold text-primary tracking-tight">
              HomeSphere
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href ? 'text-primary' : 'text-muted'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <AuthButtons />
          </div>

          <button
            className="md:hidden p-2 text-muted hover:text-primary transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-hs-text hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <AuthButtons mobile />
          </div>
        </div>
      )}
    </header>
  )
}
