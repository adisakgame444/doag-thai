'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { TopSellerSummary } from '@/services/products'

interface TopSellersListProps {
  products: TopSellerSummary[]
}

export default function TopSellersList({ products }: TopSellersListProps) {
  if (!products.length) {
    return (
      <div className='rounded-xl border border-dashed border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground'>
        ยังไม่มีข้อมูลยอดขายเพื่อแสดงอันดับสินค้า
      </div>
    )
  }

  return (
    <div className='space-y-3'>
      {products.map((product, index) => (
        <div
          key={product.id}
          className='flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card p-3'
        >
          <div className='flex items-center gap-3'>
            <div className='relative h-10 w-10 overflow-hidden rounded-lg bg-muted'>
              {product.mainImageUrl ? (
                <Image src={product.mainImageUrl} alt={product.title} fill className='object-cover' />
              ) : (
                <div className='flex h-full w-full items-center justify-center text-xs text-muted-foreground'>
                  N/A
                </div>
              )}
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <span className='rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary'>#{index + 1}</span>
                <p className='text-sm font-medium text-foreground'>{product.title}</p>
              </div>
              <p className='text-xs text-muted-foreground'>ยอดขาย {product.totalSold.toLocaleString()} หน่วย</p>
            </div>
          </div>
          <Link
            href={`/admin/product/edit/${product.id}`}
            className='text-sm font-medium text-primary hover:text-primary/80'
          >
            ดูรายละเอียด
          </Link>
        </div>
      ))}
    </div>
  )
}
