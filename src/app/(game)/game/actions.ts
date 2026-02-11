// My Project Code (actions.ts)

'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { performSpin, voidSpin } from '@/services/spins'

async function getCurrentUserId() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return session?.user?.id ?? null
}

export async function performSpinAction() {
  const userId = await getCurrentUserId()

  if (!userId) {
    return { success: false, message: 'กรุณาเข้าสู่ระบบ' }
  }

  try {
    const result = await performSpin(userId)

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('performSpinAction error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'ไม่สามารถหมุนสปินได้',
    }
  }
}

export async function voidSpinAction(spinHistoryId: string) {
  const userId = await getCurrentUserId()

  if (!userId) {
    return { success: false, message: 'กรุณาเข้าสู่ระบบ' }
  }

  try {
    await voidSpin(spinHistoryId)
    return { success: true }
  } catch (error) {
    console.error('voidSpinAction error:', error)
    return { success: false, message: 'ไม่สามารถยกเลิกผลสปินได้' }
  }
}
