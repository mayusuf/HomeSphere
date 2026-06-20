'use client'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { addAdminUser } from '@/lib/api/users'
import { useNotificationStore } from '@/store/useNotificationStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'


const schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  phoneNumber: z.string().regex(/^\+?[0-9\- ]{7,20}$/, { message: 'Invalid phone number format' }),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormData = z.infer<typeof schema>


export default function UserAdminRegister() {
  const router = useRouter()
  const addToast = useNotificationStore((s) => s.addToast)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
    },
  })

  async function onSubmit(data: FormData) {
    setApiError(null)
    try {
      await addAdminUser(data, true)
      addToast('User added successfully!', 'success')
      setTimeout(() => {
        router.push('/admin/users')
      }, 1000);

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to add user.'
      setApiError(msg)
      addToast(msg, 'error')
    }
  }
  return (

    <div>
      <h1 className="font-display text-2xl font-bold text-hs-text mb-2">Add New User</h1>
      <p className="text-sm text-muted mb-6">
        Fill in the details below to create a new admin user account.
      </p>
      <div className="bg-white rounded-xl border border-border p-6">
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
            placeholder="admin@example.com"
            error={errors.email?.message}
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

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter a secure password"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  )
}
