import inquiriesData from '@/lib/data/inquiries.json'

export type InquiryType = 'inquiry'
export type InquiryStatus = 'pending' | 'responded' | 'closed'

export interface Inquiry {
  id: string
  propertyId: string
  userId: string
  message: string
  type: InquiryType
  status: InquiryStatus
  createdAt: string
}

const delay = () => new Promise<void>((r) => setTimeout(r, 200))

export async function getInquiriesByUser(userId: string): Promise<Inquiry[]> {
  await delay()
  return (inquiriesData as Inquiry[]).filter((i) => i.userId === userId)
}

export async function getAllInquiries(): Promise<Inquiry[]> {
  await delay()
  return inquiriesData as Inquiry[]
}
