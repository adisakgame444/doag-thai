// "use client";

// import { useEffect, useMemo, useState, useTransition } from "react";
// import Image from "next/image";
// import { Minus, Package, Plus, ShoppingCart, Truck } from "lucide-react";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Separator } from "@/components/ui/separator";
// import { formatPrice } from "@/lib/format-price";
// import { calculateDiscountPercent } from "@/lib/pricing";
// import { cn } from "@/lib/utils";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { addCartItemAction } from "@/app/(main)/(protected)/cart/actions";
// import { useCartStore } from "@/stores/cart-store";

// const FALLBACK_IMAGE = "/images/no-product-image.webp";

// interface WeightOption {
//   id: string;
//   weight: number;
//   price: number;
//   basePrice: number;
// }

// interface ProductImageInfo {
//   id: string;
//   url: string;
//   isMain: boolean;
// }

// export interface ProductDetailPayload {
//   id: string;
//   title: string;
//   description: string;
//   cod: boolean;
//   stock: number;
//   lowStock: number;
//   categoryName: string | null;
//   mainImageUrl: string;
//   images: ProductImageInfo[];
//   weights: WeightOption[];
// }

// interface StockBadgeConfig {
//   label: string;
//   className: string;
// }

// const getStockBadge = (stock: number, lowStock: number): StockBadgeConfig => {
//   if (stock <= 0) {
//     return {
//       label: "สินค้าหมด",
//       className: "border-destructive/60 bg-destructive/10 text-destructive",
//     };
//   }

//   if (stock <= Math.max(lowStock, 0)) {
//     return {
//       label: "ใกล้หมด",
//       className:
//         "border-amber-400/60 bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
//     };
//   }

//   return {
//     label: "พร้อมส่ง",
//     className:
//       "border-emerald-400/60 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
//   };
// };

// export default function ProductDetail({
//   product,
//   userId,
//   isAuthenticated,
// }: {
//   product: ProductDetailPayload;
//   userId: string | null;
//   isAuthenticated: boolean;
// }) {
//   const [activeImageId, setActiveImageId] = useState<string | null>(
//     product.images[0]?.id ?? null
//   );
//   const [selectedWeightId, setSelectedWeightId] = useState<string | null>(
//     product.weights[0]?.id ?? null
//   );
//   const [quantity, setQuantity] = useState<number>(1);
//   const [isPending, startTransition] = useTransition();
//   const syncFromServer = useCartStore((state) => state.syncFromServer);
//   const router = useRouter();

//   const isSoldOut = product.stock <= 0;
//   const stockBadge = getStockBadge(product.stock, product.lowStock);

//   const activeImage = useMemo(
//     () => product.images.find((image) => image.id === activeImageId) ?? null,
//     [activeImageId, product.images]
//   );

//   const displayImage =
//     activeImage?.url ?? product.mainImageUrl ?? FALLBACK_IMAGE;

//   const selectedWeight = useMemo(
//     () =>
//       product.weights.find((weight) => weight.id === selectedWeightId) ?? null,
//     [product.weights, selectedWeightId]
//   );

//   const hasPrice = Boolean(
//     selectedWeight && Number.isFinite(selectedWeight.price)
//   );

//   const unitPriceLabel =
//     selectedWeight && hasPrice
//       ? formatPrice(selectedWeight.price)
//       : "สอบถามราคา";

//   const basePriceLabel =
//     selectedWeight &&
//     hasPrice &&
//     selectedWeight.basePrice > selectedWeight.price
//       ? formatPrice(selectedWeight.basePrice)
//       : null;

//   const discountPercent = selectedWeight
//     ? Math.round(
//         calculateDiscountPercent(
//           Number(selectedWeight.basePrice ?? 0),
//           Number(selectedWeight.price ?? 0)
//         )
//       )
//     : 0;

//   const maxQuantity = useMemo(() => {
//     if (!selectedWeight || selectedWeight.weight <= 0) return 0;
//     const availableUnits = Math.floor(product.stock / selectedWeight.weight);
//     return Math.max(0, availableUnits);
//   }, [product.stock, selectedWeight]);

//   useEffect(() => {
//     if (maxQuantity > 0) {
//       setQuantity((current) => Math.min(current, maxQuantity));
//     } else {
//       setQuantity(1);
//     }
//   }, [maxQuantity]);

//   const totalPrice =
//     selectedWeight && hasPrice && maxQuantity > 0
//       ? selectedWeight.price * quantity
//       : undefined;

//   const handleQuantityChange = (value: number) => {
//     if (Number.isNaN(value)) return;
//     const upperBound = maxQuantity > 0 ? maxQuantity : 1;
//     const normalized = Math.min(upperBound, Math.max(1, value));
//     setQuantity(normalized);
//   };

//   const decrementQuantity = () => {
//     handleQuantityChange(quantity - 1);
//   };

//   const incrementQuantity = () => {
//     handleQuantityChange(quantity + 1);
//   };

//   const handleAddToCart = () => {
//     if (
//       !selectedWeight ||
//       !hasPrice ||
//       isSoldOut ||
//       maxQuantity <= 0 ||
//       quantity > maxQuantity
//     )
//       return;

//     if (!isAuthenticated || !userId) {
//       toast.error("กรุณาเข้าสู่ระบบเพื่อเพิ่มสินค้าในตะกร้า");
//       router.push(`/sign-in?redirect=/products/${product.id}`);
//       return;
//     }

//     startTransition(async () => {
//       const result = await addCartItemAction({
//         productId: product.id,
//         weightId: selectedWeight.id,
//         quantity,
//       });

//       if (!result.success || !result.cart) {
//         toast.error(result.message ?? "ไม่สามารถเพิ่มสินค้าได้");
//         return;
//       }

//       syncFromServer(userId, result.cart);
//       setQuantity(1);
//       toast.success("เพิ่มสินค้าในตะกร้าแล้ว");
//     });
//   };

//   const disableCartButton =
//     !selectedWeight ||
//     !hasPrice ||
//     isSoldOut ||
//     maxQuantity <= 0 ||
//     quantity > maxQuantity ||
//     isPending;

//   return (
//     <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] md:px-0 px-[15px]">
//       <div className="space-y-4">
//         <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted">
//           <Image
//             src={displayImage}
//             alt={product.title}
//             fill
//             className="object-cover"
//             sizes="(min-width: 1280px) 520px, (min-width: 1024px) 460px, (min-width: 768px) 60vw, 100vw"
//             priority
//           />

//           {isSoldOut && (
//             <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70 backdrop-blur-sm">
//               <span className="rounded-full bg-black/80 px-4 py-1.5 text-sm font-semibold uppercase tracking-wider text-white">
//                 สินค้าหมด
//               </span>
//             </div>
//           )}
//         </div>

//         {product.images.length > 1 && (
//           <div className="flex gap-3 overflow-x-auto pb-1">
//             {product.images.map((image) => {
//               const isActive = image.id === activeImageId;

//               return (
//                 <button
//                   key={image.id}
//                   type="button"
//                   onClick={() => setActiveImageId(image.id)}
//                   className={cn(
//                     "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
//                     isActive
//                       ? "border-primary ring-2 ring-primary/30"
//                       : "border-border/60 hover:border-primary/40"
//                   )}
//                   aria-label="เลือกภาพสินค้า"
//                 >
//                   <Image
//                     src={image.url}
//                     alt={product.title}
//                     fill
//                     className="object-cover"
//                     sizes="80px"
//                   />
//                 </button>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       <div className="space-y-6">
//         <div className="space-y-4">
//           <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
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
//                 stockBadge.className
//               )}
//             >
//               {stockBadge.label}
//             </Badge>

//             {product.cod && (
//               <Badge
//                 variant="secondary"
//                 className="flex items-center gap-1 bg-black/70 text-white"
//               >
//                 <Truck className="size-3.5" />
//                 เก็บเงินปลายทาง
//               </Badge>
//             )}
//           </div>

//           <div className="space-y-2">
//             <h1 className="text-3xl font-semibold tracking-tight text-foreground">
//               {product.title}
//             </h1>
//             <div className="flex flex-col gap-1 text-sm text-muted-foreground md:text-base">
//               <div className="flex items-center gap-2 text-lg font-semibold text-foreground md:text-2xl">
//                 {unitPriceLabel}
//                 {discountPercent > 0 && (
//                   <Badge
//                     variant="destructive"
//                     className="rounded-full px-3 py-1 text-xs"
//                   >
//                     -{discountPercent}%
//                   </Badge>
//                 )}
//               </div>
//               {basePriceLabel && (
//                 <span className="text-sm text-muted-foreground line-through">
//                   {basePriceLabel}
//                 </span>
//               )}
//             </div>
//           </div>

//           <Separator />

//           <div className="space-y-3">
//             <div className="flex flex-col gap-1">
//               <span className="text-sm font-medium text-muted-foreground">
//                 เลือกน้ำหนัก
//               </span>
//               {!selectedWeight && (
//                 <span className="text-xs text-destructive">
//                   ยังไม่มีตัวเลือกน้ำหนักสำหรับสินค้านี้
//                 </span>
//               )}
//             </div>

//             {product.weights.length > 0 ? (
//               <div className="grid gap-2 sm:grid-cols-2">
//                 {product.weights.map((weight) => {
//                   const isActive = selectedWeight?.id === weight.id;
//                   const weightPriceLabel = formatPrice(weight.price);
//                   const weightDiscount = Math.round(
//                     calculateDiscountPercent(weight.basePrice, weight.price)
//                   );

//                   return (
//                     <button
//                       key={weight.id}
//                       type="button"
//                       onClick={() => setSelectedWeightId(weight.id)}
//                       className={cn(
//                         "flex h-full flex-col gap-1 rounded-xl border border-border/60 bg-background px-4 py-3 text-left transition-all hover:border-primary/50 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
//                         isActive &&
//                           "border-primary bg-primary/10 shadow-sm ring-2 ring-primary/30"
//                       )}
//                       aria-pressed={isActive}
//                     >
//                       <span className="text-sm font-semibold text-foreground">
//                         {weight.weight.toLocaleString()} กรัม
//                       </span>
//                       <span className="text-sm font-medium text-foreground">
//                         {weightPriceLabel}
//                       </span>
//                       {weight.basePrice > weight.price && (
//                         <span className="text-xs text-muted-foreground line-through">
//                           {formatPrice(weight.basePrice)}
//                         </span>
//                       )}
//                       {weightDiscount > 0 && (
//                         <span className="text-xs font-semibold text-destructive">
//                           -{weightDiscount}%
//                         </span>
//                       )}
//                     </button>
//                   );
//                 })}
//               </div>
//             ) : (
//               <p className="rounded-md border border-dashed border-border/60 bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
//                 ผู้ดูแลยังไม่ได้กำหนดน้ำหนักสำหรับสินค้านี้
//               </p>
//             )}
//           </div>

//           <Separator />

//           <div className="space-y-4">
//             <div className="flex flex-wrap items-center gap-3">
//               <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 text-sm font-medium text-foreground">
//                 <Package className="size-4 text-primary" />
//                 สต็อก {product.stock.toLocaleString()} กรัม
//               </div>

//               {selectedWeight && (
//                 <div className="text-sm text-muted-foreground">
//                   เลือก {selectedWeight.weight.toLocaleString()} กรัม
//                 </div>
//               )}
//             </div>

//             <div className="space-y-2">
//               <span className="text-sm font-medium text-muted-foreground">
//                 จำนวน
//               </span>
//               <div className="flex w-full max-w-xs items-center gap-2">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="icon"
//                   onClick={decrementQuantity}
//                   disabled={quantity <= 1 || isSoldOut || maxQuantity <= 0}
//                 >
//                   <Minus className="size-4" />
//                 </Button>

//                 <Input
//                   type="number"
//                   min={1}
//                   max={maxQuantity > 0 ? maxQuantity : undefined}
//                   value={quantity}
//                   onChange={(event) =>
//                     handleQuantityChange(Number(event.target.value))
//                   }
//                   className="h-10 text-center text-base"
//                   disabled={isSoldOut || maxQuantity <= 0}
//                 />

//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="icon"
//                   onClick={incrementQuantity}
//                   disabled={
//                     isSoldOut || maxQuantity <= 0 || quantity >= maxQuantity
//                   }
//                 >
//                   <Plus className="size-4" />
//                 </Button>
//               </div>
//               {selectedWeight && maxQuantity > 0 && (
//                 <span className="text-xs text-muted-foreground">
//                   สั่งได้สูงสุด {maxQuantity.toLocaleString()} ชิ้น (รวม{" "}
//                   {(selectedWeight.weight * maxQuantity).toLocaleString()} กรัม)
//                 </span>
//               )}
//               {selectedWeight && maxQuantity === 0 && (
//                 <span className="text-xs text-destructive">
//                   สต็อกไม่พอสำหรับน้ำหนัก{" "}
//                   {selectedWeight.weight.toLocaleString()} กรัม
//                 </span>
//               )}
//             </div>
//           </div>

//           <div className="space-y-3 rounded-2xl border border-border/60 bg-muted/40 px-5 py-4">
//             <div className="flex flex-col gap-1 text-sm text-muted-foreground">
//               <span>ข้อมูลเพื่อเตรียมเพิ่มลงตะกร้า</span>
//               <span>สินค้า: {product.title}</span>
//               <span>
//                 น้ำหนักที่เลือก:{" "}
//                 {selectedWeight
//                   ? `${selectedWeight.weight.toLocaleString()} กรัม`
//                   : "ยังไม่ได้เลือก"}
//               </span>
//               <span>จำนวน: {quantity.toLocaleString()} ชิ้น</span>
//               {typeof totalPrice === "number" && (
//                 <span className="text-base font-semibold text-foreground">
//                   ราคารวม {formatPrice(totalPrice)}
//                 </span>
//               )}
//             </div>

//             <Button
//               size="lg"
//               className="w-full md:w-auto"
//               onClick={handleAddToCart}
//               disabled={disableCartButton}
//               aria-busy={isPending}
//             >
//               <ShoppingCart className="size-4" />
//               {isSoldOut ? "สินค้าหมด" : "เพิ่มลงตะกร้า"}
//             </Button>
//           </div>
//         </div>

//         <Separator />

//         <div className="space-y-3">
//           <h2 className="text-lg font-semibold text-foreground">
//             รายละเอียดสินค้า
//           </h2>
//           <p className="text-sm leading-6 text-muted-foreground whitespace-pre-line">
//             {product.description}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import {
  Package,
  Ban,
  Plus,
  ShoppingCart,
  Truck,
  Upload,
  X,
  Minus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format-price";
import { calculateDiscountPercent } from "@/lib/pricing";
import { ReviewModal } from "@/components/product/review-modal";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addCartItemAction } from "@/app/(main)/(protected)/cart/actions";
import { useCartStore } from "@/stores/cart-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReviewList } from "@/components/product/review-list";
import { ArrowLeftRight } from "lucide-react"; // ✅ เพิ่ม icon
import { replaceOrderItemAction } from "@/app/(main)/(protected)/cart/actions";
// ✅ Import Component สำหรับ Modal
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const FALLBACK_IMAGE = "/images/no-product-image.webp";

interface WeightOption {
  id: string;
  weight: number;
  price: number;
  basePrice: number;
  name: string | null; // ✅ เพิ่มช่องเก็บชื่อตัวเลือก (เช่น สีแดง, ขวดเล็ก)
}

interface ProductImageInfo {
  id: string;
  url: string;
  isMain: boolean;
}

export interface ReviewItem {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
}

export interface ProductDetailPayload {
  id: string;
  title: string;
  description: string;
  cod: boolean;
  stock: number;
  lowStock: number;
  categoryName: string | null;
  mainImageUrl: string;
  images: ProductImageInfo[];
  weights: WeightOption[];
  type: "WEIGHT" | "UNIT"; // ✅ รับประเภทสินค้า
  unitLabel: string; // ✅ รับชื่อหน่วย (กรัม/ชิ้น/ขวด)
  averageRating?: number;
  totalReviews?: number;
  reviews: ReviewItem[];
}

interface StockBadgeConfig {
  label: string;
  className: string;
}

const getStockBadge = (stock: number, lowStock: number): StockBadgeConfig => {
  if (stock <= 0) {
    return {
      label: "สินค้าหมด",
      className: "border-destructive/60 bg-destructive/10 text-destructive",
    };
  }

  if (stock <= Math.max(lowStock, 0)) {
    return {
      label: "ใกล้หมด",
      className:
        "border-amber-400/60 bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
    };
  }

  return {
    label: "พร้อมส่ง",
    className:
      "border-emerald-400/60 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
  };
};

export default function ProductDetail({
  product,
  userId,
  isAuthenticated,
  canReview,
  replacementTargetId, // ✅ รับค่าจาก parent component
  originalPaymentMethod, // ✅ 1. รับค่า
}: {
  product: ProductDetailPayload;
  userId: string | null;
  isAuthenticated: boolean;
  canReview: boolean; // <-- ตัวแปรสำคัญ
  replacementTargetId?: string;
  originalPaymentMethod?: string | null;
}) {
  const [activeImageId, setActiveImageId] = useState<string | null>(
    product.images[0]?.id ?? null,
  );
  const [selectedWeightId, setSelectedWeightId] = useState<string | null>(
    () => {
      if (!product.weights || product.weights.length === 0) return null;

      const sortedWeights = [...product.weights].sort((a, b) => {
        if (product.type === "UNIT") {
          const valA = parseInt(a.name ?? "0", 10);
          const valB = parseInt(b.name ?? "0", 10);
          if (valA !== valB) return valA - valB;
        }
        return a.weight - b.weight;
      });

      return sortedWeights[0]?.id ?? null;
    },
  );

  // ✅ 2. เช็คเงื่อนไข COD ที่หน้าจอ
  // เป็นจริงเมื่อ: (เป็นการเปลี่ยนของ) AND (ออเดอร์เดิมเป็น COD) AND (สินค้าใหม่ไม่มี COD)
  // const isCodRestricted =
  //   !!replacementTargetId && originalPaymentMethod === "COD" && !product.cod;

  // // ✅ ฟังก์ชันกดเปลี่ยนสินค้า
  // const handleReplaceItem = () => {
  //   // ⛔ ดักไว้ก่อนเลย ถ้าผิดเงื่อนไข ให้แจ้งเตือนและจบการทำงาน
  //   if (isCodRestricted) {
  //     toast.error(
  //       "ขออภัย ออเดอร์เดิมชำระปลายทาง สินค้าใหม่ต้องรองรับปลายทางด้วยครับ"
  //     );
  //     return;
  //   }

  //   if (!selectedWeight || !replacementTargetId) return;

  //   startTransition(async () => {
  //     const result = await replaceOrderItemAction({
  //       orderItemId: replacementTargetId,
  //       newProductId: product.id,
  //       newWeightId: selectedWeight.id,
  //       quantity: quantity,
  //     });

  //     if (result.success) {
  //       toast.success("เปลี่ยนสินค้าสำเร็จแล้ว");
  //       router.push("/orders"); // เด้งกลับหน้า Order
  //     } else {
  //       toast.error(result.message);
  //     }
  //   });
  // };

  const [quantity, setQuantity] = useState<number>(1);
  const [isPending, startTransition] = useTransition();
  const syncFromServer = useCartStore((state) => state.syncFromServer);
  const router = useRouter();

  const [isRefundMode, setIsRefundMode] = useState(false); // เช็คว่าเป็นโหมดคืนเงินไหม
  const [refundAmount, setRefundAmount] = useState(0);
  const [refundBank, setRefundBank] = useState("PROMPTPAY");
  const [refundAccountNo, setRefundAccountNo] = useState("");
  const [refundAccountName, setRefundAccountName] = useState("");

  // ----------------------------------------------------------------------
  // ✅✅ ส่วนที่เพิ่มใหม่: State สำหรับ Modal จ่ายเงิน ✅✅
  // ----------------------------------------------------------------------
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [extraAmount, setExtraAmount] = useState(0);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [slipImage, setSlipImage] = useState<string | null>(null); // Base64
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ ฟังก์ชันแปลงไฟล์เป็น Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("ไฟล์ขนาดใหญ่เกินไป (สูงสุด 5MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ เช็คเงื่อนไข COD ที่หน้าจอ
  const isCodRestricted =
    !!replacementTargetId && originalPaymentMethod === "COD" && !product.cod;

  // ----------------------------------------------------------------------
  // ✅✅ Logic 1: กดปุ่ม "ยืนยันการเปลี่ยนสินค้า" (เช็คราคา) ✅✅
  // ----------------------------------------------------------------------
  const handleReplaceItem = () => {
    if (isCodRestricted) {
      toast.error(
        "ขออภัย ออเดอร์เดิมชำระปลายทาง สินค้าใหม่ต้องรองรับปลายทางด้วยครับ",
      );
      return;
    }

    if (!selectedWeight || !replacementTargetId) return;

    startTransition(async () => {
      // เรียก Server Action (รอบแรก: ยังไม่ส่งสลิป)
      const result: any = await replaceOrderItemAction({
        orderItemId: replacementTargetId,
        newProductId: product.id,
        newWeightId: selectedWeight.id,
        quantity: quantity,
        // slipImage: ยังไม่มี
      });

      // 🟢 Case คืนเงิน
      // if (result.requireRefund) {
      //   setRefundAmount(result.refundAmount);
      //   setIsRefundMode(true); // เปิดโหมดคืนเงิน
      //   setPaymentModalOpen(true); // เปิด Modal
      //   setQrCodeUrl(""); // เคลียร์ QR เดิม
      //   return;
      // }

      if (result.requireRefund) {
        // ✅ 1. ล้างค่าฝั่ง "จ่ายเงิน" ทิ้งให้หมด (กัน Dialog เพี้ยน)
        setExtraAmount(0);
        setQrCodeUrl("");
        setSlipImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";

        // ✅ 2. ตั้งค่าฝั่ง "คืนเงิน"
        setRefundAmount(result.refundAmount);
        setIsRefundMode(true); // 🔥 สำคัญ: บอกว่านี่คือโหมดคืนเงิน
        setPaymentModalOpen(true); // เปิด Modal
        return;
      }

      // 🟡 กรณี 1: ต้องจ่ายเพิ่ม -> Server ส่ง requirePayment: true กลับมา
      // if (result.requirePayment) {
      //   setExtraAmount(result.extraAmount);
      //   setQrCodeUrl(result.qrCode);
      //   setPaymentModalOpen(true); // 🔥 เปิด Modal
      //   toast.info("สินค้ามีราคาเพิ่มขึ้น กรุณาชำระส่วนต่าง");
      //   return;
      // }
      if (result.requirePayment) {
        // ✅ 1. ล้างค่าฝั่ง "คืนเงิน" ทิ้งให้หมด
        setRefundAmount(0);
        setRefundAccountNo("");
        setRefundAccountName("");
        setRefundBank("PROMPTPAY");

        // ✅ 2. ตั้งค่าฝั่ง "จ่ายเงิน"
        setExtraAmount(result.extraAmount);
        setQrCodeUrl(result.qrCode);

        // ล้างรูปสลิปเก่า (เผื่อ user เคยอัปโหลดค้างไว้)
        setSlipImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";

        setIsRefundMode(false); // 🔥 สำคัญ: บังคับปิดโหมดคืนเงิน
        setPaymentModalOpen(true); // เปิด Modal

        toast.info("สินค้ามีราคาเพิ่มขึ้น กรุณาชำระส่วนต่าง");
        return;
      }

      if (result.success) {
        router.refresh();

        toast.success("เปลี่ยนสินค้าสำเร็จแล้ว");
        router.push("/orders");
      } else {
        toast.error(result.message);
      }

      // 🟢 กรณี 2: สำเร็จเลย (ราคาเท่าเดิม/ถูกลง หรือเป็น COD)
      if (result.success) {
        // ✅ จุดสำคัญ: สะกิดให้ Banner และ UI ทั้งหมดอัปเดตข้อมูลใหม่ทันที
        // วิธีนี้จะทำให้ Banner สีแดงหายวับไปทันทีหลังกดปุ่มสำเร็จ
        router.refresh();
        toast.success("เปลี่ยนสินค้าสำเร็จแล้ว");
        router.push("/orders");
      } else {
        toast.error(result.message);
      }
    });
  };

  // ----------------------------------------------------------------------
  // ✅✅ Logic 2: กดปุ่ม "ยืนยันการโอนเงิน" ใน Modal (ส่งสลิป) ✅✅
  // ----------------------------------------------------------------------
  const handleConfirmPayment = () => {
    if (!slipImage) {
      toast.error("กรุณาแนบหลักฐานการโอนเงิน");
      return;
    }
    if (!selectedWeight || !replacementTargetId) return;

    startTransition(async () => {
      // เรียก Server Action รอบสอง (ส่งสลิป Base64 ไปด้วย)
      const result: any = await replaceOrderItemAction({
        orderItemId: replacementTargetId,
        newProductId: product.id,
        newWeightId: selectedWeight.id,
        quantity: quantity,
        slipImage: slipImage, // 👈 ส่งรูปไป
      });

      if (result.success) {
        setPaymentModalOpen(false); // ปิด Modal
        toast.success("บันทึกข้อมูลเรียบร้อย รอเจ้าหน้าที่ตรวจสอบ");
        router.push("/orders");
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleConfirmRefund = () => {
    // Validation หน้าบ้านอีกรอบ
    if (!refundAccountNo.match(/^[0-9]+$/)) {
      toast.error("เลขบัญชีต้องเป็นตัวเลขเท่านั้น");
      return;
    }
    if (!refundAccountName.trim()) {
      toast.error("กรุณากรอกชื่อบัญชี");
      return;
    }

    startTransition(async () => {
      const result: any = await replaceOrderItemAction({
        orderItemId: replacementTargetId!,
        newProductId: product.id,
        newWeightId: selectedWeight!.id,
        quantity: quantity,
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
      } else {
        toast.error(result.message);
      }
    });
  };

  // ✅ เพิ่มตรงนี้: คำนวณราคาและส่วนลดเตรียมไว้แค่ครั้งเดียว
  // มันจะไม่คำนวณใหม่ตอนกดเปิด Dropdown ทำให้เปิดลื่นขึ้นมาก
  // const preparedWeightOptions = useMemo(() => {
  //   return product.weights.map((weight) => {
  //     const discount = Math.round(
  //       calculateDiscountPercent(
  //         Number(weight.basePrice),
  //         Number(weight.price),
  //       ),
  //     );

  //     return {
  //       ...weight, // เก็บค่าเดิมไว้ (id, weight, name ฯลฯ)
  //       priceLabel: formatPrice(weight.price),
  //       basePriceLabel: formatPrice(weight.basePrice),
  //       discount: discount,
  //       hasDiscount: discount > 0,
  //       showBasePrice: weight.basePrice > weight.price,
  //       displayName:
  //         product.type === "UNIT"
  //           ? `${weight.name} ${product.unitLabel}`
  //           : `${weight.weight.toLocaleString()} ${product.unitLabel}`,
  //     };
  //   });
  // }, [product.weights, product.type, product.unitLabel]); // dependencies

  const preparedWeightOptions = useMemo(() => {
    return (
      product.weights
        .map((weight) => {
          const discount = Math.round(
            calculateDiscountPercent(
              Number(weight.basePrice),
              Number(weight.price),
            ),
          );

          return {
            ...weight,
            priceLabel: formatPrice(weight.price),
            basePriceLabel: formatPrice(weight.basePrice),
            discount: discount,
            hasDiscount: discount > 0,
            showBasePrice: weight.basePrice > weight.price,
            displayName:
              product.type === "UNIT"
                ? `${weight.name} ${product.unitLabel}`
                : `${weight.weight.toLocaleString()} ${product.unitLabel}`,
          };
        })
        // ✅✅ แก้ตรงนี้ครับ: Logic การเรียงลำดับใหม่ ✅✅
        .sort((a, b) => {
          // กรณี 1: ถ้าเป็นสินค้าแบบ "ชิ้น/ขวด" (UNIT) ให้แกะเลขจากชื่อมาเรียง
          if (product.type === "UNIT") {
            // แปลงชื่อ "10" ให้เป็นเลข 10 (ถ้าไม่มีชื่อให้เป็น 0)
            const valA = parseInt(a.name ?? "0", 10);
            const valB = parseInt(b.name ?? "0", 10);

            // ถ้าเลขไม่เท่ากัน ให้เรียงตามเลขเลย (น้อยไปมาก)
            if (valA !== valB) {
              return valA - valB;
            }
          }

          // กรณี 2: ถ้าเป็นสินค้า "ชั่งน้ำหนัก" (WEIGHT) หรือกรณีอื่น ให้เรียงตาม weight
          return a.weight - b.weight;
        })
    );
  }, [product.weights, product.type, product.unitLabel]);

  const isSoldOut = product.stock <= 0;
  const stockBadge = getStockBadge(product.stock, product.lowStock);

  const activeImage = useMemo(
    () => product.images.find((image) => image.id === activeImageId) ?? null,
    [activeImageId, product.images],
  );

  const displayImage =
    activeImage?.url ?? product.mainImageUrl ?? FALLBACK_IMAGE;

  const selectedWeight = useMemo(
    () =>
      product.weights.find((weight) => weight.id === selectedWeightId) ?? null,
    [product.weights, selectedWeightId],
  );

  const hasPrice = Boolean(
    selectedWeight && Number.isFinite(selectedWeight.price),
  );

  const unitPriceLabel =
    selectedWeight && hasPrice
      ? formatPrice(selectedWeight.price)
      : "สอบถามราคา";

  const basePriceLabel =
    selectedWeight &&
    hasPrice &&
    selectedWeight.basePrice > selectedWeight.price
      ? formatPrice(selectedWeight.basePrice)
      : null;

  const discountPercent = selectedWeight
    ? Math.round(
        calculateDiscountPercent(
          Number(selectedWeight.basePrice ?? 0),
          Number(selectedWeight.price ?? 0),
        ),
      )
    : 0;

  // const maxQuantity = useMemo(() => {
  //   if (!selectedWeight || selectedWeight.weight <= 0) return 0;
  //   const availableUnits = Math.floor(product.stock / selectedWeight.weight);
  //   return Math.max(0, availableUnits);
  // }, [product.stock, selectedWeight]);
  // -------------------------------------------------------------
  // 📂 ไฟล์: components/product/product-detail.tsx
  // -------------------------------------------------------------

  const maxQuantity = useMemo(() => {
    // 1. ถ้ายังไม่เลือก หรือข้อมูลผิด ให้กดไม่ได้ (0)
    if (!selectedWeight || selectedWeight.weight <= 0) return 0;

    // 2. ค่าตั้งต้น: เอาค่าจาก DB มาก่อน (ส่วนใหญ่จะเป็น 1 สำหรับขวด)
    let consumption = selectedWeight.weight;

    // -----------------------------------------------------------
    // 🛑 LOGIC พิเศษสำหรับแก้ปัญหา "ขวด/ชิ้น" (UNIT) 🛑
    // -----------------------------------------------------------
    if (product.type === "UNIT") {
      // พยายามแกะตัวเลขจากชื่อ เช่น "100 ขวด" -> ได้เลข 100
      // หรือ "Pack 50" -> ได้เลข 50
      const nameVal = parseInt(selectedWeight.name ?? "0", 10);

      // ถ้าแกะได้เลข และเลขนั้นมากกว่า 1 (แสดงว่าเป็นแพ็ค)
      // ให้ใช้เลขนี้เป็นตัวคำนวณแทนค่าจาก DB
      if (!isNaN(nameVal) && nameVal > 1) {
        consumption = nameVal;
      }
    }

    // 3. คำนวณขีดจำกัดจริง
    // กรณีขวด: สต็อก 999 / 100 (จากชื่อ) = 9.99 -> ปัดลงเหลือ "9 ชุด"
    // กรณีเดิม: สต็อก 999 / 1 (จาก DB) = 999 ชุด (อันนี้คือที่ผิด)
    const calculatedMax = Math.floor(product.stock / consumption);

    return Math.max(0, calculatedMax);
  }, [product.stock, selectedWeight, product.type]);

  useEffect(() => {
    if (maxQuantity > 0) {
      setQuantity((current) => Math.min(current, maxQuantity));
    } else {
      setQuantity(1);
    }
  }, [maxQuantity]);

  const totalPrice =
    selectedWeight && hasPrice && maxQuantity > 0
      ? selectedWeight.price * quantity
      : undefined;

  const handleQuantityChange = (value: number) => {
    if (Number.isNaN(value)) return;
    const upperBound = maxQuantity > 0 ? maxQuantity : 1;
    const normalized = Math.min(upperBound, Math.max(1, value));
    setQuantity(normalized);
  };

  const decrementQuantity = () => {
    handleQuantityChange(quantity - 1);
  };

  const incrementQuantity = () => {
    handleQuantityChange(quantity + 1);
  };

  const handleAddToCart = () => {
    if (
      !selectedWeight ||
      !hasPrice ||
      isSoldOut ||
      maxQuantity <= 0 ||
      quantity > maxQuantity
    )
      return;

    if (!isAuthenticated || !userId) {
      toast.error("กรุณาเข้าสู่ระบบเพื่อเพิ่มสินค้าในตะกร้า");
      router.push(`/sign-in?redirect=/products/${product.id}`);
      return;
    }

    startTransition(async () => {
      const result = await addCartItemAction({
        productId: product.id,
        weightId: selectedWeight.id,
        quantity,
      });

      if (!result.success || !result.cart) {
        toast.error(result.message ?? "ไม่สามารถเพิ่มสินค้าได้");
        return;
      }

      syncFromServer(userId, result.cart);
      setQuantity(1);
      toast.success("เพิ่มสินค้าในตะกร้าแล้ว");
    });
  };

  const disableCartButton =
    !selectedWeight ||
    !hasPrice ||
    isSoldOut ||
    maxQuantity <= 0 ||
    quantity > maxQuantity ||
    isPending;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr] md:px-0 px-[15px]">
      {/* รูปภาพสินค้า */}
      <div className="space-y-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted">
          <Image
            src={displayImage}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(min-width: 1280px) 520px, (min-width: 1024px) 460px, (min-width: 768px) 60vw, 100vw"
            priority
          />

          {isSoldOut && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm">
              {/* ปรับแก้ปุ่มตรงนี้ครับ */}
              <div className="flex items-center gap-2 rounded-md bg-[#DC2626] px-6 py-2 text-white shadow-md transition-transform hover:scale-105">
                <Ban className="h-4 w-4 stroke-3" />{" "}
                {/* ไอคอนหนาหน่อยจะได้ชัด */}
                <span className="text-sm font-bold tracking-wide">
                  สินค้าหมด
                </span>
              </div>
            </div>
          )}
        </div>

        {product.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {product.images.map((image) => {
              const isActive = image.id === activeImageId;

              return (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setActiveImageId(image.id)}
                  className={cn(
                    "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                    isActive
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border/60 hover:border-primary/40",
                  )}
                  aria-label="เลือกภาพสินค้า"
                >
                  <Image
                    src={image.url}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />

                  {isSoldOut && (
                    <div className="absolute inset-0 z-10 bg-background/60 backdrop-blur-[1px]" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* รายละเอียดสินค้า */}
      <div className="space-y-6 md:px-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
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
                stockBadge.className,
              )}
            >
              {stockBadge.label}
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
              // กรณี: ไม่มีเก็บเงินปลายทาง (โชว์สีแดง + กากบาท)
              <Badge
                variant="outline"
                className="flex items-center gap-1 border-red-200 bg-red-50 text-red-600 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/30"
              >
                {/* ใช้ไอคอน X ที่ import มาแล้ว */}
                <Ban className="size-3.5" />
                ไม่มีเก็บปลายทาง
              </Badge>
            )}
          </div>

          {/* --- ส่วนหัวสินค้า: ชื่อ --- */}
          <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
            {product.title}
          </h1>

          {/* --- ส่วนที่ขนานกัน: ราคา (ซ้าย) และ เลือกน้ำหนัก (ขวา) --- */}
          <div className="flex items-end justify-between gap-2">
            {/* ฝั่งซ้าย: กลุ่มราคาและป้ายลดราคา */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xl font-bold text-foreground md:text-2xl leading-none">
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

            {/* ฝั่งขวา: ช่อง Select (กำหนดความกว้างคงที่เพื่อให้ขนานกับราคาได้พอดี) */}
            <div className="flex flex-col gap-1 w-[160px] shrink-0">
              <span className="text-[11px] font-medium text-muted-foreground">
                {product.type === "UNIT" ? "เลือกตัวเลือก" : "เลือกน้ำหนัก"}
              </span>

              {product.weights.length > 0 ? (
                <Select
                  value={selectedWeightId ?? undefined}
                  onValueChange={(value) => setSelectedWeightId(value)}
                >
                  <SelectTrigger className="w-full !h-[45px] rounded-xl border-border/60 bg-background">
                    <SelectValue placeholder="เลือก..." />
                  </SelectTrigger>

                  <SelectContent className="w-[var(--radix-select-trigger-width)]">
                    {/* ✅ 2. วนลูปจากตัวแปร preparedWeightOptions ที่เราเตรียมไว้ข้างบน */}
                    {preparedWeightOptions.map((option) => (
                      <SelectItem
                        key={option.id}
                        value={option.id}
                        className="py-2 focus:bg-emerald-50 dark:focus:bg-emerald-950/20"
                      >
                        <div className="flex flex-col text-xs">
                          {/* ชื่อตัวเลือก + ป้ายลดราคา */}
                          <div className="flex items-center justify-start gap-2">
                            <span className="font-semibold text-foreground whitespace-nowrap">
                              {option.displayName}{" "}
                              {/* 👈 ใช้ค่าที่เตรียมไว้เลย */}
                            </span>

                            {option.hasDiscount && (
                              <span className="font-bold text-destructive shrink-0">
                                ลด {option.discount}%{" "}
                                {/* 👈 ใช้ค่าที่เตรียมไว้เลย */}
                              </span>
                            )}
                          </div>

                          {/* ราคาขาย + ราคาเต็ม */}
                          <div className="flex items-center justify-start gap-2 opacity-70">
                            <span className="whitespace-nowrap">
                              {option.priceLabel}{" "}
                              {/* 👈 ใช้ค่าที่เตรียมไว้เลย */}
                            </span>

                            {option.showBasePrice && (
                              <span className="line-through text-[10px]">
                                {option.basePriceLabel}{" "}
                                {/* 👈 ใช้ค่าที่เตรียมไว้เลย */}
                              </span>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-[10px] text-muted-foreground italic">
                  ไม่มีตัวเลือก
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* จำนวนสินค้า */}
          <div className="space-y-4">
            {/* ✅ ใช้ Grid: แบ่งพื้นที่เป็น [ซ้าย:ยืดหยุ่น_ขวา:เท่าปุ่มกด] เพื่อไม่ให้เบียดกัน */}
            <div className="mt-4 grid grid-cols-[1fr_auto] items-start gap-4">
              {/* ================== ฝั่งซ้าย (Stock & Selected) ================== */}
              {/* min-w-0: สั่งให้ตัดคำถ้ายาวเกิน (ห้ามไปดันฝั่งขวา) */}
              <div className="min-w-0 flex w-fit items-center gap-1 rounded-full border border-border/60 bg-background px-3 py-1.5 font-medium text-foreground responsive-text-size overflow-hidden">
                <Package className="size-4 text-primary shrink-0" />

                {/* เนื้อหาข้อความ (ใส่ truncate เพื่อป้องกันการดันกล่อง) */}
                <div className="truncate flex items-center gap-1">
                  <span className="whitespace-nowrap">
                    สต็อก {product.stock.toLocaleString()}
                  </span>

                  {/* ✅ Logic เดิม: เช็ค selectedWeight และ UNIT/WEIGHT */}
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

              {/* ================== ฝั่งขวา (Buttons & Max Qty) ================== */}
              {/* w-fit: จองพื้นที่เท่าที่จำเป็น */}
              <div className="flex w-fit flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                  {/* ปุ่มลบ */}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1 || isSoldOut || maxQuantity <= 0}
                    className="h-7 w-7 shrink-0 rounded-md"
                  >
                    <Minus className="size-4" />
                  </Button>

                  {/* ช่องกรอก (ปรับ w-10 เพื่อให้ใส่เลข 10,000 ได้โดยไม่เบียด) */}
                  <Input
                    type="number"
                    min={1}
                    max={maxQuantity > 0 ? maxQuantity : undefined}
                    value={quantity}
                    onChange={(event) =>
                      handleQuantityChange(Number(event.target.value))
                    }
                    className="h-7 w-10 text-center text-sm p-0"
                    disabled={isSoldOut || maxQuantity <= 0}
                  />

                  {/* ปุ่มบวก */}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity}
                    disabled={
                      isSoldOut || maxQuantity <= 0 || quantity >= maxQuantity
                    }
                    className="h-7 w-7 shrink-0 rounded-md"
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>

                {/* ✅ Logic เดิม: ข้อความสั่งได้สูงสุด */}
                {/* {selectedWeight && maxQuantity > 0 && (
                  <span className="text-[10px] text-muted-foreground text-right w-full max-w-[120px] break-words leading-tight">
                    สั่งได้สูงสุด {maxQuantity.toLocaleString()}{" "}
                    {product.unitLabel}
                    {product.type === "WEIGHT" && (
                      <span>
                        {" "}
                        (รวม{" "}
                        {(selectedWeight.weight * maxQuantity).toLocaleString()}
                        )
                      </span>
                    )}
                  </span>
                )} */}
                {selectedWeight && maxQuantity > 0 && (
                  <span className="text-[10px] text-muted-foreground text-right w-full break-words leading-tight">
                    {/* ✅ 1. แก้ตรงนี้: ใส่คำว่า "ชิ้น" ตายตัว (แทน product.unitLabel) */}
                    สั่งได้สูงสุด {maxQuantity.toLocaleString()} ชิ้น
                    {/* ✅ 2. ในวงเล็บ: ก็ให้แสดงเป็น "ชิ้น" ด้วยเช่นกัน */}
                    {selectedWeight.weight > 0 && (
                      <span>
                        {" "}
                        (รวม{" "}
                        {(
                          selectedWeight.weight * maxQuantity
                        ).toLocaleString()}{" "}
                        ชิ้น)
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-border/60 bg-muted/40 px-5 py-4">
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/50 p-5 backdrop-blur-sm">
              {/* Decoration */}
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-emerald-500/5 blur-2xl" />

              {/* 1. ส่วนหัว: ชื่อสินค้า */}
              <div className="mb-4 relative pt-3">
                <p className="absolute top-0 left-0 text-[8px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                  Product Detail
                </p>
                {/* สร้าง Flex Container เพื่อจัดเรียง ซ้าย (หัวข้อ) - ขวา (3 กล่อง) */}
                <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                  {/* --- ฝั่งซ้าย: ส่วนหัวข้อและชื่อสินค้า --- */}
                  <div className="min-w-0 flex-1">
                    {/* <p className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                      Product Detail
                    </p> */}
                    <h3 className="text-sm font-medium text-foreground truncate mt-0.5">
                      {product.title}
                    </h3>
                  </div>

                  {/* --- ฝั่งขวา: กล่อง 3 ช่อง (ปรับขนาดให้เล็กลง) --- */}
                  {/* --- ฝั่งขวา: กล่อง 3 ช่อง --- */}
                  <div className="flex shrink-0 gap-1.5">
                    {/* ช่องที่ 1: ขนาด/ตัวเลือก */}
                    <div className="detail-box-responsive rounded-md bg-background/40 border border-border/30 min-w-fit px-2">
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

                    {/* ช่องที่ 2: จำนวน */}
                    <div className="detail-box-responsive rounded-md bg-emerald-50/50 border border-emerald-100/50 min-w-fit px-2">
                      <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                        จำนวน
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 leading-tight mt-0.5 whitespace-nowrap">
                        x {quantity.toLocaleString()}
                      </span>
                    </div>

                    {/* ช่องที่ 3: ปริมาณสุทธิ */}
                    <div className="detail-box-responsive rounded-md bg-background/40 border border-border/30 min-w-fit px-2">
                      <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                        รวมสุทธิ
                      </span>
                      <span className="text-[10px] font-medium text-foreground text-center leading-tight mt-0.5 whitespace-nowrap">
                        {selectedWeight
                          ? product.type === "UNIT"
                            ? (
                                Number(selectedWeight.name ?? 0) * quantity
                              ).toLocaleString()
                            : (
                                selectedWeight.weight * quantity
                              ).toLocaleString()
                          : 0}
                        <span className="text-[9px] ml-0.5 text-muted-foreground">
                          {product.unitLabel}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* เส้นปะคั่น */}
              <div className="my-4 border-t border-dashed border-border/60" />

              {/* 3. ราคารวม (ตัวเลขใหญ่) */}
              {typeof totalPrice === "number" && (
                <div className="mt-5 flex items-end justify-between rounded-xl bg-emerald-50/50 px-4 py-3 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">
                      ยอดชำระรวม
                    </span>
                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                      Total Price
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 leading-none">
                      {formatPrice(totalPrice).replace("฿", "")}
                    </span>
                    <span className="text-xs font-medium text-emerald-600/70">
                      THB
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* <Button
              size="lg"
              className="w-full md:w-auto"
              onClick={handleAddToCart}
              disabled={disableCartButton}
              aria-busy={isPending}
            >
              <ShoppingCart className="size-4" />
              {isSoldOut ? "สินค้าหมด" : "เพิ่มลงตะกร้า"}
            </Button> */}
            {/* ✅ Logic ปุ่มกด (AddToCart หรือ Replacement) */}
            {replacementTargetId ? (
              <div className="flex flex-col gap-2">
                <Button
                  size="lg"
                  className={cn(
                    "w-full md:w-auto text-white",
                    isCodRestricted
                      ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
                      : "bg-amber-600 hover:bg-amber-700",
                  )}
                  onClick={handleReplaceItem}
                  disabled={disableCartButton}
                  aria-busy={isPending}
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

                {isCodRestricted && (
                  <p className="text-xs text-red-500 text-center">
                    *สินค้าชิ้นนี้ไม่รองรับการเก็บเงินปลายทาง
                  </p>
                )}
              </div>
            ) : (
              <Button
                size="lg"
                className="w-full md:w-auto"
                onClick={handleAddToCart}
                disabled={disableCartButton}
                aria-busy={isPending}
              >
                <ShoppingCart className="size-4" />
                {isSoldOut ? "สินค้าหมด" : "เพิ่มลงตะกร้า"}
              </Button>
            )}

            <Button
              size="lg"
              variant="outline"
              className="w-full md:w-auto md:ml-[5px] md:relative md:-top-[5px]"
              onClick={() => router.push("/cart")}
            >
              ไปยังหน้าตะกร้า
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            รายละเอียดสินค้า
          </h2>
          <p className="text-sm leading-6 text-muted-foreground whitespace-pre-line">
            {product.description}
          </p>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            รีวิวจากลูกค้า ({product.totalReviews || 0})
          </h3>

          {canReview ? (
            <div className="rounded-xl border border-dashed border-emerald-500/50 bg-emerald-50/50 p-6 text-center dark:bg-emerald-950/20">
              <p className="mb-4 text-xs text-muted-foreground">
                ได้รับสินค้าแล้ว สินค้าเป็นอย่างไรบ้าง? มาร่วมแบ่งปันประสบการณ์
              </p>
              <ReviewModal productId={product.id} />
            </div>
          ) : isAuthenticated ? (
            <div className="rounded-lg bg-muted/10 p-4 text-center border border-border/40">
              <p className="text-sm text-muted-foreground">
                คุณสามารถรีวิวสินค้านี้ได้เมื่อ{" "}
                <span className="font-semibold text-emerald-600">
                  สถานะคำสั่งซื้อสำเร็จ
                </span>{" "}
                แล้วเท่านั้น
                <br />
                <span className="text-xs text-muted-foreground/70">
                  (หรือคุณอาจเคยรีวิวสินค้านี้ไปแล้ว)
                </span>
              </p>
            </div>
          ) : (
            <div className="rounded-lg bg-muted/10 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                กรุณา{" "}
                <span className="font-semibold text-primary">เข้าสู่ระบบ</span>{" "}
                เพื่อตรวจสอบสิทธิ์การรีวิว
              </p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <ReviewList reviews={product.reviews || []} />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* ✅✅ Dialog Modal (รองรับทั้ง จ่ายเพิ่ม และ รับเงินคืน) ✅✅ */}
      {/* ------------------------------------------------------------------ */}
      <Dialog
        open={paymentModalOpen}
        onOpenChange={(open) => !isPending && setPaymentModalOpen(open)}
      >
        <DialogContent className="w-[90vw] max-w-[400px] max-h-[80vh] overflow-y-auto rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              {isRefundMode ? "แจ้งรับเงินคืนส่วนต่าง" : "ชำระยอดส่วนต่าง"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {isRefundMode
                ? "ยอดสินค้าใหม่ต่ำกว่าเดิม ทางร้านจะโอนเงินคืนให้คุณ"
                : "สินค้าใหม่มีราคาสูงกว่าเดิม"}
            </DialogDescription>
          </DialogHeader>

          {isRefundMode ? (
            // =========================================================
            // 🟢 UI สำหรับโหมดคืนเงิน (Refund Form)
            // =========================================================
            <div className="flex flex-col space-y-4 py-2">
              {/* ยอดเงินคืน */}
              <div className="text-center mb-2">
                <div className="text-sm text-muted-foreground">
                  ยอดเงินคืนสุทธิ
                </div>
                <div className="text-3xl font-bold text-emerald-600">
                  {formatPrice(refundAmount)}
                </div>
              </div>

              <div className="space-y-3 px-1">
                {/* เลือกธนาคาร */}
                <div className="space-y-1">
                  <label className="text-xs font-medium ml-1">
                    ช่องทางรับเงิน
                  </label>
                  <Select value={refundBank} onValueChange={setRefundBank}>
                    <SelectTrigger className="w-full rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PROMPTPAY">
                        พร้อมเพย์ (PromptPay)
                      </SelectItem>
                      <SelectItem value="KBANK">กสิกรไทย (KBANK)</SelectItem>
                      <SelectItem value="SCB">ไทยพาณิชย์ (SCB)</SelectItem>
                      <SelectItem value="KTB">กรุงไทย (KTB)</SelectItem>
                      <SelectItem value="BBL">กรุงเทพ (BBL)</SelectItem>
                      <SelectItem value="TTB">ทหารไทยธนชาต (TTB)</SelectItem>
                      <SelectItem value="GSB">ออมสิน (GSB)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* กรอกเลขบัญชี */}
                <div className="space-y-1">
                  <label className="text-xs font-medium ml-1">
                    เลขที่บัญชี / เบอร์พร้อมเพย์
                  </label>
                  <Input
                    value={refundAccountNo}
                    onChange={(e) => {
                      // Regex: ให้พิมพ์ได้แค่ตัวเลขเท่านั้น
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      setRefundAccountNo(val);
                    }}
                    placeholder="กรอกเฉพาะตัวเลขเท่านั้น"
                    maxLength={15}
                    className="rounded-xl"
                    disabled={isPending}
                  />
                </div>

                {/* กรอกชื่อบัญชี */}
                <div className="space-y-1">
                  <label className="text-xs font-medium ml-1">ชื่อบัญชี</label>
                  <Input
                    value={refundAccountName}
                    onChange={(e) => setRefundAccountName(e.target.value)}
                    placeholder="ชื่อ-นามสกุล เจ้าของบัญชี"
                    className="rounded-xl"
                    disabled={isPending}
                  />
                </div>
              </div>

              <DialogFooter className="pt-2 sm:justify-between gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setPaymentModalOpen(false)}
                  disabled={isPending}
                >
                  ยกเลิก
                </Button>
                <Button
                  onClick={handleConfirmRefund}
                  disabled={isPending || !refundAccountNo || !refundAccountName}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
                >
                  {isPending ? "กำลังบันทึก..." : "ยืนยันข้อมูลรับเงิน"}
                </Button>
              </DialogFooter>
            </div>
          ) : (
            // =========================================================
            // 🟡 UI สำหรับโหมดจ่ายเพิ่ม (Payment Form - ของเดิม)
            // =========================================================
            <>
              <div className="flex flex-col items-center space-y-5">
                <div className="text-center mb-1">
                  <div className="text-sm text-muted-foreground">
                    ยอดที่ต้องชำระเพิ่ม
                  </div>
                  <div className="text-3xl font-bold text-emerald-600">
                    {formatPrice(extraAmount)}
                  </div>
                </div>

                {qrCodeUrl && (
                  <div className="relative h-56 w-56 overflow-hidden rounded-xl border shadow-sm bg-white">
                    <Image
                      src={qrCodeUrl}
                      alt="QR Code"
                      fill
                      className="object-contain p-2"
                      unoptimized
                    />
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  สแกนเพื่อชำระเงิน
                </p>

                <Separator />

                <div className="w-full">
                  <label className="text-sm font-medium mb-2 block">
                    หลักฐานการโอน (รูปภาพเท่านั้น)
                  </label>
                  <div
                    className="relative flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/25 hover:bg-muted/50 transition-all group"
                    onClick={() => !isPending && fileInputRef.current?.click()}
                  >
                    {slipImage ? (
                      <div className="relative h-full w-full p-2">
                        <Image
                          src={slipImage}
                          alt="Slip Preview"
                          fill
                          className="object-contain rounded-lg"
                        />
                        <div
                          className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 cursor-pointer hover:bg-red-500 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSlipImage(null);
                            if (fileInputRef.current)
                              fileInputRef.current.value = "";
                          }}
                        >
                          <X size={16} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
                        <Upload className="mb-2 h-8 w-8 group-hover:scale-110 transition-transform" />
                        <p className="text-sm">แตะเพื่ออัปโหลดสลิป</p>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleFileChange}
                      disabled={isPending}
                      aria-label="อัปโหลดหลักฐานการโอนเงิน"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="sm:justify-between gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setPaymentModalOpen(false)}
                  disabled={isPending}
                >
                  ยกเลิก
                </Button>
                <Button
                  onClick={handleConfirmPayment}
                  disabled={!slipImage || isPending}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
                >
                  {isPending ? "กำลังบันทึก..." : "ยืนยันการโอนเงิน"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// "use client";

// import { useEffect, useMemo, useRef, useState, useTransition } from "react";
// import { useRouter } from "next/navigation";
// import { ShoppingCart, Truck, ArrowLeftRight } from "lucide-react";
// import { toast } from "sonner";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { cn } from "@/lib/utils";
// import { formatPrice } from "@/lib/format-price";
// import { calculateDiscountPercent } from "@/lib/pricing";
// import { addCartItemAction, replaceOrderItemAction } from "@/app/(main)/(protected)/cart/actions";
// import { useCartStore } from "@/stores/cart-store";
// import { ReviewModal } from "@/components/product/review-modal";
// import { ReviewList } from "@/components/product/review-list";

// // นำเข้า Sub-components
// import { ProductImageGallery} from "./product-image-gallery";
// import { ProductSelection } from "./product-selection-area";
// import { PaymentDialog } from "./payment-dialog";

// export default function ProductDetail({
//   product, userId, isAuthenticated, canReview, replacementTargetId, originalPaymentMethod,
// }: any) {
//   const router = useRouter();
//   const [isPending, startTransition] = useTransition();
//   const syncFromServer = useCartStore((state) => state.syncFromServer);

//   // States
//   const [activeImageId, setActiveImageId] = useState(product.images[0]?.id ?? null);
//   const [selectedWeightId, setSelectedWeightId] = useState(product.weights[0]?.id ?? null);
//   const [quantity, setQuantity] = useState(1);
//   const [paymentModalOpen, setPaymentModalOpen] = useState(false);
//   const [extraAmount, setExtraAmount] = useState(0);
//   const [qrCodeUrl, setQrCodeUrl] = useState("");
//   const [slipImage, setSlipImage] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Memos & Helpers
//   const isSoldOut = product.stock <= 0;
//   const selectedWeight = useMemo(() => product.weights.find((w: any) => w.id === selectedWeightId) ?? null, [product.weights, selectedWeightId]);
//   const maxQuantity = useMemo(() => {
//     if (!selectedWeight || selectedWeight.weight <= 0) return 0;
//     return Math.max(0, Math.floor(product.stock / selectedWeight.weight));
//   }, [product.stock, selectedWeight]);

//   useEffect(() => {
//     if (maxQuantity > 0) setQuantity(q => Math.min(q, maxQuantity));
//     else setQuantity(1);
//   }, [maxQuantity]);

//   // Handlers (Logic เดิม 100%)
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) { toast.error("ไฟล์ขนาดใหญ่เกินไป (สูงสุด 5MB)"); return; }
//       const reader = new FileReader();
//       reader.onloadend = () => setSlipImage(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleAddToCart = () => {
//     if (!selectedWeight || isSoldOut || quantity > maxQuantity) return;
//     if (!isAuthenticated || !userId) {
//       toast.error("กรุณาเข้าสู่ระบบเพื่อเพิ่มสินค้า");
//       router.push(`/sign-in?redirect=/products/${product.id}`);
//       return;
//     }
//     startTransition(async () => {
//       const result = await addCartItemAction({ productId: product.id, weightId: selectedWeight.id, quantity });
//       if (result.success && result.cart) {
//         syncFromServer(userId, result.cart);
//         setQuantity(1);
//         toast.success("เพิ่มสินค้าในตะกร้าแล้ว");
//       } else { toast.error(result.message ?? "ไม่สามารถเพิ่มสินค้าได้"); }
//     });
//   };

//   const handleReplaceItem = () => {
//     if (!!replacementTargetId && originalPaymentMethod === "COD" && !product.cod) {
//       toast.error("ขออภัย ออเดอร์เดิมชำระปลายทาง สินค้าใหม่ต้องรองรับปลายทางด้วยครับ");
//       return;
//     }
//     if (!selectedWeight || !replacementTargetId) return;
//     startTransition(async () => {
//       const result: any = await replaceOrderItemAction({ orderItemId: replacementTargetId, newProductId: product.id, newWeightId: selectedWeight.id, quantity });
//       if (result.requirePayment) {
//         setExtraAmount(result.extraAmount); setQrCodeUrl(result.qrCode); setPaymentModalOpen(true);
//         toast.info("กรุณาชำระส่วนต่าง"); return;
//       }
//       if (result.success) { router.refresh(); toast.success("เปลี่ยนสินค้าสำเร็จ"); router.push("/orders"); }
//       else { toast.error(result.message); }
//     });
//   };

//   const handleConfirmPayment = () => {
//     if (!slipImage || !selectedWeight || !replacementTargetId) return;
//     startTransition(async () => {
//       const result: any = await replaceOrderItemAction({ orderItemId: replacementTargetId, newProductId: product.id, newWeightId: selectedWeight.id, quantity, slipImage });
//       if (result.success) { setPaymentModalOpen(false); toast.success("บันทึกข้อมูลแล้ว"); router.push("/orders"); }
//       else { toast.error(result.message); }
//     });
//   };

//   // Rendering Labels
//   const unitPriceLabel = selectedWeight ? formatPrice(selectedWeight.price) : "สอบถามราคา";
//   const basePriceLabel = selectedWeight && selectedWeight.basePrice > selectedWeight.price ? formatPrice(selectedWeight.basePrice) : null;
//   const discountPercent = selectedWeight ? Math.round(calculateDiscountPercent(selectedWeight.basePrice, selectedWeight.price)) : 0;

//   return (
//     <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr] md:px-0 px-[15px]">
//       <ProductImageGallery images={product.images} title={product.title} mainImageUrl={product.mainImageUrl} activeImageId={activeImageId} setActiveImageId={setActiveImageId} isSoldOut={isSoldOut} />

//       <div className="space-y-6">
//         <div className="space-y-4">
//           <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
//             {product.categoryName && <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">{product.categoryName}</Badge>}
//             <Badge variant="outline" className={cn("border-border/60 bg-background", isSoldOut ? "text-destructive" : "text-emerald-600")}>{isSoldOut ? "สินค้าหมด" : "พร้อมส่ง"}</Badge>
//             {product.cod && <Badge variant="secondary" className="flex items-center gap-1 bg-black/70 text-white"><Truck className="size-3.5" />เก็บเงินปลายทาง</Badge>}
//           </div>

//           <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">{product.title}</h1>

//           <ProductSelection
//             product={product} selectedWeightId={selectedWeightId} setSelectedWeightId={setSelectedWeightId}
//             quantity={quantity} handleQuantityChange={(v:any)=>setQuantity(v)} decrementQuantity={()=>setQuantity(q=>Math.max(1, q-1))} incrementQuantity={()=>setQuantity(q=>Math.min(maxQuantity, q+1))}
//             maxQuantity={maxQuantity} isSoldOut={isSoldOut} unitPriceLabel={unitPriceLabel} basePriceLabel={basePriceLabel} discountPercent={discountPercent}
//           />

//           <Separator />

//           {/* สรุปราคาและปุ่มยืนยัน */}
//           <div className="space-y-3 rounded-2xl border border-border/60 bg-muted/40 px-5 py-4">
//             <div className="flex flex-col gap-1 text-sm text-muted-foreground">
//               <span>สินค้า: {product.title}</span>
//               <span className="font-bold text-foreground">{product.type === "UNIT" ? "ตัวเลือก: " : "น้ำหนัก: "}{selectedWeight ? (product.type === "UNIT" ? selectedWeight.name : `${selectedWeight.weight.toLocaleString()} ${product.unitLabel}`) : "-"}</span>
//               <span>จำนวนรวม: <span className="font-semibold text-foreground">{selectedWeight ? (product.type === "UNIT" ? Number(selectedWeight.name)*quantity : selectedWeight.weight*quantity).toLocaleString() : 0} {product.unitLabel}</span></span>
//               {selectedWeight && <span className="text-base font-semibold text-foreground">ราคารวม {formatPrice(selectedWeight.price * quantity)}</span>}
//             </div>

//             <div className="flex flex-col md:flex-row gap-2">
//               {replacementTargetId ? (
//                 <Button size="lg" className={cn("w-full md:w-auto text-white", (replacementTargetId && originalPaymentMethod === "COD" && !product.cod) ? "bg-gray-400" : "bg-amber-600")} onClick={handleReplaceItem} disabled={isPending || (replacementTargetId && originalPaymentMethod === "COD" && !product.cod)}>
//                    <ArrowLeftRight className="mr-2 size-4" /> {isPending ? "กำลังตรวจสอบ..." : "ยืนยันการเปลี่ยนสินค้า"}
//                 </Button>
//               ) : (
//                 <Button size="lg" className="w-full md:w-auto" onClick={handleAddToCart} disabled={isSoldOut || isPending}>
//                   <ShoppingCart className="size-4 mr-2" /> {isSoldOut ? "สินค้าหมด" : "เพิ่มลงตะกร้า"}
//                 </Button>
//               )}
//               <Button size="lg" variant="outline" className="w-full md:w-auto" onClick={() => router.push("/cart")}>ไปยังหน้าตะกร้า</Button>
//             </div>
//           </div>
//         </div>

//         <Separator />
//         <div>
//           <h2 className="text-lg font-semibold">รายละเอียดสินค้า</h2>
//           <p className="text-sm leading-6 text-muted-foreground whitespace-pre-line">{product.description}</p>
//         </div>

//         <Separator className="my-6" />
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold text-foreground">รีวิวจากลูกค้า ({product.totalReviews || 0})</h3>
//           {canReview ? <ReviewModal productId={product.id} /> : <p className="text-sm text-muted-foreground text-center italic">คุณสามารถรีวิวได้เมื่อสั่งซื้อสำเร็จ</p>}
//           <ReviewList reviews={product.reviews || []} />
//         </div>
//       </div>

//       <PaymentDialog
//         open={paymentModalOpen} setOpen={setPaymentModalOpen} extraAmount={extraAmount} qrCodeUrl={qrCodeUrl}
//         slipImage={slipImage} setSlipImage={setSlipImage} fileInputRef={fileInputRef} handleFileChange={handleFileChange}
//         handleConfirmPayment={handleConfirmPayment} isPending={isPending}
//       />
//     </div>
//   );
// }
