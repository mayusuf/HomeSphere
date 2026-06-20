'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '@/lib/validations/authSchema'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

function parseJwt(token: string): Record<string, unknown> {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return {}
  }
}

function extractToken(body: Record<string, unknown>): string | null {
  if (typeof body.token === 'string') return body.token
  if (typeof body.accessToken === 'string') return body.accessToken
  if (typeof body.access_token === 'string') return body.access_token
  return null
}

function extractRefreshToken(body: Record<string, unknown>): string | null {
  if (typeof body.refreshToken === 'string') return body.refreshToken
  if (typeof body.refresh_token === 'string') return body.refresh_token
  return null
}

function extractRole(body: Record<string, unknown>, token: string): string {
  const user = body.user as Record<string, unknown> | undefined
  if (typeof user?.role === 'string') return user.role.toUpperCase()
  const payload = parseJwt(token)
  if (typeof payload.role === 'string') return payload.role.toUpperCase()
  if (Array.isArray(payload.roles) && payload.roles.length > 0)
    return (payload.roles[0] as string).replace('ROLE_', '').toUpperCase()
  return 'USER'
}

function extractUserId(body: Record<string, unknown>, token: string): string {
  const user = body.user as Record<string, unknown> | undefined
  if (user?.id != null) return String(user.id)
  const payload = parseJwt(token)
  return String(payload.userId ?? payload.sub ?? payload.id ?? '')
}

export default function LoginPage() {
  const router = useRouter()
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginFormData) {
    setApiError(null)
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      })

      if (!res.ok) {
        setApiError(
          res.status === 401 || res.status === 403
            ? 'Invalid email or password.'
            : `Server error (${res.status}). Please try again.`,
        )
        return
      }

      const body: Record<string, unknown> = await res.json()
      const token = extractToken(body)
      const refreshToken = extractRefreshToken(body)
      if (!token) {
        setApiError('Login failed: no token received.')
        return
      }
      const role = extractRole(body, token)
      const userId = extractUserId(body, token)

      localStorage.setItem('hs_token', token)
      document.cookie = `hs_token=${token}; path=/; max-age=86400`

      if (refreshToken) {
        localStorage.setItem('hs_refresh_token', refreshToken)
        document.cookie = `hs_refresh_token=${refreshToken}; path=/; max-age=604800`
      }
      if (userId) {
        localStorage.setItem('hs_user_id', userId)
        document.cookie = `hs_user_id=${userId}; path=/; max-age=86400`
      }
      document.cookie = `hs_role=${role}; path=/; max-age=86400`

      if (role === 'ADMIN') router.push('/admin/dashboard')
      else router.push('/search')
    } catch {
      setApiError('Could not reach the server. Please check your connection.')
    }
  }

  return (
    <>
      <h1 className="font-display text-2xl font-bold text-hs-text mb-1">Welcome back</h1>
      <p className="text-sm text-muted mb-6">Log in to your HomeSphere account.</p>

      {apiError && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-xs text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Logging in...' : 'Log In'}
        </Button>
      </form>

      <p className="text-sm text-center text-muted mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-primary font-medium hover:underline">Sign up</Link>
      </p>
    </>
  )
}
