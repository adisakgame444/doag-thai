"use server";

import {  assertAdminUser } from "@/lib/admin-auth";
import {
  deleteUserSpinConfig,
  approveUserToWin,
  revokeUserWinPermission,
} from "@/services/spins";
import { revalidatePath } from "next/cache";

export async function deleteUserSpinConfigAction(userId: string) {
  try {
    await assertAdminUser();
    await deleteUserSpinConfig(userId);
    revalidatePath("/admin/spin-users");
    return { success: true, message: "ลบการตั้งค่าสปินเรียบร้อยแล้ว" };
  } catch (error) {
    console.error("deleteUserSpinConfigAction error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "เกิดข้อผิดพลาด",
    };
  }
}

export async function approveUserToWinAction(userId: string) {
  try {
    await assertAdminUser();
    await approveUserToWin(userId);
    revalidatePath("/admin/spin-users");
    return { success: true, message: "อนุมัติให้ชนะครั้งถัดไปแล้ว" };
  } catch (error) {
    console.error("approveUserToWinAction error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "เกิดข้อผิดพลาด",
    };
  }
}

export async function revokeUserWinAction(userId: string) {
  try {
    await assertAdminUser();
    await revokeUserWinPermission(userId);
    revalidatePath("/admin/spin-users");
    return { success: true, message: "ยกเลิกการอนุมัติแล้ว" };
  } catch (error) {
    console.error("revokeUserWinAction error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "เกิดข้อผิดพลาด",
    };
  }
}
