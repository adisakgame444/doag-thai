import { Suspense } from "react";

import CategoryHeader from "./category-header";
import { getServerSession } from "@/lib/get-session";
import { forbidden, unauthorized } from "next/navigation";
import CategoryForm from "./category-form";
import CategoryList from "./category-list";
import { normalizePagination, ADMIN_DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { AdminListCardSkeleton } from "@/components/skeletons/admin-list-card-skeleton";
import { Metadata } from "next";

interface CategoryPageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    status?: string;
    search?: string;
  }>;
}

export const metadata: Metadata = {
  title: "จัดการหมวดหมู่สินค้า",
  description:
    "ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!",
};

function resolveStatus(value?: string): "all" | "active" | "inactive" {
  if (value === "active" || value === "inactive") {
    return value;
  }
  return "all";
}

export default async function CategoryPage({
  searchParams,
}: CategoryPageProps) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized();

  if (user.role !== "admin") forbidden();

  const params = await searchParams;
  const status = resolveStatus(params?.status);
  const search = params?.search ?? "";

  const pagination = normalizePagination(
    { page: params?.page, pageSize: params?.pageSize },
    { defaultPageSize: ADMIN_DEFAULT_PAGE_SIZE }
  );

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <CategoryHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <CategoryForm />
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <Suspense
            fallback={
              <AdminListCardSkeleton
                title="Category List"
                rows={pagination.pageSize}
                columns={4}
              />
            }
          >
            <CategoryList
              page={pagination.page}
              pageSize={pagination.pageSize}
              status={status}
              search={search}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
