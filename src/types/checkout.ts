export type PaymentMethod = 'PROMPTPAY' | 'COD'

export interface CheckoutSelectionState {
  itemsParam: string
  addressId: string | null
}

export interface PaymentSlip {
  file: File
  previewUrl: string
}

export interface PaymentSlipUpload {
  url: string
  fileId?: string | null
}
