// "use client";

// import { useState, useTransition } from "react";
// import Image from "next/image";
// import { ShoppingCart } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { formatPrice } from "@/lib/format-price";
// import { createSpinOrderAction } from "./actions";
// import { SpinPackage } from "@/generated/prisma/client";
// import SpinPaymentDialog from "./spin-payment-dialog";
// import { toast } from "sonner";

// interface SpinPackagesListProps {
//   packages: SpinPackage[];
// }

// export default function SpinPackagesList({ packages }: SpinPackagesListProps) {
//   const [selectedPackage, setSelectedPackage] = useState<SpinPackage | null>(
//     null
//   );
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [isPending, startTransition] = useTransition();

//   const handleBuyClick = (pkg: SpinPackage) => {
//     setSelectedPackage(pkg);
//     setIsDialogOpen(true);
//   };

//   const handlePaymentComplete = async (data: {
//     paymentMethod: "PROMPTPAY" | "MANUAL_TRANSFER";
//     slipUrl?: string;
//     slipFileId?: string;
//     amount: number;
//   }) => {
//     if (!selectedPackage) return;

//     startTransition(async () => {
//       const result = await createSpinOrderAction({
//         packageId: selectedPackage.id,
//         paymentMethod: data.paymentMethod,
//         slipUrl: data.slipUrl,
//         slipFileId: data.slipFileId,
//         amount: data.amount,
//       });

//       if (result.success) {
//         setIsDialogOpen(false);
//         setSelectedPackage(null);

//         // Show success message
//         toast.success("ส่งคำสั่งซื้อสำเร็จ!", {
//           description: "กรุณารอแอดมินตรวจสอบและอนุมัติ",
//           duration: 5000,
//         });

//         // Redirect to orders page
//         setTimeout(() => {
//           window.location.href = `/spin/orders`;
//         }, 1000);
//       } else {
//         toast.error(result.message || "เกิดข้อผิดพลาด");
//       }
//     });
//   };

//   if (packages.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-muted-foreground">ไม่มีแพคเกจสปินที่พร้อมใช้งาน</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//         {packages.map((pkg) => (
//           <div
//             key={pkg.id}
//             className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
//           >
//             <div className="relative aspect-video w-full">
//               <Image
//                 src={pkg.imageUrl}
//                 alt={pkg.name}
//                 fill
//                 className="object-cover"
//               />
//             </div>
//             <div className="p-3 sm:p-4">
//               <h3 className="text-lg sm:text-xl font-semibold mb-2">{pkg.name}</h3>
//               <div className="space-y-2 mb-3 sm:mb-4">
//                 <div className="flex justify-between text-sm sm:text-base">
//                   <span className="text-muted-foreground">จำนวนครั้งที่หมุน:</span>
//                   <span className="font-semibold">{pkg.spinAmount} ครั้ง</span>
//                 </div>
//                 <div className="flex justify-between text-base sm:text-lg">
//                   <span className="text-muted-foreground">ราคา:</span>
//                   <span className="font-bold text-primary">
//                     {formatPrice(pkg.price)}
//                   </span>
//                 </div>
//               </div>
//               <Button
//                 onClick={() => handleBuyClick(pkg)}
//                 className="w-full text-sm sm:text-base"
//                 disabled={isPending}
//                 size="sm"
//               >
//                 <ShoppingCart className="mr-2 h-4 w-4" />
//                 ซื้อแพคเกจ
//               </Button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {selectedPackage && (
//         <SpinPaymentDialog
//           open={isDialogOpen}
//           onOpenChange={setIsDialogOpen}
//           spinPackage={selectedPackage}
//           onPaymentComplete={handlePaymentComplete}
//           isPending={isPending}
//         />
//       )}
//     </>
//   );
// }

// "use client";

// import { useState, useTransition } from "react";
// import Image from "next/image";
// import { ShoppingCart, Zap, Tag, Star } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { formatPrice } from "@/lib/format-price";
// import { createSpinOrderAction } from "./actions";
// import { SpinPackage } from "@/generated/prisma/client";
// import SpinPaymentDialog from "./spin-payment-dialog";
// import { toast } from "sonner";

// interface SpinPackagesListProps {
//   packages: SpinPackage[];
// }

// export default function SpinPackagesList({ packages }: SpinPackagesListProps) {
//   const [selectedPackage, setSelectedPackage] = useState<SpinPackage | null>(
//     null,
//   );
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [isPending, startTransition] = useTransition();

//   const handleBuyClick = (pkg: SpinPackage) => {
//     setSelectedPackage(pkg);
//     setIsDialogOpen(true);
//   };

//   const handlePaymentComplete = async (data: {
//     paymentMethod: "PROMPTPAY" | "MANUAL_TRANSFER";
//     slipUrl?: string;
//     slipFileId?: string;
//     amount: number;
//   }) => {
//     if (!selectedPackage) return;

//     startTransition(async () => {
//       const result = await createSpinOrderAction({
//         packageId: selectedPackage.id,
//         paymentMethod: data.paymentMethod,
//         slipUrl: data.slipUrl,
//         slipFileId: data.slipFileId,
//         amount: data.amount,
//       });

//       if (result.success) {
//         setIsDialogOpen(false);
//         setSelectedPackage(null);
//         toast.success("ส่งคำสั่งซื้อสำเร็จ!", {
//           description: "กรุณารอแอดมินตรวจสอบและอนุมัติ",
//           duration: 5000,
//         });
//         setTimeout(() => {
//           window.location.href = `/spin/orders`;
//         }, 1000);
//       } else {
//         toast.error(result.message || "เกิดข้อผิดพลาด");
//       }
//     });
//   };

//   if (packages.length === 0) {
//     return (
//       <div className="text-center py-12 border-4 border-dashed border-slate-300 rounded-xl bg-slate-50">
//         <p className="text-muted-foreground font-bold text-lg">
//           ไม่มีแพคเกจสปินที่พร้อมใช้งาน
//         </p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {packages.map((pkg) => (
//           <div
//             key={pkg.id}
//             // --- 1. Container Style: ขอบมนนิดๆ ตามรูป แต่เส้นหนา+เงาแข็งแบบ Pixel ---
//             className="group relative flex flex-col p-3 bg-[#fffbf0] border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
//           >
//             {/* --- 2. Image Area: รูปภาพอยู่ในกรอบอีกที --- */}
//             <div className="relative aspect-square w-full rounded-lg overflow-hidden border-2 border-black mb-3 bg-white">
//               <Image
//                 src={pkg.imageUrl}
//                 alt={pkg.name}
//                 fill
//                 className="object-cover transition-transform duration-500 group-hover:scale-110"
//               />

//               {/* Badge: SALE (มุมซ้ายบน) */}
//               <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-sm border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
//                 <Tag className="w-3 h-3 fill-white" />
//                 HOT
//               </div>

//               {/* Badge: จำนวนสปิน (ลอยขวาล่าง เหมือนป้ายราคาในรูป) */}
//               <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
//                 <div className="flex items-center gap-1 text-xs font-bold text-black">
//                   <Zap className="w-3 h-3 fill-yellow-400 text-black" />
//                   {pkg.spinAmount} Spin
//                 </div>
//               </div>
//             </div>

//             {/* --- 3. Content Details --- */}
//             <div className="flex-1 flex flex-col space-y-2 px-1">
//               {/* Tag เขียวอ่อน (เหมือนป้าย 'อินดอร์' ในรูป) */}
//               <div className="w-fit">
//                 <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-600 rounded-md">
//                   แพคเกจสปิน
//                 </span>
//               </div>

//               {/* Title */}
//               <h3 className="text-lg font-black text-slate-900 truncate flex items-center gap-2">
//                 <Star className="w-4 h-4 fill-yellow-400 text-black" />
//                 {pkg.name}
//               </h3>

//               {/* Price Row (เลียนแบบแถวราคา) */}
//               <div className="mt-auto pt-2 space-y-1">
//                 <div className="flex items-center gap-2 text-xs font-bold text-slate-400 ml-1">
//                   <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
//                   ราคาสินค้า
//                 </div>
//                 <div className="flex items-baseline gap-2">
//                   {/* ราคาเดิม (สมมติว่าลดราคา - ใส่ขีดฆ่าเล่นๆ หรือคำนวณจริงถ้ามี) */}
//                   <span className="text-sm font-bold text-slate-400 line-through decoration-2">
//                     {/* ถ้าอยากโชว์ราคาหลอกๆ ให้บวกเพิ่มไป หรือเอาออกถ้าไม่ต้องการ */}
//                     {/* {formatPrice(pkg.price * 1.2)} */}
//                   </span>
//                   <span className="text-2xl font-black text-red-500 drop-shadow-sm">
//                     {formatPrice(pkg.price)}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* --- 4. Button: สีเขียวเข้ม เต็มใบ --- */}
//             <div className="mt-3">
//               <Button
//                 onClick={() => handleBuyClick(pkg)}
//                 disabled={isPending}
//                 className="w-full h-10 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[3px] transition-all"
//               >
//                 สั่งซื้อสินค้า
//               </Button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {selectedPackage && (
//         <SpinPaymentDialog
//           open={isDialogOpen}
//           onOpenChange={setIsDialogOpen}
//           spinPackage={selectedPackage}
//           onPaymentComplete={handlePaymentComplete}
//           isPending={isPending}
//         />
//       )}
//     </>
//   );
// }

"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Zap, Gamepad2 } from "lucide-react"; // ใช้ไอคอนชุดเดียวกับ Orders
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format-price";
import { createSpinOrderAction } from "./actions";
import { SpinPackage } from "@/generated/prisma/client";
import SpinPaymentDialog from "./spin-payment-dialog";
import { toast } from "sonner";

interface SpinPackagesListProps {
  packages: SpinPackage[];
}

export default function SpinPackagesList({ packages }: SpinPackagesListProps) {
  const [selectedPackage, setSelectedPackage] = useState<SpinPackage | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleBuyClick = (pkg: SpinPackage) => {
    setSelectedPackage(pkg);
    setIsDialogOpen(true);
  };

  const handlePaymentComplete = async (data: {
    paymentMethod: "PROMPTPAY" | "MANUAL_TRANSFER";
    slipUrl?: string;
    slipFileId?: string;
    amount: number;
  }) => {
    if (!selectedPackage) return;

    startTransition(async () => {
      const result = await createSpinOrderAction({
        packageId: selectedPackage.id,
        paymentMethod: data.paymentMethod,
        slipUrl: data.slipUrl,
        slipFileId: data.slipFileId,
        amount: data.amount,
      });

      if (result.success) {
        setIsDialogOpen(false);
        setSelectedPackage(null);
        toast.success("ส่งคำสั่งซื้อสำเร็จ!", {
          description: "กรุณารอแอดมินตรวจสอบและอนุมัติ",
          duration: 5000,
        });
        setTimeout(() => {
          window.location.href = `/spin/orders`;
        }, 1000);
      } else {
        toast.error(result.message || "เกิดข้อผิดพลาด");
      }
    });
  };

  if (packages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 border-4 border-black border-dashed rounded-xl bg-slate-50 text-center transform-gpu backface-hidden">
        <p className="text-slate-500 font-bold uppercase">
          NO PACKAGES AVAILABLE
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ✅ Grid 2 คอลัมน์ (เหมือนหน้า Orders) */}
      <div className="grid grid-cols-2 gap-4 pb-5">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            // ✅ ใช้ Card Style แบบเดียวกับหน้า Orders (แก้ Layout Shift แล้ว)
            className="group relative flex flex-col h-full bg-white border-[3px] border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200 transform-gpu backface-hidden will-change-transform hover:z-10"
          >
            {/* --- IMAGE AREA --- */}
            <div className="relative w-full aspect-square border-b-[3px] border-black overflow-hidden rounded-t-[9px] bg-slate-50">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:8px_8px] z-0"></div>

              <Image
                src={pkg.imageUrl}
                alt={pkg.name}
                fill
                className="object-cover z-0 group-hover:scale-110 transition-transform duration-500 ease-in-out"
                sizes="(max-width: 768px) 50vw, 33vw"
              />

              {/* Badge: SALE (มุมซ้ายบน) */}
              <div className="absolute top-2 left-2 z-10 bg-[#FF3366] text-white text-[10px] font-black px-2 py-0.5 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
                HOT
              </div>

              {/* Badge: Spins (มุมขวาล่าง) */}
              <div className="absolute bottom-2 right-2 z-10 bg-white text-black border-2 border-black px-2 py-0.5 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
                <Zap className="w-3 h-3 fill-yellow-400 text-black" />
                <span className="text-[10px] font-black">
                  {pkg.spinAmount} SPINS
                </span>
              </div>
            </div>

            {/* --- CONTENT AREA --- */}
            <div className="flex-1 flex flex-col p-3 bg-white rounded-b-lg relative overflow-hidden">
              {/* Pattern */}
              <div className="absolute top-0 right-0 w-12 h-12 bg-[radial-gradient(#ccc_1px,transparent_1px)] [background-size:4px_4px] opacity-50"></div>

              {/* Title */}
              <h3 className="font-black text-sm text-black leading-tight uppercase mb-3 line-clamp-2 group-hover:text-[#FF3366] transition-colors mt-1">
                {pkg.name}
              </h3>

              {/* Price Box (Dashed Border) */}
              <div className="mt-auto mb-3 bg-slate-50 border-2 border-black border-dashed rounded p-2 relative transform-gpu backface-hidden">
                <div className="absolute -top-2 -right-2 bg-[#FF3366] text-white text-[8px] font-bold px-1.5 py-0.5 border border-black rounded shadow-sm rotate-6 z-10">
                  SALE
                </div>
                <p className="text-[9px] font-bold text-slate-500 uppercase">
                  Price
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-black italic tracking-tighter">
                    {formatPrice(pkg.price)}
                  </span>
                  {/* ราคาหลอกๆ (x1.2) */}
                  <span className="text-[10px] text-slate-400 line-through font-bold decoration-red-500 decoration-2">
                    {formatPrice(pkg.price * 1.2)}
                  </span>
                </div>
              </div>

              {/* Button */}
              <Button
                onClick={() => handleBuyClick(pkg)}
                disabled={isPending}
                className="w-full h-10 bg-[#00FF94] hover:bg-[#00cc76] text-black font-black border-[3px] border-black rounded-lg shadow-[3px_3px_0px_0px_#000] active:shadow-none active:translate-y-[3px] transition-all uppercase text-xs flex items-center justify-center gap-2 relative overflow-hidden transform-gpu backface-hidden"
              >
                {/* Effect เงาวิ่ง */}
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <Gamepad2 className="w-4 h-4" /> BUY NOW
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedPackage && (
        <SpinPaymentDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          spinPackage={selectedPackage}
          onPaymentComplete={handlePaymentComplete}
          isPending={isPending}
        />
      )}
    </>
  );
}
