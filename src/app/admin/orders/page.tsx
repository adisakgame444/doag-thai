// import { Suspense } from "react";
// import { forbidden, unauthorized } from "next/navigation";

// import { getServerSession } from "@/lib/get-session";
// import { listOrders } from "@/services/orders";
// import OrdersAdminView from "./orders-view";
// import { normalizePagination, ADMIN_DEFAULT_PAGE_SIZE } from "@/lib/pagination";
// import { AdminListCardSkeleton } from "@/components/skeletons/admin-list-card-skeleton";
// import { Metadata } from "next";
// // import type { Actor } from "@/services/orders";

// export const dynamic = "force-dynamic";

// interface AdminOrdersPageProps {
//   searchParams: Promise<{
//     search?: string;
//     page?: string;
//     pageSize?: string;
//   }>;
// }

// export const metadata: Metadata = {
//   title: "จัดการคำสั่งซื้อ",
//   description:
//     "ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!",
// };

// export default async function AdminOrdersPage({
//   searchParams,
// }: AdminOrdersPageProps) {
//   const session = await getServerSession();
//   const user = session?.user;

//   if (!user) {
//     unauthorized();
//   }

//   if (user.role !== "admin") {
//     forbidden();
//   }

//   const params = await searchParams;
//   const search = params?.search ?? "";

//   const pagination = normalizePagination(
//     { page: params?.page, pageSize: params?.pageSize },
//     { defaultPageSize: ADMIN_DEFAULT_PAGE_SIZE }
//   );

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col gap-1">
//         <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
//           จัดการคำสั่งซื้อ
//         </h1>
//         <p className="text-sm text-muted-foreground">
//           ตรวจสอบสลิปอนุมัติคำสั่งซื้อ อัพเดตสถานะ และติดตามการจัดส่ง
//         </p>
//       </div>

//       <Suspense
//         fallback={
//           <AdminListCardSkeleton
//             title="Orders"
//             rows={pagination.pageSize}
//             columns={5}
//           />
//         }
//       >
//         <OrdersSection
//           search={search}
//           page={pagination.page}
//           pageSize={pagination.pageSize}
//         />
//       </Suspense>
//     </div>
//   );
// }

// async function OrdersSection({
//   search,
//   page,
//   pageSize,
// }: {
//   search: string;
//   page: number;
//   pageSize: number;
// }) {
//   const { items: orders, meta } = await listOrders({ search, page, pageSize });
//   return <OrdersAdminView orders={orders} search={search} meta={meta} />;
// }

import { Suspense } from "react";
import { forbidden, unauthorized } from "next/navigation";

import { getServerSession } from "@/lib/get-session";
import { listOrders } from "@/services/orders";
import OrdersAdminView from "./orders-view";
import { normalizePagination, ADMIN_DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { AdminListCardSkeleton } from "@/components/skeletons/admin-list-card-skeleton";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface AdminOrdersPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
    pageSize?: string;
  }>;
}

export const metadata: Metadata = {
  title: "จัดการคำสั่งซื้อ",
  description:
    "ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!",
};

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    unauthorized();
  }

  if (user.role !== "admin") {
    forbidden();
  }

  const params = await searchParams;
  const search = params?.search ?? "";

  const pagination = normalizePagination(
    { page: params?.page, pageSize: params?.pageSize },
    { defaultPageSize: ADMIN_DEFAULT_PAGE_SIZE }
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
          จัดการคำสั่งซื้อ
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          ตรวจสอบสลิปอนุมัติคำสั่งซื้อ อัพเดตสถานะ และติดตามการจัดส่ง
        </p>
      </div>

      <Suspense
        fallback={
          <AdminListCardSkeleton
            title="Orders"
            rows={pagination.pageSize}
            columns={5}
          />
        }
      >
        <OrdersSection
          search={search}
          page={pagination.page}
          pageSize={pagination.pageSize}
        />
      </Suspense>
    </div>
  );
}

async function OrdersSection({
  search,
  page,
  pageSize,
}: {
  search: string;
  page: number;
  pageSize: number;
}) {
  const { items: orders, meta } = await listOrders({ search, page, pageSize });
  return <OrdersAdminView orders={orders} search={search} meta={meta} />;
}
