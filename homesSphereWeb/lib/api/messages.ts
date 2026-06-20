import messagesData from '@/lib/data/messages.json'

export interface Message {
  id: string
  senderId: string
  text: string
  sentAt: string
}

export interface Thread {
  threadId: string
  propertyId: string
  participants: string[]
  propertyTitle: string
  lastMessage: string
  lastMessageAt: string
  unread: number
  messages: Message[]
}

const delay = () => new Promise<void>((r) => setTimeout(r, 200))

export async function getThreadsByUser(userId: string): Promise<Thread[]> {
  await delay()
  return (messagesData as Thread[]).filter((t) => t.participants.includes(userId))
}

export async function getThreadById(threadId: string): Promise<Thread | null> {
  await delay()
  return (messagesData as Thread[]).find((t) => t.threadId === threadId) ?? null
}
