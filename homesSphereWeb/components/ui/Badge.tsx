import { cn } from '@/lib/utils'
import type { PropertyStatus } from '@/lib/api/properties'

interface BadgeProps {
  status: PropertyStatus | string
  className?: string
}

const statusStyles: Record<string, string> = {
  approved:  'text-primary bg-teal-50 border-teal-200',
  pending:   'text-amber-600 bg-amber-50 border-amber-200',
  rejected:  'text-error bg-red-50 border-red-200',
  responded: 'text-blue-600 bg-blue-50 border-blue-200',
  closed:    'text-muted bg-gray-50 border-gray-200',
  disabled:  'text-muted bg-gray-100 border-gray-200',
}

const statusLabels: Record<string, string> = {
  approved:  'Approved',
  pending:   'Pending',
  rejected:  'Rejected',
  responded: 'Responded',
  closed:    'Closed',
  disabled:  'Disabled',
}

export default function Badge({ status, className }: BadgeProps) {
  const style = statusStyles[status] ?? 'text-muted bg-gray-50 border-gray-200'
  const label = statusLabels[status] ?? status

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border',
        style,
        className
      )}
    >
      {label}
    </span>
  )
}
