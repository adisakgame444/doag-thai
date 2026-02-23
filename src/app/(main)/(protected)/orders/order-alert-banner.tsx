// "use client";

// import { useCallback, useEffect, useState, useRef } from "react";
// import { checkOrderOutOfStockAction } from "./actions";
// import { AlertCircle, ChevronRight } from "lucide-react";
// import Link from "next/link";
// import { usePathname, useSearchParams } from "next/navigation";

// export default function OrderAlertBanner() {
//   const [alertData, setAlertData] = useState<{
//     id: string;
//     number: string;
//   } | null>(null);
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   // ✅ 2. สร้าง Ref เพื่อเก็บ "รหัส" ของ Loop
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);
//   // ✅ 3. สร้างตัวแปรเช็คว่า "เคยมีปัญหามาก่อนไหม"
//   // เพื่อกันไม่ให้มันสั่งหยุดตั้งแต่เปิดเว็บครั้งแรกที่ยังไม่มีปัญหาอะไร
//   const hasProblemRef = useRef(false);

//   const fetchAlert = useCallback(async () => {
//     const res = await checkOrderOutOfStockAction();
//     if (res.hasAlert && res.orderId) {
//       setAlertData({ id: res.orderId, number: res.orderNumber || "" });
//       hasProblemRef.current = true; // จำไว้ว่ามีปัญหา
//     } else {
//       setAlertData(null); // ✅ สำคัญ: ถ้าไม่มีปัญหาแล้ว ต้องสั่งให้หายไป
//     }

//     if (hasProblemRef.current) {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//         intervalRef.current = null;
//       }
//       console.log("ลูกค้าแก้เสร็จแล้ว หยุด Loop 10 วิ ถาวร");
//     }
//   }, []);
//   // แก้ไขในส่วน useEffect
//   // useEffect(() => {
//   //   // 1. เช็คทันทีที่หน้าโหลด
//   //   fetchAlert();

//   //   // 2. ✅ เพิ่ม Polling: ตรวจสอบสถานะอัตโนมัติทุก 10 วินาที
//   //   // หากแอดมินกดแจ้งมาจากหลังบ้าน แจ้งเตือนจะเด้งขึ้นมาเองใน 10 วินาทีครับ
//   //   const interval = setInterval(() => {
//   //     fetchAlert();
//   //   }, 10000);

//   //   // 3. Clean up: ล้าง Interval เมื่อปิดหน้าเว็บป้องกันเครื่องอืด
//   //   return () => clearInterval(interval);
//   // }, [pathname, searchParams, fetchAlert]);
//   // if (!alertData) return null;

//   useEffect(() => {
//     fetchAlert();

//     // ✅ 5. เก็บ ID ของ Loop ไว้ใน Ref
//     intervalRef.current = setInterval(() => {
//       // เช็ค page visibility นิดนึง ถ้าพับจอไม่ต้องทำ
//       if (document.hidden) return;
//       fetchAlert();
//     }, 10000);

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, [pathname, searchParams, fetchAlert]);

//   if (!alertData) return null;

//   return (
//     <div className="fixed top-[70px] left-0 right-0 z-[45] px-4 animate-in fade-in slide-in-from-top duration-500">
//       <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-red-500/30 bg-red-500/10 backdrop-blur-md shadow-[0_0_20px_rgba(239,68,68,0.2)]">
//         <Link
//           href={`/orders#${alertData.id}`}
//           className="flex items-center justify-between p-3 md:p-4 group cursor-pointer"
//         >
//           <div className="flex items-center gap-3">
//             <div className="bg-red-500 rounded-full p-1.5 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
//               <AlertCircle className="w-5 h-5 text-white animate-pulse" />
//             </div>
//             <div>
//               <h4 className="text-sm md:text-base font-bold text-red-100 leading-none mb-1">
//                 แจ้งเตือนสินค้าหมดสต็อก!
//               </h4>
//               <p className="text-[11px] md:text-xs text-red-200/80">
//                 ออเดอร์ #{alertData.number} มีบางรายการหมดกะทันหัน
//                 กรุณากดเพื่อจัดการ
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-[11px] md:text-sm font-bold px-3 py-2 rounded-xl transition-all group-hover:scale-105">
//             จัดการเดี๋ยวนี้
//             <ChevronRight className="w-4 h-4" />
//           </div>
//         </Link>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { checkOrderOutOfStockAction } from "./actions";
// import { AlertCircle, ChevronRight } from "lucide-react";
// import Link from "next/link";
// import { usePathname, useSearchParams } from "next/navigation";

// export default function OrderAlertBanner() {
//   const [alertData, setAlertData] = useState<{
//     id: string;
//     number: string;
//   } | null>(null);

//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   // ❌ ลบ intervalRef และ hasProblemRef ออกได้เลย ไม่จำเป็นต้องใช้แล้ว
//   // เพราะเราต้องการให้มันทำงานตลอด ไม่มีการ "จำว่าเคยมีปัญหาแล้วหยุด"

//   const fetchAlert = useCallback(async () => {
//     // ✅ เพิ่มตรงนี้: ถ้าลูกค้าพับจอไปทำอย่างอื่น ให้หยุดเช็คชั่วคราว (ประหยัดทรัพยากร)
//     // พอกลับมาหน้าเว็บ มันจะทำงานต่อเอง
//     if (document.hidden) return;

//     try {
//       const res = await checkOrderOutOfStockAction();

//       if (res.hasAlert && res.orderId) {
//         // 🔴 เจอของหมด (ไม่ว่าเป็นรายการเก่าหรือรายการใหม่ที่เพิ่งมา)
//         setAlertData({ id: res.orderId, number: res.orderNumber || "" });
//       } else {
//         // 🟢 ไม่เจอ (ลูกค้าแก้เสร็จแล้ว หรือไม่มีปัญหา)
//         // สั่งปิดป้ายแจ้งเตือน แต่ **ไม่ต้องสั่งหยุด Loop**
//         setAlertData(null);
//       }
//     } catch (error) {
//       console.error("Error fetching alert:", error);
//     }

//     // ❌ ลบส่วน logic ที่สั่ง clearInterval ทิ้งไปเลย
//     // เพื่อให้รอบถัดไป (อีก 10 วิ) มันยังคงทำงานเช็ครายการใหม่ต่อ
//   }, []);

//   useEffect(() => {
//     // 1. เช็คทันทีที่เปิดหน้า
//     fetchAlert();

//     // 2. ตั้งเวลา Loop ทุก 10 วินาที (ทำงานไปเรื่อยๆ)
//     const intervalId = setInterval(fetchAlert, 10000);

//     // 3. Cleanup: ล้าง Interval เมื่อปิดหน้าเว็บ/เปลี่ยนหน้า
//     return () => clearInterval(intervalId);
//   }, [pathname, searchParams, fetchAlert]);

//   if (!alertData) return null;

//   return (
//     <div className="fixed top-[70px] left-0 right-0 z-[45] px-4 animate-in fade-in slide-in-from-top duration-500">
//       <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-red-500/30 bg-red-500/10 backdrop-blur-md shadow-[0_0_20px_rgba(239,68,68,0.2)]">
//         <Link
//           href={`/orders#${alertData.id}`}
//           className="flex items-center justify-between p-3 md:p-4 group cursor-pointer"
//         >
//           <div className="flex items-center gap-3">
//             <div className="bg-red-500 rounded-full p-1.5 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
//               <AlertCircle className="w-5 h-5 text-white animate-pulse" />
//             </div>
//             <div>
//               <h4 className="text-sm md:text-base font-bold text-red-100 leading-none mb-1">
//                 แจ้งเตือนสินค้าหมดสต็อก!
//               </h4>
//               <p className="text-[11px] md:text-xs text-red-200/80">
//                 ออเดอร์ #{alertData.number} มีบางรายการหมดกะทันหัน
//                 กรุณากดเพื่อจัดการ
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-[11px] md:text-sm font-bold px-3 py-2 rounded-xl transition-all group-hover:scale-105">
//             จัดการเดี๋ยวนี้
//             <ChevronRight className="w-4 h-4" />
//           </div>
//         </Link>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { useRouter } from "next/navigation"; // ✅ 1. ต้อง import ตัวนี้
// import { checkOrderOutOfStockAction } from "./actions";
// import { AlertCircle, ChevronRight } from "lucide-react";
// import Link from "next/link";
// import { usePathname, useSearchParams } from "next/navigation";

// export default function OrderAlertBanner() {
//   const [alertData, setAlertData] = useState<{
//     id: string;
//     number: string;
//   } | null>(null);

//   const router = useRouter(); // ✅ 2. เรียกใช้ Router Hook
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   const fetchAlert = useCallback(async () => {
//     // ถ้าพับจออยู่ ไม่ต้องเช็ค
//     if (document.hidden) return;

//     try {
//       const res = await checkOrderOutOfStockAction();

//       if (res.hasAlert && res.orderId) {
//         // 🔴 เจอของหมด!
//         setAlertData((prev) => {
//           // Logic: ถ้า "เมื่อกี้" ยังไม่มีแจ้งเตือน (หรือเป็นคนละออเดอร์)
//           // แปลว่าเพิ่งเกิดเรื่อง -> สั่งรีเฟรชหน้า Server Component ทันที!
//           if (!prev || prev.id !== res.orderId) {
//             console.log("New alert! Refreshing Server Component...");
//             router.refresh(); // ✨ คำสั่งศักดิ์สิทธิ์: สั่งให้หน้า OrdersPage โหลดใหม่
//           }
//           return { id: res.orderId, number: res.orderNumber || "" };
//         });
//       } else {
//         // 🟢 ปกติ (ไม่มีของหมด หรือแก้เสร็จแล้ว)
//         setAlertData((prev) => {
//           // Logic: ถ้า "เมื่อกี้" มีแจ้งเตือน แล้วตอนนี้หายไป
//           // แปลว่าแก้เสร็จแล้ว -> สั่งรีเฟรชเพื่อเอากล่องแดงออก
//           if (prev) {
//             console.log("Alert resolved! Refreshing Server Component...");
//             router.refresh(); // ✨ สั่งรีเฟรชอีกรอบ เพื่อเคลียร์หน้าจอ
//           }
//           return null;
//         });
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   }, [router]); // ✅ ใส่ router เป็น dependency

//   useEffect(() => {
//     // 1. เช็คครั้งแรก
//     fetchAlert();

//     // 2. ตั้ง Loop เช็คทุก 10 วินาที
//     const intervalId = setInterval(fetchAlert, 10000);

//     return () => clearInterval(intervalId);
//   }, [pathname, searchParams, fetchAlert]);

//   if (!alertData) return null;

//   return (
//     <div className="fixed top-[70px] left-0 right-0 z-[45] px-4 animate-in fade-in slide-in-from-top duration-500">
//       <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-red-500/30 bg-red-500/10 backdrop-blur-md shadow-[0_0_20px_rgba(239,68,68,0.2)]">
//         <Link
//           href={`/orders#${alertData.id}`}
//           className="flex items-center justify-between p-3 md:p-4 group cursor-pointer"
//         >
//           <div className="flex items-center gap-3">
//             <div className="bg-red-500 rounded-full p-1.5 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
//               <AlertCircle className="w-5 h-5 text-white animate-pulse" />
//             </div>
//             <div>
//               <h4 className="text-sm md:text-base font-bold text-red-100 leading-none mb-1">
//                 แจ้งเตือนสินค้าหมดสต็อก!
//               </h4>
//               <p className="text-[11px] md:text-xs text-red-200/80">
//                 ออเดอร์ #{alertData.number} มีบางรายการหมดกะทันหัน
//                 กรุณากดเพื่อจัดการ
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-[11px] md:text-sm font-bold px-3 py-2 rounded-xl transition-all group-hover:scale-105">
//             จัดการเดี๋ยวนี้
//             <ChevronRight className="w-4 h-4" />
//           </div>
//         </Link>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useCallback, useEffect, useState, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { checkOrderOutOfStockAction } from "./actions";
// import { AlertCircle, ChevronRight } from "lucide-react";
// import Link from "next/link";
// import { usePathname, useSearchParams } from "next/navigation";

// export default function OrderAlertBanner() {
//   const [alertData, setAlertData] = useState<{
//     id: string;
//     number: string;
//   } | null>(null);

//   // Ref เก็บค่าล่าสุด (รับ string หรือ null)
//   const lastAlertIdRef = useRef<string | null>(null);

//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   const fetchAlert = useCallback(async () => {
//     // 1. ถ้าพับจอ ไม่ต้องเช็ค
//     if (document.hidden) return;

//     try {
//       const res = await checkOrderOutOfStockAction();

//       const currentId = lastAlertIdRef.current;

//       // ✅ จุดที่แก้: ใส่ ?? null เพื่อแปลง undefined ให้เป็น null เสมอ
//       // จะได้ไม่มี Error เรื่อง Type mismatch
//       const newId = res.hasAlert ? (res.orderId ?? null) : null;

//       // 2. เช็คว่าค่าเปลี่ยนไปจากเดิมไหม
//       if (currentId !== newId) {
//         console.log("Status changed! Refreshing Server & UI...");

//         // A. สั่ง Server Component โหลดข้อมูลใหม่
//         router.refresh();

//         // B. อัปเดต Ref เป็นค่าใหม่ (Safe แล้วเพราะ newId เป็น null ได้ แต่ไม่เป็น undefined)
//         lastAlertIdRef.current = newId;

//         // C. อัปเดต UI
//         if (res.hasAlert && res.orderId) {
//           setAlertData({ id: res.orderId, number: res.orderNumber || "" });
//         } else {
//           setAlertData(null);
//         }
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   }, [router]);

//   useEffect(() => {
//     // 1. เช็คครั้งแรก
//     fetchAlert();

//     // 2. ตั้ง Loop เช็คทุก 5 นาที
//     const intervalId = setInterval(fetchAlert, 300000);

//     return () => clearInterval(intervalId);
//   }, [pathname, searchParams, fetchAlert]);

//   if (!alertData) return null;

//   return (
//     <div className="fixed top-[70px] left-0 right-0 z-[45] px-4 animate-in fade-in slide-in-from-top duration-500">
//       <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-red-500/30 bg-red-500/10 backdrop-blur-md shadow-[0_0_20px_rgba(239,68,68,0.2)]">
//         <Link
//           href={`/orders#${alertData.id}`}
//           className="flex items-center justify-between p-3 md:p-4 group cursor-pointer"
//         >
//           <div className="flex items-center gap-3">
//             <div className="bg-red-500 rounded-full p-1.5 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
//               <AlertCircle className="w-5 h-5 text-white animate-pulse" />
//             </div>
//             <div>
//               <h4 className="text-sm md:text-base font-bold text-red-100 leading-none mb-1">
//                 แจ้งเตือนสินค้าหมดสต็อก!
//               </h4>
//               <p className="text-[11px] md:text-xs text-red-200/80">
//                 ออเดอร์ #{alertData.number} มีบางรายการหมดกะทันหัน
//                 กรุณากดเพื่อจัดการ
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-[11px] md:text-sm font-bold px-3 py-2 rounded-xl transition-all group-hover:scale-105">
//             จัดการเดี๋ยวนี้
//             <ChevronRight className="w-4 h-4" />
//           </div>
//         </Link>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useCallback, useEffect, useState, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { checkOrderOutOfStockAction } from "./actions";
// import { AlertCircle, ChevronRight, PackageX } from "lucide-react"; // แนะนำ PackageX หรือ AlertCircle ตามชอบ
// import Link from "next/link";
// import { usePathname, useSearchParams } from "next/navigation";

// export default function OrderAlertBanner() {
//   const [alertData, setAlertData] = useState<{
//     id: string;
//     number: string;
//   } | null>(null);

//   // ✅ 1. ระบบ Logic คงเดิมทุกประการ (ห้ามแตะ)
//   const lastAlertIdRef = useRef<string | null>(null);

//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   const fetchAlert = useCallback(async () => {
//     // Check จอพับ (Performance)
//     if (document.hidden) return;

//     try {
//       const res = await checkOrderOutOfStockAction();

//       const currentId = lastAlertIdRef.current;
//       // แปลง undefined -> null เพื่อความชัวร์ของ Type
//       const newId = res.hasAlert ? (res.orderId ?? null) : null;

//       // Check การเปลี่ยนแปลงสถานะ
//       if (currentId !== newId) {
//         console.log("Status changed! Refreshing Server & UI...");

//         // สั่ง Server โหลดข้อมูลใหม่ (สำคัญมาก)
//         router.refresh();

//         // อัปเดต Ref
//         lastAlertIdRef.current = newId;

//         // อัปเดต UI State
//         if (res.hasAlert && res.orderId) {
//           setAlertData({ id: res.orderId, number: res.orderNumber || "" });
//         } else {
//           setAlertData(null);
//         }
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   }, [router]);

//   useEffect(() => {
//     // เช็คครั้งแรก
//     fetchAlert();
//     // Loop เช็คทุก 5 นาที
//     const intervalId = setInterval(fetchAlert, 300000);
//     return () => clearInterval(intervalId);
//   }, [pathname, searchParams, fetchAlert]);

//   if (!alertData) return null;

//   // ✅ 2. ส่วนแสดงผล (UI) ปรับใหม่หมด: เขียว / เล็ก / สวย / ทันสมัย
//   return (
//     <div className="fixed top-[70px] left-0 right-0 z-[45] px-3 flex justify-center animate-in fade-in slide-in-from-top duration-500">
//       <div className="w-full max-w-[600px]">
//         {" "}
//         {/* จำกัดความกว้างให้พอดี ไม่ใหญ่เทอะทะ */}
//         <Link
//           href={`/orders#${alertData.id}`}
//           className="
//             group relative overflow-hidden
//             flex items-center justify-between
//             p-2 sm:p-2.5
//             rounded-xl
//             bg-neutral-900/90 backdrop-blur-md /* พื้นหลังดำโปร่ง */
//             border border-emerald-500/40 /* ขอบสีเขียว */
//             shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)] /* เงาเขียวฟุ้งๆ */
//             hover:border-emerald-400/60 hover:shadow-[0_0_20px_-3px_rgba(16,185,129,0.3)]
//             transition-all duration-300
//             cursor-pointer
//           "
//         >
//           {/* แสง Neon วิ่งผ่านเวลากด (Optional Effect) */}
//           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

//           {/* ส่วนซ้าย: ไอคอน + ข้อความ */}
//           <div className="flex items-center gap-3">
//             {/* กล่องไอคอน */}
//             {/* <div
//               className="
//               flex items-center justify-center
//               w-8 h-8 sm:w-9 sm:h-9
//               rounded-lg
//               bg-emerald-500/20
//               text-emerald-400
//               shadow-[inset_0_0_8px_rgba(16,185,129,0.2)]
//             "
//             >
//               <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
//             </div> */}

//             <div
//               className="
//     flex items-center justify-center
//     w-8 h-8 sm:w-9 sm:h-9
//     rounded-lg
//     bg-red-500/20
//     text-red-500
//     shadow-[inset_0_0_8px_rgba(239,68,68,0.2)]
//   "
//             >
//               <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
//             </div>

//             {/* ข้อความ */}
//             <div className="flex flex-col">
//               <h4 className="text-[13px] sm:text-sm font-bold text-emerald-100 leading-tight">
//                 แจ้งสินค้าหมดสต็อก!
//               </h4>
//               <p className="text-[10px] sm:text-[11px] text-emerald-400/80 font-medium">
//                 ออเดอร์ #{alertData.number} ต้องการการจัดการ
//               </p>
//             </div>
//           </div>

//           {/* ส่วนขวา: ปุ่ม Action */}
//           <div
//             className="
//             flex items-center gap-1
//             bg-emerald-600 group-hover:bg-emerald-500
//             text-white
//             text-[10px] sm:text-xs font-bold
//             px-3 py-1.5
//             rounded-lg
//             shadow-lg shadow-emerald-900/20
//             transition-transform group-hover:scale-105
//           "
//           >
//             จัดการ
//             <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
//           </div>
//         </Link>
//       </div>
//     </div>
//   );
// }

"use client";

import { useCallback, useEffect, useState, useRef, Suspense } from "react"; // ✅ 1. เพิ่ม import Suspense
import { useRouter } from "next/navigation";
import { checkOrderOutOfStockAction } from "./actions";
import { AlertCircle, ChevronRight, PackageX } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

// ✅ 2. แยก Logic การทำงานเดิมทั้งหมด มาไว้ใน Component ย่อย (Content)
function OrderAlertBannerContent() {
  const [alertData, setAlertData] = useState<{
    id: string;
    number: string;
  } | null>(null);

  const lastChangeKeyRef = useRef<string | null>(null);
  const isFetchingRef = useRef(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); // 👈 ตัวการมาหลบอยู่ในนี้ (ปลอดภัยแล้ว เพราะมีแม่ห่อให้)

  const fetchAlert = useCallback(async () => {
    if (document.hidden || isFetchingRef.current) return;

    try {
      const res = await checkOrderOutOfStockAction();
      const currentId = lastChangeKeyRef.current;
      const newId = res.hasAlert ? (res.changeHash ?? null) : null;

      if (currentId !== newId) {
        console.log("Status changed! Refreshing Server & UI...");
        lastChangeKeyRef.current = newId;

        if (res.hasAlert && res.orderId) {
          setAlertData({ id: res.orderId, number: res.orderNumber || "" });
          router.refresh();
        } else {
          setAlertData(null);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      isFetchingRef.current = false;
    }
  }, [router]);

  useEffect(() => {
    fetchAlert();

    const intervalId = setInterval(fetchAlert, 30000);

    const onFocus = () => fetchAlert();
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
    };
  }, [pathname, searchParams, fetchAlert]);

  if (!alertData) return null;

  // ส่วนแสดงผล UI เดิม
  return (
    <div className="fixed top-[70px] left-0 right-0 z-[45] px-3 flex justify-center animate-in fade-in slide-in-from-top duration-500">
      <div className="w-full max-w-[600px]">
        <Link
          href={`/orders#${alertData.id}`}
          className="
            group relative overflow-hidden
            flex items-center justify-between
            p-2 sm:p-2.5 
            rounded-xl
            bg-neutral-900/90 backdrop-blur-md
            border border-emerald-500/40
            shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]
            hover:border-emerald-400/60 hover:shadow-[0_0_20px_-3px_rgba(16,185,129,0.3)]
            transition-all duration-300
            cursor-pointer
          "
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

          <div className="flex items-center gap-3">
            <div
              className="
                flex items-center justify-center
                w-8 h-8 sm:w-9 sm:h-9
                rounded-lg
                bg-red-500/20 
                text-red-500
                shadow-[inset_0_0_8px_rgba(239,68,68,0.2)]
              "
            >
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            </div>

            <div className="flex flex-col">
              <h4 className="text-[13px] sm:text-sm font-bold text-emerald-100 leading-tight">
                แจ้งสินค้าหมดสต็อก!
              </h4>
              <p className="text-[10px] sm:text-[11px] text-emerald-400/80 font-medium">
                ออเดอร์ #{alertData.number} ต้องการการจัดการ
              </p>
            </div>
          </div>

          <div
            className="
            flex items-center gap-1 
            bg-emerald-600 group-hover:bg-emerald-500 
            text-white 
            text-[10px] sm:text-xs font-bold 
            px-3 py-1.5 
            rounded-lg 
            shadow-lg shadow-emerald-900/20
            transition-transform group-hover:scale-105
          "
          >
            จัดการ
            <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
        </Link>
      </div>
    </div>
  );
}

// ✅ 3. Export Default ตัวใหม่ที่เป็น Wrapper (เกราะป้องกัน)
export default function OrderAlertBanner() {
  return (
    // ห่อ Suspense ไว้ตรงนี้เลย! ทำให้ Component นี้ปลอดภัย 100%
    <Suspense fallback={null}>
      <OrderAlertBannerContent />
    </Suspense>
  );
}
