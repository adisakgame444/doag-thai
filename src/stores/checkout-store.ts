'use client'

import { create } from 'zustand'

import { CheckoutSelectionState, PaymentMethod, PaymentSlip } from '@/types/checkout'

type CheckoutState = CheckoutSelectionState & {
  paymentMethod: PaymentMethod | null
  promptpaySlip?: PaymentSlip
  codSlip?: PaymentSlip
}

type CheckoutActions = {
  setSelection: (selection: CheckoutSelectionState) => void
  setPaymentMethod: (method: PaymentMethod) => void
  setPromptpaySlip: (slip?: PaymentSlip) => void
  setCodSlip: (slip?: PaymentSlip) => void
  reset: () => void
}

type CheckoutStore = CheckoutState & CheckoutActions

const initialState: CheckoutState = {
  itemsParam: '',
  addressId: null,
  paymentMethod: null,
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  ...initialState,
  setSelection: (selection) =>
    set((state) => ({
      ...state,
      itemsParam: selection.itemsParam,
      addressId: selection.addressId,
    })),
  setPaymentMethod: (method) =>
    set((state) => ({
      ...state,
      paymentMethod: method,
    })),
  setPromptpaySlip: (slip) =>
    set((state) => ({
      ...state,
      promptpaySlip: slip,
    })),
  setCodSlip: (slip) =>
    set((state) => ({
      ...state,
      codSlip: slip,
    })),
  reset: () => set(initialState),
}))

export const selectCheckoutSelection = (state: CheckoutStore) => ({
  itemsParam: state.itemsParam,
  addressId: state.addressId,
})

export const selectCheckoutPayment = (state: CheckoutStore) => ({
  paymentMethod: state.paymentMethod,
  promptpaySlip: state.promptpaySlip,
  codSlip: state.codSlip,
})


