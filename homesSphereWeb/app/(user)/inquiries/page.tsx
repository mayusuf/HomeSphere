import { MessageSquare } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import { getInquiriesByUser } from '@/lib/api/inquiries'
import { formatRelativeDate } from '@/lib/utils'
import Link from 'next/link'

export default async function CustomerInquiriesPage() {
  const inquiries = await getInquiriesByUser('user_001')

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-hs-text mb-6">My Inquiries</h1>

      {inquiries.length === 0 ? (
        <EmptyState
          title="No inquiries yet"
          description="When you send an inquiry about a property, it will appear here."
          icon={<MessageSquare size={28} />}
          action={{ label: 'Browse Properties', href: '/search' }}
        />
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div key={inq.id} className="bg-white rounded-xl border border-border p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge status={inq.status} />
                    <span className="text-xs text-muted capitalize">{inq.type}</span>
                  </div>
                  <p className="text-sm text-hs-text font-medium">Property #{inq.propertyId}</p>
                  <p className="text-sm text-muted mt-1 line-clamp-2">{inq.message}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-muted">{formatRelativeDate(inq.createdAt)}</p>
                  <Link
                    href={`/property/${inq.propertyId}`}
                    className="text-xs text-primary hover:underline mt-1 block"
                  >
                    View Property →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
