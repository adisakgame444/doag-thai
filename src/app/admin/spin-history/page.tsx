import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { getAllSpinHistory } from "@/services/spins";
import SpinHistoryAdminView from "./spin-history-view";

export const metadata: Metadata = {
  title: "ประวัติการหมุนสปินทั้งหมด",
  description: "ดูประวัติการหมุนสปินของลูกค้าทั้งหมด",
};

export default async function AdminSpinHistoryPage() {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/unauthorized");
  }

  const history = await getAllSpinHistory({ limit: 200 });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">ประวัติการหมุนสปินทั้งหมด</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            ดูประวัติการหมุนสปินของลูกค้าทั้งหมด
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
          <a
            href="/admin/spin-orders"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            คำสั่งซื้อสปิน
          </a>
          <span className="text-muted-foreground hidden sm:inline">|</span>
          <a
            href="/admin/spin-users"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            จัดการผู้ใช้
          </a>
        </div>
      </div>

      <SpinHistoryAdminView history={history} />
    </div>
  );
}
