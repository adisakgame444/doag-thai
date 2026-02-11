"use client";
import { motion } from "framer-motion";
import React from "react";

interface Props {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // ✅ Type-safe สำหรับ Icon
  title: string;
  description: string;
  iconClassName: string;
}

export const HeroFeatureCard = ({
  icon: FeatureIcon,
  title,
  description,
  iconClassName,
}: Props) => (
  <motion.div
    className="flex w-20 flex-col items-center space-y-1 text-white md:w-24"
    variants={{
      hidden: { opacity: 0, y: 8 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.25, ease: "easeOut" },
      },
    }}
  >
    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-green-500 bg-white/90 shadow-md">
      <FeatureIcon className={`h-4 w-4 ${iconClassName}`} />
    </div>
    <h3 className="text-[9px] font-bold md:text-[10px]">{title}</h3>
    <p className="text-[7px] text-white/70 md:text-[9px]">{description}</p>
  </motion.div>
);
