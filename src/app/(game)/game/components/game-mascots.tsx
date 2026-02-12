"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export const GameMascots = () => {
  return (
    <>
      {/* Left Mascot - Desktop Only */}
      <div className="hidden lg:block absolute left-4 xl:left-12 top-1/2 -translate-y-1/2 z-20">
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative"
        >
          <div className="relative">
            <Image
              src="/images/mascot-left-remove.png"
              alt="Mascot Left"
              width={280}
              height={420}
              className="object-contain mix-blend-multiply drop-shadow-[0_0_30px_rgba(34,197,94,0.6)]"
              style={{ filter: "contrast(1.05) saturate(1.1)" }}
              priority
            />
          </div>
        </motion.div>
      </div>

      {/* Right Mascot - Desktop Only */}
      <div className="hidden lg:block absolute right-4 xl:right-12 top-1/2 -translate-y-1/2 z-20">
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="relative"
        >
          <div className="relative">
            <Image
              src="/images/mascot-right-remove.png"
              alt="Mascot Right"
              width={280}
              height={420}
              className="object-contain mix-blend-multiply drop-shadow-[0_0_30px_rgba(34,197,94,0.6)]"
              style={{ filter: "contrast(1.05) saturate(1.1)" }}
              priority
            />
          </div>
        </motion.div>
      </div>
    </>
  );
};
