'use client'

import { useState } from 'react'
import { deactivateUser, deleteUser } from '@/lib/api/users'
import { useNotificationStore } from '@/store/useNotificationStore'
import Button from '@/components/ui/Button'

interface DisableUserButtonProps {
  userId: string
  userName: string
  currentStatus: string
  currentAdminId?: string
}

export default function DisableUserButton({
  userId,
  userName,
  currentAdminId,
}: DisableUserButtonProps) {
  const [loading, setLoading] = useState(false)
  const addToast = useNotificationStore((s) => s.addToast)

  if (userId === currentAdminId) return null

  async function handleToggle() {
    setLoading(true)
    try {
      await deleteUser(userId, true)
      addToast(`${userName} has been deleted.`, 'info')
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch {
      addToast('Action failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={'secondary'}
      size="sm"
      onClick={handleToggle}
      disabled={loading}
    >
      {loading ? '...' : 'Delete'}
    </Button>
  )
}
