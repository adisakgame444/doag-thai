import type { Metadata } from 'next'
import ForgotPasswordForm from './forgot-password-form'

export const metadata: Metadata = {
  title: 'Forgot password',
}

export default function ForgotPasswordPage() {
  return (
    <main className='flex min-h-svh items-center justify-center px-4'>
      <div className='space-y-6 w-full'>
        <div className='space-y-2 text-center'>
          <h1 className='text-2xl font-semibold'>ลืมรหัสผ่าน</h1>
          <p className='text-muted-foreground'>
            กรุณากรอกอีเมลที่ใช้สมัครเพื่อรับลิงก์รีเซ็ตรหัสผ่าน
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </main>
  )
}
