'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterFormData } from '@/lib/validations/authSchema'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { registerUser } from '@/lib/api/users'

export default function RegisterPage() {
  const router = useRouter()
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema), mode: 'onChange' })

  const phoneValue = watch('phone_number')

  async function onSubmit(data: RegisterFormData) {
    setApiError(null)
    try {
      await registerUser({
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        password: data.password,
        phoneNumber: data.phone_number,
      })
      router.push('/login')
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    }
  }

  return (
    <>
      <h1 className="font-display text-2xl font-bold text-hs-text mb-1">Create an account</h1>
      <p className="text-sm text-muted mb-6">Join HomeSphere to find and list properties.</p>

      {apiError && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="first_name"
            label="First Name"
            placeholder="John"
            error={errors.first_name?.message}
            {...register('first_name')}
          />
          <Input
            id="last_name"
            label="Last Name"
            placeholder="Smith"
            error={errors.last_name?.message}
            {...register('last_name')}
          />
        </div>
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          id="phone_number"
          label="Phone Number"
          type="tel"
          placeholder="+213555123456"
          error={errors.phone_number?.message}
          success={!!phoneValue && !errors.phone_number}
          {...register('phone_number')}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <p className="text-sm text-center text-muted mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-primary font-medium hover:underline">Log in</Link>
      </p>
    </>
  )
}
