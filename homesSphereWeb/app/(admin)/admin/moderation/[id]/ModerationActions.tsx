'use client'

import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { propertyStatusChange } from '@/lib/api/properties'
import { useNotificationStore } from '@/store/useNotificationStore'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import type { PropertyStatus } from '@/lib/api/properties'

const REJECTION_REASONS = [
  { value: 'incomplete', label: 'Incomplete information' },
  { value: 'photos',     label: 'Missing or poor quality photos' },
  { value: 'price',      label: 'Suspicious pricing' },
  { value: 'policy',     label: 'Violates platform policy' },
  { value: 'other',      label: 'Other (see note below)' },
]

interface ModerationActionsProps {
  propertyId: string
  propertyStatus: PropertyStatus
}

export default function ModerationActions({ propertyId, propertyStatus }: ModerationActionsProps) {
  const [approving, setApproving]         = useState(false)
  const [rejecting, setRejecting]         = useState(false)
  const [rejectReason, setRejectReason]   = useState('')
  const [rejectNote, setRejectNote]       = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)
  const addToast = useNotificationStore((s) => s.addToast)
  const router = useRouter()


  async function handleApprove() {
    setApproving(true)
    try {
      await propertyStatusChange(propertyId, 'APPROVED', undefined, true)
      addToast('Listing approved and is now live!', 'success')
      router.push('/admin/moderation')
    } catch {
      addToast('Failed to approve listing. Please try again.', 'error')
    } finally {
      setApproving(false)
    }
  }

  async function handleReject() {
    if (!rejectReason) {
      addToast('Please select a rejection reason.', 'error')
      return
    }
    setRejecting(true)
    try {
      await propertyStatusChange(propertyId, 'REJECTED', rejectReason, true)
      addToast('Listing rejected.', 'info')
      router.push('/admin/moderation')
    } catch {
      addToast('Failed to reject listing. Please try again.', 'error')
    } finally {
      setRejecting(false)
    }
  }

  return (
    <div className="space-y-3">
      <Button className="w-full" onClick={handleApprove} disabled={approving || rejecting}>
        <CheckCircle size={16} />
        {approving ? 'Approving...' : 'Approve Listing'}
      </Button>

      {!showRejectForm ? (
        <Button
          variant="danger"
          className="w-full"
          onClick={() => setShowRejectForm(true)}
          disabled={approving}
        >
          <XCircle size={16} />
          Reject Listing
        </Button>
      ) : (
        <div className="border border-error/30 bg-red-50 rounded-lg p-4 space-y-3">
          <p className="text-sm font-medium text-error">Rejection Details</p>
          <Select
            id="rejectReason"
            label="Reason *"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            options={REJECTION_REASONS}
            placeholder="Select a reason"
          />
          <Textarea
            id="rejectNote"
            label="Additional notes (optional)"
            placeholder="Provide more context..."
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
            rows={2}
          />
          <div className="flex gap-2">
            <Button variant="danger" size="sm" onClick={handleReject} disabled={rejecting}>
              {rejecting ? 'Rejecting...' : 'Confirm Reject'}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShowRejectForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
