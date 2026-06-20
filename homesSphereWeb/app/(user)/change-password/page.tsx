'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { KeyRound } from 'lucide-react'
import { changePassword } from '@/lib/api/users'
import { useNotificationStore } from '@/store/useNotificationStore'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const schema = z
  .object({
    password:        z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

function getToken(): string | null {
  if (typeof document === 'undefined') return null
  const m = document.cookie.match(/(?:^|;\s*)hs_token=([^;]+)/)
  return m ? m[1] : localStorage.getItem('hs_token')
}

export default function ChangePasswordPage() {
  const addToast = useNotificationStore((s) => s.addToast)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setApiError(null)
    const token = getToken()
    if (!token) {
      setApiError('Session expired. Please log in again.')
      return
    }
    try {
      await changePassword({ token, password: data.password }, true)
      addToast('Password changed successfully!', 'success')
      reset()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to change password.'
      setApiError(msg)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
          <KeyRound size={28} className="text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-hs-text">Change Password</h1>
          <p className="text-sm text-muted">Enter your new password below</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
          {apiError && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
              {apiError}
            </div>
          )}

          <Input
            id="password"
            label="New Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            id="confirmPassword"
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </div>
    </div>
  )
}
