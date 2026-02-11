'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { deleteBannerAction } from '../actions'

interface DeleteBannerDialogProps {
  bannerId: string
  bannerName?: string | null
}

export function DeleteBannerDialog({ bannerId, bannerName }: DeleteBannerDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleConfirm() {
    startTransition(async () => {
      const result = await deleteBannerAction(bannerId)

      if (result.success) {
        toast.success(result.message ?? 'ลบแบนเนอร์สำเร็จ')
        setOpen(false)
      } else {
        toast.error(result.error ?? 'ไม่สามารถลบแบนเนอร์ได้')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='destructive' size='sm'>
          ลบ
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>ลบแบนเนอร์</DialogTitle>
          <DialogDescription>
            การลบแบนเนอร์จะทำให้ภาพนี้ไม่แสดงในหน้าแรกทันที
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-3 text-sm text-muted-foreground'>
          <p>
            คุณแน่ใจหรือไม่ว่าต้องการลบแบนเนอร์
            {bannerName ? <strong className='ml-1 text-foreground'>{bannerName}</strong> : null}
            ?
          </p>
          <p className='rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-destructive'>
            การดำเนินการนี้ไม่สามารถย้อนกลับได้
          </p>
        </div>

        <DialogFooter className='sm:justify-between'>
          <Button variant='outline' type='button' onClick={() => setOpen(false)}>
            ยกเลิก
          </Button>
          <Button
            variant='destructive'
            onClick={handleConfirm}
            disabled={isPending}
          >
            ยืนยันการลบ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


