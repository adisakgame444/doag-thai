import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/get-session";
import { getCartItemsByIds } from "@/services/cart";
import { getAddress } from "@/services/addresses";
import SummaryPage from "./summary-page";
import { CheckoutSkeleton } from "@/components/skeletons/checkout-skeleton";
import { Metadata } from "next";

const VALID_METHODS = new Set(["PROMPTPAY", "COD"]);

type SummaryPageProps = {
  searchParams: Promise<{
    items?: string;
    address?: string;
    method?: string;
  }>;
};

export const metadata: Metadata = {
  title: "สรุปคำสั่งซื้อ",
  description:
    "ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!",
};

export const dynamic = "force-dynamic";

export default async function CheckoutSummaryPage({
  searchParams,
}: SummaryPageProps) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    redirect("/sign-in?redirect=/checkout/summary");
  }

  const resolved = await searchParams;
  const itemsParam = resolved?.items ?? "";
  const addressId = resolved?.address ?? "";
  // const methodParam = resolved?.method ?? "";

  const itemIds = itemsParam
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (!itemIds.length || !addressId ) {
    redirect("/checkout/payment");
  }
  
  // if (!itemIds.length || !addressId || !VALID_METHODS.has(methodParam)) {
  //   redirect("/checkout/payment");
  // }

  const [cartItems, address] = await Promise.all([
    getCartItemsByIds(user.id, itemIds),
    getAddress(user.id, addressId),
  ]);

  if (!cartItems.length || !address) {
    redirect("/checkout/payment");
  }

  const subtotal = cartItems.reduce((total, item) => total + item.subtotal, 0);
  const codEligible = cartItems.every((item) => item.codAvailable);

  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <SummaryPage
        cartItems={cartItems}
        address={address}
        subtotal={subtotal}
        codEligible={codEligible}
        itemsParam={itemsParam}
        // paymentMethod={methodParam as "PROMPTPAY" | "COD"}
      />
    </Suspense>
  );
}
