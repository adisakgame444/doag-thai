"use client";

import { useState, useTransition, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2,
  X,
  Zap,
  Play,
  Square,
  Pause
} from "lucide-react";
import { performSpinAction } from "./actions";
import { SpinQuota, UserSpinConfig } from "@/generated/prisma/client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface SlotGameFullscreenProps {
  initialQuota: SpinQuota | null;
  initialConfig: UserSpinConfig | null;
  userId: string;
  slotImages: Array<{ id: string; imageUrl: string; label: string }>;
}

interface SlotItem {
  id: string;
  imageUrl: string;
  label: string;
}

const SYMBOL_HEIGHT = 68; // Height of each slot item

// Reel component using POC technique with requestAnimationFrame
interface ReelProps {
  items: SlotItem[];
  spinning: boolean;
  targetIndex: number;
  onStop: () => void;
  delay: number;
  direction: "up" | "down";
  turboMode: boolean;
}

const Reel = ({ items, spinning, targetIndex, onStop, delay, direction, turboMode }: ReelProps) => {
  // Use items from the middle round (round 2 of 5) to ensure full coverage
  const centerRoundOffset = items.length * 2;
  const initialOffset = (centerRoundOffset + targetIndex) * SYMBOL_HEIGHT;
  
  const [offset, setOffset] = useState(initialOffset);
  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const hasStoppedRef = useRef(false);
  const totalHeight = items.length * SYMBOL_HEIGHT * 5;

  const animate = useCallback((time: number) => {
    if (!startTimeRef.current) startTimeRef.current = time;
    const elapsed = time - startTimeRef.current;

    if (spinning || (elapsed < delay)) {
      setOffset(prev => {
        const speed = turboMode ? 60 : 40;
        if (direction === "down") {
          return (prev + speed) % totalHeight;
        } else {
          let next = prev - speed;
          if (next < 0) next = totalHeight + next;
          return next;
        }
      });
      requestRef.current = requestAnimationFrame(animate);
    } else if (!hasStoppedRef.current) {
      const finalPos = (centerRoundOffset + targetIndex) * SYMBOL_HEIGHT;
      setOffset(finalPos);
      hasStoppedRef.current = true;
      onStop();
    }
  }, [spinning, targetIndex, delay, onStop, direction, totalHeight, turboMode, centerRoundOffset]);

  useEffect(() => {
    if (spinning) {
      hasStoppedRef.current = false;
      startTimeRef.current = null;
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [spinning, animate]);

  // When not spinning, snap to target position
  useEffect(() => {
    if (!spinning) {
      setOffset((centerRoundOffset + targetIndex) * SYMBOL_HEIGHT);
    }
  }, [targetIndex, spinning, centerRoundOffset]);

  // Repeat items enough times to fill the visible area (340px / 68px ≈ 5 visible items)
  // We use 5x repetition to ensure seamless looping and no empty spaces
  const repeatedItems = [...items, ...items, ...items, ...items, ...items];

  return (
    <div 
      className="relative flex-1 max-w-[110px] h-[340px] rounded-xl overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0a2a15 0%, #051a0d 50%, #0a2a15 100%)',
        border: '3px solid #2d5a3d',
        boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(34, 197, 94, 0.2)'
      }}
    >
      {/* Gradient overlays for depth */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/60 to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent z-20 pointer-events-none" />
      
      {/* Win line indicator */}
      <div className="absolute top-1/2 left-0 right-0 h-[72px] -translate-y-1/2 border-y-2 border-green-400/50 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-green-500/10" />
      </div>

      {/* Reel content */}
      <div 
        className="absolute w-full flex flex-col"
        style={{ 
          transform: `translateY(-${offset}px)`,
          top: `${SYMBOL_HEIGHT * 2}px`, // Center the items
          transition: !spinning ? 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none'
        }}
      >
        {repeatedItems.map((item, idx) => {
          // Determine if this is the center item when stopped
          const itemPosition = idx % items.length;
          const isCenterItem = !spinning && itemPosition === targetIndex;
          
          return (
            <div 
              key={`${item.id}-${idx}`}
              className={`w-full flex items-center justify-center p-1 flex-shrink-0 ${
                isCenterItem ? 'scale-105' : spinning ? '' : 'opacity-70 scale-90'
              }`}
              style={{ height: `${SYMBOL_HEIGHT}px` }}
            >
              <div 
                className="w-full h-full rounded-lg flex items-center justify-center"
                style={{
                  background: isCenterItem 
                    ? 'linear-gradient(180deg, rgba(34, 197, 94, 0.4) 0%, rgba(22, 101, 52, 0.6) 100%)'
                    : 'linear-gradient(180deg, rgba(20, 83, 45, 0.3) 0%, rgba(5, 46, 22, 0.5) 100%)',
                  border: isCenterItem ? '2px solid rgba(74, 222, 128, 0.5)' : '1px solid rgba(34, 197, 94, 0.2)',
                  boxShadow: isCenterItem ? '0 0 15px rgba(34, 197, 94, 0.4)' : 'none'
                }}
              >
                {/* Show image if valid URL exists, otherwise show emoji label */}
                {item.imageUrl && !item.imageUrl.includes('placehold.co') ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.label}
                    width={50}
                    height={50}
                    className="object-contain drop-shadow-lg"
                    unoptimized
                  />
                ) : (
                  <span className="text-4xl drop-shadow-lg filter drop-shadow-[0_0_10px_rgba(74,222,128,0.6)]">
                    {item.label}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/20 via-green-500/5 to-black/20 z-30" />
    </div>
  );
};

const DEFAULT_SYMBOLS = ["🌿", "🍃", "✨", "💚", "🌱", "⭐", "🎯", "🎰"];

export default function SlotGameFullscreen({
  initialQuota,
  initialConfig,
  userId,
  slotImages,
}: SlotGameFullscreenProps) {
  const router = useRouter();
  const [quota, setQuota] = useState(initialQuota);
  const [config, setConfig] = useState(initialConfig);
  const [, startTransition] = useTransition();
  const [spinning, setSpinning] = useState(false);
  // Initialize with fixed values to prevent hydration mismatch
  // Will be randomized in useEffect after mount
  const [slotPositions, setSlotPositions] = useState<[number, number, number]>([0, 0, 0]);
  const [reelSpinning, setReelSpinning] = useState([false, false, false]);
  const [autoSpin, setAutoSpin] = useState(false);
  const autoSpinRef = useRef(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastResult, setLastResult] = useState<{
    result: "WIN" | "LOSE";
    prizeName: string | null;
    prizeImageUrl: string | null;
    remainingSpins: number;
    updatedConfig?: UserSpinConfig;
  } | null>(null);
  const [showWinEffect, setShowWinEffect] = useState(false);
  const [isWinResult, setIsWinResult] = useState(false);
  const [betAmount] = useState(12.00);
  const [turboMode, setTurboMode] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Extended reels for smooth scrolling animation (each column shows multiple items)
  const [reelOffsets, setReelOffsets] = useState([0, 0, 0]);
  const reelRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const animationFrameRef = useRef<number[]>([0, 0, 0]);

  // Fallback icons when image is missing or label is "?"
  const FALLBACK_ICONS = ["🌿", "🍃", "✨", "💚", "🌱", "⭐", "🎯", "🎰", "💎", "🍀", "🔔", "7️⃣"];

  // Map slot images with fallback icons for missing/broken images
  const SLOT_ITEMS: SlotItem[] = slotImages.length > 0 
    ? slotImages.map((item, idx) => ({
        ...item,
        // Use fallback icon if label is "?" or empty
        label: (!item.label || item.label === "?") 
          ? FALLBACK_ICONS[idx % FALLBACK_ICONS.length] 
          : item.label
      }))
    : DEFAULT_SYMBOLS.map((emoji, i) => ({ 
        id: String(i), 
        imageUrl: "", 
        label: emoji 
      }));

  const remainingSpins = quota ? quota.total - quota.used : 0;
  const balance = remainingSpins * 1000; // Mock balance display
  
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize slot positions with random values after mount (client-side only)
  // This prevents hydration mismatch errors
  useEffect(() => {
    if (!isInitialized) {
      const itemCount = SLOT_ITEMS.length;
      setSlotPositions([
        Math.floor(Math.random() * itemCount),
        Math.floor(Math.random() * itemCount),
        Math.floor(Math.random() * itemCount),
      ]);
      setIsInitialized(true);
    }
  }, [SLOT_ITEMS.length, isInitialized]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      animationFrameRef.current.forEach(id => cancelAnimationFrame(id));
    };
  }, []);

  useEffect(() => {
    autoSpinRef.current = autoSpin;
  }, [autoSpin]);

  useEffect(() => {
    if (autoSpin && !spinning && remainingSpins > 0) {
      const timer = setTimeout(() => {
        if (autoSpinRef.current) {
          handleSpin();
        }
      }, turboMode ? 1000 : 2000);
      return () => clearTimeout(timer);
    }
  }, [autoSpin, spinning, remainingSpins, turboMode]);

  const toggleAutoSpin = () => {
    if (remainingSpins <= 0) {
      toast.error("สิทธิ์หมุนหมดแล้ว~ 🥺");
      return;
    }
    if (config?.disabledSpin) {
      toast.error("ปิดใช้งานอยู่ค่ะ 😢");
      return;
    }
    
    const newAutoSpin = !autoSpin;
    setAutoSpin(newAutoSpin);
    
    if (newAutoSpin) {
      toast.success("หมุนอัตโนมัติเริ่มแล้ว~ ✨", { icon: "🌿" });
      if (!spinning) {
        handleSpin();
      }
    }
  };

  // Handle when a reel stops spinning
  const handleReelStop = useCallback((index: number) => {
    setReelSpinning(prev => {
      const newState = [...prev] as [boolean, boolean, boolean];
      newState[index] = false;
      return newState;
    });
  }, []);

  // Animate reel spinning - direction: 1 = up, -1 = down
  const animateReel = useCallback((reelIndex: number, direction: number, duration: number) => {
    const startTime = Date.now();
    const speed = direction * 30; // pixels per frame
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < duration) {
        setReelOffsets(prev => {
          const newOffsets = [...prev];
          newOffsets[reelIndex] = (prev[reelIndex] + speed) % (SLOT_ITEMS.length * 120);
          return newOffsets;
        });
        animationFrameRef.current[reelIndex] = requestAnimationFrame(animate);
      }
    };
    animate();
  }, [SLOT_ITEMS.length]);

  const handleSpin = () => {
    if (spinning) {
      return;
    }

    if (remainingSpins <= 0) {
      setAutoSpin(false);
      toast.error("เครดิตหมดแล้ว ซื้อเพิ่มน้า~ 🛒");
      router.push("/spin");
      return;
    }

    if (config?.disabledSpin) {
      setAutoSpin(false);
      toast.error("ปิดใช้งานอยู่ค่ะ 🔒");
      return;
    }

    // Reset states
    setShowWinEffect(false);
    setImageError(false);
    setSpinning(true);
    setReelSpinning([true, true, true]);

    // Start spinning animations with different directions:
    // Reel 1: Up (direction 1)
    // Reel 2: Down (direction -1)
    // Reel 3: Up (direction 1)
    const spinDuration = turboMode ? 800 : 1500;
    
    animateReel(0, 1, spinDuration);      // Column 1: Up
    animateReel(1, -1, spinDuration);     // Column 2: Down  
    animateReel(2, 1, spinDuration);      // Column 3: Up

    startTransition(async () => {
      try {
        const result = await performSpinAction();

        animationTimeoutRef.current = setTimeout(async () => {

          // Stop animations
          animationFrameRef.current.forEach(id => cancelAnimationFrame(id));
          
          setSpinning(false);
          setReelSpinning([false, false, false]);
          setReelOffsets([0, 0, 0]);
          
          if (!result.success) {
            setAutoSpin(false);
            toast.error(result.message || "หมุนไม่ได้น้า~ 😢");
            router.refresh();
            return;
          }

          let finalPositions: [number, number, number];
          let currentResult = result.data!;

          if (currentResult.result === "WIN") {
            const winIndex = Math.floor(Math.random() * SLOT_ITEMS.length);
            finalPositions = [winIndex, winIndex, winIndex];
            // Show win animation
            setIsWinResult(true);
            setShowWinEffect(true);
            setTimeout(() => {
              setShowWinEffect(false);
              setIsWinResult(false);
            }, 3000);
          } else {
            finalPositions = [
              Math.floor(Math.random() * SLOT_ITEMS.length),
              Math.floor(Math.random() * SLOT_ITEMS.length),
              Math.floor(Math.random() * SLOT_ITEMS.length),
            ];
            if (finalPositions[0] === finalPositions[1] && finalPositions[1] === finalPositions[2]) {
              finalPositions[2] = (finalPositions[2] + 1) % SLOT_ITEMS.length;
            }
            // Show lose animation
            setIsWinResult(false);
            setShowWinEffect(true);
            setTimeout(() => setShowWinEffect(false), 3000);
          }

          setSlotPositions(finalPositions);
          
          setLastResult(currentResult);
          
          if (quota && result.data) {
            setQuota({
              ...quota,
              used: quota.used + 1,
            });
          }

          if (config && result.data) {
            setConfig({
              ...config,
              spinCount: currentResult.result === "WIN" ? 0 : config.spinCount + 1,
            });
          }

          if (result.data!.remainingSpins <= 0) {
            setAutoSpin(false); 
          }

        }, turboMode ? 1200 : 2400); // Wait for animation
      } catch (error) {
        setSpinning(false);
        setReelSpinning([false, false, false]);
        setAutoSpin(false);
        console.error("Spin error:", error);
        toast.error("มีปัญหานิดหน่อย~ 😅");
        router.refresh();
      }
    });
  };

  // Generate multiple items for each reel to create scrolling effect
  const getReelItems = (reelIndex: number) => {
    const items = [];
    const displayCount = 5; // Show 5 rows
    const centerIndex = slotPositions[reelIndex];
    
    for (let i = -2; i <= 2; i++) {
      const itemIndex = (centerIndex + i + SLOT_ITEMS.length) % SLOT_ITEMS.length;
      items.push({
        ...SLOT_ITEMS[itemIndex],
        key: `${reelIndex}-${i}`,
        isCenter: i === 0
      });
    }
    return items;
  };

  // No quota - show redirect
  if (!quota || quota.status !== "ACTIVE") {
    return (
      <div 
        className="min-h-svh w-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(180deg, #052e16 0%, #14532d 50%, #052e16 100%)'
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
        background: 'linear-gradient(180deg, #052e16 0%, #14532d 30%, #166534 50%, #14532d 70%, #052e16 100%)'
      }}
    >
      {/* Cannabis Leaf Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top decorative cannabis leaves */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-green-900/40 to-transparent" />
        <div className="absolute top-0 right-0 opacity-60">
          <div className="text-6xl">🌿</div>
        </div>
        <div className="absolute top-10 right-20 opacity-40">
          <div className="text-4xl">🍃</div>
        </div>
        <div className="absolute top-5 left-10 opacity-50">
          <div className="text-5xl">🌿</div>
        </div>
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 opacity-20 animate-pulse">
          <div className="text-3xl">✨</div>
        </div>
        <div className="absolute top-1/3 right-1/3 opacity-30 animate-pulse delay-500">
          <div className="text-2xl">💚</div>
        </div>
        <div className="absolute bottom-1/4 left-1/3 opacity-25 animate-pulse delay-1000">
          <div className="text-3xl">🌱</div>
        </div>
      </div>

      {/* Left Mascot - Desktop Only */}
      <div className="hidden lg:block absolute left-4 xl:left-12 top-1/2 -translate-y-1/2 z-20">
        <motion.div
          animate={{ 
            y: [0, -10, 0],
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
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
              style={{ filter: 'contrast(1.05) saturate(1.1)' }}
              priority
              unoptimized
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
            delay: 0.5
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
              style={{ filter: 'contrast(1.05) saturate(1.1)' }}
              priority
              unoptimized
            />
          </div>
        </motion.div>
      </div>

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
          <motion.div 
            className="relative"
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(234, 179, 8, 0.3)',
                '0 0 40px rgba(234, 179, 8, 0.5)',
                '0 0 20px rgba(234, 179, 8, 0.3)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {/* Outer golden frame */}
            <div 
              className="px-10 py-3 rounded-xl text-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, #1a472a 0%, #0d2818 100%)',
                border: '3px solid transparent',
                borderImage: 'linear-gradient(180deg, #fcd34d, #b45309, #fcd34d) 1',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Inner glow line */}
              <div className="absolute inset-0 rounded-xl" style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(34, 197, 94, 0.1) 50%, transparent 100%)'
              }} />
              
              <div className="relative flex items-center gap-3">
                <span className="text-2xl">💎</span>
                <span 
                  className="font-black text-2xl tracking-[0.2em] uppercase"
                  style={{ 
                    background: 'linear-gradient(180deg, #fef3c7 0%, #fcd34d 40%, #b45309 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    filter: 'drop-shadow(0 0 10px rgba(234, 179, 8, 0.5))'
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
        {/* Slot Machine Frame - Premium Design */}
        <div className="relative mx-auto w-full max-w-lg">
          
          {/* Outer Frame with Gold Border */}
          <div 
            className="relative rounded-3xl p-1"
            style={{
              background: 'linear-gradient(180deg, #fcd34d 0%, #b45309 50%, #fcd34d 100%)',
              boxShadow: '0 0 60px rgba(234, 179, 8, 0.3), 0 20px 40px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Inner dark container */}
            <div 
              className="relative rounded-[22px] overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, #0f3d1f 0%, #052e16 50%, #041f10 100%)',
                boxShadow: 'inset 0 2px 20px rgba(0, 0, 0, 0.8), inset 0 -2px 20px rgba(0, 0, 0, 0.5)'
              }}
            >
              {/* Top light strip */}
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 rounded-b-full z-20"
                style={{
                  background: 'linear-gradient(90deg, transparent, #22c55e, transparent)',
                  boxShadow: '0 0 20px rgba(34, 197, 94, 0.8)'
                }}
              />
              
              {/* Side accent lights */}
              <div className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full z-20"
                style={{
                  background: 'linear-gradient(180deg, transparent, #22c55e, transparent)',
                  boxShadow: '0 0 15px rgba(34, 197, 94, 0.6)'
                }}
              />
              <div className="absolute right-0 top-1/4 bottom-1/4 w-1 rounded-l-full z-20"
                style={{
                  background: 'linear-gradient(180deg, transparent, #22c55e, transparent)',
                  boxShadow: '0 0 15px rgba(34, 197, 94, 0.6)'
                }}
              />

              {/* Reels Container */}
              <div className="relative p-6">
                {/* Glass overlay effect */}
                <div className="absolute inset-6 rounded-xl pointer-events-none z-10"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.2) 100%)',
                    borderTop: '1px solid rgba(255,255,255,0.1)'
                  }}
                />
                
                {/* Reels background */}
                <div 
                  className="relative rounded-xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(180deg, #0a1f12 0%, #071a0e 100%)',
                    boxShadow: 'inset 0 4px 20px rgba(0, 0, 0, 0.8)'
                  }}
                >
                  {/* The 3 Reels */}
                  <div className="flex justify-center p-4 gap-3">
                    <Reel 
                      items={SLOT_ITEMS}
                      spinning={reelSpinning[0]}
                      targetIndex={slotPositions[0]}
                      delay={turboMode ? 400 : 800}
                      onStop={() => handleReelStop(0)}
                      direction="up"
                      turboMode={turboMode}
                    />
                    <Reel 
                      items={SLOT_ITEMS}
                      spinning={reelSpinning[1]}
                      targetIndex={slotPositions[1]}
                      delay={turboMode ? 700 : 1300}
                      onStop={() => handleReelStop(1)}
                      direction="down"
                      turboMode={turboMode}
                    />
                    <Reel 
                      items={SLOT_ITEMS}
                      spinning={reelSpinning[2]}
                      targetIndex={slotPositions[2]}
                      delay={turboMode ? 1000 : 1800}
                      onStop={() => handleReelStop(2)}
                      direction="up"
                      turboMode={turboMode}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom light strip */}
              <div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1 rounded-t-full z-20"
                style={{
                  background: 'linear-gradient(90deg, transparent, #22c55e, transparent)',
                  boxShadow: '0 0 20px rgba(34, 197, 94, 0.8)'
                }}
              />
            </div>
          </div>

          {/* Corner Gems - Subtle and elegant */}
          <div className="absolute -top-2 -left-2 w-5 h-5 rounded-full"
            style={{
              background: 'radial-gradient(circle, #22c55e 0%, #166534 100%)',
              boxShadow: '0 0 10px rgba(34, 197, 94, 0.8)'
            }}
          />
          <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full"
            style={{
              background: 'radial-gradient(circle, #22c55e 0%, #166534 100%)',
              boxShadow: '0 0 10px rgba(34, 197, 94, 0.8)'
            }}
          />
          <div className="absolute -bottom-2 -left-2 w-5 h-5 rounded-full"
            style={{
              background: 'radial-gradient(circle, #22c55e 0%, #166534 100%)',
              boxShadow: '0 0 10px rgba(34, 197, 94, 0.8)'
            }}
          />
          <div className="absolute -bottom-2 -right-2 w-5 h-5 rounded-full"
            style={{
              background: 'radial-gradient(circle, #22c55e 0%, #166534 100%)',
              boxShadow: '0 0 10px rgba(34, 197, 94, 0.8)'
            }}
          />
        </div>

        {/* Win Effect Overlay */}
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
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 0.5,
                  repeat: Infinity
                }}
                className="text-center"
              >
                {isWinResult ? (
                  <>
                    <div className="text-yellow-400 text-6xl font-black mb-2" style={{ textShadow: '0 0 30px rgba(234, 179, 8, 0.8)' }}>
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
                           unoptimized
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
                    <div className="text-red-400 text-6xl font-black mb-2" style={{ textShadow: '0 0 30px rgba(239, 68, 68, 0.8)' }}>
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
      </div>

      {/* Bottom Control Panel */}
      <div 
        className="relative z-10 px-4 pb-6"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(5, 46, 22, 0.9) 30%)'
        }}
      >
        {/* Remaining Spins - Centered */}
        <div className="flex justify-center items-center mb-4">
          <div 
            className="flex items-center gap-3 px-6 py-3 rounded-xl"
            style={{
              background: 'linear-gradient(180deg, #0a2a15 0%, #052e16 100%)',
              border: '2px solid #22c55e',
              boxShadow: '0 0 15px rgba(34, 197, 94, 0.3)'
            }}
          >
            <span className="text-2xl">🌿</span>
            <span className="text-green-400 font-bold text-2xl">{remainingSpins}</span>
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
                ? 'bg-gradient-to-b from-green-500 to-emerald-600 shadow-lg shadow-green-500/50' 
                : 'bg-gradient-to-b from-gray-600 to-gray-800'
            }`}
            style={{
              border: '3px solid #22c55e'
            }}
          >
            <Zap className={`w-6 h-6 ${turboMode ? 'text-white' : 'text-gray-400'}`} />
            <span className="text-[10px] text-white font-bold">TURBO</span>
          </motion.button>



          {/* SPIN Button - Main */}
          <motion.button
            onClick={handleSpin}
            disabled={spinning || remainingSpins <= 0 || config?.disabledSpin || autoSpin}
            whileHover={{ scale: (spinning || remainingSpins <= 0 || config?.disabledSpin || autoSpin) ? 1 : 1.05 }}
            whileTap={{ scale: (spinning || remainingSpins <= 0 || config?.disabledSpin || autoSpin) ? 1 : 0.95 }}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all disabled:opacity-80 disabled:cursor-not-allowed`}
            style={{
              background: spinning 
                ? 'linear-gradient(180deg, #14532d 0%, #052e16 100%)' // Darker green when spinning
                : 'linear-gradient(180deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
              border: spinning ? '6px solid #0f391e' : '6px solid #14532d',
              boxShadow: spinning 
                ? 'none' 
                : '0 0 30px rgba(34, 197, 94, 0.6), inset 0 -5px 20px rgba(0, 0, 0, 0.4), inset 0 5px 20px rgba(255, 255, 255, 0.2)'
            }}
          >
            {/* Inner circle decoration */}
            <div 
              className="absolute inset-2 rounded-full"
              style={{
                background: spinning
                  ? 'linear-gradient(180deg, #14532d 0%, #052e16 100%)' 
                  : 'linear-gradient(180deg, #4ade80 0%, #22c55e 50%, #16a34a 100%)',
                boxShadow: 'inset 0 2px 10px rgba(255, 255, 255, 0.3)'
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
            disabled={spinning || remainingSpins <= 0 || config?.disabledSpin}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all disabled:opacity-50 ${
              autoSpin 
                ? 'bg-gradient-to-b from-green-500 to-emerald-700 shadow-lg shadow-green-500/50' 
                : 'bg-gradient-to-b from-gray-600 to-gray-800'
            }`}
            style={{
              border: '3px solid #22c55e'
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
