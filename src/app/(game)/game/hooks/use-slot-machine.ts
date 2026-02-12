"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useTransition,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { performSpinAction } from "../actions";
import { SpinQuota, UserSpinConfig } from "@/generated/prisma/client";
import { SlotItem, DEFAULT_SYMBOLS, FALLBACK_ICONS } from "../constants";

interface UseSlotMachineProps {
  initialQuota: SpinQuota | null;
  initialConfig: UserSpinConfig | null;
  userId: string;
  slotImages: Array<{ id: string; imageUrl: string; label: string }>;
}

export const useSlotMachine = ({
  initialQuota,
  initialConfig,
  userId,
  slotImages,
}: UseSlotMachineProps) => {
  const router = useRouter();
  const [quota, setQuota] = useState(initialQuota);
  const [config, setConfig] = useState(initialConfig);
  const [, startTransition] = useTransition();
  const [spinning, setSpinning] = useState(false);

  // Initialize with fixed values to prevent hydration mismatch
  // Will be randomized in useEffect after mount
  const [slotPositions, setSlotPositions] = useState<[number, number, number]>([
    0, 0, 0,
  ]);
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
  const [turboMode, setTurboMode] = useState(false);
  const [imageError, setImageError] = useState(false);

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Map slot images with fallback icons for missing/broken images
  const SLOT_ITEMS: SlotItem[] = useMemo(() => {
    return slotImages.length > 0
      ? slotImages.map((item, idx) => ({
          ...item,
          // Use fallback icon if label is "?" or empty
          label:
            !item.label || item.label === "?"
              ? FALLBACK_ICONS[idx % FALLBACK_ICONS.length]
              : item.label,
        }))
      : DEFAULT_SYMBOLS.map((emoji, i) => ({
          id: String(i),
          imageUrl: "",
          label: emoji,
        }));
  }, [slotImages]);

  const remainingSpins = quota ? quota.total - quota.used : 0;

  // Initialize slot positions with random values after mount (client-side only)
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
    };
  }, []);

  useEffect(() => {
    autoSpinRef.current = autoSpin;
  }, [autoSpin]);

  useEffect(() => {
    if (autoSpin && !spinning && remainingSpins > 0) {
      const timer = setTimeout(
        () => {
          if (autoSpinRef.current) {
            handleSpin();
          }
        },
        turboMode ? 500 : 2000,
      );
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

  const handleReelStop = useCallback((index: number) => {
    setReelSpinning((prev) => {
      const newState = [...prev] as [boolean, boolean, boolean];
      newState[index] = false;
      return newState;
    });
  }, []);

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

    startTransition(async () => {
      try {
        const result = await performSpinAction();

        animationTimeoutRef.current = setTimeout(
          async () => {
            // Stop animations
            setSpinning(false);
            setReelSpinning([false, false, false]);

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
              if (
                finalPositions[0] === finalPositions[1] &&
                finalPositions[1] === finalPositions[2]
              ) {
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
                spinCount:
                  currentResult.result === "WIN" ? 0 : config.spinCount + 1,
              });
            }

            if (result.data!.remainingSpins <= 0) {
              setAutoSpin(false);
            }
          },
          turboMode ? 800 : 2400,
        ); // Wait for animation
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

  return {
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
  };
};
