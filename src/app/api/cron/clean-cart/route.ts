// import { NextResponse } from "next/server";
// import { autoDeleteExpiredCartItems } from "@/services/cart-auto-delete";

// export async function GET() {
//   try {
//     const count = await autoDeleteExpiredCartItems();

//     return NextResponse.json({
//       success: true,
//       removed: count,
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { success: false, message: "ลบสินค้าเก่าไม่สำเร็จ" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { autoDeleteExpiredCartItems } from "@/services/cart-auto-delete";

export async function GET() {
  try {
    const deleted = await autoDeleteExpiredCartItems();
    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error("CRON ERROR:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
