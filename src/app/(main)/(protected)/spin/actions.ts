"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createSpinOrder, addSpinOrderPayment } from "@/services/spins";
import { SpinPaymentMethod } from "@/generated/prisma/enums";
import { uploadToImageKit } from "@/lib/imagekit";
import { z } from "zod";
import db from "@/lib/db"; // หรือ path ของ prisma client คุณ
import { revalidatePath } from "next/cache";

async function getCurrentUserId() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user?.id ?? null;
}

const CreateSpinOrderZ = z.object({
  packageId: z.string().min(1),
  paymentMethod: z.enum(["PROMPTPAY", "MANUAL_TRANSFER"]),
  slipUrl: z.string().optional().nullable(),
  slipFileId: z.string().optional().nullable(),
  amount: z.number().positive(),
});

export async function createSpinOrderAction(rawInput: unknown) {
  const parsed = CreateSpinOrderZ.safeParse(rawInput);
  if (!parsed.success) {
    return { success: false, message: "ข้อมูลไม่ถูกต้อง" };
  }

  const input = parsed.data;
  const userId = await getCurrentUserId();

  if (!userId) {
    return { success: false, message: "กรุณาเข้าสู่ระบบ" };
  }

  try {
    // สร้าง SpinOrder
    const spinOrder = await createSpinOrder({
      userId,
      packageId: input.packageId,
      paymentMethod: input.paymentMethod as SpinPaymentMethod,
    });

    // เพิ่ม payment
    await addSpinOrderPayment({
      spinOrderId: spinOrder.id,
      amount: input.amount,
      slipUrl: input.slipUrl ?? null,
      slipFileId: input.slipFileId ?? null,
    });

    return {
      success: true,
      orderNumber: spinOrder.orderNumber,
      message: "สร้างคำสั่งซื้อสปินสำเร็จ",
    };
  } catch (error) {
    console.error("createSpinOrderAction error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "ไม่สามารถสร้างคำสั่งซื้อได้",
    };
  }
}

const MAX_SLIP_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

async function detectImageType(file: File): Promise<string | null> {
  try {
    const buf = await file.arrayBuffer();
    const bytes = new Uint8Array(buf);

    // PNG
    if (bytes[0] === 0x89 && bytes[1] === 0x50) return "image/png";
    // JPG
    if (bytes[0] === 0xff && bytes[1] === 0xd8) return "image/jpeg";
    // WEBP
    if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[8] === 0x57)
      return "image/webp";

    return null;
  } catch {
    return null;
  }
}

export async function uploadSpinPaymentSlipAction(formData: FormData) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { success: false, message: "กรุณาเข้าสู่ระบบ" };
  }

  const file = formData.get("file") as File | null;
  const rawLabel = formData.get("label") as string | null;
  const label = (rawLabel ?? "weed_store/spin_payment")
    .replace(/[^a-zA-Z0-9_\/\-\s]/g, "")
    .slice(0, 120);

  if (!file) {
    return { success: false, message: "ไม่พบไฟล์" };
  }

  // Validate MIME + magic bytes
  const magicType = await detectImageType(file);
  if (
    !ALLOWED_IMAGE_TYPES.has(file.type) &&
    !ALLOWED_IMAGE_TYPES.has(magicType!)
  ) {
    return { success: false, message: "รองรับเฉพาะ PNG, JPG, WEBP" };
  }
  if (file.size > MAX_SLIP_SIZE) {
    return { success: false, message: "ไฟล์ใหญ่เกิน 5MB" };
  }

  try {
    const res = await uploadToImageKit(file, label);
    if (!res.url || !res.fileId) {
      return {
        success: false,
        message: res.message ?? "อัปโหลดรูปไม่สำเร็จ",
      };
    }

    return { success: true, url: res.url, fileId: res.fileId };
  } catch (e) {
    console.error("uploadSpinPaymentSlipAction error:", e);
    return { success: false, message: "เกิดข้อผิดพลาด" };
  }
}

// ✅ อัปเดต Schema ให้ยืดหยุ่นขึ้น แต่ยังปลอดภัย
const ClaimRewardSchema = z.object({
  spinHistoryId: z.string().min(1),

  // 1. ชื่อ: อนุญาต จุด (.) และ ขีด (-) เพิ่มเผื่อกรณีคำนำหน้าหรือชื่อเฉพาะ
  shippingName: z
    .string()
    .trim() // ตัดช่องว่างหน้าหลังออกอัตโนมัติ
    .min(2, "ชื่อสั้นเกินไป")
    .regex(
      /^[a-zA-Z\u0E00-\u0E7F\s\.\-]+$/,
      "ชื่อต้องเป็นภาษาไทย/อังกฤษ ห้ามมีตัวเลขหรือสัญลักษณ์แปลกๆ (อนุญาตแค่ . และ -)",
    ),

  // 2. เบอร์โทร: บังคับ 10 หลักเป๊ะๆ
  shippingPhone: z
    .string()
    .trim()
    .regex(/^0\d{9}$/, "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก (เช่น 081xxxxxxx)"),

  // 3. ที่อยู่: อนุญาตเครื่องหมาย # (บ้านเลขที่) และ : (อาคาร) และการขึ้นบรรทัดใหม่
  shippingAddress: z
    .string()
    .trim()
    .min(10, "กรุณาระบุที่อยู่ให้ชัดเจนกว่านี้")
    .regex(
      /^[a-zA-Z0-9\u0E00-\u0E7F\s\/\-\.,\(\)\#\:\n\r]+$/,
      "ที่อยู่มีอักขระต้องห้าม (อนุญาตเฉพาะตัวหนังสือ ตัวเลข และเครื่องหมาย / - . , ( ) # : )",
    ),
  slotImageId: z.string().nullable().optional(), // 🌟 2. เพิ่มบรรทัดนี้เพื่อรองรับ slotImageId
});

// export async function claimRewardAction(data: {
//   spinHistoryId: string
//   prizeName: string
//   shippingName: string
//   shippingPhone: string
//   shippingAddress: string
//   userId: string
// }) {
//   try {
//     // 1. เช็คก่อนว่ารางวัลนี้ถูกกดรับไปหรือยัง
//     const historyItem = await db.spinHistory.findUnique({
//       where: { id: data.spinHistoryId },
//     })

//     if (!historyItem || historyItem.isClaimed) {
//       return { success: false, message: "รางวัลนี้ถูกกดรับไปแล้ว หรือไม่พบข้อมูล" }
//     }

//     // 2. สร้าง Order ใหม่ (เพื่อให้แอดมินเห็นในระบบ Order ปกติ)
//     // หมายเหตุ: ตรงนี้เราสร้าง Order ราคา 0 บาท
//     const newOrder = await db.order.create({
//       data: {
//         orderNumber: `RWD-${Date.now()}`, // รหัส Order ขึ้นต้นด้วย RWD (Reward)
//         userId: data.userId,
//         status: "PENDING_VERIFICATION", // หรือ status ที่แอดมินรู้ว่าต้องส่งของ
//         paymentMethod: "COD", // ใส่หลอกไว้ หรือเพิ่ม Enum 'REWARD'
//         paymentStatus: "APPROVED", // ถือว่าจ่ายแล้วเพราะเป็นรางวัล
//         subtotal: 0,
//         totalAmount: 0,
//         shippingName: data.shippingName,
//         shippingPhone: data.shippingPhone,
//         shippingLine1: data.shippingAddress,
//         shippingProvince: "-", // ถ้าฟอร์มย่อก็ใส่ - ไว้ก่อน
//         shippingDistrict: "-",
//         shippingSubdistrict: "-",
//         shippingPostalCode: "-",
//         items: {
//           create: {
//             productTitle: `[รางวัล] ${data.prizeName}`,
//             quantity: 1,
//             unitPrice: 0,
//             subtotal: 0,
//           }
//         }
//       }
//     })

//     // 3. อัปเดต SpinHistory ว่ากดรับแล้ว
//     await db.spinHistory.update({
//       where: { id: data.spinHistoryId },
//       data: {
//         isClaimed: true,
//         claimOrderId: newOrder.id
//       }
//     })

//     revalidatePath('/spin/history')
//     return { success: true, message: "แจ้งรับรางวัลเรียบร้อยแล้ว!" }

//   } catch (error) {
//     console.error("Claim error:", error)
//     return { success: false, message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" }
//   }
// }

export async function claimRewardAction(rawInput: unknown) {
  // 1. ✅ Authentication Check: ดึง UserId จาก Session เท่านั้น
  const userId = await getCurrentUserId();
  if (!userId) {
    return { success: false, message: "กรุณาเข้าสู่ระบบก่อนรับรางวัล" };
  }

  // 2. ✅ Input Validation: ตรวจสอบข้อมูลด้วย Zod
  const parsed = ClaimRewardSchema.safeParse(rawInput);

  if (!parsed.success) {
    // ⚠️ แก้ตรงนี้ครับ: เปลี่ยนจาก .errors เป็น .issues
    return { success: false, message: parsed.error.issues[0].message };
  }

  const data = parsed.data;
  console.log("🔴 ข้อมูลที่รับมาจากหน้าเว็บ:", data);

  try {
    // 3. ✅ Database Transaction: ทำงานแบบ "ไปพร้อมกัน" หรือ "ล้มเหลวพร้อมกัน"
    return await db.$transaction(async (tx) => {
      // A. ค้นหาประวัติการหมุน
      const spinHistory = await tx.spinHistory.findUnique({
        where: { id: data.spinHistoryId },
      });

      // B. ✅ Ownership & Status Check (สำคัญที่สุด)
      if (!spinHistory) {
        throw new Error("ไม่พบข้อมูลรางวัลนี้");
      }

      // ป้องกันคนแอบอ้าง User ID คนอื่นมารับของ
      if (spinHistory.userId !== userId) {
        throw new Error("คุณไม่มีสิทธิ์ในของรางวัลชิ้นนี้");
      }

      // ป้องกันการกดซ้ำ (Double Claim)
      if (spinHistory.isClaimed) {
        throw new Error("รางวัลนี้ถูกกดรับไปเรียบร้อยแล้ว");
      }

      // C. สร้าง Order
      // ⚠️ เราใช้ spinHistory.prizeName จาก DB โดยตรง เพื่อกันการปลอมชื่อรางวัล
      const newOrder = await tx.order.create({
        data: {
          orderNumber: `RWD-${Date.now()}`,
          userId: userId, // ใช้ ID จาก Session
          status: "PENDING_VERIFICATION", // เช็ค Enum ใน Schema ด้วยว่าใช้คำนี้ได้ไหม
          paymentMethod: "COD",
          paymentStatus: "PENDING",
          subtotal: 0,
          totalAmount: 0,
          shippingName: data.shippingName,
          shippingPhone: data.shippingPhone,
          shippingLine1: data.shippingAddress, // เช็คชื่อ Field ใน Schema ว่าตรงกันไหม
          // shippingAddress: data.shippingAddress, // ถ้า Schema ใช้ field นี้ให้เปิดบรรทัดนี้แทน
          shippingProvince: "-",
          shippingDistrict: "-",
          shippingSubdistrict: "-",
          shippingPostalCode: "-",
          items: {
            create: {
              productTitle: `[รางวัล] ${spinHistory.prizeName}`, // ✅ ปลอดภัย: ดึงชื่อจาก DB
              quantity: 1,
              unitPrice: 0,
              subtotal: 0,
              productSku: null, // กลับไปปล่อยว่างไว้ตามหน้าที่ปกติของมัน
              spinSlotImageId: data.slotImageId,
            },
          },
        },
      });

      // D. อัปเดตสถานะรางวัล
      await tx.spinHistory.update({
        where: { id: spinHistory.id },
        data: {
          isClaimed: true,
          claimOrderId: newOrder.id, // ต้องมั่นใจว่า Schema มี field นี้
        },
      });

      return { success: true, message: "แจ้งรับรางวัลเรียบร้อยแล้ว!" };
    });
  } catch (error) {
    console.error("Claim Reward Error:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
    };
  } finally {
    revalidatePath("/spin/history");
  }
}
