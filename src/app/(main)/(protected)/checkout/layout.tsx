// import { ReactNode } from 'react'

// import CheckoutStepShell from './checkout-step-shell'

// export default function CheckoutLayout({ children }: { children: ReactNode }) {
//   return <CheckoutStepShell>{children}</CheckoutStepShell>
// }

"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import CheckoutStepShell from "./checkout-step-shell";

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // ถ้าอยู่หน้า /checkout/success → ไม่แสดง StepShell
  const showStepShell = !pathname?.includes("/checkout/success");

  return showStepShell ? (
    <CheckoutStepShell>{children}</CheckoutStepShell>
  ) : (
    <>{children}</>
  );
}
