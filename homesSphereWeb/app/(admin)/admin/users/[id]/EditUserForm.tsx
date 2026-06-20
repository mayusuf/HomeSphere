'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { updateUserInfo, updateUserInfoByAdmin, type User } from '@/lib/api/users'
import { useNotificationStore } from '@/store/useNotificationStore'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string(),
  phoneNumber: z.string().regex(/^\+?[0-9\- ]{7,20}$/, { message: 'Invalid phone number format' }),
})

type FormData = z.infer<typeof schema>

export default function EditUserForm({ user }: { user: User }) {
  const addToast = useNotificationStore((s) => s.addToast)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phoneNumber: user.phone_number ?? '',
    },
  })

  async function onSubmit(data: FormData) {
    setApiError(null)
    try {
      await updateUserInfoByAdmin(user.user_id, data, true)
      addToast('User updated successfully!', 'success')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update user.'
      setApiError(msg)
      addToast(msg, 'error')
    }
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
