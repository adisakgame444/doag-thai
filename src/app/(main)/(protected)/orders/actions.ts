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

// "use server";

// import { auth } from "@/lib/auth";
// import db from "@/lib/db";
// import { headers } from "next/headers";

// export async function checkOrderOutOfStockAction() {
//   try {
//     const headersList = await headers();
//     const session = await auth.api.getSession({
//       headers: headersList,
//     });

//     const userId = session?.user?.id;

//     // 1. ถ้าไม่ได้ Login ให้คืนค่า false ทันทีเพื่อไม่ให้ระบบทำงานหนักเกินจำเป็น
//     if (!userId) return { hasAlert: false };

//     // 2. Query หา Order
//     const orderWithIssue = await db.order.findFirst({
//       where: {
//         userId: userId,
//         status: {
//           in: ["PROCESSING", "PENDING_VERIFICATION", "PENDING_PAYMENT"],
//         },
//         items: {
//           some: { status: "OUT_OF_STOCK" },
//         },
//       },
//       orderBy: {
//         updatedAt: "desc",
//       },
//       select: {
//         id: true,
//         orderNumber: true,
//         updatedAt: true, // ✅ เพิ่มบรรทัดนี้ เพื่อเอาเวลาอัปเดตล่าสุด
//         _count: {
//           select: {
//             items: {
//               where: { status: "OUT_OF_STOCK" }, // ✅ หรือนับจำนวนสินค้าที่หมด
//             },
//           },
//         },
//       },
//     });

//     if (orderWithIssue) {
//       return {
//         hasAlert: true,
//         orderId: orderWithIssue.id,
//         orderNumber: orderWithIssue.orderNumber,
//         // ✅ ส่งค่าที่เปลี่ยนแปลงได้กลับไป (ใช้เวลา หรือ จำนวนชิ้น)
//         lastUpdated: orderWithIssue.updatedAt.getTime(),
//         itemCount: orderWithIssue._count.items,
//       };
//     }

//     return { hasAlert: false };
//   } catch (error) {
//     console.error("Error checking order status:", error);
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
    if (!userId) return { hasAlert: false };

    // 1. ค้นหาออเดอร์ที่มีสินค้าหมด โดยเน้นตัวที่เพิ่งอัปเดตล่าสุดจริงๆ
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
      select: {
        id: true,
        orderNumber: true,
        updatedAt: true,
        items: {
          where: { status: "OUT_OF_STOCK" },
          select: { updatedAt: true },
          orderBy: { updatedAt: "desc" },
          take: 1, // เอาเวลาของสินค้าชิ้นที่เพิ่งโดนกด "หมด" ล่าสุดมาด้วย
        },
        _count: {
          select: {
            items: { where: { status: "OUT_OF_STOCK" } },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (orderWithIssue) {
      // 🚩 สร้าง "รหัสลายนิ้วมือ" ของความเปลี่ยนแปลง
      // ถ้าแอดมินกดชิ้นที่ 2 ปุ๊บ เวลาของ item ล่าสุดจะเปลี่ยนทันที ทำให้ Hash เปลี่ยน
      const lastItemUpdate = orderWithIssue.items[0]?.updatedAt.getTime() || 0;
      const orderUpdate = orderWithIssue.updatedAt.getTime();
      const count = orderWithIssue._count.items;

      return {
        hasAlert: true,
        orderId: orderWithIssue.id,
        orderNumber: orderWithIssue.orderNumber,
        // ✅ ใช้ตัวนี้เป็นตัวเช็คที่หน้าบ้าน (Composite Key)
        changeHash: `${orderWithIssue.id}-${orderUpdate}-${lastItemUpdate}-${count}`,
        itemCount: count,
      };
    }

    return { hasAlert: false };
  } catch (error) {
    console.error("Error checking order status:", error);
    return { hasAlert: false };
  }
}
