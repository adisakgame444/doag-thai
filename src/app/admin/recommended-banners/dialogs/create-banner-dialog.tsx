'use client'

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createBannerAction } from '../actions'

const createBannerSchema = z.object({
  name: z
    .string()
    .trim()
    .max(120, { message: 'ชื่อต้องไม่เกิน 120 ตัวอักษร' })
    .optional()
    .or(z.literal('')),
  image: z
    .custom<File>((file) => file instanceof File, {
      message: 'กรุณาอัปโหลดรูปภาพ',
    })
    .nullable(),
})

type CreateBannerFormValues = z.infer<typeof createBannerSchema>

export function CreateBannerDialog() {
  const [open, setOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<CreateBannerFormValues>({
    resolver: zodResolver(createBannerSchema),
    defaultValues: {
      name: '',
      image: null,
    },
  })

  const isSubmitting = form.formState.isSubmitting

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const [file] = Array.from(event.target.files ?? [])
      if (!file) {
        setPreviewUrl(null)
        form.setValue('image', null, { shouldDirty: true, shouldValidate: true })
        return
      }

      if (!file.type.startsWith('image/')) {
        toast.error('ไฟล์ต้องเป็นรูปภาพเท่านั้น')
        form.setError('image', { type: 'manual', message: 'ไฟล์ไม่ถูกต้อง' })
        return
      }

      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl((current) => {
        if (current) URL.revokeObjectURL(current)
        return objectUrl
      })
      form.clearErrors('image')
      form.setValue('image', file, { shouldDirty: true, shouldValidate: true })
    },
    [form]
  )

  const resetDialog = useCallback(() => {
    form.reset()
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current)
      return null
    })
  }, [form])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const onSubmit = useCallback(
    async (values: CreateBannerFormValues) => {
      const imageFile = values.image

      if (!imageFile) {
        form.setError('image', { type: 'manual', message: 'กรุณาอัปโหลดรูปภาพ' })
        return
      }

      startTransition(async () => {
        const result = await createBannerAction({
          name: values.name && values.name.trim().length > 0 ? values.name : null,
          file: imageFile,
        })

        if (result.success) {
          toast.success(result.message ?? 'เพิ่มแบนเนอร์สำเร็จ')
          resetDialog()
          setOpen(false)
        } else {
          toast.error(result.error ?? 'ไม่สามารถเพิ่มแบนเนอร์ได้')
        }
      })
    },
    [form, resetDialog]
  )

  const preview = useMemo(() => {
    if (previewUrl) return previewUrl
    return null
  }, [previewUrl])

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {
      if (!nextOpen) {
        resetDialog()
      }
      setOpen(nextOpen)
    }}>
      <DialogTrigger asChild>
        <Button size='sm'>เพิ่มแบนเนอร์</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>เพิ่มแบนเนอร์ใหม่</DialogTitle>
          <DialogDescription>
            อัปโหลดภาพโปรโมชันและกำหนดชื่อให้แสดงบนหน้าแรกของร้านค้า
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='image'
                render={() => (
                  <FormItem>
                    <FormLabel>รูปภาพแบนเนอร์</FormLabel>
                    <FormControl>
                      <div className='flex flex-col items-start gap-3'>
                        <label className='w-full cursor-pointer overflow-hidden rounded-xl border border-dashed border-border/60 bg-muted/30 transition hover:border-primary/60'>
                          <div className='flex h-40 w-full items-center justify-center bg-muted/30'>
                            {preview ? (
                              <div className='relative h-full w-full'>
                                <Image
                                  src={preview}
                                  alt='Banner preview'
                                  fill
                                  className='object-cover'
                                />
                              </div>
                            ) : (
                              <div className='flex flex-col items-center gap-2 text-muted-foreground'>
                                <span className='text-sm font-medium'>เลือกไฟล์รูปภาพ</span>
                                <span className='text-xs text-muted-foreground/80'>แนะนำขนาด 1200 × 400 px</span>
                              </div>
                            )}
                          </div>
                          <input
                            type='file'
                            accept='image/*'
                            className='hidden'
                            onChange={handleFileChange}
                          />
                        </label>
                        <Button
                          type='button'
                          variant='secondary'
                          size='sm'
                          onClick={() => {
                            form.setValue('image', null, { shouldDirty: true, shouldValidate: true })
                            setPreviewUrl((current) => {
                              if (current) URL.revokeObjectURL(current)
                              return null
                            })
                          }}
                          disabled={!preview}
                        >
                          ลบรูปภาพ
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อแบนเนอร์ (ไม่บังคับ)</FormLabel>
                    <FormControl>
                      <Input placeholder='เช่น โปรโมชันเปิดร้าน' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            <DialogFooter className='sm:justify-between'>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  resetDialog()
                  setOpen(false)
                }}
              >
                ยกเลิก
              </Button>
              <Button type='submit' disabled={isSubmitting || isPending}>
                บันทึกแบนเนอร์
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}


