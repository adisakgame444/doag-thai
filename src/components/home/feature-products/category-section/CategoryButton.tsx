// "use client";

// import Image from "next/image";
// import { memo } from "react";

// interface CategoryButtonProps {
//   label: string;
//   icon: string;
//   onClick: () => void;
// }

// const CategoryButton = memo(function CategoryButton({
//   label,
//   icon,
//   onClick,
// }: CategoryButtonProps) {
//   return (
//     <button
//       onClick={onClick}
//       className="
//         relative
//         flex flex-col items-center justify-center
//         min-w-[55px] px-1.5 py-1.5
//         rounded-md

//         bg-gradient-to-b
//         from-white
//         to-muted/60

//         border border-black/5

//         shadow-[
//           0_1px_0_rgba(255,255,255,0.8),
//           0_4px_8px_rgba(0,0,0,0.12)
//         ]

//         hover:shadow-[
//           0_2px_0_rgba(255,255,255,0.9),
//           0_8px_16px_rgba(0,0,0,0.18)
//         ]

//         active:translate-y-[1px]
//         active:shadow-[
//           inset_0_2px_4px_rgba(0,0,0,0.2)
//         ]

//         transition-all duration-200
//       "
//     >
//       {/* icon */}
//       <Image
//         src={icon}
//         alt={label}
//         width={28}
//         height={28}
//         className="relative object-contain"
//       />

//       {/* label */}
//       <span
//         className="
//           relative
//           mt-0.5
//           text-[9px]
//           leading-tight
//           line-clamp-1
//           font-semibold
//           text-foreground
//         "
//       >
//         {label}
//       </span>
//     </button>
//   );
// });

// export default CategoryButton;

"use client";

import Image from "next/image";
import { memo } from "react";

interface CategoryButtonProps {
  label: string;
  icon: string;
  onClick: () => void;
}

const CategoryButton = memo(function CategoryButton({
  label,
  icon,
  onClick,
}: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        relative
        flex flex-col items-center justify-center
        min-w-[45px] px-1 py-1
        rounded-[15]

        bg-zinc-950

        border border-green-400/50

        shadow-[
          0_0_6px_rgba(34,255,120,0.5),
          0_0_12px_rgba(34,255,120,0.35)
        ]

        hover:shadow-[
          0_0_10px_rgba(34,255,120,0.7),
          0_0_18px_rgba(34,255,120,0.5)
        ]

        active:translate-y-[1px]
        active:shadow-[
          inset_0_2px_4px_rgba(0,0,0,0.5),
          0_0_6px_rgba(34,255,120,0.4)
        ]

        transition-all duration-200
      "
    >
      {/* neon highlight */}
      <span
        aria-hidden
        className="
          pointer-events-none
          absolute inset-0
          rounded-md
          bg-gradient-to-b
          from-green-400/15
          to-transparent
        "
      />

      {/* icon */}
      <Image
        src={icon}
        alt={label}
        width={22}
        height={22}
        className="
          relative
          object-contain
          drop-shadow-[0_0_5px_rgba(34,255,120,0.8)]
        "
      />

      {/* label */}
      <span
        className="
          relative
          mt-0.5
          text-[8px]
          leading-tight
          line-clamp-1
          font-semibold
          text-green-300
          drop-shadow-[0_0_4px_rgba(34,255,120,0.9)]
        "
      >
        {label}
      </span>
    </button>
  );
});

export default CategoryButton;
