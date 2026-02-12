"use client";

import { useRef, useEffect, useCallback, memo } from "react";
import Image from "next/image";
import { SlotItem, SYMBOL_HEIGHT } from "../constants";

interface ReelProps {
  items: SlotItem[];
  spinning: boolean;
  targetIndex: number;
  onStop: () => void;
  delay: number;
  direction: "up" | "down";
  turboMode: boolean;
}

export const SlotReel = memo(
  ({
    items,
    spinning,
    targetIndex,
    onStop,
    delay,
    direction,
    turboMode,
  }: ReelProps) => {
    // Use items from the middle round (round 2 of 5) to ensure full coverage
    const centerRoundOffset = items.length * 2;
    const initialOffset = (centerRoundOffset + targetIndex) * SYMBOL_HEIGHT;

    const reelContentRef = useRef<HTMLDivElement>(null);
    const offsetRef = useRef(initialOffset);
    const requestRef = useRef<number>(0);
    const startTimeRef = useRef<number | null>(null);
    const hasStoppedRef = useRef(false);
    const totalHeight = items.length * SYMBOL_HEIGHT * 5;

    const updatePosition = (newOffset: number) => {
      offsetRef.current = newOffset;
      if (reelContentRef.current) {
        reelContentRef.current.style.transform = `translateY(-${newOffset}px)`;
      }
    };

    const animate = useCallback(
      (time: number) => {
        if (!startTimeRef.current) startTimeRef.current = time;
        const elapsed = time - startTimeRef.current;

        if (spinning || elapsed < delay) {
          const currentOffset = offsetRef.current;
          const speed = turboMode ? 90 : 40;
          let nextOffset;

          if (direction === "down") {
            nextOffset = (currentOffset + speed) % totalHeight;
          } else {
            nextOffset = currentOffset - speed;
            if (nextOffset < 0) nextOffset = totalHeight + nextOffset;
          }

          updatePosition(nextOffset);
          requestRef.current = requestAnimationFrame(animate);
        } else if (!hasStoppedRef.current) {
          const finalPos = (centerRoundOffset + targetIndex) * SYMBOL_HEIGHT;
          updatePosition(finalPos);
          hasStoppedRef.current = true;
          onStop();
        }
      },
      [
        spinning,
        targetIndex,
        delay,
        onStop,
        direction,
        totalHeight,
        turboMode,
        centerRoundOffset,
      ],
    );

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
        updatePosition((centerRoundOffset + targetIndex) * SYMBOL_HEIGHT);
      }
    }, [targetIndex, spinning, centerRoundOffset]);

    // Repeat items enough times to fill the visible area (340px / 68px ≈ 5 visible items)
    // We use 5x repetition to ensure seamless looping and no empty spaces
    const repeatedItems = [...items, ...items, ...items, ...items, ...items];

    return (
      <div
        className="relative flex-1 max-w-[110px] h-[340px] rounded-xl overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #0a2a15 0%, #051a0d 50%, #0a2a15 100%)",
          border: "3px solid #2d5a3d",
          boxShadow:
            "inset 0 0 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(34, 197, 94, 0.2)",
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
          ref={reelContentRef}
          className="absolute w-full flex flex-col"
          style={{
            transform: `translateY(-${offsetRef.current}px)`,
            top: `${SYMBOL_HEIGHT * 2}px`, // Center the items
            willChange: "transform", // Hardware acceleration hint
            transition: !spinning
              ? "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              : "none",
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
                  isCenterItem
                    ? "scale-105"
                    : spinning
                      ? ""
                      : "opacity-70 scale-90"
                }`}
                style={{ height: `${SYMBOL_HEIGHT}px` }}
              >
                <div
                  className="w-full h-full rounded-lg flex items-center justify-center"
                  style={{
                    background: isCenterItem
                      ? "linear-gradient(180deg, rgba(34, 197, 94, 0.4) 0%, rgba(22, 101, 52, 0.6) 100%)"
                      : "linear-gradient(180deg, rgba(20, 83, 45, 0.3) 0%, rgba(5, 46, 22, 0.5) 100%)",
                    border: isCenterItem
                      ? "2px solid rgba(74, 222, 128, 0.5)"
                      : "1px solid rgba(34, 197, 94, 0.2)",
                    boxShadow: isCenterItem
                      ? "0 0 15px rgba(34, 197, 94, 0.4)"
                      : "none",
                  }}
                >
                  {/* Show image if valid URL exists, otherwise show emoji label */}
                  {item.imageUrl && !item.imageUrl.includes("placehold.co") ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.label}
                      width={50}
                      height={50}
                      className="object-contain drop-shadow-lg"
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
  },
);
