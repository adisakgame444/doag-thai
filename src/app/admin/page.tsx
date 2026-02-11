import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getServerSession } from "@/lib/get-session";
import { forbidden, unauthorized } from "next/navigation";
import { MailIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import {
  getDashboardMetrics,
  getDashboardTrends,
  getRecentOrders,
} from "@/services/orders";
import { getLowStockProducts, getTopSellerProducts } from "@/services/products";
import DashboardSalesChart from "@/components/admin/dashboard-sales-chart";
import RecentOrdersTable from "@/components/admin/recent-orders-table";
import LowStockList from "@/components/admin/low-stock-list";
import TopSellersList from "@/components/admin/top-sellers-list";
import { TableSectionSkeleton } from "@/components/skeletons/table-section-skeleton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "แผงควบคุมผู้ดูแลระบบ",
  description:
    "ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!",
};

export default async function Admin() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized();

  if (user.role !== "admin") forbidden();

  return (
    <div className="space-y-6">
      {!user.emailVerified && <EmailVerificationAlert />}
      <Suspense fallback={<SummaryCardsSkeleton />}>
        <SummaryCardsSection />
      </Suspense>
      <Suspense fallback={<ChartSkeleton />}>
        <SalesTrendSection />
      </Suspense>
      <Suspense fallback={<RecentOrdersSkeleton />}>
        <RecentOrdersSection />
      </Suspense>
      <Suspense fallback={<InventorySkeleton />}>
        <InventorySummarySection />
      </Suspense>
    </div>
  );
}

function EmailVerificationAlert() {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-sm dark:border-amber-800/50 dark:bg-amber-900/20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <MailIcon
            size={20}
            className="flex-shrink-0 mt-0.5 sm:mt-0 text-amber-600 dark:text-amber-400"
          />
          <span className="text-sm text-amber-800 dark:text-amber-100 leading-relaxed">
            กรุณายืนยันอีเมลของคุณเพื่อใช้งานฟีเจอร์ทั้งหมดของระบบ
            {/* <span className='block text-amber-700/80 dark:text-amber-300/80 text-xs mt-1'>
              ระบบได้ส่งลิงก์ยืนยันไปยังอีเมลของคุณแล้ว
            </span> */}
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="bg-white/80 hover:bg-white text-amber-700 border-amber-300 hover:border-amber-400 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-200 dark:hover:bg-amber-900/50 dark:hover:border-amber-700 whitespace-nowrap"
          asChild
        >
          <Link href="/verify-email" className="font-medium">
            เปิดหน้าตรวจสอบอีเมล
          </Link>
        </Button>
      </div>
    </div>
  );
}

async function SummaryCardsSection() {
  const metrics = await getDashboardMetrics();

  if (!metrics) {
    notFound();
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="ยอดขาย 7 วันที่ผ่านมา"
        value={new Intl.NumberFormat("th-TH", {
          style: "currency",
          currency: "THB",
          maximumFractionDigits: 0,
        }).format(metrics.totalSales)}
        description="รวมออเดอร์ที่อนุมัติการชำระเงิน"
      />
      <StatCard
        title="ออเดอร์ 7 วันที่ผ่านมา"
        value={metrics.totalOrders.toLocaleString()}
        description="รวมทุกสถานะ"
      />
      <StatCard
        title="รอตรวจสอบสลิป"
        value={metrics.pendingVerificationOrders.toLocaleString()}
        description={new Intl.NumberFormat("th-TH", {
          style: "currency",
          currency: "THB",
          maximumFractionDigits: 0,
        }).format(metrics.pendingVerificationAmount)}
      />
      <StatCard
        title="มัดจำ COD ที่ค้าง"
        value={new Intl.NumberFormat("th-TH", {
          style: "currency",
          currency: "THB",
          maximumFractionDigits: 0,
        }).format(metrics.codDepositsAwaiting)}
        description="รอการอนุมัติการชำระ"
      />
      <StatCard
        title="ลูกค้าทั้งหมด"
        value={metrics.totalCustomers.toLocaleString()}
      />
      <StatCard
        title="สินค้าในระบบ"
        value={metrics.totalProducts.toLocaleString()}
      />
      <StatCard
        title="สินค้าใกล้หมด"
        value={metrics.lowStockCount.toLocaleString()}
        description="ตรวจสอบและเติมสต็อก"
      />
    </div>
  );
}

async function SalesTrendSection() {
  const trends = await getDashboardTrends(14);

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            ยอดขาย & จำนวนออเดอร์
          </h2>
          <p className="text-sm text-muted-foreground">
            สรุปข้อมูลย้อนหลัง 14 วัน
          </p>
        </div>
      </div>

      <DashboardSalesChart data={trends} />
    </div>
  );
}

async function RecentOrdersSection() {
  const recentOrders = await getRecentOrders(5);

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            คำสั่งซื้อล่าสุด
          </h2>
          <p className="text-sm text-muted-foreground">
            ติดตามคำสั่งซื้อใหม่และจัดการได้ทันที
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/orders">ดูทั้งหมด</Link>
        </Button>
      </div>

      <div className="pt-4">
        <RecentOrdersTable orders={recentOrders} />
      </div>
    </div>
  );
}

async function InventorySummarySection() {
  const [lowStock, topSellers] = await Promise.all([
    getLowStockProducts(5),
    getTopSellerProducts(5),
  ]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              สินค้าใกล้หมด
            </h2>
            <p className="text-sm text-muted-foreground">
              เช็กรายการที่ต้องเติมสต็อก
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/product">จัดการสินค้า</Link>
          </Button>
        </div>
        <LowStockList products={lowStock} />
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              สินค้าขายดี
            </h2>
            <p className="text-sm text-muted-foreground">
              รวมสินค้าที่มียอดขายสูงสุด
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/product">ดูสินค้า</Link>
          </Button>
        </div>
        <TopSellersList products={topSellers} />
      </div>
    </div>
  );
}

function SummaryCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="space-y-3 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm"
        >
          <div className="h-4 w-28 animate-pulse rounded bg-muted/50" />
          <div className="h-6 w-32 animate-pulse rounded bg-muted/40" />
          <div className="h-3 w-24 animate-pulse rounded bg-muted/30" />
        </div>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      <div className="mb-4 h-6 w-48 animate-pulse rounded bg-muted/40" />
      <div className="flex h-72 items-end gap-2 rounded-xl border border-border/40 bg-muted/20 p-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="w-full animate-pulse rounded-t-full bg-muted/50"
            style={{ height: `${40 + (index % 5) * 10}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function RecentOrdersSkeleton() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      <div className="mb-4 h-6 w-48 animate-pulse rounded bg-muted/40" />
      <TableSectionSkeleton
        rows={5}
        columns={4}
        className="border-none p-0 shadow-none"
      />
    </div>
  );
}

function InventorySkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
        <div className="mb-3 h-6 w-64 animate-pulse rounded bg-muted/40" />
        <TableSectionSkeleton
          rows={5}
          columns={3}
          className="border-none p-0 shadow-none"
        />
      </div>
      <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
        <div className="mb-3 h-6 w-64 animate-pulse rounded bg-muted/40" />
        <TableSectionSkeleton
          rows={5}
          columns={3}
          className="border-none p-0 shadow-none"
        />
      </div>
    </div>
  );
}
