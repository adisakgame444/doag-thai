import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from '@/lib/get-session'
import {
  getActiveSpinPackages,
  getSpinQuotaByUserId,
  getSpinOrdersByUserId,
  getSpinHistoryByUserId,
} from '@/services/spins'
import SpinPackagesList from './spin-packages-list'
import { Button } from '@/components/ui/button'
import { History, Play, RotateCw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'ซื้อแพคเกจสปิน',
  description: 'ซื้อแพคเกจสปินเพื่อเล่นเกมสปิน',
}

export default async function SpinPage() {
  const session = await getServerSession()
  if (!session?.user) {
    redirect('/sign-in?redirect=/spin')
  }

  const packages = await getActiveSpinPackages()
  const quota = await getSpinQuotaByUserId(session.user.id)
  const orders = await getSpinOrdersByUserId(session.user.id)
  const spinHistory = await getSpinHistoryByUserId(session.user.id, {
    limit: 100,
  })

  // นับคำสั่งซื้อที่รอการตรวจสอบ
  const pendingOrders = orders.filter(
    (order) => order.status === 'WAITING_VERIFICATION',
  ).length

  const remainingSpins = quota ? quota.total - quota.used : 0
  const totalSpins = spinHistory.length
  const winCount = spinHistory.filter((h) => h.result === 'WIN').length

  return (
    <div className='container mx-auto px-4 py-6'>
      <div className='mb-4 sm:mb-6'>
        <h1 className='text-2xl sm:text-3xl font-bold mb-2'>ซื้อแพคเกจสปิน</h1>
        <p className='text-sm sm:text-base text-muted-foreground'>
          เลือกแพคเกจที่ต้องการเพื่อเติมจำนวนครั้งที่หมุน
        </p>
      </div>

      {/* Quick Actions */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
        {/* Remaining Spins */}
        {quota && remainingSpins > 0 && (
          <Card className='border-green-500 bg-green-50 dark:bg-green-950'>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>
                    สิทธิ์หมุนที่เหลือ
                  </p>
                  <p className='text-2xl font-bold text-green-600 dark:text-green-400'>
                    {remainingSpins} ครั้ง
                  </p>
                </div>
                <Link href='/game'>
                  <Button className='bg-green-600 hover:bg-green-700'>
                    <Play className='w-4 h-4 mr-2' />
                    เล่นเลย
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pending Orders */}
        {pendingOrders > 0 && (
          <Card className='border-yellow-500 bg-yellow-50 dark:bg-yellow-950'>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>รอการตรวจสอบ</p>
                  <p className='text-2xl font-bold text-yellow-600 dark:text-yellow-400'>
                    {pendingOrders} คำสั่งซื้อ
                  </p>
                </div>
                <Link href='/spin/orders'>
                  <Button
                    variant='outline'
                    className='border-yellow-500 text-yellow-600 hover:bg-yellow-100'
                  >
                    <History className='w-4 h-4 mr-2' />
                    ดูสถานะ
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Orders History */}
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground'>
                  ประวัติคำสั่งซื้อ
                </p>
                <p className='text-2xl font-bold'>{orders.length} รายการ</p>
              </div>
              <Link href='/spin/orders'>
                <Button variant='outline'>
                  <History className='w-4 h-4 mr-2' />
                  ดูทั้งหมด
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Spin History */}
        {totalSpins > 0 && (
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>
                    ประวัติการหมุน
                  </p>
                  <p className='text-2xl font-bold'>
                    {totalSpins} ครั้ง
                    <span className='text-sm text-green-600 ml-2'>
                      (ชนะ {winCount})
                    </span>
                  </p>
                </div>
                <Link href='/spin/history'>
                  <Button variant='outline'>
                    <RotateCw className='w-4 h-4 mr-2' />
                    ดูทั้งหมด
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <SpinPackagesList packages={packages} />
    </div>
  )
}
