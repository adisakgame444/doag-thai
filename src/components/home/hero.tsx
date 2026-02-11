// "use client";

// import { motion } from "framer-motion";
// import { useEffect, useRef, useState, useMemo } from "react";
// import dynamic from "next/dynamic";
// import { Cannabis, Gift, ShieldCheck, Store, Zap } from "lucide-react";
// import { HeroBackground } from "./HeroBackground";
// import { HeroRotatingText } from "./HeroRotatingText";
// import { HeroFeatureCard } from "./HeroFeatureCard";

// // 🎯 โหลด Swiper ตอน idle time เท่านั้น (ลด JS blocking)
// const HeroProductSlider = dynamic(() => import("./HeroProductSlider"), {
//   ssr: false,
//   loading: () => (
//     <div className="relative h-[260px] w-full overflow-hidden rounded-xl bg-white/5 shadow-xl ring-1 ring-white/10 sm:h-[320px] md:h-[400px] lg:h-[520px] animate-pulse" />
//   ),
// });

// const HERO_FEATURES = [
//   {
//     icon: ShieldCheck,
//     title: "ปลอดภัยหายห่วง",
//     description: "ไว้วางใจกว่า 7 ปี",
//     iconClassName: "text-green-500",
//   },
//   {
//     icon: Zap,
//     title: "รวดเร็วไม่กี่คลิก",
//     description: "ได้รับสินค้าทันที",
//     iconClassName: "text-yellow-500",
//   },
//   {
//     icon: Gift,
//     title: "ประหยัดคุ้มค่า",
//     description: "ส่วนลดพิเศษเพื่อคุณ",
//     iconClassName: "text-pink-500",
//   },
//   {
//     icon: Store,
//     title: "สะดวกสบาย",
//     description: "ไม่ต้องเดินทาง",
//     iconClassName: "text-orange-500",
//   },
// ] as const;

// export default function Hero() {
//   const [bgLoaded, setBgLoaded] = useState(false);
//   const [heroAnimReady, setHeroAnimReady] = useState(false);
//   const [showSlider, setShowSlider] = useState(false);
//   const heroRef = useRef<HTMLDivElement | null>(null);

//   // 🧠 Observe only when user scrolls into view
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setHeroAnimReady(true);
//           observer.disconnect();
//         }
//       },
//       { rootMargin: "200px" }
//     );
//     if (heroRef.current) observer.observe(heroRef.current);
//     return () => observer.disconnect();
//   }, []);

//   // 🪄 Load slider only when animation done & user idle
//   useEffect(() => {
//     if (bgLoaded && heroAnimReady && !showSlider) {
//       const idleLoad = () => setShowSlider(true);
//       if ("requestIdleCallback" in window) {
//         const id = (window as any).requestIdleCallback(idleLoad, {
//           timeout: 600,
//         });
//         return () => (window as any).cancelIdleCallback?.(id);
//       } else {
//         const t = setTimeout(idleLoad, 400);
//         return () => clearTimeout(t);
//       }
//     }
//   }, [bgLoaded, heroAnimReady, showSlider]);

//   const features = useMemo(() => HERO_FEATURES, []);

//   return (
//     <section
//       ref={heroRef}
//       className="relative w-full overflow-hidden min-h-[520px] transform-gpu"
//       style={{ backfaceVisibility: "hidden" }}
//     >
//       {/* ✅ Background loads first */}
//       <HeroBackground onReady={() => setBgLoaded(true)} />

//       {/* Animate hero only after bg is loaded */}
//       {bgLoaded && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
//           className="container relative mx-auto px-4 pt-8 pb-12 md:pt-12 md:pb-16 lg:pt-20 lg:pb-24"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
//             {/* LEFT */}
//             <motion.div
//               initial={{ opacity: 0, y: 16 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{
//                 duration: 0.6,
//                 delay: 0.2,
//                 ease: [0.22, 1, 0.36, 1],
//               }}
//               className="max-w-xl space-y-6 text-center md:space-y-8 will-change-transform"
//             >
//               {/* Badge */}
//               <div className="inline-flex items-center gap-2.5 md:gap-3 rounded-full bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100 px-4 py-1.5 md:px-6 md:py-2.5 shadow-sm ring-1 ring-emerald-200/60">
//                 <div className="flex h-5 w-5 md:h-7 md:w-7 items-center justify-center rounded-full bg-gradient-to-r from-emerald-200 to-emerald-400 shadow-inner">
//                   <Cannabis className="h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-700" />
//                 </div>
//                 <span className="text-xs md:text-sm font-semibold text-emerald-900 tracking-wide">
//                   ยินดีต้อนรับสู่{" "}
//                   <span className="font-bold text-emerald-700">DOAG THAI</span>
//                 </span>
//               </div>

//               {/* Heading */}
//               <h1 className="text-4xl font-extrabold md:text-5xl text-white leading-tight">
//                 ช็อปสินค้าสายเขียว <br />
//                 <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500 bg-clip-text text-transparent">
//                   ราคาคุ้มค่า
//                 </span>
//               </h1>

//               {/* Rotating Text */}
//               <p className="relative flex items-center justify-center text-sm font-medium text-white md:text-base h-6 overflow-hidden min-w-[260px]">
//                 <HeroRotatingText />
//               </p>

//               {/* Feature cards */}
//               <motion.div
//                 variants={{
//                   hidden: {},
//                   show: {
//                     transition: { staggerChildren: 0.08, delayChildren: 0.2 },
//                   },
//                 }}
//                 initial="hidden"
//                 animate="show"
//                 className="mt-8 flex flex-wrap items-center justify-center gap-3-custom text-center md:gap-6"
//               >
//                 {features.map((f) => (
//                   <HeroFeatureCard key={f.title} {...f} />
//                 ))}
//               </motion.div>
//             </motion.div>

//             {/* RIGHT — Slider */}
//             <div className="will-change-transform">
//               {showSlider ? (
//                 <HeroProductSlider autoplayStart={bgLoaded && heroAnimReady} />
//               ) : (
//                 <div className="relative h-[260px] w-full overflow-hidden rounded-xl bg-white/5 shadow-xl ring-1 ring-white/10 sm:h-[320px] md:h-[400px] lg:h-[520px] animate-pulse" />
//               )}
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </section>
//   );
// }

// "use client";

// import { motion } from "framer-motion";
// import { useEffect, useRef, useState, useMemo } from "react";
// import dynamic from "next/dynamic";
// import { useRouter } from "next/navigation"; // ✅ เพิ่ม
// import { Cannabis, Gift, ShieldCheck, Store, Zap } from "lucide-react";
// import { HeroBackground } from "./HeroBackground";
// import { HeroRotatingText } from "./HeroRotatingText";
// import { HeroFeatureCard } from "./HeroFeatureCard";

// // 🎯 โหลด Swiper ตอน idle time เท่านั้น (ลด JS blocking)
// const HeroProductSlider = dynamic(() => import("./HeroProductSlider"), {
//   ssr: false,
//   loading: () => (
//     <div className="relative h-[260px] w-full overflow-hidden rounded-xl bg-white/5 shadow-xl ring-1 ring-white/10 sm:h-[320px] md:h-[400px] lg:h-[520px] animate-pulse" />
//   ),
// });

// const HERO_FEATURES = [
//   {
//     icon: ShieldCheck,
//     title: "ปลอดภัยหายห่วง",
//     description: "ไว้วางใจกว่า 7 ปี",
//     iconClassName: "text-green-500",
//   },
//   {
//     icon: Zap,
//     title: "รวดเร็วไม่กี่คลิก",
//     description: "ได้รับสินค้าทันที",
//     iconClassName: "text-yellow-500",
//   },
//   {
//     icon: Gift,
//     title: "ประหยัดคุ้มค่า",
//     description: "ส่วนลดพิเศษเพื่อคุณ",
//     iconClassName: "text-pink-500",
//   },
//   {
//     icon: Store,
//     title: "สะดวกสบาย",
//     description: "ไม่ต้องเดินทาง",
//     iconClassName: "text-orange-500",
//   },
// ] as const;

// export default function Hero() {
//   const [bgLoaded, setBgLoaded] = useState(false);
//   const [heroAnimReady, setHeroAnimReady] = useState(false);
//   const [showSlider, setShowSlider] = useState(false);
//   const heroRef = useRef<HTMLDivElement | null>(null);

//   // 🔍 state ช่องค้นหา + router
//   const [search, setSearch] = useState("");
//   const router = useRouter();

//   const handleSearch = () => {
//     const q = search.trim();
//     if (!q) return;

//     // เปลี่ยนหน้าไป /products พร้อม query search
//     router.push(`/products?search=${encodeURIComponent(q)}`);
//   };

//   // 🧠 Observe only when user scrolls into view
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setHeroAnimReady(true);
//           observer.disconnect();
//         }
//       },
//       { rootMargin: "200px" }
//     );
//     if (heroRef.current) observer.observe(heroRef.current);
//     return () => observer.disconnect();
//   }, []);

//   // 🪄 Load slider only when animation done & user idle
//   useEffect(() => {
//     if (bgLoaded && heroAnimReady && !showSlider) {
//       const idleLoad = () => setShowSlider(true);
//       if ("requestIdleCallback" in window) {
//         const id = (window as any).requestIdleCallback(idleLoad, {
//           timeout: 600,
//         });
//         return () => (window as any).cancelIdleCallback?.(id);
//       } else {
//         const t = setTimeout(idleLoad, 400);
//         return () => clearTimeout(t);
//       }
//     }
//   }, [bgLoaded, heroAnimReady, showSlider]);

//   const features = useMemo(() => HERO_FEATURES, []);

//   return (
//     <section
//       ref={heroRef}
//       className="relative w-full overflow-hidden min-h-[520px] transform-gpu"
//       style={{ backfaceVisibility: "hidden" }}
//     >
//       {/* ✅ Background loads first */}
//       <HeroBackground onReady={() => setBgLoaded(true)} />

//       {/* Animate hero only after bg is loaded */}
//       {bgLoaded && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
//           className="container relative mx-auto px-4 pt-8 pb-12 md:pt-12 md:pb-16 lg:pt-20 lg:pb-24"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
//             {/* LEFT */}
//             <motion.div
//               initial={{ opacity: 0, y: 16 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{
//                 duration: 0.6,
//                 delay: 0.2,
//                 ease: [0.22, 1, 0.36, 1],
//               }}
//               className="max-w-xl space-y-6 text-center md:space-y-8 will-change-transform"
//             >
//               {/* 🔍 Search Bar – วางไว้เหนือ Badge */}
//               {/* <div className="w-full max-w-md mx-auto mb-4"> */}
//               <div className="w-full max-w-md mx-auto mb-4 block md:hidden">
//                 <div className="relative">
//                   <input
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//                     placeholder="ค้นหาสินค้า เช่น อินดอร์, เอาท์ดอร์, อุปกรณ์..."
//                     className="w-full rounded-full bg-white/10 px-4 py-2.5 text-sm md:text-base text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-400/70 transition"
//                   />
//                   <button
//                     onClick={handleSearch}
//                     className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full px-3 md:px-4 py-1 text-xs md:text-sm bg-emerald-500 hover:bg-emerald-400 text-white font-semibold shadow-md"
//                   >
//                     ค้นหา
//                   </button>
//                 </div>
//               </div>

//               {/* Badge */}
//               {/* <div className="inline-flex items-center gap-2.5 md:gap-3 rounded-full bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100 px-4 py-1.5 md:px-6 md:py-2.5 shadow-sm ring-1 ring-emerald-200/60"> */}
//               <div className="hidden md:inline-flex items-center gap-2.5 md:gap-3 rounded-full bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100 px-4 py-1.5 md:px-6 md:py-2.5 shadow-sm ring-1 ring-emerald-200/60">
//                 <div className="flex h-5 w-5 md:h-7 md:w-7 items-center justify-center rounded-full bg-gradient-to-r from-emerald-200 to-emerald-400 shadow-inner">
//                   <Cannabis className="h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-700" />
//                 </div>
//                 <span className="text-xs md:text-sm font-semibold text-emerald-900 tracking-wide">
//                   ยินดีต้อนรับสู่{" "}
//                   <span className="font-bold text-emerald-700">DOAG THAI</span>
//                 </span>
//               </div>

//               {/* Heading */}
//               <h1 className="hidden md:block text-4xl font-extrabold md:text-5xl text-white leading-tight">
//                 ช็อปสินค้าสายเขียว <br />
//                 <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500 bg-clip-text text-transparent">
//                   ราคาคุ้มค่า
//                 </span>
//               </h1>

//               {/* Rotating Text */}
//               <p className="relative flex items-center justify-center text-sm font-medium text-white md:text-base h-6 overflow-hidden min-w-[260px]">
//                 <HeroRotatingText />
//               </p>

//               {/* Feature cards */}
//               <motion.div
//                 variants={{
//                   hidden: {},
//                   show: {
//                     transition: { staggerChildren: 0.08, delayChildren: 0.2 },
//                   },
//                 }}
//                 initial="hidden"
//                 animate="show"
//                 className="mt-8 flex flex-wrap items-center justify-center gap-3-custom text-center md:gap-6"
//               >
//                 {features.map((f) => (
//                   <HeroFeatureCard key={f.title} {...f} />
//                 ))}
//               </motion.div>
//             </motion.div>

//             {/* RIGHT — Slider */}
//             <div className="will-change-transform">
//               {showSlider ? (
//                 <HeroProductSlider autoplayStart={bgLoaded && heroAnimReady} />
//               ) : (
//                 <div className="relative h-[260px] w-full overflow-hidden rounded-xl bg-white/5 shadow-xl ring-1 ring-white/10 sm:h-[320px] md:h-[400px] lg:h-[520px] animate-pulse" />
//               )}
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </section>
//   );
// }

"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation"; // ✅ เพิ่ม
import { Cannabis, Gift, ShieldCheck, Store, Zap } from "lucide-react";
import { HeroBackground } from "./HeroBackground";
import { HeroRotatingText } from "./HeroRotatingText";
import { HeroFeatureCard } from "./HeroFeatureCard";
import FeatureBadges from "./FeatureBadges";

// 🎯 โหลด Swiper ตอน idle time เท่านั้น (ลด JS blocking)
const HeroProductSlider = dynamic(() => import("./HeroProductSlider"), {
  ssr: false,
  loading: () => (
    <div className="relative h-[260px] w-full overflow-hidden rounded-xl bg-white/5 shadow-xl ring-1 ring-white/10 sm:h-[320px] md:h-[400px] lg:h-[520px] animate-pulse" />
  ),
});

const HERO_FEATURES = [
  {
    icon: ShieldCheck,
    title: "ปลอดภัยหายห่วง",
    description: "ไว้วางใจกว่า 7 ปี",
    iconClassName: "text-green-500",
  },
  {
    icon: Zap,
    title: "รวดเร็วไม่กี่คลิก",
    description: "ได้รับสินค้าทันที",
    iconClassName: "text-yellow-500",
  },
  {
    icon: Gift,
    title: "ประหยัดคุ้มค่า",
    description: "ส่วนลดพิเศษเพื่อคุณ",
    iconClassName: "text-pink-500",
  },
  {
    icon: Store,
    title: "สะดวกสบาย",
    description: "ไม่ต้องเดินทาง",
    iconClassName: "text-orange-500",
  },
] as const;

export default function Hero() {
  const [bgLoaded, setBgLoaded] = useState(true);
  const [heroAnimReady, setHeroAnimReady] = useState(false);
  const [showSlider, setShowSlider] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);

  // 🔍 state ช่องค้นหา + router
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const q = search.trim();
    if (!q) return;

    // เปลี่ยนหน้าไป /products พร้อม query search
    router.push(`/products?search=${encodeURIComponent(q)}`);
  };

  // 🧠 Observe only when user scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeroAnimReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  // 🪄 Load slider only when animation done & user idle
  useEffect(() => {
    if (bgLoaded && heroAnimReady && !showSlider) {
      const idleLoad = () => setShowSlider(true);
      if ("requestIdleCallback" in window) {
        const id = (window as any).requestIdleCallback(idleLoad, {
          timeout: 600,
        });
        return () => (window as any).cancelIdleCallback?.(id);
      } else {
        const t = setTimeout(idleLoad, 400);
        return () => clearTimeout(t);
      }
    }
  }, [bgLoaded, heroAnimReady, showSlider]);

  const features = useMemo(() => HERO_FEATURES, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden min-h-full transform-gpu"
      style={{ backfaceVisibility: "hidden" }}
    >
      {/* ✅ Background loads first */}
      <HeroBackground />

      {/* Animate hero only after bg is loaded */}
      {bgLoaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="container relative mx-auto px-1 pt-3 pb-1 md:pt-12 md:pb-16 lg:pt-20 lg:pb-24"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-2">
            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="max-w-xl space-y- text-center md:space-y-8 will-change-transform"
            >
              

              <div className="w-full max-w-md mx-auto block md:hidden">
                <div className="relative">
                  
                  <input
                    aria-label="ค้นหาสินค้า"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="
                            w-full 
                            bg-neutral-900                  /* ✅ เปลี่ยนพื้นหลังเป็นสีดำเข้ม (เดิมเป็นใส) */
                            text-white placeholder-gray-400 /* ✅ ปรับสี text ให้ตัดกับพื้นดำ */
                            border border-green-500/50      /* ✅ เพิ่มขอบสีเขียวให้เห็นกรอบชัดเจน */
                            px-4 py-1.5 pr-20 
                            text-sm md:text-base 
                            rounded-[3px]                   /* 🔒 ทรงเหลี่ยมมนเดิมตามที่คุณใช้ */
                            focus:outline-none focus:ring-2 focus:ring-emerald-500/50 
                            shadow-lg                       /* ✅ เพิ่มเงาให้ลอยเด่นขึ้น */
                            transition
                            "
                    placeholder=""
                  />

                  {!search && (
                    // <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-[70%]">
                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-[65%]">
                      <HeroRotatingText />
                    </div>
                  )}

                  <button
                    onClick={handleSearch}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full px-3 md:px-4 py-1 text-xs md:text-sm bg-emerald-500 hover:bg-emerald-400 text-white font-semibold shadow-md"
                  >
                    ค้นหา
                  </button>
                </div>
              </div>

              {/* <div className="block md:hidden">
                <FeatureBadges />
              </div> */}

              {/* Badge */}
              {/* <div className="inline-flex items-center gap-2.5 md:gap-3 rounded-full bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100 px-4 py-1.5 md:px-6 md:py-2.5 shadow-sm ring-1 ring-emerald-200/60"> */}
              <div className="hidden md:inline-flex items-center gap-2.5 md:gap-3 rounded-full bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100 px-4 py-1.5 md:px-6 md:py-2.5 shadow-sm ring-1 ring-emerald-200/60">
                <div className="flex h-5 w-5 md:h-7 md:w-7 items-center justify-center rounded-full bg-gradient-to-r from-emerald-200 to-emerald-400 shadow-inner">
                  <Cannabis className="h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-700" />
                </div>
                <span className="text-xs md:text-sm font-semibold text-emerald-900 tracking-wide">
                  ยินดีต้อนรับสู่{" "}
                  <span className="font-bold text-emerald-700">DOAG THAI</span>
                </span>
              </div>

              {/* Heading */}
              <h1 className="hidden md:block text-4xl font-extrabold md:text-5xl text-white leading-tight">
                ช็อปสินค้าสายเขียว <br />
                <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500 bg-clip-text text-transparent">
                  ราคาคุ้มค่า
                </span>
              </h1>

              <motion.div
                variants={{
                  hidden: {},
                  show: {
                    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
                  },
                }}
                initial="hidden"
                animate="show"
                className="
    hidden md:flex
    flex-wrap items-center justify-center
    gap-3-custom text-center md:gap-6
    border border-green-500/40 rounded-xl
  "
              >
                {features.map((f) => (
                  <HeroFeatureCard key={f.title} {...f} />
                ))}
              </motion.div>
            </motion.div>

            {/* RIGHT — Slider */}
            <div className="will-change-transform -mx-2 md:mx-0">
              {showSlider ? (
                <HeroProductSlider autoplayStart={bgLoaded && heroAnimReady} />
              ) : (
                <div className="relative h-[260px] w-full overflow-hidden bg-white/5 shadow-xl ring-1 ring-white/10 sm:h-[320px] md:h-[400px] lg:h-[520px] animate-pulse" />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
