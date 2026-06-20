'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations/authSchema'
import { useState } from 'react'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({ resolver: zodResolver(forgotPasswordSchema) })

  async function onSubmit() {
    await new Promise((r) => setTimeout(r, 600))
    setSent(true)
  }

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto">
          <CheckCircle size={28} className="text-success" />
        </div>
        <h2 className="font-display text-xl font-bold text-hs-text">Check your email</h2>
        <p className="text-sm text-muted">
          We sent a password reset link. Please check your inbox and follow the instructions.
        </p>
        <Link href="/login" className="block text-sm text-primary font-medium hover:underline">
          ← Back to login
        </Link>
      </div>
    )
  }

  return (
    <>
      <h1 className="font-display text-2xl font-bold text-hs-text mb-1">Reset your password</h1>
      <p className="text-sm text-muted mb-6">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>

      <p className="text-sm text-center text-muted mt-6">
        <Link href="/login" className="text-primary font-medium hover:underline">
          ← Back to login
        </Link>
      </p>
    </>
  )
}
