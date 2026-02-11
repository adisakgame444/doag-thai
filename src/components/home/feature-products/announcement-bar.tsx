import { Megaphone } from "lucide-react";
import  MarqueeTextFeature  from "@/components/layouts/header/marquee-text-feature";

export function AnnouncementBar() {
  // Constants for styling consistency
  const SKEW_OFFSET = "25px";

  return (
    // <div className="flex items-center gap-0 filter drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)]">
    <div className="flex items-stretch h-10 gap-0" style={{ boxShadow: "0 5px 10px rgba(0,0,0,0.15)" }}>
      {/* Label Section (Left) */}
      <div
        className="relative z-0 inline-flex items-center bg-gradient-to-br from-red-600 to-red-800 px-2 pr-8"
        style={{
          clipPath: `polygon(0 0, 100% 0, calc(100% - ${SKEW_OFFSET}) 100%, 0 100%)`,
        }}
      >
        <div className="flex items-center gap-1 rounded-[6px] bg-white border border-red-200 px-2 py-0.5 shadow-sm">
          <Megaphone size={14} className="text-red-600 fill-red-600" />
          <span className="text-xs font-bold text-red-700">ประกาศ</span>
        </div>
      </div>

      {/* Content Section (Right) */}
      <div
        className="relative z-10 flex flex-1 items-center overflow-hidden bg-neutral-900  rounded-br-xl"
        style={{
          // Negative margin to overlap visually with the clip-path
          marginLeft: `calc(${SKEW_OFFSET} * -1 + 1px)`,
          paddingLeft: SKEW_OFFSET,
          clipPath: `polygon(${SKEW_OFFSET} 0, 100% 0, 100% 100%, 0 100%)`,
          boxShadow: "-2px 0 0 #22c55e",
        }}
      >
        {/* Neon Decor Line */}
        <div className="absolute left-0 right-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />

        <div className="text-gray-200 w-[calc(100%+18px)] ml-[-18px]">
          <MarqueeTextFeature running={true} />
        </div>
      </div>
    </div>
  );
}

