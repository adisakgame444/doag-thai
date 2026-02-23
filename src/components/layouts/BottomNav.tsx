// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { NAVIGATION_ITEMS } from "./header/navigation.config"; // 👈 แก้ path ให้ตรงกับไฟล์ของคุณ
// import { isActivePath } from "./header/navigation.config";

// export default function BottomNav() {
//   const pathname = usePathname();

//   return (
//     // ✨ Container: Fixed ล่างสุด + Glassmorphism + Safe Area
//     // <div className="fixed bottom-0 left-0 w-full z-[100] bg-[#050505]/90 backdrop-blur-xl border-t border-green-500/20 pb-safe">
//     <div className="fixed bottom-0 left-0 w-full z-40 bg-[#050505]/90 backdrop-blur-xl border-t border-green-500/20 pb-safe">
//       {/* Grid 5 ช่อง (เพราะคุณมี 5 เมนู) */}
//       <div className="grid grid-cols-5 h-[60px] max-w-md mx-auto relative">
//         {NAVIGATION_ITEMS.map((item) => {
//           const isActive = isActivePath(pathname, item.href);
//           const Icon = item.icon; // ดึง Icon Component ออกมา

//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               className="group relative flex flex-col items-center justify-center w-full h-full outline-none select-none"
//             >
//               {/* 🟢 Active Indicator: แสงด้านบน (Top Line) */}
//               {isActive && (
//                 <span className="absolute top-0 w-8 h-[2px] bg-green-500 shadow-[0_0_10px_#22c55e] rounded-full" />
//               )}

//               {/* 🟢 Active Glow: แสงฟุ้งๆ ตรงกลาง */}
//               {isActive && (
//                 <div className="absolute inset-0 bg-green-500/5 blur-xl rounded-full" />
//               )}

//               {/* Icon */}
//               <div
//                 className={`relative transition-all duration-300 ${
//                   isActive
//                     ? "-translate-y-1 text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]"
//                     : "text-gray-500 group-active:scale-90"
//                 }`}
//               >
//                 {/* ปรับขนาด Icon ให้เล็ก กระชับ */}
//                 <Icon strokeWidth={isActive ? 2.5 : 2} size={22} />
//               </div>

//               {/* Text Label */}
//               <span
//                 className={`text-[9px] font-medium mt-1 transition-all duration-300 ${
//                   isActive
//                     ? "text-white translate-y-0 opacity-100"
//                     : "text-gray-600 translate-y-1 opacity-80 group-hover:text-gray-400"
//                 }`}
//               >
//                 {item.title}
//               </span>
//             </Link>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_ITEMS } from "./header/navigation.config";
import { isActivePath } from "./header/navigation.config";

export default function BottomNav() {
  const pathname = usePathname();
  const mobileMenuItems = NAVIGATION_ITEMS.filter((item) => !item.desktopOnly);

  return (
    // ✨ Container หลัก
    // <div className="fixed bottom-0 left-0 w-full z-40 bg-[#050505]/90 backdrop-blur-xl border-t border-green-500/20 pb-safe">
    <div className="fixed bottom-0 left-0 w-full z-40 bg-card border-t border-border pb-safe transition-colors duration-300">
      {" "}
      {/* 🟢 แก้ตรงนี้: เปลี่ยน grid -> flex และใช้ justify-between + px-6 */}
      <div className="flex justify-between items-center h-[60px] max-w-md mx-auto relative px-6">
        {mobileMenuItems.map((item) => {
          const isActive = isActivePath(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              // 🟢 แก้ตรงนี้: เอา w-full ออก เพื่อให้ปุ่มกว้างเท่าเนื้อหาข้างในพอดี (Flex จะได้คำนวณระยะห่างให้)
              className="group relative flex flex-col items-center justify-center h-full outline-none select-none min-w-[50px]"
            >
              {/* Active Indicator (ขีดบน) */}
              {isActive && (
                <span className="absolute top-0 w-8 h-[2px] bg-green-500 shadow-[0_0_10px_#22c55e] rounded-full" />
              )}

              {/* Active Glow (แสงฟุ้ง) */}
              {isActive && (
                <div className="absolute inset-0 bg-green-500/5 blur-xl rounded-full" />
              )}

              {/* Icon */}
              <div
                className={`relative transition-all duration-300 ${
                  isActive
                    ? "-translate-y-1 text-green-600 dark:text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                    : "text-muted-foreground group-active:scale-90"
                }`}
              >
                <Icon strokeWidth={isActive ? 2.5 : 2} size={22} />
              </div>

              {/* Text Label */}
              <span
                className={`text-[9px] font-medium mt-1 transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? "text-green-800 dark:text-white translate-y-0 opacity-100"
                    : // ตอนยังไม่กด
                      "text-muted-foreground translate-y-1 opacity-80 group-hover:text-foreground"
                }`}
              >
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
