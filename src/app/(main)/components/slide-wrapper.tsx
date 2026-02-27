"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";

// 1. สร้าง Context สำหรับแชร์คำสั่งเปิด/ปิดเมนู ให้ปุ่มที่อยู่ที่ไหนก็กดเปิดได้
interface MenuContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}
const MenuContext = createContext<MenuContextType>({ isOpen: false, setIsOpen: () => {} });
export const useMobileMenu = () => useContext(MenuContext);

// 2. Component ตัวแม่ที่จะดันหน้าเว็บ
export default function SlideWrapper({
  children,
  menuContent
}: {
  children: ReactNode;
  menuContent: ReactNode; 
}) {
  const [isOpen, setIsOpen] = useState(false);

  // ล็อกไม่ให้ไถหน้าเว็บขึ้นลงได้ตอนเมนูเปิด
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    // ยิง Event เผื่อเอาไปใช้กับ MarqueeText
    const event = new CustomEvent("mobileMenuToggle", { detail: { isOpen } });
    window.dispatchEvent(event);
  }, [isOpen]);

  return (
    <MenuContext.Provider value={{ isOpen, setIsOpen }}>
      {/* กล่องนอกสุด ล็อกความกว้างและพื้นหลังสีดำเวลากลางคืน */}
      <div className="relative w-full overflow-hidden bg-background md:bg-transparent">

        {/* ========================================= */}
        {/* ส่วนที่ 1: หน้าเว็บหลักทั้งหมด (จะโดนดันไปขวา) */}
        {/* ========================================= */}
        <div
          className={cn(
            "min-h-svh w-full bg-background transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
            isOpen ? "translate-x-[80%] sm:translate-x-[70%] md:translate-x-0" : "translate-x-0" // md:translate-x-0 คือไม่เลื่อนในจอคอม
          )}
        >
          {/* แผ่นใสๆ มาบังหน้าหลักตอนเมนูเปิด พอกดปุ๊บให้เมนูปิด */}
          {isOpen && (
            <div
              className="absolute inset-0 z-50 cursor-pointer bg-black/5 md:hidden"
              onClick={() => setIsOpen(false)}
            />
          )}
          {children}
        </div>

        {/* ========================================= */}
        {/* ส่วนที่ 2: เมนูมือถือ (ซ่อนอยู่ซ้าย เลื่อนเข้ามาเมื่อเปิด) */}
        {/* ========================================= */}
        <div
          className={cn(
            "fixed top-0 left-0 z-50 h-[100dvh] w-[80%] sm:w-[70%] md:w-[400px] md:hidden bg-card shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {menuContent}
        </div>

      </div>
    </MenuContext.Provider>
  );
}