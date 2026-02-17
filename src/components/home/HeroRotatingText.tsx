"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, memo } from "react";

export const HeroRotatingText = memo(() => {
  const texts = [
    "💯 ครบทุกความต้องการด้านกัญชาในที่เดียว 💯",
    "🛒 สั่งซื้อผลิตภัณฑ์กัญชาได้อย่างมั่นใจและปลอดภัย 🛒",
    "⚙️ บริหารร้านและสินค้ากัญชาได้ง่าย ครบจบในที่เดียว ⚙️",
    "🌱 เชื่อถือได้ มีมาตรฐานสำหรับธุรกิจกัญชาไทย 🌱",
  ];

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // ✅ ฟัง event จาก MobileMenu
  useEffect(() => {
    const handleToggle = (e: CustomEvent<{ isOpen: boolean }>) => {
      setPaused(e.detail.isOpen);
    };
    window.addEventListener("mobileMenuToggle", handleToggle as EventListener);
    return () =>
      window.removeEventListener(
        "mobileMenuToggle",
        handleToggle as EventListener,
      );
  }, []);

  // ✅ หมุนข้อความเฉพาะตอนเมนูปิด
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [paused]);

  return (
    // <span className="relative inline-flex justify-center items-center h-[2rem] w-full overflow-hidden align-middle">
    <span className="relative inline-flex items-center h-[2rem] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 8, opacity: 0 }}
          animate={{
            y: 0,
            opacity: paused ? 0.5 : 1,
            filter: paused ? "blur(1px)" : "blur(0px)",
          }}
          exit={{ y: -8, opacity: 0 }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1], // smoother easing (เหมือน CSS ease)
          }}
          // className="absolute w-full text-center transform-gpu will-change-transform"
          // className="absolute left-0 w-full text-left text-xs text-white/60 transform-gpu will-change-transform"
          // className="absolute left-0 w-full text-left text-xs md:text-sm text-white/50 leading-none truncate transform-gpu will-change-transform mt-1"
          className="absolute left-0 w-full text-left text-xs md:text-sm text-zinc-700 dark:text-zinc-300 leading-none truncate transform-gpu will-change-transform mt-1"
          style={{
            transform: "translateZ(0)",
            willChange: "transform, opacity, filter",
          }}
        >
          {texts[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
});
