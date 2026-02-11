import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/get-session";
import { getCartItemsByIds } from "@/services/cart";
import { ensureDefaultAddress, listAddresses } from "@/services/addresses";
import CheckoutPage from "./checkout-page";
import { CheckoutSkeleton } from "@/components/skeletons/checkout-skeleton";
import { Metadata } from "next";

type CheckoutPageProps = {
  searchParams: Promise<{
    items?: string;
  }>;
};

export const metadata: Metadata = {
  title: "ชำระเงิน",
  description:
    "ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!",
};

export default async function CheckoutRoute({
  searchParams,
}: CheckoutPageProps) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    redirect("/sign-in?redirect=/checkout");
  }

  const resolvedSearch = await searchParams;
  const itemsParam = resolvedSearch?.items ?? "";
  const itemIds = itemsParam
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (!itemIds.length) {
    redirect("/cart");
  }

  await ensureDefaultAddress(user.id);

  const [cartItems, addresses] = await Promise.all([
    getCartItemsByIds(user.id, itemIds),
    listAddresses(user.id),
  ]);

  if (!cartItems.length) {
    redirect("/cart");
  }

  const subtotal = cartItems.reduce((total, item) => total + item.subtotal, 0);
  const codEligible = cartItems.every((item) => item.codAvailable);

  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutPage
        cartItems={cartItems}
        addresses={addresses}
        subtotal={subtotal}
        codEligible={codEligible}
        itemsParam={itemsParam}
      />
    </Suspense>
  );
}
