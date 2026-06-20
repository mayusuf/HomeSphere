'use client'

import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { useNotificationStore, type Toast as ToastType } from '@/store/useNotificationStore'
import { cn } from '@/lib/utils'

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
}

const styles = {
  success: 'bg-success text-white',
  error: 'bg-error text-white',
  info: 'bg-primary text-white',
}

function ToastItem({ toast }: { toast: ToastType }) {
  const removeToast = useNotificationStore((s) => s.removeToast)
  const Icon = icons[toast.type]

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[280px] max-w-sm',
        'motion-safe:animate-in motion-safe:slide-in-from-bottom-2',
        styles[toast.type]
      )}
      role="alert"
    >
      <Icon size={18} className="shrink-0" />
      <p className="text-sm flex-1">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        aria-label="Dismiss notification"
        className="opacity-75 hover:opacity-100"
      >
        <X size={16} />
      </button>
    </div>
  )
}

export default function ToastContainer() {
  const toasts = useNotificationStore((s) => s.toasts)

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
