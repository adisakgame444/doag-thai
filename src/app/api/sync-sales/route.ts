import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    // 1. ดึงสินค้าทั้งหมดที่มีตัวเลือกย่อย (Weights)
    const products = await db.product.findMany({
      include: {
        ProductWeight: true,
      },
    });

    let updatedCount = 0;

    // 2. วนลูปสินค้าทีละตัว
    for (const product of products) {
      // คำนวณยอดขายสะสมจากอดีต (จากตาราง ProductWeight)
      const historicalSales = product.ProductWeight.reduce((sum, w) => {
        // ยอดขายที่เคยขายได้ (sold)
        const soldQty = w.sold || 0;
        
        // ตัวคูณ (ถ้าใน DB เป็น 100 ก็คูณ 100, ถ้าเป็น 0 หรือ 1 ก็คูณ 1)
        // ** สำคัญ: ระบบจะใช้ค่าจากช่อง weight ที่คุณเพิ่งไปแก้มา **
        const multiplier = w.weight > 0 ? Number(w.weight) : 1;

        // บวกยอดเข้ายอดรวม: ขายไปกี่ชิ้น x จำนวนต่อชิ้น
        return sum + (soldQty * multiplier);
      }, 0);

      // ถ้ามียอดขายเก่า ให้เอาไปอัปเดตใส่ตารางแม่
      if (historicalSales > 0) {
        // เช็คก่อนว่ายอดปัจจุบันมีค่าไหม (เผื่อขายของใหม่ไปบ้างแล้ว)
        const currentTotal = product.totalSold || 0;

        // ถ้าเรา Sync แล้วยอดมันเยอะกว่าเดิม แสดงว่าควรอัปเดต
        // (ใช้ Math.max เผื่อคุณเคยกด Sync ไปแล้ว จะได้ไม่ลดลง)
        if (historicalSales > currentTotal) {
           await db.product.update({
            where: { id: product.id },
            data: {
              totalSold: historicalSales, // บันทึกยอดที่ถูกต้องลงไป
            },
          });
          updatedCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `✅ ดึงยอดขายเก่ากลับมาเรียบร้อยแล้ว! อัปเดตไปทั้งหมด ${updatedCount} รายการ`,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}