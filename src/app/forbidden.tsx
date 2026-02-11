import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Forbidden() {
  return (
    <main className='flex grow items-center justify-center px-4 text-center min-h-svh'>
      <div className='space-y-6'>
        <div className='space-y-2'>
          <h1 className='text-2xl font-semibold'>403 - Forbidden</h1>
          <p className='text-muted-foreground'>
            คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้
          </p>
        </div>
        <div>
          <Button asChild>
            <Link href='/'>กลับหน้าแรก</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
