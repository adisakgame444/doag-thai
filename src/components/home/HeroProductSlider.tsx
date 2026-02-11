// "use client";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay } from "swiper/modules";
// import Image from "next/image";
// import "swiper/css";
// import { useRef, useEffect } from "react";

// const SLIDES = [
//   { src: "/images/TK-image1.webp", alt: "คัดสรรสินค้า DOAG THAI 1" },
//   { src: "/images/TK-image2.webp", alt: "คัดสรรสินค้า DOAG THAI 2" },
//   { src: "/images/TK-image3.webp", alt: "คัดสรรสินค้า DOAG THAI 3" },
// ];

// interface Props {
//   autoplayStart?: boolean;
// }

// export const HeroProductSlider = ({ autoplayStart = false }: Props) => {
//   const swiperRef = useRef<any>(null);
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   // ✅ หยุดหรือเล่น autoplay เมื่อเมนูเปิด/ปิด
//   useEffect(() => {
//     const handleMenuToggle = (e: CustomEvent<{ isOpen: boolean }>) => {
//       const swiper = swiperRef.current;
//       if (!swiper || !swiper.autoplay) return;

//       if (e.detail.isOpen) {
//         swiper.autoplay.stop();
//       } else if (autoplayStart) {
//         swiper.autoplay.start();
//       }
//     };

//     window.addEventListener(
//       "mobileMenuToggle",
//       handleMenuToggle as EventListener
//     );
//     return () =>
//       window.removeEventListener(
//         "mobileMenuToggle",
//         handleMenuToggle as EventListener
//       );
//   }, [autoplayStart]);

//   // ✅ เริ่ม autoplay เมื่อ prop อนุญาต
//   useEffect(() => {
//     if (autoplayStart) swiperRef.current?.autoplay?.start?.();
//   }, [autoplayStart]);

//   // ✅ หยุด autoplay ถ้า slider อยู่นอกจอ หรือ tab ถูกซ่อนไว้
//   useEffect(() => {
//     const node = containerRef.current;
//     if (!node) return;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         const s = swiperRef.current;
//         if (!s || !s.autoplay) return;
//         if (entry.isIntersecting) {
//           if (autoplayStart) s.autoplay.start();
//         } else {
//           s.autoplay.stop();
//         }
//       },
//       { threshold: 0.25 }
//     );

//     observer.observe(node);

//     const handleVisibility = () => {
//       const s = swiperRef.current;
//       if (!s || !s.autoplay) return;
//       if (document.hidden) s.autoplay.stop();
//       else if (autoplayStart) s.autoplay.start();
//     };

//     document.addEventListener("visibilitychange", handleVisibility);

//     return () => {
//       observer.disconnect();
//       document.removeEventListener("visibilitychange", handleVisibility);
//     };
//   }, [autoplayStart]);

//   return (
//     <div
//       ref={containerRef}
//       className="relative h-[260px] w-full overflow-hidden rounded-xl bg-white/5 shadow-md ring-1 ring-white/10 sm:h-[320px] md:h-[400px] lg:h-[520px]"
//     >
//       <Swiper
//         modules={[Autoplay]}
//         onSwiper={(s) => (swiperRef.current = s)}
//         autoplay={
//           autoplayStart
//             ? {
//                 delay: 9000,
//                 disableOnInteraction: false,
//                 pauseOnMouseEnter: false,
//               }
//             : false
//         }
//         loop
//         speed={1000}
//         spaceBetween={5}
//         slidesPerView={1}
//         allowTouchMove={false}
//         className="h-full w-full"
//       >
//         {SLIDES.map(({ src, alt }, i) => (
//           <SwiperSlide key={src}>
//             <div className="relative h-full w-full overflow-hidden rounded-lg">
//               <Image
//                 src={src}
//                 alt={alt}
//                 fill
//                 decoding="async"
//                 loading={i === 0 ? "eager" : "lazy"}
//                 quality={i === 0 ? 45 : 25}
//                 placeholder="blur"
//                 blurDataURL="/images/blur-placeholder.jpg"
//                 style={{
//                   transform: "translateZ(0)",
//                   willChange: "opacity, transform",
//                 }}
//                 className="object-cover rounded-lg transform-gpu"
//                 sizes="(max-width:768px) 100vw, 540px"
//                 priority={i === 0}
//               />
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default HeroProductSlider;

// "use client";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay } from "swiper/modules";
// import Image from "next/image";
// import "swiper/css";
// import { useRef, useEffect } from "react";

// const SLIDES = [
//   { src: "/images/TK-image1.webp", alt: "คัดสรรสินค้า DOAG THAI 1" },
//   { src: "/images/TK-image2.webp", alt: "คัดสรรสินค้า DOAG THAI 2" },
//   { src: "/images/TK-image3.webp", alt: "คัดสรรสินค้า DOAG THAI 3" },
// ];

// interface Props {
//   autoplayStart?: boolean;
// }

// export const HeroProductSlider = ({ autoplayStart = false }: Props) => {
//   const swiperRef = useRef<any>(null);
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   // ✅ หยุดหรือเล่น autoplay เมื่อเมนูเปิด/ปิด
//   useEffect(() => {
//     const handleMenuToggle = (e: CustomEvent<{ isOpen: boolean }>) => {
//       const swiper = swiperRef.current;
//       if (!swiper || !swiper.autoplay) return;

//       if (e.detail.isOpen) {
//         swiper.autoplay.stop();
//       } else if (autoplayStart) {
//         swiper.autoplay.start();
//       }
//     };

//     window.addEventListener(
//       "mobileMenuToggle",
//       handleMenuToggle as EventListener
//     );
//     return () =>
//       window.removeEventListener(
//         "mobileMenuToggle",
//         handleMenuToggle as EventListener
//       );
//   }, [autoplayStart]);

//   // ✅ เริ่ม autoplay เมื่อ prop อนุญาต
//   useEffect(() => {
//     if (autoplayStart) swiperRef.current?.autoplay?.start?.();
//   }, [autoplayStart]);

//   // ✅ หยุด autoplay ถ้า slider อยู่นอกจอ หรือ tab ถูกซ่อนไว้
//   useEffect(() => {
//     const node = containerRef.current;
//     if (!node) return;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         const s = swiperRef.current;
//         if (!s || !s.autoplay) return;
//         if (entry.isIntersecting) {
//           if (autoplayStart) s.autoplay.start();
//         } else {
//           s.autoplay.stop();
//         }
//       },
//       { threshold: 0.25 }
//     );

//     observer.observe(node);

//     const handleVisibility = () => {
//       const s = swiperRef.current;
//       if (!s || !s.autoplay) return;
//       if (document.hidden) s.autoplay.stop();
//       else if (autoplayStart) s.autoplay.start();
//     };

//     document.addEventListener("visibilitychange", handleVisibility);

//     return () => {
//       observer.disconnect();
//       document.removeEventListener("visibilitychange", handleVisibility);
//     };
//   }, [autoplayStart]);

//   return (
//     <div
//       ref={containerRef}
//       className="relative h-[260px] w-full overflow-hidden rounded-xl bg-white/5 shadow-md ring-1 ring-white/10 sm:h-[320px] md:h-[400px] lg:h-[520px]"
//     >
//       <Swiper
//         modules={[Autoplay]}
//         onSwiper={(s) => (swiperRef.current = s)}
//         autoplay={
//           autoplayStart
//             ? {
//                 delay: 9000,
//                 disableOnInteraction: false,
//                 pauseOnMouseEnter: false,
//               }
//             : false
//         }
//         loop
//         speed={1000}
//         spaceBetween={5}
//         slidesPerView={1}
//         allowTouchMove={false}
//         className="h-full w-full"
//       >
//         {SLIDES.map(({ src, alt }, i) => (
//           <SwiperSlide key={src}>
//             <div className="relative h-full w-full overflow-hidden rounded-lg">
//               <Image
//                 src={src}
//                 alt={alt}
//                 fill
//                 decoding="async"
//                 loading={i === 0 ? "eager" : "lazy"}
//                 quality={i === 0 ? 45 : 25}
//                 style={{
//                   transform: "translateZ(0)",
//                   willChange: "opacity, transform",
//                 }}
//                 className="object-cover rounded-lg transform-gpu"
//                 sizes="(max-width:768px) 100vw, 540px"
//                 priority={i === 0}
//               />
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default HeroProductSlider;

"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css/bundle"; // ← สำคัญที่สุด
import { useRef, useEffect } from "react";

const SLIDES = [
  { src: "/images/TK-image1.jpg", alt: "คัดสรรสินค้า DOAG THAI 1" },
  { src: "/images/TK-image2.jpg", alt: "คัดสรรสินค้า DOAG THAI 2" },
  { src: "/images/TK-image3.jpg", alt: "คัดสรรสินค้า DOAG THAI 3" },
];

interface Props {
  autoplayStart?: boolean;
}

export const HeroProductSlider = ({ autoplayStart = false }: Props) => {
  const swiperRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Toggle autoplay when menu opens/closes
  useEffect(() => {
    const handleMenuToggle = (e: CustomEvent<{ isOpen: boolean }>) => {
      const swiper = swiperRef.current;
      if (!swiper?.autoplay) return;

      e.detail.isOpen
        ? swiper.autoplay.stop()
        : autoplayStart && swiper.autoplay.start();
    };

    window.addEventListener(
      "mobileMenuToggle",
      handleMenuToggle as EventListener,
    );
    return () =>
      window.removeEventListener(
        "mobileMenuToggle",
        handleMenuToggle as EventListener,
      );
  }, [autoplayStart]);

  // Start autoplay if prop enabled
  useEffect(() => {
    if (autoplayStart) swiperRef.current?.autoplay?.start?.();
  }, [autoplayStart]);

  // Pause autoplay when off-screen or tab hidden
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const s = swiperRef.current;
        if (!s?.autoplay) return;
        entry.isIntersecting
          ? autoplayStart && s.autoplay.start()
          : s.autoplay.stop();
      },
      { threshold: 0.25 },
    );

    observer.observe(node);

    const handleVisibility = () => {
      const s = swiperRef.current;
      if (!s?.autoplay) return;
      document.hidden ? s.autoplay.stop() : autoplayStart && s.autoplay.start();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [autoplayStart]);

  return (
    // <div
    //   ref={containerRef}
    //   className="relative h-[180px] w-full overflow-hidden rounded-xl bg-white/5 shadow-md ring-1 ring-white/10
    //            sm:h-[320px] md:h-[400px] lg:h-[520px]"
    // >
    <div
      ref={containerRef}
      className="
    relative h-[240px] w-full overflow-hidden
    bg-white/5
    shadow-md shadow-emerald-900/20
    sm:h-[320px] md:h-[400px] lg:h-[520px]
    rounded-none md:rounded-xl  {/* ✅✅ เพิ่มบรรทัดนี้ครับ */}
  "
    >
      <Swiper
        modules={[Autoplay]}
        onSwiper={(s) => (swiperRef.current = s)}
        autoplay={
          autoplayStart
            ? {
                delay: 9000,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
              }
            : false
        }
        loop
        speed={1000}
        spaceBetween={5}
        slidesPerView={1}
        allowTouchMove={false}
        className="h-full w-full"
      >
        {SLIDES.map(({ src, alt }, i) => (
          <SwiperSlide key={src}>
            <div className="relative h-full w-full overflow-hidden ">
              {/* <Image
                src={src}
                alt={alt}
                fill
                unoptimized // ← แก้ปัญหา Next.js16 + Swiper 100%
                className="object-cover transform-gpu"
                priority={i === 0}
                sizes="100vw"
              /> */}
              {/* <Image
                src={src}
                alt={alt}
                fill
                unoptimized
                className="object-contain lg:object-cover hero-image-scale transform-gpu"
                priority={i === 0}
                sizes="100vw"
              /> */}

              <Image
                src={src}
                alt={alt}
                fill
                // 1. ลบ unoptimized ออก เพื่อให้ Next.js ช่วยย่อรูปให้
                // 2. ปรับ sizes ให้ตรงความจริง (มือถือเต็มจอ, Desktop ครึ่งจอ)
                // sizes="(max-width: 768px) 100vw, 50vw"
                // 3. ลด quality ลงนิดหน่อยเพื่อความลื่น
                // quality={75}
                className="object-contain lg:object-cover hero-image-scale transform-gpu will-change-transform" // เพิ่ม will-change
                priority={i === 0}
                unoptimized={true}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroProductSlider;
