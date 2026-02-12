"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { UserSpinConfig } from "@/generated/prisma/client";

interface WinEffectProps {
  showWinEffect: boolean;
  isWinResult: boolean;
  lastResult: {
    result: "WIN" | "LOSE";
    prizeName: string | null;
    prizeImageUrl: string | null;
    remainingSpins: number;
    updatedConfig?: UserSpinConfig;
  } | null;
  imageError: boolean;
  setImageError: (error: boolean) => void;
}

export const WinEffect = ({
  showWinEffect,
  isWinResult,
  lastResult,
  imageError,
  setImageError,
}: WinEffectProps) => {
  return (
    <AnimatePresence>
      {showWinEffect && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
            }}
            className="text-center"
          >
            {isWinResult ? (
              <>
                <div
                  className="text-yellow-400 text-6xl font-black mb-2"
                  style={{ textShadow: "0 0 30px rgba(234, 179, 8, 0.8)" }}
                >
                  🎉 ยินดีด้วย! 🎉
                </div>

                {lastResult?.prizeImageUrl && !imageError ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="my-4 relative w-48 h-48 mx-auto"
                  >
                    <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full animate-pulse" />
                    <Image
                      src={lastResult.prizeImageUrl}
                      alt={lastResult.prizeName || "Prize"}
                      fill
                      className="object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                      onError={() => setImageError(true)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="my-4 flex items-center justify-center w-48 h-48 mx-auto"
                  >
                    <span className="text-8xl filter drop-shadow-[0_0_20px_rgba(234,179,8,0.8)]">
                      {lastResult?.prizeName || "🎁"}
                    </span>
                  </motion.div>
                )}

                <div className="text-white text-2xl font-bold">
                  คุณได้รับ {lastResult?.prizeName || "รางวัลพิเศษ"}
                </div>
              </>
            ) : (
              <>
                <div
                  className="text-red-400 text-6xl font-black mb-2"
                  style={{ textShadow: "0 0 30px rgba(239, 68, 68, 0.8)" }}
                >
                  😢 แพ้! 😢
                </div>
                <div className="text-white text-2xl font-bold">
                  ไม่ได้รับรางวัล
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
