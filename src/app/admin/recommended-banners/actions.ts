'use server'

import { assertAdminUser } from '@/lib/admin-auth'
import {
  createRecommendedBanner,
  deleteRecommendedBanner,
  updateRecommendedBanner,
  updateRecommendedBannerOrder,
} from '@/services/recommended-banners'

type CreateBannerArgs = {
  name?: string | null
  file: File
}

type UpdateBannerArgs = {
  id: string
  name?: string | null
  file?: File | null
}

export async function createBannerAction({ name, file }: CreateBannerArgs) {
  await assertAdminUser()

  try {
    await createRecommendedBanner({ name, file })
    return { success: true, message: 'เพิ่มแบนเนอร์สำเร็จ' }
  } catch (error) {
    console.error('[CREATE_BANNER_ACTION]', error)
    const errorMessage = error instanceof Error ? error.message : 'ไม่สามารถเพิ่มแบนเนอร์ได้'
    return { success: false, error: errorMessage }
  }
}

export async function updateBannerAction({ id, name, file }: UpdateBannerArgs) {
  await assertAdminUser()

  try {
    await updateRecommendedBanner({ id, name, file })
    return { success: true, message: 'อัปเดตแบนเนอร์สำเร็จ' }
  } catch (error) {
    console.error('[UPDATE_BANNER_ACTION]', error)
    const errorMessage = error instanceof Error ? error.message : 'ไม่สามารถอัปเดตแบนเนอร์ได้'
    return { success: false, error: errorMessage }
  }
}

export async function deleteBannerAction(id: string) {
  await assertAdminUser()

  try {
    await deleteRecommendedBanner(id)
    return { success: true, message: 'ลบแบนเนอร์สำเร็จ' }
  } catch (error) {
    console.error('[DELETE_BANNER_ACTION]', error)
    const errorMessage = error instanceof Error ? error.message : 'ไม่สามารถลบแบนเนอร์ได้'
    return { success: false, error: errorMessage }
  }
}

export async function updateBannerOrderAction(order: 'newest' | 'oldest') {
  await assertAdminUser()

  try {
    await updateRecommendedBannerOrder(order)
    return { success: true, message: 'ปรับลำดับแบนเนอร์สำเร็จ' }
  } catch (error) {
    console.error('[UPDATE_BANNER_ORDER_ACTION]', error)
    const errorMessage = error instanceof Error ? error.message : 'ไม่สามารถปรับลำดับแบนเนอร์ได้'
    return { success: false, error: errorMessage }
  }
}
