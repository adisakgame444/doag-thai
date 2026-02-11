'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import {
  createAddress,
  deleteAddress,
  listAddresses,
  setDefaultAddress,
  updateAddress,
} from '@/services/addresses'
import { addressSchema } from '@/lib/validation/address'
import { AddressDTO } from '@/types/address'

interface AddressActionResponse {
  success: boolean
  address?: AddressDTO
  addresses?: AddressDTO[]
  message?: string
  fieldErrors?: Record<string, string>
}

async function getCurrentUserId() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return session?.user?.id ?? null
}

export async function listAddressesAction(): Promise<AddressActionResponse> {
  const userId = await getCurrentUserId()

  if (!userId) {
    return { success: false, message: 'กรุณาเข้าสู่ระบบ' }
  }

  try {
    const addresses = await listAddresses(userId)
    return { success: true, addresses }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'ไม่สามารถโหลดที่อยู่ได้' }
  }
}

export async function createAddressAction(
  values: unknown
): Promise<AddressActionResponse> {
  const userId = await getCurrentUserId()

  if (!userId) {
    return { success: false, message: 'กรุณาเข้าสู่ระบบ' }
  }

  const parsed = addressSchema.safeParse(values)

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    parsed.error.issues.forEach((issue) => {
      const path = issue.path[0]
      if (typeof path === 'string') {
        fieldErrors[path] = issue.message
      }
    })
    return {
      success: false,
      message: 'กรุณาตรวจสอบข้อมูลที่อยู่',
      fieldErrors,
    }
  }

  try {
    const address = await createAddress(userId, parsed.data)
    return { success: true, address }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'ไม่สามารถบันทึกที่อยู่ได้' }
  }
}

export async function updateAddressAction(
  addressId: string,
  values: unknown
): Promise<AddressActionResponse> {
  const userId = await getCurrentUserId()

  if (!userId) {
    return { success: false, message: 'กรุณาเข้าสู่ระบบ' }
  }

  const parsed = addressSchema.safeParse(values)

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    parsed.error.issues.forEach((issue) => {
      const path = issue.path[0]
      if (typeof path === 'string') {
        fieldErrors[path] = issue.message
      }
    })
    return {
      success: false,
      message: 'กรุณาตรวจสอบข้อมูลที่อยู่',
      fieldErrors,
    }
  }

  try {
    const address = await updateAddress(userId, addressId, parsed.data)

    if (!address) {
      return { success: false, message: 'ไม่พบที่อยู่ที่ต้องการแก้ไข' }
    }

    return { success: true, address }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'ไม่สามารถบันทึกที่อยู่ได้' }
  }
}

export async function deleteAddressAction(addressId: string): Promise<AddressActionResponse> {
  const userId = await getCurrentUserId()

  if (!userId) {
    return { success: false, message: 'กรุณาเข้าสู่ระบบ' }
  }

  try {
    const success = await deleteAddress(userId, addressId)

    if (!success) {
      return { success: false, message: 'ไม่พบที่อยู่ที่ต้องการลบ' }
    }

    const addresses = await listAddresses(userId)

    return {
      success: true,
      addresses,
      message: 'ลบที่อยู่เรียบร้อยแล้ว',
    }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'ไม่สามารถลบที่อยู่ได้' }
  }
}

export async function setDefaultAddressAction(addressId: string): Promise<AddressActionResponse> {
  const userId = await getCurrentUserId()

  if (!userId) {
    return { success: false, message: 'กรุณาเข้าสู่ระบบ' }
  }

  try {
    const success = await setDefaultAddress(userId, addressId)

    if (!success) {
      return { success: false, message: 'ไม่พบที่อยู่ที่ต้องการตั้งเป็นค่าเริ่มต้น' }
    }

    const addresses = await listAddresses(userId)

    return {
      success: true,
      addresses,
      message: 'อัปเดตที่อยู่สำเร็จ',
    }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'ไม่สามารถอัปเดตที่อยู่ได้' }
  }
}
