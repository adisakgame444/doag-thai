// "use client";

// import Image from "next/image";
// import { useEffect, useState } from "react";

// /**
//  * ✅ BannerSectionHeader (เวอร์ชันไม่เด้ง)
//  * - ข้อความเปลี่ยนทุก 2.5 วิ (แบบ fade)
//  * - หยุดเมื่อเมนูมือถือเปิด
//  */
// export function BannerSectionHeader() {
//   const messages = [
//     "🌿 สินค้ากัญชาแนะนำสำหรับคุณ 🌿",
//     "🔥 สินค้ากัญชายอดนิยม ขายดีอันดับต้น ๆ 🔥",
//     "🆕 ผลิตภัณฑ์กัญชาใหม่ล่าสุด พร้อมให้เลือกช้อป 🆕",
//     "🛍️ เลือกช้อปสินค้ากัญชาได้ตามใจคุณ 🛍️",
//   ];

//   const [index, setIndex] = useState(0);
//   const [fade, setFade] = useState(true);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   // ✅ ฟัง event จาก MobileMenu
//   useEffect(() => {
//     const handleMenuToggle = (event: Event) => {
//       const customEvent = event as CustomEvent<{ isOpen: boolean }>;
//       setIsMenuOpen(customEvent.detail.isOpen);
//     };

//     window.addEventListener("mobileMenuToggle", handleMenuToggle);
//     return () =>
//       window.removeEventListener("mobileMenuToggle", handleMenuToggle);
//   }, []);

//   // ✅ เปลี่ยนข้อความอัตโนมัติ (เฉพาะตอนเมนูปิด)
//   useEffect(() => {
//     if (isMenuOpen) return;

//     const interval = setInterval(() => {
//       // fade-out ก่อน
//       setFade(false);

//       setTimeout(() => {
//         // เปลี่ยนข้อความหลัง fade-out เสร็จ
//         setIndex((prev) => (prev + 1) % messages.length);
//         setFade(true); // fade-in กลับ
//       }, 300);
//     }, 2500);

//     return () => clearInterval(interval);
//   }, [isMenuOpen]);

//   return (
//     <header
//       className="relative flex items-center justify-center border-2 border-white/60 rounded-lg overflow-hidden
//       h-10 md:h-16 px-3 md:px-6 py-1 md:py-2 mt-8 md:mt-12 mb-4 md:mb-6 shadow-md"
//     >
//       {/* ✅ ภาพพื้นหลัง */}
//       <Image
//         src="/images/game-image4.jpg"
//         alt="background"
//         fill
//         className="object-cover brightness-90"
//         priority
//       />

//       {/* ✅ ชั้นกรองดำบาง ๆ */}
//       <div className="absolute inset-0 bg-black/30 z-[1]" />

//       {/* ✅ ข้อความแบบไม่เด้ง */}
//       <div className="relative z-10 text-white h-full flex items-center justify-center overflow-hidden">
//         <span
//           key={index}
//           data-paused={isMenuOpen}
//           className="text-xs md:text-lg font-semibold tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] animate-slide-fade-down"
//         >
//           {messages[index]}
//         </span>
//       </div>
//     </header>
//   );
// }
