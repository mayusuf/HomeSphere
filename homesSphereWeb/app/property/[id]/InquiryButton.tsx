'use client'

import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import InquiryForm from '@/components/forms/InquiryForm'

export default function InquiryButton({ propertyTitle }: { propertyTitle: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button className="w-full" onClick={() => setOpen(true)}>
        <MessageSquare size={16} />
        Send Inquiry
      </Button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Contact Owner"
      >
        <InquiryForm
          propertyTitle={propertyTitle}
          onSuccess={() => setOpen(false)}
        />
      </Modal>
    </>
  )
}
