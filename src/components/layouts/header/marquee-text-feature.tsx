// "use client"

// import { useMemo } from "react"

// interface MarqueeTextFeatureProps {
//   running?: boolean
//   text?: string
// }

// /**
//  * ✅ คอมโพเนนต์ข้อความเลื่อนเฉพาะหน้า FeatureProducts
//  * - ใช้ GPU translate3d
//  * - ความเร็วช้ากว่า Mobile version เพื่อความสบายตา
//  */
// export function MarqueeTextFeature({
//   running = true,
//   text = "🎉 พบกับสินค้าใหม่ๆ ทุกสัปดาห์ พร้อมโปรโมชั่นสุดพิเศษ! 🎉 พบกับสินค้าใหม่ๆ ทุกสัปดาห์ พร้อมโปรโมชั่นสุดพิเศษ! 🥦",
// }: MarqueeTextFeatureProps) {
//   // ✅ สร้าง span แยกตามตัวอักษร
//   const marqueeMessage = useMemo(
//     () =>
//       [...text].map((char, i) => (
//         <span
//           key={i}
//           className={`text-[hsl(${(i * 20) % 360},90%,55%)] transition-transform duration-300 hover:scale-110`}
//         >
//           {char}
//         </span>
//       )),
//     [text]
//   )

//   return (
//     <div className="feature-marquee-container overflow-hidden relative ">
//       <div
//         data-running={running}
//         className="feature-marquee-text inline-block whitespace-nowrap text-[13px] sm:text-xs md:text-sm font-medium"
//       >
//         {marqueeMessage}
//       </div>
//     </div>
//   )
// }

// "use client";

// import { motion } from "framer-motion";

// interface MarqueeTextFeatureProps {
//   running?: boolean;
//   text?: string;
// }

// export function MarqueeTextFeature({
//   running = true,
//   text = "🎉 พบกับสินค้าใหม่ๆ ทุกสัปดาห์ พร้อมโปรโมชั่นสุดพิเศษ! 🎉 พบกับสินค้าใหม่ๆ ทุกสัปดาห์ พร้อมโปรโมชั่นสุดพิเศษ! 🥦",
// }: MarqueeTextFeatureProps) {

//   return (
//     <div className="overflow-hidden w-full h-full flex items-center relative mask-linear-fade pr-4">
//       <motion.div
//         // ✅ 1. ใช้ Tailwind กำหนดสีรุ้ง (ไล่สีจากซ้ายไปขวา)
//         className="
//           whitespace-nowrap text-[13px] sm:text-xs md:text-sm font-bold
//           bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 via-blue-500 to-purple-500
//           bg-[length:200%_auto]
//           will-change-transform
//         "

//         // ✅ 2. บังคับใช้ Style นี้เพื่อให้สีรุ้งแสดงผลแน่นอน 100% (แก้ปัญหาสีขาว)
//         style={{
//           WebkitBackgroundClip: "text", // สำคัญมากสำหรับ Chrome/Safari
//           backgroundClip: "text",
//           color: "transparent",         // บังคับให้ตัวหนังสือใส เพื่อให้เห็นพื้นหลังสีรุ้ง
//           animationPlayState: running ? "running" : "paused"
//         }}

//         // 3. สั่งเลื่อนด้วย GPU (Framer Motion) - ลื่นแน่นอน
//         animate={{
//           x: ["0%", "-100%"], // เริ่มจาก 0 ไปซ้ายสุด
//           backgroundPosition: ["0% center", "200% center"] // ทำให้สีรุ้งไหลได้
//         }}

//         transition={{
//           x: {
//             repeat: Infinity,
//             ease: "linear",
//             duration: 30, // ความเร็วข้อความวิ่ง
//           },
//           backgroundPosition: {
//             repeat: Infinity,
//             ease: "linear",
//             duration: 3, // ความเร็วสีรุ้งไหล (ยิ่งน้อยยิ่งไหลเร็ว)
//           }
//         }}
//       >
//         {text}
//       </motion.div>
//     </div>
//   );
// }

// "use client";

// import { motion } from "framer-motion";

// interface MarqueeTextFeatureProps {
//   running?: boolean;
//   text?: string;
// }

// export function MarqueeTextFeature({
//   running = true,
//   // แนะนำ: ให้เว้นวรรคท้ายข้อความหน่อย หรือใส่ Emoji ปิดท้าย เพื่อให้รอยต่อสวยงาม
//   text = "🎉 พบกับสินค้าใหม่ๆ ทุกสัปดาห์ พร้อมโปรโมชั่นสุดพิเศษ! ✨ เติมความสุขให้เต็มปอด ด้วยของดีเกรดพรีเมียมที่เราคัดมาเพื่อคุณ! 💚",
// }: MarqueeTextFeatureProps) {
//   return (
//     <div className="overflow-hidden w-full h-full flex items-center relative mask-linear-fade pr-4">
//       <motion.div
//         // 1. เปลี่ยนสีเป็นสีขาว/เทา (text-gray-200) และจัด Flex เพื่อวางข้อความ 2 ชุดต่อกัน
//         className="flex whitespace-nowrap text-[13px] sm:text-xs md:text-sm font-bold text-gray-200 will-change-transform"
//         // 2. เทคนิคแก้เด้งกลับ: เลื่อนไปทางซ้ายแค่ "-50%" (ความยาวของข้อความ 1 ชุด)
//         // พอมันเลื่อนไปถึงครึ่งทาง มันจะดีดกลับมาที่ 0 ซึ่งหน้าตามันเหมือนกันเป๊ะ คนดูเลยไม่รู้ว่าดีดกลับ
//         animate={{
//           x: running ? "-50%" : "0%",
//         }}
//         transition={{
//           repeat: Infinity,
//           ease: "linear",
//           duration: 8, // ปรับความเร็วตรงนี้ (เลขยิ่งน้อย ยิ่งเร็ว)
//         }}
//       >
//         {/* --- ชุดที่ 1 --- */}
//         {/* ใส่ padding-right (pr-8) เพื่อเว้นระยะห่างระหว่างชุด */}
//         <span className="pr-8">{text}</span>

//         {/* --- ชุดที่ 2 (ตัวเงา) --- */}
//         {/* ก๊อปปี้มาวางต่อท้าย เพื่อให้เวลาเลื่อนสุดแล้วมีข้อความมารับช่วงต่อทันที */}
//         <span className="pr-8">{text}</span>
//       </motion.div>
//     </div>
//   );
// }

// "use client";

// import { memo } from "react";

// interface MarqueeTextFeatureProps {
//   running?: boolean;
//   text?: string;
// }

// const MarqueeTextFeature = ({
//   running = true,
//   text = "🎉 พบกับสินค้าใหม่ๆ ทุกสัปดาห์ พร้อมโปรโมชั่นสุดพิเศษ! ✨ เติมความสุขให้เต็มปอด ด้วยของดีเกรดพรีเมียมที่เราคัดมาเพื่อคุณ! 💚",
// }: MarqueeTextFeatureProps) => {

//   return (
//     <div className="overflow-hidden w-full h-full flex items-center relative mask-linear-fade pr-4 select-none pointer-events-none">

//       {/* ✅ วิธีแก้ไม้ตาย: ฝัง Style Tag แบบธรรมดา (ไม่ใช่ JSX) รับรอง Browser อ่านออกแน่นอน */}
//       <style>{`
//         @keyframes marquee-force-slide {
//           0% { transform: translateX(0%); }
//           100% { transform: translateX(-50%); }
//         }
//       `}</style>

//       {/* ✅ ตัวรางเลื่อน: ใช้ inline style บังคับ animation โดยตรง */}
//       <div
//         style={{
//           display: "flex",
//           whiteSpace: "nowrap",
//           width: "max-content", /* ✅ สำคัญ: บังคับให้กว้างเท่าข้อความ (ไม่โดนบีบ) */
//           willChange: "transform",
//           animation: running ? "marquee-force-slide 20s linear infinite" : "none",
//         }}
//         className="text-[13px] sm:text-xs md:text-sm font-bold text-gray-200"
//       >
//         {/* ชุดที่ 1 */}
//         <span className="pr-8 inline-block">
//           {text}
//         </span>

//         {/* ชุดที่ 2 */}
//         <span className="pr-8 inline-block">
//           {text}
//         </span>
//       </div>
//     </div>
//   );
// };

// export default memo(MarqueeTextFeature);

// "use client";

// import { memo } from "react";

// interface MarqueeTextFeatureProps {
//   running?: boolean;
//   text?: string;
// }

// const MarqueeTextFeature = ({
//   running = true,
//   text = "🎉 พบกับสินค้าใหม่ๆ ทุกสัปดาห์ พร้อมโปรโมชั่นสุดพิเศษ! ✨ เติมความสุขให้เต็มปอด ด้วยของดีเกรดพรีเมียมที่เราคัดมาเพื่อคุณ! 💚",
// }: MarqueeTextFeatureProps) => {
//   return (
//     <div className="overflow-hidden w-full h-full flex items-center relative mask-linear-fade pr-4 select-none pointer-events-none">
//       <style>{`
//         @keyframes marquee-force-slide {
//           0% { transform: translate3d(0, 0, 0); }
//           100% { transform: translate3d(-50%, 0, 0); }
//         }
//       `}</style>

//       {/* ✅ ตัวรางเลื่อน: เพิ่ม css property ชุดนี้เข้าไปครับ */}
//       <div
//         style={{
//           display: "flex",
//           whiteSpace: "nowrap",
//           width: "max-content",

//           /* --- 🛡️ โซนป้องกันการกระตุก (Layer Isolation) --- */
//           /* 1. บังคับแยก Layer ขั้นเด็ดขาด */
//           transform: "translate3d(0, 0, 0)",
//           /* 2. ซ่อนด้านหลัง (ช่วยลดการคำนวณตอนมีอะไรมาทับ) */
//           backfaceVisibility: "hidden",
//           /* 3. เปิด GPU Acceleration */
//           perspective: "1000px",
//           /* 4. บอก Browser ว่าอย่ามายุ่งกับ Layer นี้ */
//           contain: "paint layout",
//           /* ----------------------------------------------- */

//           willChange: "transform",
//           animation: running
//             ? "marquee-force-slide 20s linear infinite"
//             : "none",
//         }}
//         className="text-[13px] sm:text-xs md:text-sm font-bold text-gray-200"
//       >
//         <span className="pr-8 inline-block">{text}</span>
//         <span className="pr-8 inline-block">{text}</span>
//       </div>
//     </div>
//   );
// };

// export default memo(MarqueeTextFeature);

"use client";

import { memo, useMemo, useState, useEffect } from "react";

interface MarqueeTextFeatureProps {
  running?: boolean;
  text?: string;
  speedFactor?: number; // ตัวคูณความเร็ว (แนะนำ 0.15 - 0.2)
}

const MarqueeTextFeature = ({
  running = true,
  text = "🎉 พบกับสินค้าใหม่ๆ ทุกสัปดาห์ พร้อมโปรโมชั่นสุดพิเศษ! ✨ เติมความสุขให้เต็มปอด ด้วยของดีเกรดพรีเมียมที่เราคัดมาเพื่อคุณ! 💚",
  speedFactor = 0.18,
}: MarqueeTextFeatureProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleMenuToggle = (event: Event) => {
      // แปลงเป็น CustomEvent เพื่อดึงค่า detail
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        setIsMenuOpen(customEvent.detail.isOpen);
      }
    };

    window.addEventListener("mobileMenuToggle", handleMenuToggle);

    // คืนค่าเมื่อ Component ถูกทำลาย (Cleanup)
    return () => {
      window.removeEventListener("mobileMenuToggle", handleMenuToggle);
    };
  }, []);

  // ✅ 1. Dynamic Speed: คำนวณความเร็วตามความยาวตัวอักษร
  // เพื่อให้ข้อความสั้นหรือยาว "วิ่งด้วยความเร็วที่สม่ำเสมอ" ไม่วิ่งเร็วปรี๊ดตอนข้อความยาว
  const duration = useMemo(() => {
    const textLength = text.length;
    return `${Math.max(10, textLength * speedFactor)}s`;
  }, [text, speedFactor]);

  const shouldRun = running && !isMenuOpen;

  return (
    <div className="relative flex h-full w-full items-center overflow-hidden select-none pointer-events-none">
      {/* ✅ 2. Edge fade overlays: แทน mask-image ที่ทำ repaint มากด้วย GPU-friendly gradients */}
      {/* ✅ 2. Edge fade overlays: แทน mask-image ที่ทำ repaint มากด้วย GPU-friendly gradients */}
      {/* Left fade */}
      <div
        aria-hidden
        className="absolute left-0 top-0 h-full w-16 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to right, #111827, rgba(17,24,39,0))",
        }}
      />

      {/* Right fade */}
      <div
        aria-hidden
        className="absolute right-0 top-0 h-full w-16 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to left, #111827, rgba(17,24,39,0))",
        }}
      />

      <style>{`
        @keyframes marquee-feature-optimized {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>

      <div
        className="flex w-max whitespace-nowrap text-[13px] font-bold text-gray-200 sm:text-xs md:text-sm"
        style={{
          /* --- 🛡️ ของสำคัญที่พี่สั่งไว้ (GPU Isolation) ห้ามลบ! --- */
          transform: "translate3d(0, 0, 0)",
          backfaceVisibility: "hidden",
          perspective: "1000px",
          contain: "paint layout",
          willChange: "transform",
          /* ----------------------------------------------- */

          display: "flex",
          animation: running
            ? `marquee-feature-optimized ${duration} linear infinite`
            : "none",

          /* ✅ ลดงาน CPU: เมื่อไม่วิ่ง (running=false) ให้หยุดคำนวณทันที */
          animationPlayState: shouldRun ? "running" : "paused",
        }}
      >
        {/* Render 2 ชุดเพื่อ Seamless Loop */}
        <span className="inline-block pr-12">{text}</span>
        <span className="inline-block pr-12">{text}</span>
      </div>
    </div>
  );
};

export default memo(MarqueeTextFeature);
