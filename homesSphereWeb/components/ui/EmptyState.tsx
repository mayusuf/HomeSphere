import { Home } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: { label: string; href: string }
  className?: string
}

export default function EmptyState({
  title = 'No results found',
  description = 'Try adjusting your search or filters.',
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-20 px-4 gap-4',
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-surface border-2 border-border flex items-center justify-center text-muted">
        {icon ?? <Home size={28} />}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-hs-text mb-1">{title}</h3>
        <p className="text-muted text-sm max-w-xs">{description}</p>
      </div>
      {action && (
        <Link
          href={action.href}
          className="mt-2 text-sm font-medium text-primary underline underline-offset-2 hover:opacity-80"
        >
          {action.label}
        </Link>
      )}
    </div>
  )
}
