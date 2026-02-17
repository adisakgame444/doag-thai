// "use client";

// import { useRouter } from "next/navigation";
// import { Loader2, X, Zap, Play, Pause } from "lucide-react";
// import { SpinQuota, UserSpinConfig } from "@/generated/prisma/client";
// import { motion } from "framer-motion";
// import { useSlotMachine } from "../hooks/use-slot-machine";
// import { SlotReel } from "./slot-reel";
// import { SlotFrame } from "./slot-frame";
// import { GameBackground } from "./game-background";
// import { GameMascots } from "./game-mascots";
// import { WinEffect } from "./win-effect";

// interface SlotGameFullscreenProps {
//   initialQuota: SpinQuota | null;
//   initialConfig: UserSpinConfig | null;
//   userId: string;
//   slotImages: Array<{ id: string; imageUrl: string; label: string }>;
// }

// export default function SlotGameFullscreen({
//   initialQuota,
//   initialConfig,
//   userId,
//   slotImages,
// }: SlotGameFullscreenProps) {
//   const router = useRouter();

//   const {
//     quota,
//     spinning,
//     slotPositions,
//     reelSpinning,
//     autoSpin,
//     lastResult,
//     showWinEffect,
//     isWinResult,
//     turboMode,
//     setTurboMode,
//     imageError,
//     setImageError,
//     remainingSpins,
//     SLOT_ITEMS,
//     handleSpin,
//     toggleAutoSpin,
//     handleReelStop,
//   } = useSlotMachine({
//     initialQuota,
//     initialConfig,
//     userId,
//     slotImages,
//   });

//   // No quota - show redirect
//   if (!quota || quota.status !== "ACTIVE") {
//     return (
//       <div
//         className="min-h-svh w-full flex items-center justify-center"
//         style={{
//           background:
//             "linear-gradient(180deg, #052e16 0%, #14532d 50%, #052e16 100%)",
//         }}
//       >
//         <div className="text-center text-white p-8">
//           <h2 className="text-2xl font-bold mb-4">ยังไม่มีสิทธิ์เล่น</h2>
//           <p className="mb-6 text-white/70">ซื้อแพคเกจก่อนน้า~</p>
//           <button
//             onClick={() => router.push("/spin")}
//             className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full font-bold text-xl shadow-lg shadow-green-500/30"
//           >
//             ซื้อแพคเกจ
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="min-h-svh w-full flex flex-col relative overflow-hidden select-none"
//       style={{
//         background:
//           "linear-gradient(180deg, #052e16 0%, #14532d 30%, #166534 50%, #14532d 70%, #052e16 100%)",
//       }}
//     >
//       <GameBackground />
//       <GameMascots />

//       {/* Exit Button */}
//       <motion.button
//         onClick={() => router.push("/spin")}
//         className="absolute top-4 right-4 z-50 w-12 h-12 bg-red-500 hover:bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/50 transition-all"
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//       >
//         <X className="w-7 h-7 text-white" strokeWidth={3} />
//       </motion.button>

//       {/* Premium Slot Machine Header */}
//       <div className="relative z-10 pt-6 px-4">
//         <div className="flex justify-center">
//           <motion.div className="relative">
//             {/* Outer golden frame */}
//             <div
//               className="px-10 py-3 rounded-xl text-center relative overflow-hidden"
//               style={{
//                 background: "linear-gradient(180deg, #1a472a 0%, #0d2818 100%)",
//                 border: "3px solid transparent",
//                 borderImage:
//                   "linear-gradient(180deg, #fcd34d, #b45309, #fcd34d) 1",
//                 boxShadow:
//                   "0 4px 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
//               }}
//             >
//               {/* Inner glow line */}
//               <div
//                 className="absolute inset-0 rounded-xl"
//                 style={{
//                   background:
//                     "linear-gradient(90deg, transparent 0%, rgba(34, 197, 94, 0.1) 50%, transparent 100%)",
//                 }}
//               />

//               <div className="relative flex items-center gap-3">
//                 <span className="text-2xl">💎</span>
//                 <span
//                   className="font-black text-2xl tracking-[0.2em] uppercase"
//                   style={{
//                     background:
//                       "linear-gradient(180deg, #fef3c7 0%, #fcd34d 40%, #b45309 100%)",
//                     WebkitBackgroundClip: "text",
//                     WebkitTextFillColor: "transparent",
//                     textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
//                     filter: "drop-shadow(0 0 10px rgba(234, 179, 8, 0.5))",
//                   }}
//                 >
//                   WEED SPIN
//                 </span>
//                 <span className="text-2xl">💎</span>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Main Slot Machine Area */}
//       <div className="flex-1 flex flex-col justify-center px-4 py-6">
//         <SlotFrame>
//           <SlotReel
//             items={SLOT_ITEMS}
//             spinning={reelSpinning[0]}
//             targetIndex={slotPositions[0]}
//             delay={turboMode ? 100 : 800}
//             onStop={() => handleReelStop(0)}
//             direction="up"
//             turboMode={turboMode}
//           />
//           <SlotReel
//             items={SLOT_ITEMS}
//             spinning={reelSpinning[1]}
//             targetIndex={slotPositions[1]}
//             delay={turboMode ? 200 : 1300}
//             onStop={() => handleReelStop(1)}
//             direction="down"
//             turboMode={turboMode}
//           />
//           <SlotReel
//             items={SLOT_ITEMS}
//             spinning={reelSpinning[2]}
//             targetIndex={slotPositions[2]}
//             delay={turboMode ? 300 : 1800}
//             onStop={() => handleReelStop(2)}
//             direction="up"
//             turboMode={turboMode}
//           />
//         </SlotFrame>

//         <WinEffect
//           showWinEffect={showWinEffect}
//           isWinResult={isWinResult}
//           lastResult={lastResult}
//           imageError={imageError}
//           setImageError={setImageError}
//         />
//       </div>

//       {/* Bottom Control Panel */}
//       <div
//         className="relative z-10 px-4 pb-6"
//         style={{
//           background:
//             "linear-gradient(180deg, transparent 0%, rgba(5, 46, 22, 0.9) 30%)",
//         }}
//       >
//         {/* Remaining Spins - Centered */}
//         <div className="flex justify-center items-center mb-4">
//           <div
//             className="flex items-center gap-3 px-6 py-3 rounded-xl"
//             style={{
//               background: "linear-gradient(180deg, #0a2a15 0%, #052e16 100%)",
//               border: "2px solid #22c55e",
//               boxShadow: "0 0 15px rgba(34, 197, 94, 0.3)",
//             }}
//           >
//             <span className="text-2xl">🌿</span>
//             <span className="text-green-400 font-bold text-2xl">
//               {remainingSpins}
//             </span>
//             <span className="text-white/70 text-sm">ครั้ง</span>
//           </div>
//         </div>

//         {/* Control Buttons Row */}
//         <div className="flex items-center justify-center gap-3">
//           {/* Turbo Button */}
//           <motion.button
//             onClick={() => setTurboMode(!turboMode)}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className={`relative w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all ${
//               turboMode
//                 ? "bg-gradient-to-b from-green-500 to-emerald-600 shadow-lg shadow-green-500/50"
//                 : "bg-gradient-to-b from-gray-600 to-gray-800"
//             }`}
//             style={{
//               border: "3px solid #22c55e",
//             }}
//           >
//             <Zap
//               className={`w-6 h-6 ${turboMode ? "text-white" : "text-gray-400"}`}
//             />
//             <span className="text-[10px] text-white font-bold">TURBO</span>
//           </motion.button>

//           {/* SPIN Button - Main */}
//           <motion.button
//             onClick={handleSpin}
//             disabled={
//               spinning ||
//               remainingSpins <= 0 ||
//               (initialConfig?.disabledSpin ?? false) ||
//               autoSpin
//             }
//             whileHover={{
//               scale:
//                 spinning ||
//                 remainingSpins <= 0 ||
//                 (initialConfig?.disabledSpin ?? false) ||
//                 autoSpin
//                   ? 1
//                   : 1.05,
//             }}
//             whileTap={{
//               scale:
//                 spinning ||
//                 remainingSpins <= 0 ||
//                 (initialConfig?.disabledSpin ?? false) ||
//                 autoSpin
//                   ? 1
//                   : 0.95,
//             }}
//             className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all disabled:opacity-80 disabled:cursor-not-allowed`}
//             style={{
//               background: spinning
//                 ? "linear-gradient(180deg, #14532d 0%, #052e16 100%)" // Darker green when spinning
//                 : "linear-gradient(180deg, #22c55e 0%, #16a34a 50%, #15803d 100%)",
//               border: spinning ? "6px solid #0f391e" : "6px solid #14532d",
//               boxShadow: spinning
//                 ? "none"
//                 : "0 0 30px rgba(34, 197, 94, 0.6), inset 0 -5px 20px rgba(0, 0, 0, 0.4), inset 0 5px 20px rgba(255, 255, 255, 0.2)",
//             }}
//           >
//             {/* Inner circle decoration */}
//             <div
//               className="absolute inset-2 rounded-full"
//               style={{
//                 background: spinning
//                   ? "linear-gradient(180deg, #14532d 0%, #052e16 100%)"
//                   : "linear-gradient(180deg, #4ade80 0%, #22c55e 50%, #16a34a 100%)",
//                 boxShadow: "inset 0 2px 10px rgba(255, 255, 255, 0.3)",
//               }}
//             />

//             {/* Leaf icon or loader or stop icon */}
//             <div className="relative z-10">
//               {spinning ? (
//                 <div className="flex flex-col items-center">
//                   <Loader2 className="w-10 h-10 text-white/50 animate-spin" />
//                 </div>
//               ) : (
//                 <span className="text-4xl">🌿</span>
//               )}
//             </div>
//           </motion.button>

//           {/* Auto Spin Button */}
//           <motion.button
//             onClick={toggleAutoSpin}
//             disabled={
//               spinning ||
//               remainingSpins <= 0 ||
//               (initialConfig?.disabledSpin ?? false)
//             }
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className={`relative w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all disabled:opacity-50 ${
//               autoSpin
//                 ? "bg-gradient-to-b from-green-500 to-emerald-700 shadow-lg shadow-green-500/50"
//                 : "bg-gradient-to-b from-gray-600 to-gray-800"
//             }`}
//             style={{
//               border: "3px solid #22c55e",
//             }}
//           >
//             {autoSpin ? (
//               <Pause className="w-6 h-6 text-white fill-white" />
//             ) : (
//               <Play className="w-6 h-6 text-green-400" />
//             )}
//             <span className="text-[10px] text-white font-bold">AUTO</span>
//           </motion.button>
//         </div>

//         {/* Rope decoration at bottom */}
//         <div className="mt-4 flex justify-center">
//           <div className="w-64 h-1 bg-gradient-to-r from-transparent via-green-600 to-transparent rounded-full" />
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useRouter } from "next/navigation";
// import { Loader2, X, Zap, Play, Pause } from "lucide-react";
// import { SpinQuota, UserSpinConfig } from "@/generated/prisma/client";
// import { motion } from "framer-motion";
// import { useSlotMachine } from "../hooks/use-slot-machine";
// import { SlotReel } from "./slot-reel";
// import { SlotFrame } from "./slot-frame";
// import { GameBackground } from "./game-background";
// import { GameMascots } from "./game-mascots";
// import { WinEffect } from "./win-effect";

// interface SlotGameFullscreenProps {
//   initialQuota: SpinQuota | null;
//   initialConfig: UserSpinConfig | null;
//   userId: string;
//   slotImages: Array<{ id: string; imageUrl: string; label: string }>;
// }

// export default function SlotGameFullscreen({
//   initialQuota,
//   initialConfig,
//   userId,
//   slotImages,
// }: SlotGameFullscreenProps) {
//   const router = useRouter();

//   const {
//     quota,
//     spinning,
//     slotPositions,
//     reelSpinning,
//     autoSpin,
//     lastResult,
//     showWinEffect,
//     isWinResult,
//     turboMode,
//     setTurboMode,
//     imageError,
//     setImageError,
//     remainingSpins,
//     SLOT_ITEMS,
//     handleSpin,
//     toggleAutoSpin,
//     handleReelStop,
//   } = useSlotMachine({
//     initialQuota,
//     initialConfig,
//     userId,
//     slotImages,
//   });

//   if (!quota || quota.status !== "ACTIVE") {
//     return (
//       <div
//         className="min-h-svh w-full flex items-center justify-center font-pixel"
//         style={{ background: "#FF3366" }}
//       >
//         <div className="text-center text-white p-8 bg-black border-4 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] max-w-md w-full mx-4">
//           <h2 className="text-3xl font-black mb-4 text-[#FFD028] uppercase">
//             NO ACCESS
//           </h2>
//           <p className="mb-8 text-white font-bold text-lg">
//             INSERT COIN TO CONTINUE... <br />
//             (ซื้อแพคเกจก่อนนะจ๊ะ)
//           </p>
//           <button
//             onClick={() => router.push("/spin")}
//             className="px-8 py-4 bg-[#00FF94] hover:bg-[#00cc76] text-black font-black text-xl border-4 border-black shadow-[4px_4px_0px_0px_#fff] hover:translate-y-1 hover:shadow-none transition-all uppercase w-full"
//           >
//             BUY CREDITS
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="min-h-svh w-full flex flex-col relative overflow-hidden select-none bg-[#FFD028] font-pixel"
//       style={{ backgroundColor: "#FFD028" }}
//     >
//       <div className="absolute inset-0 opacity-[0.1] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

//       <GameBackground />
//       <GameMascots />

//       <motion.button
//         onClick={() => router.push("/spin")}
//         className="absolute top-4 right-4 z-50 w-12 h-12 bg-[#FF3366] border-4 border-black shadow-[4px_4px_0px_0px_#000] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#000] transition-all flex items-center justify-center hover:bg-[#ff1a53]"
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//       >
//         <X className="w-8 h-8 text-white" strokeWidth={4} />
//       </motion.button>

//       {/* Header Logo */}
//       <div className="relative z-10 pt-4 px-4 mb-2 shrink-0">
//         <div className="flex justify-center">
//           <motion.div
//             initial={{ y: -20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             className="bg-white border-4 border-black px-6 py-2 sm:px-8 sm:py-3 shadow-[6px_6px_0px_0px_#000] rotate-[-2deg] hover:rotate-0 transition-transform cursor-default"
//           >
//             <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tighter uppercase italic drop-shadow-sm">
//               WEED <span className="text-[#00C853]">SPIN</span>
//             </h1>
//           </motion.div>
//         </div>
//       </div>

//       {/* Main Slot Machine Area */}
//       {/* 👇 เพิ่ม w-full max-w-md ตรงนี้เพื่อให้ Frame กางออก */}
//       <div className="flex-1 flex flex-col justify-center items-center px-4 py-2 relative z-0 min-h-0">
//         <div className="w-full max-w-md transform scale-100 sm:scale-100 md:scale-110 transition-transform">
//           <SlotFrame>
//             <SlotReel
//               items={SLOT_ITEMS}
//               spinning={reelSpinning[0]}
//               targetIndex={slotPositions[0]}
//               delay={turboMode ? 100 : 800}
//               onStop={() => handleReelStop(0)}
//               direction="up"
//               turboMode={turboMode}
//             />
//             <SlotReel
//               items={SLOT_ITEMS}
//               spinning={reelSpinning[1]}
//               targetIndex={slotPositions[1]}
//               delay={turboMode ? 200 : 1300}
//               onStop={() => handleReelStop(1)}
//               direction="down"
//               turboMode={turboMode}
//             />
//             <SlotReel
//               items={SLOT_ITEMS}
//               spinning={reelSpinning[2]}
//               targetIndex={slotPositions[2]}
//               delay={turboMode ? 300 : 1800}
//               onStop={() => handleReelStop(2)}
//               direction="up"
//               turboMode={turboMode}
//             />
//           </SlotFrame>
//         </div>

//         <WinEffect
//           showWinEffect={showWinEffect}
//           isWinResult={isWinResult}
//           lastResult={lastResult}
//           imageError={imageError}
//           setImageError={setImageError}
//         />
//       </div>

//       {/* Bottom Control Panel */}
//       <div className="relative z-10 w-full max-w-lg mx-auto p-4 bg-white border-t-4 border-x-4 border-black rounded-t-3xl shadow-[0px_-4px_0px_0px_rgba(0,0,0,0.1)] mt-auto shrink-0">
//         {/* Credit Display */}
//         <div className="flex justify-between items-center mb-4 sm:mb-6 bg-black p-3 sm:p-4 rounded-lg border-b-[6px] border-gray-800 relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-full h-1/2 bg-white/10 pointer-events-none"></div>

//           <div className="flex flex-col">
//             <span className="text-[#00FF94] font-bold text-[10px] tracking-widest opacity-80">
//               PLAYER CREDITS
//             </span>
//             <span className="text-[#00FF94] font-black text-2xl sm:text-3xl font-mono tracking-widest drop-shadow-[0_0_10px_rgba(0,255,148,0.5)]">
//               {String(remainingSpins).padStart(3, "0")}
//             </span>
//           </div>

//           <div className="text-[#FF3366] text-xs font-bold animate-pulse hidden sm:block">
//             INSERT COIN
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex items-end justify-between gap-3 sm:gap-6 px-1">
//           <button
//             onClick={() => setTurboMode(!turboMode)}
//             className="group flex flex-col items-center gap-2 outline-none"
//           >
//             <div
//               className={`w-12 h-12 sm:w-14 sm:h-14 border-4 border-black rounded-xl flex items-center justify-center transition-all duration-150
//                 ${
//                   turboMode
//                     ? "bg-[#FFD028] shadow-[2px_2px_0px_0px_#000] translate-y-[2px]"
//                     : "bg-gray-100 shadow-[4px_4px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_#000]"
//                 }`}
//             >
//               <Zap
//                 className={`w-6 h-6 sm:w-7 sm:h-7 ${turboMode ? "text-black fill-black" : "text-gray-400"}`}
//                 strokeWidth={3}
//               />
//             </div>
//             <span className="text-[9px] sm:text-[10px] font-black text-black uppercase tracking-wide bg-white px-1">
//               TURBO
//             </span>
//           </button>

//           <motion.button
//             onClick={handleSpin}
//             disabled={spinning || remainingSpins <= 0}
//             whileTap={{ scale: 0.95 }}
//             className={`relative w-20 h-20 sm:w-28 sm:h-28 rounded-full border-[5px] sm:border-[6px] border-black flex items-center justify-center transition-all outline-none
//                 ${
//                   spinning
//                     ? "bg-gray-500 translate-y-2 shadow-none border-gray-700"
//                     : "bg-[#00C853] -translate-y-2 shadow-[0px_6px_0px_0px_#00600f] sm:shadow-[0px_8px_0px_0px_#00600f] hover:bg-[#00e660]"
//                 }
//                 disabled:opacity-80 disabled:cursor-not-allowed
//             `}
//           >
//             <div className="absolute top-3 left-4 sm:left-5 w-6 sm:w-8 h-3 sm:h-4 bg-white/30 rounded-full -rotate-12 blur-[1px]"></div>

//             {spinning ? (
//               <Loader2
//                 className="w-8 h-8 sm:w-12 sm:h-12 text-white/80 animate-spin"
//                 strokeWidth={3}
//               />
//             ) : (
//               <span className="text-lg sm:text-2xl font-black text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)] tracking-wide">
//                 SPIN
//               </span>
//             )}
//           </motion.button>

//           <button
//             onClick={toggleAutoSpin}
//             disabled={initialConfig?.disabledSpin}
//             className="group flex flex-col items-center gap-2 outline-none"
//           >
//             <div
//               className={`w-12 h-12 sm:w-14 sm:h-14 border-4 border-black rounded-xl flex items-center justify-center transition-all duration-150
//                 ${
//                   autoSpin
//                     ? "bg-[#FF3366] shadow-[2px_2px_0px_0px_#000] translate-y-[2px] text-white"
//                     : "bg-gray-100 shadow-[4px_4px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_#000] text-gray-400"
//                 }
//                 ${initialConfig?.disabledSpin ? "opacity-50 cursor-not-allowed" : ""}
//                 `}
//             >
//               {autoSpin ? (
//                 <Pause
//                   className="w-6 h-6 sm:w-7 sm:h-7 fill-current"
//                   strokeWidth={3}
//                 />
//               ) : (
//                 <Play
//                   className="w-6 h-6 sm:w-7 sm:h-7 fill-current"
//                   strokeWidth={3}
//                 />
//               )}
//             </div>
//             <span className="text-[9px] sm:text-[10px] font-black text-black uppercase tracking-wide bg-white px-1">
//               AUTO
//             </span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useRouter } from "next/navigation";
// import { Loader2, X, Zap, Play, Pause, Volume2 } from "lucide-react"; // เพิ่ม Volume2
// import { SpinQuota, UserSpinConfig } from "@/generated/prisma/client";
// import { motion } from "framer-motion";
// import { useSlotMachine } from "../hooks/use-slot-machine";
// import { SlotReel } from "./slot-reel";
// import { SlotFrame } from "./slot-frame";
// import { GameBackground } from "./game-background";
// import { GameMascots } from "./game-mascots";
// import { WinEffect } from "./win-effect";
// import { useMemo } from "react"; // อย่าลืม import useMemo

// interface SlotGameFullscreenProps {
//   initialQuota: SpinQuota | null;
//   initialConfig: UserSpinConfig | null;
//   userId: string;
//   slotImages: Array<{ id: string; imageUrl: string; label: string }>;
// }

// export default function SlotGameFullscreen({
//   initialQuota,
//   initialConfig,
//   userId,
//   slotImages,
// }: SlotGameFullscreenProps) {
//   const router = useRouter();

//   const {
//     quota,
//     spinning,
//     slotPositions,
//     reelSpinning,
//     autoSpin,
//     lastResult,
//     showWinEffect,
//     isWinResult,
//     turboMode,
//     setTurboMode,
//     imageError,
//     setImageError,
//     remainingSpins,
//     SLOT_ITEMS,
//     handleSpin,
//     toggleAutoSpin,
//     handleReelStop,
//   } = useSlotMachine({
//     initialQuota,
//     initialConfig,
//     userId,
//     slotImages,
//   });

//   const memoizedSlotItems = useMemo(() => SLOT_ITEMS, [SLOT_ITEMS]);

//   // No Quota Screen
//   if (!quota || quota.status !== "ACTIVE") {
//     return (
//       <div className="min-h-svh w-full flex items-center justify-center font-pixel bg-[#FF3366] relative overflow-hidden">
//         <div className="absolute inset-0 opacity-[0.1] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
//         <div className="text-center text-white p-8 bg-black border-4 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] max-w-md w-full mx-4 z-10 relative">
//           <h2 className="text-3xl font-black mb-4 text-[#FFD028] uppercase animate-pulse">
//             INSERT COIN
//           </h2>
//           <p className="mb-8 text-white font-bold text-lg">
//             CREDITS EXPIRED <br />
//             (กรุณาเติมเงินเพื่อเล่นต่อ)
//           </p>
//           <button
//             onClick={() => router.push("/spin")}
//             className="px-8 py-4 bg-[#00FF94] hover:bg-[#00cc76] text-black font-black text-xl border-4 border-black shadow-[4px_4px_0px_0px_#fff] hover:translate-y-1 hover:shadow-none transition-all uppercase w-full"
//           >
//             BUY CREDITS
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="min-h-svh w-full flex flex-col relative overflow-hidden select-none bg-[#FFD028] font-pixel"
//       style={{ backgroundColor: "#FFD028" }}
//     >
//       {/* Background Pattern */}
//       <div className="absolute inset-0 opacity-[0.1] bg-[radial-gradient(#000_2px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

//       <GameBackground />
//       <GameMascots />

//       {/* 🔊 Speaker Grilles (ช่องลำโพงซ้าย-ขวา) */}
//       <div className="absolute top-4 left-4 z-0 hidden sm:grid grid-cols-3 gap-1 opacity-20">
//         {[...Array(9)].map((_, i) => (
//           <div key={i} className="w-2 h-2 bg-black rounded-full"></div>
//         ))}
//       </div>
//       <div className="absolute top-4 right-16 z-0 hidden sm:grid grid-cols-3 gap-1 opacity-20">
//         {[...Array(9)].map((_, i) => (
//           <div key={i} className="w-2 h-2 bg-black rounded-full"></div>
//         ))}
//       </div>

//       {/* Exit Button */}
//       <motion.button
//         onClick={() => router.push("/spin")}
//         className="absolute top-4 right-4 z-50 w-12 h-12 bg-[#FF3366] border-4 border-black shadow-[4px_4px_0px_0px_#000] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#000] transition-all flex items-center justify-center hover:bg-[#ff1a53]"
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//       >
//         <X className="w-8 h-8 text-white" strokeWidth={4} />
//       </motion.button>

//       {/* Header Logo (Marquee Light Style) */}
//       <div className="relative z-10 pt-6 px-4 mb-2 shrink-0">
//         <div className="flex justify-center">
//           <motion.div
//             initial={{ y: -20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             className="bg-white border-4 border-black px-6 py-3 shadow-[0_0_20px_rgba(255,255,255,0.5)] rotate-[-2deg] relative overflow-hidden"
//           >
//             {/* Glare on logo */}
//             <div className="absolute top-0 right-0 w-20 h-full bg-white/20 skew-x-[-25deg] animate-pulse"></div>

//             <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tighter uppercase italic drop-shadow-sm relative z-10">
//               WEED{" "}
//               <span className="text-[#00C853] drop-shadow-[2px_2px_0px_#000]">
//                 SPIN
//               </span>
//             </h1>
//           </motion.div>
//         </div>
//       </div>

//       {/* Main Slot Machine Area */}
//       <div className="flex-1 flex flex-col justify-center items-center px-4 py-2 relative z-0 min-h-0">
//         <div className="w-full max-w-md transform scale-100 sm:scale-100 md:scale-110 transition-transform relative">
//           {/* 📺 CRT Screen Overlay (เงาสะท้อนกระจกและเส้นสแกน) */}
//           <div className="absolute inset-0 z-20 pointer-events-none rounded-xl overflow-hidden">
//             {/* Scanlines */}
//             <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-30"></div>
//             {/* Screen Glare (Top) */}
//             <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/10 to-transparent"></div>
//             {/* Vignette (ขอบจอมืดๆ) */}
//             <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_60%,rgba(0,0,0,0.4)_100%)]"></div>
//           </div>

//           <SlotFrame>
//             <SlotReel
//               // items={SLOT_ITEMS}
//               items={memoizedSlotItems} // ใช้ memoizedSlotItems แทน SLOT_ITEMS ตรงนี้
//               spinning={reelSpinning[0]}
//               targetIndex={slotPositions[0]}
//               delay={turboMode ? 100 : 800}
//               onStop={() => handleReelStop(0)}
//               direction="up"
//               turboMode={turboMode}
//             />
//             <SlotReel
//               // items={SLOT_ITEMS}
//               items={memoizedSlotItems} // ใช้ memoizedSlotItems แทน SLOT_ITEMS ตรงนี้
//               spinning={reelSpinning[1]}
//               targetIndex={slotPositions[1]}
//               delay={turboMode ? 200 : 1300}
//               onStop={() => handleReelStop(1)}
//               direction="down"
//               turboMode={turboMode}
//             />
//             <SlotReel
//               // items={SLOT_ITEMS}
//               items={memoizedSlotItems} // ใช้ memoizedSlotItems แทน SLOT_ITEMS ตรงนี้
//               spinning={reelSpinning[2]}
//               targetIndex={slotPositions[2]}
//               delay={turboMode ? 300 : 1800}
//               onStop={() => handleReelStop(2)}
//               direction="up"
//               turboMode={turboMode}
//             />
//           </SlotFrame>
//         </div>

//         <WinEffect
//           showWinEffect={showWinEffect}
//           isWinResult={isWinResult}
//           lastResult={lastResult}
//           imageError={imageError}
//           setImageError={setImageError}
//         />
//       </div>

//       {/* Bottom Control Panel (Console) */}
//       <div className="relative z-10 w-full max-w-lg mx-auto p-4 bg-[#e5e5e5] border-t-4 border-x-4 border-black rounded-t-3xl shadow-[0px_-4px_0px_0px_rgba(0,0,0,0.2)] mt-auto shrink-0">
//         {/* Decorative Screws */}
//         <div className="absolute top-2 left-2 w-3 h-3 bg-gray-400 rounded-full border border-gray-600 flex items-center justify-center">
//           <div className="w-full h-[1px] bg-gray-600 rotate-45"></div>
//         </div>
//         <div className="absolute top-2 right-2 w-3 h-3 bg-gray-400 rounded-full border border-gray-600 flex items-center justify-center">
//           <div className="w-full h-[1px] bg-gray-600 rotate-45"></div>
//         </div>

//         {/* Credit Display & Coin Slot */}
//         <div className="flex gap-3 mb-4 sm:mb-6">
//           {/* จอ Digital */}
//           <div className="flex-1 bg-black p-3 sm:p-4 rounded-lg border-4 border-gray-700 relative overflow-hidden flex flex-col justify-center">
//             <div className="absolute top-0 right-0 w-full h-1/2 bg-white/10 pointer-events-none"></div>
//             <span className="text-[#00FF94] font-bold text-[8px] sm:text-[10px] tracking-widest opacity-80 uppercase">
//               Credits
//             </span>
//             <span className="text-[#00FF94] font-black text-2xl sm:text-3xl font-mono tracking-widest drop-shadow-[0_0_8px_rgba(0,255,148,0.8)]">
//               {String(remainingSpins).padStart(3, "0")}
//             </span>
//           </div>

//           {/* 🪙 Coin Slot (ช่องหยอดเหรียญ) */}
//           <div className="w-16 sm:w-20 bg-gray-800 rounded-lg border-4 border-black flex flex-col items-center justify-center p-1 relative">
//             <div className="w-1 h-6 bg-black mb-1 rounded-full shadow-[inset_0_0_2px_rgba(255,255,255,0.2)]"></div>
//             <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center animate-pulse border-2 border-red-800 shadow-[0_0_10px_rgba(255,0,0,0.5)]">
//               <span className="text-[8px] font-bold text-white text-center leading-none">
//                 25฿
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex items-end justify-between gap-3 sm:gap-6 px-1">
//           {/* Turbo Button */}
//           <button
//             onClick={() => setTurboMode(!turboMode)}
//             className="group flex flex-col items-center gap-1 outline-none"
//           >
//             <div
//               className={`w-12 h-12 sm:w-14 sm:h-14 border-4 border-black rounded-lg flex items-center justify-center transition-all duration-100 active:translate-y-1 active:shadow-none
//                 ${
//                   turboMode
//                     ? "bg-[#FFD028] shadow-[0_4px_0_#b5900b]"
//                     : "bg-white shadow-[0_4px_0_#999]"
//                 }`}
//             >
//               <Zap
//                 className={`w-6 h-6 ${turboMode ? "text-black fill-black" : "text-gray-400"}`}
//                 strokeWidth={3}
//               />
//             </div>
//             <span className="text-[9px] font-black text-black uppercase bg-white/50 px-1 rounded">
//               TURBO
//             </span>
//           </button>

//           {/* SPIN Button (Big Red Arcade Button) */}
//           <motion.button
//             onClick={handleSpin}
//             disabled={spinning || remainingSpins <= 0}
//             whileTap={{ scale: 0.9, y: 5 }}
//             className={`relative w-20 h-20 sm:w-28 sm:h-28 rounded-full border-[6px] border-black flex items-center justify-center outline-none
//                 ${
//                   spinning
//                     ? "bg-red-800 translate-y-2 shadow-none"
//                     : "bg-[#ff0000] -translate-y-1 shadow-[0px_8px_0px_0px_#880000] hover:bg-[#ff3333]"
//                 }
//                 disabled:opacity-80 disabled:cursor-not-allowed
//             `}
//           >
//             {/* Button Glare */}
//             <div className="absolute top-3 left-4 w-6 h-4 bg-white/30 rounded-full -rotate-12 blur-[1px]"></div>

//             {spinning ? (
//               <Loader2
//                 className="w-8 h-8 text-white animate-spin"
//                 strokeWidth={4}
//               />
//             ) : (
//               <span className="text-lg sm:text-2xl font-black text-white drop-shadow-[1px_1px_0px_rgba(0,0,0,0.8)] tracking-wide">
//                 SPIN
//               </span>
//             )}
//           </motion.button>

//           {/* Auto Button */}
//           <button
//             onClick={toggleAutoSpin}
//             disabled={initialConfig?.disabledSpin}
//             className="group flex flex-col items-center gap-1 outline-none"
//           >
//             <div
//               className={`w-12 h-12 sm:w-14 sm:h-14 border-4 border-black rounded-lg flex items-center justify-center transition-all duration-100 active:translate-y-1 active:shadow-none
//                 ${
//                   autoSpin
//                     ? "bg-[#00FF94] shadow-[0_4px_0_#00a35e] text-black"
//                     : "bg-white shadow-[0_4px_0_#999] text-gray-400"
//                 }
//                 `}
//             >
//               {autoSpin ? (
//                 <Pause className="w-6 h-6 fill-current" strokeWidth={3} />
//               ) : (
//                 <Play className="w-6 h-6 fill-current" strokeWidth={3} />
//               )}
//             </div>
//             <span className="text-[9px] font-black text-black uppercase bg-white/50 px-1 rounded">
//               AUTO
//             </span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

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
import { useMemo } from "react";

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

  // Performance Optimization: ป้องกันการส่ง Array ใหม่ไปให้ SlotReel โดยไม่จำเป็น
  const memoizedSlotItems = useMemo(() => SLOT_ITEMS, [SLOT_ITEMS]);

  // 🔥 หัวใจสำคัญ: เช็คว่าวงล้อทุกวง (0, 1, 2) หยุดหมุนครบหมดหรือยัง
  const isAllReelsStopped = useMemo(() => {
    return reelSpinning.every((isSpinning) => !isSpinning);
  }, [reelSpinning]);

  // No Quota Screen
  if (!quota || quota.status !== "ACTIVE") {
    return (
      <div className="min-h-svh w-full flex items-center justify-center font-pixel bg-[#FF3366] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.1] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="text-center text-white p-8 bg-black border-4 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] max-w-md w-full mx-4 z-10 relative">
          <h2 className="text-3xl font-black mb-4 text-[#FFD028] uppercase animate-pulse">
            INSERT COIN
          </h2>
          <p className="mb-8 text-white font-bold text-lg">
            CREDITS EXPIRED <br />
            (กรุณาเติมเงินเพื่อเล่นต่อ)
          </p>
          <button
            onClick={() => router.push("/spin")}
            className="px-8 py-4 bg-[#00FF94] hover:bg-[#00cc76] text-black font-black text-xl border-4 border-black shadow-[4px_4px_0px_0px_#fff] hover:translate-y-1 hover:shadow-none transition-all uppercase w-full"
          >
            BUY CREDITS
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-svh w-full flex flex-col relative overflow-hidden select-none bg-[#FFD028] font-pixel"
      style={{ backgroundColor: "#FFD028" }}
    >
      <div className="absolute inset-0 opacity-[0.1] bg-[radial-gradient(#000_2px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      <GameBackground />
      <GameMascots />

      {/* Speaker Grilles */}
      <div className="absolute top-4 left-4 z-0 hidden sm:grid grid-cols-3 gap-1 opacity-20">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="w-2 h-2 bg-black rounded-full"></div>
        ))}
      </div>
      <div className="absolute top-4 right-16 z-0 hidden sm:grid grid-cols-3 gap-1 opacity-20">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="w-2 h-2 bg-black rounded-full"></div>
        ))}
      </div>

      {/* Exit Button */}
      <motion.button
        onClick={() => router.push("/spin")}
        className="absolute top-4 right-4 z-50 w-12 h-12 bg-[#FF3366] border-4 border-black shadow-[4px_4px_0px_0px_#000] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#000] transition-all flex items-center justify-center hover:bg-[#ff1a53]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <X className="w-8 h-8 text-white" strokeWidth={4} />
      </motion.button>

      {/* Header Logo */}
      <div className="relative z-10 pt-6 px-4 mb-2 shrink-0">
        <div className="flex justify-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white border-4 border-black px-6 py-3 shadow-[0_0_20px_rgba(255,255,255,0.5)] rotate-[-2deg] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-full bg-white/20 skew-x-[-25deg] animate-pulse"></div>
            <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tighter uppercase italic drop-shadow-sm relative z-10">
              WEED{" "}
              <span className="text-[#00C853] drop-shadow-[2px_2px_0px_#000]">
                SPIN
              </span>
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Main Slot Machine Area */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-2 relative z-0 min-h-0">
        <div className="w-full max-w-md transform scale-100 sm:scale-100 md:scale-110 transition-transform relative">
          <div className="absolute inset-0 z-20 pointer-events-none rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-30"></div>
            <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/10 to-transparent"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_60%,rgba(0,0,0,0.4)_100%)]"></div>
          </div>

          <SlotFrame>
            <SlotReel
              items={memoizedSlotItems}
              spinning={reelSpinning[0]}
              targetIndex={slotPositions[0]}
              delay={turboMode ? 100 : 800}
              onStop={() => handleReelStop(0)}
              direction="up"
              turboMode={turboMode}
            />
            <SlotReel
              items={memoizedSlotItems}
              spinning={reelSpinning[1]}
              targetIndex={slotPositions[1]}
              delay={turboMode ? 200 : 1300}
              onStop={() => handleReelStop(1)}
              direction="down"
              turboMode={turboMode}
            />
            <SlotReel
              items={memoizedSlotItems}
              spinning={reelSpinning[2]}
              targetIndex={slotPositions[2]}
              delay={turboMode ? 300 : 1800}
              onStop={() => handleReelStop(2)}
              direction="up"
              turboMode={turboMode}
            />
          </SlotFrame>
        </div>

        {/* 🔥 แก้ไข WinEffect ให้แสดงผลเฉพาะตอนหยุดครบทุกวงแล้วเท่านั้น */}
        <WinEffect
          showWinEffect={showWinEffect && isAllReelsStopped}
          isWinResult={isWinResult}
          lastResult={lastResult}
          imageError={imageError}
          setImageError={setImageError}
        />
      </div>

      {/* Bottom Control Panel */}
      <div className="relative z-10 w-full max-w-lg mx-auto p-4 bg-[#e5e5e5] border-t-4 border-x-4 border-black rounded-t-3xl shadow-[0px_-4px_0px_0px_rgba(0,0,0,0.2)] mt-auto shrink-0">
        {/* Credit Display & Buttons ... (ส่วนที่เหลือคงเดิม) */}
        <div className="flex gap-3 mb-4 sm:mb-6">
          <div className="flex-1 bg-black p-3 sm:p-4 rounded-lg border-4 border-gray-700 relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-full h-1/2 bg-white/10 pointer-events-none"></div>
            <span className="text-[#00FF94] font-bold text-[8px] sm:text-[10px] tracking-widest opacity-80 uppercase">
              Credits
            </span>
            <span className="text-[#00FF94] font-black text-2xl sm:text-3xl font-mono tracking-widest drop-shadow-[0_0_8px_rgba(0,255,148,0.8)]">
              {String(remainingSpins).padStart(3, "0")}
            </span>
          </div>
          <div className="w-16 sm:w-20 bg-gray-800 rounded-lg border-4 border-black flex flex-col items-center justify-center p-1 relative">
            <div className="w-1 h-6 bg-black mb-1 rounded-full shadow-[inset_0_0_2px_rgba(255,255,255,0.2)]"></div>
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center animate-pulse border-2 border-red-800 shadow-[0_0_10px_rgba(255,0,0,0.5)]">
              <span className="text-[8px] font-bold text-white text-center leading-none">
                25฿
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-3 sm:gap-6 px-1">
          <button
            onClick={() => setTurboMode(!turboMode)}
            className="group flex flex-col items-center gap-1 outline-none"
          >
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 border-4 border-black rounded-lg flex items-center justify-center transition-all duration-100 active:translate-y-1 active:shadow-none ${turboMode ? "bg-[#FFD028] shadow-[0_4px_0_#b5900b]" : "bg-white shadow-[0_4px_0_#999]"}`}
            >
              <Zap
                className={`w-6 h-6 ${turboMode ? "text-black fill-black" : "text-gray-400"}`}
                strokeWidth={3}
              />
            </div>
            <span className="text-[9px] font-black text-black uppercase bg-white/50 px-1 rounded">
              TURBO
            </span>
          </button>

          <motion.button
            onClick={handleSpin}
            disabled={spinning || remainingSpins <= 0}
            whileTap={{ scale: 0.9, y: 5 }}
            className={`relative w-20 h-20 sm:w-28 sm:h-28 rounded-full border-[6px] border-black flex items-center justify-center outline-none ${spinning ? "bg-red-800 translate-y-2 shadow-none" : "bg-[#ff0000] -translate-y-1 shadow-[0px_8px_0px_0px_#880000] hover:bg-[#ff3333]"} disabled:opacity-80 disabled:cursor-not-allowed`}
          >
            <div className="absolute top-3 left-4 w-6 h-4 bg-white/30 rounded-full -rotate-12 blur-[1px]"></div>
            {spinning ? (
              <Loader2
                className="w-8 h-8 text-white animate-spin"
                strokeWidth={4}
              />
            ) : (
              <span className="text-lg sm:text-2xl font-black text-white drop-shadow-[1px_1px_0px_rgba(0,0,0,0.8)] tracking-wide">
                SPIN
              </span>
            )}
          </motion.button>

          <button
            onClick={toggleAutoSpin}
            disabled={initialConfig?.disabledSpin}
            className="group flex flex-col items-center gap-1 outline-none"
          >
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 border-4 border-black rounded-lg flex items-center justify-center transition-all duration-100 active:translate-y-1 active:shadow-none ${autoSpin ? "bg-[#00FF94] shadow-[0_4px_0_#00a35e] text-black" : "bg-white shadow-[0_4px_0_#999] text-gray-400"}`}
            >
              {autoSpin ? (
                <Pause className="w-6 h-6 fill-current" strokeWidth={3} />
              ) : (
                <Play className="w-6 h-6 fill-current" strokeWidth={3} />
              )}
            </div>
            <span className="text-[9px] font-black text-black uppercase bg-white/50 px-1 rounded">
              AUTO
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
