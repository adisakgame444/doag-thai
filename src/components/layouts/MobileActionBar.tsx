// "use client";

// import { MessageCircle, ShoppingCart } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { cn } from "@/lib/utils";
// import { formatPrice } from "@/lib/format-price";

// // 🟢 กำหนดว่า Component นี้ต้องรับค่าอะไรมาจากหน้าหลักบ้าง
// interface MobileActionBarProps {
//   replacementTargetId?: string;
//   isCodRestricted: boolean;
//   disableCartButton: boolean;
//   isPending: boolean;
//   isSoldOut: boolean;
//   totalPrice?: number;
//   handleAddToCart: () => void;
//   handleReplaceItem: () => void;
// }

// export default function MobileActionBar({
//   replacementTargetId,
//   isCodRestricted,
//   disableCartButton,
//   isPending,
//   isSoldOut,
//   totalPrice,
//   handleAddToCart,
//   handleReplaceItem,
// }: MobileActionBarProps) {
//   const router = useRouter();

//   return (
//     <div className="fixed bottom-0 left-0 right-0 z-50 flex h-[60px] bg-background shadow-[0_-4px_15px_rgba(0,0,0,0.05)] md:hidden pb-safe border-t border-border/50">

//       {/* ปุ่ม 1: แชทเลย */}
//       <button
//         className="flex flex-col items-center justify-center w-[20%] border-r border-border/50 text-emerald-600 dark:text-emerald-400 active:bg-muted/50 transition-colors"
//         onClick={() => {/* 💬 ใส่ลิงก์ไปหน้าแชท หรือ Line OA ตรงนี้ */}}
//       >
//         <MessageCircle strokeWidth={1.5} size={22} />
//         <span className="text-[10px] mt-0.5 font-medium text-muted-foreground">แชทเลย</span>
//       </button>

//       {/* ปุ่ม 2: ตะกร้า */}
//       <button
//         className="flex flex-col items-center justify-center w-[20%] border-r border-border/50 text-emerald-600 dark:text-emerald-400 active:bg-muted/50 transition-colors"
//         onClick={() => router.push("/cart")}
//       >
//         <ShoppingCart strokeWidth={1.5} size={22} />
//         <span className="text-[10px] mt-0.5 font-medium text-muted-foreground">รถเข็น</span>
//       </button>

//       {/* ปุ่ม 3: แอคชั่นหลัก (ซื้อเลย / เปลี่ยนสินค้า) */}
//       <div className="flex-1">
//         {replacementTargetId ? (
//           // โหมดเปลี่ยนสินค้า
//           <button
//             onClick={handleReplaceItem}
//             disabled={disableCartButton || isCodRestricted}
//             className={cn(
//               "w-full h-full flex flex-col items-center justify-center text-white transition-colors",
//               isCodRestricted
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-amber-600 active:bg-amber-700"
//             )}
//           >
//             <span className="font-semibold text-sm">
//               {isPending ? "กำลังดำเนินการ..." : "ยืนยันการเปลี่ยน"}
//             </span>
//             {isCodRestricted && (
//               <span className="text-[9px] opacity-80 mt-0.5">ไม่รองรับปลายทาง</span>
//             )}
//           </button>
//         ) : (
//           // โหมดซื้อปกติ
//           <button
//             onClick={handleAddToCart}
//             disabled={disableCartButton}
//             className="w-full h-full flex flex-col items-center justify-center text-white bg-emerald-600 active:bg-emerald-700 disabled:bg-muted-foreground transition-colors"
//           >
//             <span className="font-semibold text-sm">
//               {isPending ? "กำลังดำเนินการ..." : isSoldOut ? "สินค้าหมด" : "เพิ่มไปยังรถเข็น"}
//             </span>
//             {!isSoldOut && typeof totalPrice === "number" && (
//               <span className="text-[10px] opacity-90 mt-0.5 font-medium">
//                 {formatPrice(totalPrice)}
//               </span>
//             )}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { MessageCircle, ShoppingCart, X, Minus, Plus } from "lucide-react";
// import { cn } from "@/lib/utils";

// // 🟢 1. รับข้อมูลที่จำเป็นสำหรับ Drawer เพิ่มเข้ามา
// interface MobileActionBarProps {
//   replacementTargetId?: string;
//   isCodRestricted: boolean;
//   disableCartButton: boolean;
//   isPending: boolean;
//   isSoldOut: boolean;
//   handleAddToCart: () => void;
//   handleReplaceItem: () => void;

//   // -- ข้อมูลสำหรับ Drawer --
//   productTitle: string;
//   displayImage: string;
//   unitPriceLabel: string;
//   stock: number;
//   productType: "UNIT" | "WEIGHT";
//   preparedWeightOptions: any[];
//   selectedWeightId: string | null;
//   setSelectedWeightId: (id: string) => void;
//   quantity: number;
//   maxQuantity: number;
//   incrementQuantity: () => void;
//   decrementQuantity: () => void;
// }

// export default function MobileActionBar({
//   replacementTargetId,
//   isCodRestricted,
//   disableCartButton,
//   isPending,
//   isSoldOut,
//   handleAddToCart,
//   handleReplaceItem,
//   productTitle,
//   displayImage,
//   unitPriceLabel,
//   stock,
//   productType,
//   preparedWeightOptions,
//   selectedWeightId,
//   setSelectedWeightId,
//   quantity,
//   maxQuantity,
//   incrementQuantity,
//   decrementQuantity,
// }: MobileActionBarProps) {
//   // 🟢 2. ย้าย State เปิด/ปิด Drawer มาไว้ที่ไฟล์นี้เลย
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

//   return (
//     <>
//       {/* 🟢 ส่วนที่ 1: แถบเมนูด้านล่าง (Shopee Style) */}
//       <div className="fixed bottom-0 left-0 right-0 z-40 flex h-[60px] bg-background shadow-[0_-4px_15px_rgba(0,0,0,0.05)] md:hidden pb-safe border-t border-border/50">
//         {/* แชทเลย */}
//         <button className="flex flex-col items-center justify-center w-[20%] border-r border-border/50 text-[#EE4D2D] active:bg-muted/50 transition-colors">
//           <MessageCircle strokeWidth={1.5} size={22} />
//           <span className="text-[10px] mt-0.5 font-medium text-muted-foreground">
//             แชทเลย
//           </span>
//         </button>

//         {/* รถเข็น (กดแล้วเพิ่มลงตะกร้าเลย) */}
//         <button
//           className="flex flex-col items-center justify-center w-[20%] border-r border-border/50 text-[#EE4D2D] active:bg-muted/50 transition-colors disabled:opacity-50"
//           onClick={handleAddToCart}
//           disabled={disableCartButton}
//         >
//           <ShoppingCart strokeWidth={1.5} size={22} />
//           <span className="text-[10px] mt-0.5 font-medium text-muted-foreground">
//             เพิ่มรถเข็น
//           </span>
//         </button>

//         {/* ซื้อเลย (กดแล้วเปิด Drawer) */}
//         <div className="flex-1">
//           {replacementTargetId ? (
//             <button
//               onClick={() => setIsDrawerOpen(true)}
//               disabled={disableCartButton || isCodRestricted}
//               className={cn(
//                 "w-full h-full flex flex-col items-center justify-center text-white transition-colors",
//                 isCodRestricted
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-amber-600 active:bg-amber-700",
//               )}
//             >
//               <span className="font-semibold text-sm">ยืนยันการเปลี่ยน</span>
//             </button>
//           ) : (
//             <button
//               onClick={() => setIsDrawerOpen(true)}
//               className="w-full h-full flex flex-col items-center justify-center text-white bg-[#EE4D2D] active:bg-[#EE4D2D]/90 transition-colors"
//             >
//               <span className="font-semibold text-sm">
//                 {isSoldOut ? "สินค้าหมด" : "ซื้อเลย"}
//               </span>
//             </button>
//           )}
//         </div>
//       </div>

//       {/* 🟢 ส่วนที่ 2: กล่อง Slide-up (Drawer) ย้ายมาอยู่ที่นี่เลย */}
//       {isDrawerOpen && (
//         <>
//           <div
//             className="fixed inset-0 z-[60] bg-black/50 transition-opacity md:hidden"
//             onClick={() => setIsDrawerOpen(false)}
//           />
//           <div className="fixed bottom-0 left-0 right-0 z-[70] rounded-t-2xl bg-background p-4 pb-safe animate-in slide-in-from-bottom-full duration-300 md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
//             <button
//               onClick={() => setIsDrawerOpen(false)}
//               className="absolute right-4 top-4 rounded-full p-1 hover:bg-muted"
//             >
//               <X size={20} className="text-muted-foreground" />
//             </button>

//             <div className="flex gap-4 border-b border-border/50 pb-4">
//               <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-border/50 bg-muted">
//                 <Image
//                   src={displayImage}
//                   alt={productTitle}
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//               <div className="flex flex-col justify-end pb-1">
//                 <div className="text-xl font-bold text-[#EE4D2D] dark:text-emerald-400">
//                   {unitPriceLabel}
//                 </div>
//                 <div className="text-sm text-muted-foreground mt-1">
//                   คลัง: {stock.toLocaleString()}
//                 </div>
//               </div>
//             </div>

//             <div className="max-h-[50vh] overflow-y-auto py-4">
//               <div className="mb-3 text-sm font-medium">
//                 {productType === "UNIT" ? "ตัวเลือกสินค้า" : "ขนาด/น้ำหนัก"}
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {preparedWeightOptions.map((option) => {
//                   const isSelected = selectedWeightId === option.id;
//                   return (
//                     <button
//                       key={option.id}
//                       onClick={() => setSelectedWeightId(option.id)}
//                       className={cn(
//                         "rounded-md border px-4 py-1.5 text-sm transition-colors",
//                         isSelected
//                           ? "border-[#EE4D2D] text-[#EE4D2D] bg-[#EE4D2D]/5 dark:border-emerald-500 dark:text-emerald-400 dark:bg-emerald-500/10"
//                           : "border-border/60 bg-muted/20 text-foreground hover:bg-muted/50",
//                       )}
//                     >
//                       {option.displayName}
//                     </button>
//                   );
//                 })}
//               </div>

//               <div className="mt-6 flex items-center justify-between">
//                 <div className="text-sm font-medium">จำนวน</div>
//                 <div className="flex items-center rounded-md border border-border/60">
//                   <button
//                     onClick={decrementQuantity}
//                     disabled={quantity <= 1 || maxQuantity <= 0}
//                     className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-50"
//                   >
//                     <Minus size={14} />
//                   </button>
//                   <div className="flex h-8 w-12 items-center justify-center border-l border-r border-border/60 text-sm font-medium">
//                     {quantity}
//                   </div>
//                   <button
//                     onClick={incrementQuantity}
//                     disabled={quantity >= maxQuantity || maxQuantity <= 0}
//                     className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-50"
//                   >
//                     <Plus size={14} />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-2 pt-2 border-t border-border/50">
//               <button
//                 onClick={() => {
//                   if (replacementTargetId) {
//                     handleReplaceItem();
//                   } else {
//                     handleAddToCart();
//                   }
//                   setIsDrawerOpen(false);
//                 }}
//                 disabled={disableCartButton}
//                 className="w-full rounded-md bg-[#EE4D2D] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#EE4D2D]/90 disabled:bg-muted-foreground dark:bg-emerald-600 dark:hover:bg-emerald-700"
//               >
//                 {isPending ? "กำลังดำเนินการ..." : "ยืนยัน"}
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// }

// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { MessageCircle, ShoppingCart, X, Minus, Plus } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface MobileActionBarProps {
//   replacementTargetId?: string;
//   isCodRestricted: boolean;
//   disableCartButton: boolean;
//   isPending: boolean;
//   isSoldOut: boolean;
//   handleAddToCart: () => void;
//   handleReplaceItem: () => void;
//   productTitle: string;
//   displayImage: string;
//   unitPriceLabel: string;
//   stock: number;
//   productType: "UNIT" | "WEIGHT";
//   preparedWeightOptions: any[];
//   selectedWeightId: string | null;
//   setSelectedWeightId: (id: string) => void;
//   quantity: number;
//   maxQuantity: number;
//   incrementQuantity: () => void;
//   decrementQuantity: () => void;
// }

// export default function MobileActionBar({
//   replacementTargetId,
//   isCodRestricted,
//   disableCartButton,
//   isPending,
//   isSoldOut,
//   handleAddToCart,
//   handleReplaceItem,
//   productTitle,
//   displayImage,
//   unitPriceLabel,
//   stock,
//   productType,
//   preparedWeightOptions,
//   selectedWeightId,
//   setSelectedWeightId,
//   quantity,
//   maxQuantity,
//   incrementQuantity,
//   decrementQuantity,
// }: MobileActionBarProps) {
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   // 🟢 1. เพิ่ม State ตัวนี้เพื่อจำว่าเปิด Drawer มาจากโหมดไหน ("cart" หรือ "buy")
//   const [drawerMode, setDrawerMode] = useState<"cart" | "buy">("buy");

//   // 🟢 2. ฟังก์ชันช่วยกำหนดข้อความปุ่มใน Drawer ให้ตรงกับโหมด
//   const getDrawerButtonText = () => {
//     if (isPending) return "กำลังดำเนินการ...";
//     if (replacementTargetId) return "ยืนยันการเปลี่ยนสินค้า";
//     if (drawerMode === "cart") return "เพิ่มลงรถเข็น";
//     return "ซื้อเลย";
//   };

//   return (
//     <>
//       <div className="fixed bottom-0 left-0 right-0 z-40 flex h-[60px] bg-background shadow-[0_-4px_15px_rgba(0,0,0,0.05)] md:hidden pb-safe border-t border-border/50">
//         {/* แชทเลย */}
//         <button className="flex flex-col items-center justify-center w-[20%] border-r border-border/50 text-[#EE4D2D] active:bg-muted/50 transition-colors">
//           <MessageCircle strokeWidth={1.5} size={22} />
//           <span className="text-[10px] mt-0.5 font-medium text-muted-foreground">
//             แชทเลย
//           </span>
//         </button>

//         {/* 🟢 3. ปุ่มรถเข็น: กดปุ๊บตั้งค่า Mode เป็น "cart" แล้วเปิดสไลด์ */}
//         <button
//           className="flex flex-col items-center justify-center w-[20%] border-r border-border/50 text-[#EE4D2D] active:bg-muted/50 transition-colors disabled:opacity-50"
//           onClick={() => {
//             setDrawerMode("cart");
//             setIsDrawerOpen(true);
//           }}
//           disabled={disableCartButton && !isDrawerOpen} // กันการกดถ้าระบบโหลดอยู่
//         >
//           <ShoppingCart strokeWidth={1.5} size={22} />
//           <span className="text-[10px] mt-0.5 font-medium text-muted-foreground">
//             เพิ่มรถเข็น
//           </span>
//         </button>

//         {/* 🟢 4. ปุ่มซื้อเลย: กดปุ๊บตั้งค่า Mode เป็น "buy" แล้วเปิดสไลด์ */}
//         <div className="flex-1">
//           {replacementTargetId ? (
//             <button
//               onClick={() => setIsDrawerOpen(true)} // โหมดเคลมสินค้ามีโหมดเดียว ไม่ต้องเซ็ตแยก
//               disabled={disableCartButton || isCodRestricted}
//               className={cn(
//                 "w-full h-full flex flex-col items-center justify-center text-white transition-colors",
//                 isCodRestricted
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-amber-600 active:bg-amber-700",
//               )}
//             >
//               <span className="font-semibold text-sm">ยืนยันการเปลี่ยน</span>
//             </button>
//           ) : (
//             <button
//               onClick={() => {
//                 setDrawerMode("buy");
//                 setIsDrawerOpen(true);
//               }}
//               className="w-full h-full flex flex-col items-center justify-center text-white bg-[#EE4D2D] active:bg-[#EE4D2D]/90 transition-colors"
//             >
//               <span className="font-semibold text-sm">
//                 {isSoldOut ? "สินค้าหมด" : "ซื้อเลย"}
//               </span>
//             </button>
//           )}
//         </div>
//       </div>

//       {/* กล่อง Slide-up (Drawer) */}
//       {isDrawerOpen && (
//         <>
//           <div
//             className="fixed inset-0 z-[60] bg-black/50 transition-opacity md:hidden"
//             onClick={() => setIsDrawerOpen(false)}
//           />
//           <div className="fixed bottom-0 left-0 right-0 z-[70] rounded-t-2xl bg-background p-4 pb-safe animate-in slide-in-from-bottom-full duration-300 md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
//             <button
//               onClick={() => setIsDrawerOpen(false)}
//               className="absolute right-4 top-4 rounded-full p-1 hover:bg-muted"
//             >
//               <X size={20} className="text-muted-foreground" />
//             </button>

//             <div className="flex gap-4 border-b border-border/50 pb-4">
//               <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-border/50 bg-muted">
//                 <Image
//                   src={displayImage}
//                   alt={productTitle}
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//               <div className="flex flex-col justify-end pb-1">
//                 <div className="text-xl font-bold text-[#EE4D2D] dark:text-emerald-400">
//                   {unitPriceLabel}
//                 </div>
//                 <div className="text-sm text-muted-foreground mt-1">
//                   คลัง: {stock.toLocaleString()}
//                 </div>
//               </div>
//             </div>

//             <div className="max-h-[50vh] overflow-y-auto py-4">
//               <div className="mb-3 text-sm font-medium">
//                 {productType === "UNIT" ? "ตัวเลือกสินค้า" : "ขนาด/น้ำหนัก"}
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {preparedWeightOptions.map((option) => {
//                   const isSelected = selectedWeightId === option.id;
//                   return (
//                     <button
//                       key={option.id}
//                       onClick={() => setSelectedWeightId(option.id)}
//                       className={cn(
//                         "rounded-md border px-4 py-1.5 text-sm transition-colors",
//                         isSelected
//                           ? "border-[#EE4D2D] text-[#EE4D2D] bg-[#EE4D2D]/5 dark:border-emerald-500 dark:text-emerald-400 dark:bg-emerald-500/10"
//                           : "border-border/60 bg-muted/20 text-foreground hover:bg-muted/50",
//                       )}
//                     >
//                       {option.displayName}
//                     </button>
//                   );
//                 })}
//               </div>

//               <div className="mt-6 flex items-center justify-between">
//                 <div className="text-sm font-medium">จำนวน</div>
//                 <div className="flex items-center rounded-md border border-border/60">
//                   <button
//                     onClick={decrementQuantity}
//                     disabled={quantity <= 1 || maxQuantity <= 0}
//                     className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-50"
//                   >
//                     <Minus size={14} />
//                   </button>
//                   <div className="flex h-8 w-12 items-center justify-center border-l border-r border-border/60 text-sm font-medium">
//                     {quantity}
//                   </div>
//                   <button
//                     onClick={incrementQuantity}
//                     disabled={quantity >= maxQuantity || maxQuantity <= 0}
//                     className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-50"
//                   >
//                     <Plus size={14} />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* 🟢 5. ปุ่มยืนยันด้านล่างสุด */}
//             <div className="mt-2 pt-2 border-t border-border/50">
//               <button
//                 onClick={() => {
//                   if (replacementTargetId) {
//                     handleReplaceItem();
//                   } else {
//                     handleAddToCart();
//                     // อนาคตถ้าอยากให้กด "ซื้อเลย" แล้วเด้งไปหน้า Checkout อัตโนมัติ สามารถมาเพิ่ม Logic ตรงนี้ได้ครับ:
//                     // if (drawerMode === "buy") { router.push('/checkout'); }
//                   }
//                   setIsDrawerOpen(false);
//                 }}
//                 disabled={disableCartButton}
//                 className="w-full rounded-md bg-[#EE4D2D] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#EE4D2D]/90 disabled:bg-muted-foreground dark:bg-emerald-600 dark:hover:bg-emerald-700"
//               >
//                 {/* ดึงข้อความปุ่มมาจากฟังก์ชันด้านบน */}
//                 {getDrawerButtonText()}
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// }

// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { MessageCircle, ShoppingCart, X, Minus, Plus } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { formatPrice } from "@/lib/format-price"; // 🟢 1. Import formatPrice แก้ Error ตรงนี้ครับ

// interface MobileActionBarProps {
//   replacementTargetId?: string;
//   isCodRestricted: boolean;
//   disableCartButton: boolean;
//   isPending: boolean;
//   isSoldOut: boolean;
//   handleAddToCart: () => void;
//   handleReplaceItem: () => void;
//   productTitle: string;
//   displayImage: string;
//   unitPriceLabel: string;
//   stock: number;
//   productType: "UNIT" | "WEIGHT";
//   unitLabel: string; // 🟢 รับคำว่า "ขวด", "กรัม" มาใช้คำนวณ
//   preparedWeightOptions: any[];
//   selectedWeightId: string | null;
//   setSelectedWeightId: (id: string) => void;
//   quantity: number;
//   maxQuantity: number;
//   incrementQuantity: () => void;
//   decrementQuantity: () => void;
//   basePriceLabel: string | null;
//   discountPercent: number;
//   totalPrice?: number; // 🟢 2. เพิ่ม totalPrice ตรงนี้
// }

// export default function MobileActionBar({
//   replacementTargetId,
//   isCodRestricted,
//   disableCartButton,
//   isPending,
//   isSoldOut,
//   handleAddToCart,
//   handleReplaceItem,
//   productTitle,
//   displayImage,
//   unitPriceLabel,
//   stock,
//   productType,
//   unitLabel,
//   preparedWeightOptions,
//   selectedWeightId,
//   setSelectedWeightId,
//   quantity,
//   maxQuantity,
//   incrementQuantity,
//   decrementQuantity,
//   basePriceLabel,
//   discountPercent,
//   totalPrice, // 🟢 3. และรับค่า totalPrice ตรงนี้
// }: MobileActionBarProps) {
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [drawerMode, setDrawerMode] = useState<"cart" | "buy">("buy");

//   const getDrawerButtonText = () => {
//     if (isPending) return "กำลังดำเนินการ...";
//     if (replacementTargetId) return "ยืนยันการเปลี่ยนสินค้า";
//     if (drawerMode === "cart") return "เพิ่มลงรถเข็น";
//     return "ซื้อเลย";
//   };

//   // 🟢 ดึงข้อมูลตัวเลือกที่กำลังเลือกอยู่ เพื่อเอาไปแสดงในกล่องสรุปด้านล่าง
//   const selectedWeight =
//     preparedWeightOptions.find((opt) => opt.id === selectedWeightId) ?? null;

//   return (
//     <>
//       {/* --------------------------------------------------- */}
//       {/* ส่วนที่ 1: แถบเมนูด้านล่าง (Shopee Style) */}
//       {/* --------------------------------------------------- */}
//       <div className="fixed bottom-0 left-0 right-0 z-40 flex h-[60px] bg-background shadow-[0_-4px_15px_rgba(0,0,0,0.05)] md:hidden pb-safe border-t border-border/50">
//         <button className="flex flex-col items-center justify-center w-[20%] border-r border-border/50 text-[#EE4D2D] active:bg-muted/50 transition-colors">
//           <MessageCircle strokeWidth={1.5} size={22} />
//           <span className="text-[10px] mt-0.5 font-medium text-muted-foreground">
//             แชทเลย
//           </span>
//         </button>

//         <button
//           className="flex flex-col items-center justify-center w-[20%] border-r border-border/50 text-[#EE4D2D] active:bg-muted/50 transition-colors disabled:opacity-50"
//           onClick={() => {
//             setDrawerMode("cart");
//             setIsDrawerOpen(true);
//           }}
//           disabled={disableCartButton && !isDrawerOpen}
//         >
//           <ShoppingCart strokeWidth={1.5} size={22} />
//           <span className="text-[10px] mt-0.5 font-medium text-muted-foreground">
//             เพิ่มรถเข็น
//           </span>
//         </button>

//         <div className="flex-1">
//           {replacementTargetId ? (
//             <button
//               onClick={() => setIsDrawerOpen(true)}
//               disabled={disableCartButton || isCodRestricted}
//               className={cn(
//                 "w-full h-full flex flex-col items-center justify-center text-white transition-colors",
//                 isCodRestricted
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-amber-600 active:bg-amber-700",
//               )}
//             >
//               <span className="font-semibold text-sm">ยืนยันการเปลี่ยน</span>
//             </button>
//           ) : (
//             <button
//               onClick={() => {
//                 setDrawerMode("buy");
//                 setIsDrawerOpen(true);
//               }}
//               className="w-full h-full flex flex-col items-center justify-center text-white bg-[#EE4D2D] active:bg-[#EE4D2D]/90 transition-colors"
//             >
//               <span className="font-semibold text-sm">
//                 {isSoldOut ? "สินค้าหมด" : "ซื้อเลย"}
//               </span>
//             </button>
//           )}
//         </div>
//       </div>

//       {/* --------------------------------------------------- */}
//       {/* ส่วนที่ 2: กล่องสไลด์ (Drawer) เมื่อกดปุ่ม */}
//       {/* --------------------------------------------------- */}
//       {isDrawerOpen && (
//         <>
//           {/* พื้นหลังสีดำจางๆ */}
//           <div
//             className="fixed inset-0 z-[60] bg-black/50 transition-opacity md:hidden"
//             onClick={() => setIsDrawerOpen(false)}
//           />

//           {/* ตัวกล่อง Drawer */}
//           <div className="fixed bottom-0 left-0 right-0 z-[70] flex flex-col max-h-[85vh] rounded-t-2xl bg-background p-4 pb-safe animate-in slide-in-from-bottom-full duration-300 md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
//             <button
//               onClick={() => setIsDrawerOpen(false)}
//               className="absolute right-4 top-4 z-10 rounded-full p-1 hover:bg-muted"
//             >
//               <X size={20} className="text-muted-foreground" />
//             </button>

//             {/* --- 2.1 ส่วนหัว: รูป, ราคา, ส่วนลด, สต็อก --- */}
//             <div className="flex shrink-0 gap-4 border-b border-border/50 pb-4 mt-2">
//               <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-border/50 bg-muted">
//                 <Image
//                   src={displayImage}
//                   alt={productTitle}
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//               <div className="flex flex-col justify-end pb-1 pr-6">
//                 <div className="flex flex-wrap items-center gap-2">
//                   <div className="text-xl font-bold text-[#EE4D2D] dark:text-emerald-400">
//                     {unitPriceLabel}
//                   </div>
//                   {discountPercent > 0 && (
//                     <span className="whitespace-nowrap rounded-sm bg-[#EE4D2D]/10 px-1 py-0.5 text-[10px] font-semibold text-[#EE4D2D]">
//                       ลด {discountPercent}%
//                     </span>
//                   )}
//                 </div>
//                 {basePriceLabel && (
//                   <div className="mt-0.5 text-xs text-muted-foreground line-through">
//                     {basePriceLabel}
//                   </div>
//                 )}
//                 <div className="mt-1 text-sm text-muted-foreground">
//                   คลัง: {stock.toLocaleString()}
//                 </div>
//               </div>
//             </div>

//             {/* --- 2.2 ส่วนเนื้อหาที่ Scroll ได้ --- */}
//             <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
//               {/* เลือกตัวเลือกสินค้า */}
//               <div className="mb-3 text-sm font-medium">
//                 {productType === "UNIT" ? "ตัวเลือกสินค้า" : "ขนาด/น้ำหนัก"}
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {preparedWeightOptions.map((option) => {
//                   const isSelected = selectedWeightId === option.id;
//                   return (
//                     <button
//                       key={option.id}
//                       onClick={() => setSelectedWeightId(option.id)}
//                       className={cn(
//                         "relative flex min-h-[48px] flex-col items-center justify-center rounded-md border px-4 py-1.5 text-sm transition-colors",
//                         isSelected
//                           ? "border-[#EE4D2D] bg-[#EE4D2D]/5 text-[#EE4D2D] dark:border-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400"
//                           : "border-border/60 bg-muted/20 text-foreground hover:bg-muted/50",
//                       )}
//                     >
//                       {/* --- บรรทัดบน: ชื่อตัวเลือก + ป้ายลด % --- */}
//                       <div className="flex items-center gap-1.5">
//                         <span className="font-medium">
//                           {option.displayName}
//                         </span>
//                         {option.hasDiscount && (
//                           <span
//                             className={cn(
//                               "rounded-sm px-1 py-0.5 text-[9px] font-semibold whitespace-nowrap",
//                               isSelected
//                                 ? "bg-[#EE4D2D]/20 text-[#EE4D2D] dark:bg-emerald-500/20 dark:text-emerald-400"
//                                 : "bg-destructive/10 text-destructive",
//                             )}
//                           >
//                             ลด {option.discount}%
//                           </span>
//                         )}
//                       </div>

//                       {/* --- 🟢 บรรทัดล่าง: ราคาขายจริง (ถูกลดแล้ว) + ราคาเต็ม (ขีดฆ่า) --- */}
//                       <div className="mt-0.5 flex items-center gap-1.5 text-[11px]">
//                         {/* ราคาขายที่ลดแล้ว */}
//                         <span
//                           className={cn(
//                             "font-bold",
//                             isSelected
//                               ? "text-[#EE4D2D] dark:text-emerald-400"
//                               : "text-muted-foreground",
//                           )}
//                         >
//                           {option.priceLabel}
//                         </span>

//                         {/* ราคาเต็ม (โชว์แบบขีดฆ่าเฉพาะตอนที่มีส่วนลด) */}
//                         {option.showBasePrice && (
//                           <span className="text-[9px] text-muted-foreground line-through opacity-70">
//                             {option.basePriceLabel}
//                           </span>
//                         )}
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>

//               {/* เลือกจำนวน */}
//               <div className="mt-6 flex items-center justify-between">
//                 <div className="text-sm font-medium">จำนวน</div>
//                 <div className="flex items-center rounded-md border border-border/60">
//                   <button
//                     onClick={decrementQuantity}
//                     disabled={quantity <= 1 || maxQuantity <= 0}
//                     className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-50"
//                   >
//                     <Minus size={14} />
//                   </button>
//                   <div className="flex h-8 w-12 items-center justify-center border-l border-r border-border/60 text-sm font-medium">
//                     {quantity}
//                   </div>
//                   <button
//                     onClick={incrementQuantity}
//                     disabled={quantity >= maxQuantity || maxQuantity <= 0}
//                     className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-50"
//                   >
//                     <Plus size={14} />
//                   </button>
//                 </div>
//               </div>

//               {/* 🟢🟢 2.3 กล่องสรุป PRODUCT DETAIL (แบบในรูปภาพเป๊ะๆ) 🟢🟢 */}
//               <div className="mt-6 space-y-3 rounded-2xl border border-border/60 bg-muted/40 px-4 py-4">
//                 <div className="relative overflow-hidden rounded-xl border border-border/60 bg-background/50 p-4 backdrop-blur-sm">
//                   {/* แสง Decoration พื้นหลัง */}
//                   <div className="absolute -mr-4 -mt-4 right-0 top-0 h-24 w-24 rounded-full bg-emerald-500/5 blur-2xl" />

//                   <div className="relative">
//                     <p className="mb-2 text-[8px] font-semibold uppercase tracking-wider text-muted-foreground/80">
//                       Product Detail
//                     </p>

//                     <div className="flex flex-col gap-3">
//                       {/* ชื่อสินค้า */}
//                       <h3 className="truncate text-sm font-medium text-foreground flex items-center gap-1.5">
//                         <span className="text-base">🛍️</span> {productTitle}
//                       </h3>

//                       {/* 3 ช่องเล็ก (ขนาด, จำนวน, รวมสุทธิ) */}
//                       <div className="flex flex-wrap gap-1.5">
//                         {/* ช่องที่ 1: ขนาด */}
//                         <div className="flex flex-1 flex-col items-center justify-center rounded-md border border-border/30 bg-background/40 px-2 py-1.5">
//                           <span className="whitespace-nowrap text-[9px] text-muted-foreground">
//                             {productType === "UNIT" ? "ตัวเลือก" : "ขนาด"}
//                           </span>
//                           <span className="mt-0.5 whitespace-nowrap text-center text-[10px] font-medium leading-tight text-foreground">
//                             {selectedWeight
//                               ? productType === "UNIT"
//                                 ? `${selectedWeight.name} ${unitLabel}`
//                                 : `${selectedWeight.weight.toLocaleString()} ${unitLabel}`
//                               : "-"}
//                           </span>
//                         </div>

//                         {/* ช่องที่ 2: จำนวน */}
//                         <div className="flex flex-1 flex-col items-center justify-center rounded-md border border-emerald-100/50 bg-emerald-50/50 px-2 py-1.5 dark:border-emerald-500/20 dark:bg-emerald-500/10">
//                           <span className="whitespace-nowrap text-[9px] text-muted-foreground">
//                             จำนวน
//                           </span>
//                           <span className="mt-0.5 whitespace-nowrap text-[12px] font-bold leading-tight text-emerald-600 dark:text-emerald-400">
//                             x {quantity.toLocaleString()}
//                           </span>
//                         </div>

//                         {/* ช่องที่ 3: รวมสุทธิ */}
//                         <div className="flex flex-1 flex-col items-center justify-center rounded-md border border-border/30 bg-background/40 px-2 py-1.5">
//                           <span className="whitespace-nowrap text-[9px] text-muted-foreground">
//                             รวมสุทธิ
//                           </span>
//                           <span className="mt-0.5 whitespace-nowrap text-center text-[10px] font-medium leading-tight text-foreground">
//                             {selectedWeight
//                               ? productType === "UNIT"
//                                 ? (
//                                     Number(selectedWeight.name ?? 0) * quantity
//                                   ).toLocaleString()
//                                 : (
//                                     selectedWeight.weight * quantity
//                                   ).toLocaleString()
//                               : 0}
//                             <span className="ml-0.5 text-[9px] text-muted-foreground">
//                               {unitLabel}
//                             </span>
//                           </span>
//                         </div>
//                       </div>

//                       {/* 🟢🟢 แถบสรุปยอดชำระรวม (Total Price) เพิ่มตรงนี้ 🟢🟢 */}
//                       {typeof totalPrice === "number" && (
//                         <div className="mt-1 flex items-end justify-between rounded-xl border border-emerald-100/50 bg-emerald-50/50 px-4 py-3 dark:border-emerald-900/30 dark:bg-emerald-950/20">
//                           <div className="flex flex-col">
//                             <span className="text-[10px] font-medium text-emerald-600/70 dark:text-emerald-400/70">
//                               ยอดชำระรวม
//                             </span>
//                             <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
//                               Total Price
//                             </span>
//                           </div>
//                           <div className="flex items-baseline gap-1">
//                             {/* ดึง formatPrice มาใช้ เพื่อให้มีลูกน้ำหลักพัน */}
//                             <span className="text-2xl font-bold leading-none text-emerald-600 dark:text-emerald-400">
//                               {formatPrice(totalPrice).replace("฿", "")}
//                             </span>
//                             <span className="text-[10px] font-medium text-emerald-600/70 dark:text-emerald-400/70">
//                               THB
//                             </span>
//                           </div>
//                         </div>
//                       )}
//                       {/* 🟢🟢 สิ้นสุดแถบยอดชำระรวม 🟢🟢 */}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {/* 🟢🟢 จบกล่องสรุป 🟢🟢 */}
//             </div>

//             {/* --- 2.4 ปุ่มยืนยันด้านล่างสุด --- */}
//             <div className="shrink-0 border-t border-border/50 pt-3">
//               <button
//                 onClick={() => {
//                   if (replacementTargetId) {
//                     handleReplaceItem();
//                   } else {
//                     handleAddToCart();
//                   }
//                   setIsDrawerOpen(false);
//                 }}
//                 disabled={disableCartButton}
//                 className="w-full rounded-md bg-[#EE4D2D] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#EE4D2D]/90 disabled:bg-muted-foreground dark:bg-emerald-600 dark:hover:bg-emerald-700"
//               >
//                 {getDrawerButtonText()}
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// }

// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { MessageCircle, ShoppingCart, X, Minus, Plus } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { formatPrice } from "@/lib/format-price";

// interface MobileActionBarProps {
//   replacementTargetId?: string;
//   isCodRestricted: boolean;
//   disableCartButton: boolean;
//   isPending: boolean;
//   isSoldOut: boolean;
//   handleAddToCart: () => void;
//   handleReplaceItem: () => void;
//   productTitle: string;
//   displayImage: string;
//   unitPriceLabel: string;
//   stock: number;
//   productType: "UNIT" | "WEIGHT";
//   unitLabel: string;
//   preparedWeightOptions: any[];
//   selectedWeightId: string | null;
//   setSelectedWeightId: (id: string) => void;
//   quantity: number;
//   maxQuantity: number;
//   incrementQuantity: () => void;
//   decrementQuantity: () => void;
//   basePriceLabel: string | null;
//   discountPercent: number;
//   totalPrice?: number;
//   handleBuyNow: () => void; // 🟢 1. เพิ่ม Prop ตัวนี้เข้ามารับฟังก์ชัน ซื้อเลย
// }

// export default function MobileActionBar({
//   replacementTargetId,
//   isCodRestricted,
//   disableCartButton,
//   isPending,
//   isSoldOut,
//   handleAddToCart,
//   handleReplaceItem,
//   productTitle,
//   displayImage,
//   unitPriceLabel,
//   stock,
//   productType,
//   unitLabel,
//   preparedWeightOptions,
//   selectedWeightId,
//   setSelectedWeightId,
//   quantity,
//   maxQuantity,
//   incrementQuantity,
//   decrementQuantity,
//   basePriceLabel,
//   discountPercent,
//   totalPrice,
//   handleBuyNow, // 🟢 รับตรงนี้
// }: MobileActionBarProps) {
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [drawerMode, setDrawerMode] = useState<"cart" | "buy">("buy");

//   const getDrawerButtonText = () => {
//     if (isPending) return "กำลังดำเนินการ...";
//     if (replacementTargetId) return "ยืนยันการเปลี่ยนสินค้า";
//     if (drawerMode === "cart") return "เพิ่มลงรถเข็น";
//     return "ซื้อเลย";
//   };

//   const selectedWeight =
//     preparedWeightOptions.find((opt) => opt.id === selectedWeightId) ?? null;

//   return (
//     <>
//       {/* --------------------------------------------------- */}
//       {/* ส่วนที่ 1: แถบเมนูด้านล่าง */}
//       {/* --------------------------------------------------- */}
//       <div className="fixed bottom-0 left-0 right-0 z-40 flex h-[60px] bg-background shadow-[0_-4px_15px_rgba(0,0,0,0.05)] md:hidden pb-safe border-t border-border/50">
//         <button className="flex flex-col items-center justify-center w-[20%] border-r border-border/50 text-[#EE4D2D] active:bg-muted/50 transition-colors">
//           <MessageCircle strokeWidth={1.5} size={22} />
//           <span className="text-[10px] mt-0.5 font-medium text-muted-foreground">
//             แชทเลย
//           </span>
//         </button>

//         <button
//           className="flex flex-col items-center justify-center w-[20%] border-r border-border/50 text-[#EE4D2D] active:bg-muted/50 transition-colors disabled:opacity-50"
//           onClick={() => {
//             setDrawerMode("cart");
//             setIsDrawerOpen(true);
//           }}
//           disabled={disableCartButton && !isDrawerOpen}
//         >
//           <ShoppingCart strokeWidth={1.5} size={22} />
//           <span className="text-[10px] mt-0.5 font-medium text-muted-foreground">
//             เพิ่มรถเข็น
//           </span>
//         </button>

//         <div className="flex-1">
//           {replacementTargetId ? (
//             <button
//               onClick={() => setIsDrawerOpen(true)}
//               disabled={disableCartButton || isCodRestricted}
//               className={cn(
//                 "w-full h-full flex flex-col items-center justify-center text-white transition-colors",
//                 isCodRestricted
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-amber-600 active:bg-amber-700",
//               )}
//             >
//               <span className="font-semibold text-sm">ยืนยันการเปลี่ยน</span>
//             </button>
//           ) : (
//             <button
//               onClick={() => {
//                 setDrawerMode("buy");
//                 setIsDrawerOpen(true);
//               }}
//               className="w-full h-full flex flex-col items-center justify-center text-white bg-[#EE4D2D] active:bg-[#EE4D2D]/90 transition-colors"
//             >
//               <span className="font-semibold text-sm">
//                 {isSoldOut ? "สินค้าหมด" : "ซื้อเลย"}
//               </span>
//             </button>
//           )}
//         </div>
//       </div>

//       {/* --------------------------------------------------- */}
//       {/* ส่วนที่ 2: กล่องสไลด์ (Drawer) ขนาดกะทัดรัด (ไม่มี Scroll) */}
//       {/* --------------------------------------------------- */}
//       {isDrawerOpen && (
//         <>
//           <div
//             className="fixed inset-0 z-[60] bg-black/50 transition-opacity md:hidden"
//             onClick={() => setIsDrawerOpen(false)}
//           />

//           <div className="fixed bottom-0 left-0 right-0 z-[70] flex flex-col rounded-t-2xl bg-background p-4 pb-safe animate-in slide-in-from-bottom-full duration-300 md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
//             <button
//               type="button" // 🟢 เพิ่ม type
//               aria-label="ปิด" // 🟢 เพิ่มคำอธิบายสำหรับคนตาบอด / ระบบตรวจจับ
//               onClick={() => setIsDrawerOpen(false)}
//               className="absolute right-3 top-3 z-10 rounded-full p-1.5 hover:bg-muted"
//             >
//               <X size={18} className="text-muted-foreground" />
//             </button>

//             {/* --- 2.1 ส่วนหัว: ย่อรูปภาพให้เล็กลง (h-20 w-20) --- */}
//             <div className="flex shrink-0 gap-3 border-b border-border/50 pb-3">
//               <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border/50 bg-muted">
//                 <Image
//                   src={displayImage}
//                   alt={productTitle}
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//               <div className="flex flex-col justify-end pb-1 pr-6">
//                 <div className="flex flex-wrap items-center gap-1.5">
//                   <div className="text-lg font-bold text-[#EE4D2D] dark:text-emerald-400 leading-none">
//                     {unitPriceLabel}
//                   </div>
//                   {discountPercent > 0 && (
//                     <span className="whitespace-nowrap rounded-sm bg-[#EE4D2D]/10 px-1 py-0.5 text-[9px] font-semibold text-[#EE4D2D]">
//                       ลด {discountPercent}%
//                     </span>
//                   )}
//                 </div>
//                 {basePriceLabel && (
//                   <div className="mt-0.5 text-[11px] text-muted-foreground line-through">
//                     {basePriceLabel}
//                   </div>
//                 )}
//                 <div className="mt-1 text-xs text-muted-foreground">
//                   คลัง: {stock.toLocaleString()}
//                 </div>
//               </div>
//             </div>

//             {/* --- 2.2 ส่วนเนื้อหาตรงกลาง (ตัด Scroll ออก ลด Margin) --- */}
//             <div className="py-3">
//               <div className="mb-2 text-xs font-medium">
//                 {productType === "UNIT" ? "ตัวเลือกสินค้า" : "ขนาด/น้ำหนัก"}
//               </div>

//               <div className="flex flex-wrap gap-1.5">
//                 {preparedWeightOptions.map((option) => {
//                   const isSelected = selectedWeightId === option.id;
//                   return (
//                     <button
//                       key={option.id}
//                       onClick={() => setSelectedWeightId(option.id)}
//                       className={cn(
//                         "relative flex min-h-[40px] flex-col items-center justify-center rounded-md border px-3 py-1 text-xs transition-colors",
//                         isSelected
//                           ? "border-[#EE4D2D] bg-[#EE4D2D]/5 text-[#EE4D2D] dark:border-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400"
//                           : "border-border/60 bg-muted/20 text-foreground hover:bg-muted/50",
//                       )}
//                     >
//                       <div className="flex items-center gap-1">
//                         <span className="font-medium">
//                           {option.displayName}
//                         </span>
//                         {option.hasDiscount && (
//                           <span
//                             className={cn(
//                               "rounded-sm px-1 py-0.5 text-[8px] font-semibold whitespace-nowrap",
//                               isSelected
//                                 ? "bg-[#EE4D2D]/20 text-[#EE4D2D] dark:bg-emerald-500/20 dark:text-emerald-400"
//                                 : "bg-destructive/10 text-destructive",
//                             )}
//                           >
//                             ลด {option.discount}%
//                           </span>
//                         )}
//                       </div>

//                       <div className="mt-0.5 flex items-center gap-1 text-[10px]">
//                         <span
//                           className={cn(
//                             "font-bold",
//                             isSelected
//                               ? "text-[#EE4D2D] dark:text-emerald-400"
//                               : "text-muted-foreground",
//                           )}
//                         >
//                           {option.priceLabel}
//                         </span>
//                         {option.showBasePrice && (
//                           <span className="text-[8px] text-muted-foreground line-through opacity-70">
//                             {option.basePriceLabel}
//                           </span>
//                         )}
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>

//               {/* เลือกจำนวน */}
//               <div className="mt-4 flex items-center justify-between">
//                 <div className="text-xs font-medium">จำนวน</div>
//                 <div className="flex items-center rounded-md border border-border/60">
//                   <button
//                     type="button" // 🟢 เพิ่ม type
//                     aria-label="ลดจำนวน" // 🟢 เพิ่มคำอธิบาย
//                     onClick={decrementQuantity}
//                     disabled={quantity <= 1 || maxQuantity <= 0}
//                     className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-50"
//                   >
//                     <Minus size={14} />
//                   </button>
//                   <div className="flex h-7 w-10 items-center justify-center border-l border-r border-border/60 text-xs font-medium">
//                     {quantity}
//                   </div>
//                   <button
//                     type="button" // 🟢 เพิ่ม type
//                     aria-label="เพิ่มจำนวน" // 🟢 เพิ่มคำอธิบาย
//                     onClick={incrementQuantity}
//                     disabled={quantity >= maxQuantity || maxQuantity <= 0}
//                     className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-50"
//                   >
//                     <Plus size={14} />
//                   </button>
//                 </div>
//               </div>

//               {/* 🟢🟢 2.3 กล่องสรุป PRODUCT DETAIL (ถอดกล่องใหญ่ 2 ชั้นออก) 🟢🟢 */}
//               <div className="mt-4 border-t border-border/40 pt-3">
//                 <div className="flex flex-col gap-2">
//                   <h3 className="truncate text-xs font-medium text-foreground flex items-center gap-1.5 mb-1">
//                     <span className="text-sm"></span> {productTitle}
//                   </h3>

//                   {/* 3 ช่องเล็ก */}
//                   <div className="flex flex-wrap gap-1.5">
//                     <div className="flex flex-1 flex-col items-center justify-center rounded-md border border-border/30 bg-muted/30 px-2 py-1.5">
//                       <span className="whitespace-nowrap text-[9px] text-muted-foreground">
//                         {productType === "UNIT" ? "ตัวเลือก" : "ขนาด"}
//                       </span>
//                       <span className="mt-0.5 whitespace-nowrap text-center text-[10px] font-medium leading-tight text-foreground">
//                         {selectedWeight
//                           ? productType === "UNIT"
//                             ? `${selectedWeight.name} ${unitLabel}`
//                             : `${selectedWeight.weight.toLocaleString()} ${unitLabel}`
//                           : "-"}
//                       </span>
//                     </div>

//                     <div className="flex flex-1 flex-col items-center justify-center rounded-md border border-emerald-100/50 bg-emerald-50/50 px-2 py-1.5 dark:border-emerald-500/20 dark:bg-emerald-500/10">
//                       <span className="whitespace-nowrap text-[9px] text-muted-foreground">
//                         จำนวน
//                       </span>
//                       <span className="mt-0.5 whitespace-nowrap text-[12px] font-bold leading-tight text-emerald-600 dark:text-emerald-400">
//                         x {quantity.toLocaleString()}
//                       </span>
//                     </div>

//                     <div className="flex flex-1 flex-col items-center justify-center rounded-md border border-border/30 bg-muted/30 px-2 py-1.5">
//                       <span className="whitespace-nowrap text-[9px] text-muted-foreground">
//                         รวมสุทธิ
//                       </span>
//                       <span className="mt-0.5 whitespace-nowrap text-center text-[10px] font-medium leading-tight text-foreground">
//                         {selectedWeight
//                           ? productType === "UNIT"
//                             ? (
//                                 Number(selectedWeight.name ?? 0) * quantity
//                               ).toLocaleString()
//                             : (
//                                 selectedWeight.weight * quantity
//                               ).toLocaleString()
//                           : 0}
//                         <span className="ml-0.5 text-[9px] text-muted-foreground">
//                           {unitLabel}
//                         </span>
//                       </span>
//                     </div>
//                   </div>

//                   {/* ยอดชำระรวม (แถบสีเขียว) */}
//                   {typeof totalPrice === "number" && (
//                     <div className="mt-1 flex items-end justify-between rounded-md border border-emerald-100/50 bg-emerald-50/50 px-3 py-2 dark:border-emerald-900/30 dark:bg-emerald-950/20">
//                       <div className="flex flex-col">
//                         <span className="text-[9px] font-medium text-emerald-600/70 dark:text-emerald-400/70">
//                           ยอดชำระรวม
//                         </span>
//                         <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
//                           Total Price
//                         </span>
//                       </div>
//                       <div className="flex items-baseline gap-1">
//                         <span className="text-xl font-bold leading-none text-emerald-600 dark:text-emerald-400">
//                           {formatPrice(totalPrice).replace("฿", "")}
//                         </span>
//                         <span className="text-[9px] font-medium text-emerald-600/70 dark:text-emerald-400/70">
//                           THB
//                         </span>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//               {/* 🟢🟢 จบกล่องสรุปแบบใหม่ 🟢🟢 */}
//             </div>

//             {/* --- 2.4 ปุ่มยืนยันด้านล่างสุด --- */}
//             {/* <div className="shrink-0 pt-1">
//               <button
//                 onClick={() => {
//                   if (replacementTargetId) {
//                     handleReplaceItem();
//                   } else {
//                     handleAddToCart();
//                   }
//                   setIsDrawerOpen(false);
//                 }}
//                 disabled={disableCartButton}
//                 className="w-full rounded-md bg-[#EE4D2D] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#EE4D2D]/90 disabled:bg-muted-foreground dark:bg-emerald-600 dark:hover:bg-emerald-700"
//               >
//                 {getDrawerButtonText()}
//               </button>
//             </div> */}
//             <div className="shrink-0 border-t border-border/50 pt-3">
//               <button
//                 onClick={async () => {
//                   // 🟢 ใส่ async
//                   if (replacementTargetId) {
//                     handleReplaceItem();
//                     // โหมดเปลี่ยนของ ปล่อยให้มันโหลดค้างไว้จนกว่าจะเสร็จ
//                   } else if (drawerMode === "buy") {
//                     handleBuyNow();
//                     // โหมดซื้อเลย ไม่ต้องปิดกล่อง ให้ลูกค้าเห็นคำว่า "กำลังดำเนินการ..." จนกว่าหน้าจะเปลี่ยน
//                   } else {
//                     // โหมดเพิ่มลงตะกร้า
//                     await handleAddToCart();
//                     setIsDrawerOpen(false); // ปิดกล่องเฉพาะตอนเอาของลงตะกร้าเสร็จ
//                   }
//                 }}
//                 disabled={disableCartButton || isPending}
//                 className="w-full rounded-md bg-[#EE4D2D] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#EE4D2D]/90 disabled:bg-muted-foreground dark:bg-emerald-600 dark:hover:bg-emerald-700"
//               >
//                 {getDrawerButtonText()}
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// }

// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { MessageCircle, ShoppingCart, X, Minus, Plus } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { formatPrice } from "@/lib/format-price";

// interface MobileActionBarProps {
//   replacementTargetId?: string;
//   isCodRestricted: boolean;
//   disableCartButton: boolean;
//   isPending: boolean;
//   isSoldOut: boolean;
//   handleAddToCart: () => void;
//   handleReplaceItem: () => void;
//   productTitle: string;
//   displayImage: string;
//   unitPriceLabel: string;
//   stock: number;
//   productType: "UNIT" | "WEIGHT";
//   unitLabel: string;
//   preparedWeightOptions: any[];
//   selectedWeightId: string | null;
//   setSelectedWeightId: (id: string) => void;
//   quantity: number;
//   maxQuantity: number;
//   incrementQuantity: () => void;
//   decrementQuantity: () => void;
//   basePriceLabel: string | null;
//   discountPercent: number;
//   totalPrice?: number;
//   handleBuyNow: () => void;
// }

// export default function MobileActionBar({
//   replacementTargetId,
//   isCodRestricted,
//   disableCartButton,
//   isPending,
//   isSoldOut,
//   handleAddToCart,
//   handleReplaceItem,
//   productTitle,
//   displayImage,
//   unitPriceLabel,
//   stock,
//   productType,
//   unitLabel,
//   preparedWeightOptions,
//   selectedWeightId,
//   setSelectedWeightId,
//   quantity,
//   maxQuantity,
//   incrementQuantity,
//   decrementQuantity,
//   basePriceLabel,
//   discountPercent,
//   totalPrice,
//   handleBuyNow,
// }: MobileActionBarProps) {
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [drawerMode, setDrawerMode] = useState<"cart" | "buy">("buy");

//   const getDrawerButtonText = () => {
//     if (isPending) return "กำลังดำเนินการ...";
//     if (replacementTargetId) return "ยืนยันการเปลี่ยนสินค้า";
//     if (drawerMode === "cart") return "เพิ่มลงรถเข็น";
//     return "ซื้อเลย";
//   };

//   const selectedWeight =
//     preparedWeightOptions.find((opt) => opt.id === selectedWeightId) ?? null;

//   return (
//     <>
//       {/* --------------------------------------------------- */}
//       {/* ส่วนที่ 1: แถบเมนูด้านล่าง (Clean White & Soft Shadow) */}
//       {/* --------------------------------------------------- */}
//       <div className="fixed bottom-0 left-0 right-0 z-40 flex h-[60px] bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:hidden pb-safe border-t border-zinc-100">
//         <button className="flex flex-col items-center justify-center w-[20%] border-r border-zinc-100 text-emerald-600 hover:bg-emerald-50 active:bg-emerald-100 transition-colors">
//           <MessageCircle strokeWidth={1.5} size={22} />
//           <span className="text-[10px] mt-0.5 font-medium text-zinc-600">
//             แชทเลย
//           </span>
//         </button>

//         <button
//           className="flex flex-col items-center justify-center w-[20%] border-r border-zinc-100 text-emerald-600 hover:bg-emerald-50 active:bg-emerald-100 transition-colors disabled:opacity-50"
//           onClick={() => {
//             setDrawerMode("cart");
//             setIsDrawerOpen(true);
//           }}
//           disabled={disableCartButton && !isDrawerOpen}
//         >
//           <ShoppingCart strokeWidth={1.5} size={22} />
//           <span className="text-[10px] mt-0.5 font-medium text-zinc-600">
//             เพิ่มรถเข็น
//           </span>
//         </button>

//         <div className="flex-1 p-1.5">
//           {replacementTargetId ? (
//             <button
//               onClick={() => setIsDrawerOpen(true)}
//               disabled={disableCartButton || isCodRestricted}
//               className={cn(
//                 "w-full h-full flex flex-col items-center justify-center rounded-md text-white shadow-sm transition-all",
//                 isCodRestricted
//                   ? "bg-zinc-300 cursor-not-allowed text-zinc-500"
//                   : "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]",
//               )}
//             >
//               <span className="font-bold text-sm">ยืนยันการเปลี่ยน</span>
//             </button>
//           ) : (
//             <button
//               onClick={() => {
//                 setDrawerMode("buy");
//                 setIsDrawerOpen(true);
//               }}
//               className="w-full h-full flex flex-col items-center justify-center rounded-md text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-sm"
//             >
//               <span className="font-bold text-sm">
//                 {isSoldOut ? "สินค้าหมด" : "ซื้อเลย"}
//               </span>
//             </button>
//           )}
//         </div>
//       </div>

//       {/* --------------------------------------------------- */}
//       {/* ส่วนที่ 2: กล่องสไลด์ (Drawer) */}
//       {/* --------------------------------------------------- */}
//       <div
//         className={cn(
//           "fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px] transition-all duration-500 ease-in-out md:hidden",
//           isDrawerOpen
//             ? "opacity-100 pointer-events-auto"
//             : "opacity-0 pointer-events-none",
//         )}
//         onClick={() => setIsDrawerOpen(false)}
//       />

//       {/* 🟢 2. รวมกล่องเป็นอันเดียว ใช้ translate-y ในการเลื่อนขึ้น/ลง */}
//       <div
//         className={cn(
//           "fixed bottom-0 left-0 right-0 z-[70] flex flex-col rounded-t-3xl bg-white p-4 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.15)] text-zinc-800 transition-transform duration-500 ease-in-out md:hidden",
//           isDrawerOpen ? "translate-y-0" : "translate-y-full",
//         )}
//       >
//         <button
//           type="button"
//           aria-label="ปิด"
//           onClick={() => setIsDrawerOpen(false)}
//           className="absolute right-3.5 top-3.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-all duration-200 hover:bg-zinc-200 hover:text-zinc-800 active:scale-90"
//         >
//           <X size={16} strokeWidth={2.5} />
//         </button>

//         {/* --- 2.1 ส่วนหัว --- */}
//         <div className="flex shrink-0 gap-3 border-b border-zinc-100 pb-4 mt-1">
//           <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
//             <Image
//               src={displayImage}
//               alt={productTitle}
//               fill
//               className="object-cover"
//             />
//           </div>
//           <div className="flex flex-col justify-end pb-1 pr-6">
//             <div className="flex flex-wrap items-center gap-1.5">
//               <div className="text-xl font-black text-emerald-600 leading-none">
//                 {unitPriceLabel}
//               </div>
//               {discountPercent > 0 && (
//                 <span className="whitespace-nowrap rounded-md bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-red-500">
//                   ลด {discountPercent}%
//                 </span>
//               )}
//             </div>
//             {basePriceLabel && (
//               <div className="mt-1 text-[12px] text-zinc-400 line-through font-medium">
//                 {basePriceLabel}
//               </div>
//             )}
//             <div className="mt-1.5 text-xs font-medium text-zinc-500">
//               คลัง:{" "}
//               <span className="text-zinc-700">{stock.toLocaleString()}</span>
//             </div>
//           </div>
//         </div>

//         {/* --- 2.2 ส่วนเนื้อหาตรงกลาง --- */}
//         <div className="py-4">
//           <div className="mb-3 flex items-center gap-2">
//             <div className="h-3.5 w-1 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.4)]"></div>
//             <span className="text-[13px] font-extrabold tracking-wide text-zinc-700">
//               {productType === "UNIT" ? "ตัวเลือกสินค้า" : "ขนาด/น้ำหนัก"}
//             </span>
//           </div>

//           <div className="flex flex-wrap gap-2">
//             {preparedWeightOptions.map((option) => {
//               const isSelected = selectedWeightId === option.id;
//               return (
//                 <button
//                   key={option.id}
//                   onClick={() => setSelectedWeightId(option.id)}
//                   className={cn(
//                     "relative flex min-h-[44px] flex-col items-center justify-center rounded-lg border px-3 py-1.5 text-xs transition-all",
//                     isSelected
//                       ? "border-emerald-600 bg-emerald-600/5 text-emerald-700 ring-1 ring-emerald-600/10"
//                       : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50",
//                   )}
//                 >
//                   <div className="flex items-center gap-1">
//                     <span className="font-semibold">{option.displayName}</span>
//                     {option.hasDiscount && (
//                       <span className="rounded-sm bg-red-50 px-1 py-0.5 text-[9px] font-bold text-red-500 whitespace-nowrap">
//                         ลด {option.discount}%
//                       </span>
//                     )}
//                   </div>

//                   <div className="mt-0.5 flex items-center gap-1 text-[11px]">
//                     <span
//                       className={cn(
//                         "font-bold",
//                         isSelected ? "text-emerald-600" : "text-zinc-500",
//                       )}
//                     >
//                       {option.priceLabel}
//                     </span>
//                     {option.showBasePrice && (
//                       <span className="text-[9px] text-red-400 line-through opacity-80">
//                         {option.basePriceLabel}
//                       </span>
//                     )}
//                   </div>
//                 </button>
//               );
//             })}
//           </div>

//           {/* เลือกจำนวน */}
//           <div className="mt-6 flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <div className="h-3.5 w-1 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.4)]"></div>
//               <span className="text-[13px] font-extrabold tracking-wide text-zinc-700">
//                 จำนวน
//               </span>
//             </div>{" "}
//             <div className="flex items-center rounded-lg border border-zinc-200 bg-white shadow-sm ring-1 ring-zinc-900/5 overflow-hidden">
//               <button
//                 type="button"
//                 aria-label="ลดจำนวน"
//                 onClick={decrementQuantity}
//                 disabled={quantity <= 1 || maxQuantity <= 0}
//                 className="flex h-8 w-9 items-center justify-center text-zinc-500 transition-all duration-200 hover:bg-zinc-50 hover:text-emerald-600 active:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-zinc-500"
//               >
//                 <Minus size={15} strokeWidth={2.5} />
//               </button>
//               <div className="flex h-8 w-11 items-center justify-center border-l border-r border-zinc-200 bg-zinc-50/80 text-[14px] font-black text-zinc-800 shadow-inner shadow-zinc-200/20">
//                 {quantity}
//               </div>
//               <button
//                 type="button"
//                 aria-label="เพิ่มจำนวน"
//                 onClick={incrementQuantity}
//                 disabled={quantity >= maxQuantity || maxQuantity <= 0}
//                 className="flex h-8 w-9 items-center justify-center text-zinc-500 transition-all duration-200 hover:bg-zinc-50 hover:text-emerald-600 active:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-zinc-500"
//               >
//                 <Plus size={15} strokeWidth={2.5} />
//               </button>
//             </div>
//           </div>

//           {/* 🟢🟢 กล่องสรุป PRODUCT DETAIL (ธีมเขียว-ขาวแบบ DOAG THAI) 🟢🟢 */}
//           <div className="mt-6 rounded-xl border border-zinc-100 bg-zinc-50/50 p-3 shadow-sm">
//             <div className="flex flex-col gap-2.5">
//               <h3 className="truncate text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
//                 {productTitle}
//               </h3>

//               {/* 3 ช่องเล็ก */}
//               <div className="flex flex-wrap gap-2">
//                 <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-zinc-200 bg-white px-2 py-2 shadow-sm">
//                   <span className="whitespace-nowrap text-[10px] font-medium text-zinc-500">
//                     {productType === "UNIT" ? "ตัวเลือก" : "ขนาด"}
//                   </span>
//                   <span className="mt-0.5 whitespace-nowrap text-center text-[11px] font-bold text-zinc-800">
//                     {selectedWeight
//                       ? productType === "UNIT"
//                         ? `${selectedWeight.name} ${unitLabel}`
//                         : `${selectedWeight.weight.toLocaleString()} ${unitLabel}`
//                       : "-"}
//                   </span>
//                 </div>

//                 <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-2 shadow-sm">
//                   <span className="whitespace-nowrap text-[10px] font-medium text-emerald-600/80">
//                     จำนวน
//                   </span>
//                   <span className="mt-0.5 whitespace-nowrap text-[13px] font-black text-emerald-600">
//                     x {quantity.toLocaleString()}
//                   </span>
//                 </div>

//                 <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-zinc-200 bg-white px-2 py-2 shadow-sm">
//                   <span className="whitespace-nowrap text-[10px] font-medium text-zinc-500">
//                     รวมสุทธิ
//                   </span>
//                   <span className="mt-0.5 whitespace-nowrap text-center text-[11px] font-bold text-zinc-800">
//                     {selectedWeight
//                       ? productType === "UNIT"
//                         ? (
//                             Number(selectedWeight.name ?? 0) * quantity
//                           ).toLocaleString()
//                         : (selectedWeight.weight * quantity).toLocaleString()
//                       : 0}
//                     <span className="ml-1 text-[9px] font-medium text-zinc-500">
//                       {unitLabel}
//                     </span>
//                   </span>
//                 </div>
//               </div>

//               {/* ยอดชำระรวม */}
//               {typeof totalPrice === "number" && (
//                 <div className="mt-1 flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50/80 px-3.5 py-2.5 shadow-sm">
//                   <div className="flex flex-col">
//                     <span className="text-[10px] font-bold text-emerald-600/80">
//                       ยอดชำระรวม
//                     </span>
//                     <span className="text-[12px] font-black text-emerald-700">
//                       Total Price
//                     </span>
//                   </div>
//                   <div className="flex items-baseline gap-1.5">
//                     <span className="text-[22px] font-black leading-none text-emerald-600">
//                       {formatPrice(totalPrice).replace("฿", "")}
//                     </span>
//                     <span className="text-[11px] font-bold text-emerald-600/80">
//                       THB
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* --- 2.4 ปุ่มยืนยันด้านล่างสุด --- */}
//         <div className="shrink-0 pt-2 pb-1">
//           <button
//             onClick={async () => {
//               if (replacementTargetId) {
//                 handleReplaceItem();
//               } else if (drawerMode === "buy") {
//                 handleBuyNow();
//               } else {
//                 await handleAddToCart();
//                 setIsDrawerOpen(false);
//               }
//             }}
//             disabled={disableCartButton || isPending}
//             className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:bg-zinc-200 disabled:text-zinc-400 disabled:shadow-none disabled:active:scale-100"
//           >
//             {getDrawerButtonText()}
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }

"use client";

import { useState } from "react";
import Image from "next/image";
import { MessageCircle, ShoppingCart, X, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format-price";

interface MobileActionBarProps {
  replacementTargetId?: string;
  isCodRestricted: boolean;
  disableCartButton: boolean;
  isPending: boolean;
  isSoldOut: boolean;
  handleAddToCart: () => void;
  handleReplaceItem: () => void;
  productTitle: string;
  displayImage: string;
  unitPriceLabel: string;
  stock: number;
  productType: "UNIT" | "WEIGHT";
  unitLabel: string;
  preparedWeightOptions: any[];
  selectedWeightId: string | null;
  setSelectedWeightId: (id: string) => void;
  quantity: number;
  maxQuantity: number;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  basePriceLabel: string | null;
  discountPercent: number;
  totalPrice?: number;
  handleBuyNow: () => void;
}

export default function MobileActionBar({
  replacementTargetId,
  isCodRestricted,
  disableCartButton,
  isPending,
  isSoldOut,
  handleAddToCart,
  handleReplaceItem,
  productTitle,
  displayImage,
  unitPriceLabel,
  stock,
  productType,
  unitLabel,
  preparedWeightOptions,
  selectedWeightId,
  setSelectedWeightId,
  quantity,
  maxQuantity,
  incrementQuantity,
  decrementQuantity,
  basePriceLabel,
  discountPercent,
  totalPrice,
  handleBuyNow,
}: MobileActionBarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"cart" | "buy">("buy");

  const getDrawerButtonText = () => {
    if (isPending) return "กำลังดำเนินการ...";
    if (replacementTargetId) return "ยืนยันการเปลี่ยนสินค้า";
    if (drawerMode === "cart") return "เพิ่มลงรถเข็น";
    return "ซื้อเลย";
  };

  const selectedWeight =
    preparedWeightOptions.find((opt) => opt.id === selectedWeightId) ?? null;

  return (
    <>
      {/* --------------------------------------------------- */}
      {/* ส่วนที่ 1: แถบเมนูด้านล่าง (ใช้สี bg-card ตาม Header) */}
      {/* --------------------------------------------------- */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex h-[60px] bg-card shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:hidden pb-safe border-t border-border transition-colors duration-300">
        <button className="flex flex-col items-center justify-center w-[20%] border-r border-border text-primary hover:bg-accent/50 active:bg-accent transition-colors">
          <MessageCircle strokeWidth={1.5} size={22} />
          <span className="text-[10px] mt-0.5 font-medium text-muted-foreground">
            แชทเลย
          </span>
        </button>

        <button
          className="flex flex-col items-center justify-center w-[20%] border-r border-border text-primary hover:bg-accent/50 active:bg-accent transition-colors disabled:opacity-50"
          onClick={() => {
            setDrawerMode("cart");
            setIsDrawerOpen(true);
          }}
          disabled={disableCartButton && !isDrawerOpen}
        >
          <ShoppingCart strokeWidth={1.5} size={22} />
          <span className="text-[10px] mt-0.5 font-medium text-muted-foreground">
            เพิ่มรถเข็น
          </span>
        </button>

        <div className="flex-1 p-1.5 bg-card">
          {replacementTargetId ? (
            <button
              onClick={() => setIsDrawerOpen(true)}
              disabled={disableCartButton || isCodRestricted}
              className={cn(
                "w-full h-full flex flex-col items-center justify-center rounded-md text-primary-foreground shadow-sm transition-all",
                isCodRestricted
                  ? "bg-muted cursor-not-allowed text-muted-foreground"
                  : "bg-primary hover:opacity-90 active:scale-[0.98]",
              )}
            >
              <span className="font-bold text-sm">ยืนยันการเปลี่ยน</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setDrawerMode("buy");
                setIsDrawerOpen(true);
              }}
              className="w-full h-full flex flex-col items-center justify-center rounded-md text-primary-foreground bg-primary hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
            >
              <span className="font-bold text-sm">
                {isSoldOut ? "สินค้าหมด" : "ซื้อเลย"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* --------------------------------------------------- */}
      {/* ส่วนที่ 2: กล่องสไลด์ (Drawer) */}
      {/* --------------------------------------------------- */}
      {/* <div
        className={cn(
          "fixed inset-0 z-[60] bg-black/60 backdrop-blur-[2px] transition-all duration-500 ease-in-out md:hidden",
          isDrawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsDrawerOpen(false)}
      /> */}
      <div
        className={cn(
          // ✅ เปลี่ยน transition-all -> transition-opacity
          // ✅ เพิ่ม transform-gpu (ช่วยลดภาระ CPU)
          "fixed inset-0 z-[60] bg-black/60 backdrop-blur-[2px] transition-opacity duration-500 ease-in-out md:hidden transform-gpu",
          isDrawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* 🟢 ใช้ bg-card เพื่อให้สีเดียวกับแผ่นเมนู MobileMenu */}
      {/* <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[70] flex flex-col rounded-t-3xl bg-card p-4 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.15)] text-card-foreground transition-transform duration-500 ease-in-out md:hidden",
          isDrawerOpen ? "translate-y-0" : "translate-y-full",
        )}
      > */}
      <div
        className={cn(
          // ✅ เพิ่ม transform-gpu (ย้ายงานไปที่การ์ดจอ)
          // ✅ เพิ่ม will-change-transform (จองหน่วยความจำกราฟิกไว้ล่วงหน้า)
          "fixed bottom-0 left-0 right-0 z-[70] flex flex-col rounded-t-3xl bg-card p-4 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.15)] text-card-foreground transition-transform duration-500 ease-in-out md:hidden transform-gpu will-change-transform",
          isDrawerOpen ? "translate-y-0" : "translate-y-full",
        )}
      >
        <button
          type="button"
          aria-label="ปิด"
          onClick={() => setIsDrawerOpen(false)}
          className="absolute right-3.5 top-3.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground transition-all duration-200 hover:opacity-80 active:scale-90"
        >
          <X size={16} strokeWidth={2.5} />
        </button>

        {/* --- 2.1 ส่วนหัว --- */}
        <div className="flex shrink-0 gap-3 border-b border-border pb-4 mt-1">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-background shadow-sm">
            <Image
              src={displayImage}
              alt={productTitle}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-end pb-1 pr-6">
            <div className="flex flex-wrap items-center gap-1.5">
              <div className="text-xl font-black text-primary leading-none">
                {unitPriceLabel}
              </div>
              {discountPercent > 0 && (
                <span className="whitespace-nowrap rounded-md bg-destructive/10 px-1.5 py-0.5 text-[10px] font-bold text-destructive">
                  ลด {discountPercent}%
                </span>
              )}
            </div>
            {basePriceLabel && (
              <div className="mt-1 text-[12px] text-muted-foreground line-through font-medium">
                {basePriceLabel}
              </div>
            )}
            <div className="mt-1.5 text-xs font-medium text-muted-foreground">
              คลัง:{" "}
              <span className="text-foreground">{stock.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* --- 2.2 ส่วนเนื้อหาตรงกลาง --- */}
        <div className="py-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-3.5 w-1 rounded-full bg-primary shadow-[0_0_5px_rgba(var(--primary),0.4)]"></div>
            <span className="text-[13px] font-extrabold tracking-wide text-foreground">
              {productType === "UNIT" ? "ตัวเลือกสินค้า" : "ขนาด/น้ำหนัก"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {preparedWeightOptions.map((option) => {
              const isSelected = selectedWeightId === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedWeightId(option.id)}
                  className={cn(
                    "relative flex min-h-[44px] flex-col items-center justify-center rounded-lg border px-3 py-1.5 text-xs transition-all",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/20"
                      : "border-border bg-background text-muted-foreground hover:border-primary/50",
                  )}
                >
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{option.displayName}</span>
                    {option.hasDiscount && (
                      <span className="rounded-sm bg-destructive/10 px-1 py-0.5 text-[9px] font-bold text-destructive whitespace-nowrap">
                        ลด {option.discount}%
                      </span>
                    )}
                  </div>

                  <div className="mt-0.5 flex items-center gap-1 text-[11px]">
                    <span
                      className={cn(
                        "font-bold",
                        isSelected ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {option.priceLabel}
                    </span>
                    {option.showBasePrice && (
                      <span className="text-[9px] text-destructive/70 line-through opacity-80">
                        {option.basePriceLabel}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* เลือกจำนวน */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-1 rounded-full bg-primary shadow-[0_0_5px_rgba(var(--primary),0.4)]"></div>
              <span className="text-[13px] font-extrabold tracking-wide text-foreground">
                จำนวน
              </span>
            </div>{" "}
            <div className="flex items-center rounded-lg border border-border bg-background shadow-sm ring-1 ring-border/5 overflow-hidden">
              <button
                type="button"
                aria-label="ลดจำนวน"
                onClick={decrementQuantity}
                disabled={quantity <= 1 || maxQuantity <= 0}
                className="flex h-8 w-9 items-center justify-center text-muted-foreground transition-all duration-200 hover:bg-accent active:bg-accent/80 disabled:opacity-30"
              >
                <Minus size={15} strokeWidth={2.5} />
              </button>
              <div className="flex h-8 w-11 items-center justify-center border-l border-r border-border bg-muted/20 text-[14px] font-black text-foreground">
                {quantity}
              </div>
              <button
                type="button"
                aria-label="เพิ่มจำนวน"
                onClick={incrementQuantity}
                disabled={quantity >= maxQuantity || maxQuantity <= 0}
                className="flex h-8 w-9 items-center justify-center text-muted-foreground transition-all duration-200 hover:bg-accent active:bg-accent/80 disabled:opacity-30"
              >
                <Plus size={15} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* 🟢🟢 กล่องสรุป PRODUCT DETAIL (ใช้สี bg-background เพื่อให้เด้งออกมาจาก bg-card) 🟢🟢 */}
          <div className="mt-6 rounded-xl border border-border bg-background/50 p-3 shadow-sm">
            <div className="flex flex-col gap-2.5">
              <h3 className="truncate text-xs font-semibold text-foreground flex items-center gap-1.5">
                {productTitle}
              </h3>

              {/* 3 ช่องเล็ก */}
              <div className="flex flex-wrap gap-2">
                <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-border bg-card px-2 py-2 shadow-sm">
                  <span className="whitespace-nowrap text-[10px] font-medium text-muted-foreground">
                    {productType === "UNIT" ? "ตัวเลือก" : "ขนาด"}
                  </span>
                  <span className="mt-0.5 whitespace-nowrap text-center text-[11px] font-bold text-foreground">
                    {selectedWeight
                      ? productType === "UNIT"
                        ? `${selectedWeight.name} ${unitLabel}`
                        : `${selectedWeight.weight.toLocaleString()} ${unitLabel}`
                      : "-"}
                  </span>
                </div>

                <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-primary/30 bg-primary/5 px-2 py-2 shadow-sm">
                  <span className="whitespace-nowrap text-[10px] font-medium text-primary/70">
                    จำนวน
                  </span>
                  <span className="mt-0.5 whitespace-nowrap text-[13px] font-black text-primary">
                    x {quantity.toLocaleString()}
                  </span>
                </div>

                <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-border bg-card px-2 py-2 shadow-sm">
                  <span className="whitespace-nowrap text-[10px] font-medium text-muted-foreground">
                    รวมสุทธิ
                  </span>
                  <span className="mt-0.5 whitespace-nowrap text-center text-[11px] font-bold text-foreground">
                    {selectedWeight
                      ? productType === "UNIT"
                        ? (
                            Number(selectedWeight.name ?? 0) * quantity
                          ).toLocaleString()
                        : (selectedWeight.weight * quantity).toLocaleString()
                      : 0}
                    <span className="ml-1 text-[9px] font-medium text-muted-foreground">
                      {unitLabel}
                    </span>
                  </span>
                </div>
              </div>

              {/* ยอดชำระรวม */}
              {typeof totalPrice === "number" && (
                <div className="mt-1 flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-3.5 py-2.5 shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-primary/70">
                      ยอดชำระรวม
                    </span>
                    <span className="text-[12px] font-black text-primary">
                      Total Price
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[22px] font-black leading-none text-primary">
                      {formatPrice(totalPrice).replace("฿", "")}
                    </span>
                    <span className="text-[11px] font-bold text-primary/70">
                      THB
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- 2.4 ปุ่มยืนยันด้านล่างสุด --- */}
        <div className="shrink-0 pt-2 pb-1">
          <button
            onClick={async () => {
              if (replacementTargetId) {
                handleReplaceItem();
              } else if (drawerMode === "buy") {
                handleBuyNow();
              } else {
                await handleAddToCart();
                setIsDrawerOpen(false);
              }
            }}
            disabled={disableCartButton || isPending}
            className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-md hover:opacity-90 active:scale-[0.98] disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
          >
            {getDrawerButtonText()}
          </button>
        </div>
      </div>
    </>
  );
}
