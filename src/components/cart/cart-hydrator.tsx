'use client'

import { useEffect } from 'react'
import { CartItemDTO } from '@/types/cart'
import { useCartStore } from '@/stores/cart-store'

interface CartHydratorProps {
  userId: string | null
  items: CartItemDTO[]
}

export function CartHydrator({ userId, items }: CartHydratorProps) {
  const syncFromServer = useCartStore((state) => state.syncFromServer)

  useEffect(() => {
    syncFromServer(userId, items)
  }, [syncFromServer, userId, items])

  return null
}
