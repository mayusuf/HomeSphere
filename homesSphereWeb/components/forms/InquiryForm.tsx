'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { inquirySchema, type InquiryFormData } from '@/lib/validations/inquirySchema'
import { useNotificationStore } from '@/store/useNotificationStore'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

interface InquiryFormProps {
  propertyTitle: string
  onSuccess: () => void
}

export default function InquiryForm({ propertyTitle, onSuccess }: InquiryFormProps) {
  const addToast = useNotificationStore((s) => s.addToast)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormData>({ resolver: zodResolver(inquirySchema) })

  async function onSubmit(data: InquiryFormData) {
    await new Promise((r) => setTimeout(r, 600))
    console.log('Inquiry submitted', data)
    addToast('Your inquiry has been sent successfully!', 'success')
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-muted">
        Reaching out about: <span className="font-medium text-hs-text">{propertyTitle}</span>
      </p>

      <Textarea
        id="message"
        label="Message"
        placeholder="Hi, I'm interested in this property..."
        error={errors.message?.message}
        {...register('message')}
      />

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}
