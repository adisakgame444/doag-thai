// "use client";
// import Image from "next/image";
// import { useEffect, useState } from "react";

// const SLIDES = [
//   { src: "/images/game-image1.webp" },
//   { src: "/images/game-image2.webp" },
// ];

// export const HeroBackground = ({ onReady }: { onReady: () => void }) => {
//   const [index, setIndex] = useState(0);
//   const [paused, setPaused] = useState(false);

//   // ✅ ฟัง event จาก MobileMenu เพื่อหยุด/เล่น autoplay
//   useEffect(() => {
//     const handleMenuToggle = (e: CustomEvent<{ isOpen: boolean }>) => {
//       setPaused(e.detail.isOpen);
//     };

//     window.addEventListener(
//       "mobileMenuToggle",
//       handleMenuToggle as EventListener
//     );
//     return () => {
//       window.removeEventListener(
//         "mobileMenuToggle",
//         handleMenuToggle as EventListener
//       );
//     };
//   }, []);

//   // ✅ สลับภาพเฉพาะตอนเมนูปิด (paused = false)
//   useEffect(() => {
//     const timer = setInterval(() => {
//       if (!paused) setIndex((i) => (i + 1) % SLIDES.length);
//     }, 15000);
//     return () => clearInterval(timer);
//   }, [paused]);

//   return (
//     <div className="absolute inset-0 -z-10">
//       {SLIDES.map((slide, i) => (
//         <Image
//           key={slide.src}
//           src={slide.src}
//           alt=""
//           fill
//           onLoad={() => i === 0 && onReady()}
//           className={`object-cover absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
//             i === index ? "opacity-100" : "opacity-0"
//           } ${paused ? "brightness-75" : ""}`} // 🌙 จางลงเล็กน้อยเมื่อหยุด
//           // className={`hidden`} // 👈 ปิดภาพทั้งหมด
//         />
//       ))}
//       <div className="absolute inset-0 bg-black/35 pointer-events-none" />
//     </div>
//   );
// };

// "use client";
// import Image from "next/image";
// import { useEffect, useState } from "react";

// const SLIDES = [
//   { src: "/images/moty3.webp" },
//   { src: "/images/moty1.webp" },
//   { src: "/images/moty2.webp" },
// ];

// export const HeroBackground = ({ onReady }: { onReady?: () => void }) => {
//   const [index, setIndex] = useState(0);
//   const [paused, setPaused] = useState(false);

//   useEffect(() => {
//     const handleMenuToggle = (e: CustomEvent<{ isOpen: boolean }>) => {
//       setPaused(e.detail.isOpen);
//     };

//     window.addEventListener(
//       "mobileMenuToggle",
//       handleMenuToggle as EventListener
//     );

//     return () => {
//       window.removeEventListener(
//         "mobileMenuToggle",
//         handleMenuToggle as EventListener
//       );
//     };
//   }, []);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       if (!paused) {
//         setIndex((i) => (i + 1) % SLIDES.length);
//       }
//     }, 15000);

//     return () => clearInterval(timer);
//   }, [paused]);

//   return (
//     <div className="fixed inset-0 -z-50">
//       {SLIDES.map((slide, i) => (
//         <Image
//           key={slide.src}
//           src={slide.src}
//           alt=""
//           fill
//           priority={i === 0}
//           onLoad={() => i === 0 && onReady?.()}
//           className={`object-cover absolute inset-0 transition-opacity duration-[1500ms]
//             ${i === index ? "opacity-100" : "opacity-0"}
//             ${paused ? "brightness-75" : ""}`}
//         />
//       ))}

//       <div className="absolute inset-0 bg-black/35 pointer-events-none" />
//     </div>
//   );
// };

// "use client";
// import Image from "next/image";
// import { useEffect, useState } from "react";

// const SLIDES = [
//   { src: "/images/moty3.webp" },
//   { src: "/images/moty1.webp" },
//   { src: "/images/moty2.webp" },
// ];

// export const HeroBackground = ({ onReady }: { onReady?: () => void }) => {
//   const [index, setIndex] = useState(0);
//   const [paused, setPaused] = useState(false);

//   useEffect(() => {
//     const handleMenuToggle = (e: CustomEvent<{ isOpen: boolean }>) => {
//       setPaused(e.detail.isOpen);
//     };

//     window.addEventListener(
//       "mobileMenuToggle",
//       handleMenuToggle as EventListener
//     );

//     return () => {
//       window.removeEventListener(
//         "mobileMenuToggle",
//         handleMenuToggle as EventListener
//       );
//     };
//   }, []);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       if (!paused) {
//         setIndex((i) => (i + 1) % SLIDES.length);
//       }
//     }, 15000);

//     return () => clearInterval(timer);
//   }, [paused]);

//   return (
//     <>
//       {/* ✅ Mobile: white background */}
//       {/* <div className="fixed inset-0 -z-50 bg-white md:hidden" /> */}
//       <div className="fixed inset-0 -z-50 bg-white md:hidden" />

//       {/* ✅ Desktop: slideshow */}
//       <div className="fixed inset-0 -z-50 hidden md:block">
//       {/* <div className="fixed inset-0 -z-50 bg-white dark:bg-neutral-950 transition-colors duration-300 md:hidden" /> */}
//         {SLIDES.map((slide, i) => (
//           <Image
//             key={slide.src}
//             src={slide.src}
//             alt=""
//             fill
//             priority={i === 0}
//             onLoad={() => i === 0 && onReady?.()}
//             className={`object-cover absolute inset-0 transition-opacity duration-[1500ms]
//               ${i === index ? "opacity-100" : "opacity-0"}
//               ${paused ? "brightness-75" : ""}`}
//           />
//         ))}

//         <div className="absolute inset-0 bg-black/35 pointer-events-none" />
//       </div>
//     </>
//   );
// };

// "use client";

// import Image from "next/image";
// import { useEffect, useState } from "react";

// const SLIDES = [
//   { src: "/images/moty3.webp" },
//   { src: "/images/moty1.webp" },
//   { src: "/images/moty2.webp" },
// ];

// export const HeroBackground = ({ onReady }: { onReady?: () => void }) => {
//   const [index, setIndex] = useState(0);
//   const [paused, setPaused] = useState(false);

//   useEffect(() => {
//     const handleMenuToggle = (e: CustomEvent<{ isOpen: boolean }>) => {
//       setPaused(e.detail.isOpen);
//     };

//     // ตรวจสอบว่ามี window ก่อน addEventListener (กัน Error ฝั่ง Server)
//     if (typeof window !== "undefined") {
//       window.addEventListener(
//         "mobileMenuToggle",
//         handleMenuToggle as EventListener
//       );
//     }

//     return () => {
//       if (typeof window !== "undefined") {
//         window.removeEventListener(
//           "mobileMenuToggle",
//           handleMenuToggle as EventListener
//         );
//       }
//     };
//   }, []);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       if (!paused) {
//         setIndex((i) => (i + 1) % SLIDES.length);
//       }
//     }, 15000);

//     return () => clearInterval(timer);
//   }, [paused]);

//   return (
//     <>
//       {/* ✅ Mobile: พื้นหลังสีขาวใน Light Mode และเปลี่ยนเป็นสีดำใน Dark Mode */}
//       {/* <div className="fixed inset-0 -z-50 bg-white dark:bg-neutral-950 transition-colors duration-300 md:hidden" /> */}
//       <div className="fixed inset-0 -z-50 bg-background transition-colors duration-300 md:hidden" />
//       {/* ✅ Desktop: Slideshow แสดงเฉพาะจอใหญ่ */}
//       <div className="fixed inset-0 -z-50 hidden md:block">
//         {SLIDES.map((slide, i) => (
//           <Image
//             key={slide.src}
//             src={slide.src}
//             alt=""
//             fill
//             priority={i === 0}
//             onLoad={() => i === 0 && onReady?.()}
//             className={`object-cover absolute inset-0 transition-opacity duration-[1500ms]
//               ${i === index ? "opacity-100" : "opacity-0"}
//               ${paused ? "brightness-75" : ""}`}
//           />
//         ))}

//         {/* Overlay สีดำจางๆ เพื่อให้อ่านตัวหนังสือได้ง่ายขึ้น */}
//         <div className="absolute inset-0 bg-black/35 pointer-events-none" />
//       </div>
//     </>
//   );
// };

// "use client";

// // ✅ เหลือแค่นี้ครับ สั้นและเบามาก
// export const HeroBackground = () => {
//   return (
//     <div className="fixed inset-0 -z-50 bg-background transition-colors duration-300" />
//   );
// };

"use client";

import Image from "next/image";

export const HeroBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 hidden md:block h-full w-full overflow-hidden">
      <Image
        src="/images/moty3.webp"
        alt="Hero Background"
        fill
        priority
        unoptimized={true}
        // ✅ 1. ลด Quality เหลือ 75 (ชัดพอแล้ว แต่ไฟล์เบาลงเยอะ)
        // quality={75}
        // ✅ 2. ทีเด็ดแก้เว็บอืดบนมือถือ!
        // ความหมาย: "ถ้าเป็นมือถือ (จอเล็กกว่า 768px) ให้โหลดรูปขนาด 1px พอ" (เพราะเราซ่อนมันอยู่แล้ว)
        // "แต่ถ้าเป็น Desktop ให้โหลดเต็มจอ 100vw"
        // sizes="(max-width: 768px) 1px, 100vw"
        // ✅ 3. ClassName แบบคลีนๆ (ลบ Comment ใน string ออกเพื่อกัน Error)
        className="object-cover scale-[1.00] translate-y-[0%] object-[50%_10%]"
      />

      {/* Gradient Layers (เหมือนเดิม) */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
    </div>
  );
};
