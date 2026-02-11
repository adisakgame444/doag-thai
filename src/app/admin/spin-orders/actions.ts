"use server";

import { assertAdminUser } from "@/lib/admin-auth";
import {
  approveSpinOrderPayment,
  rejectSpinOrderPayment,
  approveUserToWin,
} from "@/services/spins";
import { revalidatePath } from "next/cache";

//  อนุมัติคำสั่งซื้อ = อนุมัติให้ชนะ
export async function approveSpinOrderAction(spinOrderId: string) {
  try {
    await assertAdminUser();

    const order = await approveSpinOrderPayment(spinOrderId);
    
    // ❌ ไม่อนุมัติให้ชนะอัตโนมัติ - ต้องให้แอดมินกดอนุมัติเอง
    // await approveUserToWin(order.userId);

    revalidatePath("/admin/spin-orders");
    revalidatePath("/admin/spin-users");
    revalidatePath("/spin/orders");

    return { success: true, message: "อนุมัติคำสั่งซื้อสปินเรียบร้อยแล้ว" };
  } catch (error) {
    console.error("approveSpinOrderAction error:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "ไม่สามารถอนุมัติคำสั่งซื้อสปินได้",
    };
  }
}

export async function rejectSpinOrderAction(spinOrderId: string) {
  try {
    await assertAdminUser();

    await rejectSpinOrderPayment(spinOrderId);

    revalidatePath("/admin/spin-orders");
    revalidatePath("/spin/orders");

    return { success: true, message: "ปฏิเสธคำสั่งซื้อสปินเรียบร้อยแล้ว" };
  } catch (error) {
    console.error("rejectSpinOrderAction error:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "ไม่สามารถปฏิเสธคำสั่งซื้อสปินได้",
    };
  }
}
