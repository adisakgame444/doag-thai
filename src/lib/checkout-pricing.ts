// import { PaymentMethod } from '@/types/checkout'

// export const PROMPTPAY_SHIPPING_FEE = 50
// export const COD_SHIPPING_FEE = 100

// export interface CheckoutTotals {
//   shippingFee: number
//   deposit: number
//   total: number
//   immediate: number
//   remaining: number
// }

// export function calculateCheckoutTotals(method: PaymentMethod, subtotal: number): CheckoutTotals {
//   if (method === 'PROMPTPAY') {
//     const shippingFee = PROMPTPAY_SHIPPING_FEE
//     const immediate = subtotal + shippingFee
//     return {
//       shippingFee,
//       deposit: 0,
//       total: immediate,
//       immediate,
//       remaining: 0,
//     }
//   }

//   const shippingFee = COD_SHIPPING_FEE
//   return {
//     shippingFee,
//     deposit: shippingFee,
//     total: subtotal + shippingFee,
//     immediate: shippingFee,
//     remaining: subtotal,
//   }
// }


import { PaymentMethod } from '@/types/checkout'

export const PROMPTPAY_SHIPPING_FEE = 50
export const COD_SHIPPING_FEE = 100

export interface CheckoutTotals {
  shippingFee: number
  deposit: number
  total: number
  immediate: number
  remaining: number
}

export function calculateCheckoutTotals(method: PaymentMethod, subtotal: number): CheckoutTotals {
  if (method === 'PROMPTPAY') {
    const shippingFee = PROMPTPAY_SHIPPING_FEE
    const immediate = subtotal + shippingFee
    return {
      shippingFee,
      deposit: 0,
      total: immediate,
      immediate,
      remaining: 0,
    }
  }

  const shippingFee = COD_SHIPPING_FEE
  return {
    shippingFee,
    deposit: shippingFee,
    total: subtotal + shippingFee,
    immediate: shippingFee,
    remaining: subtotal,
  }
}
