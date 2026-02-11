// 'use server'

// import { auth } from '@/lib/auth'
// import { headers } from 'next/headers'

// import { createOrder } from '@/services/orders'
// import { getCartItemsByIds, clearCart } from '@/services/cart'
// import { uploadToImageKit } from '@/lib/imagekit'
// import { PaymentMethod } from '@/types/checkout'
// import { calculateCheckoutTotals } from '@/lib/checkout-pricing'
// import { PaymentStatus } from '@/generated/prisma'

// interface SubmitOrderInput {
//   cartItemIds: string[]
//   addressId: string
//   paymentMethod: PaymentMethod
//   subtotal: number
//   shippingFee: number
//   depositAmount: number
//   totalAmount: number
//   shippingInfo: {
//     name: string
//     phone: string
//     line1: string
//     line2?: string | null
//     province: string
//     district: string
//     subdistrict: string
//     postalCode: string
//   }
//   notes?: string | null
//   payments: Array<{
//     method: PaymentMethod
//     amount: number
//     slipUrl?: string | null
//     slipFileId?: string | null
//   }>
// }

// async function getCurrentUserId() {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   })
//   return session?.user?.id ?? null
// }

// export async function uploadPaymentSlipAction(formData: FormData) {
//   const userId = await getCurrentUserId()

//   if (!userId) {
//     return {
//       success: false,
//       message: 'กรุณาเข้าสู่ระบบ',
//     }
//   }

//   const file = formData.get('file') as File | null
//   const label = (formData.get('label') as string | null) ?? 'weed_store/payment'

//   if (!file) {
//     return {
//       success: false,
//       message: 'ไม่พบไฟล์สำหรับอัปโหลด',
//     }
//   }

//   const { url, fileId, message } = await uploadToImageKit(file, label)

//   if (!url || !fileId) {
//     return {
//       success: false,
//       message: message ?? 'ไม่สามารถอัปโหลดไฟล์ได้',
//     }
//   }

//   return {
//     success: true,
//     url,
//     fileId,
//   }
// }

// export async function submitOrderAction(input: SubmitOrderInput) {
//   const userId = await getCurrentUserId()
//   if (!userId) {
//     return {
//       success: false,
//       message: 'กรุณาเข้าสู่ระบบ',
//     }
//   }

//   const { cartItemIds } = input
//   if (!cartItemIds || cartItemIds.length === 0) {
//     return {
//       success: false,
//       message: 'ไม่พบรายการสินค้า',
//     }
//   }

//   try {
//     const items = await getCartItemsByIds(userId, cartItemIds)
//     if (items.length === 0) {
//       return {
//         success: false,
//         message: 'ไม่พบสินค้าในตะกร้า',
//       }
//     }

//     const totals = calculateCheckoutTotals(input.paymentMethod, input.subtotal)

//     const normalizedPayments = input.payments.map((payment) => ({
//       method: payment.method,
//       amount: payment.amount,
//       slipUrl: payment.slipUrl ?? null,
//       slipFileId: payment.slipFileId ?? null,
//       status:
//         payment.slipUrl || payment.slipFileId
//           ? PaymentStatus.WAITING_VERIFICATION
//           : PaymentStatus.PENDING,
//     }))

//     const paymentStatus =
//       normalizedPayments.length > 0
//         ? normalizedPayments.every((payment) => payment.status === PaymentStatus.PENDING)
//           ? PaymentStatus.PENDING
//           : PaymentStatus.WAITING_VERIFICATION
//         : PaymentStatus.PENDING

//     const orderNumber = await createOrder({
//       userId,
//       addressId: input.addressId,
//       paymentMethod: input.paymentMethod,
//       paymentStatus,
//       subtotal: input.subtotal,
//       shippingFee: totals.shippingFee,
//       depositAmount: totals.deposit,
//       totalAmount: totals.total,
//       requiresCodDeposit: input.paymentMethod === 'COD',
//       shippingName: input.shippingInfo.name,
//       shippingPhone: input.shippingInfo.phone,
//       shippingLine1: input.shippingInfo.line1,
//       shippingLine2: input.shippingInfo.line2 ?? null,
//       shippingProvince: input.shippingInfo.province,
//       shippingDistrict: input.shippingInfo.district,
//       shippingSubdistrict: input.shippingInfo.subdistrict,
//       shippingPostalCode: input.shippingInfo.postalCode,
//       notes: input.notes ?? null,
//       items: items.map((item) => ({
//         productId: item.productId,
//         weightId: item.weightId,
//         productTitle: item.productTitle,
//         productSku: item.productId?.slice(0, 8).toUpperCase() ?? null,
//         weightValue: item.weight,
//         unitPrice: item.unitPrice,
//         basePrice: item.basePrice,
//         quantity: item.quantity,
//         subtotal: item.subtotal,
//         codAvailable: item.codAvailable,
//       })),
//       payments: normalizedPayments,
//     })

//     await clearCart(userId, cartItemIds)

//     return {
//       success: true,
//       orderNumber,
//     }
//   } catch (error) {
//     console.error(error)
//     return {
//       success: false,
//       message: 'ไม่สามารถบันทึกคำสั่งซื้อได้',
//     }
//   }
// }

"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { uploadToImageKit } from "@/lib/imagekit";
import { getCartItemsByIds, clearCart } from "@/services/cart";
import { createOrder } from "@/services/orders";
import { calculateCheckoutTotals } from "@/lib/checkout-pricing";
import { PaymentMethod, PaymentStatus } from "@/generated/prisma/enums";

/* -------------------- CONSTANTS -------------------- */
const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_SLIP_SIZE = 5 * 1024 * 1024; // 5MB

/* -------------------- HELPERS -------------------- */
const sanitize = (str?: string | null) =>
  str ? String(str).replace(/<[^>]*>?/gm, "") : null;

async function detectImageType(file: File) {
  try {
    const buf = new Uint8Array(await file.arrayBuffer());

    // PNG
    if (buf[0] === 0x89 && buf[1] === 0x50) return "image/png";
    // JPG
    if (buf[0] === 0xff && buf[1] === 0xd8) return "image/jpeg";
    // WEBP
    if (buf[0] === 0x52 && buf[1] === 0x49 && buf[8] === 0x57)
      return "image/webp";

    return null;
  } catch {
    return null;
  }
}

async function getCurrentUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.id ?? null;
}

/* -------------------- ZOD SCHEMA -------------------- */
const PaymentUploadZ = z.object({
  method: z.nativeEnum(PaymentMethod),
  amount: z.number().nonnegative(),
  slipUrl: z.string().nullable().optional(),
  slipFileId: z.string().nullable().optional(),
});

const ShippingInfoZ = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().nullable().optional(),
  province: z.string().min(1),
  district: z.string().min(1),
  subdistrict: z.string().min(1),
  postalCode: z.string().min(1),
});

const SubmitOrderZ = z.object({
  cartItemIds: z.array(z.string().min(1)).min(1),
  addressId: z.string().min(1),
  paymentMethod: z.nativeEnum(PaymentMethod),
  subtotal: z.number(),
  shippingFee: z.number(),
  depositAmount: z.number(),
  totalAmount: z.number(),
  shippingInfo: ShippingInfoZ,
  notes: z.string().nullable().optional(),
  payments: z.array(PaymentUploadZ).optional().default([]),
});

/* -------------------- UPLOAD SLIP -------------------- */
export async function uploadPaymentSlipAction(formData: FormData) {
  const userId = await getCurrentUserId();
  if (!userId) return { success: false, message: "กรุณาเข้าสู่ระบบ" };

  const file = formData.get("file") as File | null;
  const rawLabel = formData.get("label") as string | null;
  const label = (rawLabel ?? "weed_store/payment")
    .replace(/[^a-zA-Z0-9_\/\-\s]/g, "")
    .slice(0, 120);

  if (!file) return { success: false, message: "ไม่พบไฟล์" };

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
    if (!res.url || !res.fileId)
      return { success: false, message: res.message ?? "อัปโหลดรูปไม่สำเร็จ" };

    return { success: true, url: res.url, fileId: res.fileId };
  } catch (e) {
    console.error("uploadSlip error", e);
    return { success: false, message: "เกิดข้อผิดพลาด" };
  }
}

/* -------------------- SUBMIT ORDER -------------------- */
export async function submitOrderAction(rawInput: unknown) {
  const parsed = SubmitOrderZ.safeParse(rawInput);
  if (!parsed.success) return { success: false, message: "ข้อมูลไม่ถูกต้อง" };
  const input = parsed.data;

  const userId = await getCurrentUserId();
  if (!userId) return { success: false, message: "กรุณาเข้าสู่ระบบ" };

  /* Load & verify cart items */
  const items = await getCartItemsByIds(userId, input.cartItemIds);
  if (items.length === 0) return { success: false, message: "ไม่พบสินค้า" };

  /* Recalculate subtotal from DB (real value) */
  let realSubtotal = 0;
  for (const i of items) {
    const price = Number(i.unitPrice ?? 0);
    const qty = Number(i.quantity ?? 0);

    if (qty <= 0 || price < 0) {
      return { success: false, message: "ข้อมูลสินค้ามีปัญหา" };
    }
    realSubtotal += price * qty;
  }

  /* Prevent tampering */
  if (Math.abs(realSubtotal - input.subtotal) > 0.01) {
    return { success: false, message: "ยอดไม่ตรงกับระบบ กรุณารีเฟรช" };
  }

  /* Calculate totals on server */
  const totals = calculateCheckoutTotals(input.paymentMethod, realSubtotal);

  /* Validate payment slip amount */
  const sumSlip = input.payments.reduce((a, b) => a + (b.amount ?? 0), 0);
  if (Math.abs(sumSlip - totals.immediate) > 0.01) {
    return { success: false, message: "ยอดสลิปไม่ตรงกับยอดที่ต้องชำระ" };
  }

  const normalizedPayments = input.payments.map((p) => ({
    method: p.method,
    amount: p.amount,
    slipUrl: p.slipUrl ?? null,
    slipFileId: p.slipFileId ?? null,
    status: p.slipUrl
      ? PaymentStatus.WAITING_VERIFICATION
      : PaymentStatus.PENDING,
  }));

  /* Build order items safely */
  const orderItems = items.map((i) => ({
    productId: i.productId ?? null,
    weightId: i.weightId ?? null,
    productTitle: sanitize(i.productTitle) ?? "",
    productSku: i.productId?.slice(0, 8).toUpperCase() ?? null,
    weightValue: Number(i.weight ?? 0),
    unitPrice: Number(i.unitPrice),
    basePrice: Number(i.basePrice ?? 0),
    quantity: Number(i.quantity),
    subtotal: Number(i.subtotal),
    codAvailable: Boolean(i.codAvailable),
  }));

  try {
    const orderNumber = await createOrder({
      userId,
      addressId: input.addressId,
      paymentMethod: input.paymentMethod,
      paymentStatus: normalizedPayments.some((p) => p.slipUrl)
        ? PaymentStatus.WAITING_VERIFICATION
        : PaymentStatus.PENDING,
      subtotal: realSubtotal,
      shippingFee: totals.shippingFee,
      depositAmount: totals.deposit,
      totalAmount: totals.total,

      requiresCodDeposit: input.paymentMethod === "COD",

      shippingName: sanitize(input.shippingInfo.name)!,
      shippingPhone: sanitize(input.shippingInfo.phone)!,
      shippingLine1: sanitize(input.shippingInfo.line1)!,
      shippingLine2: sanitize(input.shippingInfo.line2),
      shippingProvince: sanitize(input.shippingInfo.province)!,
      shippingDistrict: sanitize(input.shippingInfo.district)!,
      shippingSubdistrict: sanitize(input.shippingInfo.subdistrict)!,
      shippingPostalCode: sanitize(input.shippingInfo.postalCode)!,
      notes: sanitize(input.notes),

      items: orderItems,
      payments: normalizedPayments,
    });

    await clearCart(userId, input.cartItemIds);

    return { success: true, orderNumber };
  } catch (err) {
    console.error("submitOrder error:", err);
    return { success: false, message: "ไม่สามารถสร้างคำสั่งซื้อได้" };
  }
}
