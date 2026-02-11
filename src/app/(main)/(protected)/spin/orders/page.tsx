import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { getSpinOrdersByUserId } from "@/services/spins";
import SpinOrdersList from "./spin-orders-list";

export const metadata: Metadata = {
  title: "ประวัติคำสั่งซื้อสปิน",
  description: "ดูประวัติการซื้อแพคเกจสปินของคุณ",
};

export default async function SpinOrdersPage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/sign-in?redirect=/spin/orders");
  }

  const orders = await getSpinOrdersByUserId(session.user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">ประวัติคำสั่งซื้อสปิน</h1>
        <p className="text-muted-foreground">
          ดูประวัติการซื้อแพคเกจสปินและสถานะการชำระเงิน
        </p>
      </div>

      <SpinOrdersList orders={orders} />
    </div>
  );
}
