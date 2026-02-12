"use client";

import { useRouter } from "next/navigation";
import { Loader2, X, Zap, Play, Pause } from "lucide-react";
import { SpinQuota, UserSpinConfig } from "@/generated/prisma/client";
import { motion } from "framer-motion";
import { useSlotMachine } from "../hooks/use-slot-machine";
import { SlotReel } from "./slot-reel";
import { SlotFrame } from "./slot-frame";
import { GameBackground } from "./game-background";
import { GameMascots } from "./game-mascots";
import { WinEffect } from "./win-effect";

interface SlotGameFullscreenProps {
  initialQuota: SpinQuota | null;
  initialConfig: UserSpinConfig | null;
  userId: string;
  slotImages: Array<{ id: string; imageUrl: string; label: string }>;
}

export default function SlotGameFullscreen({
  initialQuota,
  initialConfig,
  userId,
  slotImages,
}: SlotGameFullscreenProps) {
  const router = useRouter();

  const {
    quota,
    spinning,
    slotPositions,
    reelSpinning,
    autoSpin,
    lastResult,
    showWinEffect,
    isWinResult,
    turboMode,
    setTurboMode,
    imageError,
    setImageError,
    remainingSpins,
    SLOT_ITEMS,
    handleSpin,
    toggleAutoSpin,
    handleReelStop,
  } = useSlotMachine({
    initialQuota,
    initialConfig,
    userId,
    slotImages,
  });

  // No quota - show redirect
  if (!quota || quota.status !== "ACTIVE") {
    return (
      <div
        className="min-h-svh w-full flex items-center justify-center"
        style={{
          background:
            "linear-gradient(180deg, #052e16 0%, #14532d 50%, #052e16 100%)",
        }}
      >
        <div className="text-center text-white p-8">
          <h2 className="text-2xl font-bold mb-4">ยังไม่มีสิทธิ์เล่น</h2>
          <p className="mb-6 text-white/70">ซื้อแพคเกจก่อนน้า~</p>
          <button
            onClick={() => router.push("/spin")}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full font-bold text-xl shadow-lg shadow-green-500/30"
          >
            ซื้อแพคเกจ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-svh w-full flex flex-col relative overflow-hidden select-none"
      style={{
        background:
          "linear-gradient(180deg, #052e16 0%, #14532d 30%, #166534 50%, #14532d 70%, #052e16 100%)",
      }}
    >
      <GameBackground />
      <GameMascots />

      {/* Exit Button */}
      <motion.button
        onClick={() => router.push("/spin")}
        className="absolute top-4 right-4 z-50 w-12 h-12 bg-red-500 hover:bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/50 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <X className="w-7 h-7 text-white" strokeWidth={3} />
      </motion.button>

      {/* Premium Slot Machine Header */}
      <div className="relative z-10 pt-6 px-4">
        <div className="flex justify-center">
          <motion.div className="relative">
            {/* Outer golden frame */}
            <div
              className="px-10 py-3 rounded-xl text-center relative overflow-hidden"
              style={{
                background: "linear-gradient(180deg, #1a472a 0%, #0d2818 100%)",
                border: "3px solid transparent",
                borderImage:
                  "linear-gradient(180deg, #fcd34d, #b45309, #fcd34d) 1",
                boxShadow:
                  "0 4px 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              }}
            >
              {/* Inner glow line */}
              <div
                className="absolute inset-0 rounded-xl"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(34, 197, 94, 0.1) 50%, transparent 100%)",
                }}
              />

              <div className="relative flex items-center gap-3">
                <span className="text-2xl">💎</span>
                <span
                  className="font-black text-2xl tracking-[0.2em] uppercase"
                  style={{
                    background:
                      "linear-gradient(180deg, #fef3c7 0%, #fcd34d 40%, #b45309 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                    filter: "drop-shadow(0 0 10px rgba(234, 179, 8, 0.5))",
                  }}
                >
                  WEED SPIN
                </span>
                <span className="text-2xl">💎</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Slot Machine Area */}
      <div className="flex-1 flex flex-col justify-center px-4 py-6">
        <SlotFrame>
          <SlotReel
            items={SLOT_ITEMS}
            spinning={reelSpinning[0]}
            targetIndex={slotPositions[0]}
            delay={turboMode ? 100 : 800}
            onStop={() => handleReelStop(0)}
            direction="up"
            turboMode={turboMode}
          />
          <SlotReel
            items={SLOT_ITEMS}
            spinning={reelSpinning[1]}
            targetIndex={slotPositions[1]}
            delay={turboMode ? 200 : 1300}
            onStop={() => handleReelStop(1)}
            direction="down"
            turboMode={turboMode}
          />
          <SlotReel
            items={SLOT_ITEMS}
            spinning={reelSpinning[2]}
            targetIndex={slotPositions[2]}
            delay={turboMode ? 300 : 1800}
            onStop={() => handleReelStop(2)}
            direction="up"
            turboMode={turboMode}
          />
        </SlotFrame>

        <WinEffect
          showWinEffect={showWinEffect}
          isWinResult={isWinResult}
          lastResult={lastResult}
          imageError={imageError}
          setImageError={setImageError}
        />
      </div>

      {/* Bottom Control Panel */}
      <div
        className="relative z-10 px-4 pb-6"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(5, 46, 22, 0.9) 30%)",
        }}
      >
        {/* Remaining Spins - Centered */}
        <div className="flex justify-center items-center mb-4">
          <div
            className="flex items-center gap-3 px-6 py-3 rounded-xl"
            style={{
              background: "linear-gradient(180deg, #0a2a15 0%, #052e16 100%)",
              border: "2px solid #22c55e",
              boxShadow: "0 0 15px rgba(34, 197, 94, 0.3)",
            }}
          >
            <span className="text-2xl">🌿</span>
            <span className="text-green-400 font-bold text-2xl">
              {remainingSpins}
            </span>
            <span className="text-white/70 text-sm">ครั้ง</span>
          </div>
        </div>

        {/* Control Buttons Row */}
        <div className="flex items-center justify-center gap-3">
          {/* Turbo Button */}
          <motion.button
            onClick={() => setTurboMode(!turboMode)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all ${
              turboMode
                ? "bg-gradient-to-b from-green-500 to-emerald-600 shadow-lg shadow-green-500/50"
                : "bg-gradient-to-b from-gray-600 to-gray-800"
            }`}
            style={{
              border: "3px solid #22c55e",
            }}
          >
            <Zap
              className={`w-6 h-6 ${turboMode ? "text-white" : "text-gray-400"}`}
            />
            <span className="text-[10px] text-white font-bold">TURBO</span>
          </motion.button>

          {/* SPIN Button - Main */}
          <motion.button
            onClick={handleSpin}
            disabled={
              spinning ||
              remainingSpins <= 0 ||
              (initialConfig?.disabledSpin ?? false) ||
              autoSpin
            }
            whileHover={{
              scale:
                spinning ||
                remainingSpins <= 0 ||
                (initialConfig?.disabledSpin ?? false) ||
                autoSpin
                  ? 1
                  : 1.05,
            }}
            whileTap={{
              scale:
                spinning ||
                remainingSpins <= 0 ||
                (initialConfig?.disabledSpin ?? false) ||
                autoSpin
                  ? 1
                  : 0.95,
            }}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all disabled:opacity-80 disabled:cursor-not-allowed`}
            style={{
              background: spinning
                ? "linear-gradient(180deg, #14532d 0%, #052e16 100%)" // Darker green when spinning
                : "linear-gradient(180deg, #22c55e 0%, #16a34a 50%, #15803d 100%)",
              border: spinning ? "6px solid #0f391e" : "6px solid #14532d",
              boxShadow: spinning
                ? "none"
                : "0 0 30px rgba(34, 197, 94, 0.6), inset 0 -5px 20px rgba(0, 0, 0, 0.4), inset 0 5px 20px rgba(255, 255, 255, 0.2)",
            }}
          >
            {/* Inner circle decoration */}
            <div
              className="absolute inset-2 rounded-full"
              style={{
                background: spinning
                  ? "linear-gradient(180deg, #14532d 0%, #052e16 100%)"
                  : "linear-gradient(180deg, #4ade80 0%, #22c55e 50%, #16a34a 100%)",
                boxShadow: "inset 0 2px 10px rgba(255, 255, 255, 0.3)",
              }}
            />

            {/* Leaf icon or loader or stop icon */}
            <div className="relative z-10">
              {spinning ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-10 h-10 text-white/50 animate-spin" />
                </div>
              ) : (
                <span className="text-4xl">🌿</span>
              )}
            </div>
          </motion.button>

          {/* Auto Spin Button */}
          <motion.button
            onClick={toggleAutoSpin}
            disabled={
              spinning ||
              remainingSpins <= 0 ||
              (initialConfig?.disabledSpin ?? false)
            }
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all disabled:opacity-50 ${
              autoSpin
                ? "bg-gradient-to-b from-green-500 to-emerald-700 shadow-lg shadow-green-500/50"
                : "bg-gradient-to-b from-gray-600 to-gray-800"
            }`}
            style={{
              border: "3px solid #22c55e",
            }}
          >
            {autoSpin ? (
              <Pause className="w-6 h-6 text-white fill-white" />
            ) : (
              <Play className="w-6 h-6 text-green-400" />
            )}
            <span className="text-[10px] text-white font-bold">AUTO</span>
          </motion.button>
        </div>

        {/* Rope decoration at bottom */}
        <div className="mt-4 flex justify-center">
          <div className="w-64 h-1 bg-gradient-to-r from-transparent via-green-600 to-transparent rounded-full" />
        </div>
      </div>
    </div>
  );
}
