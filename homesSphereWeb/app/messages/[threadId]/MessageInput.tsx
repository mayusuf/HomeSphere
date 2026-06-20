'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { useNotificationStore } from '@/store/useNotificationStore'

export default function MessageInput({ threadId }: { threadId: string }) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const addToast = useNotificationStore((s) => s.addToast)

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setSending(true)
    await new Promise((r) => setTimeout(r, 400))
    setSending(false)
    setText('')
    addToast('Message sent!', 'success')
  }

  return (
    <form onSubmit={handleSend} className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-3 py-2 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        aria-label="Type a message"
        disabled={sending}
      />
      <button
        type="submit"
        disabled={!text.trim() || sending}
        className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center disabled:opacity-50 hover:bg-primary/90 transition-colors"
        aria-label="Send message"
      >
        <Send size={16} />
      </button>
    </form>
  )
}
