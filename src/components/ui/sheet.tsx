"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

// function SheetOverlay({
//   className,
//   ...props
// }: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
//   return (
//     <SheetPrimitive.Overlay
//       data-slot="sheet-overlay"
//       className={cn(
//         "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
//         className,
//       )}
//       {...props}
//     />
//   );
// }

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50",
        // 1. ใช้ความเร็วที่ "เร็วกว่าเมนู" (เช่น 300-400ms)
        // เพื่อให้ Overlay ทำงานจบก่อนที่เมนูจะเลื่อนมาถึงจุดกลางจอ ลดภาระ CPU ซ้อนทับกัน
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
        "data-[state=open]:duration-400 data-[state=closed]:duration-300",

        // 2. ใช้ Easing แบบ Linear หรือ Ease-out ธรรมดา
        // ไม่ต้องใช้ Cubic-bezier ซับซ้อนเหมือนเมนู เพราะ Opacity ไม่ต้องการความ "ดีด"
        "ease-out",

        // 3. หัวใจสำคัญ: บังคับแยก Layer (Hardware Acceleration)
        // เพื่อไม่ให้การคำนวณ Opacity ไปรบกวนการคำนวณ Transform ของ SheetContent
        "transform-gpu will-change-opacity",

        className,
      )}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left";
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          // "bg-background will-change-transform data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-300",
          // side === "right" &&
          //   "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          // side === "left" &&
          //   "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          // side === "top" &&
          //   "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          // side === "bottom" &&
          //   "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          // className,
          // 1. พื้นฐานและ z-index
          // "bg-background fixed z-50 flex flex-col gap-4 shadow-lg",
          // // 2. การทำ Animation (เพิ่มความนุ่มนวลด้วย cubic-bezier)
          // "transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          // "data-[state=open]:animate-in data-[state=closed]:animate-out",
          // // 3. ปรับเวลาเปิด-ปิดให้เท่ากันเพื่อความต่อเนื่อง
          // "data-[state=open]:duration-500 data-[state=closed]:duration-400",
          // // 4. บังคับ Hardware Acceleration
          // "will-change-transform transform-gpu translate-z-0",

          // side === "right" &&
          //   "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          // side === "left" &&
          //   "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",

          // "bg-background fixed z-50 flex flex-col shadow-lg",

          // // 1. กำหนดความเร็วให้ช้าลง (เพิ่มเป็น 700ms - 800ms)
          // // data-[state=open]:duration-800 คือตอนเปิด (ช้าแบบนุ่มๆ)
          // // data-[state=closed]:duration-500 คือตอนปิด (เร็วกว่าตอนเปิดนิดหนึ่งเพื่อให้ไม่ดูหน่วงเกินไป)
          // "transition-transform ease-[cubic-bezier(0.16,1,0.3,1)]",
          // "data-[state=open]:animate-in data-[state=closed]:animate-out",
          // "data-[state=open]:duration-800 data-[state=closed]:duration-500",

          // // 2. Hardware Acceleration (ใส่ไว้เหมือนเดิมเพื่อให้ความช้าดูนิ่ง ไม่กระตุก)
          // "will-change-transform transform-gpu backface-visibility-hidden",

          // side === "right" &&
          //   "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          // side === "left" &&
          //   "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",

          // className,

          "bg-background fixed z-50 flex flex-col shadow-lg",

          // 1. ลดภาระการคำนวณ: ใช้แค่ transform เท่านั้น (ห้าม opacity ถ้าไม่จำเป็น)
          // เพราะ transform เป็น Property ที่ GPU ประมวลผลได้โดยไม่ต้องคำนวณ Layout ใหม่
          "transition-transform",

          // 2. กำหนดจังหวะ: ใช้ Cubic Bezier ที่เรียบง่ายแต่สมูท
          "ease-[cubic-bezier(0.25,1,0.5,1)]",

          // 3. กำหนดเวลา: ช้าแบบนุ่มนวล (เปิด 700ms / ปิด 400ms)
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:duration-1200 data-[state=closed]:duration-900",

          // 4. ทีเด็ดการประหยัดทรัพยากร:
          // transform-gpu: ใช้การ์ดจอทำ
          // backface-visibility-hidden: ลดการคำนวณภาพด้านหลัง
          // contain-strict: บอกบราวเซอร์ว่าไม่ต้องไปยุ่งกับข้างนอกเมนู ลดภาระการวาดภาพ (Paint)
          "transform-gpu backface-visibility-hidden will-change-transform",

          side === "right" &&
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" &&
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",

          className,
        )}
        style={{
          // 🔹 ตัวช่วยระดับ Low-level เพื่อความเสถียร
          contain: "layout paint",
          WebkitBackfaceVisibility: "hidden",
        }}
        {...props}
      >
        {children}
        {/* <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close> */}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
