import type { Metadata } from 'next'
import ResetPasswordForm from './reset-password-form'

export const metadata: Metadata = {
  title: 'Forgot password',
}

interface ResetPasswordPageProps {
  searchParams: Promise<{ token: string }>
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams

  return (
    <main className='flex min-h-svh items-center justify-center px-4'>
      {token ? (
        <ResetPasswordUI token={token} />
      ) : (
        <div role='alert' className='text-red-600'>
          Token is missing.
        </div>
      )}
    </main>
  )
}

interface ResetPasswordUIProps {
  token: string
}

function ResetPasswordUI({ token }: ResetPasswordUIProps) {
  return (
    <main className='flex min-h-svh items-center justify-center px-4'>
      <div className='space-y-6 w-full'>
        <div className='space-y-2 text-center'>
          <h1 className='text-2xl font-semibold'>ลืมรหัสผ่าน</h1>
          <p className='text-muted-foreground'>
            กรุณากรอกอีเมลที่ใช้สมัครเพื่อรับลิงก์รีเซ็ตรหัสผ่าน
          </p>
        </div>
        <ResetPasswordForm token={token} />
      </div>
    </main>
  )
}
