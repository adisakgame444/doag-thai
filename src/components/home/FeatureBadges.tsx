// "use client";

// import { motion } from "framer-motion";

// const features = [
//   {
//     title: "150+",
//     subtitle: "เกมและบัตร",
//     icon: "🎮",
//   },
//   {
//     title: "5 วิ",
//     subtitle: "เข้าทันที",
//     icon: "⚡",
//   },
//   {
//     title: "100%",
//     subtitle: "ปลอดภัย",
//     icon: "🛡️",
//   },
//   {
//     title: "24/7",
//     subtitle: "บริการ",
//     icon: "🕒",
//   },
//   {
//     title: "THB",
//     subtitle: "รองรับ",
//     icon: "💰",
//   },
// ];

// export default function FeatureBadges() {
//   return (
//     <div className="mt-6 grid grid-cols-5 gap-3">
//       {features.map((item, index) => (
//         <motion.div
//           key={index}
//           whileHover={{ y: -4, scale: 1.03 }}
//           className={`
//             col-span-2
//             ${index >= 2 ? "col-span-1" : ""}
//             bg-white/10 backdrop-blur-md
//             rounded-2xl px-3 py-3
//             text-center text-white
//             border border-white/10
//             shadow-lg
//           `}
//         >
//           <div className="text-xl mb-1">{item.icon}</div>
//           <div className="text-sm font-bold leading-tight">{item.title}</div>
//           <div className="text-[11px] text-white/80">{item.subtitle}</div>
//         </motion.div>
//       ))}
//     </div>
//   );
// }

// "use client";

// import { motion } from "framer-motion";

// const features = [
//   { title: "150+", subtitle: "เกมและบัตร", icon: "🎮" },
//   { title: "5 วิ", subtitle: "เข้าทันที", icon: "⚡" },
//   { title: "100%", subtitle: "ปลอดภัย", icon: "🛡️" },
//   { title: "24/7", subtitle: "บริการ", icon: "🕒" },
//   { title: "THB", subtitle: "รองรับ", icon: "💰" },
// ];

// export default function FeatureBadges() {
//   return (
//     <div className="mt-5 flex flex-col items-center gap-2">
//       {/* 🔝 แถวบน (2 กล่อง) */}
//       <div className="grid grid-cols-2 gap-2">
//         {features.slice(0, 2).map((item, i) => (
//           <Badge key={i} {...item} />
//         ))}
//       </div>

//       {/* 🔽 แถวล่าง (3 กล่อง) */}
//       <div className="grid grid-cols-3 gap-2">
//         {features.slice(2).map((item, i) => (
//           <Badge key={i} {...item} />
//         ))}
//       </div>
//     </div>
//   );
// }

// function Badge({
//   title,
//   subtitle,
//   icon,
// }: {
//   title: string;
//   subtitle: string;
//   icon: string;
// }) {
//   return (
//     <motion.div
//       whileHover={{ y: -2, scale: 1.02 }}
//       className="
//         w-[86px]
//         rounded-xl
//         bg-white/10 backdrop-blur-md
//         border border-white/10
//         px-2 py-2
//         text-center text-white
//         shadow-sm
//       "
//     >
//       <div className="text-base leading-none">{icon}</div>
//       <div className="text-xs font-semibold leading-tight">{title}</div>
//       <div className="text-[10px] text-white/70 leading-tight">{subtitle}</div>
//     </motion.div>
//   );
// }

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type CardData = {
  title: string;
  subtitle: string;
  image: string;
};

const POOL: CardData[] = [
  {
    title: "150+",
    subtitle: "เกมและบัตร",
    image: "/images/game-image.webp",
  },
  {
    title: "5 วิ",
    subtitle: "เข้าทันที",
    image: "/images/game-image1.webp",
  },
  {
    title: "100%",
    subtitle: "ปลอดภัย",
    image: "/images/game-image2.webp",
  },
  {
    title: "24/7",
    subtitle: "บริการ",
    image: "/images/game-image3.jpg",
  },
  {
    title: "THB",
    subtitle: "รองรับ",
    image: "/images/game-image4.jpg",
  },
];

export default function FeatureBadges() {
  const [indexes, setIndexes] = useState<number[]>([0, 1, 2, 3, 4]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndexes((prev) =>
        prev.map(() => Math.floor(Math.random() * POOL.length))
      );
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-5 flex flex-col items-center gap-2">
      {/* แถวบน */}
      <div className="grid grid-cols-2 gap-2">
        {indexes.slice(0, 2).map((i, idx) => (
          <FlipCard key={idx} data={POOL[i]} />
        ))}
      </div>

      {/* แถวล่าง */}
      <div className="grid grid-cols-3 gap-2">
        {indexes.slice(2).map((i, idx) => (
          <FlipCard key={idx + 2} data={POOL[i]} />
        ))}
      </div>
    </div>
  );
}

function FlipCard({ data }: { data: CardData }) {
  return (
    <div className="relative w-[96px] h-[82px] overflow-hidden rounded-xl shadow-md">
      <AnimatePresence mode="wait">
        <motion.div
          key={data.title + data.image}
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -80, opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${data.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* overlay */}
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px]" />

          {/* content */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-2">
            <div className="text-sm font-bold leading-tight">{data.title}</div>
            <div className="text-[10px] text-white/80 leading-tight">
              {data.subtitle}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
