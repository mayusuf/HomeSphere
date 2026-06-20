'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteProperty } from '@/lib/api/properties'
import { useNotificationStore } from '@/store/useNotificationStore'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

interface DeletePropertyButtonProps {
  propertyId: string
  propertyTitle: string
}

export default function DeletePropertyButton({ propertyId, propertyTitle }: DeletePropertyButtonProps) {
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const addToast = useNotificationStore((s) => s.addToast)
  const router = useRouter()

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteProperty(propertyId, true)
      addToast('Property deleted successfully.', 'success')
      setOpen(false)
      router.refresh()
    } catch {
      addToast('Failed to delete property. Please try again.', 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        aria-label={`Delete ${propertyTitle}`}
        className="text-error hover:bg-error/10"
      >
        <Trash2 size={14} />
      </Button>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Delete Property">
        <p className="text-sm text-muted mb-4">
          Are you sure you want to delete{' '}
          <span className="font-medium text-hs-text">&ldquo;{propertyTitle}&rdquo;</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete Property'}
          </Button>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  )
}
