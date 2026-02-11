// app/api/payment/session/route.ts
import { NextRequest, NextResponse } from "next/server";

import { CartItemDTO } from "@/types/cart";
import { PaymentMethod } from "@/types/checkout";
import {
  calculateCheckoutTotals,
  CheckoutTotals,
} from "@/lib/checkout-pricing";
import { generatePromptPayQrCode } from "@/lib/promptpay";
import { validateCartItemsAndSubtotal } from "@/lib/server/validate-cart";

interface PaymentSessionRequest {
  cartItems: CartItemDTO[];
  subtotal: number;
  codEligible: boolean;
  itemsParam: string;
  selectedMethod: PaymentMethod;
  addressId: string;
}

interface PaymentSessionSuccessResponse {
  ok: true;
  totals: CheckoutTotals;
  promptPayId: string;
  qrCodeSrc: string | null;
  qrError: string | null;
}

interface PaymentSessionErrorResponse {
  ok: false;
  errorMessage: string;
}

export async function POST(
  req: NextRequest
): Promise<
  NextResponse<PaymentSessionSuccessResponse | PaymentSessionErrorResponse>
> {
  try {
    const body = (await req.json()) as PaymentSessionRequest;

    const {
      cartItems,
      subtotal,
      selectedMethod,
      addressId,
      // codEligible, itemsParam // เผื่ออนาคตจะใช้
    } = body;

    // 1) validate cart + subtotal ฝั่ง server
    const validation = validateCartItemsAndSubtotal(cartItems, subtotal);
    if (!validation.ok) {
      return NextResponse.json(
        { ok: false, errorMessage: validation.errorMessage },
        { status: 400 }
      );
    }

    const lockedSubtotal = validation.lockedSubtotal;

    // 2) คำนวณ totals จาก lockedSubtotal (ไม่เชื่อข้อมูลจาก client ตรง ๆ)
    const totals: CheckoutTotals = calculateCheckoutTotals(
      selectedMethod,
      lockedSubtotal
    );

    // 3) โหลด PromptPay ID (แนะนำใช้ PROMPTPAY_ID แบบ server-side secret)
    // const promptPayId =
    //   process.env.PROMPTPAY_ID ?? process.env.NEXT_PUBLIC_PROMPTPAY_ID ?? "";

    const promptPayId = process.env.PROMPTPAY_ID;

    if (!promptPayId) {
      return NextResponse.json(
        { ok: false, errorMessage: "ระบบไม่ได้ตั้งค่า PROMPTPAY_ID" },
        { status: 500 }
      );
    }

    let qrCodeSrc: string | null = null;
    let qrError: string | null = null;

    const requiresQr =
      selectedMethod === "PROMPTPAY" || selectedMethod === "COD";

    if (requiresQr) {
      if (!promptPayId) {
        qrError = "ไม่สามารถโหลด PromptPay ID จากระบบได้";
      } else {
        try {
          const dataUrl = await generatePromptPayQrCode({
            promptPayId,
            amount: totals.immediate,
            reference: addressId || undefined,
          });

          if (
            typeof dataUrl === "string" &&
            (dataUrl.startsWith("data:") || dataUrl.startsWith("https:"))
          ) {
            qrCodeSrc = dataUrl;
          } else {
            qrError = "ไม่สามารถสร้าง QR PromptPay ได้";
          }
        } catch (err) {
          console.error("generatePromptPayQrCode error", err);
          qrError = "ไม่สามารถสร้าง QR PromptPay ได้";
        }
      }
    }

    return NextResponse.json(
      {
        ok: true,
        totals,
        promptPayId,
        qrCodeSrc,
        qrError,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("payment/session error", err);
    return NextResponse.json(
      {
        ok: false,
        errorMessage: "เกิดข้อผิดพลาดในระบบชำระเงิน",
      },
      { status: 500 }
    );
  }
}
