import { Metadata } from "next";
import Link from "next/link";

interface CheckoutSuccessProps {
  searchParams: Promise<{
    order?: string;
  }>;
}

export const metadata: Metadata = {
  title: "สั่งซื้อสำเร็จ",
  description:
    "ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!",
};

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessProps) {
  const { order } = await searchParams;

  return (
    <div className="container mx-auto flex flex-col items-center gap-6 py-12 text-center md:px-0 px-[15px]">
      <div className="space-y-3">
        <h1 className="text-xl font-semibold text-foreground md:text-4xl">
          ขอบคุณสำหรับการสั่งซื้อ
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          คำสั่งซื้อของคุณถูกบันทึกเรียบร้อยแล้ว
          {/* ทีมงานจะตรวจสอบและติดต่อกลับโดยเร็วที่สุด */}
        </p>
      </div>

      {order && (
        <div className="rounded-xl border border-border/60 bg-muted/40 px-5 py-3 text-sm font-medium text-foreground md:text-base">
          เลขคำสั่งซื้อของคุณ:{" "}
          <span className="font-semibold text-primary">{order}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/orders"
          className="rounded-md border border-border/60 bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          ดูคำสั่งซื้อของฉัน
        </Link>
        <Link
          href="/products"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          เลือกซื้อสินค้าต่อ
        </Link>
      </div>
    </div>
  );
}
