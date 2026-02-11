// "use server";

// import { revalidatePath, revalidateTag } from "next/cache";

// import { assertAdminUser } from "@/lib/admin-auth";
// import {
//   approveOrderPayment,
//   rejectOrderPayment,
//   updateOrderStatus,
// } from "@/services/orders";
// import { OrderStatus } from "@/generated/prisma";
// import { ADMIN_DEFAULT_PAGE_SIZE, normalizePagination } from "@/lib/pagination";

// async function revalidateOrderPaths() {
//   revalidatePath("/admin/orders");
//   revalidatePath("/orders");
//   revalidateTag("products");
// }

// export async function approvePaymentAction(orderId: string) {
//   await assertAdminUser();

//   try {
//     await approveOrderPayment(orderId);
//     await revalidateOrderPaths();
//     return { success: true };
//   } catch (error) {
//     if (error instanceof Error) {
//       return { success: false, message: error.message };
//     }
//     return { success: false, message: "ไม่สามารถอนุมัติการชำระเงินได้" };
//   }
// }

// export async function rejectPaymentAction(orderId: string) {
//   await assertAdminUser();

//   try {
//     await rejectOrderPayment(orderId);
//     await revalidateOrderPaths();
//     return { success: true };
//   } catch (error) {
//     if (error instanceof Error) {
//       return { success: false, message: error.message };
//     }
//     return { success: false, message: "ไม่สามารถปฏิเสธการชำระเงินได้" };
//   }
// }

// export async function updateOrderStatusAction(
//   orderId: string,
//   status: OrderStatus,
//   trackingNumber?: string,
//   carrier?: string
// ) {
//   await assertAdminUser();

//   try {
//     await updateOrderStatus(orderId, status, { trackingNumber, carrier });
//     await revalidateOrderPaths();
//     return { success: true };
//   } catch (error) {
//     if (error instanceof Error) {
//       return { success: false, message: error.message };
//     }
//     return { success: false, message: "ไม่สามารถอัปเดตสถานะคำสั่งซื้อได้" };
//   }
// }

// interface SearchOrdersActionInput {
//   search?: string | null;
//   page?: number | string | null;
//   pageSize?: number | string | null;
// }

// export async function searchOrdersAction({
//   search,
//   page,
//   pageSize,
// }: SearchOrdersActionInput = {}) {
//   await assertAdminUser();

//   const params = new URLSearchParams();

//   const sanitizedSearch = search?.trim() ?? "";
//   const hasPageInput = page !== undefined && page !== null;
//   const hasPageSizeInput = pageSize !== undefined && pageSize !== null;

//   if (hasPageInput || hasPageSizeInput) {
//     const pagination = normalizePagination(
//       { page, pageSize },
//       { defaultPageSize: ADMIN_DEFAULT_PAGE_SIZE }
//     );

//     if (hasPageSizeInput) {
//       params.set("pageSize", String(pagination.pageSize));
//     }

//     if (pagination.page > 1) {
//       params.set("page", String(pagination.page));
//     }
//   }

//   if (sanitizedSearch.length > 0) {
//     params.set("search", sanitizedSearch);
//   }

//   await revalidateOrderPaths();

//   const query = params.toString();

//   return {
//     success: true,
//     redirectUrl: query ? `/admin/orders?${query}` : "/admin/orders",
//   };
// }

"use server";

import { revalidatePath, updateTag } from "next/cache";
import prisma from "@/lib/db"; // ตรวจสอบ path db ของคุณให้ถูกต้อง
import { assertAdminUser } from "@/lib/admin-auth";
import {
  approveOrderPayment,
  rejectOrderPayment,
  updateOrderStatus,
} from "@/services/orders";
import { OrderStatus } from "@/generated/prisma/enums";
import { ADMIN_DEFAULT_PAGE_SIZE, normalizePagination } from "@/lib/pagination";
import db from "@/lib/db";

async function revalidateOrderPaths() {
  // ใช้ Tag-based caching แทน revalidatePath
  updateTag("orders");
  updateTag("products");
}

export async function markItemOutOfStockAction(orderItemId: string) {
  await assertAdminUser();

  try {
    await prisma.orderItem.update({
      where: { id: orderItemId },
      data: { status: "OUT_OF_STOCK" },
    });

    updateTag("orders"); // สั่ง refresh หน้าจอทันที
    revalidatePath("/", "layout"); // สั่งล้างแคชระดับ Layout ที่ Banner อาศัยอยู่

    return { success: true };
  } catch (error) {
    console.error("markItemOutOfStock error:", error);
    return { success: false, message: "ไม่สามารถอัปเดตสถานะได้" };
  }
}

export async function approvePaymentAction(orderId: string) {
  await assertAdminUser();

  try {
    await approveOrderPayment(orderId);
    await revalidateOrderPaths();
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "ไม่สามารถอนุมัติการชำระเงินได้" };
  }
}

export async function rejectPaymentAction(orderId: string) {
  await assertAdminUser();

  try {
    await rejectOrderPayment(orderId);
    await revalidateOrderPaths();
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "ไม่สามารถปฏิเสธการชำระเงินได้" };
  }
}

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus,
  trackingNumber?: string,
  carrier?: string,
) {
  await assertAdminUser();

  try {
    await updateOrderStatus(orderId, status, { trackingNumber, carrier });
    await revalidateOrderPaths();
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "ไม่สามารถอัปเดตสถานะคำสั่งซื้อได้" };
  }
}

interface SearchOrdersActionInput {
  search?: string | null;
  page?: number | string | null;
  pageSize?: number | string | null;
}

export async function searchOrdersAction({
  search,
  page,
  pageSize,
}: SearchOrdersActionInput = {}) {
  await assertAdminUser();

  const params = new URLSearchParams();

  const sanitizedSearch = search?.trim() ?? "";
  const hasPageInput = page !== undefined && page !== null;
  const hasPageSizeInput = pageSize !== undefined && pageSize !== null;

  if (hasPageInput || hasPageSizeInput) {
    const pagination = normalizePagination(
      { page, pageSize },
      { defaultPageSize: ADMIN_DEFAULT_PAGE_SIZE },
    );

    if (hasPageSizeInput) {
      params.set("pageSize", String(pagination.pageSize));
    }

    if (pagination.page > 1) {
      params.set("page", String(pagination.page));
    }
  }

  if (sanitizedSearch.length > 0) {
    params.set("search", sanitizedSearch);
  }

  await revalidateOrderPaths();

  const query = params.toString();

  return {
    success: true,
    redirectUrl: query ? `/admin/orders?${query}` : "/admin/orders",
  };
}

// ✅ เพิ่ม Action สำหรับอนุมัติสลิปแยกเป็นรายใบ
// export async function approveSpecificPaymentAction(paymentId: string) {
//   await assertAdminUser(); // ตรวจสอบสิทธิ์แอดมิน

//   try {
//     // 1. อัปเดตสถานะสลิปใบนั้นใน Database ให้เป็น APPROVED
//     await prisma.orderPayment.update({
//       where: { id: paymentId },
//       data: {
//         status: "APPROVED" // เปลี่ยนจาก WAITING_VERIFICATION เป็น APPROVED
//       },
//     });

//     // 2. ล้าง Cache เพื่อให้หน้าแอดมินและหน้าลูกค้าเห็นข้อมูลล่าสุด
//     await revalidateOrderPaths();

//     return { success: true, message: "อนุมัติสลิปเรียบร้อยแล้ว" };
//   } catch (error) {
//     console.error("approveSpecificPayment error:", error);
//     return { success: false, message: "ไม่สามารถอนุมัติสลิปใบนี้ได้" };
//   }
// }

export async function approveSpecificPaymentAction(paymentId: string) {
  // await assertAdminUser();

  try {
    // 1. อัปเดตสถานะสลิป
    const updatedPayment = await db.orderPayment.update({
      where: { id: paymentId },
      data: {
        status: "APPROVED",
        paidAt: new Date(),
      },
      include: {
        order: {
          include: {
            payments: true,
          },
        },
      },
    });

    const order = updatedPayment.order;

    // 2. คำนวณยอดจ่ายรวม
    const totalPaid = order.payments
      .filter((p) => p.status === "APPROVED")
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    // 3. เช็คว่าจ่ายครบไหม
    const isFullyPaid = totalPaid >= order.totalAmount - 0.01;

    // 4. ถ้าจ่ายครบ -> เรียกฟังก์ชันใหญ่ไปตัดสต็อก!
    if (isFullyPaid) {
      console.log(
        `✅ Order ${order.orderNumber} จ่ายครบแล้ว -> กำลังตัดสต็อกสินค้าใหม่...`,
      );
      await approveOrderPayment(order.id);
    }

    // 5. ล้าง Cache
    if (typeof revalidateOrderPaths === "function") {
      await revalidateOrderPaths();
    }

    return { success: true, message: "อนุมัติสลิปและดำเนินการเรียบร้อย" };
  } catch (error: any) {
    // 👈 ใส่ : any เพื่อให้ดึง .message ได้
    console.error("approveSpecificPayment error:", error);

    // 🔴 แก้ตรงนี้ครับ! ให้มันบอกสาเหตุจริงๆ ออกมา
    return {
      success: false,
      message: error?.message || "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
    };
  }
}

// ✅ (เพิ่มเติม) Action สำหรับปฏิเสธสลิป กรณีสลิปปลอมหรือไม่ถูกต้อง
export async function rejectSpecificPaymentAction(paymentId: string) {
  await assertAdminUser();

  try {
    await prisma.orderPayment.update({
      where: { id: paymentId },
      data: {
        status: "REJECTED", // เปลี่ยนเป็น REJECTED
      },
    });

    await revalidateOrderPaths();
    return { success: true, message: "ปฏิเสธสลิปเรียบร้อยแล้ว" };
  } catch (error) {
    console.error("rejectSpecificPayment error:", error);
    return { success: false, message: "ไม่สามารถดำเนินการได้" };
  }
}

export async function updateOrderItemTrackingAction(
  orderItemId: string,
  carrier: string,
  trackingNumber: string,
) {
  await assertAdminUser();
  try {
    await prisma.orderItem.update({
      where: { id: orderItemId },
      data: {
        carrier: carrier || null, // ถ้าส่งค่าว่างมาจะบันทึกเป็น null
        trackingNumber: trackingNumber || null,
      },
    });

    updateTag("orders"); // ✅ สำคัญมาก: เพื่อให้หน้า Admin โหลดข้อมูลใหม่ทันที
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "บันทึกไม่สำเร็จ" };
  }
}
