'use client'

import Link from 'next/link'
import { formatPrice } from '@/lib/format-price'
import dayjs from '@/lib/dayjs'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { DashboardRecentOrder } from '@/services/orders'
import { OrderStatus, PaymentStatus } from '@/generated/prisma/enums'

interface RecentOrdersTableProps {
  orders: DashboardRecentOrder[]
}

function getOrderStatusLabel(status: OrderStatus) {
  switch (status) {
    case 'PENDING_PAYMENT':
      return 'รอการชำระเงิน'
    case 'PENDING_VERIFICATION':
      return 'รอตรวจสอบ'
    case 'PROCESSING':
      return 'กำลังจัดเตรียม'
    case 'SHIPPED':
      return 'จัดส่งแล้ว'
    case 'COMPLETED':
      return 'สำเร็จ'
    case 'CANCELLED':
      return 'ยกเลิก'
    default:
      return status
  }
}

function getOrderStatusBadge(status: OrderStatus) {
  switch (status) {
    case 'COMPLETED':
      return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
    case 'SHIPPED':
      return 'bg-sky-500/10 text-sky-600 border-sky-500/30'
    case 'PROCESSING':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/30'
    case 'PENDING_VERIFICATION':
      return 'bg-amber-500/10 text-amber-600 border-amber-500/30'
    case 'PENDING_PAYMENT':
      return 'bg-amber-500/10 text-amber-600 border-amber-500/30'
    case 'CANCELLED':
      return 'bg-destructive/10 text-destructive border-destructive/30'
    default:
      return 'bg-muted text-muted-foreground border-border/60'
  }
}

function getPaymentStatusLabel(status: PaymentStatus) {
  switch (status) {
    case 'PENDING':
      return 'รอการชำระ'
    case 'WAITING_VERIFICATION':
      return 'รอตรวจสอบ'
    case 'APPROVED':
      return 'ชำระแล้ว'
    case 'REJECTED':
      return 'ปฏิเสธ'
    default:
      return status
  }
}

function getPaymentStatusBadge(status: PaymentStatus) {
  switch (status) {
    case 'APPROVED':
      return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
    case 'WAITING_VERIFICATION':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/30'
    case 'PENDING':
      return 'bg-amber-500/10 text-amber-600 border-amber-500/30'
    case 'REJECTED':
      return 'bg-destructive/10 text-destructive border-destructive/30'
    default:
      return 'bg-muted text-muted-foreground border-border/60'
  }
}

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  if (!orders.length) {
    return (
      <div className='rounded-2xl border border-dashed border-border/60 bg-muted/20 p-6 text-center text-sm text-muted-foreground'>
        ยังไม่มีคำสั่งซื้อใหม่ในช่วงนี้
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>คำสั่งซื้อ</TableHead>
          <TableHead>ลูกค้า</TableHead>
          <TableHead>ยอดสุทธิ</TableHead>
          <TableHead>สถานะ</TableHead>
          <TableHead>การชำระเงิน</TableHead>
          <TableHead>วันที่สร้าง</TableHead>
          <TableHead className='text-right'>จัดการ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className='font-medium'>
              {order.orderNumber}
            </TableCell>
            <TableCell>{order.customerName}</TableCell>
            <TableCell>{formatPrice(order.totalAmount)}</TableCell>
            <TableCell>
              <Badge
                variant='outline'
                className={getOrderStatusBadge(order.status)}
              >
                {getOrderStatusLabel(order.status)}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant='outline'
                className={getPaymentStatusBadge(order.paymentStatus)}
              >
                {getPaymentStatusLabel(order.paymentStatus)}
              </Badge>
            </TableCell>
            <TableCell>{dayjs(order.createdAt).format('DD MMM YYYY HH:mm')}</TableCell>
            <TableCell className='text-right'>
              <Button variant='outline' size='sm' asChild>
                <Link href={`/admin/orders?focus=${order.id}`}>เปิดคำสั่งซื้อ</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
