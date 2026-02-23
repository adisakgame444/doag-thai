// import { Megaphone } from "lucide-react";
// import MarqueeTextFeature from "@/components/layouts/header/marquee-text-feature";

// export function AnnouncementBar() {
//   // Constants for styling consistency
//   const SKEW_OFFSET = "25px";

//   return (
//     // <div className="flex items-center gap-0 filter drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)]">
//     <div
//       className="flex items-stretch h-10 gap-0"
//       style={{ boxShadow: "0 5px 10px rgba(0,0,0,0.15)" }}
//     >
//       {/* Label Section (Left) */}
//       <div
//         className="relative z-0 inline-flex items-center bg-gradient-to-br from-red-600 to-red-800 px-2 pr-8"
//         style={{
//           clipPath: `polygon(0 0, 100% 0, calc(100% - ${SKEW_OFFSET}) 100%, 0 100%)`,
//         }}
//       >
//         <div className="flex items-center gap-1 rounded-[6px] bg-white border border-red-200 px-2 py-0.5 shadow-sm">
//           <Megaphone size={14} className="text-red-600 fill-red-600" />
//           <span className="text-xs font-bold text-red-700">ประกาศ</span>
//         </div>
//       </div>

//       {/* Content Section (Right) */}
//       {/* Content Section (Right) */}
//       {/* Content Section (Right) */}
//       <div
//         className="
//           relative z-10 flex flex-1 items-center overflow-hidden

//           /* ✅ 1. ใช้ Border ธรรมดาแทน Ring (เรนเดอร์ส่วนโค้งได้เนียนกว่า) */
//           border-t border-b border-r
//           border-emerald-600/30 dark:border-emerald-500/50
//           border-l-0 /* ไม่เอาขอบซ้าย เพราะเราจะเฉียง */

//           /* ✅ 2. มุมโค้งขวาล่างเหมือนเดิม */
//           rounded-tr-none rounded-br-xl

//           /* สีพื้นหลัง */
//           bg-[#FAF7F0] dark:bg-neutral-900

//           /* Transition */
//           transition-all duration-300
//         "
//         style={{
//           marginLeft: `calc(${SKEW_OFFSET} * -1 + 1px)`,
//           paddingLeft: SKEW_OFFSET,

//           /* ✅ 3. สูตรแก้ปลายแหลม (Extended Clip Path) */
//           /* อธิบาย: เราสั่งให้จุดล่างซ้าย (จุดสุดท้าย) ลากยาวลงไปถึง 200% และถอยหลังไป -25px */
//           /* เพื่อให้เส้นเฉียงยังคงองศาเดิมเป๊ะๆ แต่ไม่ไปตัดโดนขอบล่างของกล่อง */
//           clipPath: `polygon(
//             ${SKEW_OFFSET} 0,
//             300% 0,
//             300% 200%,
//             calc(${SKEW_OFFSET} * -1) 200%
//           )`,
//         }}
//       >
//         {/* Neon Decor Line (เส้นแสงด้านบน) */}
//         <div className="absolute left-0 right-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />

//         <div
//           className="
//           w-[calc(100%+18px)] ml-[-18px]
//           text-zinc-800 dark:text-gray-200
//         "
//         >
//           <MarqueeTextFeature running={true} />
//         </div>
//       </div>
//     </div>
//   );
// }

import { Megaphone } from "lucide-react";
import MarqueeTextFeature from "@/components/layouts/header/marquee-text-feature";

export function AnnouncementBar() {
  const SKEW_OFFSET = "25px";

  return (
    /* ✅ 1. ใช้ filter: drop-shadow ที่ตัวแม่ 
       (มันจะสร้างเงารวมให้เองตามรูปทรงที่ซ้อนกัน ไม่เกิดเงาซ้อน) */
    <div className="flex items-stretch h-10 gap-0 pl-1 relative isolate filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.15)]">
      {/* 🔴 ส่วนซ้าย: ป้ายแดง (Label) - อยู่ชั้นบน (z-20) */}
      <div
        className="relative z-20 inline-flex items-center bg-gradient-to-br from-red-600 to-red-800 px-2 pr-8"
        style={{
          /* ตัดรูปทรงเฉพาะป้ายแดง */
          clipPath: `polygon(0 0, 100% 0, calc(100% - ${SKEW_OFFSET}) 100%, 0 100%)`,
        }}
      >
        <div className="flex items-center gap-1 rounded-[6px] bg-white border border-red-200 px-2 py-0.5 shadow-sm">
          <Megaphone size={14} className="text-red-600 fill-red-600" />
          <span className="text-xs font-bold text-red-700">ประกาศ</span>
        </div>
      </div>

      {/* ⚪️ ส่วนขวา: ข้อความ (Content) - อยู่ชั้นล่าง (z-10) */}
      <div
        className="
          relative z-10 flex flex-1 items-center overflow-hidden
          
          /* ✅ 2. กำหนดมุมตามสั่ง: ขวาบนเหลี่ยม / ขวาล่างโค้ง */
          rounded-tr-none 
          rounded-br-xl
          
          /* ✅ 3. เส้นขอบ: ใส่แค่ บน-ขวา-ล่าง (ไม่เอาซ้าย) */
          border-t border-b border-r border-l-0
          border-emerald-600/30 dark:border-emerald-500/50

          /* สีพื้นหลัง */
          bg-[#FAF7F0] dark:bg-neutral-900 
          
          /* Transition */
          transition-all duration-300
        "
        style={{
          /* ดันกล่องเข้าไปซ่อนใต้ป้ายแดง (-25px) */
          marginLeft: `calc(${SKEW_OFFSET} * -1 + 1px)`,
          paddingLeft: SKEW_OFFSET,

          /* ❌ ไม่มี clip-path แล้ว! (ลบต้นตอปัญหาทิ้ง) */
        }}
      >
        {/* Neon Decor Line */}
        <div className="absolute left-0 right-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />

        <div
          className="
          w-[calc(100%+18px)] ml-[-18px]
          text-zinc-800 dark:text-gray-200
        "
        >
          <MarqueeTextFeature running={true} />
        </div>
      </div>
    </div>
  );
}
