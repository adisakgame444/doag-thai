'use client'

import { CartItemDTO } from '@/types/cart'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type CartState = {
  userId: string | null
  items: CartItemDTO[]
  hydrated: boolean
  selectedIds: Record<string, true>
}

type CartActions = {
  setHydrated: (hydrated: boolean) => void
  syncFromServer: (userId: string | null, items: CartItemDTO[]) => void
  updateLocalQuantity: (cartItemId: string, quantity: number) => void
  removeLocalItem: (cartItemId: string) => void
  setItemSelection: (cartItemId: string, selected: boolean) => void
  setAllSelected: (selected: boolean) => void
}

type CartStore = CartState & CartActions

function isSameCart(current: CartItemDTO[], next: CartItemDTO[]) {
  if (current.length !== next.length) return false

  for (let index = 0; index < current.length; index += 1) {
    const a = current[index]
    const b = next[index]

    if (
      a.id !== b.id ||
      a.quantity !== b.quantity ||
      a.unitPrice !== b.unitPrice ||
      a.maxQuantity !== b.maxQuantity ||
      a.subtotal !== b.subtotal ||
      a.variantName !== b.variantName ||
      a.unitLabel !== b.unitLabel
    ) {
      return false
    }
  }

  return true
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      userId: null,
      items: [],
      hydrated: false,
      selectedIds: {},
      setHydrated: (hydrated) => set({ hydrated }),
      syncFromServer: (userId, items) => {
        if (!userId) {
          set({ userId: null, items: [], selectedIds: {} })
          return
        }

        const state = get()
        const previousSelected = state.userId === userId ? state.selectedIds : {}
        const previousItems = new Set(state.items.map((item) => item.id))
        const hasPreviousSelection = Object.keys(previousSelected).length > 0

        const nextSelected: Record<string, true> = {}
        for (const item of items) {
          const wasSelected = Boolean(previousSelected[item.id])
          const isNewItem = !previousItems.has(item.id)

          if (wasSelected || isNewItem || !hasPreviousSelection) {
            nextSelected[item.id] = true
          }
        }

        if (
          state.userId === userId &&
          isSameCart(state.items, items) &&
          Object.keys(state.selectedIds).length === Object.keys(nextSelected).length
        ) {
          return
        }

        set({ userId, items, selectedIds: nextSelected })
      },
      updateLocalQuantity: (cartItemId, quantity) => {
        set((state) => {
          if (!state.items.length) return state

          if (quantity <= 0) {
            const nextItems = state.items.filter((item) => item.id !== cartItemId)
            const restSelected = { ...state.selectedIds }
            delete restSelected[cartItemId]
            return { ...state, items: nextItems, selectedIds: restSelected }
          }

          const nextItems = state.items.map((item) =>
            item.id === cartItemId
              ? {
                  ...item,
                  quantity,
                  subtotal: item.unitPrice * quantity,
                }
              : item
          )

          return { ...state, items: nextItems }
        })
      },
      removeLocalItem: (cartItemId) => {
        set((state) => {
          const restSelected = { ...state.selectedIds }
          delete restSelected[cartItemId]
          return {
            ...state,
            items: state.items.filter((item) => item.id !== cartItemId),
            selectedIds: restSelected,
          }
        })
      },
      setItemSelection: (cartItemId, selected) => {
        set((state) => {
          const nextSelected = { ...state.selectedIds }
          if (selected) {
            nextSelected[cartItemId] = true
          } else {
            delete nextSelected[cartItemId]
          }
          return { ...state, selectedIds: nextSelected }
        })
      },
      setAllSelected: (selected) => {
        set((state) => {
          if (!state.items.length) {
            return { ...state, selectedIds: {} }
          }

          if (!selected) {
            return { ...state, selectedIds: {} }
          }

          const nextSelected = state.items.reduce<Record<string, true>>((acc, item) => {
            acc[item.id] = true
            return acc
          }, {})

          return { ...state, selectedIds: nextSelected }
        })
      },
    }),
    {
      name: 'weed-shop-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userId: state.userId,
        items: state.items,
        selectedIds: state.selectedIds,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    }
  )
)

export const selectCartItems = (state: CartStore) => state.items

export const selectCartTotals = (() => {
  let lastItems: CartItemDTO[] | null = null
  let lastTotals = { quantity: 0, price: 0 }

  return (state: CartStore) => {
    if (state.items === lastItems) {
      return lastTotals
    }

    const totals = state.items.reduce(
      (acc, item) => {
        acc.quantity += item.quantity
        acc.price += item.subtotal
        return acc
      },
      { quantity: 0, price: 0 }
    )

    lastItems = state.items
    lastTotals = totals

    return totals
  }
})()

export const selectCartCount = (state: CartStore) =>
  state.items.reduce((total, item) => total + item.quantity, 0)

export const selectCartHydrated = (state: CartStore) => state.hydrated

export const selectCartUserId = (state: CartStore) => state.userId

export const selectCartSelectedIds = (state: CartStore) => state.selectedIds

export const selectCartSelectedItems = (state: CartStore) =>
  state.items.filter((item) => Boolean(state.selectedIds[item.id]))
