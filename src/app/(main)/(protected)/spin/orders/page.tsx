import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { getSpinOrdersByUserId } from "@/services/spins";
import SpinOrdersList from "./spin-orders-list";
import { ScrollText } from "lucide-react";

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
    <div className="container mx-auto px-3 py-4">
      <div className="mb-6 relative bg-[#FFD028] border-[3px] border-black p-4 sm:p-5 rounded-lg shadow-[5px_5px_0px_0px_#000] overflow-hidden group">
        {/* Background Pattern (ปรับขนาดจุดให้เล็กลง) */}
        <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none"></div>

        {/* Floating Decor (วงกลมตกแต่งเล็กลง) */}
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-white border-[3px] border-black rounded-full opacity-50"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            {/* Title: ลดขนาดลงเหลือ text-2xl/3xl */}
            <h1 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tighter text-black mb-1.5 drop-shadow-sm">
              ORDER HISTORY
            </h1>

            {/* Subtitle: Badge เล็กลง เส้นบางลง */}
            <div className="inline-flex items-center gap-1.5 font-bold text-black border-[2px] border-black bg-white px-2 py-0.5 rounded shadow-[2px_2px_0px_0px_#000]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3366] animate-pulse"></span>
              <p className="text-[10px] sm:text-xs">
                เช็คสถานะและประวัติการเติมสปินของคุณ
              </p>
            </div>
          </div>

          {/* Icon Box: ลดขนาดเหลือ 10x10 (40px) */}
          <div className="hidden sm:flex w-10 h-10 bg-white border-[3px] border-black rounded-lg items-center justify-center shadow-[3px_3px_0px_0px_#000] rotate-6 group-hover:rotate-0 transition-transform duration-300">
            <ScrollText className="w-5 h-5 text-black" />
          </div>
        </div>
      </div>

      <SpinOrdersList orders={orders} />
    </div>
  );
}
