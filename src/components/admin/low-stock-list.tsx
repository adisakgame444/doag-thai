'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import type { LowStockProductSummary } from '@/services/products'

interface LowStockListProps {
  products: LowStockProductSummary[]
}

export default function LowStockList({ products }: LowStockListProps) {
  if (!products.length) {
    return (
      <div className='rounded-xl border border-dashed border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground'>
        สินค้าทั้งหมดยังมีสต็อกเพียงพอ
      </div>
    )
  }

  return (
    <div className='space-y-3'>
      {products.map((product) => {
        const lowStockValue = product.lowStock != null ? Number(product.lowStock) : null
        return (
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
                <p className='text-sm font-medium text-foreground'>{product.title}</p>
                <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                  <span>คงเหลือ {product.stock.toLocaleString()} กรัม</span>
                  {lowStockValue != null && (
                    <span className='inline-flex items-center gap-1'>
                      <AlertTriangle className='h-3 w-3 text-amber-500' />
                      แจ้งเตือน {lowStockValue.toLocaleString()} กรัม
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Link
              href={`/admin/product/edit/${product.id}`}
              className='text-sm font-medium text-primary hover:text-primary/80'
            >
              จัดการสต็อก
            </Link>
          </div>
        )
      })}
    </div>
  )
}
