// import { Metadata } from "next";
// import { redirect } from "next/navigation";
// import Link from "next/link";
// import { getServerSession } from "@/lib/get-session";
// import {
//   getActiveSpinPackages,
//   getSpinQuotaByUserId,
//   getSpinOrdersByUserId,
//   getSpinHistoryByUserId,
// } from "@/services/spins";
// import SpinPackagesList from "./spin-packages-list";
// import { Button } from "@/components/ui/button";
// import {
//   AlertCircle,
//   ChevronRight,
//   History,
//   Package,
//   Play,
//   RotateCw,
//   Trophy,
// } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

// export const metadata: Metadata = {
//   title: "ซื้อแพคเกจสปิน",
//   description: "ซื้อแพคเกจสปินเพื่อเล่นเกมสปิน",
// };

// export default async function SpinPage() {
//   const session = await getServerSession();
//   if (!session?.user) {
//     redirect("/sign-in?redirect=/spin");
//   }

//   const packages = await getActiveSpinPackages();
//   const quota = await getSpinQuotaByUserId(session.user.id);
//   const orders = await getSpinOrdersByUserId(session.user.id);
//   const spinHistory = await getSpinHistoryByUserId(session.user.id, {
//     limit: 100,
//   });

//   // นับคำสั่งซื้อที่รอการตรวจสอบ
//   const pendingOrders = orders.filter(
//     (order) => order.status === "WAITING_VERIFICATION",
//   ).length;

//   const remainingSpins = quota ? quota.total - quota.used : 0;
//   const totalSpins = spinHistory.length;
//   const winCount = spinHistory.filter((h) => h.result === "WIN").length;

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <div className="mb-4 sm:mb-6">
//         <h1 className="text-2xl sm:text-3xl font-bold mb-2">ซื้อแพคเกจสปิน</h1>
//         <p className="text-sm sm:text-base text-muted-foreground">
//           เลือกแพคเกจที่ต้องการเพื่อเติมจำนวนครั้งที่หมุน
//         </p>
//       </div>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
//         {/* [กล่องใหญ่] 1. สิทธิ์คงเหลือ (กินพื้นที่ 2 คอลัมน์บน Desktop) */}
//         <div className="md:col-span-2">
//           <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-emerald-600 to-green-500 text-white">
//             {/* Background Pattern Decoration */}
//             <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
//             <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-yellow-400 opacity-20 rounded-full blur-3xl"></div>

//             <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
//               <div className="text-center sm:text-left space-y-2">
//                 <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-100 font-medium">
//                   <Package className="w-5 h-5" />
//                   <span>สิทธิ์ของคุณ</span>
//                 </div>
//                 <h2 className="text-5xl sm:text-6xl font-black tracking-tighter drop-shadow-sm">
//                   {remainingSpins}
//                   <span className="text-2xl sm:text-3xl font-bold ml-2 opacity-80">
//                     ครั้ง
//                   </span>
//                 </h2>
//                 <p className="text-emerald-50 text-sm">
//                   ใช้สิทธิ์หมุนเพื่อลุ้นรับของรางวัลมากมาย
//                 </p>
//               </div>

//               <div className="flex flex-col gap-3 w-full sm:w-auto">
//                 <Link href="/game" className="w-full">
//                   <Button
//                     size="lg"
//                     className="w-full sm:w-48 bg-white text-emerald-700 hover:bg-emerald-50 hover:scale-105 transition-all font-bold text-lg shadow-lg h-14 rounded-xl"
//                   >
//                     <Play className="w-5 h-5 mr-2 fill-current" />
//                     เล่นเกมเลย
//                   </Button>
//                 </Link>
//                 {remainingSpins === 0 && (
//                   <p className="text-center text-xs text-emerald-100 bg-black/10 py-1 rounded-lg">
//                     * สิทธิ์หมดแล้ว เติมแพคเกจด้านล่าง
//                   </p>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* [กล่องเล็ก 1] รอตรวจสอบ หรือ ประวัติการหมุน */}
//         {pendingOrders > 0 ? (
//           // กรณีมีออเดอร์ค้าง -> โชว์กล่องแจ้งเตือน
//           <Card className="border-l-4 border-l-yellow-500 shadow-md hover:shadow-lg transition-shadow bg-yellow-50/50 dark:bg-yellow-900/20">
//             <CardContent className="p-5 h-full flex flex-col justify-between">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 uppercase tracking-wider mb-1">
//                     สถานะคำสั่งซื้อ
//                   </p>
//                   <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
//                     {pendingOrders}{" "}
//                     <span className="text-base font-normal text-muted-foreground">
//                       รายการ
//                     </span>
//                   </h3>
//                 </div>
//                 <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-full text-yellow-600">
//                   <AlertCircle className="w-6 h-6" />
//                 </div>
//               </div>
//               <div className="mt-4">
//                 <Link href="/spin/orders">
//                   <Button
//                     variant="outline"
//                     className="w-full justify-between group border-yellow-200 hover:bg-yellow-100 hover:text-yellow-700 dark:border-yellow-800"
//                   >
//                     ตรวจสอบสถานะ
//                     <ChevronRight className="w-4 h-4 text-yellow-500 group-hover:translate-x-1 transition-transform" />
//                   </Button>
//                 </Link>
//               </div>
//             </CardContent>
//           </Card>
//         ) : (
//           // กรณีไม่มีออเดอร์ค้าง -> โชว์สถิติการหมุน
//           <Card className="shadow-md hover:shadow-lg transition-shadow border-zinc-200 dark:border-zinc-800">
//             <CardContent className="p-5 h-full flex flex-col justify-between">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
//                     ประวัติการเล่น
//                   </p>
//                   <h3 className="text-3xl font-bold">
//                     {totalSpins}{" "}
//                     <span className="text-base font-normal text-muted-foreground">
//                       ครั้ง
//                     </span>
//                   </h3>
//                   <div className="flex items-center gap-2 mt-1">
//                     <Badge
//                       variant="secondary"
//                       className="bg-green-100 text-green-700 hover:bg-green-100"
//                     >
//                       ชนะ {winCount} ครั้ง
//                     </Badge>
//                   </div>
//                 </div>
//                 <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500">
//                   <History className="w-6 h-6" />
//                 </div>
//               </div>
//               <div className="mt-4">
//                 <Link href="/spin/history">
//                   <Button
//                     variant="ghost"
//                     className="w-full justify-between group hover:bg-zinc-100 dark:hover:bg-zinc-800"
//                   >
//                     ดูประวัติทั้งหมด
//                     <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
//                   </Button>
//                 </Link>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* [กล่องเล็ก 2] ประวัติคำสั่งซื้อ */}
//         <Card className="shadow-md hover:shadow-lg transition-shadow border-zinc-200 dark:border-zinc-800">
//           <CardContent className="p-5 h-full flex flex-col justify-between">
//             <div className="flex justify-between items-start">
//               <div>
//                 <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
//                   ประวัติการเติม
//                 </p>
//                 <h3 className="text-3xl font-bold">
//                   {orders.length}{" "}
//                   <span className="text-base font-normal text-muted-foreground">
//                     บิล
//                   </span>
//                 </h3>
//               </div>
//               <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600">
//                 <Trophy className="w-6 h-6" />
//               </div>
//             </div>
//             <div className="mt-4">
//               <Link href="/spin/orders">
//                 <Button
//                   variant="ghost"
//                   className="w-full justify-between group hover:bg-zinc-100 dark:hover:bg-zinc-800"
//                 >
//                   ดูรายการสั่งซื้อ
//                   <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
//                 </Button>
//               </Link>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//       {/* --- จบส่วน DASHBOARD --- */}

//       {/* Package List Header */}
//       <div className="flex items-center gap-3 mb-6">
//         <div className="h-8 w-1.5 bg-green-500 rounded-full"></div>
//         <h2 className="text-xl font-bold">เลือกแพคเกจที่ต้องการ</h2>
//       </div>

//       <SpinPackagesList packages={packages} />
//     </div>
//   );
// }

// import { Metadata } from "next";
// import { redirect } from "next/navigation";
// import Link from "next/link";
// import { getServerSession } from "@/lib/get-session";
// import {
//   getActiveSpinPackages,
//   getSpinQuotaByUserId,
//   getSpinOrdersByUserId,
//   getSpinHistoryByUserId,
// } from "@/services/spins";
// import SpinPackagesList from "./spin-packages-list";

// // Import UI Components
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

// // Import Icons
// import {
//   AlertCircle,
//   ChevronRight,
//   History,
//   Package,
//   Play,
//   Trophy,
//   Zap,
//   Sparkles,
//   Gamepad2,
// } from "lucide-react";

// export const metadata: Metadata = {
//   title: "ซื้อแพคเกจสปิน",
//   description: "ซื้อแพคเกจสปินเพื่อเล่นเกมสปิน",
// };

// export default async function SpinPage() {
//   const session = await getServerSession();
//   if (!session?.user) {
//     redirect("/sign-in?redirect=/spin");
//   }

//   // Fetch Data
//   const packages = await getActiveSpinPackages();
//   const quota = await getSpinQuotaByUserId(session.user.id);
//   const orders = await getSpinOrdersByUserId(session.user.id);
//   const spinHistory = await getSpinHistoryByUserId(session.user.id, {
//     limit: 100,
//   });

//   // Calculations
//   const pendingOrders = orders.filter(
//     (order) => order.status === "WAITING_VERIFICATION",
//   ).length;

//   const remainingSpins = quota ? quota.total - quota.used : 0;
//   const totalSpins = spinHistory.length;
//   const winCount = spinHistory.filter((h) => h.result === "WIN").length;

//   return (
//     <div className="container mx-auto px-4 py-6 space-y-6">
//       {/* --- Header (ฟอนต์ปกติ) --- */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b-4 border-green-600 pb-6">
//         <div>
//           <Badge className="mb-2 bg-green-600 text-white border-2 border-black rounded-none px-2 py-1 text-xs font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-green-700">
//             <Gamepad2 className="w-3 h-3 mr-1" /> ITEM SHOP
//           </Badge>
//           <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-green-900 dark:text-green-400 drop-shadow-sm">
//             BUY SPIN PACKAGES
//           </h1>
//           <p className="text-sm sm:text-base font-bold text-muted-foreground mt-1">
//             &gt; SELECT A PACKAGE TO RECHARGE YOUR ENERGY.
//           </p>
//         </div>

//         {/* Decorative Icon Box */}
//         <div className="hidden sm:flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 border-4 border-green-700 rounded-lg shadow-[4px_4px_0px_0px_rgba(20,83,45,1)] rotate-3">
//           <Zap
//             className="w-8 h-8 text-green-600 dark:text-green-300 animate-pulse"
//             fill="currentColor"
//           />
//         </div>
//       </div>

//       {/* --- ส่วนที่ 1: กล่องใหญ่ (ดีไซน์ Pixel แต่ฟอนต์ปกติ) --- */}
//       <section className="w-full">
//         <Card className="relative overflow-visible border-4 border-green-700 bg-green-600 text-white rounded-xl shadow-[8px_8px_0px_0px_rgba(20,83,45,1)] hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(20,83,45,1)] transition-all duration-200">
//           {/* Background Grid Pattern */}
//           <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>

//           <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
//             {/* Left Side */}
//             <div className="text-center md:text-left space-y-4 flex-1">
//               <div className="inline-flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full border border-green-400/30">
//                 <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-pulse" />
//                 <span className="font-bold text-sm text-green-100">
//                   พลังงานคงเหลือ
//                 </span>
//               </div>

//               <div className="relative">
//                 {/* แก้ฟอนต์กลับเป็นปกติ แต่ยังใหญ่ชัดเจน */}
//                 <h2 className="text-6xl sm:text-7xl font-bold text-white drop-shadow-md">
//                   {remainingSpins}
//                 </h2>
//                 <span className="absolute -top-2 -right-6 rotate-12 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
//                   QUOTA
//                 </span>
//               </div>

//               <p className="text-green-100 font-medium text-sm sm:text-base max-w-md bg-green-700/50 p-2 rounded-lg border border-green-500/50">
//                 ใช้สิทธิ์หมุนเพื่อปลดล็อกไอเทมระดับตำนาน!
//               </p>
//             </div>

//             {/* Right Side: Pixel Art Character */}
//             <div className="flex flex-col items-center gap-4 relative">
//               <div className="w-24 h-24 sm:w-32 sm:h-32 relative animate-bounce-slow">
//                 <img
//                   src="https://api.dicebear.com/7.x/pixel-art/svg?seed=weed&backgroundColor=transparent"
//                   alt="Pixel Character"
//                   className="w-full h-full object-contain drop-shadow-lg"
//                 />
//                 <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-spin-slow" />
//               </div>

//               <Link href="/game" className="w-full md:w-auto">
//                 <Button
//                   size="lg"
//                   className="w-full md:w-48 h-14 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xl border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all"
//                 >
//                   <Play className="w-6 h-6 mr-2 fill-black" />
//                   เล่นเกมเลย
//                 </Button>
//               </Link>

//               {remainingSpins === 0 && (
//                 <div className="absolute -bottom-12 w-full text-center">
//                   <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
//                     ! สิทธิ์หมด !
//                   </span>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </section>

//       {/* --- ส่วนที่ 2: กล่องเล็ก (ดีไซน์ Pixel แต่ฟอนต์ปกติ) --- */}
//       <section className="grid grid-cols-2 gap-4 sm:gap-6">
//         {/* [กล่องซ้าย] Status / History */}
//         <div className="col-span-1">
//           {pendingOrders > 0 ? (
//             <Card className="h-full border-4 border-yellow-600 bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 rounded-xl shadow-[6px_6px_0px_0px_rgba(161,98,7,1)] relative overflow-hidden">
//               <div className="absolute top-0 right-0 p-2 opacity-20">
//                 <AlertCircle className="w-16 h-16" />
//               </div>
//               <CardContent className="p-4 sm:p-5 h-full flex flex-col justify-between relative z-10">
//                 <div>
//                   <div className="flex items-center gap-2 mb-2">
//                     <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
//                     <p className="text-xs sm:text-sm font-bold uppercase">
//                       รอตรวจสอบ
//                     </p>
//                   </div>
//                   {/* แก้ฟอนต์ตัวเลขกลับเป็นปกติ */}
//                   <h3 className="text-3xl sm:text-4xl font-bold truncate">
//                     {pendingOrders}
//                     <span className="text-sm font-normal ml-1 opacity-80">
//                       รายการ
//                     </span>
//                   </h3>
//                 </div>
//                 <div className="mt-4">
//                   <Link href="/spin/orders" className="block w-full">
//                     <Button
//                       size="sm"
//                       className="w-full h-10 bg-white border-2 border-black text-black font-bold hover:bg-yellow-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px]"
//                     >
//                       ตรวจสอบ <ChevronRight className="w-4 h-4 ml-1" />
//                     </Button>
//                   </Link>
//                 </div>
//               </CardContent>
//             </Card>
//           ) : (
//             <Card className="h-full border-4 border-slate-700 bg-white dark:bg-slate-800 rounded-xl shadow-[6px_6px_0px_0px_rgba(51,65,85,1)]">
//               <CardContent className="p-4 sm:p-5 h-full flex flex-col justify-between">
//                 <div>
//                   <p className="text-xs sm:text-sm font-bold text-slate-500 mb-1 flex items-center gap-1">
//                     <History className="w-4 h-4" /> ประวัติการเล่น
//                   </p>
//                   {/* แก้ฟอนต์ตัวเลขกลับเป็นปกติ */}
//                   <h3 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 truncate">
//                     {totalSpins}{" "}
//                     <span className="text-sm font-normal text-muted-foreground">
//                       ครั้ง
//                     </span>
//                   </h3>
//                   <div className="mt-2">
//                     <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-2 py-1 border border-green-600 rounded-sm">
//                       ชนะ: {winCount}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="mt-4">
//                   <Link href="/spin/history" className="block w-full">
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="w-full h-10 border-2 border-slate-200 hover:border-slate-400 hover:bg-slate-100 text-slate-600 font-bold justify-between"
//                     >
//                       ดูทั้งหมด <ChevronRight className="w-4 h-4" />
//                     </Button>
//                   </Link>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </div>

//         {/* [กล่องขวา] Transaction */}
//         <div className="col-span-1">
//           <Card className="h-full border-4 border-blue-700 bg-blue-50 dark:bg-blue-950 rounded-xl shadow-[6px_6px_0px_0px_rgba(29,78,216,1)]">
//             <CardContent className="p-4 sm:p-5 h-full flex flex-col justify-between">
//               <div>
//                 <p className="text-xs sm:text-sm font-bold text-blue-500 mb-1 flex items-center gap-1">
//                   <Package className="w-4 h-4" /> ประวัติการเติม
//                 </p>
//                 {/* แก้ฟอนต์ตัวเลขกลับเป็นปกติ */}
//                 <h3 className="text-3xl sm:text-4xl font-bold text-blue-900 dark:text-blue-100 truncate">
//                   {orders.length}{" "}
//                   <span className="text-sm font-normal text-blue-400">บิล</span>
//                 </h3>
//               </div>
//               <div className="mt-4">
//                 <Link href="/spin/orders" className="block w-full">
//                   <Button
//                     size="sm"
//                     className="w-full h-10 bg-blue-600 border-2 border-black text-white font-bold hover:bg-blue-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px]"
//                   >
//                     ดูรายการ <ChevronRight className="w-4 h-4 ml-1" />
//                   </Button>
//                 </Link>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </section>

//       {/* --- ส่วนเลือกแพคเกจ (เหมือนเดิมเป๊ะ) --- */}
//       <div className="pt-4">
//         <div className="flex items-center gap-3 mb-6">
//           <div className="h-8 w-1.5 bg-green-500 rounded-full"></div>
//           <h2 className="text-xl font-bold">เลือกแพคเกจที่ต้องการ</h2>
//         </div>

//         <SpinPackagesList packages={packages} />
//       </div>
//     </div>
//   );
// }

import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/get-session";
import {
  getActiveSpinPackages,
  getSpinQuotaByUserId,
  getSpinOrdersByUserId,
  getSpinHistoryByUserId,
} from "@/services/spins";
import SpinPackagesList from "./spin-packages-list";

// Import UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Import Icons
import {
  AlertCircle,
  ChevronRight,
  History,
  Package,
  Play,
  Trophy,
  Zap,
  Sparkles,
  Gamepad2,
} from "lucide-react";
import PixelIconSwitcher from "./pixel-icon-switcher";

export const metadata: Metadata = {
  title: "ซื้อแพคเกจสปิน",
  description: "ซื้อแพคเกจสปินเพื่อเล่นเกมสปิน",
};

export default async function SpinPage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/sign-in?redirect=/spin");
  }

  // Fetch Data
  const packages = await getActiveSpinPackages();
  const quota = await getSpinQuotaByUserId(session.user.id);
  const orders = await getSpinOrdersByUserId(session.user.id);
  const spinHistory = await getSpinHistoryByUserId(session.user.id, {
    limit: 100,
  });

  // Calculations
  const pendingOrders = orders.filter(
    (order) => order.status === "WAITING_VERIFICATION",
  ).length;

  const remainingSpins = quota ? quota.total - quota.used : 0;
  const totalSpins = spinHistory.length;
  const winCount = spinHistory.filter((h) => h.result === "WIN").length;

  return (
    <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* --- Header --- */}
      <div className="flex flex-row items-start justify-between gap-2 sm:gap-4 mb-4 sm:mb-8 border-b-2 sm:border-b-4 border-green-600 pb-4 sm:pb-6">
        <div>
          <Badge className="mb-1 sm:mb-2 bg-green-600 text-white border sm:border-2 border-black rounded-none px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-green-700">
            <Gamepad2 className="w-3 h-3 mr-1" /> ITEM SHOP
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-green-900 dark:text-green-400 drop-shadow-sm leading-none">
            BUY SPIN PACKAGES
          </h1>
          <p className="text-[10px] sm:text-base font-bold text-muted-foreground mt-1 leading-tight">
            &gt; SELECT A PACKAGE TO RECHARGE ENERGY.
          </p>
        </div>

        {/* Decorative Icon Box (ย่อขนาดในมือถือ) */}
        <div className="flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900 border-2 sm:border-4 border-green-700 rounded-lg shadow-[2px_2px_0px_0px_rgba(20,83,45,1)] sm:shadow-[4px_4px_0px_0px_rgba(20,83,45,1)] rotate-3 shrink-0">
          <Zap
            className="w-5 h-5 sm:w-8 sm:h-8 text-green-600 dark:text-green-300 animate-pulse"
            fill="currentColor"
          />
        </div>
      </div>

      {/* --- ส่วนที่ 1: กล่องใหญ่ (ย่อขนาดมือถือ) --- */}
      <section className="w-full">
        <Card className="relative overflow-visible border-2 sm:border-4 border-green-700 bg-green-600 text-white rounded-lg sm:rounded-xl shadow-[4px_4px_0px_0px_rgba(20,83,45,1)] sm:shadow-[8px_8px_0px_0px_rgba(20,83,45,1)] hover:translate-y-1 transition-all duration-200">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:10px_10px] sm:bg-[size:20px_20px] opacity-30"></div>

          {/* ปรับ Padding ให้น้อยลงในมือถือ (p-4) */}
          <CardContent className="p-4 sm:p-8 flex flex-row items-center justify-between gap-3 sm:gap-6 relative z-10">
            {/* Left Side */}
            <div className="text-left space-y-2 sm:space-y-4 flex-1">
              <div className="inline-flex items-center gap-1.5 bg-black/20 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-green-400/30">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 fill-yellow-300 animate-pulse" />
                <span className="font-bold text-[10px] sm:text-sm text-green-100">
                  พลังงานคงเหลือ
                </span>
              </div>

              <div className="relative">
                {/* ย่อตัวเลขในมือถือเหลือ text-5xl */}
                <h2 className="text-5xl sm:text-7xl font-bold text-white drop-shadow-md leading-none">
                  {remainingSpins}
                </h2>
                <span className="absolute -top-1 -right-2 sm:-top-2 sm:-right-6 rotate-12 bg-yellow-400 text-black text-[8px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-sm border sm:border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] sm:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  QUOTA
                </span>
              </div>

              <p className="text-green-100 font-medium text-[10px] sm:text-base max-w-md bg-green-700/50 p-1.5 sm:p-2 rounded-lg border border-green-500/50 leading-tight">
                ใช้สิทธิ์หมุนเพื่อปลดล็อกไอเทมระดับตำนาน!
              </p>
            </div>

            {/* Right Side: ย่อรูปและปุ่ม */}
            <div className="flex flex-col items-center gap-2 sm:gap-4 relative">
              {/* ย่อรูปเหลือ w-16 h-16 ในมือถือ */}
              <div className="w-14 h-16 sm:w-32 sm:h-36 relative animate-bounce-slow flex items-center justify-center">
                <PixelIconSwitcher />
              </div>

              <Link href="/game" className="w-full md:w-auto">
                {/* ย่อปุ่มเหลือ h-10 และ text-sm ในมือถือ */}
                <Button
                  size="lg"
                  className="w-full md:w-48 h-10 sm:h-14 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-sm sm:text-xl border-2 sm:border-4 border-black rounded-md sm:rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0.5 transition-all"
                >
                  <Play className="w-4 h-4 sm:w-6 sm:h-6 mr-1 sm:mr-2 fill-black" />
                  เล่นเกมเลย
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* --- ส่วนที่ 2: กล่องเล็ก (ย่อขนาดมือถือ) --- */}
      <section className="grid grid-cols-2 gap-3 sm:gap-6">
        {/* [กล่องซ้าย] Status / History */}
        <div className="col-span-1">
          {pendingOrders > 0 ? (
            <Card className="h-full border-2 sm:border-4 border-yellow-600 bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 rounded-lg sm:rounded-xl shadow-[3px_3px_0px_0px_rgba(161,98,7,1)] sm:shadow-[6px_6px_0px_0px_rgba(161,98,7,1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-1 sm:p-2 opacity-20">
                <AlertCircle className="w-8 h-8 sm:w-16 sm:h-16" />
              </div>
              <CardContent className="p-3 sm:p-5 h-full flex flex-col justify-between relative z-10">
                <div>
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-ping"></div>
                    <p className="text-[10px] sm:text-sm font-bold uppercase truncate">
                      รอตรวจสอบ
                    </p>
                  </div>
                  <h3 className="text-xl sm:text-4xl font-bold truncate">
                    {pendingOrders}
                    <span className="text-[10px] sm:text-sm font-normal ml-1 opacity-80">
                      รายการ
                    </span>
                  </h3>
                </div>
                <div className="mt-2 sm:mt-4">
                  <Link href="/spin/orders" className="block w-full">
                    <Button
                      size="sm"
                      className="w-full h-8 sm:h-10 text-[10px] sm:text-sm bg-white border sm:border-2 border-black text-black font-bold hover:bg-yellow-200 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] sm:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
                    >
                      ตรวจสอบ{" "}
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5 sm:ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full border-2 sm:border-4 border-slate-700 bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow-[3px_3px_0px_0px_rgba(51,65,85,1)] sm:shadow-[6px_6px_0px_0px_rgba(51,65,85,1)]">
              <CardContent className="p-3 sm:p-5 h-full flex flex-col justify-between">
                <div>
                  <p className="text-[10px] sm:text-sm font-bold text-slate-500 mb-1 flex items-center gap-1 truncate">
                    <History className="w-3 h-3 sm:w-4 sm:h-4" /> ประวัติการเล่น
                  </p>
                  <h3 className="text-xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 truncate">
                    {totalSpins}{" "}
                    <span className="text-[10px] sm:text-sm font-normal text-muted-foreground">
                      ครั้ง
                    </span>
                  </h3>
                  <div className="mt-1 sm:mt-2">
                    <span className="inline-block bg-green-100 text-green-800 text-[10px] sm:text-xs font-bold px-1.5 py-0.5 border border-green-600 rounded-sm">
                      ชนะ: {winCount}
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:mt-4">
                  <Link href="/spin/history" className="block w-full">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full h-8 sm:h-10 border sm:border-2 border-slate-200 hover:border-slate-400 hover:bg-slate-100 text-slate-600 font-bold justify-between text-[10px] sm:text-sm"
                    >
                      ดูทั้งหมด{" "}
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* [กล่องขวา] Transaction */}
        <div className="col-span-1">
          <Card className="h-full border-2 sm:border-4 border-blue-700 bg-blue-50 dark:bg-blue-950 rounded-lg sm:rounded-xl shadow-[3px_3px_0px_0px_rgba(29,78,216,1)] sm:shadow-[6px_6px_0px_0px_rgba(29,78,216,1)]">
            <CardContent className="p-3 sm:p-5 h-full flex flex-col justify-between">
              <div>
                <p className="text-[10px] sm:text-sm font-bold text-blue-500 mb-1 flex items-center gap-1 truncate">
                  <Package className="w-3 h-3 sm:w-4 sm:h-4" /> ประวัติการเติม
                </p>
                <h3 className="text-xl sm:text-4xl font-bold text-blue-900 dark:text-blue-100 truncate">
                  {orders.length}{" "}
                  <span className="text-[10px] sm:text-sm font-normal text-blue-400">
                    บิล
                  </span>
                </h3>
              </div>
              <div className="mt-2 sm:mt-4">
                <Link href="/spin/orders" className="block w-full">
                  <Button
                    size="sm"
                    className="w-full h-8 sm:h-10 bg-blue-600 border sm:border-2 border-black text-white font-bold hover:bg-blue-500 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] sm:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none text-[10px] sm:text-sm"
                  >
                    ดูรายการ{" "}
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5 sm:ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* --- ส่วนเลือกแพคเกจ --- */}
      <div className="pt-2 sm:pt-4 pb-2">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="h-6 w-1 sm:h-8 sm:w-1.5 bg-green-500 rounded-full"></div>
          <h2 className="text-lg sm:text-xl font-bold">
            เลือกแพคเกจที่ต้องการ
          </h2>
        </div>

        <SpinPackagesList packages={packages} />
      </div>
    </div>
  );
}
