import { NextRequest, NextResponse } from "next/server";
import generatePayload from "promptpay-qr";
import QRCode from "qrcode";

export async function GET(request: NextRequest) {
  const promptPayId = process.env.PROMPTPAY_ID;

  if (!promptPayId) {
    return NextResponse.json(
      { ok: false, error: "PromptPay ID not configured" },
      { status: 500 }
    );
  }

  // ดึง Query Params
  const searchParams = request.nextUrl.searchParams;
  const amountStr = searchParams.get("amount");
  const amount = amountStr ? parseFloat(amountStr) : 0;

  if (!amount || amount <= 0) {
    return NextResponse.json(
      { ok: false, error: "Invalid amount" },
      { status: 400 }
    );
  }

  try {
    // สร้าง payload พอมเพย์
    const payload = generatePayload(promptPayId, { amount });

    // gen ภาพโค้ด PNG
    const qrCodeBuffer = await QRCode.toBuffer(payload, {
      type: "png",
      width: 300,
      margin: 1,
    });

    // ส่ง รูปภาพ image 
    return new NextResponse(Buffer.from(qrCodeBuffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to generate QR code" },
      { status: 500 }
    );
  }
}
