import { Suspense } from "react";
import { forbidden, unauthorized } from "next/navigation";

import { getServerSession } from "@/lib/get-session";
import { BannerAdminSkeleton } from "@/components/skeletons/banner-admin-skeleton";
import BannerList from "./banner-list";
import BannerHeader from "./banner-header";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "แบนเนอร์แนะนำ",
  description:
    "ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!",
};

export default async function RecommendedBannersAdminPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    unauthorized();
  }

  if (user.role !== "admin") {
    forbidden();
  }

  return (
    <div className="space-y-6">
      <BannerHeader />
      <Suspense fallback={<BannerAdminSkeleton />}>
        <BannerList />
      </Suspense>
    </div>
  );
}
