import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <main className='flex grow items-center justify-center px-4 text-center min-h-svh'>
      <div className='space-y-6'>
        <div className='space-y-2'>
          <h1 className='text-2xl font-semibold'>
            401 - ไม่มีสิทธิ์การเข้าถึง
          </h1>
          <p className='text-muted-foreground'>กรุณาเข้าสู่ระบบเพื่อใช้งาน</p>
        </div>
        <div>
          <Button asChild>
            <Link href='/sign-in'>เข้าสู่ระบบ</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
