// "use client";

// import { useEffect, useMemo, useState, useId } from "react";
// import Image from "next/image";
// import { useRouter, useSearchParams } from "next/navigation";
// import { toast } from "sonner";
// import { Loader2, Trash2 } from "lucide-react";

// import { formatPrice } from "@/lib/format-price";
// import { generatePromptPayQrCode } from "@/lib/promptpay";
// import {
//   COD_SHIPPING_FEE,
//   calculateCheckoutTotals,
// } from "@/lib/checkout-pricing";
// import { CartItemDTO } from "@/types/cart";
// import { AddressDTO } from "@/types/address";
// import { PaymentMethod, PaymentSlip } from "@/types/checkout";
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
// import { cn } from "@/lib/utils";
// import { useCheckoutStore } from "@/stores/checkout-store";

// interface PaymentPageProps {
//   cartItems: CartItemDTO[];
//   address: AddressDTO;
//   subtotal: number;
//   codEligible: boolean;
//   itemsParam: string;
// }

// interface SlipUploaderProps {
//   label: string;
//   description?: string;
//   slip?: PaymentSlip;
//   onChange: (file?: File) => void;
//   disabled?: boolean;
// }

// const PAYMENT_OPTIONS: {
//   key: PaymentMethod;
//   title: string;
//   description: string;
// }[] = [
//   {
//     key: "PROMPTPAY",
//     title: "ชำระผ่าน PromptPay",
//     description:
//       "สแกน QR เพื่อชำระทันที และแนบสลิปหลังโอนเพื่อตรวจสอบ",
//   },
//   {
//     key: "COD",
//     title: "ชำระเงินปลายทาง (COD)",
//     description: "จ่ายมัดจำค่าจัดส่ง 100 บาท และชำระยอดที่เหลือปลายทาง",
//   },
// ];

// function createSlip(file: File): PaymentSlip {
//   return {
//     file,
//     previewUrl: URL.createObjectURL(file),
//   };
// }

// function SlipUploader({
//   label,
//   description,
//   slip,
//   onChange,
//   disabled,
// }: SlipUploaderProps) {
//   const inputId = useId();

//   return (
//     <div className="space-y-3 rounded-lg border border-border/60 bg-card p-4 ">
//       <div className="flex items-center justify-between gap-3">
//         <div>
//           <p className="text-sm font-semibold text-foreground md:text-base">
//             {label}
//           </p>
//           {description && (
//             <p className="text-xs text-muted-foreground md:text-sm">
//               {description}
//             </p>
//           )}
//         </div>
//         {slip && (
//           <Button
//             type="button"
//             variant="ghost"
//             size="sm"
//             className="text-destructive hover:text-destructive"
//             onClick={() => onChange(undefined)}
//           >
//             <Trash2 className="mr-1 h-4 w-4" /> ลบสลิป
//           </Button>
//         )}
//       </div>

//       {slip ? (
//         <div className="overflow-hidden rounded-lg border border-border/60 bg-background">
//           <Image
//             src={slip.previewUrl}
//             alt="หลักฐานการชำระเงิน"
//             width={600}
//             height={400}
//             unoptimized
//             className="h-auto w-full object-contain"
//           />
//         </div>
//       ) : (
//         <div className="rounded-lg border border-dashed border-border/60 bg-muted/40 px-4 py-8 text-center text-xs text-muted-foreground md:text-sm">
//           ยังไม่ได้แนบหลักฐาน
//         </div>
//       )}

//       <div className="flex justify-end">
//         <input
//           id={inputId}
//           type="file"
//           accept="image/*"
//           className="hidden"
//           disabled={disabled}
//           aria-label="เลือกไฟล์รูปภาพ"
//           onChange={(event) => {
//             const file = event.target.files?.[0];
//             if (!file) {
//               onChange(undefined);
//               return;
//             }
//             onChange(file);
//           }}
//         />
//         <Button
//           type="button"
//           size="sm"
//           variant="outline"
//           disabled={disabled}
//           onClick={() => document.getElementById(inputId)?.click()}
//         >
//           เลือกไฟล์
//         </Button>
//       </div>
//     </div>
//   );
// }

// export default function PaymentPage({
//   cartItems,
//   address,
//   subtotal,
//   codEligible,
//   itemsParam,
// }: PaymentPageProps) {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const selectedAddressId = searchParams.get("address");

//   const setSelection = useCheckoutStore((state) => state.setSelection);
//   const setPaymentMethodState = useCheckoutStore(
//     (state) => state.setPaymentMethod
//   );
//   const setPromptpaySlipState = useCheckoutStore(
//     (state) => state.setPromptpaySlip
//   );
//   const setCodSlipState = useCheckoutStore((state) => state.setCodSlip);
//   const promptpaySlip = useCheckoutStore((state) => state.promptpaySlip);
//   const codSlip = useCheckoutStore((state) => state.codSlip);

//   const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
//     codEligible ? "COD" : "PROMPTPAY"
//   );
//   const [qrCodeSrc, setQrCodeSrc] = useState<string | null>(null);
//   const [qrError, setQrError] = useState<string | null>(null);
//   const [isGeneratingQr, setIsGeneratingQr] = useState(false);

//   const promptPayId = process.env.NEXT_PUBLIC_PROMPTPAY_ID ?? "";

//   useEffect(() => {
//     setSelection({ itemsParam, addressId: selectedAddressId });
//   }, [itemsParam, selectedAddressId, setSelection]);

//   useEffect(() => {
//     setPaymentMethodState(selectedMethod);
//   }, [selectedMethod, setPaymentMethodState]);

//   const totalQuantity = useMemo(
//     () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
//     [cartItems]
//   );

//   const totals = useMemo(
//     () => calculateCheckoutTotals(selectedMethod, subtotal),
//     [selectedMethod, subtotal]
//   );

//   const paymentMethodOptions = useMemo(() => {
//     return PAYMENT_OPTIONS.map((method) => {
//       const disabled = method.key === "COD" && !codEligible;
//       const isActive = selectedMethod === method.key;

//       return (
//         <button
//           key={method.key}
//           type="button"
//           disabled={disabled}
//           onClick={() => setSelectedMethod(method.key)}
//           className={cn(
//             "flex flex-col items-start gap-2 rounded-xl border border-border/60 bg-card px-4 py-3 text-left transition-all hover:border-primary/60 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60",
//             isActive && "border-primary shadow-sm ring-2 ring-primary/40"
//           )}
//         >
//           <div className="flex items-center gap-2">
//             <span className="text-base font-semibold text-foreground">
//               {method.title}
//             </span>
//             {method.key === "COD" && (
//               <Badge variant="secondary">
//                 จ่ายมัดจำ {formatPrice(COD_SHIPPING_FEE)}
//               </Badge>
//             )}
//           </div>
//           <p className="text-xs text-muted-foreground md:text-sm">
//             {method.description}
//           </p>
//           {method.key === "COD" && !codEligible && (
//             <p className="text-xs text-destructive">
//               มีสินค้าบางรายการที่ไม่รองรับ COD กรุณาเลือก PromptPay
//             </p>
//           )}
//         </button>
//       );
//     });
//   }, [codEligible, selectedMethod]);

//   useEffect(() => {
//     if (!promptPayId) {
//       setQrCodeSrc(null);
//       setQrError("ยังไม่ได้ตั้งค่า NEXT_PUBLIC_PROMPTPAY_ID สำหรับ PromptPay");
//       return;
//     }

//     const methodRequiresQr =
//       selectedMethod === "PROMPTPAY" || selectedMethod === "COD";
//     if (!methodRequiresQr) {
//       setQrCodeSrc(null);
//       setQrError(null);
//       return;
//     }

//     setIsGeneratingQr(true);
//     let active = true;

//     generatePromptPayQrCode({
//       promptPayId,
//       amount: totals.immediate,
//       reference: selectedAddressId ?? undefined,
//     })
//       .then((dataUrl) => {
//         if (!active) return;
//         setQrCodeSrc(dataUrl);
//         setQrError(null);
//       })
//       .catch(() => {
//         if (!active) return;
//         setQrCodeSrc(null);
//         setQrError("ไม่สามารถสร้าง QR PromptPay ได้");
//       })
//       .finally(() => {
//         if (active) {
//           setIsGeneratingQr(false);
//         }
//       });

//     return () => {
//       active = false;
//     };
//   }, [selectedMethod, totals.immediate, promptPayId, selectedAddressId]);

//   const handlePromptpaySlipChange = (file?: File) => {
//     if (promptpaySlip?.previewUrl) {
//       URL.revokeObjectURL(promptpaySlip.previewUrl);
//     }
//     if (!file) {
//       setPromptpaySlipState(undefined);
//       return;
//     }
//     setPromptpaySlipState(createSlip(file));
//   };

//   const handleCodSlipChange = (file?: File) => {
//     if (codSlip?.previewUrl) {
//       URL.revokeObjectURL(codSlip.previewUrl);
//     }
//     if (!file) {
//       setCodSlipState(undefined);
//       return;
//     }
//     setCodSlipState(createSlip(file));
//   };

//   const handleContinue = () => {
//     if (!selectedAddressId) {
//       toast.error("กรุณาเลือกที่อยู่ก่อนดำเนินการต่อ");
//       router.push(`/checkout?items=${itemsParam}`);
//       return;
//     }

//     if (selectedMethod === "PROMPTPAY") {
//       if (!promptPayId) {
//         toast.error("ระบบยังไม่ได้ตั้งค่าเลข PromptPay");
//         return;
//       }
//       if (!promptpaySlip) {
//         toast.error("กรุณาแนบสลิปการชำระผ่าน PromptPay");
//         return;
//       }
//     }

//     if (selectedMethod === "COD") {
//       if (!codEligible) {
//         toast.error("สินค้าบางรายการไม่รองรับการเก็บเงินปลายทาง");
//         return;
//       }
//       if (!codSlip) {
//         toast.error("กรุณาแนบหลักฐานการจ่ายมัดจำสำหรับ COD");
//         return;
//       }
//     }

//     const params = new URLSearchParams();
//     params.set("items", itemsParam);
//     params.set("address", selectedAddressId);
//     params.set("method", selectedMethod);

//     router.push(`/checkout/summary?${params.toString()}`);
//   };

//   return (
//     <div className="container mx-auto space-y-6 py-6 md:py-8 md:px-0 px-[15px]">
//       <div className="space-y-2">
//         <h1 className="text-lg font-semibold text-foreground md:text-3xl">
//           เลือกวิธีชำระเงิน
//         </h1>
//         <p className="text-xs text-muted-foreground md:text-base">
//           เลือกรูปแบบการชำระที่สะดวก พร้อมตรวจสอบยอดที่ต้องชำระทันที
//         </p>
//       </div>

//       <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
//         <section className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>ที่อยู่จัดส่ง</CardTitle>
//               <CardDescription>
//                 จัดส่งไปยังที่อยู่นี้
//                 หากต้องการแก้ไขให้ย้อนกลับไปยังขั้นตอนก่อนหน้า
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

//           <Card>
//             <CardHeader>
//               <CardTitle>สินค้าที่จะชำระเงิน</CardTitle>
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

//           <Card>
//             <CardHeader>
//               <CardTitle>วิธีชำระเงิน</CardTitle>
//               <CardDescription>เลือกวิธีชำระเงินที่คุณต้องการ</CardDescription>
//             </CardHeader>
//             <CardContent className="grid gap-4 md:grid-cols-2">
//               {paymentMethodOptions}
//             </CardContent>
//           </Card>

//           {selectedMethod === "PROMPTPAY" && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>รายละเอียดการชำระเงินผ่าน PromptPay</CardTitle>
//                 <CardDescription>
//                   สแกน QR เพื่อชำระยอดทั้งหมด และแนบหลักฐานหลังโอน
//                   เพื่อให้ทีมงานตรวจสอบ
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border/60 bg-muted/30 px-4 py-6 text-center">
//                   {isGeneratingQr && (
//                     <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
//                   )}
//                   {qrError && (
//                     <p className="text-sm text-destructive">{qrError}</p>
//                   )}
//                   {!isGeneratingQr && !qrError && qrCodeSrc && (
//                     <Image
//                       src={qrCodeSrc}
//                       alt="PromptPay QR Code"
//                       width={192}
//                       height={192}
//                       unoptimized
//                       className="h-auto w-48 rounded-md border border-border/60 bg-white p-2"
//                     />
//                   )}
//                   {!promptPayId && (
//                     <p className="text-xs text-destructive">
//                       กรุณาตั้งค่า NEXT_PUBLIC_PROMPTPAY_ID ในไฟล์ .env
//                       เพื่อแสดง QR
//                     </p>
//                   )}
//                   <p className="text-sm font-semibold text-foreground">
//                     ยอดที่ต้องชำระ: {formatPrice(totals.immediate)}
//                   </p>
//                 </div>

//                 <SlipUploader
//                   label="หลักฐานการโอนผ่าน PromptPay"
//                   description="อัปโหลดภาพสลิปเพื่อให้ทีมงานตรวจสอบการชำระเงิน"
//                   slip={promptpaySlip}
//                   onChange={handlePromptpaySlipChange}
//                   disabled={!promptPayId}
//                 />
//               </CardContent>
//             </Card>
//           )}

//           {selectedMethod === "COD" && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>รายละเอียดการชำระเงินปลายทาง</CardTitle>
//                 <CardDescription>
//                   ชำระค่าส่งล่วงหน้า 100 บาท เพื่อยืนยันคำสั่งซื้อ
//                   และชำระค่าสินค้าที่เหลือเมื่อสินค้าถึงที่หมาย
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-4 text-sm text-muted-foreground">
//                   <p>
//                     ยอดจัดส่งที่ต้องชำระตอนนี้:
//                     <span className="font-semibold text-foreground">
//                       {" "}
//                       {formatPrice(COD_SHIPPING_FEE)}
//                     </span>
//                   </p>
//                   <p>
//                     ยอดที่ต้องชำระปลายทาง:
//                     <span className="font-semibold text-foreground">
//                       {" "}
//                       {formatPrice(totals.remaining)}
//                     </span>
//                   </p>
//                 </div>

//                 {promptPayId ? (
//                   <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border/60 bg-muted/20 px-4 py-6 text-center">
//                     {isGeneratingQr && (
//                       <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
//                     )}
//                     {qrError && (
//                       <p className="text-sm text-destructive">{qrError}</p>
//                     )}
//                     {!isGeneratingQr && !qrError && qrCodeSrc && (
//                       <Image
//                         src={qrCodeSrc}
//                         alt="PromptPay QR Code"
//                         width={192}
//                         height={192}
//                         unoptimized
//                         className="h-auto w-48 rounded-md border border-border/60 bg-white p-2"
//                       />
//                     )}
//                     <p className="text-xs text-muted-foreground md:text-sm">
//                       สแกนเพื่อชำระค่าส่งล่วงหน้า หากไม่สะดวกสแกนสามารถโอนตามเลข
//                       PromptPay เดียวกันแล้วแนบสลิปได้เช่นกัน
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 px-4 py-4 text-sm text-destructive">
//                     ยังไม่ได้ตั้งค่า NEXT_PUBLIC_PROMPTPAY_ID
//                     กรุณาแจ้งผู้ดูแลระบบเพื่อตั้งค่า QR สำหรับการชำระค่าส่ง
//                   </div>
//                 )}

//                 <SlipUploader
//                   label="หลักฐานการชำระค่าส่ง"
//                   description="แนบสลิปการโอนค่าส่ง 100 บาท เพื่อให้ทีมงานตรวจสอบ"
//                   slip={codSlip}
//                   onChange={handleCodSlipChange}
//                 />
//               </CardContent>
//             </Card>
//           )}
//         </section>

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
//               {selectedMethod === "PROMPTPAY" && (
//                 <div className="flex items-center justify-between text-blue-600">
//                   <span>ค่าจัดส่ง (PromptPay)</span>
//                   <span>{formatPrice(totals.shippingFee)}</span>
//                 </div>
//               )}
//               {selectedMethod === "COD" && (
//                 <div className="flex items-center justify-between text-blue-600">
//                   <span>จ่ายมัดจำตอนนี้</span>
//                   <span>{formatPrice(totals.deposit)}</span>
//                 </div>
//               )}
//               <Separator />
//               <div className="flex items-center justify-between text-base font-semibold text-foreground">
//                 <span>ยอดชำระทันที</span>
//                 <span>{formatPrice(totals.immediate)}</span>
//               </div>
//               {selectedMethod === "COD" && (
//                 <div className="flex items-center justify-between text-sm text-muted-foreground">
//                   <span>ยอดที่ต้องชำระปลายทาง</span>
//                   <span>{formatPrice(totals.remaining)}</span>
//                 </div>
//               )}
//             </CardContent>
//             <CardFooter className="flex flex-col gap-3">
//               <Button
//                 size="lg"
//                 className="w-full"
//                 onClick={handleContinue}
//                 disabled={selectedMethod === "COD" && !codEligible}
//               >
//                 ยืนยันวิธีชำระเงิน
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => router.push(`/checkout?items=${itemsParam}`)}
//               >
//                 ← กลับไปแก้ไขที่อยู่
//               </Button>
//             </CardFooter>
//           </Card>
//         </aside>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useMemo, useState, useId, useRef } from "react";
// import Image from "next/image";
// import { useRouter, useSearchParams } from "next/navigation";
// import { toast } from "sonner";
// import { Loader2, Trash2 } from "lucide-react";

// import { formatPrice } from "@/lib/format-price";
// import { generatePromptPayQrCode } from "@/lib/promptpay";
// import {
//   COD_SHIPPING_FEE,
//   calculateCheckoutTotals,
// } from "@/lib/checkout-pricing";
// import { CartItemDTO } from "@/types/cart";
// import { AddressDTO } from "@/types/address";
// import { PaymentMethod, PaymentSlip } from "@/types/checkout";
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
// import { cn } from "@/lib/utils";
// import { useCheckoutStore } from "@/stores/checkout-store";
// import { auth } from "@/lib/auth";

// interface PaymentPageProps {
//   cartItems: CartItemDTO[];
//   address: AddressDTO;
//   subtotal: number;
//   codEligible: boolean;
//   itemsParam: string;
// }

// interface SlipUploaderProps {
//   label: string;
//   description?: string;
//   slip?: PaymentSlip;
//   onChange: (file?: File) => void;
//   disabled?: boolean;
// }

// /* ---------- Security config ---------- */
// // allowed image types (no SVG to avoid XSS vectors)
// const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
// const MAX_SLIP_SIZE = 5 * 1024 * 1024; // 5 MB

// /* ---------- Helpers ---------- */
// function createSlip(file: File): PaymentSlip {
//   return {
//     file,
//     previewUrl: URL.createObjectURL(file),
//   };
// }

// function isValidSlipFile(file?: File | null) {
//   if (!file) return { ok: false, reason: "no_file" } as const;
//   if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
//     return { ok: false, reason: "invalid_type" } as const;
//   }
//   if (file.size > MAX_SLIP_SIZE) {
//     return { ok: false, reason: "too_large" } as const;
//   }
//   return { ok: true } as const;
// }

// /* ---------- SlipUploader (keeps same UI, safer file handling) ---------- */
// function SlipUploader({
//   label,
//   description,
//   slip,
//   onChange,
//   disabled,
// }: SlipUploaderProps) {
//   const inputId = useId();
//   const inputRef = useRef<HTMLInputElement | null>(null);

//   useEffect(() => {
//     return () => {
//       // cleanup preview URL when component unmounts
//       if (slip?.previewUrl) {
//         try {
//           URL.revokeObjectURL(slip.previewUrl);
//         } catch {
//           // ignore errors from revoke
//         }
//       }
//     };
//   }, [slip]);

//   return (
//     <div className="space-y-3 rounded-lg border border-border/60 bg-card p-4 ">
//       <div className="flex items-center justify-between gap-3">
//         <div>
//           <p className="text-sm font-semibold text-foreground md:text-base">
//             {label}
//           </p>
//           {description && (
//             <p className="text-xs text-muted-foreground md:text-sm">
//               {description}
//             </p>
//           )}
//         </div>
//         {slip && (
//           <Button
//             type="button"
//             variant="ghost"
//             size="sm"
//             className="text-destructive hover:text-destructive"
//             onClick={() => onChange(undefined)}
//           >
//             <Trash2 className="mr-1 h-4 w-4" /> ลบสลิป
//           </Button>
//         )}
//       </div>

//       {slip ? (
//         <div className="overflow-hidden rounded-lg border border-border/60 bg-background">
//           <Image
//             src={slip.previewUrl}
//             alt="หลักฐานการชำระเงิน"
//             width={600}
//             height={400}
//             unoptimized
//             className="h-auto w-full object-contain"
//           />
//         </div>
//       ) : (
//         <div className="rounded-lg border border-dashed border-border/60 bg-muted/40 px-4 py-8 text-center text-xs text-muted-foreground md:text-sm">
//           ยังไม่ได้แนบหลักฐาน
//         </div>
//       )}

//       <div className="flex justify-end">
//         <input
//           ref={inputRef}
//           id={inputId}
//           type="file"
//           accept={ALLOWED_IMAGE_TYPES.join(",")}
//           className="hidden"
//           disabled={disabled}
//           aria-label="เลือกไฟล์รูปภาพ"
//           onChange={(event) => {
//             const file = event.target.files?.[0] ?? undefined;

//             if (!file) {
//               onChange(undefined);
//               // clear value to allow same file re-select if needed
//               if (inputRef.current) inputRef.current.value = "";
//               return;
//             }

//             const res = isValidSlipFile(file);
//             if (!res.ok) {
//               if (res.reason === "invalid_type") {
//                 toast.error(
//                   "รองรับเฉพาะไฟล์รูปภาพ PNG, JPG หรือ WEBP เท่านั้น"
//                 );
//               } else if (res.reason === "too_large") {
//                 toast.error("ไฟล์มีขนาดใหญ่เกิน 5MB");
//               } else {
//                 toast.error("ไฟล์ไม่ถูกต้อง");
//               }
//               onChange(undefined);
//               if (inputRef.current) inputRef.current.value = "";
//               return;
//             }

//             onChange(file);
//             if (inputRef.current) inputRef.current.value = "";
//           }}
//         />
//         <Button
//           type="button"
//           size="sm"
//           variant="outline"
//           disabled={disabled}
//           onClick={() => inputRef.current?.click()}
//         >
//           เลือกไฟล์
//         </Button>
//       </div>
//     </div>
//   );
// }

// /* ---------- Main component (keeps full UI but secures flows) ---------- */
// export default function PaymentPage({
//   cartItems,
//   address,
//   subtotal,
//   codEligible,
//   itemsParam,
// }: PaymentPageProps) {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const selectedAddressIdRaw = searchParams.get("address") ?? "";

//   // sanitize address param from URL (allow only common id chars)
//   const selectedAddressId = selectedAddressIdRaw
//     .replace(/[^a-zA-Z0-9-_]/g, "")
//     .trim();

//   const setSelection = useCheckoutStore((state) => state.setSelection);
//   const setPaymentMethodState = useCheckoutStore(
//     (state) => state.setPaymentMethod
//   );
//   const setPromptpaySlipState = useCheckoutStore(
//     (state) => state.setPromptpaySlip
//   );
//   const setCodSlipState = useCheckoutStore((state) => state.setCodSlip);
//   const promptpaySlip = useCheckoutStore((state) => state.promptpaySlip);
//   const codSlip = useCheckoutStore((state) => state.codSlip);

//   const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
//     codEligible ? "COD" : "PROMPTPAY"
//   );
//   const [qrCodeSrc, setQrCodeSrc] = useState<string | null>(null);
//   const [qrError, setQrError] = useState<string | null>(null);
//   const [isGeneratingQr, setIsGeneratingQr] = useState(false);

//   // const promptPayId = process.env.NEXT_PUBLIC_PROMPTPAY_ID ?? "";

//   const [promptPayId, setPromptPayId] = useState("");
//   const [isLoadingPromptPayId, setIsLoadingPromptPayId] = useState(true);

//   useEffect(() => {
//     let active = true;

//     async function loadId() {
//       try {
//         const res = await fetch("/api/payment/promptpay");
//         const data = await res.json();

//         if (active && data.ok) {
//           setPromptPayId(data.promptPayId);
//         } else {
//           setPromptPayId("");
//         }
//       } catch {
//         if (active) setPromptPayId("");
//       } finally {
//         if (active) setIsLoadingPromptPayId(false);
//       }
//     }

//     loadId();
//     return () => {
//       active = false;
//     };
//   }, []);

//   // ---- อันใหม่ข้างบนนี้

//   // ---------- LOCKED subtotal derived from cartItems (authoritative for client) ----------
//   const lockedSubtotal = useMemo(() => {
//     return cartItems.reduce((acc, item) => {
//       const unit = Number(item.unitPrice ?? 0) || 0;
//       const qty = Number(item.quantity ?? 0) || 0;
//       return acc + unit * qty;
//     }, 0);
//   }, [cartItems]);

//   // ---------- Validation of cartItems and subtotal — defensive: redirect if mismatch ----------
//   useEffect(() => {
//     // validate each cart item
//     for (const item of cartItems) {
//       if (!Number.isFinite(item.quantity) || item.quantity <= 0) {
//         toast.error("ข้อมูลจำนวนสินค้าไม่ถูกต้อง กรุณาตรวจสอบตะกร้า");
//         router.replace(`/checkout?items=${itemsParam}`);
//         return;
//       }
//       if (!Number.isFinite(item.unitPrice) || item.unitPrice < 0) {
//         toast.error("ข้อมูลราคาสินค้าไม่ถูกต้อง กรุณาตรวจสอบตะกร้า");
//         router.replace(`/checkout?items=${itemsParam}`);
//         return;
//       }
//       // subtotal check
//       const calcSubtotal = Number(item.unitPrice) * Number(item.quantity);
//       if (Math.abs((item.subtotal ?? 0) - calcSubtotal) > 0.01) {
//         toast.error("ยอดรวมของสินค้าบางรายการเปลี่ยนแปลง กรุณาตรวจสอบตะกร้า");
//         router.replace(`/checkout?items=${itemsParam}`);
//         return;
//       }
//       // stock bounds
//       if (!Number.isFinite(item.maxQuantity) || item.maxQuantity < 0) {
//         toast.error("ข้อมูลสต็อกสินค้าผิดพลาด กรุณาตรวจสอบตะกร้า");
//         router.replace(`/checkout?items=${itemsParam}`);
//         return;
//       }
//       if (item.maxQuantity <= 0) {
//         // out of stock for this weight
//         toast.error(`สินค้า "${item.productTitle}" สต็อกไม่พอ`);
//         router.replace(`/checkout?items=${itemsParam}`);
//         return;
//       }
//       if (item.quantity > item.maxQuantity) {
//         toast.error(`จำนวนสินค้า "${item.productTitle}" มากกว่าสต็อกที่มี`);
//         router.replace(`/checkout?items=${itemsParam}`);
//         return;
//       }
//     }

//     // compare provided subtotal from server prop with lockedSubtotal (computed from cartItems)
//     const epsilon = 0.01;
//     if (
//       !Number.isFinite(subtotal) ||
//       Math.abs(subtotal - lockedSubtotal) > epsilon
//     ) {
//       // mismatch — something changed or tampered — go back to checkout to re-sync
//       toast.error("ยอดรวมสินค้าไม่ตรงกัน กรุณาตรวจสอบตะกร้าอีกครั้ง");
//       router.replace(`/checkout?items=${itemsParam}`);
//       return;
//     }
//   }, [cartItems, subtotal, lockedSubtotal, itemsParam, router]);

//   // totals used for UI and QR generation are derived from lockedSubtotal
//   const totals = useMemo(
//     () => calculateCheckoutTotals(selectedMethod, lockedSubtotal),
//     [selectedMethod, lockedSubtotal]
//   );

//   // set selection in store (same behavior)
//   useEffect(() => {
//     setSelection({ itemsParam, addressId: selectedAddressId });
//   }, [itemsParam, selectedAddressId, setSelection]);

//   // update payment method in store (same behavior)
//   useEffect(() => {
//     setPaymentMethodState(selectedMethod);
//   }, [selectedMethod, setPaymentMethodState]);

//   const totalQuantity = useMemo(
//     () =>
//       cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),
//     [cartItems]
//   );

//   // ---------- QR generation (uses locked totals.immediate) ----------
//   useEffect(() => {
//     const requiresQr =
//       selectedMethod === "PROMPTPAY" || selectedMethod === "COD";
//     if (!requiresQr) {
//       setQrCodeSrc(null);
//       setQrError(null);
//       return;
//     }

//     // if (!promptPayId) {
//     //   setQrCodeSrc(null);
//     //   setQrError("ยังไม่ได้ตั้งค่า NEXT_PUBLIC_PROMPTPAY_ID สำหรับ PromptPay");
//     //   return;
//     // }

//     if (isLoadingPromptPayId) {
//       return; // ยังโหลดไม่เสร็จ ยังไม่ต้อง gen QR
//     }

//     if (!promptPayId) {
//       setQrCodeSrc(null);
//       setQrError("ไม่สามารถโหลด PromptPay ID จากระบบได้");
//       return;
//     }

//     // อันใหม่

//     setIsGeneratingQr(true);
//     let active = true;

//     generatePromptPayQrCode({
//       promptPayId,
//       amount: totals.immediate,
//       reference: selectedAddressId ?? undefined,
//     })
//       .then((dataUrl) => {
//         if (!active) return;
//         // Basic validation: ensure we got a string and (prefer) data: or https: safe url
//         if (
//           typeof dataUrl === "string" &&
//           (dataUrl.startsWith("data:") || dataUrl.startsWith("https:"))
//         ) {
//           setQrCodeSrc(dataUrl);
//           setQrError(null);
//         } else {
//           setQrCodeSrc(null);
//           setQrError("ไม่สามารถสร้าง QR PromptPay ได้");
//         }
//       })
//       .catch(() => {
//         if (!active) return;
//         setQrCodeSrc(null);
//         setQrError("ไม่สามารถสร้าง QR PromptPay ได้");
//       })
//       .finally(() => {
//         if (active) setIsGeneratingQr(false);
//       });

//     return () => {
//       active = false;
//     };
//   }, [selectedMethod, totals.immediate, promptPayId, selectedAddressId]);

//   // ---------- safe slip handlers (create object URL and revoke old one) ----------
//   const handlePromptpaySlipChange = (file?: File) => {
//     // revoke old
//     if (promptpaySlip?.previewUrl) {
//       try {
//         URL.revokeObjectURL(promptpaySlip.previewUrl);
//       } catch {}
//     }

//     if (!file) {
//       setPromptpaySlipState(undefined);
//       return;
//     }

//     // validate file again client-side (defense-in-depth)
//     const res = isValidSlipFile(file);
//     if (!res.ok) {
//       if (res.reason === "invalid_type") {
//         toast.error("รองรับเฉพาะไฟล์รูปภาพ PNG, JPG หรือ WEBP เท่านั้น");
//       } else if (res.reason === "too_large") {
//         toast.error("ไฟล์มีขนาดใหญ่เกิน 5MB");
//       } else {
//         toast.error("ไฟล์ไม่ถูกต้อง");
//       }
//       setPromptpaySlipState(undefined);
//       return;
//     }

//     setPromptpaySlipState(createSlip(file));
//   };

//   const handleCodSlipChange = (file?: File) => {
//     if (codSlip?.previewUrl) {
//       try {
//         URL.revokeObjectURL(codSlip.previewUrl);
//       } catch {}
//     }

//     if (!file) {
//       setCodSlipState(undefined);
//       return;
//     }

//     const res = isValidSlipFile(file);
//     if (!res.ok) {
//       if (res.reason === "invalid_type") {
//         toast.error("รองรับเฉพาะไฟล์รูปภาพ PNG, JPG หรือ WEBP เท่านั้น");
//       } else if (res.reason === "too_large") {
//         toast.error("ไฟล์มีขนาดใหญ่เกิน 5MB");
//       } else {
//         toast.error("ไฟล์ไม่ถูกต้อง");
//       }
//       setCodSlipState(undefined);
//       return;
//     }

//     setCodSlipState(createSlip(file));
//   };

//   // cleanup object URLs on unmount (defensive)
//   useEffect(() => {
//     return () => {
//       if (promptpaySlip?.previewUrl) {
//         try {
//           URL.revokeObjectURL(promptpaySlip.previewUrl);
//         } catch {}
//       }
//       if (codSlip?.previewUrl) {
//         try {
//           URL.revokeObjectURL(codSlip.previewUrl);
//         } catch {}
//       }
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const handleContinue = () => {
//     if (!selectedAddressId) {
//       toast.error("กรุณาเลือกที่อยู่ก่อนดำเนินการต่อ");
//       router.push(`/checkout?items=${itemsParam}`);
//       return;
//     }

//     if (selectedMethod === "PROMPTPAY") {
//       if (!promptPayId) {
//         toast.error("ระบบยังไม่ได้ตั้งค่าเลข PromptPay");
//         return;
//       }
//       if (!promptpaySlip) {
//         toast.error("กรุณาแนบสลิปการชำระผ่าน PromptPay");
//         return;
//       }
//     }

//     if (selectedMethod === "COD") {
//       if (!codEligible) {
//         toast.error("สินค้าบางรายการไม่รองรับการเก็บเงินปลายทาง");
//         return;
//       }
//       if (!codSlip) {
//         toast.error("กรุณาแนบหลักฐานการจ่ายมัดจำสำหรับ COD");
//         return;
//       }
//     }

//     const params = new URLSearchParams();
//     params.set("items", itemsParam);
//     params.set("address", selectedAddressId);
//     params.set("method", selectedMethod);

//     router.push(`/checkout/summary?${params.toString()}`);
//   };

//   /* ---------- Render (keeps all UI and text identical) ---------- */
//   return (
//     <div className="container mx-auto space-y-6 py-6 md:py-8 md:px-0 px-[15px]">
//       <div className="space-y-2">
//         <h1 className="text-lg font-semibold text-foreground md:text-3xl">
//           เลือกวิธีชำระเงิน
//         </h1>
//         <p className="text-xs text-muted-foreground md:text-base">
//           เลือกรูปแบบการชำระที่สะดวก พร้อมตรวจสอบยอดที่ต้องชำระทันที
//         </p>
//       </div>

//       <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
//         <section className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>ที่อยู่จัดส่ง</CardTitle>
//               <CardDescription>
//                 จัดส่งไปยังที่อยู่นี้
//                 หากต้องการแก้ไขให้ย้อนกลับไปยังขั้นตอนก่อนหน้า
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

//           <Card>
//             <CardHeader>
//               <CardTitle>สินค้าที่จะชำระเงิน</CardTitle>
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

//           <Card>
//             <CardHeader>
//               <CardTitle>วิธีชำระเงิน</CardTitle>
//               <CardDescription>เลือกวิธีชำระเงินที่คุณต้องการ</CardDescription>
//             </CardHeader>
//             <CardContent className="grid gap-4 md:grid-cols-2">
//               {(
//                 [
//                   {
//                     key: "PROMPTPAY",
//                     title: "ชำระผ่าน PromptPay",
//                     description:
//                       "สแกน QR เพื่อชำระทันที และแนบสลิปหลังโอนเพื่อตรวจสอบ",
//                   },
//                   {
//                     key: "COD",
//                     title: "ชำระเงินปลายทาง (COD)",
//                     description:
//                       "จ่ายมัดจำค่าจัดส่ง 100 บาท และชำระยอดที่เหลือปลายทาง",
//                   },
//                 ] as {
//                   key: PaymentMethod;
//                   title: string;
//                   description: string;
//                 }[]
//               ).map((method) => {
//                 const disabled = method.key === "COD" && !codEligible;
//                 const isActive = selectedMethod === method.key;
//                 return (
//                   <button
//                     key={method.key}
//                     type="button"
//                     disabled={disabled}
//                     onClick={() => setSelectedMethod(method.key)}
//                     className={cn(
//                       "flex flex-col items-start gap-2 rounded-xl border border-border/60 bg-card px-4 py-3 text-left transition-all hover:border-primary/60 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60",
//                       isActive &&
//                         "border-primary shadow-sm ring-2 ring-primary/40"
//                     )}
//                   >
//                     <div className="flex items-center gap-2">
//                       <span className="text-base font-semibold text-foreground">
//                         {method.title}
//                       </span>
//                       {method.key === "COD" && (
//                         <Badge variant="secondary">
//                           จ่ายมัดจำ {formatPrice(COD_SHIPPING_FEE)}
//                         </Badge>
//                       )}
//                     </div>
//                     <p className="text-xs text-muted-foreground md:text-sm">
//                       {method.description}
//                     </p>
//                     {method.key === "COD" && !codEligible && (
//                       <p className="text-xs text-destructive">
//                         มีสินค้าบางรายการที่ไม่รองรับ COD กรุณาเลือก PromptPay
//                       </p>
//                     )}
//                   </button>
//                 );
//               })}
//             </CardContent>
//           </Card>

//           {selectedMethod === "PROMPTPAY" && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>รายละเอียดการชำระเงินผ่าน PromptPay</CardTitle>
//                 <CardDescription>
//                   สแกน QR เพื่อชำระยอดทั้งหมด และแนบหลักฐานหลังโอน
//                   เพื่อให้ทีมงานตรวจสอบ
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border/60 bg-muted/30 px-4 py-6 text-center">
//                   {isGeneratingQr && (
//                     <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
//                   )}
//                   {qrError && (
//                     <p className="text-sm text-destructive">{qrError}</p>
//                   )}
//                   {!isGeneratingQr && !qrError && qrCodeSrc && (
//                     <Image
//                       src={qrCodeSrc}
//                       alt="PromptPay QR Code"
//                       width={192}
//                       height={192}
//                       unoptimized
//                       className="h-auto w-48 rounded-md border border-border/60 bg-white p-2"
//                     />
//                   )}
//                   {/* {!promptPayId && (
//                     <p className="text-xs text-destructive">
//                       กรุณาตั้งค่า NEXT_PUBLIC_PROMPTPAY_ID ในไฟล์ .env
//                       เพื่อแสดง QR
//                     </p>
//                   )} */}

//                   {isLoadingPromptPayId && (
//                     <p className="text-xs text-muted-foreground">
//                       กำลังโหลดข้อมูลชำระเงิน…
//                     </p>
//                   )}

//                   {!isLoadingPromptPayId &&
//                     !promptPayId && ( // --- อันใหม่
//                       <p className="text-xs text-destructive">
//                         ไม่สามารถโหลดรหัส PromptPay จากระบบได้ กรุณาลองใหม่
//                       </p>
//                     )}
//                   <p className="text-sm font-semibold text-foreground">
//                     ยอดที่ต้องชำระ: {formatPrice(totals.immediate)}
//                   </p>
//                 </div>

//                 <SlipUploader
//                   label="หลักฐานการโอนผ่าน PromptPay"
//                   description="อัปโหลดภาพสลิปเพื่อให้ทีมงานตรวจสอบการชำระเงิน"
//                   slip={promptpaySlip}
//                   onChange={handlePromptpaySlipChange}
//                   disabled={!promptPayId}
//                 />
//               </CardContent>
//             </Card>
//           )}

//           {selectedMethod === "COD" && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>รายละเอียดการชำระเงินปลายทาง</CardTitle>
//                 <CardDescription>
//                   ชำระค่าส่งล่วงหน้า 100 บาท เพื่อยืนยันคำสั่งซื้อ
//                   และชำระค่าสินค้าที่เหลือเมื่อสินค้าถึงที่หมาย
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-4 text-sm text-muted-foreground">
//                   <p>
//                     ยอดจัดส่งที่ต้องชำระตอนนี้:
//                     <span className="font-semibold text-foreground">
//                       {" "}
//                       {formatPrice(COD_SHIPPING_FEE)}
//                     </span>
//                   </p>
//                   <p>
//                     ยอดที่ต้องชำระปลายทาง:
//                     <span className="font-semibold text-foreground">
//                       {" "}
//                       {formatPrice(totals.remaining)}
//                     </span>
//                   </p>
//                 </div>

//                 {promptPayId ? (
//                   <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border/60 bg-muted/20 px-4 py-6 text-center">
//                     {isGeneratingQr && (
//                       <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
//                     )}
//                     {qrError && (
//                       <p className="text-sm text-destructive">{qrError}</p>
//                     )}
//                     {!isGeneratingQr && !qrError && qrCodeSrc && (
//                       <Image
//                         src={qrCodeSrc}
//                         alt="PromptPay QR Code"
//                         width={192}
//                         height={192}
//                         unoptimized
//                         className="h-auto w-48 rounded-md border border-border/60 bg-white p-2"
//                       />
//                     )}
//                     <p className="text-xs text-muted-foreground md:text-sm">
//                       สแกนเพื่อชำระค่าส่งล่วงหน้า หากไม่สะดวกสแกนสามารถโอนตามเลข
//                       PromptPay เดียวกันแล้วแนบสลิปได้เช่นกัน
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 px-4 py-4 text-sm text-destructive">
//                     ยังไม่ได้ตั้งค่า NEXT_PUBLIC_PROMPTPAY_ID
//                     กรุณาแจ้งผู้ดูแลระบบเพื่อตั้งค่า QR สำหรับการชำระค่าส่ง
//                   </div>
//                 )}

//                 <SlipUploader
//                   label="หลักฐานการชำระค่าส่ง"
//                   description="แนบสลิปการโอนค่าส่ง 100 บาท เพื่อให้ทีมงานตรวจสอบ"
//                   slip={codSlip}
//                   onChange={handleCodSlipChange}
//                 />
//               </CardContent>
//             </Card>
//           )}
//         </section>

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
//               {selectedMethod === "PROMPTPAY" && (
//                 <div className="flex items-center justify-between text-blue-600">
//                   <span>ค่าจัดส่ง (PromptPay)</span>
//                   <span>{formatPrice(totals.shippingFee)}</span>
//                 </div>
//               )}
//               {selectedMethod === "COD" && (
//                 <div className="flex items-center justify-between text-blue-600">
//                   <span>จ่ายมัดจำตอนนี้</span>
//                   <span>{formatPrice(totals.deposit)}</span>
//                 </div>
//               )}
//               <Separator />
//               <div className="flex items-center justify-between text-base font-semibold text-foreground">
//                 <span>ยอดชำระทันที</span>
//                 <span>{formatPrice(totals.immediate)}</span>
//               </div>
//               {selectedMethod === "COD" && (
//                 <div className="flex items-center justify-between text-sm text-muted-foreground">
//                   <span>ยอดที่ต้องชำระปลายทาง</span>
//                   <span>{formatPrice(totals.remaining)}</span>
//                 </div>
//               )}
//             </CardContent>
//             <CardFooter className="flex flex-col gap-3">
//               <Button
//                 size="lg"
//                 className="w-full"
//                 onClick={handleContinue}
//                 disabled={selectedMethod === "COD" && !codEligible}
//               >
//                 ยืนยันวิธีชำระเงิน
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => router.push(`/checkout?items=${itemsParam}`)}
//               >
//                 ← กลับไปแก้ไขที่อยู่
//               </Button>
//             </CardFooter>
//           </Card>
//         </aside>
//       </div>
//     </div>
//   );
// }

"use client";

import {
  useEffect,
  useMemo,
  useState,
  useId,
  useRef,
  useTransition,
} from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  CreditCard,
  Loader2,
  Receipt,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { formatPrice } from "@/lib/format-price";
import {
  COD_SHIPPING_FEE,
  calculateCheckoutTotals,
  CheckoutTotals,
} from "@/lib/checkout-pricing";
import { CartItemDTO } from "@/types/cart";
import { AddressDTO } from "@/types/address";
import { PaymentMethod, PaymentSlip } from "@/types/checkout";
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
import { cn } from "@/lib/utils";
import { useCheckoutStore } from "@/stores/checkout-store";
import { motion } from "framer-motion";
import { auth } from "@/lib/auth"; // ยังไม่ได้ใช้ แต่ขอคง import ไว้เหมือนเดิม

interface PaymentPageProps {
  cartItems: CartItemDTO[];
  address: AddressDTO;
  subtotal: number;
  codEligible: boolean;
  itemsParam: string;
}

interface SlipUploaderProps {
  label: string;
  description?: string;
  slip?: PaymentSlip;
  onChange: (file?: File) => void;
  disabled?: boolean;
}

/* ---------- Security config ---------- */
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SLIP_SIZE = 5 * 1024 * 1024; // 5 MB

/* ---------- Helpers ---------- */
function createSlip(file: File): PaymentSlip {
  return {
    file,
    previewUrl: URL.createObjectURL(file),
  };
}

function isValidSlipFile(file?: File | null) {
  if (!file) return { ok: false, reason: "no_file" } as const;
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { ok: false, reason: "invalid_type" } as const;
  }
  if (file.size > MAX_SLIP_SIZE) {
    return { ok: false, reason: "too_large" } as const;
  }
  return { ok: true } as const;
}

/* ---------- SlipUploader ---------- */
function SlipUploader({
  label,
  description,
  slip,
  onChange,
  disabled,
}: SlipUploaderProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (slip?.previewUrl) {
        try {
          URL.revokeObjectURL(slip.previewUrl);
        } catch {
          // ignore
        }
      }
    };
  }, [slip]);

  return (
    <div className="space-y-3 rounded-lg border border-border/60 bg-card p-4 ">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground md:text-base">
            {label}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground md:text-sm">
              {description}
            </p>
          )}
        </div>
        {slip && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => onChange(undefined)}
          >
            <Trash2 className="mr-1 h-4 w-4" /> ลบสลิป
          </Button>
        )}
      </div>

      {slip ? (
        <div className="overflow-hidden rounded-lg border border-border/60 bg-background">
          <Image
            src={slip.previewUrl}
            alt="หลักฐานการชำระเงิน"
            width={600}
            height={400}
            unoptimized
            className="h-auto w-full object-contain"
          />
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border/60 bg-muted/40 px-4 py-8 text-center text-xs text-muted-foreground md:text-sm">
          ยังไม่ได้แนบหลักฐาน
        </div>
      )}

      <div className="flex justify-end">
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          className="hidden"
          disabled={disabled}
          aria-label="เลือกไฟล์รูปภาพ"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? undefined;

            if (!file) {
              onChange(undefined);
              if (inputRef.current) inputRef.current.value = "";
              return;
            }

            const res = isValidSlipFile(file);
            if (!res.ok) {
              if (res.reason === "invalid_type") {
                toast.error(
                  "รองรับเฉพาะไฟล์รูปภาพ PNG, JPG หรือ WEBP เท่านั้น",
                );
              } else if (res.reason === "too_large") {
                toast.error("ไฟล์มีขนาดใหญ่เกิน 5MB");
              } else {
                toast.error("ไฟล์ไม่ถูกต้อง");
              }
              onChange(undefined);
              if (inputRef.current) inputRef.current.value = "";
              return;
            }

            onChange(file);
            if (inputRef.current) inputRef.current.value = "";
          }}
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          เลือกไฟล์
        </Button>
      </div>
    </div>
  );
}

/* ---------- Main component ---------- */
export default function PaymentPage({
  cartItems,
  address,
  subtotal,
  codEligible,
  itemsParam,
}: PaymentPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedAddressIdRaw = searchParams.get("address") ?? "";
  const [isConfirming, startConfirmTransition] = useTransition(); // สำหรับปุ่มยืนยัน
  const [isNavigating, startNavigateTransition] = useTransition(); // สำหรับปุ่มย้อนกลับ

  const selectedAddressId = selectedAddressIdRaw
    .replace(/[^a-zA-Z0-9-_]/g, "")
    .trim();

  const setSelection = useCheckoutStore((state) => state.setSelection);
  const setPaymentMethodState = useCheckoutStore(
    (state) => state.setPaymentMethod,
  );
  const setPromptpaySlipState = useCheckoutStore(
    (state) => state.setPromptpaySlip,
  );
  const setCodSlipState = useCheckoutStore((state) => state.setCodSlip);
  const promptpaySlip = useCheckoutStore((state) => state.promptpaySlip);
  const codSlip = useCheckoutStore((state) => state.codSlip);

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
    codEligible ? "COD" : "PROMPTPAY",
  );

  const [qrCodeSrc, setQrCodeSrc] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);

  const [promptPayId, setPromptPayId] = useState("");
  const [isLoadingPromptPayId, setIsLoadingPromptPayId] = useState(true);

  const [totals, setTotals] = useState<CheckoutTotals | null>(null);

  // set selection ใน store
  useEffect(() => {
    setSelection({ itemsParam, addressId: selectedAddressId });
  }, [itemsParam, selectedAddressId, setSelection]);

  // sync payment method ไป store
  useEffect(() => {
    setPaymentMethodState(selectedMethod);
  }, [selectedMethod, setPaymentMethodState]);

  const totalQuantity = useMemo(
    () =>
      cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),
    [cartItems],
  );

  // เรียก server: validate cart + คำนวณ totals + gen QR + โหลด PromptPay ID
  useEffect(() => {
    let active = true;

    async function loadSession() {
      if (!selectedAddressId) {
        toast.error("กรุณาเลือกที่อยู่ก่อนดำเนินการต่อ");
        router.push(`/checkout?items=${itemsParam}`);
        return;
      }

      setIsGeneratingQr(true);
      setIsLoadingPromptPayId(true);
      setQrError(null);

      try {
        const res = await fetch("/api/payment/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartItems,
            subtotal,
            codEligible,
            itemsParam,
            selectedMethod,
            addressId: selectedAddressId,
          }),
        });

        const data = await res.json();

        if (!active) return;

        if (!res.ok || !data.ok) {
          const msg =
            data?.errorMessage ??
            "เกิดข้อผิดพลาดในการตรวจสอบข้อมูลตะกร้า กรุณาลองใหม่";
          toast.error(msg);
          router.replace(`/checkout?items=${itemsParam}`);
          return;
        }

        setTotals(data.totals);
        setPromptPayId(data.promptPayId ?? "");
        setQrCodeSrc(data.qrCodeSrc ?? null);
        setQrError(data.qrError ?? null);
      } catch (err) {
        if (!active) return;
        console.error("loadSession error", err);
        toast.error("ไม่สามารถโหลดข้อมูลการชำระเงินได้ กรุณาลองใหม่");
        router.replace(`/checkout?items=${itemsParam}`);
      } finally {
        if (active) {
          setIsGeneratingQr(false);
          setIsLoadingPromptPayId(false);
        }
      }
    }

    loadSession();

    return () => {
      active = false;
    };
  }, [
    cartItems,
    subtotal,
    codEligible,
    itemsParam,
    selectedMethod,
    selectedAddressId,
    router,
  ]);

  // handlers สำหรับ slip
  const handlePromptpaySlipChange = (file?: File) => {
    if (promptpaySlip?.previewUrl) {
      try {
        URL.revokeObjectURL(promptpaySlip.previewUrl);
      } catch {}
    }

    if (!file) {
      setPromptpaySlipState(undefined);
      return;
    }

    const res = isValidSlipFile(file);
    if (!res.ok) {
      if (res.reason === "invalid_type") {
        toast.error("รองรับเฉพาะไฟล์รูปภาพ PNG, JPG หรือ WEBP เท่านั้น");
      } else if (res.reason === "too_large") {
        toast.error("ไฟล์มีขนาดใหญ่เกิน 5MB");
      } else {
        toast.error("ไฟล์ไม่ถูกต้อง");
      }
      setPromptpaySlipState(undefined);
      return;
    }

    setPromptpaySlipState(createSlip(file));
  };

  const handleCodSlipChange = (file?: File) => {
    if (codSlip?.previewUrl) {
      try {
        URL.revokeObjectURL(codSlip.previewUrl);
      } catch {}
    }

    if (!file) {
      setCodSlipState(undefined);
      return;
    }

    const res = isValidSlipFile(file);
    if (!res.ok) {
      if (res.reason === "invalid_type") {
        toast.error("รองรับเฉพาะไฟล์รูปภาพ PNG, JPG หรือ WEBP เท่านั้น");
      } else if (res.reason === "too_large") {
        toast.error("ไฟล์มีขนาดใหญ่เกิน 5MB");
      } else {
        toast.error("ไฟล์ไม่ถูกต้อง");
      }
      setCodSlipState(undefined);
      return;
    }

    setCodSlipState(createSlip(file));
  };

  const handleContinue = () => {
    if (!selectedAddressId) {
      toast.error("กรุณาเลือกที่อยู่ก่อนดำเนินการต่อ");
      router.push(`/checkout?items=${itemsParam}`);
      return;
    }

    if (selectedMethod === "PROMPTPAY") {
      if (!promptPayId) {
        toast.error("ระบบยังไม่ได้ตั้งค่าเลข PromptPay");
        return;
      }
      if (!promptpaySlip) {
        toast.error("กรุณาแนบสลิปการชำระผ่าน PromptPay");
        return;
      }
    }

    if (selectedMethod === "COD") {
      if (!codEligible) {
        toast.error("สินค้าบางรายการไม่รองรับการเก็บเงินปลายทาง");
        return;
      }
      if (!codSlip) {
        toast.error("กรุณาแนบหลักฐานการจ่ายมัดจำสำหรับ COD");
        return;
      }
    }

    // const params = new URLSearchParams();
    // params.set("items", itemsParam);
    // params.set("address", selectedAddressId);
    // // params.set("method", selectedMethod);

    // // router.push(`/checkout/summary?${params.toString()}`);
    // router.push(
    //   `/checkout/summary?items=${itemsParam}&address=${selectedAddressId}`,
    // );
    startConfirmTransition(() => {
      const params = new URLSearchParams();
      params.set("items", itemsParam);
      params.set("address", selectedAddressId);

      // ส่งไปหน้าสรุป
      router.push(
        `/checkout/summary?items=${itemsParam}&address=${selectedAddressId}`,
      );
    });
  };

  const effectiveTotals: CheckoutTotals =
    totals ?? calculateCheckoutTotals(selectedMethod, subtotal);

  /* ---------- Layout เดิม ---------- */
  return (
    <div className="container mx-auto space-y-6 py-6 md:py-8 md:px-0 px-[15px]">
      <div className="space-y-2">
        <h1 className="text-lg font-semibold text-foreground md:text-3xl">
          เลือกวิธีชำระเงิน
        </h1>
        <p className="text-xs text-muted-foreground md:text-base">
          เลือกรูปแบบการชำระที่สะดวก พร้อมตรวจสอบยอดที่ต้องชำระทันที
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <section className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ที่อยู่จัดส่ง</CardTitle>
              <CardDescription>
                จัดส่งไปยังที่อยู่นี้
                หากต้องการแก้ไขให้ย้อนกลับไปยังขั้นตอนก่อนหน้า
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
              <CardTitle>สินค้าที่จะชำระเงิน</CardTitle>
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
                    {/* ✅ แก้ไขตรงนี้ครับ ให้เหมือนหน้าอื่นๆ */}
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
            <CardHeader className="pb-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-1">
                {/* 1. ไอคอนขนาดเล็กลงและอยู่ด้านหน้า */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 ring-1 ring-green-100 shadow-sm">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>

                {/* 2. หัวข้ออยู่บรรทัดเดียวกัน */}
                <CardTitle
                  className="
                    text-xl font-bold 
                    bg-gradient-to-br from-green-700 via-emerald-600 to-teal-500 
                    bg-clip-text text-transparent
                  "
                >
                  วิธีชำระเงิน
                </CardTitle>
              </div>

              {/* 3. คำอธิบายอยู่ด้านล่าง */}
              <CardDescription className="text-sm font-medium text-muted-foreground/80">
                เลือกช่องทางการชำระเงินที่คุณสะดวกที่สุด
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4 md:grid-cols-2">
              {(
                [
                  {
                    key: "PROMPTPAY",
                    title: "ชำระผ่าน PromptPay",
                    description:
                      "สแกน QR เพื่อชำระทันที และแนบสลิปหลังโอนเพื่อตรวจสอบ",
                  },
                  {
                    key: "COD",
                    title: "ชำระเงินปลายทาง (COD)",
                    description:
                      "จ่ายมัดจำค่าจัดส่ง 100 บาท และชำระยอดที่เหลือปลายทาง",
                  },
                ] as {
                  key: PaymentMethod;
                  title: string;
                  description: string;
                }[]
              ).map((method) => {
                const disabled = method.key === "COD" && !codEligible;
                const isActive = selectedMethod === method.key;
                return (
                  <button
                    key={method.key}
                    type="button"
                    disabled={disabled}
                    onClick={() => setSelectedMethod(method.key)}
                    className={cn(
                      "flex flex-col items-start gap-2 rounded-xl border border-border/60 bg-card px-4 py-3 text-left transition-all hover:border-primary/60 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60",
                      isActive &&
                        "border-primary shadow-sm ring-2 ring-primary/40",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="md:text-base text-[13px] font-semibold text-foreground">
                        {method.title}
                      </span>
                      {method.key === "COD" && (
                        <Badge variant="secondary">
                          จ่ายมัดจำ {formatPrice(COD_SHIPPING_FEE)}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground md:text-sm">
                      {method.description}
                    </p>
                    {method.key === "COD" && !codEligible && (
                      <p className="text-xs text-destructive">
                        มีสินค้าบางรายการที่ไม่รองรับ COD กรุณาเลือก PromptPay
                      </p>
                    )}
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {selectedMethod === "PROMPTPAY" && (
            <Card>
              <CardHeader>
                <CardTitle>รายละเอียดการชำระเงินผ่าน PromptPay</CardTitle>
                <CardDescription>
                  สแกน QR เพื่อชำระยอดทั้งหมด และแนบหลักฐานหลังโอน
                  เพื่อให้ทีมงานตรวจสอบ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border/60 bg-muted/30 px-4 py-6 text-center">
                  {isGeneratingQr && (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  )}
                  {qrError && (
                    <p className="text-sm text-destructive">{qrError}</p>
                  )}
                  {!isGeneratingQr && !qrError && qrCodeSrc && (
                    <Image
                      src={qrCodeSrc}
                      alt="PromptPay QR Code"
                      width={192}
                      height={192}
                      unoptimized
                      className="h-auto w-48 rounded-md border border-border/60 bg-white p-2"
                    />
                  )}

                  {isLoadingPromptPayId && (
                    <p className="text-xs text-muted-foreground">
                      กำลังโหลดข้อมูลชำระเงิน…
                    </p>
                  )}

                  {!isLoadingPromptPayId && !promptPayId && (
                    <p className="text-xs text-destructive">
                      ไม่สามารถโหลดรหัส PromptPay จากระบบได้ กรุณาลองใหม่
                    </p>
                  )}
                  <p className="text-sm font-semibold text-foreground">
                    ยอดที่ต้องชำระ: {formatPrice(effectiveTotals.immediate)}
                  </p>
                  <div className="relative group max-w-fit mx-auto">
                    {/* เส้นขอบนอกที่ไล่สีบางเฉียบ (Gradient Border 1px) */}
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-red-600/50 via-red-400/20 to-red-600/50 rounded-2xl"></div>

                    <div className="relative bg-white px-8 py-5 rounded-2xl flex flex-col items-center gap-1 shadow-[0_10px_40px_-10px_rgba(220,38,38,0.12)]">
                      {/* หัวข้อ: ใช้สีแดงเข้ม (Deep Red) พร้อมช่องไฟกว้าง */}
                      <span className="text-red-700 font-bold text-[10px] uppercase tracking-[0.3em] bg-red-50/80 px-3 py-0.5 rounded-full border border-red-100">
                        Account Information
                      </span>

                      {/* ชื่อ: ใช้สี Slate 900 ตัดกับสีแดง เพื่อให้ดูแพง */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="h-4 w-[2px] bg-red-600 rounded-full"></div>
                        <h2 className="text-slate-900 font-black text-lg sm:text-xl tracking-tight leading-none">
                          อดิศักดิ์{" "}
                          <span className="text-red-600">จันทร์น้อย</span>
                        </h2>
                        <div className="h-4 w-[2px] bg-red-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <SlipUploader
                  label="หลักฐานการโอนผ่าน PromptPay"
                  description="อัปโหลดภาพสลิปเพื่อให้ทีมงานตรวจสอบการชำระเงิน"
                  slip={promptpaySlip}
                  onChange={handlePromptpaySlipChange}
                  disabled={!promptPayId}
                />
              </CardContent>
            </Card>
          )}

          {selectedMethod === "COD" && (
            <Card>
              <CardHeader>
                <CardTitle>รายละเอียดการชำระเงินปลายทาง</CardTitle>
                <CardDescription>
                  ชำระค่าส่งล่วงหน้า 100 บาท เพื่อยืนยันคำสั่งซื้อ
                  และชำระค่าสินค้าที่เหลือเมื่อสินค้าถึงที่หมาย
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-4 text-sm text-muted-foreground">
                  <p>
                    ยอดจัดส่งที่ต้องชำระตอนนี้:
                    <span className="font-semibold text-foreground">
                      {" "}
                      {formatPrice(COD_SHIPPING_FEE)}
                    </span>
                  </p>
                  <p>
                    ยอดที่ต้องชำระปลายทาง:
                    <span className="font-semibold text-foreground">
                      {" "}
                      {formatPrice(effectiveTotals.remaining)}
                    </span>
                  </p>
                </div>

                {promptPayId ? (
                  <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border/60 bg-muted/20 px-4 py-6 text-center">
                    {isGeneratingQr && (
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    )}
                    {qrError && (
                      <p className="text-sm text-destructive">{qrError}</p>
                    )}
                    {!isGeneratingQr && !qrError && qrCodeSrc && (
                      <Image
                        src={qrCodeSrc}
                        alt="PromptPay QR Code"
                        width={192}
                        height={192}
                        unoptimized
                        className="h-auto w-48 rounded-md border border-border/60 bg-white p-2"
                      />
                    )}
                    <p className="text-xs text-muted-foreground md:text-sm">
                      สแกนเพื่อชำระค่าส่งล่วงหน้า หากไม่สะดวกสแกนสามารถโอนตามเลข
                      PromptPay เดียวกันแล้วแนบสลิปได้เช่นกัน
                    </p>
                    {/* <div className="max-w-fit bg-white border border-gray-100 shadow-lg rounded-2xl p-6 text-center">
                      <div className="text-red-500 font-bold uppercase tracking-widest text-sm mb-1">
                        ชื่อบัญชีร้าน
                      </div>
                      <div className="text-gray-800 font-black text-3xl">
                        อดิศักดิ์ จันทร์น้อย
                      </div>
                    </div> */}
                    <div className="relative group max-w-fit mx-auto">
                      {/* เส้นขอบนอกที่ไล่สีบางเฉียบ (Gradient Border 1px) */}
                      <div className="absolute -inset-[1px] bg-gradient-to-r from-red-600/50 via-red-400/20 to-red-600/50 rounded-2xl"></div>

                      <div className="relative bg-white px-8 py-5 rounded-2xl flex flex-col items-center gap-1 shadow-[0_10px_40px_-10px_rgba(220,38,38,0.12)]">
                        {/* หัวข้อ: ใช้สีแดงเข้ม (Deep Red) พร้อมช่องไฟกว้าง */}
                        <span className="text-red-700 font-bold text-[10px] uppercase tracking-[0.3em] bg-red-50/80 px-3 py-0.5 rounded-full border border-red-100">
                          Account Information
                        </span>

                        {/* ชื่อ: ใช้สี Slate 900 ตัดกับสีแดง เพื่อให้ดูแพง */}
                        <div className="flex items-center gap-3 mt-2">
                          <div className="h-4 w-[2px] bg-red-600 rounded-full"></div>
                          <h2 className="text-slate-900 font-black text-lg sm:text-xl tracking-tight leading-none">
                            อดิศักดิ์{" "}
                            <span className="text-red-600">จันทร์น้อย</span>
                          </h2>
                          <div className="h-4 w-[2px] bg-red-600 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 px-4 py-4 text-sm text-destructive">
                    ยังไม่ได้ตั้งค่า กรุณาแจ้งผู้ดูแลระบบเพื่อตั้งค่า QR
                    สำหรับการชำระค่าส่ง
                  </div>
                )}

                <SlipUploader
                  label="หลักฐานการชำระค่าส่ง"
                  description="แนบสลิปการโอนค่าส่ง 100 บาท เพื่อให้ทีมงานตรวจสอบ"
                  slip={codSlip}
                  onChange={handleCodSlipChange}
                />
              </CardContent>
            </Card>
          )}
        </section>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold md:text-xl">
                {/* ✅ ใส่ไอคอนตรงนี้ (กำหนดสี text-primary ให้ดูสวยขึ้น) */}
                <Calculator className="size-5 md:size-6 text-primary" />
                สรุปยอดชำระ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>ยอดรวมสินค้า</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {selectedMethod === "PROMPTPAY" && (
                <div className="flex items-center justify-between text-blue-600">
                  <span>ค่าจัดส่ง (PromptPay)</span>
                  <span>{formatPrice(effectiveTotals.shippingFee)}</span>
                </div>
              )}
              {selectedMethod === "COD" && (
                <div className="flex items-center justify-between text-blue-600">
                  <span>จ่ายมัดจำตอนนี้</span>
                  <span>{formatPrice(effectiveTotals.deposit)}</span>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between text-base font-semibold text-foreground">
                <span>ยอดชำระทันที</span>
                <span>{formatPrice(effectiveTotals.immediate)}</span>
              </div>
              {selectedMethod === "COD" && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>ยอดที่ต้องชำระปลายทาง</span>
                  <span>{formatPrice(effectiveTotals.remaining)}</span>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-1 ">
              <div className="w-full space-y-2">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleContinue}
                  disabled={
                    (selectedMethod === "COD" && !codEligible) ||
                    isConfirming ||
                    isNavigating // 🟢 ปิดถ้ามีการโหลดใดๆ เกิดขึ้น
                  }
                  aria-busy={isConfirming}
                >
                  {isConfirming ? ( // 🟢 เช็คแค่ isConfirming
                    "กำลังประมวลผล..."
                  ) : (
                    <>
                      ยืนยันวิธีชำระเงิน <ArrowRight className="size-5" />
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-primary/20 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  // 🟢 ใช้ startNavigateTransition ตรงนี้
                  onClick={() => {
                    startNavigateTransition(() => {
                      router.push(`/checkout?items=${itemsParam}`);
                    });
                  }}
                  // 🟢 ปิดถ้ามีการโหลดใดๆ เกิดขึ้น
                  disabled={isConfirming || isNavigating}
                >
                  {isNavigating ? ( // 🟢 เช็คแค่ isNavigating
                    "กำลังประมวลผล..."
                  ) : (
                    <>
                      <ArrowLeft className="size-5" /> กลับไปแก้ไขที่อยู่
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
            {/* ✅ Trust Signal */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-3">
              <ShieldCheck className="size-3.5 text-green-600" />
              <span>ข้อมูลของคุณปลอดภัย 100%</span>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

// export default function PaymentPage(props: PaymentPageProps) {
//   return (
//     <Suspense fallback={
//       <div className="flex h-[50vh] w-full items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//       </div>
//     }>
//       <PaymentPageContent {...props} />
//     </Suspense>
//   );
// }
