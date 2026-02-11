import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/get-session";
import { getCartItemsByUser } from "@/services/cart";
import { CartHydrator } from "@/components/cart/cart-hydrator";
import CartView from "./cart-view";
import { CartTableSkeleton } from "@/components/skeletons/cart-table-skeleton";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: 'ตะกร้าสินค้า',
  description:
    'ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!',
}

export default async function CartPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    redirect("/sign-in?redirect=/cart");
  }

  const cartItems = await getCartItemsByUser(user.id);

  return (
    <div className="container mx-auto space-y-8 py-3 mb-2 md:py-12 lg:py-16 md:px-0 px-[15px]">
      <CartHydrator userId={user.id} items={cartItems} />
      <Suspense fallback={<CartTableSkeleton />}>
        <CartView initialItems={cartItems} userId={user.id} />
      </Suspense>
    </div>
  );
}
