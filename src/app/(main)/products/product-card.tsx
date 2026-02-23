// import Image from "next/image";
// import Link from "next/link";
// import {
//   ArrowRight,
//   Cannabis,
//   Info,
//   ShoppingBag,
//   ShoppingCart,
// } from "lucide-react";

// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { formatPrice } from "@/lib/format-price";
// import { calculateDiscountPercent, getMaxDiscountPercent } from "@/lib/pricing";
// import { ProductWithMainImage } from "@/types/product";

// const FALLBACK_IMAGE = "/images/no-product-image.webp";

// interface ProductCardProps {
//   product: ProductWithMainImage;
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
//       label: "เหลือน้อย",
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

// export default function ProductCard({ product }: ProductCardProps) {
//   const variants = product.ProductWeight ?? [];
//   const sortedByPrice = [...variants].sort(
//     (a, b) =>
//       Number(a.price ?? Number.MAX_SAFE_INTEGER) -
//       Number(b.price ?? Number.MAX_SAFE_INTEGER)
//   );
//   const primaryVariant = sortedByPrice[0];

//   const currentPrice = primaryVariant?.price ?? null;
//   const basePrice = primaryVariant?.basePrice ?? null;
//   const primaryDiscount = calculateDiscountPercent(
//     Number(basePrice ?? 0),
//     Number(currentPrice ?? 0)
//   );

//   const discountPercent = Math.round(
//     Math.max(primaryDiscount, getMaxDiscountPercent(variants))
//   );
//   const discountLabel = discountPercent > 0 ? `-${discountPercent}%` : null;

//   const priceLabel =
//     typeof currentPrice === "number"
//       ? formatPrice(Number(currentPrice))
//       : "สอบถามราคา";

//   const basePriceLabel =
//     typeof basePrice === "number" &&
//     typeof currentPrice === "number" &&
//     basePrice > currentPrice
//       ? formatPrice(Number(basePrice))
//       : null;

//   const weightOptions = [...variants]
//     .filter(
//       (variant) =>
//         typeof variant.weight === "number" && !Number.isNaN(variant.weight)
//     )
//     .sort((a, b) => Number(a.weight) - Number(b.weight))
//     .slice(0, 3);

//   const hasMoreVariants = variants.length > weightOptions.length;

//   const stockBadge = getStockBadge(product.stock, product.lowStock);
//   const categoryName = product.category?.name ?? "หมวดหมู่ไม่ระบุ";
//   const mainImageUrl = product.mainImage?.url ?? FALLBACK_IMAGE;
//   const soldOut = product.stock <= 0;

//   return (
//     <Link href={`/products/${product.id}`} className="group block h-full">
//       <Card className="relative flex h-full flex-col overflow-hidden gap-0 border border-border/50 bg-background/60 p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl">
//         <div className="relative overflow-hidden">
//           <div className="relative aspect-square w-full overflow-hidden bg-muted/20">
//             <Image
//               alt={product.title}
//               src={mainImageUrl}
//               fill
//               className="object-cover transition duration-500 ease-out group-hover:scale-105"
//               sizes="(min-width: 1280px) 260px, (min-width: 1024px) 220px, (min-width: 768px) 33vw, 50vw"
//               priority={false}
//             />

//             {soldOut && (
//               <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//                 <span className="bg-red-600/90 rounded-[5px] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white shadow-md">
//                   สินค้าหมด
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* มุมซ้ายบน */}
//           {/* {!soldOut && (
//             <div className="pointer-events-none absolute left-1 top-1 z-20 flex flex-col gap-1">
//               {discountLabel && (
//                 <Badge className="px-2 py-0.5 text-[9px] md:px-3 md:py-1 md:text-[11px] font-semibold tracking-tight shadow-sm bg-red-600 text-white">
//                   {discountLabel}
//                 </Badge>
//               )}

//               {product.cod && (
//                 <Badge
//                   variant="outline"
//                   className={`absolute top-6 md:top-8 z-20 rounded-md px-1.5 py-0.5 md:px-2 md:py-1 md:text-[11px] text-[9px] font-medium
//           ${
//             stockBadge.label === "สินค้าหมด"
//               ? "bg-red-600 text-white border-red-700"
//               : stockBadge.label === "เหลือน้อย"
//               ? "bg-yellow-400 text-black border-yellow-500"
//               : "bg-green-400 text-black border-green-500"
//           }
//           shadow-sm
//         `}
//                 >
//                   {stockBadge.label}
//                 </Badge>
//               )}
//             </div>
//           )} */}

//           {/* มุมซ้ายบน */}
//           {!soldOut && (
//             <div className="pointer-events-none absolute left-1 top-1 z-20 flex flex-col gap-1">
//               {/* มีส่วนลด → แสดงส่วนลด */}
//               {discountLabel ? (
//                 <Badge className="px-2 py-0.5 text-[9px] md:px-3 md:py-1 md:text-[11px] font-semibold shadow-sm bg-red-600 text-white">
//                   {discountLabel}
//                 </Badge>
//               ) : (
//                 /* ไม่มีส่วนลด → แสดง Badge ใหม่ */
//                 <Badge
//                   variant="outline"
//                   className="
//           flex items-center gap-1 px-2 py-0.5 md:px-3 md:py-1
//           text-[9px] md:text-[11px] font-semibold
//           bg-blue-600 text-white border-blue-700 shadow-sm
//         "
//                 >
//                   <Info className="w-3 h-3" />
//                   ราคาปกติ
//                 </Badge>
//               )}

//               {/* COD เดิม (ไม่แตะต้อง) */}
//               {product.cod && (
//                 <Badge
//                   variant="outline"
//                   className={`
//           absolute top-6 md:top-8 z-20 rounded-md px-1.5 py-0.5 md:px-2 md:py-1
//           text-[9px] md:text-[11px] font-medium
//           ${
//             stockBadge.label === "สินค้าหมด"
//               ? "bg-red-600 text-white border-red-700"
//               : stockBadge.label === "เหลือน้อย"
//               ? "bg-yellow-400 text-black border-yellow-500"
//               : "bg-green-400 text-black border-green-500"
//           }
//           shadow-sm
//         `}
//                 >
//                   {stockBadge.label}
//                 </Badge>
//               )}
//             </div>
//           )}

//           {/* มุมขวาบน */}
//           {!soldOut &&
//             (product.cod ? (
//               <Badge
//                 variant="outline"
//                 className="pointer-events-none absolute right-1 top-1 z-20 px-2 py-0.5 md:px-3 md:py-1 md:text-[11px] text-[9px] font-semibold tracking-tight text-amber-950 shadow-md backdrop-blur-md bg-yellow-400 border border-amber-300/70"
//               >
//                 COD
//               </Badge>
//             ) : (
//               <Badge
//                 variant="outline"
//                 className={`absolute right-1 top-1 z-20 rounded-md px-1.5 py-0.5 md:px-2 md:py-1 md:text-[11px] text-[9px] font-medium
//         ${
//           stockBadge.label === "สินค้าหมด"
//             ? "bg-red-600 text-white border-red-700"
//             : stockBadge.label === "เหลือน้อย"
//             ? "bg-yellow-400 text-black border-yellow-500"
//             : stockBadge.label === "พร้อมส่ง"
//             ? "bg-green-400 text-black border-green-500"
//             : "bg-gray-300 text-black border-gray-400"
//         }
//         shadow-sm
//       `}
//               >
//                 {stockBadge.label}
//               </Badge>
//             ))}

//           <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex translate-y-6 flex-col gap-1 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-4 pb-3 pt-12 text-xs text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
//             <span className="text-sm font-medium text-white/90">เริ่มต้น</span>
//             <span className="flex items-center gap-2 text-lg font-semibold text-white">
//               <ShoppingBag className="size-4 text-white/80" />
//               {priceLabel}
//             </span>
//             {basePriceLabel && (
//               <span className="text-xs font-medium text-white/70 line-through">
//                 {basePriceLabel}
//               </span>
//             )}
//           </div>
//         </div>

//         {/* <CardContent className="flex flex-1 flex-col gap-3 px-4 py-4"> */}
//         <CardContent className="hidden sm:flex flex-1 flex-col gap-3 px-4 py-4">
//           <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
//             <Badge
//               variant="outline"
//               className="border-primary/20 bg-primary/10 text-primary"
//             >
//               {categoryName}
//             </Badge>

//             {hasMoreVariants && (
//               <span className="rounded-full bg-muted px-3 py-1 text-[11px] uppercase tracking-wide text-muted-foreground">
//                 {variants.length} ตัวเลือก
//               </span>
//             )}
//           </div>

//           {/* {product.description && (
//             <p className='text-sm text-muted-foreground line-clamp-2'>
//               {product.description}
//             </p>
//           )} */}

//           {weightOptions.length > 0 && (
//             <div className="mt-auto flex-wrap gap-2 hidden md:flex">
//               {weightOptions.map((variant) => (
//                 <span
//                   key={variant.id}
//                   className="rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-foreground shadow-sm"
//                 >
//                   {variant.weight.toLocaleString()} กรัม
//                 </span>
//               ))}
//               {hasMoreVariants && (
//                 <span className="rounded-full border border-dashed border-border/60 px-3 py-1 text-xs text-muted-foreground">
//                   +{variants.length - weightOptions.length} ขนาด
//                 </span>
//               )}
//             </div>
//           )}
//         </CardContent>

//         <CardFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-4 border-t border-border/60 bg-muted/30 px-2 md:px-4 py-3 text-xs">
//           {/* ด้านซ้าย (ชื่อ + ราคา + สต็อก + หมวดหมู่มือถือ) */}
//           <div className="flex flex-col leading-tight w-full sm:w-auto sm:max-w-[70%]">
//             {/* <h3 className="font-medium flex items-center gap-0.5 md:gap-1 text-xs md:text-lg transition-all duration-300">
//               <Cannabis className="w-4 h-4 text-primary md:w-6 md:h-6 transition-transform" />
//               {product.title}
//             </h3> */}
//             <h3 className="font-medium flex items-center gap-0.5 md:gap-1 text-xs md:text-lg transition-all duration-300">
//               <Cannabis className="w-4 h-4 text-primary md:w-6 md:h-6 transition-transform" />

//               <span className="truncate max-w-[85%] md:max-w-[90%]">
//                 {product.title}
//               </span>
//             </h3>

//             <div className="flex items-center justify-between w-full">
//               <div className="flex items-center gap-1 md:gap-1.5 font-semibold text-foreground text-xs md:text-base transition-all duration-300">
//                 <ShoppingBag className="size-3 md:size-5 text-primary transition-transform" />
//                 {priceLabel}
//               </div>

//               {/* <Badge
//                 variant="outline"
//                 className="border-primary/20 bg-primary/10 text-primary block md:hidden text-xs"
//               >
//                 {categoryName}
//               </Badge> */}

//               <Badge
//                 variant="outline"
//                 className="border-primary/20 bg-primary/10 text-primary block md:hidden
//              text-[10px] px-1.5 py-0.5 rounded-sm"
//               >
//                 {categoryName}
//               </Badge>
//             </div>

//             {basePriceLabel && (
//               <span className="hidden md:inline text-xs font-medium text-muted-foreground line-through">
//                 {basePriceLabel}
//               </span>
//             )}

//             <span className="hidden sm:inline text-xs text-muted-foreground mt-1">
//               {product.stock > 0
//                 ? `เหลือ ${product.stock.toLocaleString()} กรัม`
//                 : "หมดแล้ว"}
//             </span>
//           </div>

//           {/* <div className="flex sm:hidden items-center gap-2 text-primary mt-2 text-xs">
//             <span className="font-semibold">รายละเอียด</span>
//             <ArrowRight className="size-4" />
//           </div> */}

//           <div className="sm:hidden w-full mt-2">
//             <button
//               className="
//       w-[95%] mx-auto flex items-center justify-center
//       gap-2 py-2
//       bg-primary text-white
//       rounded-md text-sm font-semibold
//       active:scale-95 transition
//     "
//             >
//               <ShoppingCart className="size-4" />
//               ซื้อเลย
//             </button>
//           </div>

//           {/* <div className="hidden sm:flex items-center gap-2 text-primary shrink-0 text-xs">
//             <span className="font-semibold">รายละเอียด</span>
//             <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
//           </div> */}

//           <div className="hidden sm:flex items-center gap-2 text-primary shrink-0 text-xs">
//             <button className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-md text-xs font-semibold transition group">
//               <ShoppingCart className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
//               ซื้อเลย
//             </button>
//           </div>
//         </CardFooter>
//       </Card>
//     </Link>
//   );
// }

// import Image from "next/image";
// import Link from "next/link";
// import {
//   ArrowRight,
//   Cannabis,
//   Info,
//   ShoppingBag,
//   ShoppingCart,
//   Tag,
// } from "lucide-react";

// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { formatPrice } from "@/lib/format-price";
// import { calculateDiscountPercent, getMaxDiscountPercent } from "@/lib/pricing";
// import { ProductWithMainImage } from "@/types/product";
// import { cn } from "@/lib/utils";

// const FALLBACK_IMAGE = "/images/no-product-image.webp";

// interface ProductCardProps {
//   product: ProductWithMainImage;
//   index?: number; // ✅ เพิ่ม index เพื่อใช้ optimize image loading
//   replacementTargetId?: string; // ✅ รับค่า
// }

// interface StockBadgeConfig {
//   label: string;
//   className: string;
// }

// const getStockBadge = (stock: number, lowStock: number): StockBadgeConfig => {
//   if (stock <= 0) {
//     return {
//       label: "สินค้าหมด",
//       className: "bg-red-500 text-white hover:bg-red-600",
//     };
//   }

//   if (stock <= Math.max(lowStock, 0)) {
//     return {
//       label: "เหลือน้อย",
//       className: "bg-amber-500 text-white hover:bg-amber-600",
//     };
//   }

//   return {
//     label: "พร้อมส่ง",
//     className: "bg-emerald-500 text-white hover:bg-emerald-600",
//   };
// };

// export default function ProductCard({
//   product,
//   replacementTargetId,
//   index = 0,
// }: ProductCardProps) {
//   const variants = product.ProductWeight ?? [];
//   const productUrl = replacementTargetId
//     ? `/products/${product.id}?replacement_for=${replacementTargetId}`
//     : `/products/${product.id}`;

//   // ✅ หา variant ที่ราคาต่ำสุด แบบ O(n) แทนการ sort ทั้ง array
//   let primaryVariant = variants[0];
//   if (variants.length > 1) {
//     let minPrice = Number(primaryVariant?.price ?? Number.MAX_SAFE_INTEGER);

//     for (let i = 1; i < variants.length; i++) {
//       const v = variants[i];
//       const price = Number(v.price ?? Number.MAX_SAFE_INTEGER);
//       if (price < minPrice) {
//         minPrice = price;
//         primaryVariant = v;
//       }
//     }
//   }

//   const currentPrice = primaryVariant?.price ?? null;
//   const basePrice = primaryVariant?.basePrice ?? null;

//   const primaryDiscount = calculateDiscountPercent(
//     Number(basePrice ?? 0),
//     Number(currentPrice ?? 0),
//   );

//   const discountPercent = Math.round(
//     Math.max(primaryDiscount, getMaxDiscountPercent(variants)),
//   );
//   const discountLabel = discountPercent > 0 ? `-${discountPercent}%` : null;

//   const priceLabel =
//     typeof currentPrice === "number"
//       ? formatPrice(Number(currentPrice))
//       : "สอบถามราคา";

//   const basePriceLabel =
//     typeof basePrice === "number" &&
//       typeof currentPrice === "number" &&
//       basePrice > currentPrice
//       ? formatPrice(Number(basePrice))
//       : null;

//   const weightOptions = [...variants]
//     .filter(
//       (variant) =>
//         typeof variant.weight === "number" && !Number.isNaN(variant.weight),
//     )
//     .sort((a, b) => Number(a.weight) - Number(b.weight))
//     .slice(0, 3);

//   const hasMoreVariants = variants.length > weightOptions.length;

//   const stockBadge = getStockBadge(product.stock, product.lowStock);
//   const categoryName = product.category?.name ?? "หมวดหมู่ไม่ระบุ";
//   const mainImageUrl = product.mainImage?.url ?? FALLBACK_IMAGE;
//   const soldOut = product.stock <= 0;

//   // ✅ ให้การ์ด 4 ใบแรกโหลดรูปแบบ priority + eager → หน้าแรก “เด้งไวขึ้น”
//   const isPriority = index < 4;

//   return (
//     // <Link href={`/products/${product.id}`} className="group block h-full">
//     <Link href={productUrl} className="group block h-full">
//       <Card className="relative flex h-full flex-col overflow-hidden gap-0 border border-border/50 bg-background/60 p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl">
//         <div className="relative overflow-hidden">
//           <div className="relative aspect-square w-full overflow-hidden bg-muted/20">
//             <Image
//               alt={product.title}
//               src={mainImageUrl}
//               fill
//               className="object-cover transition duration-500 ease-out group-hover:scale-105"
//               sizes="(min-width: 1280px) 260px, (min-width: 1024px) 220px, (min-width: 768px) 33vw, 50vw"
//               priority={isPriority}
//               loading={isPriority ? "eager" : "lazy"} // ✅ แก้เฉพาะ behavior การโหลดรูป
//             />

//             {soldOut && (
//               <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//                 <span className="bg-red-600/90 rounded-[5px] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white shadow-md">
//                   สินค้าหมด
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* มุมซ้ายบน */}
//           {!soldOut && (
//             <div className="absolute left-1.5 top-1.5 z-20 flex flex-col gap-1">
//               {/* 1. ป้าย SALE (Mini) */}
//               {discountLabel ? (
//                 <Badge
//                   className="
//                   bg-[#E11D48] text-white border-none
//                   px-1.5 py-0.5 rounded-sm shadow-sm
//                   text-[9px] font-extrabold tracking-wide uppercase leading-none
//                   drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]
//                   [text-shadow:_0_1px_1px_rgba(0,0,0,0.8)]
//                   flex items-center gap-1
//                 "
//                 >
//                   {/* ไอคอน Tag เล็กลง */}
//                   <Tag className="w-2.5 h-2.5 fill-current drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]" />
//                   SALE {discountLabel}
//                 </Badge>
//               ) : (
//                 /* 2. ป้ายราคาปกติ (Mini) */
//                 <Badge
//                   className="bg-[#1169e6] text-white border-none
//                   px-1.5 py-0.5 rounded-sm shadow-sm
//                   text-[9px] font-bold tracking-wide leading-none
//                   [text-shadow:_0_1px_1px_rgba(0,0,0,0.8)]
//                   flex items-center gap-1
//                   drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]
//                 "
//                 >
//                   <Info className="w-2.5 h-2.5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]" />
//                   ราคาปกติ
//                 </Badge>
//               )}

//               {/* 3. สถานะสินค้า (Mini) */}
//               <div
//                 className={cn(
//                   "flex items-center gap-1 px-1.5 py-0.5 rounded-sm shadow-sm border-none backdrop-blur-md drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]",
//                   stockBadge.label === "สินค้าหมด"
//                     ? "bg-zinc-800 text-zinc-400"
//                     : stockBadge.label === "เหลือน้อย"
//                       ? "bg-[#EAB308] text-white"
//                       : "bg-[#059669] text-white",
//                 )}
//               >
//                 {/* จุดสี (Dot) เล็กลงเหลือ w-1 h-1 */}
//                 <div
//                   className={cn(
//                     "w-1 h-1 rounded-full shadow-sm",
//                     stockBadge.label === "สินค้าหมด"
//                       ? "bg-zinc-500"
//                       : stockBadge.label === "เหลือน้อย"
//                         ? "bg-[#EF4444]"
//                         : "bg-[#39FF14]",
//                   )}
//                 />
//                 <span className="text-[9px] font-bold tracking-wide leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
//                   {stockBadge.label}
//                 </span>
//               </div>
//             </div>
//           )}

//           {/* --- มุมขวาบน: ปรับตำแหน่งให้ชิดขอบมากขึ้น (right-1.5 top-1.5) --- */}
//           {!soldOut && (
//             <div className="absolute right-1.5 top-1.5 z-20 pointer-events-none">
//               {product.cod && (
//                 <Badge
//                   className="
//                   bg-[#FFC107] text-white border-none
//                   px-1.5 py-0.5 rounded-sm shadow-sm
//                   text-[9px] font-black tracking-tight leading-none
//                   [text-shadow:_0_1px_1px_rgba(0,0,0,0.8)]
//                   -translate-y-2
//                   drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]
//                 "
//                 >
//                   COD
//                 </Badge>
//               )}
//             </div>
//           )}

//           <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex translate-y-6 flex-col gap-1 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-4 pb-3 pt-12 text-xs text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
//             <span className="text-sm font-medium text-white/90">เริ่มต้น</span>
//             <span className="flex items-center gap-2 text-lg font-semibold text-white">
//               <ShoppingBag className="size-4 text-white/80" />
//               {priceLabel}
//             </span>
//             {basePriceLabel && (
//               <span className="text-xs font-medium text-white/70 line-through">
//                 {basePriceLabel}
//               </span>
//             )}
//           </div>
//         </div>
//         <CardContent className="hidden sm:flex flex-1 flex-col gap-3 px-4 py-4">
//           <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
//             <Badge
//               variant="outline"
//               className="border-primary/20 bg-primary/10 text-primary"
//             >
//               {categoryName}
//             </Badge>

//             {hasMoreVariants && (
//               <span className="rounded-full bg-muted px-3 py-1 text-[11px] uppercase tracking-wide text-muted-foreground">
//                 {variants.length} ตัวเลือก
//               </span>
//             )}
//           </div>

//           {weightOptions.length > 0 && (
//             <div className="mt-auto flex-wrap gap-2 hidden md:flex">
//               {weightOptions.map((variant) => (
//                 <span
//                   key={variant.id}
//                   className="rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-foreground shadow-sm"
//                 >
//                   {variant.weight.toLocaleString()} กรัม
//                 </span>
//               ))}
//               {hasMoreVariants && (
//                 <span className="rounded-full border border-dashed border-border/60 px-3 py-1 text-xs text-muted-foreground">
//                   +{variants.length - weightOptions.length} ขนาด
//                 </span>
//               )}
//             </div>
//           )}
//         </CardContent>
//         <CardFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-4 border-t border-border/60 bg-muted/30 px-2 md:px-4 py-3 text-xs">
//           {/* ด้านซ้าย (ชื่อ + ราคา + สต็อก + หมวดหมู่มือถือ) */}
//           <div className="flex flex-col leading-tight w-full sm:w-auto sm:max-w-[70%]">
//             <h3 className="font-medium flex items-center gap-0.5 md:gap-1 text-xs md:text-lg transition-all duration-300">
//               <Cannabis className="w-4 h-4 text-primary md:w-6 md:h-6 transition-transform" />

//               <span className="truncate max-w-[85%] md:max-w-[90%]">
//                 {product.title}
//               </span>
//             </h3>

//             <div className="flex items-center justify-between w-full">
//               <div className="flex items-center gap-1 md:gap-1.5 font-semibold text-foreground text-xs md:text-base transition-all duration-300">
//                 <ShoppingBag className="size-3 md:size-5 text-primary transition-transform" />
//                 {priceLabel}
//               </div>

//               <Badge
//                 variant="outline"
//                 className="border-primary/20 bg-primary/10 text-primary block md:hidden
//              text-[10px] px-1.5 py-0.5 rounded-sm"
//               >
//                 {categoryName}
//               </Badge>
//             </div>

//             {basePriceLabel && (
//               <span className="hidden md:inline text-xs font-medium text-muted-foreground line-through">
//                 {basePriceLabel}
//               </span>
//             )}

//             <span className="hidden sm:inline text-xs text-muted-foreground mt-1">
//               {product.stock > 0
//                 ? `เหลือ ${product.stock.toLocaleString()} กรัม`
//                 : "หมดแล้ว"}
//             </span>
//           </div>

//           <div className="sm:hidden w-full mt-2">
//             <button className="w-[95%] mx-auto flex items-center justify-center gap-2 py-2 bg-primary text-white rounded-md text-sm font-semibold active:scale-95 transition">
//               <ShoppingCart className="size-4" />
//               ซื้อเลย
//             </button>
//           </div>

//           <div className="hidden sm:flex items-center gap-2 text-primary shrink-0 text-xs">
//             <button className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-md text-xs font-semibold transition group">
//               <ShoppingCart className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
//               ซื้อเลย
//             </button>
//           </div>
//         </CardFooter>
//       </Card>
//     </Link>
//   );
// }

// import Image from "next/image";
// import Link from "next/link";
// import { useMemo } from "react";
// import { Cannabis, Info, ShoppingBag, ShoppingCart, Tag } from "lucide-react";

// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { formatPrice } from "@/lib/format-price";
// import { calculateDiscountPercent, getMaxDiscountPercent } from "@/lib/pricing";
// import { ProductWithMainImage } from "@/types/product";
// import { cn } from "@/lib/utils";

// const FALLBACK_IMAGE = "/images/no-product-image.webp";

// interface ProductCardProps {
//   product: ProductWithMainImage;
//   index?: number;
//   replacementTargetId?: string;
// }

// interface StockBadgeConfig {
//   label: string;
//   className: string;
//   dotColor: string;
// }

// const getStockBadge = (stock: number, lowStock: number): StockBadgeConfig => {
//   if (stock <= 0) {
//     return {
//       label: "สินค้าหมด",
//       className: "bg-zinc-800 text-zinc-400",
//       dotColor: "bg-zinc-500",
//     };
//   }

//   if (stock <= Math.max(lowStock, 0)) {
//     return {
//       label: "เหลือน้อย",
//       className: "bg-[#EAB308] text-white",
//       dotColor: "bg-[#EF4444]",
//     };
//   }

//   return {
//     label: "พร้อมส่ง",
//     className: "bg-[#059669] text-white",
//     dotColor: "bg-[#39FF14]",
//   };
// };

// export default function ProductCard({
//   product,
//   replacementTargetId,
//   index = 0,
// }: ProductCardProps) {
//   const variants = product.ProductWeight ?? [];
//   const productUrl = replacementTargetId
//     ? `/products/${product.id}?replacement_for=${replacementTargetId}`
//     : `/products/${product.id}`;

//   const {
//     primaryVariant,
//     discountPercent,
//     discountLabel,
//     priceLabel,
//     basePriceLabel,
//     weightOptions,
//     hasMoreVariants,
//   } = useMemo(() => {
//     let pv = variants[0];
//     if (variants.length > 1) {
//       let minPrice = Number(pv?.price ?? Number.MAX_SAFE_INTEGER);
//       for (let i = 1; i < variants.length; i++) {
//         const v = variants[i];
//         const price = Number(v.price ?? Number.MAX_SAFE_INTEGER);
//         if (price < minPrice) {
//           minPrice = price;
//           pv = v;
//         }
//       }
//     }

//     const currentPrice = pv?.price ?? null;
//     const basePrice = pv?.basePrice ?? null;

//     const primaryDiscount = calculateDiscountPercent(
//       Number(basePrice ?? 0),
//       Number(currentPrice ?? 0),
//     );

//     const dPercent = Math.round(
//       Math.max(primaryDiscount, getMaxDiscountPercent(variants)),
//     );
//     const dLabel = dPercent > 0 ? `-${dPercent}%` : null;

//     const pLabel =
//       typeof currentPrice === "number"
//         ? formatPrice(Number(currentPrice))
//         : "สอบถามราคา";

//     const bLabel =
//       typeof basePrice === "number" &&
//         typeof currentPrice === "number" &&
//         basePrice > currentPrice
//         ? formatPrice(Number(basePrice))
//         : null;

//     const wOptions = [...variants]
//       .filter((v) => typeof v.weight === "number" && !Number.isNaN(v.weight))
//       .sort((a, b) => Number(a.weight) - Number(b.weight))
//       .slice(0, 3);

//     const moreVariants = variants.length > wOptions.length;

//     return {
//       primaryVariant: pv,
//       discountPercent: dPercent,
//       discountLabel: dLabel,
//       priceLabel: pLabel,
//       basePriceLabel: bLabel,
//       weightOptions: wOptions,
//       hasMoreVariants: moreVariants,
//     };
//   }, [variants]);

//   const stockBadge = getStockBadge(product.stock, product.lowStock);
//   const categoryName = product.category?.name ?? "หมวดหมู่ไม่ระบุ";
//   const mainImageUrl = product.mainImage?.url ?? FALLBACK_IMAGE;
//   const soldOut = product.stock <= 0;

//   const isPriority = index < 4;

//   return (
//     <Link href={productUrl} className="group block h-full select-none">
//       <Card className="relative flex h-full flex-col overflow-hidden gap-0 border border-border/50 bg-background/60 p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl">
//         <div className="relative overflow-hidden">
//           <div className="relative aspect-square w-full overflow-hidden bg-muted/20">
//             <Image
//               alt={product.title}
//               src={mainImageUrl}
//               fill
//               className="object-cover transition duration-500 ease-out group-hover:scale-105"
//               sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
//               priority={isPriority}
//               loading={isPriority ? "eager" : "lazy"}
//             />

//             {soldOut && (
//               <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//                 <span className="bg-red-600/90 rounded-[5px] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
//                   สินค้าหมด
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* --- มุมซ้ายบน --- */}
//           {!soldOut && (
//             <div className="absolute left-1.5 top-1.5 z-20 flex flex-col items-start gap-1 pointer-events-none">
//               {/* 1. ป้าย SALE */}
//               {discountLabel ? (
//                 <Badge
//                   className="
//                   bg-[#E11D48] text-white border-none
//                   px-1.5 py-0.5 rounded-sm
//                   text-[9px] font-extrabold tracking-wide uppercase leading-none
//                   flex items-center gap-1
//                   /* ✅ ใส่เงาแบบ Box Shadow แต่สีเข้มเหมือน Drop Shadow เดิม */
//                   shadow-[0_1px_1px_rgba(0,0,0,0.8)]
//                   "
//                 >
//                   {/* ✅ ใส่ Drop Shadow แค่ที่ไอคอนและตัวหนังสือ (กินสเปคน้อยกว่าใส่ทั้งก้อน) */}
//                   <Tag className="w-2.5 h-2.5 fill-current drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]" />
//                   <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
//                     SALE {discountLabel}
//                   </span>
//                 </Badge>
//               ) : (
//                 /* 2. ป้ายราคาปกติ */
//                 <Badge
//                   className="
//                   bg-[#1169e6] text-white border-none
//                   px-1.5 py-0.5 rounded-sm
//                   text-[9px] font-bold tracking-wide leading-none
//                   flex items-center gap-1
//                   shadow-[0_1px_1px_rgba(0,0,0,0.8)]
//                   "
//                 >
//                   <Info className="w-2.5 h-2.5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]" />
//                   <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
//                     ราคาปกติ
//                   </span>
//                 </Badge>
//               )}

//               {/* 3. สถานะสินค้า (นำ backdrop-blur กลับมา) */}
//               <div
//                 className={cn(
//                   "flex items-center gap-1 px-1.5 py-0.5 rounded-sm border-none",
//                   // ✅ ใส่เงาเข้มแบบเดิม
//                   "shadow-[0_1px_1px_rgba(0,0,0,0.8)]",
//                   // ✅ นำ Backdrop Blur กลับมาตามคำขอ
//                   "backdrop-blur-md",
//                   stockBadge.className,
//                 )}
//               >
//                 <div
//                   className={cn(
//                     "w-1 h-1 rounded-full shadow-sm",
//                     stockBadge.dotColor,
//                   )}
//                 />
//                 <span className="text-[9px] font-bold tracking-wide leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
//                   {stockBadge.label}
//                 </span>
//               </div>
//             </div>
//           )}

//           {/* --- มุมขวาบน --- */}
//           {!soldOut && (
//             <div className="absolute right-1.5 top-1.5 z-20 pointer-events-none">
//               {product.cod && (
//                 <Badge
//                   className="
//                   bg-[#FFC107] text-white border-none
//                   px-1.5 py-0.5 rounded-sm
//                   text-[9px] font-black tracking-tight leading-none
//                   -translate-y-2
//                   shadow-[0_1px_1px_rgba(0,0,0,0.8)]
//                   "
//                 >
//                   <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
//                     COD
//                   </span>
//                 </Badge>
//               )}
//             </div>
//           )}

//           <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex translate-y-6 flex-col gap-1 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-4 pb-3 pt-12 text-xs text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
//             <span className="text-sm font-medium text-white/90">เริ่มต้น</span>
//             <span className="flex items-center gap-2 text-lg font-semibold text-white">
//               <ShoppingBag className="size-4 text-white/80" />
//               {priceLabel}
//             </span>
//             {basePriceLabel && (
//               <span className="text-xs font-medium text-white/70 line-through">
//                 {basePriceLabel}
//               </span>
//             )}
//           </div>
//         </div>

//         <CardContent className="hidden sm:flex flex-1 flex-col gap-3 px-4 py-4">
//           <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
//             <Badge
//               variant="outline"
//               className="border-primary/20 bg-primary/10 text-primary"
//             >
//               {categoryName}
//             </Badge>

//             {hasMoreVariants && (
//               <span className="rounded-full bg-muted px-3 py-1 text-[11px] uppercase tracking-wide text-muted-foreground">
//                 {variants.length} ตัวเลือก
//               </span>
//             )}
//           </div>

//           {weightOptions.length > 0 && (
//             <div className="mt-auto flex-wrap gap-2 hidden md:flex">
//               {weightOptions.map((variant) => (
//                 <span
//                   key={variant.id}
//                   className="rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-foreground shadow-sm"
//                 >
//                   {variant.weight.toLocaleString()} กรัม
//                 </span>
//               ))}
//               {hasMoreVariants && (
//                 <span className="rounded-full border border-dashed border-border/60 px-3 py-1 text-xs text-muted-foreground">
//                   +{variants.length - weightOptions.length} ขนาด
//                 </span>
//               )}
//             </div>
//           )}
//         </CardContent>

//         <CardFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-4 border-t border-border/60 bg-muted/30 px-2 md:px-4 py-3 text-xs">
//           <div className="flex flex-col leading-tight w-full sm:w-auto sm:max-w-[70%]">
//             <h3 className="font-medium flex items-center gap-0.5 md:gap-1 text-xs md:text-lg transition-all duration-300">
//               <Cannabis className="w-4 h-4 text-primary md:w-6 md:h-6 transition-transform" />
//               <span className="truncate max-w-[85%] md:max-w-[90%]">
//                 {product.title}
//               </span>
//             </h3>

//             <div className="flex items-center justify-between w-full">
//               <div className="flex items-center gap-1 md:gap-1.5 font-semibold text-foreground text-xs md:text-base transition-all duration-300">
//                 <ShoppingBag className="size-3 md:size-5 text-primary transition-transform" />
//                 {priceLabel}
//               </div>

//               <Badge
//                 variant="outline"
//                 className="border-primary/20 bg-primary/10 text-primary block md:hidden
//              text-[10px] px-1.5 py-0.5 rounded-sm"
//               >
//                 {categoryName}
//               </Badge>
//             </div>

//             {basePriceLabel && (
//               <span className="hidden md:inline text-xs font-medium text-muted-foreground line-through">
//                 {basePriceLabel}
//               </span>
//             )}

//             <span className="hidden sm:inline text-xs text-muted-foreground mt-1">
//               {product.stock > 0
//                 ? `เหลือ ${product.stock.toLocaleString()} กรัม`
//                 : "หมดแล้ว"}
//             </span>
//           </div>

//           <div className="sm:hidden w-full mt-2">
//             <div className="w-[95%] mx-auto flex items-center justify-center gap-2 py-2 bg-primary text-white rounded-md text-sm font-semibold active:scale-95 transition cursor-pointer shadow-sm">
//               <ShoppingCart className="size-4" />
//               ซื้อเลย
//             </div>
//           </div>

//           <div className="hidden sm:flex items-center gap-2 text-primary shrink-0 text-xs">
//             <div className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-md text-xs font-semibold transition group cursor-pointer hover:bg-primary/20">
//               <ShoppingCart className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
//               ซื้อเลย
//             </div>
//           </div>
//         </CardFooter>
//       </Card>
//     </Link>
//   );
// }

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { formatPrice } from "@/lib/format-price";
import { calculateDiscountPercent, getMaxDiscountPercent } from "@/lib/pricing";
import { ProductWithMainImage } from "@/types/product";
import { cn } from "@/lib/utils";
import { Tag, Truck } from "lucide-react"; // ✅ เพิ่มไอคอน

const FALLBACK_IMAGE = "/images/no-product-image.webp";

interface ProductCardProps {
  product: ProductWithMainImage;
  index?: number;
  replacementTargetId?: string;
}

// ✅ 1. นำ Logic สีสต็อกกลับมา (แต่ปรับให้เข้ากับดีไซน์ใหม่)
const getStockStatus = (stock: number, lowStock: number) => {
  if (stock <= 0) return { label: "สินค้าหมด", color: "red" };
  if (stock <= Math.max(lowStock, 0))
    return { label: "เหลือน้อย", color: "yellow" };
  return { label: "พร้อมขาย", color: "green" };
};

export default function ProductCard({
  product,
  replacementTargetId,
  index = 0,
}: ProductCardProps) {
  const variants = product.ProductWeight ?? [];

  const productUrl = replacementTargetId
    ? `/products/${product.id}?replacement_for=${replacementTargetId}`
    : `/products/${product.id}`;

  // ✅ 2. คำนวณราคาและส่วนลด (เหมือนเดิมเป๊ะ)
  const {
    priceLabel,
    basePriceLabel,
    discountLabel,
    weightOptions,
    hasMoreVariants,
  } = useMemo(() => {
    let pv = variants[0];
    if (variants.length > 1) {
      let minPrice = Number(pv?.price ?? Number.MAX_SAFE_INTEGER);
      for (let i = 1; i < variants.length; i++) {
        const v = variants[i];
        const price = Number(v.price ?? Number.MAX_SAFE_INTEGER);
        if (price < minPrice) {
          minPrice = price;
          pv = v;
        }
      }
    }

    const currentPrice = Number(pv?.price ?? 0);
    const basePrice = Number(pv?.basePrice ?? 0);

    // คำนวณ % ส่วนลดเพื่อโชว์ป้าย SALE
    const primaryDiscount = calculateDiscountPercent(basePrice, currentPrice);
    const dPercent = Math.round(
      Math.max(primaryDiscount, getMaxDiscountPercent(variants)),
    );
    const dLabel = dPercent > 0 ? `-${dPercent}%` : null;

    // เตรียมป้ายน้ำหนัก (Tags)
    const wOptions = [...variants]
      .filter((v) => typeof v.weight === "number" && !Number.isNaN(v.weight))
      .sort((a, b) => Number(a.weight) - Number(b.weight))
      .slice(0, 3); // เอาแค่ 3 อันแรก

    return {
      priceLabel: formatPrice(currentPrice),
      basePriceLabel: basePrice > currentPrice ? formatPrice(basePrice) : null,
      discountLabel: dLabel,
      weightOptions: wOptions,
      hasMoreVariants: variants.length > wOptions.length,
    };
  }, [variants]);

  const mainImageUrl = product.mainImage?.url ?? FALLBACK_IMAGE;
  const stockStatus = getStockStatus(product.stock, product.lowStock);
  const isSoldOut = product.stock <= 0;
  const isPriority = index < 4;
  const categoryName = product.category?.name;

  return (
    <Link href={productUrl} className="block h-full group select-none">
      {/* Container: ดีไซน์ใหม่ ขอบบาง มีเงา */}
      <div className="relative flex h-full flex-col rounded-2xl bg-card text-card-foreground transition-all duration-300 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-emerald-500/50 hover:shadow-md hover:-translate-y-1">
        {/* --- ส่วนรูปภาพ --- */}
        <div className="p-2 md:p-3 pb-0">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-900">
            <Image
              alt={product.title}
              src={mainImageUrl}
              fill
              unoptimized={true}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              // sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
              priority={isPriority}
            />

            {/* Overlay สินค้าหมด */}
            {isSoldOut && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                <span className="bg-red-600/90 rounded-[5px] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white shadow-sm">
                  สินค้าหมด
                </span>
              </div>
            )}

            {/* ✅ 3. ป้าย SALE (มุมซ้ายบน) - แทนที่ PREMIUM ถ้ามีส่วนลด */}
            {!isSoldOut && (
              <div className="absolute top-1.5 left-1.5 z-20 flex flex-col gap-1">
                {discountLabel ? (
                  <div className="flex items-center gap-1 rounded-[4px] bg-[#E11D48] px-1.5 py-0.5 shadow-sm">
                    <Tag className="w-2.5 h-2.5 text-white fill-white" />
                    <span className="text-[9px] font-bold uppercase tracking-wide text-white">
                      SALE {discountLabel}
                    </span>
                  </div>
                ) : (
                  // ถ้าไม่ลดราคา โชว์คำว่า PREMIUM หรือ New แทนก็ได้
                  <div className="flex items-center gap-1 rounded-[4px] bg-zinc-800/80 backdrop-blur-md px-1.5 py-0.5 shadow-sm border border-zinc-700">
                    <span className="text-[8px] font-bold uppercase tracking-wide text-zinc-300">
                      PREMIUM
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* ✅ 4. ป้าย COD (มุมขวาบน) */}
            {!isSoldOut && product.cod && (
              <div className="absolute top-1.5 right-1.5 z-20">
                <div className="flex items-center gap-1 rounded-[4px] bg-[#EAB308] text-white px-1.5 py-0.5 shadow-sm">
                  <Truck className="w-2.5 h-2.5" />
                  <span className="text-[8px] font-bold uppercase tracking-tight">
                    COD
                  </span>
                </div>
              </div>
            )}

            {/* ป้ายราคา Capsule (มุมขวาล่าง) */}
            {!isSoldOut && (
              <div className="absolute bottom-1.5 right-1.5 z-20">
                <div className="bg-background/80 backdrop-blur-md px-2 py-[1px] rounded-full border border-border flex items-center shadow-sm">
                  <span className="text-[9px] md:text-[10px] font-bold text-foreground leading-none">
                    {priceLabel.replace("฿", "")} THB
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- ส่วนเนื้อหา --- */}
        <div className="flex flex-1 flex-col p-3 pt-2">
          {/* หมวดหมู่ (ตัวเล็กๆ บนชื่อ) */}
          {categoryName && (
            <div className="inline-flex items-center px-2 py-[2px] rounded-md bg-emerald-500/10 border border-emerald-500/20 w-fit mb-1.5">
              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 leading-none">
                {categoryName}
              </span>
            </div>
          )}

          <h3 className="line-clamp-1 text-xs md:text-sm font-bold text-slate-600 dark:text-slate-200 mb-1 group-hover:text-emerald-600 transition-colors">
            {product.title}
          </h3>

          {/* ✅ 5. Tags น้ำหนัก (เฉพาะจอใหญ่เหมือนเดิม) */}
          {weightOptions.length > 0 && (
            <div className="hidden md:flex flex-wrap gap-1 mb-2">
              {weightOptions.map((v) => (
                <span
                  key={v.id}
                  className="text-[9px] px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700"
                >
                  {v.weight}g
                </span>
              ))}
              {hasMoreVariants && (
                <span className="text-[9px] text-zinc-400 self-center">
                  ...
                </span>
              )}
            </div>
          )}

          {/* Label PRICE */}
          <div className="flex items-center gap-1.5 mb-1 mt-auto">
            <div className="h-3 w-[3px] rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
            <span className="text-[10px] font-semibold tracking-widest text-zinc-400 uppercase">
              ราคาสินค้า
            </span>
          </div>

          <div className="flex items-end justify-between mb-1">
            <div className="flex items-baseline gap-2">
              {basePriceLabel && (
                <span className="text-[10px] text-zinc-500 line-through">
                  {basePriceLabel}
                </span>
              )}
              <span className="text-xs md:text-sm font-extrabold text-[#EF4444]">
                {priceLabel}
              </span>
            </div>

            {/* ✅ 6. ป้ายสถานะ (มีเหลือง/เขียว/แดง ตาม Logic) */}
            <div
              className={cn(
                "px-2 py-[2px] rounded-full border mb-0.5",
                stockStatus.color === "green" &&
                  "bg-green-500/10 border-green-500/20 text-green-500",
                stockStatus.color === "yellow" &&
                  "bg-yellow-500/10 border-yellow-500/20 text-yellow-500",
                stockStatus.color === "red" &&
                  "bg-red-500/10 border-red-500/20 text-red-500",
              )}
            >
              <span className="text-[8px] font-bold block leading-none">
                {stockStatus.label}
              </span>
            </div>
          </div>

          {/* ปุ่มสั่งซื้อ */}
          <div>
            <button className="w-full rounded-xl bg-emerald-600 py-1.5 text-[10px] md:text-xs font-bold text-white shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/40 active:scale-95">
              สั่งซื้อสินค้า
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
