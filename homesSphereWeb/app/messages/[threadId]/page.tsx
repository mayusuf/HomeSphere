import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getThreadById } from '@/lib/api/messages'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { formatRelativeDate } from '@/lib/utils'
import MessageInput from './MessageInput'
import ToastContainer from '@/components/ui/Toast'

interface MessageThreadPageProps {
  params: Promise<{ threadId: string }>
}

export default async function MessageThreadPage({ params }: MessageThreadPageProps) {
  const { threadId } = await params
  const thread = await getThreadById(threadId)

  if (!thread) notFound()

  const currentUserId = 'user_001'

  return (
    <>
      <Navbar />
      <ToastContainer />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col" style={{ minHeight: 'calc(100vh - 64px - 200px)' }}>
        <div className="flex items-center gap-3 mb-4">
          <Link href="/messages" className="p-2 rounded-lg hover:bg-surface transition-colors text-muted hover:text-primary">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-semibold text-hs-text">{thread.propertyTitle}</h1>
            <Link href={`/property/${thread.propertyId}`} className="text-xs text-primary hover:underline">
              View property →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {thread.messages.map((msg) => {
              const isMe = msg.senderId === currentUserId
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                      isMe
                        ? 'bg-primary text-white rounded-br-sm'
                        : 'bg-surface text-hs-text rounded-bl-sm'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className={`text-xs mt-1 ${isMe ? 'text-white/70' : 'text-muted'}`}>
                      {formatRelativeDate(msg.sentAt)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="border-t border-border p-4">
            <MessageInput threadId={threadId} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
