// import { ArrowRight, BadgeCheck, Megaphone } from "lucide-react";
// import CategorySection from "./category-section";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { unstable_cache } from "next/cache";
// import { listFeaturedProducts } from "@/services/products";
// import { listCategorySummaries } from "@/services/categories";
// import { RecommendedProducts } from "../recommended-products";
// import { MarqueeTextFeature } from "@/components/layouts/header/marquee-text-feature";

// const getFeatureProducts = unstable_cache(
//   async () => {
//     try {
//       return await listFeaturedProducts();
//     } catch (error) {
//       console.error(error);
//       return [];
//     }
//   },
//   ["get-feature-products"],
//   { tags: ["products"], revalidate: 60 * 15 }
// );

// const getHomeCategories = unstable_cache(
//   async () => {
//     try {
//       return await listCategorySummaries();
//     } catch (error) {
//       console.error(error);
//       return [];
//     }
//   },
//   ["get-home-categories"],
//   { tags: ["categories"], revalidate: 60 * 60 }
// );

// export default async function FeatureProducts() {
//   const [products, categories] = await Promise.all([
//     getFeatureProducts(),
//     getHomeCategories(),
//   ]);

//   return (
//     <section className="container mx-auto px-4 py-1">
//       {/* ✅ ส่วนหัว */}
//       <div className="flex flex-wrap justify-between items-center mb-1">
//         <div className="flex items-center gap-2 px-2 py-1 bg-linear-to-r from-green-100 to-green-50 text-green-800 rounded-2xl shadow-md w-fit border border-green-200">
//           <div className="bg-green-500 p-1 rounded-full">
//             <BadgeCheck size={20} className="text-white" />
//           </div>
//           <span className="text-xs md:text-xl font-semibold">
//             สินค้าดี ราคาถูก ส่งรวดเร็ว
//           </span>
//         </div>

//         <CategorySection categories={categories} products={products} />

//         <div className="flex items-center justify-between w-full mt-4 mb-2">
//           <h3 className="text-base md:text-3xl font-extrabold text-muted-foreground flex items-center gap-2 tracking-wide">
//             <span className="inline-block w-[3px] h-4 md:h-7 bg-primary rounded-sm" />
//             ของเด็ดประจำร้าน
//           </h3>

//           <Button
//             variant="ghost"
//             className="group px-4 py-2 rounded-full bg-linear-to-r from-green-400 to-green-500 text-white text-xs font-medium whitespace-nowrap"
//           >
//             <Link href="/cart" className="flex items-center gap-2">
//               <span>ดูสินค้าในตะกร้า</span>
//               <ArrowRight
//                 size={16}
//                 className="transition-transform group-hover:translate-x-1"
//               />
//             </Link>
//           </Button>
//         </div>
//       </div>

//       {/* ✅ กล่องประกาศ + marquee */}
//       <div className="marquee-container flex items-center gap-0.5">
//         {/* กล่องประกาศ */}
//         <div className="flex items-center gap-1 rounded-[5px] bg-yellow-200 text-red-500 px-3 py-1 shadow-sm w-max">
//           <Megaphone size={16} className="text-black" />
//           <span className="text-xs md:text-sm font-medium">ประกาศ</span>
//         </div>

//         {/* ✅ ข้อความเลื่อน */}
//         <div className="overflow-hidden w-full">
//           <MarqueeTextFeature running={true} />
//         </div>
//       </div>

//       {/* ✅ สินค้าแนะนำ */}
//       <RecommendedProducts />
//     </section>
//   );
// }

// import { ArrowRight, BadgeCheck, Megaphone } from "lucide-react";
// import CategorySection from "./category-section";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { unstable_cache } from "next/cache";
// import { listFeaturedProducts } from "@/services/products";
// import { listCategorySummaries } from "@/services/categories";
// import { RecommendedProducts } from "../recommended-products";
// import { MarqueeTextFeature } from "@/components/layouts/header/marquee-text-feature";

// const getFeatureProducts = unstable_cache(
//   async () => {
//     try {
//       return await listFeaturedProducts();
//     } catch (error) {
//       console.error(error);
//       return [];
//     }
//   },
//   ["get-feature-products"],
//   { tags: ["products"], revalidate: 60 * 15 }
// );

// const getHomeCategories = unstable_cache(
//   async () => {
//     try {
//       return await listCategorySummaries();
//     } catch (error) {
//       console.error(error);
//       return [];
//     }
//   },
//   ["get-home-categories"],
//   { tags: ["categories"], revalidate: 60 * 60 }
// );

// export default async function FeatureProducts() {
//   const [products, categories] = await Promise.all([
//     getFeatureProducts(),
//     getHomeCategories(),
//   ]);

//   return (
//     <section className="container mx-auto px-4 py-1">
//       {/* ---------------------------------------------------------- */}
//       {/* 📌 กล่องประกาศ + marquee (อยู่ด้านบนที่เดิม ไม่ต้องย้าย)  */}
//       {/* ---------------------------------------------------------- */}
//       <div className="marquee-container flex items-center gap-0.5 ">
//         <div className="flex items-center gap-1 rounded-[5px] bg-yellow-200 text-red-500 px-3 py-1 shadow-sm w-max">
//           <Megaphone size={16} className="text-black" />
//           <span className="text-xs md:text-sm font-medium">ประกาศ</span>
//         </div>
//         <div className="overflow-hidden w-full">
//           <MarqueeTextFeature running={true} />
//         </div>
//       </div>

//       {/* ---------------------------------------------------------- */}
//       {/* 🎉 สินค้าแนะนำ (ยังอยู่ใต้ประกาศเหมือนเดิม) */}
//       {/* ---------------------------------------------------------- */}
//       <RecommendedProducts />

//       {/* ---------------------------------------------------------- */}
//       {/* 📌 ย้ายส่วนหัวของร้านทั้งหมดลงมาไว้ใต้สินค้าแนะนำ */}
//       {/* ---------------------------------------------------------- */}
//       <div className="mt-8 space-y-6">
//         {/* แถวจัด layout ซ้าย–ขวา */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           {/* LEFT — Badge สินค้าดี ราคาถูก ส่งรวดเร็ว */}
//           {/* <div
//             className="flex items-center gap-2 px-2 py-1 bg-linear-to-r from-green-100 to-green-50
//                           text-green-800 rounded-2xl shadow-md w-fit border border-green-200"
//           >
//             <div className="bg-green-500 p-1 rounded-full">
//               <BadgeCheck size={20} className="text-white" />
//             </div>
//             <span className="text-xs md:text-xl font-semibold">
//               สินค้าดี ราคาถูก ส่งรวดเร็ว
//             </span>
//           </div> */}

//           {/* RIGHT — Category + ปุ่มดูตะกร้า */}
//           <div className="flex flex-col md:flex-row md:items-center md:gap-6 w-full md:w-auto">
//             {/* <CategorySection categories={categories} products={products} /> */}

//             <CategorySection categories={categories} />

//             <Button
//               variant="ghost"
//               className="group px-4 py-2 rounded-full bg-linear-to-r from-green-400
//                          to-green-500 text-white text-xs font-medium whitespace-nowrap mt-2 md:mt-0"
//             >
//               <Link href="/cart" className="flex items-center gap-2">
//                 <span>ดูสินค้าในตะกร้า</span>
//                 <ArrowRight
//                   size={16}
//                   className="transition-transform group-hover:translate-x-1"
//                 />
//               </Link>
//             </Button>
//           </div>
//         </div>

//         {/* หัวข้อ “ของเด็ดประจำร้าน” */}
//         {/* <h3
//           className="text-base md:text-3xl font-extrabold text-muted-foreground
//                        flex items-center gap-2 tracking-wide"
//         >
//           <span className="inline-block w-[3px] h-4 md:h-7 bg-primary rounded-sm" />
//           ของเด็ดประจำร้าน
//         </h3> */}
//       </div>
//     </section>
//   );
// }

// import { ArrowRight, BadgeCheck, Megaphone } from "lucide-react";
// import CategorySection from "./category-section";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { unstable_cache } from "next/cache";
// import { listFeaturedProducts } from "@/services/products";
// import { listCategorySummaries } from "@/services/categories";
// import { RecommendedProducts } from "../recommended-products";
// import { MarqueeTextFeature } from "@/components/layouts/header/marquee-text-feature";

// const getFeatureProducts = unstable_cache(
//   async () => {
//     try {
//       return await listFeaturedProducts();
//     } catch (error) {
//       console.error(error);
//       return [];
//     }
//   },
//   ["get-feature-products"],
//   { tags: ["products"], revalidate: 60 * 15 }
// );

// const getHomeCategories = unstable_cache(
//   async () => {
//     try {
//       return await listCategorySummaries();
//     } catch (error) {
//       console.error(error);
//       return [];
//     }
//   },
//   ["get-home-categories"],
//   { tags: ["categories"], revalidate: 60 * 60 }
// );

// export default async function FeatureProducts() {
//   const [products, categories] = await Promise.all([
//     getFeatureProducts(),
//     getHomeCategories(),
//   ]);

//   return (
//     <section className="container mx-auto px-4 py-1">

//       {/* ---------------------------------------------------------- */}
//       {/* 📌 กล่องประกาศ + marquee (ตำแหน่งเดิมด้านบนสุด)         */}
//       {/* ---------------------------------------------------------- */}
//       <div className="marquee-container flex items-center gap-0.5">
//         <div className="flex items-center gap-1 rounded-[5px] bg-yellow-200 text-red-500 px-3 py-1 shadow-sm w-max">
//           <Megaphone size={16} className="text-black" />
//           <span className="text-xs md:text-sm font-medium">ประกาศ</span>
//         </div>

//         <div className="overflow-hidden w-full">
//           <MarqueeTextFeature running={true} />
//         </div>
//       </div>

//       {/* ---------------------------------------------------------- */}
//       {/* 🟩 หมวดหมู่สินค้า — ย้ายขึ้นมาไว้ใต้ประกาศตามคำขอ        */}
//       {/* ---------------------------------------------------------- */}
//       <div className="mt-4">
//         <CategorySection categories={categories} />
//       </div>

//       {/* ---------------------------------------------------------- */}
//       {/* 🛒 ปุ่มดูสินค้าในตะกร้า                                 */}
//       {/* ---------------------------------------------------------- */}
//       <div className="flex justify-end mt-3">
//         <Button
//           variant="ghost"
//           className="group px-4 py-2 rounded-full bg-linear-to-r from-green-400
//                      to-green-500 text-white text-xs font-medium whitespace-nowrap"
//         >
//           <Link href="/cart" className="flex items-center gap-2">
//             <span>ดูสินค้าในตะกร้า</span>
//             <ArrowRight
//               size={16}
//               className="transition-transform group-hover:translate-x-1"
//             />
//           </Link>
//         </Button>
//       </div>

//       {/* ---------------------------------------------------------- */}
//       {/* 🎉 สินค้าแนะนำ — ถูกเลื่อนลงมาต่อจากหมวดหมู่             */}
//       {/* ---------------------------------------------------------- */}
//       <div className="mt-6">
//         <RecommendedProducts />
//       </div>

//     </section>
//   );
// }

// import { Megaphone } from "lucide-react";
// import CategorySection from "./category-section";
// import { unstable_cache } from "next/cache";
// import { listFeaturedProducts } from "@/services/products";
// import { listCategorySummaries } from "@/services/categories";
// import { RecommendedProducts } from "../recommended-products";
// import { MarqueeTextFeature } from "@/components/layouts/header/marquee-text-feature";

// const getFeatureProducts = unstable_cache(
//   async () => {
//     try {
//       return await listFeaturedProducts();
//     } catch (error) {
//       console.error(error);
//       return [];
//     }
//   },
//   ["get-feature-products"],
//   { tags: ["products"], revalidate: 60 * 15 }
// );

// const getHomeCategories = unstable_cache(
//   async () => {
//     try {
//       return await listCategorySummaries();
//     } catch (error) {
//       console.error(error);
//       return [];
//     }
//   },
//   ["get-home-categories"],
//   { tags: ["categories"], revalidate: 60 * 60 }
// );

// export default async function FeatureProducts() {
//   const [products, categories] = await Promise.all([
//     getFeatureProducts(),
//     getHomeCategories(),
//   ]);

//   return (
//     <section className="container mx-auto px-2 py-1">
//       {/* ---------------------------------------------------------- */}
//       {/* 🟩 หมวดหมู่สินค้า — อยู่บนสุด */}
//       {/* ---------------------------------------------------------- */}
//       <div>
//         <CategorySection categories={categories} />
//       </div>

//       {/* ---------------------------------------------------------- */}
//       {/* 📢 กล่องประกาศ — อยู่ใต้หมวดหมู่ตามที่ต้องการ */}
//       {/* ---------------------------------------------------------- */}
//       <div className="marquee-container flex items-center gap-0.5 mt-4">
//         <div className="flex items-center gap-1 rounded-[5px] bg-yellow-200 text-red-500 px-3 py-1 shadow-sm w-max">
//           <Megaphone size={16} className="text-black" />
//           <span className="text-xs md:text-sm font-medium">ประกาศ</span>
//         </div>

//         <div className="overflow-hidden w-full">
//           <MarqueeTextFeature running={true} />
//         </div>
//       </div>

//       {/* ---------------------------------------------------------- */}
//       {/* 🎉 สินค้าแนะนำ — แสดงด้านล่างประกาศ */}
//       {/* ---------------------------------------------------------- */}
//       <div className="mt-6">
//         <RecommendedProducts />
//       </div>
//     </section>
//   );
// }

// import { Megaphone } from "lucide-react";
// import CategorySection from "./category-section";
// import { listFeaturedProducts } from "@/services/products";
// import { listCategorySummaries } from "@/services/categories";
// import { RecommendedProducts } from "../recommended-products";
// import { MarqueeTextFeature } from "@/components/layouts/header/marquee-text-feature";

// /**
//  * ✔ แทน unstable_cache ด้วยฟังก์ชันธรรมดา + ใช้ fetch cache layer ของ Next.js
//  * ✔ รองรับ revalidateTag("products") / revalidateTag("categories") ของระบบคุณ
//  * ✔ ปลอดภัย — มี try/catch เหมือนเดิม
//  */

// async function getFeatureProducts() {
//   try {
//     const res = await listFeaturedProducts();
//     return res;
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// }

// async function getHomeCategories() {
//   try {
//     const res = await listCategorySummaries();
//     return res;
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// }

// export default async function FeatureProducts() {
//   const [products, categories] = await Promise.all([
//     getFeatureProducts(),
//     getHomeCategories(),
//   ]);

//   return (
//     <section className="container mx-auto px-2 py-1">
//       {/* หมวดหมู่สินค้า */}
//       {/* <div>
//         <CategorySection categories={categories} />
//       </div> */}
//       <div className="lg:hidden w-full flex justify-center">
//         <div className="w-full max-w-[500px]">
//           <CategorySection categories={categories} />
//         </div>
//       </div>

//       {/* ประกาศ */}
//       <div className="marquee-container flex items-center gap-0.5 mt-4">
//         <div className="flex items-center gap-1 rounded-[5px] bg-yellow-200 text-red-500 px-3 py-1 shadow-sm w-max">
//           <Megaphone size={16} className="text-black" />
//           <span className="text-xs md:text-sm font-medium">ประกาศ</span>
//         </div>

//         <div className="overflow-hidden w-full">
//           <MarqueeTextFeature running={true} />
//         </div>
//       </div>

//       {/* สินค้าแนะนำ */}
//       <div className="mt-6">
//         <RecommendedProducts />
//       </div>
//     </section>
//   );
// }

// export const revalidate = 60; // Revalidate หน้าใหม่ทุก 60 วินาที
// export const fetchCache = "default-cache"; // เปิดใช้งานระบบ caching อัตโนมัติ

// import { Megaphone } from "lucide-react";
// import CategorySection from "./category-section";
// import { listFeaturedProducts } from "@/services/products";
// import { listCategorySummaries } from "@/services/categories";
// import { RecommendedProducts } from "../recommended-products";
// import { MarqueeTextFeature } from "@/components/layouts/header/marquee-text-feature";

// /**
//  * ⚡ โหลดสินค้าแนะนำแบบปลอดภัย + รองรับ Next.js 16 caching system
//  */
// async function getFeatureProducts() {
//   try {
//     return await listFeaturedProducts();
//   } catch (error) {
//     console.error("getFeatureProducts error:", error);
//     return [];
//   }
// }

// /**
//  * ⚡ โหลดหมวดหมู่สินค้าแบบปลอดภัย + รองรับ Next.js 16 caching system
//  */
// async function getHomeCategories() {
//   try {
//     return await listCategorySummaries();
//   } catch (error) {
//     console.error("getHomeCategories error:", error);
//     return [];
//   }
// }

// /**
//  * ⚡ Server Component — ปรับดีไซน์ใหม่สไตล์ Premium Dark/Green
//  */
// export default async function FeatureProducts() {
//   const [products, categories] = await Promise.all([
//     getFeatureProducts(),
//     getHomeCategories(),
//   ]);

//   return (
//     <section className="container mx-auto px-2 py-1">
//       {/* --- ส่วนที่ 1: หมวดหมู่สินค้า (เฉพาะมือถือ) --- */}
//       <div className="lg:hidden w-full flex justify-center mb-1">
//         <div className="w-full max-w-[500px]">
//           {/* DESIGN UPGRADE:
//              - เปลี่ยน bg-red-500 เป็น bg-neutral-900 (สีดำเทา) เพื่อความหรู
//              - เพิ่ม border-green-500/30 (เส้นเขียวจางๆ เรืองแสง)
//              - เพิ่ม shadow และ backdrop-blur
//           */}
//           <div className="bg-neutral-900/95 backdrop-blur-md rounded-t-xl p-2 border-x border-t border-green-500/50 shadow-[0_-5px_15px_-5px_rgba(34,197,94,0.2)]">
//             <CategorySection categories={categories} />
//           </div>
//         </div>
//       </div>

//       {/* --- ส่วนที่ 2: แถบประกาศ --- */}
//       <div className="bt w-full flex justify-center">
//         <div className="w-full max-w-[500px] marquee-container flex items-center gap-0 filter drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)]">
//           {/* 1. กล่องประกาศ (ซ้าย) - เน้นสีแดงให้เด่นเหมือนเดิม แต่ใส่ Gradient */}
//           <div
//             className="bg-gradient-to-br from-red-600 to-red-800 px-2 py-2 pr-8 inline-flex items-center relative z-0"
//             style={{
//               // FIX: ใช้ calc เพื่อล็อคความเอียงให้คงที่ (25px) ไม่เพี้ยนตามขนาดจอ
//               clipPath: "polygon(0 0, 100% 0, calc(100% - 25px) 100%, 0 100%)",
//             }}
//           >
//             <div className="flex items-center gap-1 rounded-[6px] bg-white text-red-700 px-2 py-0.5 shadow-sm border border-red-200">
//               <Megaphone size={14} className="text-red-600 fill-red-600" />
//               <span className="text-xs font-bold">ประกาศ</span>
//             </div>
//           </div>

//           {/* 2. กล่องข้อความเลื่อน (ขวา) - เปลี่ยนเป็นสีมืดเพื่อให้ข้อความอ่านง่าย */}
//           <div
//             // DESIGN UPGRADE:
//             // - เปลี่ยนพื้นหลังเป็นสีดำ (bg-neutral-900) ตัดกับประกาศสีแดง
//             // - ปรับ margin-left ให้พอดีกับ clip-path ใหม่ (-24px)
//             // - ใส่ drop-shadow สีเขียวเหมือนเดิม แต่ปรับให้คมขึ้น
//             className="bg-neutral-900 ml-[-24px] rounded-br-xl px-2 py-2 flex-1 overflow-hidden flex items-center relative z-10 drop-shadow-[-2px_0_0_#22c55e]"
//             style={{
//               // FIX: ใช้ 25px เท่ากับกล่องซ้าย เพื่อให้รอยต่อแนบสนิท 100%
//               clipPath: "polygon(25px 0, 100% 0, 100% 100%, 0 100%)",
//             }}
//           >
//             {/* เส้น Neon ตกแต่งด้านบน (Optional) */}
//             <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>

//             <div className="pl-4 text-gray-200">
//               <MarqueeTextFeature running={true} />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* สินค้าแนะนำ */}
//       <div className="mt-6">
//         <RecommendedProducts />
//       </div>
//     </section>
//   );
// }

import { Suspense } from "react";
import { listFeaturedProducts } from "@/services/products";
import { listCategorySummaries } from "@/services/categories";
import CategorySection from "./category-section";
import { RecommendedProducts } from "../recommended-products";
import { AnnouncementBar } from "./announcement-bar";

// Configuration for Next.js ISR/Caching
export const revalidate = 60;
export const fetchCache = "default-cache";

/**
 * Fetch featured products with error handling safety.
 */
async function fetchFeaturedProductsSafe() {
  try {
    return await listFeaturedProducts();
  } catch (error) {
    console.error("[FeatureProducts] Failed to fetch products:", error);
    return [];
  }
}

/**
 * Fetch categories with error handling safety.
 */
async function fetchCategoriesSafe() {
  try {
    return await listCategorySummaries();
  } catch (error) {
    console.error("[FeatureProducts] Failed to fetch categories:", error);
    return [];
  }
}

/**
 * FeatureProducts Component
 * Displays mobile category navigation, announcement bar, and featured items.
 */
export default async function FeatureProducts() {
  // Parallel data fetching for performance
  const [products, categories] = await Promise.all([
    fetchFeaturedProductsSafe(),
    fetchCategoriesSafe(),
  ]);

  return (
    <section className="container mx-auto px-2 py-1">
      {/* 1. Mobile Category Navigation */}
      <div className="lg:hidden w-full flex justify-center mb-1">
        <div className="w-full max-w-[500px]">
          <div className="bg-neutral-900/95 backdrop-blur-md rounded-t-xl p-2 border-x border-t border-green-500/50 shadow-[0_-5px_15px_-5px_rgba(34,197,94,0.2)]">
            <CategorySection categories={categories} />
          </div>
        </div>
      </div>

      {/* 2. Announcement Marquee */}
      <div className="mt-2 w-full flex justify-center md:hidden">
        <div className="w-full max-w-[500px]">
          <AnnouncementBar />
        </div>
      </div>

      {/* 3. Recommended Products Grid */}
      <div className="mt-6">
        <Suspense
          fallback={
            <div className="h-40 w-full animate-pulse bg-neutral-800 rounded-lg" />
          }
        >
          <RecommendedProducts />
        </Suspense>
      </div>
    </section>
  );
}
