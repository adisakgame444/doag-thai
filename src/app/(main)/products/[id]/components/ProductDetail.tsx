// "use client";

// import { useEffect, useMemo, useRef, useState, useTransition } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import {
//   Package,
//   Ban,
//   Plus,
//   ShoppingCart,
//   Truck,
//   Minus,
//   ArrowLeftRight,
// } from "lucide-react";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Separator } from "@/components/ui/separator";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { formatPrice } from "@/lib/format-price";
// import { calculateDiscountPercent } from "@/lib/pricing";
// import { cn } from "@/lib/utils";
// import { useCartStore } from "@/stores/cart-store";
// import {
//   addCartItemAction,
//   replaceOrderItemAction,
// } from "@/app/(main)/(protected)/cart/actions";

// import { ReviewModal } from "@/components/product/review-modal";
// import { ReviewList } from "@/components/product/review-list";
// import MobileActionBar from "@/components/layouts/MobileActionBar";

// // Import Local Components
// import { ImageGallery } from "./image-gallery";
// import { PaymentDialog } from "./payment-dialog";
// import {
//   PreparedWeightOption,
//   ProductDetailPayload,
// } from "@/types/product-types";

// const FALLBACK_IMAGE = "/images/no-product-image.webp";

// export default function ProductDetail({
//   product,
//   userId,
//   isAuthenticated,
//   canReview,
//   replacementTargetId,
//   originalPaymentMethod,
//   defaultAddressId,
// }: {
//   product: ProductDetailPayload;
//   userId: string | null;
//   isAuthenticated: boolean;
//   canReview: boolean;
//   replacementTargetId?: string;
//   originalPaymentMethod?: string | null;
//   defaultAddressId?: string | null;
// }) {
//   const router = useRouter();
//   const [isPending, startTransition] = useTransition();
//   const syncFromServer = useCartStore((state) => state.syncFromServer);

//   // --- States ---
//   const [activeImageId, setActiveImageId] = useState<string | null>(
//     product.images[0]?.id ?? null,
//   );
//   const [selectedWeightId, setSelectedWeightId] = useState<string | null>(
//     () => {
//       if (!product.weights?.length) return null;
//       return (
//         [...product.weights].sort((a, b) =>
//           product.type === "UNIT"
//             ? parseInt(a.name ?? "0") - parseInt(b.name ?? "0")
//             : a.weight - b.weight,
//         )[0]?.id ?? null
//       );
//     },
//   );
//   const [quantity, setQuantity] = useState<number>(1);
//   const [paymentModalOpen, setPaymentModalOpen] = useState(false);
//   const [isRefundMode, setIsRefundMode] = useState(false);
//   const [refundAmount, setRefundAmount] = useState(0);
//   const [extraAmount, setExtraAmount] = useState(0);
//   const [qrCodeUrl, setQrCodeUrl] = useState("");
//   const [slipImage, setSlipImage] = useState<string | null>(null);
//   const [refundBank, setRefundBank] = useState("PROMPTPAY");
//   const [refundAccountNo, setRefundAccountNo] = useState("");
//   const [refundAccountName, setRefundAccountName] = useState("");

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // --- Memos & Logic ---
//   const preparedWeightOptions = useMemo<PreparedWeightOption[]>(() => {
//     return product.weights
//       .map((w) => {
//         const discount = Math.round(
//           calculateDiscountPercent(Number(w.basePrice), Number(w.price)),
//         );
//         return {
//           ...w,
//           priceLabel: formatPrice(w.price),
//           basePriceLabel: formatPrice(w.basePrice),
//           discount,
//           hasDiscount: discount > 0,
//           showBasePrice: w.basePrice > w.price,
//           displayName:
//             product.type === "UNIT"
//               ? `${w.name} ${product.unitLabel}`
//               : `${w.weight.toLocaleString()} ${product.unitLabel}`,
//         };
//       })
//       .sort((a, b) =>
//         product.type === "UNIT"
//           ? parseInt(a.name ?? "0") - parseInt(b.name ?? "0")
//           : a.weight - b.weight,
//       );
//   }, [product]);

//   const selectedWeight = useMemo(
//     () => product.weights.find((w) => w.id === selectedWeightId) ?? null,
//     [product.weights, selectedWeightId],
//   );
//   const isSoldOut = product.stock <= 0;
//   const isCodRestricted =
//     !!replacementTargetId && originalPaymentMethod === "COD" && !product.cod;

//   const displayImage =
//     product.images.find((i) => i.id === activeImageId)?.url ??
//     product.mainImageUrl ??
//     FALLBACK_IMAGE;

//   const maxQuantity = useMemo(() => {
//     if (!selectedWeight || selectedWeight.weight <= 0) return 0;
//     let consumption = selectedWeight.weight;
//     if (product.type === "UNIT") {
//       const nameVal = parseInt(selectedWeight.name ?? "0", 10);
//       if (!isNaN(nameVal) && nameVal > 1) consumption = nameVal;
//     }
//     return Math.max(0, Math.floor(product.stock / consumption));
//   }, [product, selectedWeight]);

//   useEffect(() => {
//     setQuantity((q) => (maxQuantity > 0 ? Math.min(q, maxQuantity) : 1));
//   }, [maxQuantity]);

//   const totalPrice =
//     selectedWeight && maxQuantity > 0
//       ? selectedWeight.price * quantity
//       : undefined;
//   const unitPriceLabel = selectedWeight
//     ? formatPrice(selectedWeight.price)
//     : "สอบถามราคา";
//   const basePriceLabel =
//     selectedWeight && selectedWeight.basePrice > selectedWeight.price
//       ? formatPrice(selectedWeight.basePrice)
//       : null;
//   const discountPercent = selectedWeight
//     ? Math.round(
//         calculateDiscountPercent(
//           Number(selectedWeight.basePrice),
//           Number(selectedWeight.price),
//         ),
//       )
//     : 0;

//   // --- Handlers ---
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setSlipImage(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleReplaceItem = () => {
//     if (isCodRestricted) {
//       toast.error("ออเดอร์เดิมชำระปลายทาง สินค้าใหม่ต้องรองรับปลายทางด้วยครับ");
//       return;
//     }
//     startTransition(async () => {
//       const result: any = await replaceOrderItemAction({
//         orderItemId: replacementTargetId!,
//         newProductId: product.id,
//         newWeightId: selectedWeight!.id,
//         quantity,
//       });
//       if (result.requireRefund) {
//         setRefundAmount(result.refundAmount);
//         setIsRefundMode(true);
//         setPaymentModalOpen(true);
//       } else if (result.requirePayment) {
//         setExtraAmount(result.extraAmount);
//         setQrCodeUrl(result.qrCode);
//         setIsRefundMode(false);
//         setPaymentModalOpen(true);
//       } else if (result.success) {
//         router.refresh();
//         toast.success("เปลี่ยนสินค้าสำเร็จ");
//         router.push("/orders");
//       } else toast.error(result.message);
//     });
//   };

//   const handleConfirmPayment = () => {
//     if (!slipImage) {
//       toast.error("กรุณาแนบหลักฐาน");
//       return;
//     }
//     startTransition(async () => {
//       const result: any = await replaceOrderItemAction({
//         orderItemId: replacementTargetId!,
//         newProductId: product.id,
//         newWeightId: selectedWeight!.id,
//         quantity,
//         slipImage,
//       });
//       if (result.success) {
//         setPaymentModalOpen(false);
//         toast.success("บันทึกข้อมูลเรียบร้อย");
//         router.push("/orders");
//       } else toast.error(result.message);
//     });
//   };

//   const handleConfirmRefund = () => {
//     startTransition(async () => {
//       const result: any = await replaceOrderItemAction({
//         orderItemId: replacementTargetId!,
//         newProductId: product.id,
//         newWeightId: selectedWeight!.id,
//         quantity,
//         refundDetails: {
//           bank: refundBank,
//           name: refundAccountName,
//           number: refundAccountNo,
//         },
//       });
//       if (result.success) {
//         setPaymentModalOpen(false);
//         toast.success(result.message);
//         router.push("/orders");
//       } else toast.error(result.message);
//     });
//   };

//   const handleAddToCart = () => {
//     if (!isAuthenticated || !userId) {
//       router.push(`/sign-in?redirect=/products/${product.id}`);
//       return;
//     }
//     startTransition(async () => {
//       const result = await addCartItemAction({
//         productId: product.id,
//         weightId: selectedWeight!.id,
//         quantity,
//       });
//       if (result.success && result.cart) {
//         syncFromServer(userId, result.cart);
//         toast.success("เพิ่มสินค้าในตะกร้าแล้ว");
//       } else toast.error(result.message);
//     });
//   };

//   const handleBuyNow = () => {
//     if (!isAuthenticated || !userId) {
//       router.push(`/sign-in?redirect=/products/${product.id}`);
//       return;
//     }
//     startTransition(async () => {
//       const result = await addCartItemAction({
//         productId: product.id,
//         weightId: selectedWeight!.id,
//         quantity,
//       });
//       if (result.success && result.cart) {
//         syncFromServer(userId, result.cart);
//         const ids = result.cart.map((i: any) => i.id).join(",");
//         router.push(
//           defaultAddressId
//             ? `/checkout/payment?items=${ids}&address=${defaultAddressId}`
//             : `/checkout?items=${ids}`,
//         );
//       }
//     });
//   };

//   const disableCartButton =
//     !selectedWeight ||
//     isSoldOut ||
//     maxQuantity <= 0 ||
//     quantity > maxQuantity ||
//     isPending;

//   return (
//     <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr] md:px-0 px-[15px]">
//       <ImageGallery
//         images={product.images}
//         title={product.title}
//         activeImageId={activeImageId}
//         setActiveImageId={setActiveImageId}
//         displayImage={displayImage}
//         isSoldOut={isSoldOut}
//       />

//       <div className="space-y-6 md:px-6">
//         <div className="space-y-4">
//           <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
//             {product.categoryName && (
//               <Badge
//                 variant="outline"
//                 className="border-primary/20 bg-primary/10 text-primary"
//               >
//                 {product.categoryName}
//               </Badge>
//             )}
//             <Badge
//               variant="outline"
//               className={cn(
//                 "border-border/60 bg-background",
//                 isSoldOut
//                   ? "border-destructive/60 bg-destructive/10 text-destructive"
//                   : "border-emerald-400/60 bg-emerald-50 text-emerald-600",
//               )}
//             >
//               {isSoldOut ? "สินค้าหมด" : "พร้อมส่ง"}
//             </Badge>
//             {product.cod ? (
//               <Badge
//                 variant="secondary"
//                 className="flex items-center gap-1 bg-black/70 text-white"
//               >
//                 <Truck className="size-3.5" />
//                 เก็บเงินปลายทาง
//               </Badge>
//             ) : (
//               <Badge
//                 variant="outline"
//                 className="flex items-center gap-1 border-red-200 bg-red-50 text-red-600"
//               >
//                 <Ban className="size-3.5" />
//                 ไม่มีเก็บปลายทาง
//               </Badge>
//             )}
//           </div>

//           <h1 className="text-2xl font-semibold tracking-tight text-foreground">
//             {product.title}
//           </h1>

//           <div className="flex items-end justify-between gap-2">
//             <div className="flex flex-col gap-1">
//               <div className="flex items-center gap-2 text-xl font-bold md:text-2xl leading-none">
//                 <div className="text-2xl">{unitPriceLabel}</div>
//                 {discountPercent > 0 && (
//                   <Badge
//                     variant="destructive"
//                     className="rounded-full px-2 py-0 text-[10px] h-4 flex items-center justify-center"
//                   >
//                     ลด {discountPercent}%
//                   </Badge>
//                 )}
//               </div>
//               {basePriceLabel && (
//                 <span className="text-1xl text-muted-foreground line-through leading-none">
//                   {basePriceLabel}
//                 </span>
//               )}
//             </div>

//             <div className="hidden md:flex flex-col gap-1 w-[160px] shrink-0">
//               <span className="text-[11px] font-medium text-muted-foreground">
//                 {product.type === "UNIT" ? "เลือกตัวเลือก" : "เลือกน้ำหนัก"}
//               </span>
//               <Select
//                 value={selectedWeightId ?? undefined}
//                 onValueChange={setSelectedWeightId}
//               >
//                 <SelectTrigger className="w-full !h-[45px] rounded-xl border-border/60 bg-background">
//                   <SelectValue placeholder="เลือก..." />
//                 </SelectTrigger>
//                 <SelectContent className="w-[var(--radix-select-trigger-width)]">
//                   {preparedWeightOptions.map((opt) => (
//                     <SelectItem
//                       key={opt.id}
//                       value={opt.id}
//                       className="py-2 focus:bg-emerald-50"
//                     >
//                       <div className="flex flex-col text-xs">
//                         <div className="flex items-center justify-start gap-2">
//                           <span className="font-semibold text-foreground whitespace-nowrap">
//                             {opt.displayName}
//                           </span>
//                           {opt.hasDiscount && (
//                             <span className="font-bold text-destructive shrink-0">
//                               ลด {opt.discount}%
//                             </span>
//                           )}
//                         </div>
//                         <div className="flex items-center justify-start gap-2 opacity-70">
//                           <span className="whitespace-nowrap">
//                             {opt.priceLabel}
//                           </span>
//                           {opt.showBasePrice && (
//                             <span className="line-through text-[10px]">
//                               {opt.basePriceLabel}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <Separator className="hidden md:block" />

//           {/* Quantity UI Desktop */}
//           <div className="hidden md:block space-y-4">
//             <div className="mt-4 grid grid-cols-[1fr_auto] items-start gap-4">
//               <div className="min-w-0 flex w-fit items-center gap-1 rounded-full border border-border/60 bg-background px-3 py-1.5 font-medium text-foreground responsive-text-size overflow-hidden">
//                 <Package className="size-4 text-primary shrink-0" />
//                 <div className="truncate flex items-center gap-1">
//                   <span className="whitespace-nowrap">
//                     สต็อก {product.stock.toLocaleString()}
//                   </span>
//                   {selectedWeight && (
//                     <span className="text-muted-foreground truncate border-l border-border/60 pl-2 ml-1">
//                       เลือก{" "}
//                       {product.type === "UNIT"
//                         ? selectedWeight.name
//                         : selectedWeight.weight.toLocaleString()}{" "}
//                       {product.unitLabel}
//                     </span>
//                   )}
//                 </div>
//               </div>
//               <div className="flex w-fit flex-col items-end gap-1">
//                 <div className="flex items-center gap-2">
//                   <Button
//                     variant="outline"
//                     size="icon"
//                     onClick={() => setQuantity((q) => Math.max(1, q - 1))}
//                     disabled={quantity <= 1 || isSoldOut || maxQuantity <= 0}
//                     className="h-7 w-7 shrink-0 rounded-md"
//                   >
//                     <Minus className="size-4" />
//                   </Button>
//                   <Input
//                     type="number"
//                     min={1}
//                     value={quantity}
//                     onChange={(e) => setQuantity(Number(e.target.value))}
//                     className="h-7 w-10 text-center text-sm p-0"
//                     disabled={isSoldOut || maxQuantity <= 0}
//                   />
//                   <Button
//                     variant="outline"
//                     size="icon"
//                     onClick={() => setQuantity((q) => q + 1)}
//                     disabled={
//                       isSoldOut || maxQuantity <= 0 || quantity >= maxQuantity
//                     }
//                     className="h-7 w-7 shrink-0 rounded-md"
//                   >
//                     <Plus className="size-4" />
//                   </Button>
//                 </div>
//                 {selectedWeight && maxQuantity > 0 && (
//                   <span className="text-[10px] text-muted-foreground text-right w-full break-words leading-tight">
//                     สั่งได้สูงสุด {maxQuantity.toLocaleString()} ชิ้น (
//                     {(selectedWeight.weight * maxQuantity).toLocaleString()}{" "}
//                     ชิ้น)
//                   </span>
//                 )}
//               </div>
//             </div>

//             {/* Summary Box */}
//             <div className="hidden md:block space-y-3 rounded-2xl border border-border/60 bg-muted/40 px-5 py-4">
//               <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/50 p-5 backdrop-blur-sm">
//                 <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-emerald-500/5 blur-2xl" />
//                 <div className="mb-4 relative pt-3">
//                   <p className="absolute top-0 left-0 text-[8px] font-semibold uppercase tracking-wider text-muted-foreground/80">
//                     Product Detail
//                   </p>
//                   <div className="grid grid-cols-[1fr_auto] items-center gap-4">
//                     <div className="min-w-0 flex-1">
//                       <h3 className="text-sm font-medium text-foreground truncate mt-0.5">
//                         {product.title}
//                       </h3>
//                     </div>
//                     <div className="flex shrink-0 gap-1.5">
//                       <div className="detail-box-responsive rounded-md bg-background/40 border border-border/30 px-2 flex flex-col items-center">
//                         <span className="text-[9px] text-muted-foreground whitespace-nowrap">
//                           {product.type === "UNIT" ? "ตัวเลือก" : "ขนาด"}
//                         </span>
//                         <span className="text-[10px] font-medium text-foreground text-center leading-tight mt-0.5 whitespace-nowrap">
//                           {selectedWeight
//                             ? product.type === "UNIT"
//                               ? `${selectedWeight.name} ${product.unitLabel}`
//                               : `${selectedWeight.weight.toLocaleString()} ${product.unitLabel}`
//                             : "-"}
//                         </span>
//                       </div>
//                       <div className="detail-box-responsive rounded-md bg-emerald-50/50 border border-emerald-100/50 px-2 flex flex-col items-center">
//                         <span className="text-[9px] text-muted-foreground whitespace-nowrap">
//                           จำนวน
//                         </span>
//                         <span className="text-xs font-bold text-emerald-600 leading-tight mt-0.5 whitespace-nowrap">
//                           x {quantity.toLocaleString()}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="my-4 border-t border-dashed border-border/60" />
//                 {typeof totalPrice === "number" && (
//                   <div className="mt-5 flex items-end justify-between rounded-xl bg-emerald-50/50 px-4 py-3 border border-emerald-100/50">
//                     <div className="flex flex-col">
//                       <span className="text-[10px] text-emerald-600/70">
//                         ยอดชำระรวม
//                       </span>
//                       <span className="text-xs font-medium text-emerald-700 leading-none">
//                         Total Price
//                       </span>
//                     </div>
//                     <div className="flex items-baseline gap-1">
//                       <span className="text-2xl font-bold text-emerald-600 leading-none">
//                         {formatPrice(totalPrice).replace("฿", "")}
//                       </span>
//                       <span className="text-xs font-medium text-emerald-600/70">
//                         THB
//                       </span>
//                     </div>
//                   </div>
//                 )}
//               </div>
//               <div className="flex gap-2">
//                 {replacementTargetId ? (
//                   <Button
//                     size="lg"
//                     className={cn(
//                       "w-full text-white",
//                       isCodRestricted
//                         ? "bg-gray-400"
//                         : "bg-amber-600 hover:bg-amber-700",
//                     )}
//                     onClick={handleReplaceItem}
//                     disabled={disableCartButton}
//                   >
//                     {isPending ? (
//                       "กำลังตรวจสอบ..."
//                     ) : (
//                       <>
//                         <ArrowLeftRight className="mr-2 size-4" />
//                         ยืนยันการเปลี่ยนสินค้า
//                       </>
//                     )}
//                   </Button>
//                 ) : (
//                   <Button
//                     size="lg"
//                     className="w-full"
//                     onClick={handleAddToCart}
//                     disabled={disableCartButton}
//                   >
//                     <ShoppingCart className="size-4 mr-2" />
//                     {isSoldOut ? "สินค้าหมด" : "เพิ่มลงตะกร้า"}
//                   </Button>
//                 )}
//                 <Button
//                   size="lg"
//                   variant="outline"
//                   className="w-full"
//                   onClick={() => router.push("/cart")}
//                 >
//                   ไปยังหน้าตะกร้า
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>

//         <Separator className="hidden md:block" />
//         <div className="space-y-2">
//           <h2 className="text-lg font-semibold">รายละเอียดสินค้า</h2>
//           <p className="text-sm leading-6 text-muted-foreground whitespace-pre-line">
//             {product.description}
//           </p>
//         </div>

//         <Separator className="my-6" />
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold">
//             รีวิวจากลูกค้า ({product.totalReviews || 0})
//           </h3>
//           {canReview ? (
//             <div className="rounded-xl border border-dashed border-emerald-500/50 bg-emerald-50/50 p-6 text-center">
//               <ReviewModal productId={product.id} />
//             </div>
//           ) : (
//             <div className="rounded-lg bg-muted/10 p-4 text-center border">
//               <p className="text-sm text-muted-foreground">
//                 ต้องสั่งซื้อสำเร็จแล้วเท่านั้นจึงจะรีวิวได้
//               </p>
//             </div>
//           )}
//         </div>
//         <ReviewList reviews={product.reviews || []} />
//       </div>

//       <PaymentDialog
//         open={paymentModalOpen}
//         onOpenChange={setPaymentModalOpen}
//         isRefundMode={isRefundMode}
//         refundAmount={refundAmount}
//         extraAmount={extraAmount}
//         qrCodeUrl={qrCodeUrl}
//         slipImage={slipImage}
//         setSlipImage={setSlipImage}
//         refundBank={refundBank}
//         setRefundBank={setRefundBank}
//         refundAccountNo={refundAccountNo}
//         setRefundAccountNo={setRefundAccountNo}
//         refundAccountName={refundAccountName}
//         setRefundAccountName={setRefundAccountName}
//         isPending={isPending}
//         fileInputRef={fileInputRef}
//         handleFileChange={handleFileChange}
//         handleConfirmPayment={handleConfirmPayment}
//         handleConfirmRefund={handleConfirmRefund}
//       />

//       <MobileActionBar
//         replacementTargetId={replacementTargetId}
//         isCodRestricted={isCodRestricted}
//         disableCartButton={disableCartButton}
//         isPending={isPending}
//         isSoldOut={isSoldOut}
//         handleAddToCart={handleAddToCart}
//         handleReplaceItem={handleReplaceItem}
//         unitLabel={product.unitLabel}
//         productTitle={product.title}
//         displayImage={displayImage}
//         unitPriceLabel={unitPriceLabel}
//         stock={product.stock}
//         productType={product.type}
//         preparedWeightOptions={preparedWeightOptions}
//         selectedWeightId={selectedWeightId}
//         setSelectedWeightId={setSelectedWeightId}
//         quantity={quantity}
//         maxQuantity={maxQuantity}
//         incrementQuantity={() => setQuantity((q) => q + 1)}
//         decrementQuantity={() => setQuantity((q) => Math.max(1, q - 1))}
//         basePriceLabel={basePriceLabel}
//         discountPercent={discountPercent}
//         totalPrice={totalPrice}
//         handleBuyNow={handleBuyNow}
//       />
//     </div>
//   );
// }

"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Package,
  Ban,
  Plus,
  ShoppingCart,
  Truck,
  Minus,
  ArrowLeftRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { formatPrice } from "@/lib/format-price";
import { calculateDiscountPercent } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import {
  addCartItemAction,
  replaceOrderItemAction,
} from "@/app/(main)/(protected)/cart/actions";

import { ReviewModal } from "@/components/product/review-modal";
import { ReviewList } from "@/components/product/review-list";
import MobileActionBar from "@/components/layouts/MobileActionBar";

// Import Local Components
import { ImageGallery } from "./image-gallery";
import { PaymentDialog } from "./payment-dialog";
import {
  PreparedWeightOption,
  ProductDetailPayload,
} from "@/types/product-types";

const FALLBACK_IMAGE = "/images/no-product-image.webp";

export default function ProductDetail({
  product,
  userId,
  isAuthenticated,
  canReview,
  replacementTargetId,
  originalPaymentMethod,
  defaultAddressId,
}: {
  product: ProductDetailPayload;
  userId: string | null;
  isAuthenticated: boolean;
  canReview: boolean;
  replacementTargetId?: string;
  originalPaymentMethod?: string | null;
  defaultAddressId?: string | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const syncFromServer = useCartStore((state) => state.syncFromServer);

  // --- States ---
  const [activeImageId, setActiveImageId] = useState<string | null>(
    product.images[0]?.id ?? null,
  );
  const [selectedWeightId, setSelectedWeightId] = useState<string | null>(
    () => {
      if (!product.weights?.length) return null;
      return (
        [...product.weights].sort((a, b) =>
          product.type === "UNIT"
            ? parseInt(a.name ?? "0") - parseInt(b.name ?? "0")
            : a.weight - b.weight,
        )[0]?.id ?? null
      );
    },
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isRefundMode, setIsRefundMode] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);
  const [extraAmount, setExtraAmount] = useState(0);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [slipImage, setSlipImage] = useState<string | null>(null);
  const [refundBank, setRefundBank] = useState("PROMPTPAY");
  const [refundAccountNo, setRefundAccountNo] = useState("");
  const [refundAccountName, setRefundAccountName] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Memos & Logic ---
  const preparedWeightOptions = useMemo<PreparedWeightOption[]>(() => {
    return product.weights
      .map((w) => {
        const discount = Math.round(
          calculateDiscountPercent(Number(w.basePrice), Number(w.price)),
        );
        return {
          ...w,
          priceLabel: formatPrice(w.price),
          basePriceLabel: formatPrice(w.basePrice),
          discount,
          hasDiscount: discount > 0,
          showBasePrice: w.basePrice > w.price,
          displayName:
            product.type === "UNIT"
              ? `${w.name} ${product.unitLabel}`
              : `${w.weight.toLocaleString()} ${product.unitLabel}`,
        };
      })
      .sort((a, b) =>
        product.type === "UNIT"
          ? parseInt(a.name ?? "0") - parseInt(b.name ?? "0")
          : a.weight - b.weight,
      );
  }, [product]);

  const selectedWeight = useMemo(
    () => product.weights.find((w) => w.id === selectedWeightId) ?? null,
    [product.weights, selectedWeightId],
  );
  const isSoldOut = product.stock <= 0;
  const isCodRestricted =
    !!replacementTargetId && originalPaymentMethod === "COD" && !product.cod;

  const displayImage =
    product.images.find((i) => i.id === activeImageId)?.url ??
    product.mainImageUrl ??
    FALLBACK_IMAGE;

  const maxQuantity = useMemo(() => {
    if (!selectedWeight || selectedWeight.weight <= 0) return 0;
    let consumption = selectedWeight.weight;
    if (product.type === "UNIT") {
      const nameVal = parseInt(selectedWeight.name ?? "0", 10);
      if (!isNaN(nameVal) && nameVal > 1) consumption = nameVal;
    }
    return Math.max(0, Math.floor(product.stock / consumption));
  }, [product, selectedWeight]);

  useEffect(() => {
    setQuantity((q) => (maxQuantity > 0 ? Math.min(q, maxQuantity) : 1));
  }, [maxQuantity]);

  const totalPrice =
    selectedWeight && maxQuantity > 0
      ? selectedWeight.price * quantity
      : undefined;
  const unitPriceLabel = selectedWeight
    ? formatPrice(selectedWeight.price)
    : "สอบถามราคา";
  const basePriceLabel =
    selectedWeight && selectedWeight.basePrice > selectedWeight.price
      ? formatPrice(selectedWeight.basePrice)
      : null;
  const discountPercent = selectedWeight
    ? Math.round(
        calculateDiscountPercent(
          Number(selectedWeight.basePrice),
          Number(selectedWeight.price),
        ),
      )
    : 0;

  // --- Handlers ---
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setSlipImage(reader.result as string);
        reader.readAsDataURL(file);
      }
    },
    [],
  );

  const handleReplaceItem = useCallback(() => {
    if (isCodRestricted) {
      toast.error("ออเดอร์เดิมชำระปลายทาง สินค้าใหม่ต้องรองรับปลายทางด้วยครับ");
      return;
    }
    startTransition(async () => {
      const result: any = await replaceOrderItemAction({
        orderItemId: replacementTargetId!,
        newProductId: product.id,
        newWeightId: selectedWeight!.id,
        quantity,
      });
      if (result.requireRefund) {
        setRefundAmount(result.refundAmount);
        setIsRefundMode(true);
        setPaymentModalOpen(true);
      } else if (result.requirePayment) {
        setExtraAmount(result.extraAmount);
        setQrCodeUrl(result.qrCode);
        setIsRefundMode(false);
        setPaymentModalOpen(true);
      } else if (result.success) {
        router.refresh();
        toast.success("เปลี่ยนสินค้าสำเร็จ");
        router.push("/orders");
      } else toast.error(result.message);
    });
  }, [
    isCodRestricted,
    replacementTargetId,
    product.id,
    selectedWeight,
    quantity,
    router,
  ]);

  const handleConfirmPayment = useCallback(() => {
    if (!slipImage) {
      toast.error("กรุณาแนบหลักฐาน");
      return;
    }
    startTransition(async () => {
      const result: any = await replaceOrderItemAction({
        orderItemId: replacementTargetId!,
        newProductId: product.id,
        newWeightId: selectedWeight!.id,
        quantity,
        slipImage,
      });
      if (result.success) {
        setPaymentModalOpen(false);
        toast.success("บันทึกข้อมูลเรียบร้อย");
        router.push("/orders");
      } else toast.error(result.message);
    });
  }, [
    slipImage,
    replacementTargetId,
    product.id,
    selectedWeight,
    quantity,
    router,
  ]);

  const handleConfirmRefund = useCallback(() => {
    startTransition(async () => {
      const result: any = await replaceOrderItemAction({
        orderItemId: replacementTargetId!,
        newProductId: product.id,
        newWeightId: selectedWeight!.id,
        quantity,
        refundDetails: {
          bank: refundBank,
          name: refundAccountName,
          number: refundAccountNo,
        },
      });
      if (result.success) {
        setPaymentModalOpen(false);
        toast.success(result.message);
        router.push("/orders");
      } else toast.error(result.message);
    });
  }, [
    replacementTargetId,
    product.id,
    selectedWeight,
    quantity,
    refundBank,
    refundAccountName,
    refundAccountNo,
    router,
  ]);

  const handleAddToCart = useCallback(() => {
    if (!isAuthenticated || !userId) {
      router.push(`/sign-in?redirect=/products/${product.id}`);
      return;
    }
    startTransition(async () => {
      const result = await addCartItemAction({
        productId: product.id,
        weightId: selectedWeight!.id,
        quantity,
      });
      if (result.success && result.cart) {
        syncFromServer(userId, result.cart);
        toast.success("เพิ่มสินค้าในตะกร้าแล้ว");
      } else toast.error(result.message);
    });
  }, [
    isAuthenticated,
    userId,
    product.id,
    selectedWeight,
    quantity,
    syncFromServer,
    router,
  ]);

  const handleBuyNow = useCallback(() => {
    if (!isAuthenticated || !userId) {
      router.push(`/sign-in?redirect=/products/${product.id}`);
      return;
    }
    startTransition(async () => {
      const result = await addCartItemAction({
        productId: product.id,
        weightId: selectedWeight!.id,
        quantity,
      });
      if (result.success && result.cart) {
        syncFromServer(userId, result.cart);
        const ids = result.cart.map((i: any) => i.id).join(",");
        router.push(
          defaultAddressId
            ? `/checkout/payment?items=${ids}&address=${defaultAddressId}`
            : `/checkout?items=${ids}`,
        );
      }
    });
  }, [
    isAuthenticated,
    userId,
    product.id,
    selectedWeight,
    quantity,
    syncFromServer,
    defaultAddressId,
    router,
  ]);

  // ✅ แยกฟังก์ชันเพิ่มลดจำนวนออกมาหุ้มด้วย useCallback
  const incrementQuantity = useCallback(() => {
    setQuantity((q) => q + 1);
  }, []);

  const decrementQuantity = useCallback(() => {
    setQuantity((q) => Math.max(1, q - 1));
  }, []);

  const disableCartButton =
    !selectedWeight ||
    isSoldOut ||
    maxQuantity <= 0 ||
    quantity > maxQuantity ||
    isPending;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr] md:px-0 px-[15px]">
      <ImageGallery
        images={product.images}
        title={product.title}
        activeImageId={activeImageId}
        setActiveImageId={setActiveImageId}
        displayImage={displayImage}
        isSoldOut={isSoldOut}
      />

      <div className="space-y-6 md:px-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
            {product.categoryName && (
              <Badge
                variant="outline"
                className="border-primary/20 bg-primary/10 text-primary"
              >
                {product.categoryName}
              </Badge>
            )}
            <Badge
              variant="outline"
              className={cn(
                "border-border/60 bg-background",
                isSoldOut
                  ? "border-destructive/60 bg-destructive/10 text-destructive"
                  : "border-emerald-400/60 bg-emerald-50 text-emerald-600",
              )}
            >
              {isSoldOut ? "สินค้าหมด" : "พร้อมส่ง"}
            </Badge>
            {product.cod ? (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-black/70 text-white"
              >
                <Truck className="size-3.5" />
                เก็บเงินปลายทาง
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="flex items-center gap-1 border-red-200 bg-red-50 text-red-600"
              >
                <Ban className="size-3.5" />
                ไม่มีเก็บปลายทาง
              </Badge>
            )}
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {product.title}
          </h1>

          <div className="flex items-end justify-between gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xl font-bold md:text-2xl leading-none">
                <div className="text-2xl">{unitPriceLabel}</div>
                {discountPercent > 0 && (
                  <Badge
                    variant="destructive"
                    className="rounded-full px-2 py-0 text-[10px] h-4 flex items-center justify-center"
                  >
                    ลด {discountPercent}%
                  </Badge>
                )}
              </div>
              {basePriceLabel && (
                <span className="text-1xl text-muted-foreground line-through leading-none">
                  {basePriceLabel}
                </span>
              )}
            </div>

            <div className="hidden md:flex flex-col gap-1 w-[160px] shrink-0">
              <span className="text-[11px] font-medium text-muted-foreground">
                {product.type === "UNIT" ? "เลือกตัวเลือก" : "เลือกน้ำหนัก"}
              </span>
              <Select
                value={selectedWeightId ?? undefined}
                onValueChange={setSelectedWeightId}
              >
                <SelectTrigger className="w-full !h-[45px] rounded-xl border-border/60 bg-background">
                  <SelectValue placeholder="เลือก..." />
                </SelectTrigger>
                <SelectContent className="w-[var(--radix-select-trigger-width)]">
                  {preparedWeightOptions.map((opt) => (
                    <SelectItem
                      key={opt.id}
                      value={opt.id}
                      className="py-2 focus:bg-emerald-50"
                    >
                      <div className="flex flex-col text-xs">
                        <div className="flex items-center justify-start gap-2">
                          <span className="font-semibold text-foreground whitespace-nowrap">
                            {opt.displayName}
                          </span>
                          {opt.hasDiscount && (
                            <span className="font-bold text-destructive shrink-0">
                              ลด {opt.discount}%
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-start gap-2 opacity-70">
                          <span className="whitespace-nowrap">
                            {opt.priceLabel}
                          </span>
                          {opt.showBasePrice && (
                            <span className="line-through text-[10px]">
                              {opt.basePriceLabel}
                            </span>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="hidden md:block" />

          {/* Quantity UI Desktop */}
          <div className="hidden md:block space-y-4">
            <div className="mt-4 grid grid-cols-[1fr_auto] items-start gap-4">
              <div className="min-w-0 flex w-fit items-center gap-1 rounded-full border border-border/60 bg-background px-3 py-1.5 font-medium text-foreground responsive-text-size overflow-hidden">
                <Package className="size-4 text-primary shrink-0" />
                <div className="truncate flex items-center gap-1">
                  <span className="whitespace-nowrap">
                    สต็อก {product.stock.toLocaleString()}
                  </span>
                  {selectedWeight && (
                    <span className="text-muted-foreground truncate border-l border-border/60 pl-2 ml-1">
                      เลือก{" "}
                      {product.type === "UNIT"
                        ? selectedWeight.name
                        : selectedWeight.weight.toLocaleString()}{" "}
                      {product.unitLabel}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex w-fit flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decrementQuantity} // ✅ ใช้ useCallback
                    disabled={quantity <= 1 || isSoldOut || maxQuantity <= 0}
                    className="h-7 w-7 shrink-0 rounded-md"
                  >
                    <Minus className="size-4" />
                  </Button>
                  <Input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="h-7 w-10 text-center text-sm p-0"
                    disabled={isSoldOut || maxQuantity <= 0}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity} // ✅ ใช้ useCallback
                    disabled={
                      isSoldOut || maxQuantity <= 0 || quantity >= maxQuantity
                    }
                    className="h-7 w-7 shrink-0 rounded-md"
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
                {selectedWeight && maxQuantity > 0 && (
                  <span className="text-[10px] text-muted-foreground text-right w-full break-words leading-tight">
                    สั่งได้สูงสุด {maxQuantity.toLocaleString()} ชิ้น (
                    {(selectedWeight.weight * maxQuantity).toLocaleString()}{" "}
                    ชิ้น)
                  </span>
                )}
              </div>
            </div>

            {/* Summary Box */}
            <div className="hidden md:block space-y-3 rounded-2xl border border-border/60 bg-muted/40 px-5 py-4">
              <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/50 p-5 backdrop-blur-sm">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-emerald-500/5 blur-2xl" />
                <div className="mb-4 relative pt-3">
                  <p className="absolute top-0 left-0 text-[8px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                    Product Detail
                  </p>
                  <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-medium text-foreground truncate mt-0.5">
                        {product.title}
                      </h3>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <div className="detail-box-responsive rounded-md bg-background/40 border border-border/30 px-2 flex flex-col items-center">
                        <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                          {product.type === "UNIT" ? "ตัวเลือก" : "ขนาด"}
                        </span>
                        <span className="text-[10px] font-medium text-foreground text-center leading-tight mt-0.5 whitespace-nowrap">
                          {selectedWeight
                            ? product.type === "UNIT"
                              ? `${selectedWeight.name} ${product.unitLabel}`
                              : `${selectedWeight.weight.toLocaleString()} ${product.unitLabel}`
                            : "-"}
                        </span>
                      </div>
                      <div className="detail-box-responsive rounded-md bg-emerald-50/50 border border-emerald-100/50 px-2 flex flex-col items-center">
                        <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                          จำนวน
                        </span>
                        <span className="text-xs font-bold text-emerald-600 leading-tight mt-0.5 whitespace-nowrap">
                          x {quantity.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="my-4 border-t border-dashed border-border/60" />
                {typeof totalPrice === "number" && (
                  <div className="mt-5 flex items-end justify-between rounded-xl bg-emerald-50/50 px-4 py-3 border border-emerald-100/50">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-emerald-600/70">
                        ยอดชำระรวม
                      </span>
                      <span className="text-xs font-medium text-emerald-700 leading-none">
                        Total Price
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-emerald-600 leading-none">
                        {formatPrice(totalPrice).replace("฿", "")}
                      </span>
                      <span className="text-xs font-medium text-emerald-600/70">
                        THB
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {replacementTargetId ? (
                  <Button
                    size="lg"
                    className={cn(
                      "w-full text-white",
                      isCodRestricted
                        ? "bg-gray-400"
                        : "bg-amber-600 hover:bg-amber-700",
                    )}
                    onClick={handleReplaceItem}
                    disabled={disableCartButton}
                  >
                    {isPending ? (
                      "กำลังตรวจสอบ..."
                    ) : (
                      <>
                        <ArrowLeftRight className="mr-2 size-4" />
                        ยืนยันการเปลี่ยนสินค้า
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleAddToCart}
                    disabled={disableCartButton}
                  >
                    <ShoppingCart className="size-4 mr-2" />
                    {isSoldOut ? "สินค้าหมด" : "เพิ่มลงตะกร้า"}
                  </Button>
                )}
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/cart")}
                >
                  ไปยังหน้าตะกร้า
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="hidden md:block" />
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">รายละเอียดสินค้า</h2>
          <p className="text-sm leading-6 text-muted-foreground whitespace-pre-line">
            {product.description}
          </p>
        </div>

        <Separator className="my-6" />
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            รีวิวจากลูกค้า ({product.totalReviews || 0})
          </h3>
          {canReview ? (
            <div className="rounded-xl border border-dashed border-emerald-500/50 bg-emerald-50/50 p-6 text-center">
              <ReviewModal productId={product.id} />
            </div>
          ) : (
            <div className="rounded-lg bg-muted/10 p-4 text-center border">
              <p className="text-sm text-muted-foreground">
                ต้องสั่งซื้อสำเร็จแล้วเท่านั้นจึงจะรีวิวได้
              </p>
            </div>
          )}
        </div>
        <ReviewList reviews={product.reviews || []} />
      </div>

      <PaymentDialog
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        isRefundMode={isRefundMode}
        refundAmount={refundAmount}
        extraAmount={extraAmount}
        qrCodeUrl={qrCodeUrl}
        slipImage={slipImage}
        setSlipImage={setSlipImage}
        refundBank={refundBank}
        setRefundBank={setRefundBank}
        refundAccountNo={refundAccountNo}
        setRefundAccountNo={setRefundAccountNo}
        refundAccountName={refundAccountName}
        setRefundAccountName={setRefundAccountName}
        isPending={isPending}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        handleConfirmPayment={handleConfirmPayment}
        handleConfirmRefund={handleConfirmRefund}
      />

      <MobileActionBar
        replacementTargetId={replacementTargetId}
        isCodRestricted={isCodRestricted}
        disableCartButton={disableCartButton}
        isPending={isPending}
        isSoldOut={isSoldOut}
        handleAddToCart={handleAddToCart} // ✅ ส่งฟังก์ชันที่ล็อคแล้ว
        handleReplaceItem={handleReplaceItem} // ✅ ส่งฟังก์ชันที่ล็อคแล้ว
        unitLabel={product.unitLabel}
        productTitle={product.title}
        displayImage={displayImage}
        unitPriceLabel={unitPriceLabel}
        stock={product.stock}
        productType={product.type}
        preparedWeightOptions={preparedWeightOptions}
        selectedWeightId={selectedWeightId}
        setSelectedWeightId={setSelectedWeightId}
        quantity={quantity}
        maxQuantity={maxQuantity}
        incrementQuantity={incrementQuantity} // ✅ ส่งฟังก์ชันที่ล็อคแล้ว
        decrementQuantity={decrementQuantity} // ✅ ส่งฟังก์ชันที่ล็อคแล้ว
        basePriceLabel={basePriceLabel}
        discountPercent={discountPercent}
        totalPrice={totalPrice}
        handleBuyNow={handleBuyNow} // ✅ ส่งฟังก์ชันที่ล็อคแล้ว
      />
    </div>
  );
}
