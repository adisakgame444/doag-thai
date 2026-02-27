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

// function SheetOverlay({
//   className,
//   ...props
// }: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
//   return (
//     <SheetPrimitive.Overlay
//       data-slot="sheet-overlay"
//       className={cn(
//         "fixed inset-0 z-50 bg-black/40", // ลด Opacity ลงเล็กน้อยเพื่อลดภาระการผสมสี (Alpha blending)

//         // 1. ลดจังหวะการเฟดให้สั้นที่สุด (75ms - 150ms) เพื่อไม่ให้ GPU แช่อยู่กับงานค้างนาน
//         "data-[state=open]:animate-in data-[state=closed]:animate-out",
//         "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
//         "duration-150", // เร็วมากจนแทบไม่กินทรัพยากร

//         // 2. ใช้ Hardware Acceleration บังคับแยก Layer
//         "transform-gpu will-change-opacity",

//         // 3. ป้องกันการวาดซ้ำในส่วนที่ไม่เกี่ยวข้อง
//         "pointer-events-auto",

//         className,
//       )}
//       style={{
//         // 🔹 คำสั่งระดับ Low-level เพื่อบอกเบราว์เซอร์ว่าไม่ต้องคำนวณอะไรที่อยู่หลัง Overlay นี้
//         contain: "strict",
//       }}
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
        "fixed inset-0 z-50 bg-black/60", // แนะนำ /60 เพื่อให้ตัดกับแผ่นเมนูชัดเจนขึ้น แต่ถ้าระบบเดิมใช้ /40 ก็ใช้ได้ครับ

        // ✅ 1. ใช้ระบบ Animate ของ Radix UI ปกติ
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",

        // 🚨 2. สำคัญมาก: เปลี่ยนเป็น duration-300 ให้ "เท่ากับ" แผ่นเมนู (SheetContent)
        // ถ้าแผ่นเมนูใช้ 300ms แต่ Overlay ใช้ 150ms ภาพมันจะดูขัดตากันและรู้สึกแปลกๆ
        "duration-300 ease-out",

        // ✅ 3. การ์ดจอช่วยประมวลผล (เก็บไว้ดีมากครับ)
        "transform-gpu will-change-opacity",

        // ❌ เอา pointer-events-auto ออก เพราะ Radix UI จะจัดการเรื่องการคลิกให้เอง
        // การใส่ค้างไว้แบบทื่อๆ อาจทำให้กดจิ้มทะลุไปโดนของข้างหลังไม่ได้ในบางจังหวะ
        className,
      )}
      style={{
        // 🔹 4. เปลี่ยนจาก "strict" เป็น "layout paint"
        // เพราะ strict ดุเกินไป เวลาเลื่อนหน้าจอบนมือถือแล้วแถบ URL หดหายไป มันอาจจะทำให้ Overlay ขาดหรือแหว่งได้ครับ
        contain: "layout paint",
      }}
      {...props}
    />
  );
}

// function SheetContent({
//   className,
//   children,
//   side = "right",
//   ...props
// }: React.ComponentProps<typeof SheetPrimitive.Content> & {
//   side?: "top" | "right" | "bottom" | "left";
// }) {
//   return (
//     <SheetPortal>
//       <SheetOverlay />
//       <SheetPrimitive.Content
//         data-slot="sheet-content"
//         className={cn(
//           "bg-background will-change-transform data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-800 data-[state=open]:duration-800",
//           side === "right" &&
//             "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
//           side === "left" &&
//             "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
//           side === "top" &&
//             "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
//           side === "bottom" &&
//             "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
//           className,
//         )}
//         style={{
//           // 🔹 ตัวช่วยระดับ Low-level เพื่อความเสถียร
//           contain: "layout paint",
//           WebkitBackfaceVisibility: "hidden",
//         }}
//         {...props}
//       >
//         {children}
//         {/* <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
//           <XIcon className="size-4" />
//           <span className="sr-only">Close</span>
//         </SheetPrimitive.Close> */}
//       </SheetPrimitive.Content>
//     </SheetPortal>
//   );
// }

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
          // ✅ 1. เพิ่ม transform-gpu เข้าไปช่วย will-change-transform
          // ✅ 2. เปลี่ยน transition เฉยๆ เป็น transition-transform
          // ✅ 3. ปรับเวลาจาก duration-800 เป็น duration-300 ให้กระชับและลื่นตา
          // ✅ 4. เปลี่ยน ease-in-out เป็น ease-out (ตามหลัก UX ของ Apple แผ่นเมนูควรพุ่งออกมาก่อนแล้วค่อยๆ เบรก)
          "bg-background transform-gpu will-change-transform data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-xl transition-transform ease-out data-[state=closed]:duration-300 data-[state=open]:duration-300",
          side === "right" &&
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" &&
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" &&
            "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" &&
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className,
        )}
        style={{
          // 🔹 ตัวช่วยระดับ Low-level เพื่อความเสถียร (เก็บไว้ตามเดิมดีแล้วครับ)
          contain: "layout paint",
          WebkitBackfaceVisibility: "hidden",
        }}
        {...props}
      >
        {children}
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
