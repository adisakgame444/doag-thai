// "use client";

// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useMemo, useTransition } from "react";
// import { toast } from "sonner";

// import { formatPrice } from "@/lib/format-price";
// import { calculateCheckoutTotals } from "@/lib/checkout-pricing";
// import { CartItemDTO } from "@/types/cart";
// import { AddressDTO } from "@/types/address";
// import { PaymentMethod } from "@/types/checkout";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Badge } from "@/components/ui/badge";
// import { useCheckoutStore } from "@/stores/checkout-store";
// import { uploadPaymentSlipAction, submitOrderAction } from "./actions";

// interface SummaryPageProps {
//   cartItems: CartItemDTO[];
//   address: AddressDTO;
//   subtotal: number;
//   codEligible: boolean;
//   itemsParam: string;
//   // paymentMethod: PaymentMethod;
// }

// export default function SummaryPage({
//   cartItems,
//   address,
//   subtotal,
//   codEligible,
//   itemsParam,
//   // paymentMethod,
// }: SummaryPageProps) {
//   const paymentMethod = useCheckoutStore((s) => s.paymentMethod);
//   const router = useRouter();
//   const promptpaySlip = useCheckoutStore((state) => state.promptpaySlip);
//   const codSlip = useCheckoutStore((state) => state.codSlip);
//   const resetCheckout = useCheckoutStore((state) => state.reset);
//   const [isSubmitting, startTransition] = useTransition();
//   const totals = useMemo(
//     () => calculateCheckoutTotals(paymentMethod, subtotal),
//     [paymentMethod, subtotal]
//   );
//   const totalQuantity = useMemo(
//     () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
//     [cartItems]
//   );

//   const slipMissing =
//     (paymentMethod === "PROMPTPAY" && !promptpaySlip) ||
//     (paymentMethod === "COD" && !codSlip);

//   const handleBackToPayment = () => {
//     router.push(
//       `/checkout/payment?items=${itemsParam}&address=${address.id}&method=${paymentMethod}`
//     );
//   };

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useTransition } from "react";
import { toast } from "sonner";

import { formatPrice } from "@/lib/format-price";
import { calculateCheckoutTotals } from "@/lib/checkout-pricing";
import { CartItemDTO } from "@/types/cart";
import { AddressDTO } from "@/types/address";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCheckoutStore } from "@/stores/checkout-store";
import { uploadPaymentSlipAction, submitOrderAction } from "./actions";
import { PaymentMethod } from "@/types/checkout";
import { ArrowLeft, ArrowRight, Banknote, ShieldCheck } from "lucide-react";

interface SummaryPageProps {
  cartItems: CartItemDTO[];
  address: AddressDTO;
  subtotal: number;
  codEligible: boolean;
  itemsParam: string;
}

export default function SummaryPage({
  cartItems,
  address,
  subtotal,
  codEligible,
  itemsParam,
}: SummaryPageProps) {
  const router = useRouter();

  /* ✔ ใช้ paymentMethod จาก Zustand */
  const paymentMethod = useCheckoutStore((s) => s.paymentMethod);
  const promptpaySlip = useCheckoutStore((s) => s.promptpaySlip);
  const codSlip = useCheckoutStore((s) => s.codSlip);
  const resetCheckout = useCheckoutStore((s) => s.reset);

  // const [isSubmitting, startTransition] = useTransition();
  const [isSubmitting, startTransition] = useTransition();
  // 🟢 เพิ่มอันนี้ (สำหรับปุ่มย้อนกลับ)
  const [isNavigating, startNavigateTransition] = useTransition();

  const totals = useMemo(
    () => calculateCheckoutTotals(paymentMethod!, subtotal),
    [paymentMethod, subtotal],
  );

  const totalQuantity = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const slipMissing =
    (paymentMethod === "PROMPTPAY" && !promptpaySlip) ||
    (paymentMethod === "COD" && !codSlip);

  /* ✔ ไม่ต้องส่ง method ใน URL แล้ว */
  const handleBackToPayment = () => {
    // 🟢 ครอบด้วย startNavigateTransition
    startNavigateTransition(() => {
      router.push(
        `/checkout/payment?items=${itemsParam}&address=${address.id}`,
      );
    });
  };

  /* ... ที่เหลือเหมือนเดิมทุกอย่าง ... */

  const handleConfirm = () => {
    startTransition(async () => {
      if (slipMissing) {
        toast.error("กรุณาแนบหลักฐานการชำระเงิน");
        return;
      }

      const itemIds = itemsParam
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);
      if (!itemIds.length) {
        toast.error("ไม่พบสินค้าในตะกร้า");
        return;
      }

      try {
        const paymentUploads = [];

        if (paymentMethod === "PROMPTPAY" && promptpaySlip) {
          const formData = new FormData();
          formData.append("file", promptpaySlip.file);
          formData.append("label", "weed_store/payment/promptpay");
          const upload = await uploadPaymentSlipAction(formData);
          if (!upload?.success || !upload.url) {
            toast.error(upload?.message ?? "อัปโหลดสลิป PromptPay ไม่สำเร็จ");
            return;
          }
          paymentUploads.push({
            method: "PROMPTPAY" as PaymentMethod,
            amount: totals.immediate,
            slipUrl: upload.url,
            slipFileId: upload.fileId ?? null,
          });
        }

        if (paymentMethod === "COD" && codSlip) {
          const formData = new FormData();
          formData.append("file", codSlip.file);
          formData.append("label", "weed_store/payment/cod");
          const upload = await uploadPaymentSlipAction(formData);
          if (!upload?.success || !upload.url) {
            toast.error(upload?.message ?? "อัปโหลดสลิป COD ไม่สำเร็จ");
            return;
          }
          paymentUploads.push({
            method: "COD" as PaymentMethod,
            amount: totals.immediate,
            slipUrl: upload.url,
            slipFileId: upload.fileId ?? null,
          });
        }

        const result = await submitOrderAction({
          cartItemIds: itemIds,
          addressId: address.id,
          paymentMethod,
          subtotal,
          shippingFee: totals.shippingFee,
          depositAmount: totals.deposit,
          totalAmount: totals.total,
          shippingInfo: {
            name: address.recipient,
            phone: address.phone,
            line1: address.line1,
            line2: address.line2 ?? null,
            province: address.province,
            district: address.district,
            subdistrict: address.subdistrict,
            postalCode: address.postalCode,
          },
          payments: paymentUploads,
        });

        if (!result?.success || !result.orderNumber) {
          toast.error(result?.message ?? "ไม่สามารถบันทึกคำสั่งซื้อได้");
          return;
        }

        toast.success("บันทึกคำสั่งซื้อเรียบร้อยแล้ว");
        resetCheckout();
        router.push(`/checkout/success?order=${result.orderNumber}`);
      } catch (error) {
        console.error(error);
        toast.error("เกิดข้อผิดพลาดในการบันทึกคำสั่งซื้อ");
      }
    });
  };

  return (
    <div className="container mx-auto space-y-6 py-6 md:py-8 md:px-0 px-[15px]">
      {/* <div className="space-y-2">
        <h1 className="text-xl font-semibold text-foreground md:text-3xl">
          ตรวจสอบและยืนยันคำสั่งซื้อ
        </h1>
        <p className="text-muted-foreground">
          ตรวจสอบข้อมูลสินค้า ที่อยู่ และวิธีชำระเงินก่อนยืนยัน
        </p>
      </div> */}

      <div className="space-y-1.5 md:space-y-2">
        {" "}
        {/* ลดช่องว่างระหว่างบรรทัดในมือถือลงนิดหน่อย */}
        <h1 className="text-lg font-semibold text-foreground md:text-3xl">
          ตรวจสอบและยืนยันคำสั่งซื้อ
        </h1>
        <p className="text-xs text-muted-foreground md:text-base">
          ตรวจสอบข้อมูลสินค้า ที่อยู่ และวิธีชำระเงินก่อนยืนยัน
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <section className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>สินค้าที่สั่งซื้อ</CardTitle>
              <CardDescription>
                สินค้า {cartItems.length} รายการ •{" "}
                {totalQuantity.toLocaleString()} ชิ้น
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 rounded-lg border border-border/60 bg-card px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground md:text-base">
                      {item.productTitle}
                    </p>
                    <p className="text-xs text-muted-foreground md:text-sm">
                      น้ำหนัก {item.weight.toLocaleString()} กรัม •{" "}
                      {item.quantity.toLocaleString()} ชิ้น
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-foreground md:text-base">
                    {formatPrice(item.subtotal)}
                  </span>
                </div>
              ))} */}
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 rounded-lg border border-border/60 bg-card px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground md:text-base">
                      {item.productTitle}
                    </p>
                    {/* ✅ แก้ไขตรงนี้ให้เหมือนหน้าอื่นๆ ครับ */}
                    <p className="text-xs text-muted-foreground md:text-sm">
                      ตัวเลือก {item.weight.toLocaleString()} {item.unitLabel} •{" "}
                      จำนวน {item.quantity.toLocaleString()} ชิ้น
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-foreground md:text-base">
                    {formatPrice(item.subtotal)}
                  </span>
                </div>
              ))}
              <Separator />
              <div className="flex items-center justify-between text-sm font-semibold text-foreground md:text-base">
                <span>ยอดรวมสินค้า</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ที่อยู่จัดส่ง</CardTitle>
              <CardDescription>
                จัดส่งไปยังที่อยู่ด้านล่าง
                หากต้องการแก้ไขให้ย้อนกลับไปขั้นตอนก่อนหน้า
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
              <p className="text-base font-semibold text-foreground">
                {address.recipient}
              </p>
              <p>เบอร์ {address.phone}</p>
              <p>
                {address.line1}
                {address.line2 ? `, ${address.line2}` : ""}
              </p>
              <p>
                {address.subdistrict}, {address.district}, {address.province}{" "}
                {address.postalCode}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>วิธีชำระเงิน</CardTitle>
              <CardDescription>
                ตรวจสอบหลักฐานและรายละเอียดก่อนยืนยัน
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">
                  {paymentMethod === "PROMPTPAY"
                    ? "PromptPay"
                    : "เก็บเงินปลายทาง (COD)"}
                </Badge>
                {paymentMethod === "COD" && !codEligible && (
                  <Badge variant="destructive">บางรายการไม่รองรับ COD</Badge>
                )}
              </div>

              {paymentMethod === "PROMPTPAY" && promptpaySlip && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">
                    หลักฐานการโอนผ่าน PromptPay
                  </p>
                  <div className="overflow-hidden rounded-lg border border-border/60 bg-background">
                    <Image
                      src={promptpaySlip.previewUrl}
                      alt="หลักฐาน PromptPay"
                      width={600}
                      height={400}
                      unoptimized
                      className="h-auto w-full object-contain"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === "COD" && codSlip && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">
                    หลักฐานการชำระค่าส่งล่วงหน้า
                  </p>
                  <div className="overflow-hidden rounded-lg border border-border/60 bg-background">
                    <Image
                      src={codSlip.previewUrl}
                      alt="หลักฐาน COD"
                      width={600}
                      height={400}
                      unoptimized
                      className="h-auto w-full object-contain"
                    />
                  </div>
                </div>
              )}

              {slipMissing && (
                <div className="rounded-lg border border-dashed border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  ไม่พบหลักฐานการชำระเงิน
                  กรุณาย้อนกลับไปขั้นตอนก่อนหน้าเพื่อแนบสลิป
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold md:text-xl">
                {/* ✅ ไอคอน Banknote สี Primary */}
                <Banknote className="size-5 md:size-6 text-primary" />
                สรุปยอดชำระ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>ยอดรวมสินค้า</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {paymentMethod === "PROMPTPAY" && (
                <div className="flex items-center justify-between text-blue-600">
                  <span>ค่าจัดส่ง (PromptPay)</span>
                  <span>{formatPrice(totals.shippingFee)}</span>
                </div>
              )}
              {paymentMethod === "COD" && (
                <div className="flex items-center justify-between text-blue-600">
                  <span>ชำระล่วงหน้า (ค่าส่ง)</span>
                  <span>{formatPrice(totals.deposit)}</span>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between text-base font-semibold text-foreground">
                <span>ยอดที่ชำระแล้ว</span>
                <span>{formatPrice(totals.immediate)}</span>
              </div>
              {paymentMethod === "COD" && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>ยอดชำระปลายทาง</span>
                  <span>{formatPrice(totals.remaining)}</span>
                </div>
              )}
            </CardContent>
            {/* <CardFooter className="flex flex-col gap-3">
              <Button
                size="lg"
                className="w-full"
                onClick={handleConfirm}
                disabled={slipMissing || isSubmitting}
                aria-busy={isSubmitting}
              >
                ยืนยันคำสั่งซื้อ
              </Button>
              <Button variant="outline" size="sm" onClick={handleBackToPayment}>
                ← กลับไปแก้ไขวิธีชำระเงิน
              </Button>
            </CardFooter> */}

            <CardFooter className="flex flex-col gap-4 pt-1">
              <div className="w-full space-y-2">
                {/* --- ปุ่มยืนยันคำสั่งซื้อ --- */}
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleConfirm}
                  // 🟢 ปิดถ้าปุ่มไหนกำลังทำงานอยู่
                  disabled={slipMissing || isSubmitting || isNavigating}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? (
                    "กำลังประมวลผล..."
                  ) : (
                    <>
                      ยืนยันคำสั่งซื้อ <ArrowRight className="size-5" />
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={handleBackToPayment}
                  // 🟢 ปิดถ้าปุ่มไหนกำลังทำงานอยู่
                  disabled={isSubmitting || isNavigating}
                >
                  {isNavigating ? (
                    "กำลังประมวลผล..."
                  ) : (
                    <>
                      {/* ✅ ใช้ ArrowLeft ด้านหน้า */}
                      <ArrowLeft className="size-5" /> กลับไปแก้ไขวิธีชำระเงิน
                    </>
                  )}
                </Button>
              </div>
              {/* ✅ Trust Signal */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5 text-green-600" />
                <span>ข้อมูลของคุณปลอดภัย 100%</span>
              </div>
              {/* --- ปุ่มย้อนกลับ --- */}
            </CardFooter>
          </Card>
        </aside>
      </div>
    </div>
  );
}

// "use client";

// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useMemo, useTransition } from "react";
// import { toast } from "sonner";

// import { formatPrice } from "@/lib/format-price";
// import { calculateCheckoutTotals } from "@/lib/checkout-pricing";
// import { CartItemDTO } from "@/types/cart";
// import { AddressDTO } from "@/types/address";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Badge } from "@/components/ui/badge";
// import { useCheckoutStore } from "@/stores/checkout-store";
// import { uploadPaymentSlipAction, submitOrderAction } from "./actions";
// import { PaymentMethod } from "@/types/checkout";

// interface SummaryPageProps {
//   cartItems: CartItemDTO[];
//   address: AddressDTO;
//   subtotal: number;
//   codEligible: boolean;
//   itemsParam: string;
// }

// export default function SummaryPage({
//   cartItems,
//   address,
//   subtotal,
//   codEligible,
//   itemsParam,
// }: SummaryPageProps) {
//   const router = useRouter();

//   // 📌 ดึงค่าจาก checkout store
//   const paymentMethod = useCheckoutStore((s) => s.paymentMethod);
//   const promptpaySlip = useCheckoutStore((s) => s.promptpaySlip);
//   const codSlip = useCheckoutStore((s) => s.codSlip);
//   const resetCheckout = useCheckoutStore((s) => s.reset);

//   const [isSubmitting, startTransition] = useTransition();

//   const totals = useMemo(
//     () => calculateCheckoutTotals(paymentMethod!, subtotal),
//     [paymentMethod, subtotal]
//   );

//   const totalQuantity = useMemo(
//     () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
//     [cartItems]
//   );

//   const slipMissing =
//     (paymentMethod === "PROMPTPAY" && !promptpaySlip) ||
//     (paymentMethod === "COD" && !codSlip);

//   const handleBackToPayment = () => {
//     router.push(`/checkout/payment?items=${itemsParam}&address=${address.id}`);
//   };

//   const handleConfirm = () => {
//     startTransition(async () => {
//       if (slipMissing) {
//         toast.error("กรุณาแนบหลักฐานการชำระเงิน");
//         return;
//       }

//       const itemIds = itemsParam
//         .split(",")
//         .map((id) => id.trim())
//         .filter(Boolean);
//       if (!itemIds.length) {
//         toast.error("ไม่พบสินค้าในตะกร้า");
//         return;
//       }

//       try {
//         const paymentUploads: {
//           method: PaymentMethod;
//           amount: number;
//           slipUrl: string;
//           slipFileId: string | null;
//         }[] = [];

//         if (paymentMethod === "PROMPTPAY" && promptpaySlip) {
//           const formData = new FormData();
//           formData.append("file", promptpaySlip.file);
//           formData.append("label", "weed_store/payment/promptpay");
//           const upload = await uploadPaymentSlipAction(formData);
//           if (!upload?.success || !upload.url) {
//             toast.error(upload?.message ?? "อัปโหลดสลิป PromptPay ไม่สำเร็จ");
//             return;
//           }
//           paymentUploads.push({
//             method: "PROMPTPAY",
//             amount: totals.immediate,
//             slipUrl: upload.url,
//             slipFileId: upload.fileId ?? null,
//           });
//         }

//         if (paymentMethod === "COD" && codSlip) {
//           const formData = new FormData();
//           formData.append("file", codSlip.file);
//           formData.append("label", "weed_store/payment/cod");
//           const upload = await uploadPaymentSlipAction(formData);
//           if (!upload?.success || !upload.url) {
//             toast.error(upload?.message ?? "อัปโหลดสลิป COD ไม่สำเร็จ");
//             return;
//           }
//           paymentUploads.push({
//             method: "COD",
//             amount: totals.immediate,
//             slipUrl: upload.url,
//             slipFileId: upload.fileId ?? null,
//           });
//         }

//         const result = await submitOrderAction({
//           cartItemIds: itemIds,
//           addressId: address.id,
//           paymentMethod,
//           subtotal,
//           shippingFee: totals.shippingFee,
//           depositAmount: totals.deposit,
//           totalAmount: totals.total,
//           shippingInfo: {
//             name: address.recipient,
//             phone: address.phone,
//             line1: address.line1,
//             line2: address.line2 ?? null,
//             province: address.province,
//             district: address.district,
//             subdistrict: address.subdistrict,
//             postalCode: address.postalCode,
//           },
//           payments: paymentUploads,
//         });

//         if (!result?.success || !result.orderNumber) {
//           toast.error(result?.message ?? "ไม่สามารถบันทึกคำสั่งซื้อได้");
//           return;
//         }

//         toast.success("บันทึกคำสั่งซื้อเรียบร้อยแล้ว");
//         resetCheckout();
//         router.push(`/checkout/success?order=${result.orderNumber}`);
//       } catch (error) {
//         console.error(error);
//         toast.error("เกิดข้อผิดพลาดในการบันทึกคำสั่งซื้อ");
//       }
//     });
//   };

//   return (
//     <div className="container mx-auto space-y-6 py-6 md:py-8 md:px-0 px-[15px]">
//       <div className="space-y-2">
//         <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
//           ตรวจสอบและยืนยันคำสั่งซื้อ
//         </h1>
//         <p className="text-muted-foreground">
//           ตรวจสอบข้อมูลสินค้า ที่อยู่ และวิธีชำระเงินก่อนยืนยัน
//         </p>
//       </div>

//       <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
//         {/* LEFT: รายละเอียดสินค้า / ที่อยู่ / วิธีชำระเงิน */}
//         <section className="space-y-6">
//           {/* สินค้า */}
//           <Card>
//             <CardHeader>
//               <CardTitle>สินค้าที่สั่งซื้อ</CardTitle>
//               <CardDescription>
//                 สินค้า {cartItems.length} รายการ •{" "}
//                 {totalQuantity.toLocaleString()} ชิ้น
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               {cartItems.map((item) => (
//                 <div
//                   key={item.id}
//                   className="flex items-start justify-between gap-4 rounded-lg border border-border/60 bg-card px-4 py-3"
//                 >
//                   <div>
//                     <p className="text-sm font-medium text-foreground md:text-base">
//                       {item.productTitle}
//                     </p>
//                     <p className="text-xs text-muted-foreground md:text-sm">
//                       น้ำหนัก {item.weight.toLocaleString()} กรัม •{" "}
//                       {item.quantity.toLocaleString()} ชิ้น
//                     </p>
//                   </div>
//                   <span className="text-sm font-semibold text-foreground md:text-base">
//                     {formatPrice(item.subtotal)}
//                   </span>
//                 </div>
//               ))}
//               <Separator />
//               <div className="flex items-center justify-between text-sm font-semibold text-foreground md:text-base">
//                 <span>ยอดรวมสินค้า</span>
//                 <span>{formatPrice(subtotal)}</span>
//               </div>
//             </CardContent>
//           </Card>

//           {/* ที่อยู่จัดส่ง */}
//           <Card>
//             <CardHeader>
//               <CardTitle>ที่อยู่จัดส่ง</CardTitle>
//               <CardDescription>
//                 จัดส่งไปยังที่อยู่ด้านล่าง
//                 หากต้องการแก้ไขให้ย้อนกลับไปขั้นตอนก่อนหน้า
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-1 text-sm text-muted-foreground">
//               <p className="text-base font-semibold text-foreground">
//                 {address.recipient}
//               </p>
//               <p>เบอร์ {address.phone}</p>
//               <p>
//                 {address.line1}
//                 {address.line2 ? `, ${address.line2}` : ""}
//               </p>
//               <p>
//                 {address.subdistrict}, {address.district}, {address.province}{" "}
//                 {address.postalCode}
//               </p>
//             </CardContent>
//           </Card>

//           {/* วิธีชำระเงิน + รูปสลิป */}
//           <Card>
//             <CardHeader>
//               <CardTitle>วิธีชำระเงิน</CardTitle>
//               <CardDescription>
//                 ตรวจสอบหลักฐานและรายละเอียดก่อนยืนยัน
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex flex-wrap items-center gap-2">
//                 <Badge variant="outline">
//                   {paymentMethod === "PROMPTPAY"
//                     ? "PromptPay"
//                     : "เงินปลายทาง (COD)"}
//                 </Badge>
//                 {paymentMethod === "COD" && !codEligible && (
//                   <Badge variant="destructive">บางรายการไม่รองรับ COD</Badge>
//                 )}
//               </div>

//               {/* 🔹 PromptPay slip (แก้ให้แสดงเสถียรขึ้น) */}
//               {paymentMethod === "PROMPTPAY" &&
//                 promptpaySlip &&
//                 promptpaySlip.previewUrl && (
//                   <div className="space-y-2">
//                     <p className="text-sm font-semibold text-foreground">
//                       หลักฐานการโอนผ่าน PromptPay
//                     </p>
//                     <div className="overflow-hidden rounded-lg border border-border/60 bg-background">
//                       {/* <Image
//                         key={promptpaySlip.previewUrl} // ✅ บังคับ re-render เมื่อ URL เปลี่ยน
//                         src={promptpaySlip.previewUrl}
//                         alt="หลักฐาน PromptPay"
//                         width={600}
//                         height={400}
//                         unoptimized
//                         className="h-auto w-full object-contain"
//                       /> */}
//                       <Image
//                         key={promptpaySlip.previewUrl + "_force"}
//                         src={
//                           promptpaySlip.previewUrl + "?refresh=" + Date.now()
//                         }
//                         alt="หลักฐาน PromptPay"
//                         width={600}
//                         height={400}
//                         unoptimized
//                         className="h-auto w-full object-contain"
//                       />
//                     </div>
//                   </div>
//                 )}

//               {/* 🔹 COD slip (แก้ให้แสดงเสถียรขึ้น) */}
//               {paymentMethod === "COD" && codSlip && codSlip.previewUrl && (
//                 <div className="space-y-2">
//                   <p className="text-sm font-semibold text-foreground">
//                     หลักฐานการชำระค่าส่งล่วงหน้า
//                   </p>
//                   <div className="overflow-hidden rounded-lg border border-border/60 bg-background">
//                     {/* <Image
//                       key={codSlip.previewUrl} // ✅ บังคับ re-render เมื่อ URL เปลี่ยน
//                       src={codSlip.previewUrl}
//                       alt="หลักฐาน COD"
//                       width={600}
//                       height={400}
//                       unoptimized
//                       className="h-auto w-full object-contain"
//                     /> */}
//                     <Image
//                       key={codSlip.previewUrl + "_force"}
//                       src={codSlip.previewUrl + "?refresh=" + Date.now()}
//                       alt="หลักฐาน COD"
//                       width={600}
//                       height={400}
//                       unoptimized
//                       className="h-auto w-full object-contain"
//                     />
//                   </div>
//                 </div>
//               )}

//               {slipMissing && (
//                 <div className="rounded-lg border border-dashed border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
//                   ไม่พบหลักฐานการชำระเงิน
//                   กรุณาย้อนกลับไปขั้นตอนก่อนหน้าเพื่อแนบสลิป
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </section>

//         {/* RIGHT: สรุปยอด */}
//         <aside className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>สรุปยอดชำระ</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3 text-sm">
//               <div className="flex items-center justify-between">
//                 <span>ยอดรวมสินค้า</span>
//                 <span>{formatPrice(subtotal)}</span>
//               </div>

//               {paymentMethod === "PROMPTPAY" && (
//                 <div className="flex items-center justify-between text-blue-600">
//                   <span>ค่าจัดส่ง (PromptPay)</span>
//                   <span>{formatPrice(totals.shippingFee)}</span>
//                 </div>
//               )}

//               {paymentMethod === "COD" && (
//                 <div className="flex items-center justify-between text-blue-600">
//                   <span>ชำระล่วงหน้า (ค่าส่ง)</span>
//                   <span>{formatPrice(totals.deposit)}</span>
//                 </div>
//               )}

//               <Separator />

//               <div className="flex items-center justify-between text-base font-semibold text-foreground">
//                 <span>ยอดที่ชำระแล้ว</span>
//                 <span>{formatPrice(totals.immediate)}</span>
//               </div>

//               {paymentMethod === "COD" && (
//                 <div className="flex items-center justify-between text-sm text-muted-foreground">
//                   <span>ยอดชำระปลายทาง</span>
//                   <span>{formatPrice(totals.remaining)}</span>
//                 </div>
//               )}
//             </CardContent>
//             <CardFooter className="flex flex-col gap-3">
//               <Button
//                 size="lg"
//                 className="w-full"
//                 onClick={handleConfirm}
//                 disabled={slipMissing || isSubmitting}
//                 aria-busy={isSubmitting}
//               >
//                 ยืนยันคำสั่งซื้อ
//               </Button>
//               <Button variant="outline" size="sm" onClick={handleBackToPayment}>
//                 ← กลับไปแก้ไขวิธีชำระเงิน
//               </Button>
//             </CardFooter>
//           </Card>
//         </aside>
//       </div>
//     </div>
//   );
// }
