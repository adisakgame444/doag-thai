
"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { cn } from "@/lib/utils";

type StepConfig = {
  label: string;
  segment: string | null;
  href: string;
  disabled?: boolean;
};

const steps: StepConfig[] = [
  { label: "ที่อยู่จัดส่ง", segment: null, href: "/checkout" },
  { label: "การชำระเงิน", segment: "payment", href: "/checkout/payment" },
  {
    label: "ยืนยันคำสั่งซื้อ",
    segment: "summary",
    href: "/checkout/summary",
    disabled: true,
  },
];

function StepIndicatorItem({
  step,
  index,
  activeIndex,
}: {
  step: StepConfig;
  index: number;
  activeIndex: number;
}) {
  const isActive = index === activeIndex;
  const isCompleted = index < activeIndex;

  const circleClass = cn(
    "inline-flex size-6 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors",
    isActive && "border-primary bg-primary text-primary-foreground",
    isCompleted && "border-primary bg-primary/10 text-primary",
    !isActive &&
      !isCompleted &&
      "border-border bg-background text-muted-foreground"
  );

  const labelContent = step.disabled ? (
    <span className="text-muted-foreground">{step.label}</span>
  ) : (
    <Link
      href={step.href}
      className={cn(
        "font-medium transition-colors",
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {step.label}
    </Link>
  );

  return (
    <li className="flex items-center gap-1.5">
      <span className={circleClass}>{index + 1}</span>
      {labelContent}
      {index < steps.length - 1 && (
        <span className="hidden text-muted-foreground md:inline">/</span>
      )}
    </li>
  );
}

export default function CheckoutStepShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const segment = useSelectedLayoutSegment();
  const currentIndex = steps.findIndex((step) => step.segment === segment);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    // 👇 เพิ่ม text-[13px] เพื่อให้ตัวอักษรทั้งหน้านี้เล็กลง
    <div className="min-h-svh bg-background text-[13px]">
      <div className="border-b border-border/60 bg-muted/40">
        <div className="container mx-auto flex flex-col gap-3 py-5 md:flex-row md:items-center md:justify-between">
          <div className="md:px-0 px-[15px]">
            <h1 className="text-base font-semibold text-foreground md:text-lg">
              ขั้นตอนการสั่งซื้อ
            </h1>
            <p className="text-xs text-muted-foreground">
              ตรวจสอบข้อมูลให้ครบถ้วนก่อนทำการชำระเงิน
            </p>
          </div>
          <ol className="flex flex-wrap items-center gap-3 text-xs md:gap-5 md:px-0 px-[15px]">
            {steps.map((step, index) => (
              <StepIndicatorItem
                key={step.label}
                step={step}
                index={index}
                activeIndex={activeIndex}
              />
            ))}
          </ol>
        </div>
      </div>

      <div className="pb-10">{children}</div>
    </div>
  );
}
