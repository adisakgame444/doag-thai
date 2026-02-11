'use client'

import { LoadingButton } from '@/components/loading-button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const forgotPasswordSchema = z.object({
  email: z.email({ message: 'กรุณากรอกอีเมล' }),
})

type ForgotPaswordValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordForm() {
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ForgotPaswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit({ email }: ForgotPaswordValues) {
    setSuccess(null)
    setError(null)

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: '/reset-password',
    })

    if (error) {
      setError(error.message || 'Something went wrong')
    } else {
      setSuccess('หากมีบัญชีสำหรับอีเมลนี้ เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปแล้ว')
      form.reset()
    }
  }

  const loading = form.formState.isSubmitting

  return (
    <Card className='max-w-md mx-auto w-full'>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>อีเมล</FormLabel>
                  <FormControl>
                    <Input type='email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {success && (
              <div role='status' className='text-sm text-green-600'>
                {success}
              </div>
            )}
            {error && (
              <div role='alert' className='text-sm text-red-600'>
                {error}
              </div>
            )}

            <LoadingButton type='submit' className='w-full' loading={loading}>
              ส่งลิงก์รีเซ็ตรหัสผ่าน
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
