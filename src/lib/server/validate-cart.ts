// lib/server/validate-cart.ts
import { CartItemDTO } from "@/types/cart";

export interface CartValidationResultOk {
  ok: true;
  lockedSubtotal: number;
}

export interface CartValidationResultError {
  ok: false;
  errorMessage: string;
}

export type CartValidationResult =
  | CartValidationResultOk
  | CartValidationResultError;

/**
 * ใช้บน server: ตรวจสอบ cartItems + subtotal
 * - จำนวนต้อง > 0
 * - ราคา/stock ต้องสมเหตุสมผล
 * - subtotal ของแต่ละ item ต้องตรงกับ unitPrice * quantity
 * - subtotal รวมต้องตรงกับที่ client ส่งมา (เผื่อมีการเปลี่ยนแปลง)
 */
export function validateCartItemsAndSubtotal(
  cartItems: CartItemDTO[],
  subtotal: number
): CartValidationResult {
  let lockedSubtotal = 0;

  for (const item of cartItems) {
    const quantity = Number(item.quantity ?? 0);
    const unitPrice = Number(item.unitPrice ?? 0);
    const maxQuantity = Number(item.maxQuantity ?? 0);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      return {
        ok: false,
        errorMessage: "ข้อมูลจำนวนสินค้าไม่ถูกต้อง กรุณาตรวจสอบตะกร้า",
      };
    }

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      return {
        ok: false,
        errorMessage: "ข้อมูลราคาสินค้าไม่ถูกต้อง กรุณาตรวจสอบตะกร้า",
      };
    }

    const calcSubtotal = unitPrice * quantity;
    const itemSubtotal = Number(item.subtotal ?? 0);
    if (Math.abs(itemSubtotal - calcSubtotal) > 0.01) {
      return {
        ok: false,
        errorMessage:
          "ยอดรวมของสินค้าบางรายการเปลี่ยนแปลง กรุณาตรวจสอบตะกร้า",
      };
    }

    if (!Number.isFinite(maxQuantity) || maxQuantity < 0) {
      return {
        ok: false,
        errorMessage: "ข้อมูลสต็อกสินค้าผิดพลาด กรุณาตรวจสอบตะกร้า",
      };
    }

    if (maxQuantity <= 0) {
      return {
        ok: false,
        errorMessage: `สินค้า "${item.productTitle}" สต็อกไม่พอ`,
      };
    }

    if (quantity > maxQuantity) {
      return {
        ok: false,
        errorMessage: `จำนวนสินค้า "${item.productTitle}" มากกว่าสต็อกที่มี`,
      };
    }

    lockedSubtotal += calcSubtotal;
  }

  const epsilon = 0.01;
  if (!Number.isFinite(subtotal) || Math.abs(subtotal - lockedSubtotal) > epsilon) {
    return {
      ok: false,
      errorMessage: "ยอดรวมสินค้าไม่ตรงกัน กรุณาตรวจสอบตะกร้าอีกครั้ง",
    };
  }

  return { ok: true, lockedSubtotal };
}
