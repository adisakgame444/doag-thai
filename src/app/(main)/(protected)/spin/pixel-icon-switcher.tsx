// "use client";

// import React, { useState, useEffect } from "react";
// import { Sparkles } from "lucide-react";

// // --- 1. SVG ตู้เกม Arcade (อันเดิม) ---
// const ArcadeSVG = () => (
//   <svg
//     viewBox="0 0 24 24"
//     className="w-full h-full drop-shadow-[4px_4px_0px_rgba(0,0,0,0.4)]"
//     style={{ imageRendering: "pixelated" }}
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path d="M4 2h16v20H4V2z" fill="#1f2937" />
//     <path d="M6 4h12v8H6V4z" fill="#374151" />
//     <path d="M6 5h10v6H6V5z" fill="#10b981" opacity="0.8" />
//     <path d="M4 12h16v3H4v-3z" fill="#4b5563" />
//     <rect x="7" y="13" width="2" height="1" fill="#ef4444" />
//     <rect x="15" y="13" width="1" height="1" fill="#f59e0b" />
//     <rect x="11" y="17" width="2" height="3" fill="#111827" />
//   </svg>
// );

// const SlotMachineSVG = () => (
//   <svg
//     viewBox="0 0 24 24"
//     className="w-full h-full drop-shadow-[4px_4px_0px_rgba(0,0,0,0.4)]"
//     style={{ imageRendering: "pixelated" }}
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path d="M5 2h14v20H5V2z" fill="#374151" /> {/* ตัวเครื่องสีเทาเข้ม */}
//     <path d="M7 4h10v2H7V4z" fill="#fbbf24" /> {/* ป้าย Jackpot สีเหลือง */}
//     <path d="M7 7h10v6H7V7z" fill="#f3f4f6" /> {/* หน้าจอสีขาว */}
//     {/* สัญลักษณ์ในสล็อต (เลข 7 สีแดง) */}
//     <path d="M8 8h3l-1 4H8v-4zM13 8h3l-1 4h-2v-4z" fill="#ef4444" />
//     {/* คันโยกด้านข้าง */}
//     <rect x="19" y="10" width="2" height="6" fill="#4b5563" />
//     <circle cx="20" cy="9" r="2" fill="#ef4444" /> {/* หัวคันโยกสีแดง */}
//     <path d="M5 14h14v3H5v-3z" fill="#1f2937" /> {/* ช่องรับเหรียญ */}
//     <rect x="10" y="15" width="4" height="1" fill="#fbbf24" /> {/* แสงไฟ */}
//   </svg>
// );

// // --- 2. SVG จอย PlayStation พิกเซล (อันใหม่) ---
// const PlayStationSVG = () => (
//   <svg
//     viewBox="0 0 24 24"
//     className="w-full h-full drop-shadow-[4px_4px_0px_rgba(0,0,0,0.4)]"
//     style={{ imageRendering: "pixelated" }}
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path d="M3 9H21V15H19V18H16V16H8V18H5V15H3V9Z" fill="#9ca3af" />{" "}
//     {/* ตัวจอยสีเทา */}
//     <path d="M3 15H6V18H4V16H3V15Z" fill="#6b7280" /> {/* ด้ามจับซ้าย */}
//     <path d="M18 15H21V16H20V18H18V15Z" fill="#6b7280" /> {/* ด้ามจับขวา */}
//     <path d="M7 10H9V11H10V13H9V14H7V13H6V11H7V10Z" fill="#1f2937" />{" "}
//     {/* D-pad ปุ่มทิศทาง */}
//     <rect x="16" y="11" width="1" height="1" fill="#10b981" />{" "}
//     {/* สามเหลี่ยมเขียว */}
//     <rect x="18" y="12" width="1" height="1" fill="#ef4444" /> {/* วงกลมแดง */}
//     <rect x="16" y="13" width="1" height="1" fill="#3b82f6" />{" "}
//     {/* กากบาทน้ำเงิน */}
//     <rect x="14" y="12" width="1" height="1" fill="#ec4899" />{" "}
//     {/* สี่เหลี่ยมชมพู */}
//     <rect x="11" y="13" width="2" height="1" fill="#374151" />{" "}
//     {/* ปุ่ม Select */}
//     <rect x="13" y="13" width="2" height="1" fill="#374151" />{" "}
//     {/* ปุ่ม Start */}
//   </svg>
// );

// // --- 3. ตัว Component หลักสำหรับสลับไอคอน ---
// export default function PixelIconSwitcher() {
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIndex((prev) => (prev + 1) % 3);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     /* ปรับขนาด Container ให้ใหญ่ขึ้น: มือถือ w-20 h-24 | คอม sm:w-44 sm:h-48 */
//     <div className="w-20 h-24 sm:w-44 sm:h-48 relative animate-bounce-slow flex items-center justify-center shrink-0">
//       {/* 0: ตู้เกม Arcade */}
//       <div
//         className={`absolute inset-0 transition-opacity duration-1000 ${index === 0 ? "opacity-100 z-10" : "opacity-0"}`}
//       >
//         <ArcadeSVG />
//       </div>

//       {/* 1: จอย PS */}
//       <div
//         className={`absolute inset-0 transition-opacity duration-1000 ${index === 1 ? "opacity-100 z-10" : "opacity-0"}`}
//       >
//         <PlayStationSVG />
//       </div>

//       {/* 2: ตู้สล็อต */}
//       <div
//         className={`absolute inset-0 transition-opacity duration-1000 ${index === 2 ? "opacity-100 z-10" : "opacity-0"}`}
//       >
//         <SlotMachineSVG />
//       </div>

//       {/* ปรับตำแหน่ง Sparkles ให้พอดีกับขนาดที่ใหญ่ขึ้น */}
//       <Sparkles className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-6 h-6 sm:w-10 sm:h-10 text-yellow-300 animate-spin-slow z-20" />
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Sparkles } from "lucide-react";

// --- SVG Components (เหมือนเดิม) ---
const ArcadeSVG = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-full h-full drop-shadow-[4px_4px_0px_rgba(0,0,0,0.4)]"
    style={{ imageRendering: "pixelated" }}
    fill="none"
  >
    <path d="M4 2h16v20H4V2z" fill="#1f2937" />
    <path d="M6 4h12v8H6V4z" fill="#374151" />
    <path d="M6 5h10v6H6V5z" fill="#10b981" opacity="0.8" />
    <path d="M4 12h16v3H4v-3z" fill="#4b5563" />
    <rect x="7" y="13" width="2" height="1" fill="#ef4444" />
    <rect x="15" y="13" width="1" height="1" fill="#f59e0b" />
    <rect x="11" y="17" width="2" height="3" fill="#111827" />
  </svg>
);

const PlayStationSVG = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-full h-full drop-shadow-[4px_4px_0px_rgba(0,0,0,0.4)]"
    style={{ imageRendering: "pixelated" }}
    fill="none"
  >
    <path d="M3 9H21V15H19V18H16V16H8V18H5V15H3V9Z" fill="#9ca3af" />
    <path d="M3 15H6V18H4V16H3V15Z" fill="#6b7280" />
    <path d="M18 15H21V16H20V18H18V15Z" fill="#6b7280" />
    <path d="M7 10H9V11H10V13H9V14H7V13H6V11H7V10Z" fill="#1f2937" />
    <rect x="16" y="11" width="1" height="1" fill="#10b981" />
    <rect x="18" y="12" width="1" height="1" fill="#ef4444" />
    <rect x="16" y="13" width="1" height="1" fill="#3b82f6" />
    <rect x="14" y="12" width="1" height="1" fill="#ec4899" />
    <rect x="11" y="13" width="2" height="1" fill="#374151" />
    <rect x="13" y="13" width="2" height="1" fill="#374151" />
  </svg>
);

const SlotMachineSVG = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-full h-full drop-shadow-[4px_4px_0px_rgba(0,0,0,0.4)]"
    style={{ imageRendering: "pixelated" }}
    fill="none"
  >
    <path d="M5 2h14v20H5V2z" fill="#374151" />
    <path d="M7 4h10v2H7V4z" fill="#fbbf24" />
    <path d="M7 7h10v6H7V7z" fill="#f3f4f6" />
    <path d="M8 8h3l-1 4H8v-4zM13 8h3l-1 4h-2v-4z" fill="#ef4444" />
    <rect x="19" y="10" width="2" height="6" fill="#4b5563" />
    <circle cx="20" cy="9" r="2" fill="#ef4444" />
    <path d="M5 14h14v3H5v-3z" fill="#1f2937" />
    <rect x="10" y="15" width="4" height="1" fill="#fbbf24" />
  </svg>
);

export default function PixelIconSwitcher() {
  const [index, setIndex] = useState(0);

  const icons = useMemo(
    () => [
      { id: "arcade", component: <ArcadeSVG /> },
      { id: "ps", component: <PlayStationSVG /> },
      { id: "slot", component: <SlotMachineSVG /> },
    ],
    [],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % icons.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [icons.length]);

  return (
    <div className="w-20 h-24 sm:w-44 sm:h-48 relative animate-bounce-slow flex items-center justify-center shrink-0">
      {icons.map((icon, i) => (
        <div
          key={icon.id}
          className={`
            absolute inset-0 transition-opacity duration-1000 ease-in-out
            ${index === i ? "opacity-100 z-10" : "opacity-0 z-0"}
          `}
        >
          {icon.component}
        </div>
      ))}

      <Sparkles className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-6 h-6 sm:w-10 sm:h-10 text-yellow-300 animate-spin-slow z-20" />
    </div>
  );
}
