// import { listProductsActive } from "@/services/products";
// import { PaginationControls } from "@/components/pagination/pagination-controls";
// import { PUBLIC_DEFAULT_PAGE_SIZE } from "@/lib/pagination";
// import ProductCard from "./product-card";

// interface ProductListProps {
//   search?: string;
//   page?: number | string | null;
//   pageSize?: number | string | null;
// }

// export default async function ProductList({
//   search = "",
//   page,
//   pageSize,
// }: ProductListProps) {
//   const { items: products, meta } = await listProductsActive({
//     search,
//     page,
//     pageSize,
//   });

//   return (
//     <div className="space-y-4">
//       {products.length === 0 ? (
//         <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-8 text-center text-sm text-muted-foreground">
//           ไม่พบสินค้าที่ตรงกับคำค้นหานี้ ลองใช้คำอื่นหรือลดจำนวนตัวอักษรลง
//         </div>
//       ) : (
//         <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
//           {products.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>
//       )}

//       <PaginationControls
//         meta={meta}
//         pathname="/products"
//         query={{
//           ...(search ? { search } : {}),
//           ...(meta.pageSize !== PUBLIC_DEFAULT_PAGE_SIZE
//             ? { pageSize: meta.pageSize }
//             : {}),
//         }}
//         className="justify-center"
//       />
//     </div>
//   );
// }

// import { listProductsActive } from "@/services/products";
// import { PaginationControls } from "@/components/pagination/pagination-controls";
// import { PUBLIC_DEFAULT_PAGE_SIZE } from "@/lib/pagination";
// import ProductCard from "./product-card";

// interface ProductListProps {
//   search?: string;
//   page?: number | string | null;
//   pageSize?: number | string | null;
// }

// export default async function ProductList({
//   search = "",
//   page,
//   pageSize,
// }: ProductListProps) {
//   const { items: products, meta } = await listProductsActive({
//     search,
//     page,
//     pageSize,
//   });

//   return (
//     <div className="space-y-4">
//       {products.length === 0 ? (
//         <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-8 text-center text-sm text-muted-foreground">
//           ไม่พบสินค้าที่ตรงกับคำค้นหา
//         </div>
//       ) : (
//         <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
//           {products.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>
//       )}

//       <PaginationControls
//         meta={meta}
//         pathname="/products"
//         query={{
//           ...(search ? { search } : {}),
//           ...(meta.pageSize !== PUBLIC_DEFAULT_PAGE_SIZE
//             ? { pageSize: meta.pageSize }
//             : {}),
//         }}
//         className="justify-center"
//       />
//     </div>
//   );
// }

// import { listProductsActive } from "@/services/products";
// import { PaginationControls } from "@/components/pagination/pagination-controls";
// import { PUBLIC_DEFAULT_PAGE_SIZE } from "@/lib/pagination";
// import ProductCard from "./product-card";

// interface ProductListProps {
//   search?: string;
//   category?: string;
//   page?: number | string | null;
//   pageSize?: number | string | null;
// }

// export default async function ProductList({
//   search = "",
//   category = "",
//   page,
//   pageSize,
// }: ProductListProps) {
//   const { items: products, meta } = await listProductsActive({
//     search,
//     category, // ✅ ส่ง category เข้า service
//     page,
//     pageSize,
//   });

//   return (
//     <div className="space-y-4">
//       {products.length === 0 ? (
//         <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-8 text-center text-sm text-muted-foreground">
//           ไม่พบสินค้าที่ตรงกับคำค้นหา
//         </div>
//       ) : (
//         <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
//           {products.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>
//       )}

//       <PaginationControls
//         meta={meta}
//         pathname="/products"
//         query={{
//           ...(search ? { search } : {}),
//           ...(category ? { category } : {}), // ✅ ต้องส่ง category เข้า pagination ด้วย ไม่งั้นคลิกหน้าถัดไปแล้วหมวดหาย
//           ...(meta.pageSize !== PUBLIC_DEFAULT_PAGE_SIZE
//             ? { pageSize: meta.pageSize }
//             : {}),
//         }}
//         className="justify-center"
//       />
//     </div>
//   );
// }

// import { listProductsActive } from "@/services/products";
// import { PaginationControls } from "@/components/pagination/pagination-controls";
// import { PUBLIC_DEFAULT_PAGE_SIZE } from "@/lib/pagination";
// import ProductCard from "./product-card";

// interface ProductListProps {
//   search?: string;
//   category?: string;
//   page?: number | string | null;
//   pageSize?: number | string | null;
// }

// export default async function ProductList({
//   search = "",
//   category = "",
//   page,
//   pageSize,
// }: ProductListProps) {
//   const { items: products, meta } = await listProductsActive({
//     search,
//     category,
//     page,
//     pageSize,
//   });

//   return (
//     <div className="space-y-4">
//       {products.length === 0 ? (
//         <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-8 text-center text-sm text-muted-foreground">
//           ไม่พบสินค้าที่ตรงกับคำค้นหา
//         </div>
//       ) : (
//         <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
//           {products.map((product, index) => (
//             <ProductCard
//               key={product.id}
//               product={product}
//               index={index} // ✅ ส่ง index ให้การ์ดรู้ว่าตัวเองอยู่ลำดับที่เท่าไหร่
//             />
//           ))}
//         </div>
//       )}

//       <PaginationControls
//         meta={meta}
//         pathname="/products"
//         query={{
//           ...(search ? { search } : {}),
//           ...(category ? { category } : {}),
//           ...(meta.pageSize !== PUBLIC_DEFAULT_PAGE_SIZE
//             ? { pageSize: meta.pageSize }
//             : {}),
//         }}
//         className="justify-center"
//       />
//     </div>
//   );
// }

import { listProductsActive } from "@/services/products";
import { PaginationControls } from "@/components/pagination/pagination-controls";
import { PUBLIC_DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import ProductCard from "./product-card";

interface ProductListProps {
  search?: string;
  category?: string;
  page?: number | string | null;
  pageSize?: number | string | null;
  replacementTargetId?: string; // ✅ รับค่า
}

export default async function ProductList({
  search = "",
  category = "",
  page,
  pageSize,
  replacementTargetId,
}: ProductListProps) {
  const { items: products, meta } = await listProductsActive({
    search,
    category,
    page,
    pageSize,
  });

  return (
    <div className="space-y-4">
      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-8 text-center text-sm text-muted-foreground">
          ไม่พบสินค้าที่ตรงกับคำค้นหา
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              replacementTargetId={replacementTargetId}
            />
          ))}
        </div>
      )}

      <PaginationControls
        meta={meta}
        pathname="/products"
        query={{
          ...(search ? { search } : {}),
          ...(category ? { category } : {}),
          ...(replacementTargetId
            ? { replacement_for: replacementTargetId }
            : {}),
          ...(meta.pageSize !== PUBLIC_DEFAULT_PAGE_SIZE
            ? { pageSize: meta.pageSize }
            : {}),
        }}
        className="justify-center"
      />
    </div>
  );
}
