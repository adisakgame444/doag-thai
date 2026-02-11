"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { User } from "@/lib/auth";
import { LogIn, Menu, MessageCircleHeartIcon, User2 } from "lucide-react";
import Link from "next/link";
import { AuthButtons, SignOutButton, UserAvatar } from "./user-comp";
// import { MobileNavigationLinks } from "./navigation-links";
import { useState, useEffect } from "react";
import { MarqueeText } from "./marquee-text";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileSideMenu } from "../mobile-side-menu";

interface MobileMenuProps {
  user?: User;
}

/**
 * ✅ เมนูมือถือ (พร้อม marquee ข้อความเลื่อนเมื่อเปิดเมนู)
 */
export function MobileMenu({ user }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  // ✅ ส่ง event ให้ component อื่น ๆ รับรู้ว่าเมนูเปิด/ปิด
  useEffect(() => {
    const event = new CustomEvent("mobileMenuToggle", { detail: { isOpen } });
    window.dispatchEvent(event);
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {/* ปุ่มเปิดเมนู */}
      <SheetTrigger className="md:hidden" aria-label="เปิดเมนูมือถือ" asChild>
        <Button variant="ghost" size="icon">
          <Menu size={20} />
        </Button>
      </SheetTrigger>

      {/* ✅ กล่องเมนูหลัก */}
      <SheetContent
        side="left"
        aria-label="เมนูหลักของเว็บไซต์"
        className="will-change-transform translate-z-0 flex h-full w-[80%] sm:w-[70%] md:w-[400px] flex-col overflow-hidden p-0"
        // style={{
        //   backfaceVisibility: "hidden",
        //   contain: "layout paint size style",
        //   transform: "none",
        // }}
        // forceMount
      >
        {/* Header */}

        <SheetHeader className="px-6 pb-4 pt-6">
          <div className="flex items-center justify-between">
            {/* กล่องโปรไฟล์ */}
            <div className="inline-flex max-w-max items-center rounded-full bg-primary px-3 py-1.5 shadow-sm">
              <SheetTitle className="flex items-center gap-2 text-sm font-medium tracking-wide text-white">
                {user ? (
                  <>
                    <User2 className="h-4 w-4 rounded-full bg-gray-300 text-white/80" />
                    <span>โปรไฟล์ของคุณ</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 text-white" />
                    <span>ยินดีต้อนรับ</span>
                  </>
                )}
              </SheetTitle>
            </div>

            {/* 🔥 ปุ่มสลับธีมข้าง ๆ โปรไฟล์ */}
            <ThemeToggle />
          </div>
        </SheetHeader>

        {/* เนื้อหาเมนู */}
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 pb-6 scrollable">
          {user ? <UserAvatar user={user} /> : <AuthButtons />}

          {/* ✅ กล่องข้อความเลื่อน (Marquee) */}
          {user && (
            <div className="flex items-center gap-0.5 rounded-lg">
              {/* ป้าย Message */}
              <div className="flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
                <span>Message</span>
                <MessageCircleHeartIcon size={14} className="text-green-200" />
              </div>

              {/* ✅ เรียกใช้ MarqueeText component */}
              <MarqueeText running={isOpen} />
            </div>
          )}

          <Separator />

          <ScrollArea className="max-h-[45vh]">
            {/* <MobileNavigationLinks /> */}
            <MobileSideMenu />

            {user && user.role === "admin" && (
              <div className="mt-3">
                {/* <Separator className="mb-3" /> */}
                <Button
                  variant="destructive"
                  size="lg"
                  className="w-full justify-center gap-2 rounded-xl text-base"
                  asChild
                >
                  <Link href="/admin" prefetch>
                    หลังบ้าน
                  </Link>
                </Button>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Footer */}
        {user && (
          <SheetFooter className="mt-auto border-t border-border bg-card/80  px-6 py-4">
            <SignOutButton isMobile />
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

// "use client";

// import { useState, useEffect, memo } from "react";
// import Link from "next/link";
// import { Menu, User2, LogIn, MessageCircleHeartIcon } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import {
//   Sheet,
//   SheetContent,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";

// // Components
// import { AuthButtons, SignOutButton, UserAvatar } from "./user-comp";
// import { MobileNavigationLinks } from "./navigation-links";
// import { MarqueeText } from "./marquee-text";
// import { ThemeToggle } from "@/components/theme-toggle";

// // Types
// import { User } from "@/lib/auth"; // หรือ path ที่ถูกต้องของคุณ

// interface MobileMenuProps {
//   user?: User;
// }

// /**
//  * ✅ เมนูมือถือฉบับ Optimize (Native Scroll + Memoized)
//  */
// export const MobileMenu = memo(function MobileMenu({ user }: MobileMenuProps) {
//   const [isOpen, setIsOpen] = useState(false);

//   // ✅ ส่ง event บอก component อื่น (เช่น Slider) ว่าเมนูเปิดอยู่
//   useEffect(() => {
//     const event = new CustomEvent("mobileMenuToggle", { detail: { isOpen } });
//     window.dispatchEvent(event);
//   }, [isOpen]);

//   return (
//     <Sheet open={isOpen} onOpenChange={setIsOpen}>
//       {/* ปุ่ม Hamburger */}
//       <SheetTrigger className="md:hidden" aria-label="เปิดเมนูมือถือ" asChild>
//         <Button variant="ghost" size="icon" className="shrink-0">
//           <Menu size={20} />
//         </Button>
//       </SheetTrigger>

//       {/* กล่องเมนู */}
//       <SheetContent
//         side="left"
//         aria-label="เมนูหลัก"
//         // ✅ ปรับ Layout ให้เต็มจอและจัดการ Scroll เอง
//         className="flex h-full w-[85%] sm:w-[70%] md:w-[400px] flex-col gap-0 p-0"
//       >
//         {/* --- ส่วนหัว (Header) --- */}
//         <SheetHeader className="px-6 py-5 border-b border-border/40">
//           <div className="flex items-center justify-between">
//             {/* ป้ายสถานะ User */}
//             <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1.5 border border-primary/20">
//               <SheetTitle className="flex items-center gap-2 text-sm font-medium text-primary">
//                 {user ? (
//                   <>
//                     <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
//                       <User2 size={12} />
//                     </div>
//                     <span>โปรไฟล์ของคุณ</span>
//                   </>
//                 ) : (
//                   <>
//                     <LogIn size={14} />
//                     <span>ยินดีต้อนรับ</span>
//                   </>
//                 )}
//               </SheetTitle>
//             </div>

//             {/* ปุ่มเปลี่ยนธีม */}
//             <ThemeToggle />
//           </div>
//         </SheetHeader>

//         {/* --- ส่วนเนื้อหา (Scrollable Area) --- */}
//         {/* ✅ ใช้ Native Scroll (overflow-y-auto) แทน ScrollArea เพื่อความลื่นไหลบนมือถือ */}
//         <div className="flex-1 overflow-y-auto px-4 py-4 scroll-smooth overscroll-contain">
//           {/* Avatar / Auth Buttons */}
//           <div className="mb-4">
//             {user ? <UserAvatar user={user} /> : <AuthButtons />}
//           </div>

//           {/* Marquee Section */}
//           {user && (
//             <div className="mb-4 flex items-center gap-0.5 overflow-hidden rounded-lg border border-border/50 bg-accent/20 p-1">
//               <div className="flex shrink-0 items-center gap-1 rounded bg-blue-600 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
//                 <span>NEW</span>
//                 <MessageCircleHeartIcon size={12} className="text-white" />
//               </div>
//               <div className="flex-1 overflow-hidden">
//                 <MarqueeText running={isOpen} />
//               </div>
//             </div>
//           )}

//           <Separator className="my-2" />

//           {/* Navigation Links */}
//           <nav className="flex flex-col gap-1 py-2">
//             <MobileNavigationLinks />
//           </nav>

//           {/* Admin Menu (แสดงเฉพาะ Admin) */}
//           {user?.role === "admin" && (
//             <div className="mt-4">
//               <Separator className="mb-4" />
//               <Button
//                 variant="destructive"
//                 className="w-full justify-center gap-2 rounded-xl shadow-sm"
//                 asChild
//                 // ✅ กดแล้วปิดเมนูทันที
//                 onClick={() => setIsOpen(false)}
//               >
//                 <Link href="/admin">เข้าสู่ระบบหลังบ้าน</Link>
//               </Button>
//             </div>
//           )}
//         </div>

//         {/* --- ส่วนท้าย (Footer) --- */}
//         {user && (
//           <SheetFooter className="mt-auto border-t border-border bg-muted/30 px-6 py-4">
//             <SignOutButton isMobile />
//           </SheetFooter>
//         )}
//       </SheetContent>
//     </Sheet>
//   );
// });
