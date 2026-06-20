import { z } from 'zod'

export const inquirySchema = z.object({
  message: z.string().min(10, 'Message must be at least 10 characters').max(500, 'Message is too long'),
})

export type InquiryFormData = z.infer<typeof inquirySchema>
