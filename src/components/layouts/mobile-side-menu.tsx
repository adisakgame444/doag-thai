// "use client";

// import Link from "next/link";
// import { MapPin, HelpCircle, FileText, Box, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { SheetClose } from "@/components/ui/sheet";

// export function MobileSideMenu() {
//   const menuItems = [
//     { name: "ติดตามพัสดุ", icon: Box, href: "/orders" },
//     { name: "วิธีการสั่งซื้อ", icon: HelpCircle, href: "/how-to-order" },
//     { name: "นโยบายร้านค้า", icon: FileText, href: "/policy" },
//     { name: "ที่อยู่จัดส่ง", icon: MapPin, href: "/profile/address" },
//   ];

//   return (
//     <div className="flex flex-col gap-1 py-1">
//       {menuItems.map((item) => (
//         <SheetClose key={item.name} asChild>
//           <Button
//             variant="ghost"
//             // ✅ ปรับขนาด: h-9 (36px), text-sm (เล็กกำลังดี), padding น้อยลง
//             className="group w-full justify-between h-9 px-3 text-sm font-normal text-muted-foreground hover:text-foreground hover:bg-green-500/5 rounded-lg transition-all duration-200"
//             asChild
//           >
//             <Link href={item.href}>
//               <div className="flex items-center gap-2.5">
//                 {/* ไอคอนเล็กลง (16px) และเปลี่ยนสีเขียวเมื่อ Hover */}
//                 <item.icon
//                   size={16}
//                   className="transition-colors duration-200 group-hover:text-green-500"
//                 />
//                 {/* ตัวหนังสือขยับนิดๆ เมื่อ Hover */}
//                 <span className="transition-transform duration-200 group-hover:translate-x-0.5">
//                   {item.name}
//                 </span>
//               </div>

//               {/* ลูกศร > โผล่มาเมื่อ Hover */}
//               <ChevronRight
//                 size={14}
//                 className="opacity-0 -translate-x-2 text-green-500 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
//               />
//             </Link>
//           </Button>
//         </SheetClose>
//       ))}
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { MapPin, HelpCircle, FileText, Box, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";

export function MobileSideMenu() {
  const menuItems = [
    { name: "ติดตามพัสดุ", icon: Box, href: "/orders" },
    { name: "วิธีการสั่งซื้อ", icon: HelpCircle, href: "/how-to-order" },
    { name: "นโยบายร้านค้า", icon: FileText, href: "/privacy-policy" },
    { name: "ที่อยู่จัดส่ง", icon: MapPin, href: "/orders" },
  ];

  return (
    <div className="flex flex-col gap-2 py-2">
      {menuItems.map((item) => (
        <SheetClose key={item.name} asChild>
          <Button
            // 🟢 เปลี่ยน variant เป็น secondary เพื่อให้มีพื้นหลัง
            variant="secondary"
            // 🟢 ปรับขนาด: h-11 (สูงขึ้นกดง่าย), rounded-xl (โค้งมนสวย), เพิ่มเงาเล็กน้อย
            className="group w-full justify-between h-11 px-4 text-sm font-medium bg-muted/50 hover:bg-muted text-foreground shadow-sm rounded-xl transition-all duration-200"
            asChild
          >
            <Link href={item.href} className="flex items-center">
              <div className="flex items-center gap-3">
                {/* 🟢 เพิ่มพื้นหลังวงกลมให้ไอคอนดูเด่นขึ้น */}
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background/80 text-muted-foreground group-hover:text-green-500 group-hover:bg-green-500/10 transition-colors">
                  <item.icon size={18} />
                </div>
                {/* ตัวหนังสือ */}
                <span>{item.name}</span>
              </div>

              {/* ลูกศร > โผล่มาเมื่อ Hover (เหมือนเดิมแต่ปรับสี) */}
              <ChevronRight
                size={16}
                className="text-muted-foreground/50 transition-all duration-200 group-hover:text-green-500 group-hover:translate-x-0.5"
              />
            </Link>
          </Button>
        </SheetClose>
      ))}
    </div>
  );
}
