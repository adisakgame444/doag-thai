// import db from "@/lib/db";
// import { removeCartItem } from "@/services/cart";

// export async function autoDeleteExpiredCartItems() {
//   try {
//     // เวลาเกิน 3 วัน
//     const expiredAt = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

//     // หา cart ที่หมดอายุ
//     const expiredItems = await db.cart.findMany({
//       where: {
//         createdAt: { lt: expiredAt },
//       },
//       select: {
//         id: true,
//         userId: true,
//       },
//     });

//     if (!expiredItems.length) return 0;

//     // ลบทีละรายการด้วยฟังก์ชันเดียวกับปุ่มลบ
//     for (const item of expiredItems) {
//       await removeCartItem({
//         userId: item.userId,
//         cartItemId: item.id,
//       });
//     }

//     return expiredItems.length;
//   } catch (error) {
//     console.error("[autoDeleteExpiredCartItems] error:", error);
//     throw new Error("ลบสินค้าเก่าไม่สำเร็จ");
//   }
// }

// import db from "@/lib/db";
// import { removeCartItem } from "@/services/cart";

// export async function autoDeleteExpiredCartItems() {
//   try {
//     // const expiredAt = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
//     const TWO_HOURS = 2 * 60 * 60 * 1000;
//     const expiredAt = new Date(Date.now() - TWO_HOURS);

//     const expiredItems = await db.cart.findMany({
//       where: {
//         createdAt: { lt: expiredAt },
//       },
//       select: {
//         id: true,
//         userId: true,
//       },
//     });

//     if (!expiredItems.length) return 0;

//     await Promise.all(
//       expiredItems.map((item) =>
//         removeCartItem({
//           userId: item.userId,
//           cartItemId: item.id,
//         })
//       )
//     );

//     // for (const item of expiredItems) { // อันเก่า
//     //   await removeCartItem({
//     //     userId: item.userId,
//     //     cartItemId: item.id,
//     //   });
//     // }

//     return expiredItems.length;
//   } catch (error) {
//     console.error("[autoDeleteExpiredCartItems] error:", error);
//     throw error;
//   }
// }

import db from "@/lib/db";
import { removeCartItem } from "@/services/cart";

export async function autoDeleteExpiredCartItems() {
  try {
    // ลบ cart ที่เกิน 2 ชั่วโมง
    const TWO_HOURS = 2 * 60 * 60 * 1000;
    const expiredAt = new Date(Date.now() - TWO_HOURS);

    // หา cart ที่หมดอายุ
    const expiredItems = await db.cart.findMany({
      where: {
        createdAt: { lt: expiredAt },
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!expiredItems.length) return 0;

    // ลบหลายอันพร้อมกัน แต่ไม่พังทั้งก้อนถ้ามี error บางตัว
    const results = await Promise.allSettled(
      expiredItems.map((item) =>
        removeCartItem({
          userId: item.userId,
          cartItemId: item.id,
        })
      )
    );

    // นับผลลัพธ์
    const success = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    console.log(
      `[autoDeleteExpiredCartItems] success=${success}, failed=${failed}`
    );

    // คืนจำนวนที่ลบสำเร็จ
    return success;
  } catch (error) {
    console.error("[autoDeleteExpiredCartItems] error:", error);
    throw error;
  }
}
