// import { Suspense } from 'react'
// import { redirect } from 'next/navigation'

// import { getServerSession } from '@/lib/get-session'
// import { getCartItemsByIds } from '@/services/cart'
// import { getAddress } from '@/services/addresses'
// import PaymentPage from './payment-page'
// import { CheckoutSkeleton } from '@/components/skeletons/checkout-skeleton'
// import { Metadata } from 'next'

// type CheckoutPaymentPageProps = {
//   searchParams: Promise<{
//     items?: string
//     address?: string
//   }>
// }

// export const metadata: Metadata = {
//   title: 'ชำระเงิน',
//   description:
//     'ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!',
// }

// export default async function CheckoutPaymentPage({ searchParams }: CheckoutPaymentPageProps) {
//   const session = await getServerSession()
//   const user = session?.user

//   if (!user) {
//     redirect('/sign-in?redirect=/checkout/payment')
//   }

//   const resolved = await searchParams
//   const itemsParam = resolved?.items ?? ''
//   const addressId = resolved?.address ?? ''

//   const itemIds = itemsParam
//     .split(',')
//     .map((id) => id.trim())
//     .filter(Boolean)

//   if (!itemIds.length || !addressId) {
//     redirect('/checkout')
//   }

//   const [cartItems, address] = await Promise.all([
//     getCartItemsByIds(user.id, itemIds),
//     getAddress(user.id, addressId),
//   ])

//   if (!cartItems.length || !address) {
//     redirect('/checkout')
//   }

//   const subtotal = cartItems.reduce((total, item) => total + item.subtotal, 0)
//   const codEligible = cartItems.every((item) => item.codAvailable)

//   return (
//     <Suspense fallback={<CheckoutSkeleton />}>
//       <PaymentPage
//         cartItems={cartItems}
//         address={address}
//         subtotal={subtotal}
//         codEligible={codEligible}
//         itemsParam={itemsParam}
//       />
//     </Suspense>
//   )
// }

import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { getCartItemsByIds } from "@/services/cart";
import { getAddress } from "@/services/addresses";
import PaymentPage from "./payment-page";
import { CheckoutSkeleton } from "@/components/skeletons/checkout-skeleton";
import { Metadata } from "next";

// ✅ 1. เพิ่มบรรทัดนี้: บังคับให้หน้านี้ทำงานแบบ Dynamic เท่านั้น (แก้ Error Prerender)
export const dynamic = "force-dynamic";

type CheckoutPaymentPageProps = {
  searchParams: Promise<{
    items?: string;
    address?: string;
  }>;
};

export const metadata: Metadata = {
  title: "ชำระเงิน",
  description:
    "ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!",
};

export default async function CheckoutPaymentPage({
  searchParams,
}: CheckoutPaymentPageProps) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    redirect("/sign-in?redirect=/checkout/payment");
  }

  const resolved = await searchParams;
  const itemsParam = resolved?.items ?? "";
  const addressId = resolved?.address ?? "";

  const itemIds = itemsParam
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (!itemIds.length || !addressId) {
    redirect("/checkout");
  }

  const [cartItems, address] = await Promise.all([
    getCartItemsByIds(user.id, itemIds),
    getAddress(user.id, addressId),
  ]);

  if (!cartItems.length || !address) {
    redirect("/checkout");
  }

  // ---------- 🔒 Stock / Quantity Validation ----------
  for (const item of cartItems) {
    if (item.maxQuantity <= 0) {
      redirect("/checkout?error=out_of_stock");
    }
    if (item.quantity <= 0) {
      redirect("/checkout?error=invalid_quantity");
    }
    if (item.quantity > item.maxQuantity) {
      redirect("/checkout?error=invalid_quantity");
    }
  }

  // ---------- 🔒 Price Validation ----------
  const safeSubtotal = cartItems.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );

  if (safeSubtotal <= 0) {
    redirect("/checkout?error=invalid_price");
  }

  const subtotal = safeSubtotal;
  const codEligible = cartItems.every((item) => item.codAvailable);

  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <PaymentPage
        cartItems={cartItems}
        address={address}
        subtotal={subtotal}
        codEligible={codEligible}
        itemsParam={itemsParam}
      />
    </Suspense>
  );
}
