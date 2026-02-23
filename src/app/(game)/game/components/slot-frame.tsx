// "use client";

// interface SlotFrameProps {
//   children: React.ReactNode;
// }

// export const SlotFrame = ({ children }: SlotFrameProps) => {
//   return (
//     <div className="relative mx-auto w-full max-w-lg">
//       {/* Outer Frame with Gold Border */}
//       <div
//         className="relative rounded-3xl p-1"
//         style={{
//           background:
//             "linear-gradient(180deg, #fcd34d 0%, #b45309 50%, #fcd34d 100%)",
//           boxShadow:
//             "0 0 60px rgba(234, 179, 8, 0.3), 0 20px 40px rgba(0, 0, 0, 0.5)",
//         }}
//       >
//         {/* Inner dark container */}
//         <div
//           className="relative rounded-[22px] overflow-hidden"
//           style={{
//             background:
//               "linear-gradient(180deg, #0f3d1f 0%, #052e16 50%, #041f10 100%)",
//             boxShadow:
//               "inset 0 2px 20px rgba(0, 0, 0, 0.8), inset 0 -2px 20px rgba(0, 0, 0, 0.5)",
//           }}
//         >
//           {/* Top light strip */}
//           <div
//             className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 rounded-b-full z-20"
//             style={{
//               background:
//                 "linear-gradient(90deg, transparent, #22c55e, transparent)",
//               boxShadow: "0 0 20px rgba(34, 197, 94, 0.8)",
//             }}
//           />

//           {/* Side accent lights */}
//           <div
//             className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full z-20"
//             style={{
//               background:
//                 "linear-gradient(180deg, transparent, #22c55e, transparent)",
//               boxShadow: "0 0 15px rgba(34, 197, 94, 0.6)",
//             }}
//           />
//           <div
//             className="absolute right-0 top-1/4 bottom-1/4 w-1 rounded-l-full z-20"
//             style={{
//               background:
//                 "linear-gradient(180deg, transparent, #22c55e, transparent)",
//               boxShadow: "0 0 15px rgba(34, 197, 94, 0.6)",
//             }}
//           />

//           {/* Reels Container */}
//           <div className="relative p-6">
//             {/* Glass overlay effect */}
//             <div
//               className="absolute inset-6 rounded-xl pointer-events-none z-10"
//               style={{
//                 background:
//                   "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.2) 100%)",
//                 borderTop: "1px solid rgba(255,255,255,0.1)",
//               }}
//             />

//             {/* Reels background */}
//             <div
//               className="relative rounded-xl overflow-hidden"
//               style={{
//                 background: "linear-gradient(180deg, #0a1f12 0%, #071a0e 100%)",
//                 boxShadow: "inset 0 4px 20px rgba(0, 0, 0, 0.8)",
//               }}
//             >
//               {/* The 3 Reels */}
//               <div className="flex justify-center p-4 gap-3">{children}</div>
//             </div>
//           </div>

//           {/* Bottom light strip */}
//           <div
//             className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1 rounded-t-full z-20"
//             style={{
//               background:
//                 "linear-gradient(90deg, transparent, #22c55e, transparent)",
//               boxShadow: "0 0 20px rgba(34, 197, 94, 0.8)",
//             }}
//           />
//         </div>
//       </div>

//       {/* Corner Gems - Subtle and elegant */}
//       <div
//         className="absolute -top-2 -left-2 w-5 h-5 rounded-full"
//         style={{
//           background: "radial-gradient(circle, #22c55e 0%, #166534 100%)",
//           boxShadow: "0 0 10px rgba(34, 197, 94, 0.8)",
//         }}
//       />
//       <div
//         className="absolute -top-2 -right-2 w-5 h-5 rounded-full"
//         style={{
//           background: "radial-gradient(circle, #22c55e 0%, #166534 100%)",
//           boxShadow: "0 0 10px rgba(34, 197, 94, 0.8)",
//         }}
//       />
//       <div
//         className="absolute -bottom-2 -left-2 w-5 h-5 rounded-full"
//         style={{
//           background: "radial-gradient(circle, #22c55e 0%, #166534 100%)",
//           boxShadow: "0 0 10px rgba(34, 197, 94, 0.8)",
//         }}
//       />
//       <div
//         className="absolute -bottom-2 -right-2 w-5 h-5 rounded-full"
//         style={{
//           background: "radial-gradient(circle, #22c55e 0%, #166534 100%)",
//           boxShadow: "0 0 10px rgba(34, 197, 94, 0.8)",
//         }}
//       />
//     </div>
//   );
// };

"use client";

interface SlotFrameProps {
  children: React.ReactNode;
}

export const SlotFrame = ({ children }: SlotFrameProps) => {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* Outer Frame (ตัวตู้สีแดงสด Pixel Style) */}
      <div
        className="bg-[#FF3366] p-3 sm:p-4 border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_#000] relative"
        style={{
          boxShadow: "8px 8px 0px 0px #000", // Hard Shadow for Pixel Feel
        }}
      >
        {/* Screw Decorations (น็อตยึดตู้ 4 มุม) */}
        <div className="absolute top-2 left-2 w-3 h-3 bg-white/20 rounded-full border-2 border-black/20"></div>
        <div className="absolute top-2 right-2 w-3 h-3 bg-white/20 rounded-full border-2 border-black/20"></div>
        <div className="absolute bottom-2 left-2 w-3 h-3 bg-white/20 rounded-full border-2 border-black/20"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 bg-white/20 rounded-full border-2 border-black/20"></div>

        {/* Screen Area (หน้าจอสีดำ) */}
        <div className="bg-black border-4 border-black rounded-lg p-1 relative overflow-hidden">
          {/* Screen Glare (เงาสะท้อนกระจก) */}
          <div className="absolute top-0 right-0 w-32 h-full bg-white/5 skew-x-[-25deg] pointer-events-none z-20"></div>

          {/* Inner Reels Container (พื้นหลังวงล้อ) */}
          <div className="bg-[#1a1a1a] rounded border-2 border-[#333] flex justify-center gap-1 sm:gap-2 p-1 sm:p-2 relative">
            {/* Scanlines Effect (ลายเส้นทีวีเก่า) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-20"></div>

            {children}
          </div>

          {/* Payline (เส้นจ่ายรางวัลสีแดง) */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-red-500/60 z-10 pointer-events-none mix-blend-screen shadow-[0_0_5px_#ef4444]"></div>

          {/* Arrow Indicators (ลูกศรชี้เส้นจ่าย) */}
          <div className="absolute top-1/2 -left-1 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-red-500 -translate-y-1/2"></div>
          <div className="absolute top-1/2 -right-1 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-red-500 -translate-y-1/2"></div>
        </div>

        {/* Logo Sticker (สติ๊กเกอร์แปะหน้าตู้) */}
        <div className="mt-2 text-center">
          <div className="inline-block bg-black text-[#FFD028] text-[10px] font-black px-3 py-1 rounded-sm tracking-widest border-2 border-[#FFD028] uppercase shadow-[2px_2px_0px_#000]">
            LUCKY SLOT
          </div>
        </div>
      </div>
    </div>
  );
};



