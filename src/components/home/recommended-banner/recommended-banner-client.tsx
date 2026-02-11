// "use client";

// import "swiper/css";
// import Image from "next/image";
// import { ImageOff } from "lucide-react";
// import type { Banner } from ".";
// import type { SwiperOptions } from "swiper/types";
// import { Autoplay } from "swiper/modules";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { useEffect, useState, useRef } from "react";
// import { BannerSectionHeader } from "./banner-section-header"; // ✅ import ใหม่

// interface RecommendedBannerClientProps {
//   banners: Banner[];
// }

// const AUTOPLAY_CONFIG = {
//   delay: 4000,
//   disableOnInteraction: false,
//   pauseOnMouseEnter: true,
// } as const;

// export default function RecommendedBannerClient({
//   banners,
// }: RecommendedBannerClientProps) {
//   const containerRef = useRef<HTMLElement | null>(null);
//   const swiperRef = useRef<any>(null);
//   const [isVisible, setIsVisible] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false); // ✅ เพิ่ม state

//   // ✅ ฟัง event จาก MobileMenu
//   useEffect(() => {
//     function handleMenuToggle(event: CustomEvent<{ isOpen: boolean }>) {
//       setIsMenuOpen(event.detail.isOpen);
//     }
//     window.addEventListener(
//       "mobileMenuToggle",
//       handleMenuToggle as EventListener
//     );
//     return () =>
//       window.removeEventListener(
//         "mobileMenuToggle",
//         handleMenuToggle as EventListener
//       );
//   }, []);

//   // ✅ ตรวจว่าหน้าอยู่ใน viewport หรือยัง
//   useEffect(() => {
//     const el = containerRef.current;
//     if (!el) return;
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsVisible(true);
//           observer.disconnect();
//         }
//       },
//       { rootMargin: "200px" }
//     );
//     observer.observe(el);
//     return () => observer.disconnect();
//   }, []);

//   // ✅ ควบคุม autoplay ของ Swiper ตาม visibility และเมนู
//   useEffect(() => {
//     const swiper = swiperRef.current?.swiper;
//     if (!swiper || !swiper.autoplay) return;

//     if (isVisible && !isMenuOpen) {
//       swiper.autoplay.start(); // ▶️ เริ่มเล่นเมื่อมองเห็นและเมนูปิด
//     } else {
//       swiper.autoplay.stop(); // ⏸️ หยุดเมื่อเมนูเปิดหรือยังไม่เห็น
//     }
//   }, [isVisible, isMenuOpen]);

//   // ✅ ถ้ายังไม่มีแบนเนอร์
//   if (banners.length === 0) {
//     return (
//       <section className="mb-5 px-4 lg:px-30">
//         <BannerSectionHeader /> {/* ✅ ใช้ component ใหม่ */}
//         <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-8 text-center shadow-inner">
//           <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
//             <ImageOff className="h-7 w-7" />
//           </div>
//           <h3 className="mt-5 text-lg font-semibold text-secondary-foreground md:text-xl">
//             ยังไม่มีแบนเนอร์แนะนำ
//           </h3>
//           <p className="mt-2 text-sm text-muted-foreground md:text-base">
//             เพิ่มแบนเนอร์ในระบบแอดมินเพื่อให้ลูกค้าเห็นโปรโมชันล่าสุด
//           </p>
//         </div>
//       </section>
//     );
//   }

//   // ✅ การตั้งค่า Swiper
//   const slideCount = Math.max(banners.length, 1);
//   const baseSlidesPerView = Math.min(3, slideCount);
//   const mediumSlidesPerView = Math.min(4, slideCount);
//   const largeSlidesPerView = Math.min(5, slideCount);
//   const shouldLoop = banners.length > 1;

//   const breakpoints: SwiperOptions["breakpoints"] = {
//     768: { slidesPerView: mediumSlidesPerView, spaceBetween: 16 },
//     1280: { slidesPerView: largeSlidesPerView, spaceBetween: 20 },
//   };

//   return (
//     <section ref={containerRef} className="mb-2 px-4 lg:px-30">
//       <BannerSectionHeader /> {/* ✅ ใช้ component ที่แยกใหม่ */}
//       <Swiper
//         ref={swiperRef}
//         modules={[Autoplay]}
//         slidesPerView={baseSlidesPerView}
//         spaceBetween={12}
//         speed={900}
//         loop={shouldLoop}
//         grabCursor={shouldLoop}
//         autoplay={isVisible && shouldLoop ? AUTOPLAY_CONFIG : false}
//         breakpoints={breakpoints}
//         className="!px-0"
//       >
//         {banners.map((banner, index) => (
//           <SwiperSlide key={banner.id}>
//             <div className="relative h-40 overflow-hidden rounded-xl shadow-md md:h-100 lg:h-150">
//               <Image
//                 src={banner.imageUrl}
//                 alt={banner.name || "recommended banner"}
//                 fill
//                 className="object-cover"
//                 priority={index === 0}
//                 sizes="(min-width:1280px) 20vw, (min-width:768px) 25vw, 33vw"
//               />
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </section>
//   );
// }

// "use client";

// import "swiper/css";
// import Image from "next/image";
// import { ImageOff } from "lucide-react";
// import type { Banner } from ".";
// import type { SwiperOptions } from "swiper/types";
// import { Autoplay } from "swiper/modules";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { useEffect, useState, useRef } from "react";
// // import { BannerSectionHeader } from "./banner-section-header";

// // ==================================================
// // ✅ hook: ตรวจว่าเป็น desktop หรือไม่
// // ==================================================
// function useIsDesktop() {
//   const [isDesktop, setIsDesktop] = useState(false);

//   useEffect(() => {
//     const mediaQuery = window.matchMedia("(min-width: 1024px)");
//     const update = () => setIsDesktop(mediaQuery.matches);

//     update();
//     mediaQuery.addEventListener("change", update);

//     return () => mediaQuery.removeEventListener("change", update);
//   }, []);

//   return isDesktop;
// }

// interface RecommendedBannerClientProps {
//   banners: Banner[];
// }

// const AUTOPLAY_CONFIG = {
//   delay: 4000,
//   disableOnInteraction: false,
//   pauseOnMouseEnter: true,
// } as const;

// export default function RecommendedBannerClient({
//   banners,
// }: RecommendedBannerClientProps) {
//   // ==================================================
//   // 🔹 Hooks (ต้องถูกเรียกทุก render และเรียงเหมือนเดิม)
//   // ==================================================
//   const isDesktop = useIsDesktop();

//   const containerRef = useRef<HTMLElement | null>(null);
//   const swiperRef = useRef<any>(null);

//   const [isVisible, setIsVisible] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   // ==================================================
//   // 🔹 Effects
//   // ==================================================

//   // ฟัง event จาก MobileMenu
//   useEffect(() => {
//     function handleMenuToggle(event: CustomEvent<{ isOpen: boolean }>) {
//       setIsMenuOpen(event.detail.isOpen);
//     }

//     window.addEventListener(
//       "mobileMenuToggle",
//       handleMenuToggle as EventListener
//     );

//     return () =>
//       window.removeEventListener(
//         "mobileMenuToggle",
//         handleMenuToggle as EventListener
//       );
//   }, []);

//   // ตรวจว่า section อยู่ใน viewport หรือยัง
//   useEffect(() => {
//     const el = containerRef.current;
//     if (!el) return;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsVisible(true);
//           observer.disconnect();
//         }
//       },
//       { rootMargin: "200px" }
//     );

//     observer.observe(el);
//     return () => observer.disconnect();
//   }, []);

//   // ควบคุม autoplay ของ Swiper
//   useEffect(() => {
//     const swiper = swiperRef.current?.swiper;
//     if (!swiper || !swiper.autoplay) return;

//     if (isVisible && !isMenuOpen) {
//       swiper.autoplay.start();
//     } else {
//       swiper.autoplay.stop();
//     }
//   }, [isVisible, isMenuOpen]);

//   // ==================================================
//   // 🔹 Guard rendering (หลัง hook เท่านั้น)
//   // ==================================================
//   if (!isDesktop) {
//     return null;
//   }

//   // ==================================================
//   // 🔹 Empty state
//   // ==================================================
//   if (banners.length === 0) {
//     return (
//       <section className="mb-5 px-4 lg:px-30 hidden lg:block">
//         {/* <BannerSectionHeader /> */}
//         <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-8 text-center shadow-inner">
//           <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
//             <ImageOff className="h-7 w-7" />
//           </div>
//           <h3 className="mt-5 text-lg font-semibold text-secondary-foreground md:text-xl">
//             ยังไม่มีแบนเนอร์แนะนำ
//           </h3>
//           <p className="mt-2 text-sm text-muted-foreground md:text-base">
//             เพิ่มแบนเนอร์ในระบบแอดมินเพื่อให้ลูกค้าเห็นโปรโมชันล่าสุด
//           </p>
//         </div>
//       </section>
//     );
//   }

//   // ==================================================
//   // 🔹 Swiper config
//   // ==================================================
//   const slideCount = Math.max(banners.length, 1);
//   const baseSlidesPerView = Math.min(3, slideCount);
//   const mediumSlidesPerView = Math.min(4, slideCount);
//   const largeSlidesPerView = Math.min(5, slideCount);
//   const shouldLoop = banners.length > 1;

//   const breakpoints: SwiperOptions["breakpoints"] = {
//     768: { slidesPerView: mediumSlidesPerView, spaceBetween: 16 },
//     1280: { slidesPerView: largeSlidesPerView, spaceBetween: 20 },
//   };

//   // ==================================================
//   // 🔹 Render
//   // ==================================================
//   return (
//     <section ref={containerRef} className="mb-2 px-4 lg:px-30 hidden lg:block">
//       {/* <BannerSectionHeader /> */}
//       <Swiper
//         ref={swiperRef}
//         modules={[Autoplay]}
//         slidesPerView={baseSlidesPerView}
//         spaceBetween={12}
//         speed={900}
//         loop={shouldLoop}
//         grabCursor={shouldLoop}
//         autoplay={isVisible && shouldLoop ? AUTOPLAY_CONFIG : false}
//         breakpoints={breakpoints}
//         className="!px-0"
//       >
//         {banners.map((banner, index) => (
//           <SwiperSlide key={banner.id}>
//             <div className="relative h-40 overflow-hidden rounded-xl shadow-md md:h-100 lg:h-150">
//               <Image
//                 src={banner.imageUrl}
//                 alt={banner.name || "recommended banner"}
//                 fill
//                 className="object-cover"
//                 priority={index === 0}
//                 sizes="(min-width:1280px) 20vw, (min-width:768px) 25vw, 33vw"
//               />
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </section>
//   );
// }
