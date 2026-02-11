// import { auth } from "@/lib/auth";
// import db from "@/lib/db";
// import { headers } from "next/headers";

// export async function checkOrderOutOfStockAction() {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });
//   const userId = session?.user?.id;

//   if (!userId) return { hasAlert: false };

//   try {
//     // ค้นหาออเดอร์ที่ยังมีสถานะดำเนินการ แต่มีสินค้าข้างในสถานะ OUT_OF_STOCK
//     const orderWithIssue = await db.order.findFirst({
//       where: {
//         userId: userId,
//         status: { in: ["PROCESSING", "PENDING_VERIFICATION", "PENDING_PAYMENT"] },
//         items: {
//           some: { status: "OUT_OF_STOCK" }
//         }
//       },
//       select: {
//         id: true,
//         orderNumber: true
//       }
//     });

//     if (orderWithIssue) {
//       return {
//         hasAlert: true,
//         orderId: orderWithIssue.id,
//         orderNumber: orderWithIssue.orderNumber
//       };
//     }

//     return { hasAlert: false };
//   } catch (error) {
//     return { hasAlert: false };
//   }
// }

"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { headers } from "next/headers";

export async function checkOrderOutOfStockAction() {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    const userId = session?.user?.id;

    // 1. ถ้าไม่ได้ Login ให้คืนค่า false ทันทีเพื่อไม่ให้ระบบทำงานหนักเกินจำเป็น
    if (!userId) return { hasAlert: false };

    // 2. Query หา Order
    const orderWithIssue = await db.order.findFirst({
      where: {
        userId: userId,
        status: {
          in: ["PROCESSING", "PENDING_VERIFICATION", "PENDING_PAYMENT"],
        },
        items: {
          some: { status: "OUT_OF_STOCK" },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        orderNumber: true,
      },
    });

    if (orderWithIssue) {
      return {
        hasAlert: true,
        orderId: orderWithIssue.id,
        orderNumber: orderWithIssue.orderNumber,
      };
    }

    return { hasAlert: false };
  } catch (error) {
    console.error("Error checking order status:", error);
    return { hasAlert: false };
  }
}
