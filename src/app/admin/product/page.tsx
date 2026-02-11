import { Suspense } from "react";

import ProductHeader from "./product-header";
import ProductList from "./product-list";
import { normalizePagination, ADMIN_DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { AdminListCardSkeleton } from "@/components/skeletons/admin-list-card-skeleton";
import { Metadata } from "next";

interface ProductPageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    status?: string;
    search?: string;
  }>;
}

export const metadata: Metadata = {
  title: "จัดการสินค้า",
  description:
    "ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!",
};

function resolveStatus(value?: string): "all" | "active" | "inactive" {
  if (value === "active" || value === "inactive") {
    return value;
  }
  return "all";
}

export default async function ProductPage({ searchParams }: ProductPageProps) {
  const params = await searchParams;
  const status = resolveStatus(params?.status);
  const search = params?.search ?? "";

  const pagination = normalizePagination(
    { page: params?.page, pageSize: params?.pageSize },
    { defaultPageSize: ADMIN_DEFAULT_PAGE_SIZE }
  );

  return (
    <div className="space-y-6">
      {/* Product Header */}
      <ProductHeader />

      {/* Product List */}
      <Suspense
        fallback={
          <AdminListCardSkeleton
            title="Product List"
            rows={pagination.pageSize}
            columns={5}
          />
        }
      >
        <ProductList
          page={pagination.page}
          pageSize={pagination.pageSize}
          status={status}
          search={search}
        />
      </Suspense>
    </div>
  );
}
