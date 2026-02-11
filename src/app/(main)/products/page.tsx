// import { Suspense } from "react";

// import ProductList from "./product-list";
// import ProductSearchBox from "./product-search-box";
// import { ProductCatalogSkeleton } from "@/components/skeletons/product-catalog-skeleton";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: 'สินค้าทั้งหมด',
//   description:
//     'ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!',
// }

// interface ProductPageProps {
//   searchParams: Promise<{
//     search?: string;
//     page?: string;
//     pageSize?: string;
//   }>;
// }

// export default async function ProductPage({ searchParams }: ProductPageProps) {
//   const params = await searchParams;
//   const search = params?.search ?? "";
//   const page = params?.page ?? null;
//   const pageSize = params?.pageSize ?? null;

//   return (
//     // <div className="container mx-auto py-6 space-y-6">
//     <div className="container mx-auto py-6 md:px-0 px-[15px] space-y-6">
//       <ProductSearchBox initialValue={search} />
//       <Suspense fallback={<ProductCatalogSkeleton />}>
//         <ProductList search={search} page={page} pageSize={pageSize} />
//       </Suspense>
//     </div>
//   );
// }

// import { Suspense } from "react";

// import ProductList from "./product-list";
// import ProductSearchBox from "./product-search-box";
// import { ProductCatalogSkeleton } from "@/components/skeletons/product-catalog-skeleton";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: 'สินค้าทั้งหมด',
//   description:
//     'ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!',
// }

// interface ProductPageProps {
//   searchParams: Promise<{
//     search?: string;
//     page?: string;
//     pageSize?: string;
//   }>;
// }

// export default async function ProductPage({ searchParams }: ProductPageProps) {
//   const params = await searchParams;
//   const search = params?.search ?? "";
//   const page = params?.page ?? null;
//   const pageSize = params?.pageSize ?? null;

//   return (
//     <div className="container mx-auto py-6 md:px-0 px-[15px] space-y-6">
//       <ProductSearchBox initialValue={search} />
//       <Suspense fallback={<ProductCatalogSkeleton />}>
//         <ProductList search={search} page={page} pageSize={pageSize} />
//       </Suspense>
//     </div>
//   );
// }

// import { Suspense } from "react";

// import ProductList from "./product-list";
// import ProductSearchBox from "./product-search-box";
// import { ProductCatalogSkeleton } from "@/components/skeletons/product-catalog-skeleton";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "สินค้าทั้งหมด",
//   description:
//     "ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!",
// };

// interface ProductPageProps {
//   searchParams: Promise<{
//     search?: string;
//     category?: string;
//     page?: string;
//     pageSize?: string;
//   }>;
// }

// export default async function ProductPage({ searchParams }: ProductPageProps) {
//   const params = await searchParams;

//   const search = params?.search ?? "";
//   const category = params?.category ?? ""; // ✅ ดึง category จาก URL
//   const page = params?.page ?? null;
//   const pageSize = params?.pageSize ?? null;

//   return (
//     <div className="container mx-auto py-6 md:px-0 px-[15px] space-y-6">
//       <ProductSearchBox initialValue={search} />

//       <Suspense fallback={<ProductCatalogSkeleton />}>
//         <ProductList
//           search={search}
//           category={category} // ✅ ส่งลง ProductList
//           page={page}
//           pageSize={pageSize}
//         />
//       </Suspense>
//     </div>
//   );
// }

// import { Suspense } from "react";
// import ProductList from "./product-list";
// import ProductSearchBox from "./product-search-box";
// import { ProductCatalogSkeleton } from "@/components/skeletons/product-catalog-skeleton";
// import PageSwipe from "../components/PageSwipe";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "สินค้าทั้งหมด",
// };

// interface ProductPageProps {
//   searchParams: Promise<{
//     search?: string;
//     category?: string;
//     page?: string;
//     pageSize?: string;
//   }>;
// }

// export default async function ProductPage({ searchParams }: ProductPageProps) {
//   const params = await searchParams;

//   const search = params?.search ?? "";
//   const category = params?.category ?? "";
//   const page = Number(params?.page ?? 1);
//   const pageSize = params?.pageSize ?? null;

//   // ❗ สมมติว่าหน้าละ 20 และคุณรู้ totalPages จาก backend
//   // ถ้าคุณมี meta.totalPages อยู่แล้ว → ส่งค่าจริงมาแทน
//   const TOTAL_PAGES = 50;

//   return (
//     <div className="container mx-auto py-6 space-y-6">
//       <ProductSearchBox initialValue={search} />

//       <Suspense fallback={<ProductCatalogSkeleton />}>
//         <PageSwipe totalPages={TOTAL_PAGES}>
//           <ProductList
//             search={search}
//             category={category}
//             page={page}
//             pageSize={pageSize}
//           />
//         </PageSwipe>
//       </Suspense>
//     </div>
//   );
// }

import { Suspense } from "react";
import ProductList from "./product-list";
import ProductSearchBox from "./product-search-box";
import { ProductCatalogSkeleton } from "@/components/skeletons/product-catalog-skeleton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "สินค้าทั้งหมด",
};

interface ProductPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
    pageSize?: string;
    replacement_for?: string; // ✅ รับค่านี้
  }>;
}

export default async function ProductPage({ searchParams }: ProductPageProps) {
  const params = await searchParams;
  const replacementTargetId = params?.replacement_for; // ✅ ดึงค่า

  const search = params?.search ?? "";
  const category = params?.category ?? "";
  const page = Number(params?.page ?? 1);
  const pageSize = params?.pageSize ?? null;

  const TOTAL_PAGES = 12; // 🔴 ใช้ค่าจริงของคุณ

  return (
    <div className="container mx-auto py-6 md:px-0 px-[15px] space-y-6">
      {/* ✅ Search box อยู่ที่เดิม ไม่โดน swipe */}
      <ProductSearchBox initialValue={search} />

      <Suspense fallback={<ProductCatalogSkeleton />}>
        <ProductList
          search={search}
          category={category}
          page={page}
          pageSize={pageSize}
          replacementTargetId={replacementTargetId} // ✅ ส่งต่อ
        />
      </Suspense>
    </div>
  );
}
