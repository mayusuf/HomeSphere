import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { MessageSquare } from 'lucide-react'
import { getThreadsByUser } from '@/lib/api/messages'
import { formatRelativeDate } from '@/lib/utils'
import EmptyState from '@/components/ui/EmptyState'
import ToastContainer from '@/components/ui/Toast'

export default async function MessagesPage() {
  const threads = await getThreadsByUser('user_001')

  return (
    <>
      <Navbar />
      <ToastContainer />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-display text-2xl font-bold text-hs-text mb-6">Messages</h1>

        {threads.length === 0 ? (
          <EmptyState
            title="No messages yet"
            description="Start a conversation from any property listing."
            icon={<MessageSquare size={28} />}
            action={{ label: 'Browse Properties', href: '/search' }}
          />
        ) : (
          <div className="space-y-3">
            {threads.map((thread) => (
              <Link
                key={thread.threadId}
                href={`/messages/${thread.threadId}`}
                className="flex items-start gap-4 bg-white rounded-xl border border-border p-4 hover:border-primary/40 hover:shadow-sm motion-safe:transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MessageSquare size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-hs-text text-sm truncate">{thread.propertyTitle}</p>
                    <span className="text-xs text-muted shrink-0">
                      {formatRelativeDate(thread.lastMessageAt)}
                    </span>
                  </div>
                  <p className="text-sm text-muted truncate mt-0.5">{thread.lastMessage}</p>
                </div>
                {thread.unread > 0 && (
                  <span className="w-5 h-5 bg-primary rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {thread.unread}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
