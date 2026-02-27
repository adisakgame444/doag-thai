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
  const [isFullyOpen, setIsFullyOpen] = useState(false);

  // ✅ ส่ง event ให้ component อื่น ๆ รับรู้ว่าเมนูเปิด/ปิด
  // useEffect(() => {
  //   const event = new CustomEvent("mobileMenuToggle", { detail: { isOpen } });
  //   window.dispatchEvent(event);
  // }, [isOpen]);
  // useEffect(() => {
  //   const event = new CustomEvent("mobileMenuToggle", { detail: { isOpen } });
  //   window.dispatchEvent(event);

  //   // 🔴 2. เพิ่มโค้ดบล็อกนี้: หน่วงเวลาของหนักๆ ไว้ 500ms
  //   if (isOpen) {
  //     // รอให้เมนูเลื่อนจบก่อน (500ms) แล้วค่อยเปลี่ยนค่าเป็น true
  //     const timer = setTimeout(() => setIsFullyOpen(true), 500);
  //     return () => clearTimeout(timer);
  //   } else {
  //     setIsFullyOpen(false); // ถ้าปิดเมนู ให้รีเซ็ตกลับทันที
  //   }
  // }, [isOpen]);
  useEffect(() => {
    const event = new CustomEvent("mobileMenuToggle", { detail: { isOpen } });
    window.dispatchEvent(event);

    if (isOpen) {
      // ✅ ปรับตัวเลขให้สัมพันธ์กับ CSS (ถ้า CSS คือ 600ms ตรงนี้ควรเป็น 600 หรือ 700)
      // การบวกเพิ่ม 50-100ms จะช่วยให้ชัวร์ว่า GPU สลับโหมดจาก Slide มาเป็น Marquee ได้เนียนกริบ
      const timer = setTimeout(() => setIsFullyOpen(true), 650);
      return () => clearTimeout(timer);
    } else {
      setIsFullyOpen(false);
    }
  }, [isOpen]);

  // useEffect(() => {
  //   if (isOpen) {
  //     // เมื่อเมนูเปิด: สั่งเพิ่ม class เพื่อไปหยุดงานหนักๆ ในหน้าหลัง
  //     document.documentElement.classList.add("menu-open");
  //   } else {
  //     // เมื่อเมนูปิด: เอา class ออกเพื่อให้ทุกอย่างกลับมาทำงานปกติ
  //     document.documentElement.classList.remove("menu-open");
  //   }
  // }, [isOpen]);
  // useEffect(() => {
  //   if (isOpen) {
  //     document.documentElement.classList.add("menu-open");
  //   } else {
  //     // 🟢 หน่วงเวลาไว้ 400ms (หรือตามเวลาปิดของ Sheet) ก่อนจะเปิดให้หน้าหลังกลับมาขยับ
  //     const timer = setTimeout(() => {
  //       document.documentElement.classList.remove("menu-open");
  //     }, 400);
  //     return () => clearTimeout(timer);
  //   }
  // }, [isOpen]);

  const handleOpenMenu = () => {
    // 🟢 1. ใส่ Class ทันทีเพื่อหยุด Animation/Blur ข้างหลัง (ถางทางให้ GPU)
    document.documentElement.classList.add("menu-open");

    // 🟢 2. ใช้ requestAnimationFrame เพื่อให้การเปิดเมนูเกิดขึ้นในเฟรมถัดไปที่ว่าง
    requestAnimationFrame(() => {
      setIsOpen(true);
    });
  };

  // ปรับ useEffect สำหรับการคุม Class ให้ครอบคลุมทั้งเปิดและปิด
  useEffect(() => {
    if (isOpen) {
      // กรณีเปิด: เราใส่ใน handleOpenMenu ไปแล้ว แต่ใส่กันพลาดไว้อีกชั้นได้ครับ
      document.documentElement.classList.add("menu-open");
    } else {
      // กรณีปิด: หน่วงเวลา 400ms เพื่อให้เมนูสไลด์หายไปก่อนค่อยคืนค่าหน้าหลัง
      const timer = setTimeout(() => {
        document.documentElement.classList.remove("menu-open");
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {/* ปุ่มเปิดเมนู */}
      {/* <SheetTrigger className="md:hidden" aria-label="เปิดเมนูมือถือ" asChild>
        <Button variant="ghost" size="icon">
          <Menu size={20} />
        </Button>
      </SheetTrigger> */}
      {/* <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => {
          // 🟢 ใช้ requestAnimationFrame เพื่อให้เบราว์เซอร์ Paint งานที่ค้างอยู่ให้เสร็จก่อนเริ่มเปิดเมนู
          requestAnimationFrame(() => {
            setIsOpen(true);
          });
        }}
      >
        <Menu size={20} />
      </Button> */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={handleOpenMenu} // 🟢 เรียกใช้ฟังก์ชันใหม่
      >
        <Menu size={20} />
      </Button>

      {/* ✅ กล่องเมนูหลัก */}
      {/* <SheetContent
        side="left"
        aria-label="เมนูหลักของเว็บไซต์"
        className="will-change-transform translate-z-0 flex h-full w-[80%] sm:w-[70%] md:w-[400px] flex-col overflow-hidden p-0"
        // style={{
        //   backfaceVisibility: "hidden",
        //   contain: "layout paint size style",
        //   transform: "none",
        // }}
        // forceMount
      > */}
      <SheetContent
        side="left"
        aria-label="เมนูหลักของเว็บไซต์"
        // ✅ 1. ลบ translate-z-0 ออก แล้วใช้ transform-gpu แทน (มาตรฐาน Tailwind)
        // ✅ 2. คง will-change-transform ไว้เพื่อจองเมมโมรี่ล่วงหน้า
        // ✅ 3. ใส่เงา shadow-2xl หรือ shadow-xl (แทนเงา defualt ของ Shadcn ที่หนักเครื่อง)
        className="flex h-full w-[80%] sm:w-[70%] md:w-[400px] flex-col overflow-hidden p-0 transform-gpu will-change-transform shadow-xl"
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
              {/* <MarqueeText running={isOpen} /> */}
              <MarqueeText running={isFullyOpen} />
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
