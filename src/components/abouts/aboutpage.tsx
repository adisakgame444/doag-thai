// "use client";

// import React from "react";
// import Link from "next/link";
// import { CheckCircle, Truck, ShieldCheck, Clock, Package } from "lucide-react";

// export default function AboutPageContent(): React.JSX.Element {
//   return (
//     <section className="max-w-6xl mx-auto p-3 md:p-12 mt-16 text-sm leading-relaxed">
//       <div className="bg-gradient-to-r from-green-950/90 via-green-900/80 to-emerald-900/70 text-green-50 rounded-3xl shadow-2xl p-8 md:p-12">
//         <div className="md:flex md:items-center md:justify-between gap-8">
//           <div className="md:flex-1">
//             <h1 className="text-2xl md:text-4xl font-extrabold leading-tight mb-4 text-green-50">
//               เกี่ยวกับ <span className="text-emerald-300">DOAG THAI</span>
//             </h1>
//             <p className="text-sm md:text-base text-green-200 mb-6 max-w-2xl">
//               DOAG THAI มุ่งมั่นเสนอ{" "}
//               <span className="font-semibold text-green-100">
//                 สินค้าสายเขียวคุณภาพ
//               </span>{" "}
//               ที่ผ่านการคัดสรรอย่างเข้มงวด
//               เพื่อให้ลูกค้าได้รับประสบการณ์ที่ปลอดภัย สบายใจ
//               และน่าเชื่อถือในการใช้งาน
//             </p>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
//               <div className="flex items-start gap-3">
//                 <span className="p-3 bg-green-800/60 rounded-lg">
//                   <CheckCircle
//                     className="w-5 h-5 text-emerald-300"
//                     aria-hidden
//                   />
//                 </span>
//                 <div>
//                   <h3 className="font-semibold text-green-100 text-sm">
//                     คุณภาพที่ตรวจสอบ
//                   </h3>
//                   <p className="text-xs text-green-200">
//                     สินค้าทุกชิ้นผ่านการตรวจคุณภาพก่อนจัดส่ง
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-3">
//                 <span className="p-3 bg-green-800/60 rounded-lg">
//                   <Truck className="w-5 h-5 text-emerald-300" aria-hidden />
//                 </span>
//                 <div>
//                   <h3 className="font-semibold text-green-100 text-sm">
//                     จัดส่งรวดเร็ว
//                   </h3>
//                   <p className="text-xs text-green-200">
//                     จัดส่งหลังยืนยันชำระเงิน พร้อมแจ้งเลขพัสดุ
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-3">
//                 <span className="p-3 bg-green-800/60 rounded-lg">
//                   <ShieldCheck
//                     className="w-5 h-5 text-emerald-300"
//                     aria-hidden
//                   />
//                 </span>
//                 <div>
//                   <h3 className="font-semibold text-green-100 text-sm">
//                     บริการเป็นมิตร
//                   </h3>
//                   <p className="text-xs text-green-200">
//                     ทีมงานพร้อมตอบคำถามและให้คำปรึกษาอย่างจริงใจ
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-3">
//                 <span className="p-3 bg-green-800/60 rounded-lg">
//                   <Clock className="w-5 h-5 text-emerald-300" aria-hidden />
//                 </span>
//                 <div>
//                   <h3 className="font-semibold text-green-100 text-sm">
//                     เวลาทำการที่ชัดเจน
//                   </h3>
//                   <p className="text-xs text-green-200">
//                     เปิดทุกวัน 10:00 - 22:00 น. ติดต่อได้สะดวก
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-8 flex items-center gap-4">
//               <Link
//                 href="/contact"
//                 className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-400/10 border border-emerald-300 text-emerald-100 font-medium hover:bg-emerald-400/20 transition text-sm"
//                 aria-label="ติดต่อเรา"
//               >
//                 ติดต่อเรา
//               </Link>

//               <Link
//                 href="/products"
//                 className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-400 text-emerald-950 font-semibold shadow-inner hover:scale-[1.01] transition-transform text-sm"
//                 aria-label="ดูสินค้า"
//               >
//                 ดูสินค้า
//               </Link>
//             </div>
//           </div>

//           <div className="md:w-96 mt-8 md:mt-0">
//             <div className="bg-green-800/60 p-5 rounded-2xl shadow-inner">
//               <h4 className="text-base font-bold text-green-50 mb-3">
//                 เงื่อนไขการสั่งซื้อ
//               </h4>
//               <ul className="text-xs text-green-200 space-y-2 list-inside list-disc">
//                 <li>แนบหลักฐานการชำระเงินก่อนจัดส่ง</li>
//                 <li>รองรับการชำระผ่านธนาคารและ Mobile Banking</li>
//                 <li>
//                   ไม่รับคืนเงินจากการเปลี่ยนใจ
//                   แต่รับเปลี่ยน/ชดเชยหากผิดพลาดจากร้าน
//                 </li>
//               </ul>

//               <div className="mt-5 border-t border-green-700 pt-4">
//                 <div className="flex items-center gap-3">
//                   <span className="p-2 bg-green-700 rounded-lg">
//                     <Package className="w-4 h-4 text-emerald-200" aria-hidden />
//                   </span>
//                   <div>
//                     <p className="text-xs text-green-200">
//                       จัดส่งรวดเร็ว & บรรจุอย่างปลอดภัย
//                     </p>
//                     <p className="text-[11px] text-green-400">
//                       แจ้งเลขพัสดุเมื่อจัดส่งเรียบร้อย
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-6 rounded-2xl overflow-hidden">
//               <div className="w-full h-40 bg-gradient-to-br from-emerald-800 to-green-900 flex items-center justify-center">
//                 <svg
//                   width="120"
//                   height="120"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="opacity-30"
//                 >
//                   <path
//                     d="M12 2C10.5 6 6 7 6 11c0 3 3 4 6 9 3-5 6-6 6-9 0-4-4.5-5-6-9z"
//                     stroke="currentColor"
//                     strokeWidth="1.2"
//                   />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mt-10 bg-green-800/70 rounded-2xl p-6 md:p-8">
//           <p className="text-center text-sm md:text-base text-green-50 font-medium">
//             ✨ DOAG THAI มุ่งมั่นส่งมอบ{" "}
//             <span className="text-emerald-200 font-semibold">
//               สายเขียวคุณภาพ
//             </span>{" "}
//             พร้อมบริการที่เป็นมิตรและใส่ใจในทุกรายละเอียด
//             เพื่อความสุขและความสบายใจของลูกค้าทุกท่าน
//           </p>
//         </div>
//       </div>

//       <p className="text-[11px] text-center text-green-300 mt-4 max-w-3xl mx-auto">
//         หมายเหตุ:
//         สินค้าและบริการของเราปฏิบัติตามข้อกำหนดทางกฎหมายและนโยบายท้องถิ่น
//         โปรดตรวจสอบกฎหมายท้องถิ่นก่อนสั่งซื้อ
//       </p>
//     </section>
//   );
// }

// "use client";

// import React from "react";
// import Link from "next/link";
// import { CheckCircle, Truck, ShieldCheck, Clock, Package } from "lucide-react";

// export default function AboutPageContent(): React.JSX.Element {
//   return (
//     <section
//       className="
//     max-w-6xl mx-auto p-3 md:p-12 mt-16 text-sm leading-relaxed mb-5
//     from-green-50 via-white to-green-100
//     dark:from-[#081811] dark:via-[#0b231a] dark:to-[#05130e]
//     rounded-3xl
//   "
//     >
//       <div
//         className="
//           bg-white/80 dark:bg-white/5
//           backdrop-blur
//           border border-black/5 dark:border-white/10
//           rounded-3xl
//           shadow-2xl
//           p-8 md:p-12
//         "
//       >
//         <div className="md:flex md:items-center md:justify-between gap-8">
//           <div className="md:flex-1">
//             <h1 className="text-2xl md:text-4xl font-extrabold leading-tight mb-4 text-gray-900 dark:text-green-50">
//               เกี่ยวกับ{" "}
//               <span className="text-emerald-500 dark:text-emerald-300">
//                 DOAG THAI
//               </span>
//             </h1>

//             <p className="text-sm md:text-base text-gray-600 dark:text-green-200 mb-6 max-w-2xl">
//               DOAG THAI มุ่งมั่นเสนอ{" "}
//               <span className="font-semibold text-gray-900 dark:text-green-100">
//                 สินค้าสายเขียวคุณภาพ
//               </span>{" "}
//               ที่ผ่านการคัดสรรอย่างเข้มงวด
//               เพื่อให้ลูกค้าได้รับประสบการณ์ที่ปลอดภัย สบายใจ
//               และน่าเชื่อถือในการใช้งาน
//             </p>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
//               <Feature
//                 icon={<CheckCircle className="w-5 h-5" />}
//                 title="คุณภาพที่ตรวจสอบ"
//                 desc="สินค้าทุกชิ้นผ่านการตรวจคุณภาพก่อนจัดส่ง"
//               />
//               <Feature
//                 icon={<Truck className="w-5 h-5" />}
//                 title="จัดส่งรวดเร็ว"
//                 desc="จัดส่งหลังยืนยันชำระเงิน พร้อมแจ้งเลขพัสดุ"
//               />
//               <Feature
//                 icon={<ShieldCheck className="w-5 h-5" />}
//                 title="บริการเป็นมิตร"
//                 desc="ทีมงานพร้อมตอบคำถามและให้คำปรึกษาอย่างจริงใจ"
//               />
//               <Feature
//                 icon={<Clock className="w-5 h-5" />}
//                 title="เวลาทำการที่ชัดเจน"
//                 desc="เปิดทุกวัน 10:00 - 22:00 น. ติดต่อได้สะดวก"
//               />
//             </div>

//             <div className="mt-8 flex items-center gap-4">
//               <Link
//                 href="/contact"
//                 className="
//                   inline-flex items-center gap-2 px-4 py-2.5 rounded-lg
//                   bg-emerald-500/10
//                   border border-emerald-400/40
//                   text-emerald-700 dark:text-emerald-200
//                   font-medium
//                   hover:bg-emerald-500/20
//                   transition
//                   text-sm
//                 "
//               >
//                 ติดต่อเรา
//               </Link>

//               <Link
//                 href="/products"
//                 className="
//                   inline-flex items-center gap-2 px-4 py-2.5 rounded-lg
//                   bg-emerald-500
//                   text-emerald-950
//                   font-semibold
//                   shadow-inner
//                   hover:scale-[1.01]
//                   transition-transform
//                   text-sm
//                 "
//               >
//                 ดูสินค้า
//               </Link>
//             </div>
//           </div>

//           <div className="md:w-96 mt-8 md:mt-0">
//             <div
//               className="
//                 bg-white/70 dark:bg-white/5
//                 border border-black/5 dark:border-white/10
//                 p-5 rounded-2xl
//                 shadow-inner
//               "
//             >
//               <h4 className="text-base font-bold text-gray-900 dark:text-green-50 mb-3">
//                 เงื่อนไขการสั่งซื้อ
//               </h4>

//               <ul className="text-xs text-gray-600 dark:text-green-200 space-y-2 list-inside list-disc">
//                 <li>แนบหลักฐานการชำระเงินก่อนจัดส่ง</li>
//                 <li>รองรับการชำระผ่านธนาคารและ Mobile Banking</li>
//                 <li>
//                   ไม่รับคืนเงินจากการเปลี่ยนใจ
//                   แต่รับเปลี่ยน/ชดเชยหากผิดพลาดจากร้าน
//                 </li>
//               </ul>

//               <div className="mt-5 border-t border-black/10 dark:border-green-700 pt-4">
//                 <div className="flex items-center gap-3">
//                   <span className="p-2 bg-emerald-500/20 rounded-lg">
//                     <Package className="w-4 h-4 text-emerald-500" />
//                   </span>
//                   <div>
//                     <p className="text-xs text-gray-700 dark:text-green-200">
//                       จัดส่งรวดเร็ว & บรรจุอย่างปลอดภัย
//                     </p>
//                     <p className="text-[11px] text-emerald-500">
//                       แจ้งเลขพัสดุเมื่อจัดส่งเรียบร้อย
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-6 rounded-2xl overflow-hidden">
//               <div className="w-full h-40 bg-gradient-to-br from-emerald-200 to-green-300 dark:from-emerald-800 dark:to-green-900 flex items-center justify-center">
//                 <svg
//                   width="120"
//                   height="120"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="opacity-30"
//                 >
//                   <path
//                     d="M12 2C10.5 6 6 7 6 11c0 3 3 4 6 9 3-5 6-6 6-9 0-4-4.5-5-6-9z"
//                     stroke="currentColor"
//                     strokeWidth="1.2"
//                   />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mt-10 bg-emerald-500/10 dark:bg-green-800/70 rounded-2xl p-6 md:p-8">
//           <p className="text-center text-sm md:text-base text-gray-900 dark:text-green-50 font-medium">
//             ✨ DOAG THAI มุ่งมั่นส่งมอบ{" "}
//             <span className="text-emerald-600 dark:text-emerald-200 font-semibold">
//               สายเขียวคุณภาพ
//             </span>{" "}
//             พร้อมบริการที่เป็นมิตรและใส่ใจในทุกรายละเอียด
//             เพื่อความสุขและความสบายใจของลูกค้าทุกท่าน
//           </p>
//         </div>
//       </div>

//       <p className="text-[11px] text-center text-gray-500 dark:text-green-300 mt-4 max-w-3xl mx-auto">
//         หมายเหตุ:
//         สินค้าและบริการของเราปฏิบัติตามข้อกำหนดทางกฎหมายและนโยบายท้องถิ่น
//         โปรดตรวจสอบกฎหมายท้องถิ่นก่อนสั่งซื้อ
//       </p>
//     </section>
//   );
// }

// function Feature({
//   icon,
//   title,
//   desc,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   desc: string;
// }) {
//   return (
//     <div className="flex items-start gap-3">
//       <span className="p-3 bg-emerald-500/20 rounded-lg text-emerald-600">
//         {icon}
//       </span>
//       <div>
//         <h3 className="font-semibold text-gray-900 dark:text-green-100 text-sm">
//           {title}
//         </h3>
//         <p className="text-xs text-gray-600 dark:text-green-200">{desc}</p>
//       </div>
//     </div>
//   );
// }

// "use client";

// import React from "react";
// import Link from "next/link";
// import { CheckCircle, Truck, ShieldCheck, Clock, Package } from "lucide-react";

// export default function AboutPageContent(): React.JSX.Element {
//   return (
//     <section className="max-w-6xl mx-auto p-3 md:p-12 mt-16 mb-5 text-sm leading-relaxed rounded-3xl">
//       <div className="bg-white/95 border border-black/5 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8 md:p-12">
//         <div className="md:flex md:items-center md:justify-between gap-8">
//           {/* LEFT */}
//           <div className="md:flex-1">
//             <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-4 text-gray-900">
//               เกี่ยวกับ <span className="text-[#2E7D32]">DOAG THAI</span>
//             </h1>

//             <p className="text-sm md:text-base text-gray-600 mb-6 max-w-2xl leading-relaxed">
//               DOAG THAI มุ่งมั่นเสนอ{" "}
//               <span className="font-semibold text-[#1F5A24]">
//                 สินค้าสายเขียวคุณภาพ
//               </span>{" "}
//               ที่ผ่านการคัดสรรอย่างเข้มงวด
//               เพื่อให้ลูกค้าได้รับประสบการณ์ที่ปลอดภัย สบายใจ
//               และน่าเชื่อถือในการใช้งาน
//             </p>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
//               <Feature
//                 icon={<CheckCircle className="w-5 h-5" />}
//                 title="คุณภาพที่ตรวจสอบ"
//                 desc="สินค้าทุกชิ้นผ่านการตรวจคุณภาพก่อนจัดส่ง"
//               />
//               <Feature
//                 icon={<Truck className="w-5 h-5" />}
//                 title="จัดส่งรวดเร็ว"
//                 desc="จัดส่งหลังยืนยันชำระเงิน พร้อมแจ้งเลขพัสดุ"
//               />
//               <Feature
//                 icon={<ShieldCheck className="w-5 h-5" />}
//                 title="บริการเป็นมิตร"
//                 desc="ทีมงานพร้อมตอบคำถามและให้คำปรึกษาอย่างจริงใจ"
//               />
//               <Feature
//                 icon={<Clock className="w-5 h-5" />}
//                 title="เวลาทำการที่ชัดเจน"
//                 desc="เปิดทุกวัน 10:00 - 22:00 น. ติดต่อได้สะดวก"
//               />
//             </div>

//             <div className="mt-8 flex items-center gap-4">
//               <Link
//                 href="/contact"
//                 className="
//                   inline-flex items-center px-4 py-2.5 rounded-lg
//                   border border-[#2E7D32]
//                   text-[#2E7D32]
//                   font-medium text-sm
//                   hover:bg-[#E6F4EA]
//                   transition-all
//                 "
//               >
//                 ติดต่อเรา
//               </Link>

//               <Link
//                 href="/products"
//                 className="
//                   inline-flex items-center px-4 py-2.5 rounded-lg
//                   bg-[#2E7D32]
//                   text-white
//                   font-semibold text-sm
//                   shadow-md
//                   hover:bg-[#1F5A24]
//                   hover:shadow-lg
//                   transition-all
//                 "
//               >
//                 ดูสินค้า
//               </Link>
//             </div>
//           </div>

//           {/* RIGHT */}
//           <div className="md:w-96 mt-8 md:mt-0">
//             <div className="bg-[#F3FAF5] border border-[#CFE8D6] p-5 rounded-2xl">
//               <h4 className="text-base font-bold tracking-tight text-[#1F5A24] mb-3">
//                 เงื่อนไขการสั่งซื้อ
//               </h4>

//               <ul className="text-xs text-gray-600 space-y-2 list-disc list-inside leading-relaxed">
//                 <li>แนบหลักฐานการชำระเงินก่อนจัดส่ง</li>
//                 <li>รองรับการชำระผ่านธนาคารและ Mobile Banking</li>
//                 <li>
//                   ไม่รับคืนเงินจากการเปลี่ยนใจ
//                   แต่รับเปลี่ยน/ชดเชยหากผิดพลาดจากร้าน
//                 </li>
//               </ul>

//               <div className="mt-5 border-t border-[#CFE8D6] pt-4">
//                 <div className="flex items-center gap-3">
//                   <span
//                     className="
//                       p-2 rounded-lg
//                       bg-gradient-to-br from-[#E6F4EA] to-white
//                       text-[#2E7D32]
//                       shadow-sm
//                       ring-1 ring-[#CFE8D6]
//                     "
//                   >
//                     <Package className="w-4 h-4" />
//                   </span>
//                   <div>
//                     <p className="text-xs text-gray-700">
//                       จัดส่งรวดเร็ว & บรรจุอย่างปลอดภัย
//                     </p>
//                     <p className="text-[11px] text-[#2E7D32]">
//                       แจ้งเลขพัสดุเมื่อจัดส่งเรียบร้อย
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* FOOTER BANNER */}
//         <div className="mt-10 bg-[#E6F4EA] rounded-2xl p-6 md:p-8">
//           <p className="text-center text-sm md:text-base text-[#1F5A24] font-medium leading-relaxed">
//             ✨ DOAG THAI มุ่งมั่นส่งมอบ{" "}
//             <span className="font-semibold text-[#2E7D32]">สายเขียวคุณภาพ</span>{" "}
//             พร้อมบริการที่เป็นมิตรและใส่ใจในทุกรายละเอียด
//             เพื่อความสุขและความสบายใจของลูกค้าทุกท่าน
//           </p>
//         </div>
//       </div>

//       <p className="text-[11px] text-center text-gray-500 mt-4 max-w-3xl mx-auto leading-relaxed">
//         หมายเหตุ:
//         สินค้าและบริการของเราปฏิบัติตามข้อกำหนดทางกฎหมายและนโยบายท้องถิ่น
//         โปรดตรวจสอบกฎหมายท้องถิ่นก่อนสั่งซื้อ
//       </p>
//     </section>
//   );
// }

// function Feature({
//   icon,
//   title,
//   desc,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   desc: string;
// }) {
//   return (
//     <div className="flex items-start gap-3 group">
//       <span
//         className="
//           p-3 rounded-xl
//           bg-gradient-to-br from-[#E6F4EA] to-white
//           text-[#2E7D32]
//           shadow-sm
//           ring-1 ring-[#CFE8D6]
//           group-hover:shadow-md
//           transition
//         "
//       >
//         {icon}
//       </span>
//       <div>
//         <h3 className="font-semibold tracking-tight text-[#1F5A24] text-sm">
//           {title}
//         </h3>
//         <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
//       </div>
//     </div>
//   );
// }

"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle, Truck, ShieldCheck, Clock, Package } from "lucide-react";

export default function AboutPageContent(): React.JSX.Element {
  return (
    // <section className="max-w-6xl mx-auto p-3 md:p-12 mt-16 mb-5 text-sm leading-relaxed rounded-3xl">
    //   <div className="bg-white/95 dark:bg-[#0b1f17] border border-black/5 dark:border-white/10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8 md:p-12">
    <section className="max-w-6xl mx-auto p-3 md:p-12 mt-1 mb-5 text-sm leading-relaxed rounded-3xl">
      <div
        className="
          bg-transparent
          border border-black/5 dark:border-white/10
          rounded-3xl
          shadow-[0_20px_60px_rgba(0,0,0,0.08)]
          p-8 md:p-12
        "
      >
        <div className="md:flex md:items-center md:justify-between gap-8">
          {/* LEFT */}
          <div className="md:flex-1">
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-green-50">
              เกี่ยวกับ{" "}
              <span className="text-[#2E7D32] dark:text-[#7edb9b]">
                DOAG THAI
              </span>
            </h1>

            <p className="text-sm md:text-base text-gray-600 dark:text-green-200 mb-6 max-w-2xl leading-relaxed">
              DOAG THAI มุ่งมั่นเสนอ{" "}
              <span className="font-semibold text-[#1F5A24] dark:text-green-100">
                สินค้าสายเขียวคุณภาพ
              </span>{" "}
              ที่ผ่านการคัดสรรอย่างเข้มงวด
              เพื่อให้ลูกค้าได้รับประสบการณ์ที่ปลอดภัย สบายใจ
              และน่าเชื่อถือในการใช้งาน
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <Feature
                icon={<CheckCircle className="w-5 h-5" />}
                title="คุณภาพที่ตรวจสอบ"
                desc="สินค้าทุกชิ้นผ่านการตรวจคุณภาพก่อนจัดส่ง"
              />
              <Feature
                icon={<Truck className="w-5 h-5" />}
                title="จัดส่งรวดเร็ว"
                desc="จัดส่งหลังยืนยันชำระเงิน พร้อมแจ้งเลขพัสดุ"
              />
              <Feature
                icon={<ShieldCheck className="w-5 h-5" />}
                title="บริการเป็นมิตร"
                desc="ทีมงานพร้อมตอบคำถามและให้คำปรึกษาอย่างจริงใจ"
              />
              <Feature
                icon={<Clock className="w-5 h-5" />}
                title="เวลาทำการที่ชัดเจน"
                desc="เปิดทุกวัน 10:00 - 22:00 น. ติดต่อได้สะดวก"
              />
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Link
                href="/contact"
                className="
                  inline-flex items-center px-4 py-2.5 rounded-lg
                  border border-[#2E7D32] dark:border-[#7edb9b]
                  text-[#2E7D32] dark:text-[#7edb9b]
                  font-medium text-sm
                  hover:bg-[#E6F4EA] dark:hover:bg-[#163b2b]
                  transition-all
                "
              >
                ติดต่อเรา
              </Link>

              <Link
                href="/products"
                className="
                  inline-flex items-center px-4 py-2.5 rounded-lg
                  bg-[#2E7D32] dark:bg-[#1f7a4a]
                  text-white
                  font-semibold text-sm
                  shadow-md
                  hover:bg-[#1F5A24] dark:hover:bg-[#16643c]
                  hover:shadow-lg
                  transition-all
                "
              >
                ดูสินค้า
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="md:w-96 mt-8 md:mt-0">
            <div className="bg-[#F3FAF5] dark:bg-[#112e22] border border-[#CFE8D6] dark:border-[#1f4d38] p-5 rounded-2xl">
              <h4 className="text-base font-bold tracking-tight text-[#1F5A24] dark:text-green-100 mb-3">
                เงื่อนไขการสั่งซื้อ
              </h4>

              <ul className="text-xs text-gray-600 dark:text-green-200 space-y-2 list-disc list-inside leading-relaxed">
                <li>แนบหลักฐานการชำระเงินก่อนจัดส่ง</li>
                <li>รองรับการชำระผ่านธนาคารและ Mobile Banking</li>
                <li>
                  ไม่รับคืนเงินจากการเปลี่ยนใจ
                  แต่รับเปลี่ยน/ชดเชยหากผิดพลาดจากร้าน
                </li>
              </ul>

              <div className="mt-5 border-t border-[#CFE8D6] dark:border-[#1f4d38] pt-4">
                <div className="flex items-center gap-3">
                  <span
                    className="
                      p-2 rounded-lg
                      bg-gradient-to-br from-[#E6F4EA] to-white
                      dark:from-[#1f4d38] dark:to-[#0b1f17]
                      text-[#2E7D32] dark:text-[#7edb9b]
                      shadow-sm
                      ring-1 ring-[#CFE8D6] dark:ring-[#1f4d38]
                    "
                  >
                    <Package className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="text-xs text-gray-700 dark:text-green-200">
                      จัดส่งรวดเร็ว & บรรจุอย่างปลอดภัย
                    </p>
                    <p className="text-[11px] text-[#2E7D32] dark:text-[#7edb9b]">
                      แจ้งเลขพัสดุเมื่อจัดส่งเรียบร้อย
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER BANNER */}
        <div className="mt-10 bg-[#E6F4EA] dark:bg-[#163b2b] rounded-2xl p-6 md:p-8">
          <p className="text-center text-sm md:text-base text-[#1F5A24] dark:text-green-100 font-medium leading-relaxed">
            ✨ DOAG THAI มุ่งมั่นส่งมอบ{" "}
            <span className="font-semibold text-[#2E7D32] dark:text-[#7edb9b]">
              สายเขียวคุณภาพ
            </span>{" "}
            พร้อมบริการที่เป็นมิตรและใส่ใจในทุกรายละเอียด
            เพื่อความสุขและความสบายใจของลูกค้าทุกท่าน
          </p>
        </div>
      </div>

      <p className="text-[11px] text-center text-gray-500 dark:text-green-300 mt-4 max-w-3xl mx-auto leading-relaxed">
        หมายเหตุ:
        สินค้าและบริการของเราปฏิบัติตามข้อกำหนดทางกฎหมายและนโยบายท้องถิ่น
        โปรดตรวจสอบกฎหมายท้องถิ่นก่อนสั่งซื้อ
      </p>
    </section>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3 group">
      <span
        className="
          p-3 rounded-xl
          bg-gradient-to-br from-[#E6F4EA] to-white
          dark:from-[#1f4d38] dark:to-[#0b1f17]
          text-[#2E7D32] dark:text-[#7edb9b]
          shadow-sm
          ring-1 ring-[#CFE8D6] dark:ring-[#1f4d38]
          group-hover:shadow-md
          transition
        "
      >
        {icon}
      </span>
      <div>
        <h3 className="font-semibold tracking-tight text-[#1F5A24] dark:text-green-100 text-sm">
          {title}
        </h3>
        <p className="text-xs text-gray-600 dark:text-green-200 leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}
