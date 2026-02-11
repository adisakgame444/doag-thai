"use server";

import { getServerSession } from "@/lib/get-session";
import db from "@/lib/db"; 
import { revalidatePath } from "next/cache";

export async function createReviewAction(data: { productId: string; rating: number; comment: string }) {
  const session = await getServerSession();
  if (!session?.user) return { success: false, message: "กรุณาเข้าสู่ระบบ" };

  const userId = session.user.id;

  try {
    // 1. เช็คว่าซื้อจริง และสถานะ COMPLETED
    const hasPurchased = await db.orderItem.findFirst({
      where: {
        productId: data.productId,
        order: {
          userId: userId,
          status: "COMPLETED", 
        }
      }
    });

    if (!hasPurchased) {
      return { success: false, message: "ต้องได้รับสินค้านี้ก่อนจึงจะรีวิวได้" };
    }

    // 2. เช็คว่าเคยรีวิวหรือยัง
    const existingReview = await db.review.findUnique({
      where: {
        userId_productId: { userId, productId: data.productId }
      }
    });

    if (existingReview) {
      return { success: false, message: "คุณรีวิวสินค้านี้ไปแล้ว" };
    }

    // 3. บันทึก
    await db.review.create({
      data: {
        userId,
        productId: data.productId,
        rating: data.rating,
        comment: data.comment,
      },
    });

    // 4. Refresh หน้าเว็บ
    revalidatePath(`/products/${data.productId}`);
    
    return { success: true, message: "บันทึกรีวิวสำเร็จ ขอบคุณครับ!" };

  } catch (error) {
    console.error("Review Error:", error);
    return { success: false, message: "เกิดข้อผิดพลาด โปรดลองใหม่ภายหลัง" };
  }
}