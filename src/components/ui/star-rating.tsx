"use client";
import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
  disabled?: boolean;
}

export function StarRating({ rating, setRating, disabled }: StarRatingProps) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          aria-label={`ให้คะแนน ${star} ดาว`}
          className={cn(
            "transition-transform hover:scale-110 focus:outline-none",
            disabled && "cursor-default hover:scale-100"
          )}
          onClick={() => setRating(star)}
          onMouseEnter={() => !disabled && setHover(star)}
          onMouseLeave={() => !disabled && setHover(0)}
        >
          <Star
            className={cn(
              "h-8 w-8 transition-colors",
              (hover || rating) >= star
                ? "fill-yellow-400 text-yellow-400"
                : "fill-transparent text-gray-300"
            )}
          />
        </button>
      ))}
    </div>
  );
}
