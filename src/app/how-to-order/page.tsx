// "use client";

// import Link from "next/link";
// import { motion } from "framer-motion";
// import {
//   ShoppingBag,
//   ShoppingCart,
//   MapPin,
//   CreditCard,
//   PackageCheck,
//   ChevronRight,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";

// export default function HowToOrderPage() {
//   const steps = [
//     {
//       id: 1,
//       icon: ShoppingBag,
//       title: "เลือกสินค้าที่ถูกใจ",
//       desc: "เลือกสายพันธุ์หรือสินค้าที่คุณต้องการ เลือกขนาดและจำนวน แล้วกดปุ่ม 'เพิ่มลงตะกร้า'",
//     },
//     {
//       id: 2,
//       icon: ShoppingCart,
//       title: "ตรวจสอบตะกร้าสินค้า",
//       desc: "กดที่ไอคอนตะกร้าเพื่อตรวจสอบรายการสินค้า แล้วกดปุ่ม 'ไปชำระเงิน' เพื่อดำเนินการต่อ",
//     },
//     {
//       id: 3,
//       icon: MapPin,
//       title: "ระบุที่อยู่จัดส่ง",
//       desc: "กรอกชื่อและที่อยู่สำหรับจัดส่งให้ครบถ้วน หรือเลือกจากที่อยู่ที่คุณบันทึกไว้",
//     },
//     {
//       id: 4,
//       icon: CreditCard,
//       title: "เลือกวิธีชำระเงิน",
//       desc: "เลือกช่องทางที่สะดวก (โอนเงิน / สแกน QR / บัตรเครดิต) แล้วกด 'ยืนยันคำสั่งซื้อ'",
//     },
//     {
//       id: 5,
//       icon: PackageCheck,
//       title: "รอรับสินค้า",
//       desc: "เมื่อชำระเงินแล้ว รอรับสินค้าได้เลย! คุณสามารถเช็คสถานะได้ที่เมนู 'ติดตามพัสดุ'",
//     },
//   ];

//   return (
//     <div className="min-h-screen w-full bg-[#050505] text-white pt-24 pb-32 px-4 relative overflow-hidden">
//       {/* ✨ Background Glow Effects */}
//       <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none" />
//       <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-500/5 blur-[120px] rounded-full pointer-events-none" />

//       <div className="max-w-lg mx-auto relative z-10">
//         {/* Header */}
//         <div className="text-center mb-10 space-y-2">
//           <motion.h1
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
//           >
//             วิธีการสั่งซื้อ
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.1 }}
//             className="text-gray-400 text-sm"
//           >
//             สั่งซื้อง่ายๆ เพียง 5 ขั้นตอน
//           </motion.p>
//         </div>

//         {/* Steps Timeline */}
//         <div className="relative flex flex-col gap-6">
//           {/* เส้นเชื่อมตรงกลาง (Timeline Line) */}
//           <div className="absolute left-[27px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-green-500/50 via-green-500/20 to-transparent" />

//           {steps.map((step, index) => (
//             <motion.div
//               key={step.id}
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: index * 0.1 }}
//               className="relative flex items-start gap-4 group"
//             >
//               {/* Step Number & Icon Circle */}
//               <div className="relative z-10 flex-shrink-0 w-14 h-14 rounded-2xl bg-[#0a0a0a] border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)] flex items-center justify-center group-hover:border-green-500/50 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300">
//                 <step.icon size={24} className="text-green-500" />
//                 {/* Badge เลขลำดับ */}
//                 <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-600 border-2 border-[#050505] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
//                   {step.id}
//                 </div>
//               </div>

//               {/* Text Card */}
//               <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
//                 <h3 className="text-base font-semibold text-green-400 mb-1">
//                   {step.title}
//                 </h3>
//                 <p className="text-xs text-gray-400 leading-relaxed">
//                   {step.desc}
//                 </p>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {/* CTA Button */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.6 }}
//           className="mt-12 text-center"
//         >
//           <Button
//             size="lg"
//             className="w-full h-12 rounded-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold shadow-lg shadow-green-900/20 group"
//             asChild
//           >
//             <Link
//               href="/products"
//               className="flex items-center justify-center gap-2"
//             >
//               เริ่มช้อปเลย
//               <ChevronRight
//                 size={18}
//                 className="group-hover:translate-x-1 transition-transform"
//               />
//             </Link>
//           </Button>

//           <p className="mt-4 text-xs text-gray-500">
//             ติดปัญหา?{" "}
//             <Link href="/contact" className="text-green-500 hover:underline">
//               ติดต่อแอดมิน
//             </Link>
//           </p>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import Link from "next/link";
// import { motion } from "framer-motion";
// import {
//   ShoppingBag,
//   ShoppingCart,
//   MapPin,
//   CreditCard,
//   PackageCheck,
//   ChevronRight,
//   Truck,
//   Wallet,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";

// export default function HowToOrderPage() {
//   const steps = [
//     {
//       id: 1,
//       icon: ShoppingBag,
//       title: "เลือกสินค้าที่ถูกใจ",
//       desc: "เลือกสายพันธุ์หรือสินค้าที่คุณต้องการ เลือกขนาดและจำนวน แล้วกดปุ่ม 'เพิ่มลงตะกร้า'",
//     },
//     {
//       id: 2,
//       icon: ShoppingCart,
//       title: "ตรวจสอบตะกร้าสินค้า",
//       desc: "กดที่ไอคอนตะกร้าเพื่อตรวจสอบรายการสินค้า แล้วกดปุ่ม 'ไปชำระเงิน' เพื่อดำเนินการต่อ",
//     },
//     {
//       id: 3,
//       icon: MapPin,
//       title: "ระบุที่อยู่จัดส่ง",
//       desc: "กรอกชื่อ เบอร์โทร และที่อยู่สำหรับจัดส่งให้ครบถ้วน เพื่อความรวดเร็วในการจัดส่ง",
//     },
//     {
//       id: 4,
//       icon: Wallet, // เปลี่ยนไอคอนเป็นกระเป๋าตังค์ให้สื่อถึงการจ่ายเงิน
//       title: "เลือกวิธีชำระเงิน",
//       // ✅ ไฮไลท์เงื่อนไขที่คุณต้องการตรงนี้
//       desc: (
//         <div className="flex flex-col gap-1 mt-1">
//           <span className="flex items-center gap-2 text-white/90">
//             <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
//             โอนจ่าย:{" "}
//             <span className="text-green-400 font-bold">ค่าส่ง 50฿</span>
//           </span>
//           <span className="flex items-center gap-2 text-white/90">
//             <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
//             เก็บปลายทาง:{" "}
//             <span className="text-orange-400 font-bold">มัดจำ 100฿</span>
//           </span>
//           <span className="text-[10px] text-gray-500 pl-4">
//             (ส่วนที่เหลือจ่ายตอนรับของ)
//           </span>
//         </div>
//       ),
//     },
//     {
//       id: 5,
//       icon: PackageCheck,
//       title: "รอรับสินค้า",
//       desc: "เมื่อแจ้งชำระ/มัดจำแล้ว รอรับสินค้าได้เลย เช็คสถานะได้ที่เมนู 'ติดตามพัสดุ'",
//     },
//   ];

//   return (
//     <div className="min-h-screen w-full bg-[#050505] text-white pt-24 pb-32 px-4 relative overflow-hidden">
//       {/* Background Glow */}
//       <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none" />
//       <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-500/5 blur-[120px] rounded-full pointer-events-none" />

//       <div className="max-w-lg mx-auto relative z-10">
//         {/* Header */}
//         <div className="text-center mb-10 space-y-2">
//           <motion.h1
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
//           >
//             วิธีการสั่งซื้อ
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.1 }}
//             className="text-gray-400 text-sm"
//           >
//             เงื่อนไขง่ายๆ สั่งซื้อได้ทันที
//           </motion.p>
//         </div>

//         {/* Timeline */}
//         <div className="relative flex flex-col gap-6">
//           {/* เส้นเชื่อม */}
//           <div className="absolute left-[27px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-green-500/50 via-green-500/20 to-transparent" />

//           {steps.map((step, index) => (
//             <motion.div
//               key={step.id}
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: index * 0.1 }}
//               className="relative flex items-start gap-4 group"
//             >
//               {/* Icon Circle */}
//               <div className="relative z-10 flex-shrink-0 w-14 h-14 rounded-2xl bg-[#0a0a0a] border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)] flex items-center justify-center group-hover:border-green-500/50 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300">
//                 <step.icon size={24} className="text-green-500" />
//                 <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-600 border-2 border-[#050505] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
//                   {step.id}
//                 </div>
//               </div>

//               {/* Text Card */}
//               <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
//                 <h3 className="text-base font-semibold text-green-400 mb-1">
//                   {step.title}
//                 </h3>
//                 <div className="text-xs text-gray-400 leading-relaxed">
//                   {step.desc}
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {/* Button */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.6 }}
//           className="mt-12 text-center"
//         >
//           <Button
//             size="lg"
//             className="w-full h-12 rounded-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold shadow-lg shadow-green-900/20 group"
//             asChild
//           >
//             <Link
//               href="/products"
//               className="flex items-center justify-center gap-2"
//             >
//               ไปเลือกสินค้า
//               <ChevronRight
//                 size={18}
//                 className="group-hover:translate-x-1 transition-transform"
//               />
//             </Link>
//           </Button>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  ShoppingCart,
  MapPin,
  PackageCheck,
  ChevronRight,
  ArrowLeft,
  MessageCircle,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowToOrderPage() {
  const steps = [
    {
      id: 1,
      icon: ShoppingBag,
      title: "เลือกสินค้าที่ถูกใจ",
      desc: "เลือกสายพันธุ์หรือสินค้าที่คุณต้องการ เลือกขนาดและจำนวน แล้วกดปุ่ม 'เพิ่มลงตะกร้า'",
    },
    {
      id: 2,
      icon: ShoppingCart,
      title: "ตรวจสอบตะกร้าสินค้า",
      desc: "กดที่ไอคอนตะกร้าเพื่อตรวจสอบรายการสินค้า แล้วกดปุ่ม 'ไปชำระเงิน' เพื่อดำเนินการต่อ",
    },
    {
      id: 3,
      icon: MapPin,
      title: "ระบุที่อยู่จัดส่ง",
      desc: "กรอกชื่อ เบอร์โทร และที่อยู่สำหรับจัดส่งให้ครบถ้วน เพื่อความรวดเร็วในการจัดส่ง",
    },
    {
      id: 4,
      icon: Wallet,
      title: "เลือกวิธีชำระเงิน",
      desc: (
        <div className="flex flex-col gap-1.5 mt-1.5 p-2.5 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-gray-200 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
              โอนจ่าย
            </span>
            <span className="text-green-400 font-bold text-xs">ค่าส่ง 50฿</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-gray-200 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]" />
              เก็บปลายทาง
            </span>
            <span className="text-orange-400 font-bold text-xs">
              มัดจำ 100฿
            </span>
          </div>
          <span className="text-[9px] text-gray-500 text-right mt-0.5">
            (ส่วนที่เหลือจ่ายตอนรับของ)
          </span>
        </div>
      ),
    },
    {
      id: 5,
      icon: PackageCheck,
      title: "รอรับสินค้า",
      desc: "เมื่อแจ้งชำระ/มัดจำแล้ว รอรับสินค้าได้เลย เช็คสถานะได้ที่เมนู 'ติดตามพัสดุ'",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white pb-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="fixed top-[-10%] left-[-10%] w-[300px] h-[300px] bg-green-500/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-green-500/5 blur-[80px] rounded-full pointer-events-none" />

      {/* Header: ลด Padding บน-ล่าง ให้บางลง (py-2) */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-3 py-2 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 -ml-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
          asChild
        >
          <Link href="/">
            <ArrowLeft size={18} />
          </Link>
        </Button>
        <h1 className="text-sm font-semibold tracking-wide text-gray-200">
          วิธีการสั่งซื้อ
        </h1>
        <div className="w-8" />
      </div>

      {/* Container: ตัด Padding-top ออก (pt-0) เพื่อดึงเนื้อหาขึ้นไปชิด Header */}
      <div className="max-w-md mx-auto px-4 pt-4 relative z-10">
        {/* Title Section: ลด Margin-bottom (mb-2) ให้ Timeline ขยับขึ้นมาหาหัวข้อ */}
        <div className="text-center mb-2">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
          >
            ขั้นตอนการสั่งซื้อ
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-[10px] mt-0.5"
          >
            ทำรายการง่ายๆ ใน 5 ขั้นตอน
          </motion.p>
        </div>

        {/* Timeline Container */}
        <div className="relative flex flex-col gap-3">
          {" "}
          {/* ลด gap ระหว่างข้อให้ชิดขึ้น */}
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-start gap-3 group"
            >
              {/* เส้นเชื่อมแบบใหม่ (ไม่วาดในข้อสุดท้าย) */}
              {index !== steps.length - 1 && (
                <div className="absolute left-[19px] top-0 bottom-[-12px] w-[1px] bg-green-500/30" />
              )}

              {/* Icon Circle */}
              <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-xl bg-[#0a0a0a] border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)] flex items-center justify-center group-hover:border-green-500/50 transition-all duration-300">
                <step.icon size={18} className="text-green-500" />
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-green-600 border border-[#050505] flex items-center justify-center text-[9px] font-bold text-white shadow-sm">
                  {step.id}
                </div>
              </div>

              {/* Text Card */}
              <div className="flex-1 p-2.5 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <h3 className="text-sm font-semibold text-green-400 mb-0.5">
                  {step.title}
                </h3>
                <div className="text-xs text-gray-300 leading-snug font-light opacity-90">
                  {step.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-4 grid grid-cols-5 gap-2 sticky bottom-4 pb-2 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent pt-4"
        >
          <Button
            variant="outline"
            className="col-span-2 h-10 rounded-lg border-white/10 bg-[#050505]/80 backdrop-blur-md text-gray-300 hover:text-white hover:bg-white/10 gap-1.5 text-[11px]"
            asChild
          >
            <Link href="/contact">
              <MessageCircle size={14} />
              แอดมิน
            </Link>
          </Button>

          <Button
            className="col-span-3 h-10 rounded-lg bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-xs font-bold text-white shadow-lg shadow-green-900/20 gap-1.5"
            asChild
          >
            <Link href="/products">
              เริ่มสั่งซื้อเลย
              <ChevronRight size={16} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
