"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createSpinOrder, addSpinOrderPayment } from "@/services/spins";
import { SpinPaymentMethod } from "@/generated/prisma/enums";
import { uploadToImageKit } from "@/lib/imagekit";
import { z } from "zod";

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
