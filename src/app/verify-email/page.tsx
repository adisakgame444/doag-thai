import { getServerSession } from '@/lib/get-session'
import { redirect, unauthorized } from 'next/navigation'
import ResendVerificationButton from './resend-verification-button'

export default async function VerifyEmailPage() {
  const session = await getServerSession()
  const user = session?.user

  if (!user) unauthorized()

  if (user.emailVerified) redirect('/')

  return (
    <main className='flex flex-1 items-center justify-center px-4 text-center min-h-svh'>
      <div className='space-y-6'>
        <div className='space-y-2'>
          <h1 className='text-2xl font-semibold'>ยืนยันอีเมลของคุณ</h1>
          <p className='text-muted-foreground'>
            อีเมลยืนยันได้ถูกส่งไปยังที่อยู่อีเมลของคุณแล้ว
          </p>
        </div>
        <ResendVerificationButton email={user.email} />
      </div>
    </main>
  )
}
