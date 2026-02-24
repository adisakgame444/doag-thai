// "use client";

// import { useMemo } from "react";

// interface MarqueeTextProps {
//   running?: boolean;
//   text?: string;
// }

// export function MarqueeText({
//   running = false,
//   text = "📦 ส่งของทุกวัน! สั่งก่อน 12.00 น. ได้ของไวชัวร์! ⏰🚚 ❤️ ขอบคุณลูกค้าทุกท่านที่ไว้ใจเรานะคะ 🙌 แล้วพบกันอีกน้าา~",
// }: MarqueeTextProps) {
//   const marqueeMessage = useMemo(
//     () =>
//       [...text].map((char, i) => (
//         <span
//           key={i}
//           className="text-inherit transition-transform duration-300 hover:scale-105"
//         >
//           {char}
//         </span>
//       )),
//     [text],
//   );

//   return (
//     <div className="marquee-container overflow-hidden relative flex-1">
//       <div
//         data-running={running}
//         className="marquee-text inline-block whitespace-nowrap text-sm font-semibold text-white drop-shadow-[0_0_4px_rgba(0,0,0,0.3)]"
//       >
//         {marqueeMessage}
//       </div>
//       <style jsx>{`
//         .marquee-text {
//           animation: marquee 12s linear infinite;
//           animation-play-state: var(--play, paused);
//         }
//         .marquee-text[data-running="true"] {
//           --play: running;
//         }
//         @keyframes marquee {
//           0% {
//             transform: translate3d(100%, 0, 0);
//           }
//           100% {
//             transform: translate3d(-100%, 0, 0);
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// "use client";

// import { useMemo } from "react";

// interface MarqueeTextProps {
//   running?: boolean;
//   text?: string;
// }

// export function MarqueeText({
//   running = false,
//   text = "📦 ส่งของทุกวัน! สั่งก่อน 12.00 น. ได้ของไวชัวร์! ⏰🚚 ❤️ ขอบคุณลูกค้าทุกท่านที่ไว้ใจเรานะคะ 🙌 แล้วพบกันอีกน้าา~",
// }: MarqueeTextProps) {
//   const marqueeMessage = useMemo(
//     () =>
//       [...text].map((char, i) => (
//         <span key={i} className="text-black dark:text-white">
//           {char}
//         </span>
//       )),
//     [text],
//   );
//   return (
//     <div className="overflow-hidden flex-1">
//       <div
//         className={`
//         whitespace-nowrap inline-block text-sm font-semibold
//         will-change-transform animate-marquee-slow
//       `}
//         style={{ animationPlayState: running ? "running" : "paused" }}
//       >
//         {marqueeMessage}
//       </div>
//     </div>
//   );
// }

// "use client";

// import { motion } from "framer-motion";

// interface MarqueeTextProps {
//   running?: boolean;
//   text?: string;
// }

// export function MarqueeText({
//   running = false,
//   // ข้อความตัวอย่าง (แก้ได้)
//   text = "📦 ส่งของทุกวัน! สั่งก่อน 12.00 น. ได้ของไวชัวร์! ⏰🚚 ❤️ ขอบคุณลูกค้าทุกท่านที่ไว้ใจเรานะคะ 🙌 แล้วพบกันอีกน้าา~",
// }: MarqueeTextProps) {
//   return (
//     <div className="overflow-hidden flex-1 relative flex items-center h-full">
//       <motion.div
//         // ✅ ปรับสี: text-zinc-900 (ดำพรีเมียม) และ dark:text-zinc-100 (ขาวนวล)
//         className="whitespace-nowrap text-sm font-semibold text-zinc-900 dark:text-zinc-100 will-change-transform"
//         // สั่งให้วิ่งจากขวาสุด (100%) ไปซ้ายสุด (-100%)
//         animate={{ x: ["100%", "-100%"] }}
//         transition={{
//           repeat: Infinity,
//           ease: "linear",
//           // ✅ ปรับความเร็วตรงนี้:
//           // เลขยิ่งน้อย = ยิ่งเร็ว (ลองปรับเป็น 8 หรือ 12 ได้ถ้ายังไม่ถูกใจ)
//           duration: 12,
//         }}
//         // ถ้า running = false จะหยุดวิ่ง (แต่แนะนำให้ปล่อยวิ่งตลอดจะสวยกว่า)
//         style={{ animationPlayState: running ? "running" : "paused" }}
//       >
//         {text}
//       </motion.div>
//     </div>
//   );
// }

// "use client";

// import { memo, useEffect, useState } from "react";
// import { cn } from "@/lib/utils";

// interface MarqueeTextProps {
//   running?: boolean;
//   text?: string;
// }

// export function MarqueeText({
//   running = true,
//   text = "📦 ส่งของทุกวัน! สั่งก่อน 12.00 น. ได้ของไวชัวร์! ⏰🚚 ❤️ ขอบคุณลูกค้าทุกท่านที่ไว้ใจเรานะคะ 🙌 แล้วพบกันอีกน้าา~",
// }: MarqueeTextProps) {
//   // state คุมการเริ่มวิ่ง
//   const [startRunning, setStartRunning] = useState(false);

//   useEffect(() => {
//     let timer: NodeJS.Timeout;

//     if (running) {
//       // ✅ 1. เปิดเมนูมา: ยังไม่วิ่ง (มันจะไปกองรออยู่ขวาสุดตาม CSS)
//       // ✅ 2. รอ 3 วินาที (3000ms) แล้วค่อยเริ่มปล่อยตัววิ่งออกมา
//       timer = setTimeout(() => {
//         setStartRunning(true);
//       }, 3000);
//     } else {
//       // ปิดเมนู: รีเซ็ตค่า (กลับไปรอที่ขวาสุดใหม่)
//       setStartRunning(false);
//     }

//     return () => clearTimeout(timer);
//   }, [running]);

//   return (
//     // overflow-hidden สำคัญมาก เพื่อซ่อนข้อความตอนที่มันรออยู่ขวานอกจอ
//     <div className="overflow-hidden flex-1 relative flex items-center h-full mask-linear-fade select-none pointer-events-none">
//       <style>{`
//         /* ✅ Keyframe: วิ่งจาก ขวาสุด (100%) ไป ซ้ายสุด (-100%) */
//         @keyframes marquee-from-right {
//           0% { transform: translate3d(100%, 0, 0); }  /* เริ่มต้น: อยู่นอกจอทางขวา */
//           100% { transform: translate3d(-100%, 0, 0); } /* สิ้นสุด: วิ่งเลยจอไปทางซ้าย */
//         }

//         .marquee-track {
//           display: flex;
//           width: 100%; /* ให้กว้างเต็ม container เพื่อให้ calculate % ได้ถูก */
//           white-space: nowrap;
//           will-change: transform;

//           /* เทคนิค GPU Isolation */
//           backface-visibility: hidden;
//           perspective: 1000px;
//           transform: translateZ(0);

//           /* ✅ จุดสำคัญ:
//              1. เริ่มต้นให้ดันไปรอขวาสุดก่อนเลย (translateX 100%)
//              2. animation ยังไม่ใส่ตรงนี้ เดี๋ยวไปใส่ตอนครบ 3 วิ
//           */
//           transform: translate3d(100%, 0, 0);
//         }

//         /* คลาสสำหรับสั่งวิ่ง */
//         .running {
//           /* วิ่ง 15 วิ (ปรับได้) วนลูปไปเรื่อยๆ (infinite) */
//           animation: marquee-from-right 15s linear infinite;
//         }
//       `}</style>

//       <div
//         className={cn(
//           "marquee-track text-sm font-semibold text-zinc-900 dark:text-zinc-100",
//           // ✅ ถ้าครบ 3 วิ (startRunning = true) ให้เติมคลาส .running เข้าไป
//           startRunning && "running",
//         )}
//       >
//         {/* ใช้ชุดเดียวพอ เพราะเราวิ่งจาก 100% ไป -100% (วิ่งผ่านหน้าจอ) */}
//         <span>{text}</span>
//       </div>
//     </div>
//   );
// }

// export default memo(MarqueeText);

// "use client";

// import { memo } from "react";
// import { cn } from "@/lib/utils";

// interface MarqueeTextProps {
//   running?: boolean;
//   text?: string;
// }

// export function MarqueeText({
//   running = true,
//   text = "📦 ส่งของทุกวัน! สั่งก่อน 12.00 น. ได้ของไวชัวร์! ⏰🚚 ❤️ ขอบคุณลูกค้าทุกท่านที่ไว้ใจเรานะคะ 🙌 แล้วพบกันอีกน้าา~",
// }: MarqueeTextProps) {
//   return (
//     // overflow-hidden: ตัดส่วนเกินที่อยู่นอกจอทิ้ง
//     <div className="overflow-hidden flex-1 relative flex items-center h-full select-none pointer-events-none">
//       {/* No edge fades: keep overflow-hidden to clip text visually without gradients */}
//       <style>{`
//         @keyframes ticker-scroll {
//           0% { transform: translate3d(0, 0, 0); }
//           100% { transform: translate3d(-100%, 0, 0); }
//         }

//         .ticker-track {
//           /* ✅ หัวใจสำคัญ 1: ให้กว้างเท่าเนื้อหา (แก้ปัญหาข้อความขาด) */
//           width: max-content;
//           /* ✅ หัวใจสำคัญ 2: ใช้ padding ดันข้อความไปรอที่ขอบขวา */
//           /* 100% ตรงนี้คือ 100% ของกล่องพ่อ (หน้าจอ) ทำให้เริ่มที่ขอบขวาพอดีเป๊ะ */
//           padding-left: 100%;

//           /* Performance Tuning */
//           will-change: transform;
//           backface-visibility: hidden;
//           transform: translateZ(0);

//           /* Animation Setting */
//           /* 20s = ความเร็ว, infinite = วนลูป, linear = ความเร็วคงที่ */
//           animation: ticker-scroll 20s linear infinite;

//           /* ✅ หัวใจสำคัญ 3: สั่ง CSS ให้รอ 3 วินาที ก่อนเริ่มวิ่ง */
//           /* ไม่ต้องใช้ JS แม้แต่บรรทัดเดียว */
//           animation-delay: 3s;
//         }

//         .paused {
//           animation-play-state: paused !important;
//         }
//       `}</style>

//       <div
//         className={cn(
//           "ticker-track whitespace-nowrap text-sm font-semibold text-zinc-900 dark:text-zinc-100",
//           !running && "paused",
//         )}
//       >
//         {/* ข้อความจะถูก padding ดันไปรอขวาสุดเองอัตโนมัติ */}
//         {text}
//       </div>
//     </div>
//   );
// }

// export default memo(MarqueeText);

// "use client";

// import { memo, useEffect, useState } from "react";
// import { cn } from "@/lib/utils";

// interface MarqueeTextProps {
//   running?: boolean;
//   text?: string;
// }

// export function MarqueeText({
//   running = true,
//   text = "📦 ส่งของทุกวัน! สั่งก่อน 12.00 น. ได้ของไวชัวร์! ⏰🚚 ❤️ ขอบคุณลูกค้าทุกท่านที่ไว้ใจเรานะคะ 🙌 แล้วพบกันอีกน้าา~",
// }: MarqueeTextProps) {
//   // ✅ State นี้จะช่วยแก้ปัญหา "เมนูกระตุก" 100%
//   // เราจะยังไม่แสดง Animation จนกว่าเมนูจะเลื่อนเสร็จ (ประมาณ 500-600ms)
//   const [isReady, setIsReady] = useState(false);

//   useEffect(() => {
//     if (running) {
//       // รอ 600ms (ให้เมนูเลื่อนเปิดให้เสร็จก่อน) ค่อยเริ่มรันตัววิ่ง
//       const timer = setTimeout(() => {
//         setIsReady(true);
//       }, 600);
//       return () => clearTimeout(timer);
//     } else {
//       setIsReady(false);
//     }
//   }, [running]);

//   return (
//     <div className="relative flex h-full items-center overflow-hidden select-none pointer-events-none">
//       <style>{`
//         @keyframes ticker-scroll {
//           0% { transform: translate3d(100%, 0, 0); } /* เริ่มจากขวาสุด */
//           100% { transform: translate3d(-100%, 0, 0); } /* วิ่งไปซ้ายสุด */
//         }

//         .ticker-track {
//           /* ใช้ will-change เพื่อบอก GPU ให้เตรียมตัว */
//           will-change: transform;
//           /* ใช้ transform 3D เพื่อเปิด Hardware Acceleration */
//           transform: translateZ(0);
//           /* ห้ามขึ้นบรรทัดใหม่ */
//           white-space: nowrap;
//           /* กว้างเท่าเนื้อหา */
//           width: max-content;
//         }

//         .ticker-active {
//            /* เริ่มวิ่งก็ต่อเมื่อ isReady เป็น true แล้วเท่านั้น */
//            animation: ticker-scroll 20s linear infinite;
//         }
//       `}</style>

//       {/* ถ้ายังไม่ Ready (เมนูกำลังเลื่อน) -> เราจะแสดงแค่ Text นิ่งๆ หรือซ่อนไว้ก่อน
//          เพื่อไม่ให้ GPU ทำงานหนัก
//       */}
//       <div
//         className={cn(
//           "ticker-track text-sm font-semibold text-zinc-900 dark:text-zinc-100",
//           // ✅ ใส่ class animation ก็ต่อเมื่อเมนูเปิดเสร็จแล้วเท่านั้น
//           isReady ? "ticker-active" : "opacity-0 translate-x-full",
//         )}
//       >
//         {text}
//       </div>
//     </div>
//   );
// }

// export default memo(MarqueeText);

"use client";

import { memo, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MarqueeTextProps {
  running?: boolean;
  text?: string;
}

export function MarqueeText({
  running = true,
  text = "📦 ส่งของทุกวัน! สั่งก่อน 12.00 น. ได้ของไวชัวร์! ⏰🚚 ❤️ ขอบคุณลูกค้าทุกท่านที่ไว้ใจเรานะคะ 🙌 แล้วพบกันอีกน้าา~",
}: MarqueeTextProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (running) {
      // หน่วงเวลาให้เมนูเลื่อนเสร็จก่อน ค่อยแสดงตัววิ่ง (600ms)
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setIsReady(false);
    }
  }, [running]);

  return (
    <div
      className="relative flex w-full h-full items-center overflow-hidden select-none pointer-events-none"
      style={{ contain: "paint layout" }}
    >
      <style>{`
        /* ✅ คืนค่า Keyframes แบบดั้งเดิมของคุณ: เริ่มจากขวาสุด วิ่งไปซ้ายสุด */
        @keyframes ticker-scroll {
          0% { transform: translate3d(100vw, 0, 0); } /* ใช้ 100vw เพื่อให้โผล่มาจากขอบจอพอดี */
          100% { transform: translate3d(-100%, 0, 0); }
        }
      `}</style>

      <div
        className={cn(
          "flex w-max whitespace-nowrap text-sm font-semibold text-zinc-900 dark:text-zinc-100",
          // ✅ ถ้าเมนูยังเลื่อนไม่เสร็จ ให้ดันข้อความไปซ่อนไว้ทางขวาก่อน (แบบโค้ดดั้งเดิมของคุณ)
          !isReady && "translate-x-[100vw]",
        )}
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          // ✅ พอ isReady ปุ๊บ ก็สั่งให้มันเลื่อนโผล่ออกมาจากทางขวาทันที
          animation: isReady ? "ticker-scroll 20s linear infinite" : "none",
        }}
      >
        <span className="inline-block pr-8">{text}</span>
      </div>
    </div>
  );
}

export default memo(MarqueeText);
