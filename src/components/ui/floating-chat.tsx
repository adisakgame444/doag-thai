// "use client";

// import { useState } from "react";

// export default function FloatingChat() {
//   const [open, setOpen] = useState(false);
//   const [showQR, setShowQR] = useState(false);

//   return (
//     <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
//       {/* ปุ่ม Messenger + LINE */}
//       {open && (
//         <div className="flex flex-col items-end gap-3 transition-all duration-200">
//           {/* Messenger */}
//           <a
//             href="https://m.me/61579149763038"
//             target="_blank"
//             rel="noopener noreferrer"
//             aria-label="Messenger"
//             className="rounded-full shadow-lg hover:scale-110 transition-transform"
//           >
//             <img
//               src="/icons/messenger.png"
//               alt="Messenger"
//               width={40}
//               height={40}
//             />
//           </a>

//           {/* LINE → แสดง QR Code */}
//           {/* <button
//             onClick={() => setShowQR(!showQR)}
//             aria-label="LINE QR"
//             className="rounded-full shadow-lg hover:scale-110 transition-transform bg-white p-1"
//           >
//             <img src="/icons/line.png" alt="LINE" width={40} height={40} />
//           </button> */}

//           <button
//             onClick={() => setShowQR(!showQR)}
//             aria-label="LINE QR"
//             className="rounded-full shadow-lg hover:scale-110 transition-transform"
//           >
//             <img src="/icons/line.png" alt="LINE" width={40} height={40} />
//           </button>

//           {/* POPUP QR CODE */}
//           {showQR && (
//             <div className="absolute bottom-20 right-0 bg-white p-3 rounded-xl shadow-xl">
//               <img
//                 src="/icons/line-me.png"
//                 alt="LINE QR Code"
//                 width={140}
//                 height={140}
//                 className="rounded-lg"
//               />
//             </div>
//           )}
//         </div>
//       )}

//       {/* ปุ่มหลัก */}
//       <button
//         onClick={() => {
//           setOpen(!open);
//           setShowQR(false); // ปิด QR เมื่อกดปิดเมนู
//         }}
//         aria-label="เปิดเมนูแชท"
//         className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full shadow-xl hover:scale-105 transition-transform"
//       >
//         <img
//           src="/doag-thai.png"
//           alt="พนักงานบริการลูกค้า"
//           className="w-8 h-8 rounded-full object-cover"
//         />
//         แชทกับเรา
//       </button>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";

// export default function FloatingChat() {
//   const [open, setOpen] = useState(false);

//   return (
//     <>
//       {/* 🔵 ปุ่ม Messenger + LINE (เมนูเปิด) */}
//       {open && (
//         <div className="fixed bottom-28 right-6 z-[9999] flex flex-col items-end gap-3">
//           {/* Messenger */}
//           <a
//             href="https://m.me/61579149763038"
//             target="_blank"
//             rel="noopener noreferrer"
//             aria-label="Messenger"
//             className="rounded-full shadow-lg hover:scale-110 transition-transform"
//           >
//             <img
//               src="/icons/messenger.png"
//               alt="Messenger"
//               width={40}
//               height={40}
//             />
//           </a>

//           {/* LINE → ลิงก์ถาวร (Add Friend) */}
//           <a
//             href="https://line.me/R/ti/p/@434vnjcv"
//             target="_blank"
//             rel="noopener noreferrer"
//             aria-label="LINE Add Friend"
//             className="rounded-full shadow-lg hover:scale-110 transition-transform"
//           >
//             <img src="/icons/line.png" alt="LINE" width={40} height={40} />
//           </a>
//         </div>
//       )}

//       {/* 🔴 ปุ่มหลัก */}
//       <button
//         onClick={() => setOpen(!open)}
//         aria-label="เปิดเมนูแชท"
//         className="fixed bottom-6 right-6 z-[9999] flex flex-col items-center"
//       >
//         {/* รูปด้านบน */}
//         <img
//           src="/doag-thai.png"
//           alt="พนักงานบริการลูกค้า"
//           className="w-12 h-12 rounded-full object-cover mb-1"
//         />

//         {/* กล่องสีแดง */}
//         <span className="bg-red-600 text-white text-sm font-bold px-4 py-1 rounded-[5px] shadow-xl">
//           แชทกับเรา
//         </span>
//       </button>
//     </>
//   );
// }

// "use client";

// import { useState } from "react";

// export default function FloatingChat() {
//   const [open, setOpen] = useState(false);

//   return (
//     <>
//       {/* 🔵 ปุ่ม Messenger + LINE (เมนูเปิด) */}
//       {open && (
//         <div className="fixed bottom-28 right-6 z-[9999] flex flex-col items-end gap-3">
//           <a
//             href="https://m.me/61579149763038"
//             target="_blank"
//             rel="noopener noreferrer"
//             aria-label="Messenger"
//             className="
//               rounded-full
//               bg-white
//               p-1
//               border border-black/10
//               shadow-[0_6px_20px_rgba(0,0,0,0.25)]
//               hover:scale-105
//               transition
//             "
//           >
//             <img
//               src="/icons/messenger.png"
//               alt="Messenger"
//               width={40}
//               height={40}
//             />
//           </a>

//           <a
//             href="https://line.me/R/ti/p/@434vnjcv"
//             target="_blank"
//             rel="noopener noreferrer"
//             aria-label="LINE Add Friend"
//             className="
//               rounded-full
//               bg-white
//               p-1
//               border border-black/10
//               shadow-[0_6px_20px_rgba(0,0,0,0.25)]
//               hover:scale-105
//               transition
//             "
//           >
//             <img src="/icons/line.png" alt="LINE" width={40} height={40} />
//           </a>
//         </div>
//       )}

//       {/* 🔴 ปุ่มหลัก */}
//       <button
//         onClick={() => setOpen(!open)}
//         aria-label="เปิดเมนูแชท"
//         className="fixed bottom-6 right-6 z-[9999] flex flex-col items-center"
//       >
//         {/* รูปพนักงาน */}
//         <div
//           className="
//             relative
//             rounded-full
//             border-2 border-white
//             shadow-[0_8px_24px_rgba(0,0,0,0.35)]
//           "
//         >
//           <img
//             src="/doag-thai.png"
//             alt="พนักงานบริการลูกค้า"
//             className="w-12 h-12 rounded-full object-cover"
//           />
//         </div>

//         {/* กล่องแชท (ดีไซน์ใหม่) */}
//         <span
//           className="
//             mt-1
//             bg-gradient-to-b from-red-600 to-red-700
//             text-white text-sm font-bold
//             px-4 py-1.5
//             rounded-lg
//             border border-red-400/40
//             shadow-[0_6px_16px_rgba(220,38,38,0.6)]
//             backdrop-blur
//           "
//         >
//           แชทกับเรา
//         </span>
//       </button>
//     </>
//   );
// }

// "use client";

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// export default function FloatingChat() {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4 origin-right scale-90 sm:scale-100">
//       {/* 🔵 เมนูย่อย (Messenger & LINE) */}
//       <AnimatePresence>
//         {open && (
//           <motion.div
//             initial={{ opacity: 0, y: 15, scale: 0.8 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: 15, scale: 0.8 }}
//             className="flex flex-col gap-3 mb-1"
//           >
//             {[
//               {
//                 name: "Messenger",
//                 href: "https://m.me/61579149763038",
//                 icon: "/icons/messenger.png",
//               },
//               {
//                 name: "LINE",
//                 href: "https://line.me/R/ti/p/@434vnjcv",
//                 icon: "/icons/line.png",
//               },
//             ].map((item) => (
//               <a
//                 key={item.name}
//                 href={item.href}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="group flex items-center justify-end gap-3"
//               >
//                 <span className="hidden sm:block opacity-0 group-hover:opacity-100 transition-all duration-300 bg-emerald-950/80 backdrop-blur-md text-white text-[11px] py-1.5 px-4 rounded-full border border-white/10 shadow-lg translate-x-2 group-hover:translate-x-0 font-medium">
//                   {item.name}
//                 </span>
//                 <div className="w-12 h-12 rounded-2xl bg-white shadow-xl border border-gray-50 p-2.5 hover:scale-110 transition-transform active:scale-95 flex items-center justify-center">
//                   <img
//                     src={item.icon}
//                     alt={item.name}
//                     className="w-full h-full object-contain"
//                   />
//                 </div>
//               </a>
//             ))}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* 🟢 ปุ่มหลัก + ป้ายแชท (แนวนอน) */}
//       <div className="flex items-center gap-3">
//         {/* 💬 ป้าย "แชทกับเรา" (New Modern Design) */}
//         <div
//           className={`
//           transition-all duration-500 ease-in-out transform
//           ${
//             open
//               ? "opacity-0 translate-x-10 pointer-events-none"
//               : "opacity-100 translate-x-0"
//           }
//         `}
//         >
//           <div
//             className="relative group cursor-pointer"
//             onClick={() => setOpen(true)}
//           >
//             {/* 1. Outer Soft Glow (เงาฟุ้งด้านนอก) */}
//             <div className="absolute -inset-1 bg-emerald-500/20 rounded-2xl blur-md group-hover:bg-emerald-500/30 transition duration-500"></div>

//             {/* 2. Main Badge Body */}
//             <div
//               className="
//               relative flex items-center gap-2.5
//               bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#047857]
//               text-white text-[12px] sm:text-[13px] font-bold tracking-tight
//               pl-4 pr-5 py-2.5 rounded-[14px]
//               border-[0.5px] border-white/30 shadow-2xl
//               backdrop-blur-sm whitespace-nowrap overflow-hidden
//             "
//             >
//               {/* 3. Glossy Overlay (เลเยอร์แสงเงาด้านบน) */}
//               <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-40 pointer-events-none"></div>

//               {/* 4. สถานะไฟกะพริบ */}
//               <div className="flex relative h-2 w-2">
//                 <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></div>
//                 <div className="relative inline-flex rounded-full h-2 w-2 bg-white shadow-[0_0_8px_white]"></div>
//               </div>

//               <span className="relative z-10 drop-shadow-sm">แชทกับเรา</span>

//               {/* 5. ติ่งแหลม (Tail) - ปรับสีให้เข้ากับ Gradient ใหม่ */}
//               <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#056d4f] rotate-45 border-r-[0.5px] border-t-[0.5px] border-white/20"></div>
//             </div>
//           </div>
//         </div>

//         {/* 👤 รูปโปรไฟล์พนักงาน + จุดเขียว */}
//         <button
//           onClick={() => setOpen(!open)}
//           className="relative group focus:outline-none"
//         >
//           <div
//             className={`
//             p-1 rounded-full bg-white shadow-[0_12px_40px_rgba(0,0,0,0.2)]
//             transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
//             ${
//               open
//                 ? "rotate-[360deg] scale-90"
//                 : "hover:scale-110 active:scale-95"
//             }
//           `}
//           >
//             <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-emerald-50/50">
//               <img
//                 src="/doag-thai.png"
//                 alt="Support"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>

//           {/* 🟢 จุดเขียว (ยึดติดกับรูป) */}
//           <span className="absolute bottom-1 right-1 flex h-4 w-4">
//             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//             <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white shadow-sm"></span>
//           </span>
//         </button>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// export default function FloatingChat() {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4 origin-right scale-90 sm:scale-100">
//       {/* 🔵 ปุ่มเมนูย่อย (Messenger & LINE) */}
//       <AnimatePresence>
//         {open && (
//           <motion.div
//             initial={{ opacity: 0, y: 15, scale: 0.8 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: 15, scale: 0.8 }}
//             className="flex flex-col gap-3 mb-1"
//           >
//             {[
//               {
//                 name: "Messenger",
//                 href: "https://m.me/61579149763038",
//                 icon: "/icons/messenger.png",
//               },
//               {
//                 name: "LINE",
//                 href: "https://line.me/R/ti/p/@434vnjcv",
//                 icon: "/icons/line.png",
//               },
//             ].map((item) => (
//               <a
//                 key={item.name}
//                 href={item.href}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="group flex items-center justify-end gap-3"
//               >
//                 <span className="hidden sm:block opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[#052e16]/80 backdrop-blur-md text-white text-[11px] py-1.5 px-4 rounded-full border border-white/10 shadow-lg translate-x-2 group-hover:translate-x-0 font-medium">
//                   {item.name}
//                 </span>
//                 <div className="w-12 h-12 rounded-2xl bg-white shadow-xl border border-gray-50 p-2.5 hover:rotate-6 hover:scale-110 transition-all active:scale-95 flex items-center justify-center overflow-hidden">
//                   <img
//                     src={item.icon}
//                     alt={item.name}
//                     className="w-full h-full object-contain"
//                   />
//                 </div>
//               </a>
//             ))}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* 🟢 ส่วนปุ่มหลัก + ป้าย "แชทกับเรา" (แนวนอน) */}
//       <div className="flex items-center gap-3">
//         {/* 💬 ป้าย "แชทกับเรา" + ไอคอนขยับได้ */}
//         <div
//           className={`
//           transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] transform
//           ${
//             open
//               ? "opacity-0 translate-x-10 pointer-events-none"
//               : "opacity-100 translate-x-0"
//           }
//         `}
//         >
//           <motion.div
//             whileHover="hover"
//             className="relative group cursor-pointer"
//             onClick={() => setOpen(true)}
//           >
//             {/* Ambient Glow */}
//             <div className="absolute -inset-1 bg-emerald-600/20 rounded-2xl blur-md group-hover:bg-emerald-600/40 transition duration-500"></div>

//             {/* Main Badge */}
//             <div
//               className="
//               relative flex items-center gap-3
//               bg-gradient-to-br from-[#064e3b] via-[#059669] to-[#047857]
//               text-white text-[12px] sm:text-[13px] font-bold tracking-wide
//               pl-5 pr-4 py-2.5 rounded-[15px]
//               border border-white/30 shadow-[0_10px_25px_rgba(4,120,87,0.3)]
//               backdrop-blur-sm whitespace-nowrap overflow-visible
//             "
//             >
//               {/* Glossy Top Layer */}
//               <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/20 to-transparent rounded-t-[14px] pointer-events-none"></div>

//               <span className="relative z-10 drop-shadow-md">แชทกับเรา</span>

//               {/* ✈️ ไอคอนจรวดกระดาษ พร้อมลูกเล่น Animation */}
//               <motion.div
//                 variants={{
//                   hover: { x: 5, y: -2, scale: 1.2 },
//                 }}
//                 animate={{
//                   y: [0, -3, 0], // ขยับขึ้นลง
//                   rotate: [0, 5, 0], // เอียงไปมา
//                 }}
//                 transition={{
//                   duration: 3,
//                   repeat: Infinity,
//                   ease: "easeInOut",
//                 }}
//                 className="relative z-10 flex items-center justify-center text-emerald-100"
//               >
//                 <svg
//                   viewBox="0 0 24 24"
//                   fill="currentColor"
//                   className="w-4 h-4"
//                 >
//                   <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
//                 </svg>
//               </motion.div>

//               {/* หางลูกศร (Speech Bubble Tail) */}
//               <div
//                 className="
//                 absolute right-[-6px] top-1/2 -translate-y-1/2
//                 w-4 h-4 bg-[#059166] rotate-45
//                 border-r border-t border-white/20
//                 -z-10
//               "
//               ></div>
//             </div>
//           </motion.div>
//         </div>

//         {/* 👤 รูปโปรไฟล์พนักงาน + จุดเขียว */}
//         <button
//           onClick={() => setOpen(!open)}
//           className="relative group focus:outline-none"
//         >
//           <div
//             className={`
//             p-1 rounded-full bg-white shadow-[0_10px_35px_rgba(0,0,0,0.2)]
//             transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
//             ${
//               open
//                 ? "rotate-[360deg] scale-90"
//                 : "hover:scale-110 active:scale-95"
//             }
//           `}
//           >
//             <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-emerald-50">
//               <img
//                 src="/doag-thai.png"
//                 alt="Support"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>

//           <span className="absolute bottom-1 right-1 flex h-4 w-4">
//             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//             <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white shadow-md"></span>
//           </span>
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const isDraggingRef = useRef(false);

  // ฟังก์ชันสลับสถานะ (เช็คว่าลากอยู่ไหม)
  const toggleOpen = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      e.stopPropagation();
      return;
    }
    setOpen(!open);
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      whileDrag={{ scale: 1.05, cursor: "grabbing" }}
      onDragStart={() => (isDraggingRef.current = true)}
      onDragEnd={() => setTimeout(() => (isDraggingRef.current = false), 100)}
      // 🔧 ปรับตำแหน่งและลด Gap (bottom-4 right-4)
      className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end gap-3 origin-center cursor-grab touch-none"
    >
      {/* 🔵 เมนูย่อย (Messenger & LINE) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="flex flex-col gap-2 mb-1 items-end pr-1"
          >
            {[
              {
                name: "Messenger",
                href: "https://m.me/61579149763038",
                icon: "/icons/messenger.png",
              },
              {
                name: "LINE",
                href: "https://line.me/R/ti/p/@434vnjcv",
                icon: "/icons/line.png",
              },
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onPointerDown={(e) => e.stopPropagation()} // กัน Drag ติดลิิงก์
                className="group flex items-center justify-end gap-2"
              >
                {/* Tooltip (ย่อขนาด) */}
                <span className="hidden sm:block opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[#052e16]/80 backdrop-blur-md text-white text-[10px] py-1 px-3 rounded-full border border-white/10 shadow-lg translate-x-2 group-hover:translate-x-0 font-medium pointer-events-none">
                  {item.name}
                </span>

                {/* ปุ่มย่อย (ย่อจาก w-12 -> w-9) */}
                <div className="w-9 h-9 rounded-xl bg-white shadow-xl border border-gray-50 p-1.5 hover:rotate-6 hover:scale-110 transition-all active:scale-95 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.icon}
                    alt={item.name}
                    draggable="false"
                    className="w-full h-full object-contain select-none"
                  />
                </div>
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🟢 ส่วนปุ่มหลัก + ป้าย "แชทกับเรา" */}
      <div className="flex items-center gap-2">
        {/* ป้าย "แชทกับเรา" (ย่อขนาด แต่คงดีไซน์เดิมครบถ้วน) */}
        <div
          className={`
          transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] transform
          ${
            open
              ? "opacity-0 translate-x-4 pointer-events-none"
              : "opacity-100 translate-x-0"
          }
        `}
        >
          <motion.div
            whileHover="hover"
            className="relative group cursor-pointer"
            onClick={(e) => !isDraggingRef.current && setOpen(true)}
          >
            {/* ✨ Ambient Glow (แสงฟุ้งรอบๆ ยังอยู่) */}
            <div className="absolute -inset-1 bg-emerald-600/20 rounded-2xl blur-md group-hover:bg-emerald-600/40 transition duration-500"></div>

            {/* Main Badge (ย่อขนาด Padding และ Font) */}
            <div
              className="
              relative flex items-center gap-2
              bg-gradient-to-br from-[#064e3b] via-[#059669] to-[#047857]
              text-white text-[10px] sm:text-[11px] font-bold tracking-wide
              pl-3 pr-2.5 py-1.5 rounded-[12px]
              border border-white/30 shadow-[0_5px_15px_rgba(4,120,87,0.3)]
              backdrop-blur-sm whitespace-nowrap overflow-visible
            "
            >
              {/* ✨ Glossy Top Layer (เงาสะท้อนด้านบน ยังอยู่) */}
              <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/20 to-transparent rounded-t-[11px] pointer-events-none"></div>

              <span className="relative z-10 drop-shadow-md select-none">
                แชทกับเรา
              </span>

              {/* ✈️ Icon Animation */}
              <motion.div
                variants={{ hover: { x: 3, y: -1, scale: 1.1 } }}
                animate={{ y: [0, -2, 0], rotate: [0, 5, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10 flex items-center justify-center text-emerald-100"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3 h-3"
                >
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </motion.div>

              {/* ✨ หางลูกศร (Speech Bubble Tail ยังอยู่) */}
              <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-3 h-3 bg-[#059166] rotate-45 border-r border-t border-white/20 -z-10"></div>
            </div>
          </motion.div>
        </div>

        {/* 👤 ปุ่มกลมรูปโปรไฟล์ */}
        <button
          onClick={toggleOpen}
          className="relative group focus:outline-none select-none"
        >
          <div
            className={`
            p-0.5 rounded-full bg-white shadow-[0_5px_20px_rgba(0,0,0,0.15)] 
            transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
            ${
              open
                ? "rotate-[360deg] scale-90"
                : "hover:scale-105 active:scale-95"
            }
          `}
          >
            {/* ขนาดปุ่มหลัก: ลดจาก w-16 -> w-12 */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-emerald-50 pointer-events-none">
              <img
                src="/doag-thai.png"
                alt="Support"
                draggable="false"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Status Dot */}
          <span className="absolute bottom-0 right-0 flex h-3 w-3 pointer-events-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white shadow-md"></span>
          </span>
        </button>
      </div>
    </motion.div>
  );
}
