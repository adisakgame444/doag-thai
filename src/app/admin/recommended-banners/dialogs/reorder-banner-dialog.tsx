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
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { updateBannerOrderAction } from '../actions'

export function ReorderBannerDialog() {
  const [open, setOpen] = useState(false)
  const [newestFirst, setNewestFirst] = useState(true)
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    startTransition(async () => {
      const result = await updateBannerOrderAction(newestFirst ? 'newest' : 'oldest')

      if (result.success) {
        toast.success(result.message ?? 'บันทึกการตั้งค่าสำเร็จ')
        setOpen(false)
      } else {
        toast.error(result.error ?? 'ไม่สามารถบันทึกการตั้งค่าได้')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          จัดลำดับแบนเนอร์
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>รูปแบบการเรียงลำดับ</DialogTitle>
          <DialogDescription>
            ปรับการแสดงผลบนหน้าแรกให้เรียงตามความต้องการของคุณ
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 rounded-lg border border-border/60 bg-muted/30 p-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <Label className='text-sm font-medium'>เรียงแบนเนอร์ล่าสุดก่อน</Label>
              <p className='text-xs text-muted-foreground'>เปิดเพื่อแสดงแบนเนอร์ที่สร้างล่าสุดไว้ด้านหน้าสุด</p>
            </div>
            <Switch checked={newestFirst} onCheckedChange={setNewestFirst} />
          </div>
        </div>

        <DialogFooter className='sm:justify-between'>
          <Button variant='outline' type='button' onClick={() => setOpen(false)}>
            ยกเลิก
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            บันทึกการตั้งค่า
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


