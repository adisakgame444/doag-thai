'use client'

import Modal from '@/components/modal'
import { LoadingButton } from '@/components/loading-button'
import { Button } from '@/components/ui/button'
import { useTransition } from 'react'

interface StatusChangeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => Promise<void> | void
  confirmVariant?: 'default' | 'destructive'
  cancelLabel?: string
}

export function StatusChangeModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  confirmVariant = 'default',
  cancelLabel = 'Cancel',
}: StatusChangeModalProps) {
  const [isPending, startTransition] = useTransition()

  const handleConfirm = () => {
    startTransition(async () => {
      await onConfirm()
    })
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
    >
      <div className='flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:justify-end'>
        <Button
          type='button'
          variant='outline'
          onClick={() => onOpenChange(false)}
          disabled={isPending}
        >
          {cancelLabel}
        </Button>
        <LoadingButton
          type='button'
          variant={confirmVariant}
          loading={isPending}
          onClick={handleConfirm}
        >
          {confirmLabel}
        </LoadingButton>
      </div>
    </Modal>
  )
}
