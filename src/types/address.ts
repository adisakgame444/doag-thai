export interface AddressInput {
  label?: string | null
  recipient: string
  phone: string
  line1: string
  line2?: string | null
  province: string
  district: string
  subdistrict: string
  postalCode: string
  isDefault?: boolean
}

export interface AddressDTO {
  id: string
  label: string | null
  recipient: string
  phone: string
  line1: string
  line2: string | null
  province: string
  district: string
  subdistrict: string
  postalCode: string
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}
