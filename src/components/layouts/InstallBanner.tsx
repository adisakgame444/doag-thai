// "use client";
// import { usePWA } from "@/context/PWAContext";
// import Link from "next/link";
// import { useState, useEffect } from "react";

// export default function InstallBanner() {
//   const { isInstallable } = usePWA();
//   const [isVisible, setIsVisible] = useState(false);

//   // รอให้ Client โหลดเสร็จก่อนค่อยเช็ค (ป้องกัน Hydration Error)
//   useEffect(() => {
//     const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
//     if (isInstallable || isIOS) {
//       setIsVisible(true);
//     }
//   }, [isInstallable]);
//   if (!isVisible) return null;

//   return (
//     // Banner สีดำ ตัดขอบเขียว
//     <div className="fixed top-0 left-0 w-full z-[9999] bg-black/90 backdrop-blur-md border-b border-green-500/30 text-white p-3 shadow-2xl flex justify-between items-center transition-all animate-in slide-in-from-top">
//       <div className="flex items-center gap-3">
//         {/* ไอคอนร้านจำลอง */}
//         <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.5)]">
//           <span className="text-xl">🌿</span>
//         </div>
//         <div>
//           <p className="text-sm font-bold text-green-400">ติดตั้งแอปพลิเคชัน</p>
//           <p className="text-xs text-gray-300">สั่งซื้อง่าย สะสมแต้มไวขึ้น</p>
//         </div>
//       </div>

//       <div className="flex items-center gap-3">
//         <Link
//           href="/install"
//           className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg transition-all"
//         >
//           ดาวน์โหลด
//         </Link>

//         <button
//           onClick={() => setIsVisible(false)}
//           className="p-1 hover:text-red-400 transition"
//           aria-label="Close banner" // ✅ ใส่บรรทัดนี้ Error จะหายไปครับ
//           title="ปิดแถบแจ้งเตือน" // ✅ ใส่ title ด้วยก็ได้เผื่อเอาเม้าส์ไปชี้
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth={1.5}
//             stroke="currentColor"
//             className="w-6 h-6"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { usePWA } from "@/context/PWAContext";
// import Link from "next/link";
// import Image from "next/image";
// import { useState, useEffect } from "react";

// export default function InstallBanner() {
//   const { isInstallable } = usePWA();
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     // Logic การเช็ค iOS และ Android เหมือนเดิม (เพราะมันถูกต้องแล้ว)
//     const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
//     // ถ้าพร้อมติดตั้ง หรือเป็น iOS ให้แสดงผล และต้องยังไม่เคยถูกปิด
//     if (isInstallable || isIOS) {
//       // เพิ่ม delay นิดหน่อยเพื่อให้ animation เข้ามาสวยๆ ตอนโหลดหน้าเว็บ
//       setTimeout(() => setIsVisible(true), 100);
//     }
//   }, [isInstallable]);

//   if (!isVisible) return null;

//   return (
//     // ✨ Container หลัก: Fixed บนสุด + z-index สูงสุด + Animation เข้ามา
//     <div className="fixed top-0 left-0 w-full z-[9999] transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] animate-in slide-in-from-top-full">
//       {/* 🎨 Layers ของพื้นหลัง (ซ้อนกันเพื่อความมีมิติ) */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-b-3xl">
//         {/* Layer 1: พื้นหลังสีดำเข้มแบบมี Gradient */}
//         <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-[#090909]/98 to-black/95 backdrop-blur-2xl" />

//         {/* Layer 2: แสง Neon Glow สีเขียวจางๆ ด้านบน */}
//         <div className="absolute -top-[100px] left-1/2 -translate-x-1/2 w-[60%] h-[100px] bg-green-500/20 blur-[80px] rounded-full" />

//         {/* Layer 3: เส้นขอบเรืองแสงด้านล่างสุด */}
//         <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />
//       </div>

//       {/* 📦 Content ภายใน (จัดวางด้วย Flexbox) */}
//       <div className="relative flex items-center justify-between px-5 py-4 mx-auto max-w-5xl">
//         {/* ----- ส่วนซ้าย: โลโก้และข้อความ ----- */}
//         <div className="flex items-center gap-4 flex-1 overflow-hidden">
//           {/* ✅ กรอบใส่โลโก้: มีเงาสีเขียวซ้อน 2 ชั้นให้ดูพุ่งออกมา */}
//           <div className="relative h-12 w-12 shrink-0 rounded-2xl overflow-hidden border border-green-500/30 shadow-[0_4px_20px_rgba(34,197,94,0.3),0_0_0_1px_rgba(34,197,94,0.1)_inset] group">
//             <Image
//               src="/icons/icon-192.png"
//               alt="Weed Store App Icon"
//               width={48}
//               height={48}
//               className="object-cover w-full h-full scale-105 group-hover:scale-110 transition-transform duration-500"
//               priority // 🔥 โหลดทันที ห้ามรอ
//             />
//           </div>

//           <div className="flex flex-col justify-center overflow-hidden">
//             <h3 className="text-[15px] font-extrabold text-white leading-tight tracking-wide truncate drop-shadow-sm">
//               Weed Store App
//             </h3>
//             <p className="text-[11px] font-medium text-green-400/90 truncate pr-2">
//               ประสบการณ์ระดับพรีเมียม บนมือถือคุณ
//             </p>
//           </div>
//         </div>

//         {/* ----- ส่วนขวา: ปุ่ม Action ----- */}
//         <div className="flex items-center gap-3 shrink-0 pl-2">
//           {/* 🟢 ปุ่มดาวน์โหลดเทพ: Gradient + เงา + กดแล้วยุบ */}
//           <Link
//             href="/install"
//             className="group relative overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black active:scale-95 transition-transform duration-200"
//           >
//             {/* พื้นหลัง Gradient ของปุ่ม */}
//             <span className="absolute inset-0 bg-gradient-to-br from-green-400 via-green-500 to-green-700 opacity-90 transition-opacity group-hover:opacity-100" />

//             {/* เอฟเฟกต์แสงวิ่ง (Shimmer) เมื่อ Hover */}
//             <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />

//             {/* เนื้อหาในปุ่ม */}
//             <div className="relative flex h-full w-full items-center justify-center rounded-full bg-black/20 backdrop-blur-sm px-5 py-2.5 transition-colors group-hover:bg-transparent">
//               <span className="text-xs font-bold text-white tracking-wider uppercase drop-shadow">
//                 เปิดแอป
//               </span>
//             </div>
//           </Link>

//           {/* ❌ ปุ่มปิด: เรียบง่ายแต่มีสไตล์ */}
//           <button
//             onClick={() => setIsVisible(false)}
//             className="group p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all active:scale-90"
//             aria-label="Close banner"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2.5"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors"
//             >
//               <line x1="18" y1="6" x2="6" y2="18"></line>
//               <line x1="6" y1="6" x2="18" y2="18"></line>
//             </svg>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { usePWA } from "@/context/PWAContext";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function InstallBanner() {
  const { isInstallable } = usePWA();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isInstallable || isIOS) {
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [isInstallable]);

  if (!isVisible) return null;

  return (
    // ✨ Container: ลดขนาดโดยรวม
    <div className="fixed top-0 left-0 w-full z-[9999] transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] animate-in slide-in-from-top-full">
      {/* 🎨 Background Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-b-xl shadow-lg">
        {" "}
        {/* rounded-b-2xl -> xl */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-950 via-[#051a0d] to-green-950 backdrop-blur-xl" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, #22c55e 1px, transparent 1px), linear-gradient(to bottom, #22c55e 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
            maskImage:
              "linear-gradient(to bottom, black 40%, transparent 100%)",
          }}
        />
        <div className="absolute top-0 left-[10%] w-[80px] h-[80px] bg-green-500/40 blur-[50px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-[0_0_8px_#4ade80]" />
      </div>

      {/* 📦 Content ภายใน: ปรับลด Padding และขนาด */}
      <div className="relative flex items-center justify-between px-3 py-2 mx-auto max-w-5xl">
        {/* ส่วนซ้าย: โลโก้ + ข้อความ */}
        <div className="flex items-center gap-2.5 flex-1 overflow-hidden">
          {/* กรอบโลโก้: ลดขนาดเหลือ 36px (h-9 w-9) */}
          <div className="relative h-9 w-9 shrink-0 rounded-lg overflow-hidden border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)] group">
            <Image
              src="/icons/icon-192.png"
              alt="App Icon"
              width={192}
              height={192}
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
              priority
            />
          </div>

          <div className="flex flex-col justify-center">
            {/* ชื่อร้าน: ลดขนาด font */}
            <h3 className="text-xs font-bold text-white tracking-wide drop-shadow-md leading-tight">
              Doag - Thai
            </h3>
            {/* Tag: เล็กลงอีกนิด */}
            <p className="text-[9px] text-green-300 font-medium bg-green-900/40 px-1.5 py-0.5 rounded-full w-fit border border-green-500/20 mt-0.5">
              App Store Available
            </p>
          </div>
        </div>

        {/* ส่วนขวา: ปุ่ม Action */}
        <div className="flex items-center gap-2 shrink-0">
          {/* ปุ่มดาวน์โหลด: ลด Padding และ Font */}
          <Link
            href="/install"
            className="relative overflow-hidden bg-[#22c55e] hover:bg-[#16a34a] text-white/90 text-[10px] font-extrabold px-3.5 py-1.5 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all active:scale-95"
          >
            ดาวน์โหลด
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </Link>

          {/* ปุ่มปิด: เล็กลง */}
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-full text-green-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close banner"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16" // ลดขนาดไอคอน
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
