'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getUserInfo, updateUserInfo } from '@/lib/api/users'
import { useNotificationStore } from '@/store/useNotificationStore'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string(),
  phoneNumber: z.string().regex(/^\+?[0-9\- ]{7,20}$/, { message: 'Invalid phone number format' }),
})

type ProfileFormData = z.infer<typeof profileSchema>

function getCookieOrStorage(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))
  return m ? m[1] : (localStorage.getItem(name) ?? undefined)
}

export default function ProfileForm() {
  const addToast = useNotificationStore((s) => s.addToast)
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({ resolver: zodResolver(profileSchema) })

  useEffect(() => {
    const id = getCookieOrStorage('hs_user_id')
    if (!id) { setLoading(false); return }

    setLoading(true)
    setUserId(id)

    getUserInfo(id, true)
      .then((user) => {
        if (user) {
          reset({
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            phoneNumber: user.phone_number ?? '',
          })
        } else {
          addToast('Could not load profile data.', 'error')
        }
      })
      .catch(() => addToast('Failed to load profile data.', 'error'))
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function onSubmit(data: ProfileFormData) {
    if (!userId) return
    setApiError(null)
    try {
      await updateUserInfo(userId, data, true)
      addToast('Profile updated successfully!', 'success')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile.'
      setApiError(msg)
      addToast(msg, 'error')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 max-w-md animate-pulse">
        <div className="grid grid-cols-2 gap-3">
          <div className="h-10 bg-surface rounded-lg" />
          <div className="h-10 bg-surface rounded-lg" />
        </div>
        <div className="h-10 bg-surface rounded-lg" />
        <div className="h-10 bg-surface rounded-lg" />
        <div className="h-9 w-28 bg-surface rounded-lg" />
      </div>
    )
  }

  if (!userId) {
    return <p className="text-sm text-muted">Please log in to view your profile.</p>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      {apiError && (
        <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
          {apiError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Input
          id="firstName"
          label="First Name"
          placeholder="John"
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <Input
          id="lastName"
          label="Last Name"
          placeholder="Smith"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>

      <Input
        id="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        readOnly
        disabled
        className="opacity-60 cursor-not-allowed"
        {...register('email')}
      />

      <Input
        id="phoneNumber"
        label="Phone Number"
        type="tel"
        placeholder="+213555123456"
        error={errors.phoneNumber?.message}
        {...register('phoneNumber')}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
}
