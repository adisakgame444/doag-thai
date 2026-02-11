import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { getAllSpinOrders } from "@/services/spins";
import SpinOrdersAdminView from "./spin-orders-view";

export const metadata: Metadata = {
  title: "จัดการคำสั่งซื้อสปิน",
  description: "อนุมัติหรือปฏิเสธคำสั่งซื้อสปิน",
};

export default async function AdminSpinOrdersPage() {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/unauthorized");
  }

  const orders = await getAllSpinOrders();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">จัดการคำสั่งซื้อสปิน</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          อนุมัติหรือปฏิเสธคำสั่งซื้อสปินจากลูกค้า
        </p>
      </div>

      <SpinOrdersAdminView orders={orders} />
    </div>
  );
}
