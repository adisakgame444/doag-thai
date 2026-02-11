import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'สินค้าทั้งหมด',
  description:
    'ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!',
}

export default function EmailVerifiedPage() {
  return (
    <main className='flex flex-1 items-center justify-center px-4 text-center min-h-svh'>
      <div className='space-y-6'>
        <div className='space-y-2'>
          <h1 className='text-2xl font-semibold'>ยืนยันอีเมลของคุณแล้ว</h1>
          {/* <p className='text-muted-foreground'>ยืนยันอีเมลของคุณแล้ว</p> */}
        </div>
        <Button asChild>
          <Link href='/'>กลับหน้าแรก</Link>
        </Button>
      </div>
    </main>
  )
}
