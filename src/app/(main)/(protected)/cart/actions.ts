"use server";
import db from "@/lib/db";
import { auth } from "@/lib/auth";
import {
  addCartItem,
  clearCart,
  getCartItemsByIds,
  getCartItemsByUser,
  removeCartItem,
  setCartItemQuantities,
  updateCartItemQuantity,
} from "@/services/cart";
import { CartItemDTO } from "@/types/cart";
import { headers } from "next/headers";
// ✅ เพิ่ม 2 บรรทัดนี้ (ต้องใช้สำหรับระบบ QR และ Upload)
import { generatePromptPayQrCode } from "@/lib/promptpay";
import { uploadBase64ToImageKit } from "@/lib/imagekit";
import { revalidatePath, revalidateTag } from "next/cache";

interface CartActionResponse {
  success: boolean;
  cart?: CartItemDTO[];
  message?: string;
}

interface CheckoutPreparationResponse {
  success: boolean;
  items?: CartItemDTO[];
  subtotal?: number;
  codEligible?: boolean;
  message?: string;
}

async function getCurrentUserId(): Promise<string | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user?.id ?? null;
}

async function withAuthenticatedUser(
  handler: (userId: string) => Promise<CartItemDTO[]>,
): Promise<CartActionResponse> {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        message: "กรุณาเข้าสู่ระบบก่อนดำเนินการ",
      };
    }

    const cart = await handler(userId);

    return {
      success: true,
      cart,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }

    return {
      success: false,
      message: "ไม่สามารถดำเนินการตะกร้าได้",
    };
  }
}

export async function getCartAction(): Promise<CartActionResponse> {
  return withAuthenticatedUser((userId) => getCartItemsByUser(userId));
}

export async function addCartItemAction(input: {
  productId: string;
  weightId: string;
  quantity: number;
}): Promise<CartActionResponse> {
  const { productId, weightId, quantity } = input;
  return withAuthenticatedUser((userId) =>
    addCartItem({ userId, productId, weightId, quantity }),
  );
}

export async function updateCartQuantityAction(input: {
  cartItemId: string;
  quantity: number;
}): Promise<CartActionResponse> {
  const { cartItemId, quantity } = input;
  return withAuthenticatedUser((userId) =>
    updateCartItemQuantity({ userId, cartItemId, quantity }),
  );
}

export async function removeCartItemAction(input: {
  cartItemId: string;
}): Promise<CartActionResponse> {
  const { cartItemId } = input;
  return withAuthenticatedUser((userId) =>
    removeCartItem({ userId, cartItemId }),
  );
}

export async function clearCartAction(): Promise<CartActionResponse> {
  return withAuthenticatedUser((userId) => clearCart(userId));
}

export async function syncCartUpdatesAction(
  updates: { cartItemId: string; quantity: number }[],
): Promise<CartActionResponse> {
  const sanitizedUpdates = Array.isArray(updates)
    ? updates
        .filter((update) => update && typeof update.cartItemId === "string")
        .map((update) => ({
          cartItemId: update.cartItemId,
          quantity: Number.isFinite(update.quantity)
            ? Math.floor(update.quantity)
            : 0,
        }))
    : [];

  const dedupedUpdates = Array.from(
    sanitizedUpdates.reduce((map, update) => {
      map.set(update.cartItemId, update.quantity);
      return map;
    }, new Map<string, number>()),
  ).map(([cartItemId, quantity]) => ({ cartItemId, quantity }));

  return withAuthenticatedUser((userId) =>
    setCartItemQuantities({ userId, updates: dedupedUpdates }),
  );
}

// 👇👇 ฟังก์ชันเปลี่ยนสินค้า + คำนวณเงินใหม่ 👇👇
function validateRefundDetails(details?: {
  bank: string;
  name: string;
  number: string;
}) {
  if (!details) return false;
  const { bank, name, number } = details;

  // 1. เช็คว่ามีค่าครบไหม
  if (!bank || !name || !number) return false;

  // 2. เช็คชื่อบัญชี (กันคนใส่อักขระแปลกๆ หรือว่างเปล่า)
  if (name.trim().length < 3) return false;

  // 3. เช็คเลขบัญชี (ต้องเป็นตัวเลขล้วน 10-15 หลักเท่านั้น ห้ามมีขีด ห้ามมีตัวอักษร)
  const numberRegex = /^[0-9]{10,15}$/;
  if (!numberRegex.test(number)) return false;

  return true;
}
// export async function replaceOrderItemAction(input: {
//   orderItemId: string;
//   newProductId: string;
//   newWeightId: string;
//   quantity: number;
//   slipImage?: string; // รับ Base64
//   // ✅ [เพิ่มใหม่] รับข้อมูลบัญชีคืนเงิน
//   refundDetails?: {
//     bank: string;
//     name: string;
//     number: string;
//   };
// }) {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });
//   const userId = session?.user?.id;

//   if (!userId) {
//     return { success: false, message: "กรุณาเข้าสู่ระบบก่อนดำเนินการ" };
//   }

//   try {
//     const oldItem = await db.orderItem.findUnique({
//       where: { id: input.orderItemId },
//       include: { order: true },
//     });

//     if (!oldItem || oldItem.order.userId !== userId) {
//       return {
//         success: false,
//         message: "ไม่พบรายการสินค้า หรือคุณไม่มีสิทธิ์แก้ไข",
//       };
//     }

//     if (oldItem.status !== "OUT_OF_STOCK") {
//       return { success: false, message: "รายการนี้ไม่ได้อยู่ในสถานะสินค้าหมด" };
//     }

//     const newProduct = await db.product.findUnique({
//       where: { id: input.newProductId },
//       include: { ProductWeight: true },
//     });

//     const newWeight = newProduct?.ProductWeight.find(
//       (w) => w.id === input.newWeightId,
//     );

//     if (!newProduct || !newWeight) {
//       return { success: false, message: "สินค้าใหม่ที่เลือกไม่ถูกต้อง" };
//     }

//     // 🛑🛑 [สำคัญ] เช็คเงื่อนไข COD ที่นี่ 🛑🛑
//     // ถ้าออเดอร์เดิมเป็น COD และ สินค้าใหม่ไม่รองรับ COD -> ห้ามเปลี่ยน!
//     if (oldItem.order.paymentMethod === "COD" && !newProduct.cod) {
//       return {
//         success: false,
//         message:
//           "ออเดอร์นี้ชำระเงินปลายทาง สินค้าที่เลือกใหม่ต้องรองรับปลายทางด้วยครับ",
//       };
//     }

//     // 1. คำนวณราคาเปรียบเทียบ
//     // const diffAmount = newWeight.price * input.quantity - oldItem.subtotal;
//     // ---------------------------------------------------------
//     // 🧮 ส่วนที่แก้ไข: คำนวณส่วนต่างที่ต้องเพิ่มจากยอดเดิม
//     // ---------------------------------------------------------
//     // const newSubtotal = newWeight.price * input.quantity; // ยอดรวมสินค้าใหม่
//     // const paidAmount = oldItem.subtotal; // ยอดเดิมที่ลูกค้าจ่ายมาแล้ว
//     // const diffAmount = newSubtotal - paidAmount; // ส่วนต่างที่ต้องชำระเพิ่ม

//     const newSubtotal = Number(newWeight.price) * input.quantity;
//     const paidAmount = Number(oldItem.subtotal); // 🔥 บังคับแปลงค่าเดิมให้เป็นตัวเลข 100 ให้ได้

//     // คำนวณและปัดเศษทศนิยมให้สะอาด
//     const diffAmount = Math.round((newSubtotal - paidAmount) * 100) / 100;

//     if (diffAmount < 0) {
//       const refundAmount = Math.abs(diffAmount); // แปลงเป็นจำนวนเต็มบวก

//       // 1.1 ถ้าหน้าบ้านยังไม่ส่งเลขบัญชีมา -> สั่งให้เปิด Modal รับข้อมูล
//       if (!input.refundDetails) {
//         return {
//           success: false,
//           requireRefund: true, // 🔥 Flag บอกหน้าบ้านว่า "ต้องคืนเงินนะ"
//           refundAmount: refundAmount,
//           message: `มียอดเงินคืน ${refundAmount.toLocaleString()} บาท กรุณาระบุบัญชีรับเงิน`,
//         };
//       }

//       // 1.2 ถ้าส่งมาแล้ว -> ตรวจสอบความถูกต้อง (Validation Firewall) 🛡️
//       if (!validateRefundDetails(input.refundDetails)) {
//         return {
//           success: false,
//           message:
//             "ข้อมูลบัญชีไม่ถูกต้อง กรุณากรอกเฉพาะตัวเลข 10-15 หลัก และชื่อบัญชีที่ถูกต้อง",
//         };
//       }

//       // 1.3 ผ่านการตรวจสอบ -> บันทึกข้อมูล
//       await db.$transaction(async (tx) => {
//         // สร้างรายการ "รอคืนเงิน" ในตาราง OrderPayment
//         await tx.orderPayment.create({
//           data: {
//             orderId: oldItem.orderId,
//             amount: refundAmount, // ยอดที่ต้องคืน
//             method: "PROMPTPAY", // หรือ method อื่นตามที่เลือก
//             status: "PENDING_REFUND", // ✅ สถานะใหม่ รอแอดมินโอน
//             refundBank: input.refundDetails!.bank,
//             refundAccountName: input.refundDetails!.name,
//             refundAccountNo: input.refundDetails!.number,
//           },
//         });

//         // เปลี่ยนสินค้า
//         await tx.orderItem.update({
//           where: { id: input.orderItemId },
//           data: {
//             productId: newProduct.id,
//             productTitle: newProduct.title,
//             weightId: newWeight.id,
//             weightValue: newWeight.weight,
//             unitPrice: newWeight.price,
//             quantity: input.quantity,
//             subtotal: newSubtotal,
//             status: "NORMAL",
//           },
//         });

//         await recalculateOrderTotals(tx, oldItem.orderId);
//       });

//       revalidateTag("orders", "max");
//       revalidatePath("/", "layout");

//       return {
//         success: true,
//         message:
//           "บันทึกข้อมูลเรียบร้อย เจ้าหน้าที่จะดำเนินการโอนเงินคืนให้เร็วที่สุดครับ",
//       };
//     }

//     // 2. เช็ค: ถ้าต้องจ่ายเพิ่ม (PromptPay) และ "ยังไม่แนบสลิป" -> ส่ง QR Code กลับไป
//     if (
//       oldItem.order.paymentMethod === "PROMPTPAY" &&
//       diffAmount > 0 &&
//       !input.slipImage
//     ) {
//       const promptPayId = process.env.PROMPTPAY_ID;
//       if (!promptPayId)
//         return { success: false, message: "Server Error: No PromptPay ID" };

//       const qrCodeUrl = await generatePromptPayQrCode({
//         promptPayId,
//         amount: diffAmount, // สร้าง QR จากยอดส่วนต่าง
//         reference: `RE-${oldItem.order.orderNumber}`,
//       });

//       return {
//         success: false,
//         requirePayment: true, // สั่งหน้าบ้านเปิด Modal
//         extraAmount: diffAmount,
//         qrCode: qrCodeUrl,
//         message: `มียอดส่วนต่าง ${diffAmount} บาท กรุณาชำระเงินเพิ่มเติม`,
//       };
//     }

//     // 3. เช็ค: ถ้ามีสลิปแนบมา -> อัปโหลด ImageKit (ใช้อันใหม่ uploadBase64ToImageKit)
//     let uploadedSlipUrl: string | null = null;
//     let uploadedSlipFileId: string | null = null;

//     if (
//       input.slipImage &&
//       diffAmount > 0 &&
//       oldItem.order.paymentMethod === "PROMPTPAY"
//     ) {
//       const uploadRes = await uploadBase64ToImageKit(
//         input.slipImage,
//         `replacement_slip`,
//       );

//       if (!uploadRes?.url) throw new Error("อัปโหลดสลิปไม่สำเร็จ");

//       uploadedSlipUrl = uploadRes.url;
//       uploadedSlipFileId = uploadRes.fileId;
//     }

//     // 🔥 Transaction: เปลี่ยนของ + คำนวณเงินใหม่ พร้อมกัน
//     await db.$transaction(async (tx) => {
//       // ✅ [เพิ่ม] บันทึก Payment ลง DB (ถ้ามีสลิป)
//       // สถานะ WAITING_VERIFICATION เพื่อรอแอดมินอนุมัติ
//       if (uploadedSlipUrl && diffAmount > 0) {
//         await tx.orderPayment.create({
//           data: {
//             orderId: oldItem.orderId,
//             amount: diffAmount,
//             method: "PROMPTPAY",
//             status: "WAITING_VERIFICATION",
//             slipUrl: uploadedSlipUrl,
//             slipFileId: uploadedSlipFileId,
//             paidAt: new Date(),
//           },
//         });
//       }
//       // 1. Update รายการสินค้า
//       await tx.orderItem.update({
//         where: { id: input.orderItemId },
//         data: {
//           productId: newProduct.id,
//           productTitle: newProduct.title,
//           weightId: newWeight.id,
//           weightValue: newWeight.weight,
//           unitPrice: newWeight.price,
//           quantity: input.quantity,
//           subtotal: newWeight.price * input.quantity,
//           status: "NORMAL", // ✅ กลับเป็นปกติ เพื่อให้ระบบตัดสต็อกทำงานต่อได้
//         },
//       });

//       // 2. คำนวณยอดบิลใหม่ทันที (Recalculate)
//       await recalculateOrderTotals(tx, oldItem.orderId);
//     });

//     revalidateTag("orders", "max"); // ล้างแคช Tag ที่แอดมินใช้ดึงข้อมูล
//     revalidatePath("/", "layout");

//     return {
//       success: true,
//       message: "เปลี่ยนสินค้าเรียบร้อยแล้ว รอการตรวจสอบ",
//     };
//   } catch (error) {
//     console.error("Replace Error:", error);
//     return { success: false, message: "เกิดข้อผิดพลาดในการเปลี่ยนสินค้า" };
//   }
// }

// 👇 Helper Function: คำนวณเงินใหม่

export async function replaceOrderItemAction(input: {
  orderItemId: string;
  newProductId: string;
  newWeightId: string;
  quantity: number;
  slipImage?: string; // รับ Base64
  // ✅ [เพิ่มใหม่] รับข้อมูลบัญชีคืนเงิน
  refundDetails?: {
    bank: string;
    name: string;
    number: string;
  };
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, message: "กรุณาเข้าสู่ระบบก่อนดำเนินการ" };
  }

  try {
    const oldItem = await db.orderItem.findUnique({
      where: { id: input.orderItemId },
      include: { order: true },
    });

    if (!oldItem || oldItem.order.userId !== userId) {
      return {
        success: false,
        message: "ไม่พบรายการสินค้า หรือคุณไม่มีสิทธิ์แก้ไข",
      };
    }

    if (oldItem.status !== "OUT_OF_STOCK") {
      return { success: false, message: "รายการนี้ไม่ได้อยู่ในสถานะสินค้าหมด" };
    }

    const newProduct = await db.product.findUnique({
      where: { id: input.newProductId },
      include: { ProductWeight: true },
    });

    const newWeight = newProduct?.ProductWeight.find(
      (w) => w.id === input.newWeightId,
    );

    if (!newProduct || !newWeight) {
      return { success: false, message: "สินค้าใหม่ที่เลือกไม่ถูกต้อง" };
    }

    // 🛑🛑 [สำคัญ] เช็คเงื่อนไข COD 🛑🛑
    if (oldItem.order.paymentMethod === "COD" && !newProduct.cod) {
      return {
        success: false,
        message: "ออเดอร์นี้ชำระเงินปลายทาง สินค้าที่เลือกใหม่ต้องรองรับปลายทางด้วยครับ",
      };
    }

    const newSubtotal = Number(newWeight.price) * input.quantity;
    const paidAmount = Number(oldItem.subtotal);
    const diffAmount = Math.round((newSubtotal - paidAmount) * 100) / 100;

    const isCOD = oldItem.order.paymentMethod === "COD";
    const isPromptPay = oldItem.order.paymentMethod === "PROMPTPAY";

    // =========================================================
    // 🚩 [ ส่วนที่ 1: System Check ] สำหรับออเดอร์โอนเงิน (PromptPay)
    // =========================================================
    if (isPromptPay) {
      // 🟢 กรณี 1: ราคาถูกลง (ต้องคืนเงิน)
      if (diffAmount < 0) {
        const refundAmount = Math.abs(diffAmount);
        // ถ้ายังไม่ส่งเลขบัญชีมา -> สั่งเปิด Modal
        if (!input.refundDetails) {
          return {
            success: false,
            requireRefund: true,
            refundAmount: refundAmount,
            message: `มียอดเงินคืน ${refundAmount.toLocaleString()} บาท กรุณาระบุบัญชีรับเงิน`,
          };
        }
        // ถ้าส่งมาแล้ว -> ตรวจสอบความถูกต้อง
        if (!validateRefundDetails(input.refundDetails)) {
          return {
            success: false,
            message: "ข้อมูลบัญชีไม่ถูกต้อง กรุณากรอกเฉพาะตัวเลข 10-15 หลัก",
          };
        }
      }

      // 🟡 กรณี 2: ราคาแพงขึ้น (ต้องจ่ายเพิ่ม)
      if (diffAmount > 0 && !input.slipImage) {
        const promptPayId = process.env.PROMPTPAY_ID;
        if (!promptPayId) return { success: false, message: "Server Error: No PromptPay ID" };

        const qrCodeUrl = await generatePromptPayQrCode({
          promptPayId,
          amount: diffAmount,
          reference: `RE-${oldItem.order.orderNumber}`,
        });

        return {
          success: false,
          requirePayment: true,
          extraAmount: diffAmount,
          qrCode: qrCodeUrl,
          message: `มียอดส่วนต่าง ${diffAmount} บาท กรุณาชำระเงินเพิ่มเติม`,
        };
      }
    }

    // =========================================================
    // 🚩 [ ส่วนที่ 2: บันทึกฐานข้อมูล ] 
    // ไหลลงมาตรงนี้ได้คือ: เป็น COD หรือ เป็น PromptPay ที่ข้อมูลครบแล้ว
    // =========================================================
    
    let uploadedSlipUrl: string | null = null;
    let uploadedSlipFileId: string | null = null;

    // อัปโหลดสลิป (ถ้ามี และเป็น PromptPay)
    if (input.slipImage && diffAmount > 0 && isPromptPay) {
      const uploadRes = await uploadBase64ToImageKit(input.slipImage, `replacement_slip`);
      if (!uploadRes?.url) throw new Error("อัปโหลดสลิปไม่สำเร็จ");
      uploadedSlipUrl = uploadRes.url;
      uploadedSlipFileId = uploadRes.fileId;
    }

    await db.$transaction(async (tx) => {
      // 1. บันทึกข้อมูลการเงินเข้า OrderPayment (เฉพาะ PromptPay)
      if (isPromptPay) {
        // กรณีจ่ายเพิ่ม
        if (uploadedSlipUrl && diffAmount > 0) {
          await tx.orderPayment.create({
            data: {
              orderId: oldItem.orderId,
              amount: diffAmount,
              method: "PROMPTPAY",
              status: "WAITING_VERIFICATION",
              slipUrl: uploadedSlipUrl,
              slipFileId: uploadedSlipFileId,
              paidAt: new Date(),
            },
          });
        }
        // กรณีรับเงินคืน
        if (input.refundDetails && diffAmount < 0) {
          await tx.orderPayment.create({
            data: {
              orderId: oldItem.orderId,
              amount: Math.abs(diffAmount),
              method: "PROMPTPAY",
              status: "PENDING_REFUND",
              refundBank: input.refundDetails.bank,
              refundAccountName: input.refundDetails.name,
              refundAccountNo: input.refundDetails.number,
            },
          });
        }
      }

      // 2. อัปเดตรายการสินค้า (ทำทุกเคสทั้ง COD และ PromptPay)
      await tx.orderItem.update({
        where: { id: input.orderItemId },
        data: {
          productId: newProduct.id,
          productTitle: newProduct.title,
          weightId: newWeight.id,
          weightValue: newWeight.weight,
          unitPrice: newWeight.price,
          quantity: input.quantity,
          subtotal: newSubtotal,
          status: "NORMAL",
        },
      });

      // 3. อัปเดต updatedAt ของ Order หลัก เพื่อให้แจ้งเตือน Banner สีแดงหายไป
      await tx.order.update({
        where: { id: oldItem.orderId },
        data: { updatedAt: new Date() }
      });

      // 4. คำนวณยอดรวมใหม่ (ยอด COD จะถูกปรับปรุงที่นี่)
      await recalculateOrderTotals(tx, oldItem.orderId);
    });

    // 🚩 ล้าง Cache เพื่อให้หน้า Order อัปเดตข้อมูลทันที
    revalidateTag("orders", "max");
    revalidatePath("/", "layout");
    revalidatePath("/orders");

    return {
      success: true,
      message: isCOD 
        ? "เปลี่ยนสินค้าเรียบร้อยแล้ว ยอดเรียกเก็บปลายทางจะถูกปรับปรุงโดยอัตโนมัติ" 
        : "ดำเนินการเรียบร้อยแล้ว",
    };
  } catch (error) {
    console.error("Replace Error:", error);
    return { success: false, message: "เกิดข้อผิดพลาดในการเปลี่ยนสินค้า" };
  }
}


async function recalculateOrderTotals(tx: any, orderId: string) {
  const allItems = await tx.orderItem.findMany({
    where: { orderId: orderId },
    select: { subtotal: true },
  });

  const newSubtotal = allItems.reduce(
    (sum: number, item: { subtotal: number }) => sum + item.subtotal,
    0,
  );

  const order = await tx.order.findUnique({
    where: { id: orderId },
    select: { shippingFee: true },
  });

  const shippingFee = order?.shippingFee || 0;
  const newTotalAmount = newSubtotal + shippingFee;

  await tx.order.update({
    where: { id: orderId },
    data: {
      subtotal: newSubtotal,
      totalAmount: newTotalAmount,
    },
  });
}

export async function prepareCheckoutAction(input: {
  cartItemIds: string[];
}): Promise<CheckoutPreparationResponse> {
  const ids = Array.isArray(input.cartItemIds)
    ? input.cartItemIds.filter(
        (id) => typeof id === "string" && id.trim().length > 0,
      )
    : [];

  if (ids.length === 0) {
    return {
      success: false,
      message: "กรุณาเลือกรายการสินค้าอย่างน้อยหนึ่งรายการ",
    };
  }

  const userId = await getCurrentUserId();

  if (!userId) {
    return {
      success: false,
      message: "กรุณาเข้าสู่ระบบก่อนดำเนินการ",
    };
  }

  try {
    const uniqueIds = Array.from(new Set(ids));
    const items = await getCartItemsByIds(userId, uniqueIds);

    if (!items.length) {
      return {
        success: false,
        message: "ไม่พบสินค้าในตะกร้าที่คุณเลือก",
      };
    }

    const missingCount = uniqueIds.length - items.length;
    if (missingCount > 0) {
      return {
        success: false,
        message: "บางรายการไม่พบในตะกร้า กรุณาเลือกใหม่อีกครั้ง",
      };
    }

    const invalidQuantity = items.find((item) => item.quantity <= 0);
    if (invalidQuantity) {
      return {
        success: false,
        message: "จำนวนสินค้าบางรายการไม่ถูกต้อง กรุณาอัปเดตตะกร้า",
      };
    }

    const outOfStock = items.find((item) => item.maxQuantity <= 0);
    if (outOfStock) {
      return {
        success: false,
        message: "มีสินค้าบางรายการที่สต็อกไม่พอ กรุณาอัปเดตตะกร้า",
      };
    }

    const subtotal = items.reduce((total, item) => total + item.subtotal, 0);
    const codEligible = items.every((item) => item.codAvailable);

    return {
      success: true,
      items,
      subtotal,
      codEligible,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "ไม่สามารถเตรียมข้อมูลชำระเงินได้",
    };
  }
}
