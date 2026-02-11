// import { CardGridSkeleton } from "@/components/skeletons/card-grid-skeleton";
// import { listRecommendedProducts } from "@/services/products";
// import Link from "next/link";
// import { Suspense } from "react";
// import Image from "next/image";

// async function RecommendedProductsContent() {
//   const products = await listRecommendedProducts(20);

//   if (!products.length) {
//     return null;
//   }

//   return (
//     <section className="container mx-auto space-y-6  py-5">
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         {/* <div>
//           <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
//             สินค้าแนะนำจากยอดขาย
//           </h2>
//           <p className="text-sm text-muted-foreground md:text-base">
//             สินค้าที่ลูกค้าชื่นชอบมากที่สุดในช่วงนี้
//           </p>
//         </div> */}

//         <div className="ml-1">
//           <h2 className="text-xl font-semibold text-foreground md:text-2xl">
//             สินค้าแนะนำจากยอดขาย
//           </h2>
//           <p className="text-xs text-muted-foreground md:text-sm">
//             สินค้าที่ลูกค้าชื่นชอบมากที่สุดในช่วงนี้
//           </p>
//         </div>

//         {/* <Link
//           href="/products"
//           className="rounded-full border border-border/60 bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted"
//         >
//           ดูสินค้าทั้งหมด
//         </Link> */}

//         <Link
//           href="/products"
//           className="rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm hover:bg-muted"
//         >
//           ดูสินค้าทั้งหมด
//         </Link>
//       </div>

//       <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
//         {products.map((product) => (
//           <Link
//             key={product.id}
//             href={`/products/${product.id}`}
//             className="group flex flex-col space-y-3 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
//           >
//             <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted/50">
//               {product.mainImageUrl ? (
//                 <Image
//                   src={product.mainImageUrl}
//                   alt={product.title}
//                   fill
//                   className="object-cover transition-transform duration-300 group-hover:scale-105"
//                   loading="lazy"
//                   decoding="async"
//                   sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 25vw"
//                 />
//               ) : (
//                 <div className="flex h-full w-full items-center justify-center text-muted-foreground">
//                   ไม่มีรูปภาพ
//                 </div>
//               )}
//             </div>
//             <div className="space-y-1">
//               <h3 className="line-clamp-1 text-sm font-semibold text-foreground md:text-base">
//                 {product.title}
//               </h3>
//               <p className="text-xs text-muted-foreground">
//                 ยอดขาย {product.totalSold.toLocaleString()} ชิ้น
//               </p>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </section>
//   );
// }

// export function RecommendedProducts() {
//   return (
//     <Suspense
//       fallback={<CardGridSkeleton className="container mx-auto px-4 py-8" />}
//     >
//       <RecommendedProductsContent />
//     </Suspense>
//   );
// }

// app/(...)/RecommendedProducts.tsx หรือที่ path เดิมของคุณ
// import { Suspense } from "react";
// import Link from "next/link";
// import Image from "next/image";

// import { CardGridSkeleton } from "@/components/skeletons/card-grid-skeleton";
// import { listRecommendedProducts } from "@/services/products";

// // ✅ ให้เซกชันนี้ถูก cache บน server เพื่อลดโหลด DB/API
// // ปรับเป็น 60 / 300 วินาทีตามที่คุณต้องการได้
// export const revalidate = 120;

// interface RecommendedProduct {
//   id: string | number;
//   title: string;
//   mainImageUrl?: string | null;
//   totalSold: number;
// }

// async function RecommendedProductsContent() {
//   let products: RecommendedProduct[] = [];

//   try {
//     const result = await listRecommendedProducts(20);
//     products = (result ?? []) as RecommendedProduct[];
//   } catch (error) {
//     // ✅ log ฝั่ง server แต่ไม่โชว์รายละเอียดให้ user (ปลอดภัยกว่า)
//     console.error("Failed to load recommended products:", error);

//     return (
//       <section className="container mx-auto py-5">
//         <div className="rounded-2xl border border-border/60 bg-card/70 px-4 py-6 text-sm text-muted-foreground">
//           ไม่สามารถโหลดสินค้าแนะนำได้ในขณะนี้ กรุณาลองใหม่อีกครั้งภายหลัง
//         </div>
//       </section>
//     );
//   }

//   if (!products.length) {
//     // ไม่มีสินค้าแนะนำ → ไม่ต้อง render section นี้
//     return null;
//   }

//   return (
//     <section className="container mx-auto space-y-6 py-5">
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <div className="ml-1">
//           <h2 className="text-xl font-semibold text-foreground md:text-2xl">
//             สินค้าแนะนำจากยอดขาย
//           </h2>
//           <p className="text-xs text-muted-foreground md:text-sm">
//             สินค้าที่ลูกค้าชื่นชอบมากที่สุดในช่วงนี้
//           </p>
//         </div>

//         <Link
//           href="/products"
//           className="rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm hover:bg-muted"
//         >
//           ดูสินค้าทั้งหมด
//         </Link>
//       </div>

//       <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
//         {products.map((product) => {
//           const safeId = encodeURIComponent(String(product.id ?? "")); // ✅ ป้องกัน path แปลก ๆ
//           const hasImage = Boolean(product.mainImageUrl);

//           return (
//             <Link
//               key={product.id}
//               href={`/products/${safeId}`}
//               className="group flex flex-col space-y-3 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
//             >
//               <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted/50">
//                 {hasImage ? (
//                   <Image
//                     src={product.mainImageUrl as string}
//                     alt={product.title}
//                     fill
//                     // ✅ ลดคุณภาพเล็กน้อยให้โหลดเร็วขึ้นแต่ยังคมพอใช้
//                     // quality={70}
//                     loading="lazy"
//                     decoding="async"
//                     sizes="(max-width: 640px) 45vw, (max-width:1024px) 30vw, 20vw"
//                     className="object-cover transition-transform duration-300 group-hover:scale-105"
//                   />
//                 ) : (
//                   <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
//                     ไม่มีรูปภาพ
//                   </div>
//                 )}
//               </div>

//               <div className="space-y-1">
//                 <h3 className="line-clamp-1 text-sm font-semibold text-foreground md:text-base">
//                   {product.title}
//                 </h3>
//                 <p className="text-xs text-muted-foreground">
//                   ยอดขาย {Number(product.totalSold || 0).toLocaleString()} ชิ้น
//                 </p>
//               </div>
//             </Link>
//           );
//         })}
//       </div>
//     </section>
//   );
// }

// export function RecommendedProducts() {
//   return (
//     <Suspense
//       fallback={<CardGridSkeleton className="container mx-auto px-4 py-8" />}
//     >
//       <RecommendedProductsContent />
//     </Suspense>
//   );
// }

// import { Suspense } from "react";
// import Link from "next/link";
// import Image from "next/image";

// import { CardGridSkeleton } from "@/components/skeletons/card-grid-skeleton";
// import { listRecommendedProducts } from "@/services/products";

// // Cache หน้า 2 นาที (ปรับได้ตามต้องการ)
// export const revalidate = 120;

// interface RecommendedProduct {
//   id: string | number;
//   title: string;
//   mainImageUrl?: string | null;
//   totalSold: number;
// }

// /* ---------------------------------------------
//    Server Component: ดึงข้อมูล + จัดการ error
// ---------------------------------------------- */
// async function RecommendedProductsContent() {
//   let products: RecommendedProduct[] = [];

//   try {
//     products = await listRecommendedProducts(20);
//   } catch (error) {
//     console.error("❌ Failed to load recommended products:", error);

//     return (
//       <section className="container mx-auto py-6">
//         <div className="rounded-2xl border bg-card/70 px-4 py-6 text-sm text-muted-foreground">
//           ไม่สามารถโหลดสินค้าแนะนำได้ กรุณาลองใหม่อีกครั้งในภายหลัง
//         </div>
//       </section>
//     );
//   }

//   if (!products?.length) return null;

//   return (
//     <section className="container mx-auto space-y-6 py-5">
//       {/* Header */}
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <div className="ml-1">
//           <h2 className="text-xl font-semibold md:text-2xl">
//             สินค้าแนะนำจากยอดขาย
//           </h2>
//           <p className="text-xs text-muted-foreground md:text-sm">
//             สินค้าที่ลูกค้าชื่นชอบมากที่สุดในช่วงนี้
//           </p>
//         </div>

//         <Link
//           href="/products"
//           className="rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-muted"
//         >
//           ดูสินค้าทั้งหมด
//         </Link>
//       </div>

//       {/* Product Grid */}
//       <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
//         {products.map((product) => {
//           const safeId = encodeURIComponent(String(product.id ?? ""));
//           const img = product.mainImageUrl;

//           return (
//             <Link
//               key={product.id}
//               href={`/products/${safeId}`}
//               className="group flex flex-col space-y-3 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
//             >
//               <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted/50">
//                 {img ? (
//                   <Image
//                     src={img}
//                     alt={product.title}
//                     fill
//                     loading="lazy"
//                     decoding="async"
//                     // ⭐ Next.js 15–16 จะ optimize ให้เองตาม device
//                     sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
//                     className="object-cover transition-transform duration-300 group-hover:scale-105"
//                   />
//                 ) : (
//                   <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
//                     ไม่มีรูปภาพ
//                   </div>
//                 )}
//               </div>

//               {/* Text */}
//               <div className="space-y-1">
//                 <h3 className="line-clamp-1 text-sm font-semibold md:text-base">
//                   {product.title}
//                 </h3>
//                 <p className="text-xs text-muted-foreground">
//                   ยอดขาย {Number(product.totalSold || 0).toLocaleString()} ชิ้น
//                 </p>
//               </div>
//             </Link>
//           );
//         })}
//       </div>
//     </section>
//   );
// }

// /* ---------------------------------------------
//    Suspense Wrapper (รองรับ Streaming)
// ---------------------------------------------- */
// export function RecommendedProducts() {
//   return (
//     <Suspense
//       fallback={<CardGridSkeleton className="container mx-auto px-4 py-8" />}
//     >
//       <RecommendedProductsContent />
//     </Suspense>
//   );
// }

// import { Suspense } from "react";
// import Link from "next/link";
// import Image from "next/image";

// import { CardGridSkeleton } from "@/components/skeletons/card-grid-skeleton";
// import { listRecommendedProducts } from "@/services/products";
// import { Star } from "lucide-react";

// // Cache หน้า 2 นาที
// export const revalidate = 120;

// interface RecommendedProduct {
//   id: string | number;
//   title: string;
//   mainImageUrl?: string | null;
//   totalSold: number;
//   unitLabel?: string | null;
// }

// /* ---------------------------------------------
//    ⭐ Badge Component (Pure Server, No Hydration)
// ---------------------------------------------- */
// function BestSellerBadge() {
//   return (
//     <div className="absolute inset-x-0 top-1 z-30 flex items-start justify-between px-2">
//       {/* ไอคอนดาว */}
//       <Star
//         className="w-5 h-5 text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
//         fill="currentColor"
//       />

//       {/* Badge */}
//       <div
//         className="
//           flex items-center gap-1 mt-[2px] px-1.5 py-[2px]
//           text-[10px] font-bold
//           rounded-md
//           bg-gradient-to-r from-red-600 via-red-500 to-red-600
//           text-white
//           shadow-[0_2px_6px_rgba(0,0,0,0.35)]
//           border border-red-300/40
//           backdrop-blur-[1.5px]
//           relative
//         "
//       >
//         <div className="absolute inset-0 rounded-md ring-1 ring-white/20 pointer-events-none"></div>

//         <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
//           Best sale🔥
//         </span>
//       </div>
//     </div>
//   );
// }

// /* ---------------------------------------------
//    Server Component: ดึงข้อมูล + จัดการ error
// ---------------------------------------------- */
// async function RecommendedProductsContent() {
//   let products: RecommendedProduct[] = [];

//   try {
//     products = await listRecommendedProducts(20);
//   } catch (error) {
//     console.error("❌ Failed to load recommended products:", error);

//     return (
//       <section className="container mx-auto py-6">
//         <div className="rounded-2xl border bg-card/70 px-4 py-6 text-sm text-muted-foreground">
//           ไม่สามารถโหลดสินค้าแนะนำได้ กรุณาลองใหม่อีกครั้งในภายหลัง
//         </div>
//       </section>
//     );
//   }

//   if (!products?.length) return null;

//   return (
//     <section className="container mx-auto space-y-6 mb-5">
//       {/* Header */}
//       {/* <div className="flex flex-wrap items-center justify-between gap-3">
//         <div className="ml-1">
//           <h2 className="text-xl font-semibold md:text-2xl">
//             สินค้าแนะนำจากยอดขาย
//           </h2>
//           <p className="text-xs text-muted-foreground md:text-sm">
//             สินค้าที่ลูกค้าชื่นชอบมากที่สุดในช่วงนี้
//           </p>
//         </div>

//         <Link
//           href="/products"
//           className="rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-muted"
//         >
//           ดูสินค้าทั้งหมด
//         </Link>
//       </div> */}
//       {/* Header */}
//       <div className="flex flex-wrap items-center justify-between gap-3 px-1">
//         {/* 1. ส่วนหัวข้อ: เปลี่ยนเป็นไอคอนสื่อความหมาย (Fire/Hot) */}
//         <div className="flex items-center gap-3">
//           {/* Icon Container */}
//           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.15)]">
//             <div className="relative">
//               {/* ไอคอน Trophy */}
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 24 24"
//                 fill="currentColor"
//                 className="w-5 h-5"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.348v.262zm9.42 3.294c.546-.974.857-2.098.857-3.294v-.262c.67.103 1.338.22 2.006.348.114.717.156 1.45.12 2.194a5.266 5.266 0 01-2.983 1.014z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </div>
//           </div>

//           <div>
//             <h2 className="text-lg font-bold md:text-xl flex items-center gap-1.5">
//               <span>สินค้าขายดี</span>
//               <span className="text-[10px] font-extrabold uppercase tracking-wide text-white bg-orange-500 px-1.5 py-0.5 rounded-sm -rotate-6">
//                 HOT
//               </span>
//             </h2>
//             <p className="text-xs text-muted-foreground">
//               การันตีจากยอดสั่งซื้อจริง
//             </p>
//           </div>
//         </div>

//         {/* 2. ปุ่มดูทั้งหมด: เปลี่ยนสีใหม่ (เขียว) แต่ขนาดเท่าเดิม */}
//         <Link
//           href="/products"
//           // px-3 py-1.5 เท่าเดิม
//           // เปลี่ยน bg-card -> bg-emerald-600 (สีเขียว)
//           // เปลี่ยน text-xs -> text-xs text-white
//           className="
//             relative overflow-hidden rounded-full
//             bg-emerald-600 border border-emerald-500/50
//             px-3 py-1.5 text-xs font-medium text-white
//             shadow-md transition-all duration-300
//             hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5
//             active:scale-95
//             group
//           "
//         >
//           <span className="relative z-10 flex items-center gap-1">
//             ดูทั้งหมด
//             {/* ลูกศรขยับเมื่อ Hover */}
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="12"
//               height="12"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="3"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className="transition-transform duration-300 group-hover:translate-x-1"
//             >
//               <path d="m9 18 6-6-6-6" />
//             </svg>
//           </span>
//         </Link>
//       </div>

//       {/* Product Grid */}
//       <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
//         {products.map((product, index) => {
//           const unit = product.unitLabel || "ชิ้น";
//           const safeId = encodeURIComponent(String(product.id ?? ""));
//           const img = product.mainImageUrl;
//           const totalSold = Number(product.totalSold || 0);

//           // ⭐ Logic Best Seller
//           const isBestSeller = totalSold >= 5;

//           return (
//             <Link
//               key={product.id}
//               href={`/products/${safeId}`}
//               className={`
//                 group relative flex flex-col space-y-3 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm
//                 transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-md
//                 ${isBestSeller ? "pt-8" : ""}
//               `}
//             >
//               {/* ⭐ Badge */}
//               {isBestSeller && <BestSellerBadge />}

//               {/* รูปสินค้า */}
//               <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted/50">
//                 {img ? (
//                   <Image
//                     src={img}
//                     alt={product.title}
//                     fill
//                     // loading="lazy"
//                     priority={index < 4}
//                     decoding="async"
//                     sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
//                     className="object-cover transition-transform duration-300 group-hover:scale-105"
//                   />
//                 ) : (
//                   <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
//                     ไม่มีรูปภาพ
//                   </div>
//                 )}
//               </div>

//               {/* Text */}
//               <div className="space-y-1">
//                 <h3 className="line-clamp-1 text-sm font-semibold md:text-base">
//                   {product.title}
//                 </h3>
//                 {/* <p className="text-xs text-muted-foreground">
//                   ยอดขาย {totalSold.toLocaleString()} ชิ้น
//                 </p> */}
//                 <p className="text-xs text-muted-foreground">
//                   ยอดขาย {Number(product.totalSold).toLocaleString()} {unit}
//                 </p>
//               </div>
//             </Link>
//           );
//         })}
//       </div>
//     </section>
//   );
// }

// /* ---------------------------------------------
//    Suspense Wrapper (รองรับ Streaming)
// ---------------------------------------------- */
// export function RecommendedProducts() {
//   return (
//     <Suspense
//       fallback={<CardGridSkeleton className="container mx-auto px-4 py-8" />}
//     >
//       <RecommendedProductsContent />
//     </Suspense>
//   );
// }


import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";

import { CardGridSkeleton } from "@/components/skeletons/card-grid-skeleton";
import { listRecommendedProducts } from "@/services/products";

// Cache หน้า 2 นาที
export const revalidate = 120;

interface RecommendedProduct {
  id: string | number;
  title: string;
  mainImageUrl?: string | null;
  totalSold: number;
  unitLabel?: string | null;
  price?: number;
  originalPrice?: number;
  stock?: number;
}

/* ---------------------------------------------
   Server Component: ดึงข้อมูล + จัดการ error
---------------------------------------------- */
async function RecommendedProductsContent() {
  let products: RecommendedProduct[] = [];

  try {
    products = await listRecommendedProducts(20);
  } catch (error) {
    console.error("❌ Failed to load recommended products:", error);
    return null;
  }

  if (!products?.length) return null;

  return (
    <section className="container mx-auto space-y-4 mb-5 px-2 md:px-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.15)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 md:w-5 md:h-5"
            >
              <path
                fillRule="evenodd"
                d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.348v.262zm9.42 3.294c.546-.974.857-2.098.857-3.294v-.262c.67.103 1.338.22 2.006.348.114.717.156 1.45.12 2.194a5.266 5.266 0 01-2.983 1.014z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold flex items-center gap-1.5">
              <span>สินค้าขายดี</span>
              <span className="text-[9px] md:text-[10px] font-extrabold uppercase text-white bg-orange-500 px-1.5 py-0.5 rounded-sm -rotate-6">
                HOT
              </span>
            </h2>

            <p className="text-xs text-muted-foreground">
              การันตีจากยอดสั่งซื้อจริง{" "}
            </p>
          </div>
        </div>

        <Link
          href="/products"
          className="
    group flex items-center gap-1.5 
    rounded-full border border-emerald-500/30 bg-emerald-500/10 
    px-3 py-1.5 text-[10px] md:text-xs font-bold text-emerald-500 
    transition-all duration-300 
    hover:border-emerald-500 hover:bg-emerald-500 hover:text-white 
    hover:shadow-[0_0_12px_rgba(16,185,129,0.4)] 
    active:scale-95
  "
        >
          <span>ดูทั้งหมด</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      </div>

      {/* Product Grid: 2 Columns */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {products.map((product, index) => {
          const safeId = encodeURIComponent(String(product.id ?? ""));
          const img = product.mainImageUrl;
          const totalSold = Number(product.totalSold || 0);
          const unit = product.unitLabel || "ชิ้น";
          const isBestSeller = totalSold >= 5;
          const price = product.price ?? 990;
          const originalPrice = product.originalPrice ?? 1290;

          return (
            <Link
              key={product.id}
              href={`/products/${safeId}`}
              className="block h-full group"
            >
              {/* Card Container: bg ดำเข้ม, ขอบเทา, มน */}
              <div className="relative flex h-full flex-col rounded-2xl bg-[#0F0F0F] border border-zinc-800 transition-all duration-300 hover:border-emerald-500/50 hover:-translate-y-1">
                {/* --- ส่วนรูปภาพ (มี Padding p-2 หรือ p-3 เพื่อให้รูปไม่ชนขอบ) --- */}
                <div className="p-2 md:p-3 pb-0">
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-900">
                    {img ? (
                      <Image
                        src={img}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                        priority={index < 4}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-zinc-500">
                        No Image
                      </div>
                    )}

                    {/* ⭐ Best Seller Ribbon (อยู่ภายในกรอบรูป) */}
                    {isBestSeller && (
                      <div className="absolute -right-[24px] top-[14px] z-20 w-[90px] rotate-45 bg-[#E11D48] py-[2px] text-center text-[7px] md:text-[8px] font-bold uppercase tracking-wider text-white shadow-sm">
                        Best Seller
                      </div>
                    )}

                    {/* Badge มุมซ้ายล่าง (ในรูป) */}
                    <div className="absolute bottom-1.5 left-1.5 z-20">
                      <div className="flex items-center gap-1 rounded-[4px] bg-gradient-to-r from-purple-600 to-indigo-600 px-2 py-0.5 shadow-sm">
                        <span className="text-[6px] md:text-[7px] font-bold uppercase tracking-wide text-white">
                          PREMIUM
                        </span>
                      </div>
                    </div>

                    {/* Price Tag มุมขวาล่าง (ในรูป) */}
                    <div className="absolute bottom-1.5 right-1.5 z-20">
                      <div className="bg-zinc-900/90 backdrop-blur-sm px-2 py-0.5 rounded-full border border-zinc-700">
                        <span className="text-[9px] md:text-[10px] font-bold text-white">
                          {price} THB
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- เนื้อหา (ด้านล่าง) --- */}
                <div className="flex flex-1 flex-col p-3 pt-2">
                  {/* ชื่อสินค้า */}
                  <h3 className="line-clamp-1 text-xs md:text-sm font-bold text-white mb-1">
                    {product.title}
                  </h3>

                  <p className="text-[9px] text-zinc-500 mb-2">ราคาสินค้า</p>

                  {/* ราคา (ขีดฆ่า + ราคาแดง) */}
                  <div className="flex items-end justify-between mb-3">
                    <div className="flex items-baseline gap-2">
                      {originalPrice && originalPrice > price && (
                        <span className="text-[10px] text-zinc-500 line-through">
                          ฿{originalPrice.toLocaleString()}
                        </span>
                      )}
                      <span className="text-sm md:text-base font-extrabold text-[#EF4444]">
                        ฿{price.toLocaleString()}
                      </span>
                    </div>

                    {/* Badge สถานะ (พร้อมขาย) */}
                    <div className="bg-green-500/10 px-2 py-[2px] rounded-full border border-green-500/20">
                      <span className="text-[8px] font-bold text-green-500 block leading-none">
                        พร้อมขาย
                      </span>
                    </div>
                  </div>

                  {/* ปุ่มสั่งซื้อ (ขาว มนๆ) */}
                  <div className="mt-auto space-y-1.5">
                    <button className="w-full rounded-xl bg-white py-1.5 text-[10px] md:text-xs font-bold text-black shadow-sm transition-transform active:scale-95 hover:bg-zinc-100">
                      สั่งซื้อสินค้า
                    </button>

                    {/* ✅ เปลี่ยนเป็นยอดขาย ตามที่ขอ */}
                    <div className="text-center">
                      <span className="text-[9px] text-zinc-500">
                        ยอดขาย {Number(product.totalSold).toLocaleString()}{" "}
                        {unit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function RecommendedProducts() {
  return (
    <Suspense
      fallback={<CardGridSkeleton className="container mx-auto px-4 py-8" />}
    >
      <RecommendedProductsContent />
    </Suspense>
  );
}
