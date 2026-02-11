'use client'

import { Button } from '@/components/ui/button'
import { selectCartCount, selectCartHydrated, selectCartUserId, useCartStore } from '@/stores/cart-store'
import { CartItemDTO } from '@/types/cart'
import { cn } from '@/lib/utils'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'

interface CartButtonProps {
  userId: string | null
  items: CartItemDTO[]
  isAuthenticated: boolean
  className?: string
  showLabel?: boolean
}

export function CartButton({
  userId,
  items,
  isAuthenticated,
  className,
  showLabel = false,
}: CartButtonProps) {
  const hydrated = useCartStore(selectCartHydrated)
  const storeCount = useCartStore(selectCartCount)
  const storeUserId = useCartStore(selectCartUserId)

  const initialCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  )

  const displayCount =
    hydrated && userId && storeUserId === userId ? storeCount : initialCount

  const href = isAuthenticated ? '/cart' : '/sign-in?redirect=/cart'

  return (
    <Button
      variant='ghost'
      size={showLabel ? 'default' : 'icon'}
      asChild
      className={cn('relative', className)}
    >
      <Link href={href} aria-label='ดูตะกร้าสินค้า'>
        <ShoppingCart className='size-5' aria-hidden />
        {displayCount > 0 && (
          <span className='absolute -top-1 -right-1 inline-flex min-w-[1.55rem] translate-x-1/4 items-center justify-center rounded-full bg-destructive px-1 text-xs font-semibold text-white'>
            {displayCount}
          </span>
        )}
        {showLabel && <span className='ml-2 text-sm font-medium'>ตะกร้า</span>}
      </Link>
    </Button>
  )
}
