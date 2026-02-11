// "use client";

// import React from "react";
// import { Mail, Phone, MapPin, MessageCircle, Leaf } from "lucide-react";

// const ContactPageContent: React.FC = () => {
//   return (
//     <section className="relative max-w-5xl mx-auto p-3 mt-16">
//       {/* พื้นหลังลวดลายใบกัญชาแบบเบา ๆ */}
//       <div className="absolute inset-0 bg-[url('/images/weed-pattern.png')] bg-cover bg-center opacity-10 rounded-3xl" />

//       <div className="relative bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 text-green-50 rounded-3xl shadow-2xl p-10 border border-green-700/50 backdrop-blur-sm">
//         <div className="flex items-center gap-3 mb-6">
//           <Leaf className="w-7 h-7 text-green-400 animate-pulse" />
//           <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-green-300 to-lime-400 bg-clip-text text-transparent">
//             ติดต่อเรา
//           </h1>
//         </div>

//         <p className="text-sm md:text-base text-green-100/90 leading-relaxed mb-8">
//           ทีมงาน <span className="font-bold text-green-300">DOAG THAI</span>{" "}
//           พร้อมช่วยเหลือคุณทุกขั้นตอน — ตั้งแต่คำแนะนำเรื่อง{" "}
//           <span className="text-lime-300 font-semibold">ผลิตภัณฑ์กัญชา</span>,
//           โปรโมชั่น ไปจนถึงการจัดส่งถึงมือคุณ
//           <br />
//           ให้บริการทุกวัน เวลา{" "}
//           <span className="text-green-300 font-bold">10:00 - 22:00 น.</span>
//         </p>

//         <div className="grid md:grid-cols-3 gap-6">
//           {/* อีเมล */}
//           <div className="flex items-start gap-3 bg-green-800/60 p-4 rounded-xl border border-green-700/50">
//             <Mail className="text-lime-400 mt-1" />
//             <div>
//               <h3 className="font-semibold text-green-200">อีเมล</h3>
//               <p className="text-sm text-green-100">doag-thai.com</p>
//             </div>
//           </div>

//           {/* โทรศัพท์ */}
//           <div className="flex items-start gap-3 bg-green-800/60 p-4 rounded-xl border border-green-700/50">
//             <Phone className="text-lime-400 mt-1" />
//             <div>
//               <h3 className="font-semibold text-green-200">โทร</h3>
//               <p className="text-sm text-green-100">099-420-6969</p>
//             </div>
//           </div>

//           {/* ที่อยู่ */}
//           <div className="flex items-start gap-3 bg-green-800/60 p-4 rounded-xl border border-green-700/50">
//             <MapPin className="text-lime-400 mt-1" />
//             <div>
//               <h3 className="font-semibold text-green-200">ที่ตั้ง</h3>
//               <p className="text-sm text-green-100">กรุงเทพมหานคร, ประเทศไทย</p>
//             </div>
//           </div>
//         </div>

//         {/* ปุ่ม LINE */}
//         <div className="mt-10 flex justify-center">
//           <a
//             href="https://line.me"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-400 hover:to-green-500 text-white px-8 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-green-800/40 transition-all transform hover:scale-105"
//           >
//             <MessageCircle className="w-5 h-5" />
//             แชทกับแอดมินทาง LINE
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ContactPageContent;

// "use client";

// import React from "react";
// import { Mail, MapPin, MessageCircle, Facebook, Leaf } from "lucide-react";

// const ContactPageContent: React.FC = () => {
//   return (
//     <section className="relative max-w-6xl mx-auto px-4 py-20 ">
//       {/* glow background */}
//       <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.15),transparent_60%)]" />

//       <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b1f17] via-[#0e2a20] to-[#06140f] shadow-[0_0_120px_rgba(34,197,94,0.15)]">
//         {/* header */}
//         <div className="px-10 pt-12 pb-8">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-500/15">
//               <Leaf className="h-5 w-5 text-green-400" />
//             </div>
//             <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
//               ติดต่อ <span className="text-green-400">DOAG THAI</span>
//             </h1>
//           </div>

//           <p className="max-w-2xl text-sm md:text-base text-white/70 leading-relaxed">
//             ศูนย์ดูแลลูกค้า DOAG THAI พร้อมให้คำแนะนำเกี่ยวกับสินค้า โปรโมชั่น
//             และการจัดส่ง
//             <br />
//             เปิดให้บริการทุกวัน{" "}
//             <span className="text-green-400 font-semibold">
//               10:00 – 22:00 น.
//             </span>
//           </p>
//         </div>

//         {/* content */}
//         <div className="grid gap-6 px-10 pb-12 md:grid-cols-3">
//           {/* email */}
//           <div className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition-all hover:-translate-y-1 hover:border-green-400/40 hover:bg-white/10">
//             <Mail className="h-5 w-5 text-green-400 mb-3" />
//             <p className="text-xs uppercase tracking-wide text-white/50">
//               Email
//             </p>
//             <p className="mt-1 text-sm font-medium text-white">doagthai.com</p>
//           </div>

//           {/* facebook */}
//           <a
//             href="https://www.facebook.com/profile.php?id=61579149763038"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition-all hover:-translate-y-1 hover:border-blue-400/40 hover:bg-white/10"
//           >
//             <Facebook className="h-5 w-5 text-blue-400 mb-3" />
//             <p className="text-xs uppercase tracking-wide text-white/50">
//               Facebook
//             </p>
//             <p className="mt-1 text-sm font-medium text-white">DOAG THAI</p>
//           </a>

//           {/* location */}
//           <div className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition-all hover:-translate-y-1 hover:border-green-400/40 hover:bg-white/10">
//             <MapPin className="h-5 w-5 text-green-400 mb-3" />
//             <p className="text-xs uppercase tracking-wide text-white/50">
//               Location
//             </p>
//             <p className="mt-1 text-sm font-medium text-white">
//               กรุงเทพมหานคร, ประเทศไทย
//             </p>
//           </div>
//         </div>

//         {/* CTA */}
//         <div className="flex justify-center px-10 pb-14">
//           <a
//             href="https://line.me"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/30 transition-all hover:scale-105 hover:shadow-green-500/50"
//           >
//             <MessageCircle className="h-5 w-5" />
//             แชทกับแอดมินทาง LINE
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ContactPageContent;

// "use client";

// import React from "react";
// import { Mail, MapPin, MessageCircle, Facebook, Leaf } from "lucide-react";

// const ContactPageContent: React.FC = () => {
//   return (
//     <section
//       className="
//         relative max-w-6xl mx-auto px-4 py-20
//         from-green-50 via-white to-green-100
//         dark:from-[#081811] dark:via-[#0b231a] dark:to-[#05130e]
//         rounded-3xl
//       "
//     >
//       {/* glow background */}
//       <div
//         className="
//           absolute inset-0 -z-10
//           bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.15),transparent_60%)]
//           dark:bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.25),transparent_60%)]
//         "
//       />

//       <div
//         className="
//           relative overflow-hidden rounded-3xl
//           border border-black/5 dark:border-white/10
//           bg-white/70 dark:bg-white/5
//           backdrop-blur
//           shadow-[0_0_120px_rgba(34,197,94,0.15)]
//         "
//       >
//         {/* header */}
//         <div className="px-8 md:px-10 pt-12 pb-8">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-500/15">
//               <Leaf className="h-5 w-5 text-green-500 dark:text-green-400" />
//             </div>
//             <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
//               ติดต่อ <span className="text-green-500">DOAG THAI</span>
//             </h1>
//           </div>

//           <p className="max-w-2xl text-sm text-gray-600 dark:text-white/70 leading-relaxed">
//             ศูนย์ดูแลลูกค้า DOAG THAI พร้อมให้คำแนะนำเกี่ยวกับสินค้า โปรโมชั่น
//             และการจัดส่ง
//             <br />
//             เปิดให้บริการทุกวัน{" "}
//             <span className="text-green-600 dark:text-green-400 font-semibold">
//               10:00 – 22:00 น.
//             </span>
//           </p>
//         </div>

//         {/* content cards */}
//         <div className="grid gap-5 px-8 md:px-10 pb-12 md:grid-cols-3">
//           {/* email */}
//           <div
//             className="
//               group rounded-2xl p-5
//               border border-black/5 dark:border-white/10
//               bg-white/80 dark:bg-white/5
//               backdrop-blur
//               transition-all
//               hover:-translate-y-1
//               hover:border-green-400/40
//             "
//           >
//             <Mail className="h-5 w-5 text-green-500 mb-3" />
//             <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-white/50">
//               Email
//             </p>
//             <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
//               contact-doagthai@doag-thai.com{" "}
//             </p>
//           </div>

//           {/* facebook */}
//           <a
//             href="https://www.facebook.com/profile.php?id=61579149763038"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="
//               group rounded-2xl p-5
//               border border-black/5 dark:border-white/10
//               bg-white/80 dark:bg-white/5
//               backdrop-blur
//               transition-all
//               hover:-translate-y-1
//               hover:border-blue-400/40
//             "
//           >
//             <Facebook className="h-5 w-5 text-blue-500 mb-3" />
//             <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-white/50">
//               Facebook
//             </p>
//             <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
//               DOAG THAI
//             </p>
//           </a>

//           {/* location */}
//           <div
//             className="
//               group rounded-2xl p-5
//               border border-black/5 dark:border-white/10
//               bg-white/80 dark:bg-white/5
//               backdrop-blur
//               transition-all
//               hover:-translate-y-1
//               hover:border-green-400/40
//             "
//           >
//             <MapPin className="h-5 w-5 text-green-500 mb-3" />
//             <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-white/50">
//               Location
//             </p>
//             <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
//               กรุงเทพมหานคร, ประเทศไทย
//             </p>
//           </div>
//         </div>

//         {/* CTA */}
//         <div className="flex justify-center px-8 md:px-10 pb-14">
//           <a
//             href="https://line.me"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="
//               group inline-flex items-center gap-3
//               rounded-full
//               bg-gradient-to-r from-green-500 to-emerald-500
//               px-8 py-3
//               text-sm font-semibold text-white
//               shadow-lg shadow-green-500/30
//               transition-all
//               hover:scale-105
//               hover:shadow-green-500/50
//             "
//           >
//             <MessageCircle className="h-5 w-5" />
//             แชทกับแอดมินทาง LINE
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ContactPageContent;

// ("use client");

// import React from "react";
// import { Mail, MapPin, MessageCircle, Facebook, Leaf } from "lucide-react";

// const ContactPageContent: React.FC = () => {
//   return (
//     <section
//       className="
//         relative max-w-6xl mx-auto px-3 mt-19 mb-10
//         rounded-3xl
//       "
//     >
//       <div
//         className="
//           relative overflow-hidden rounded-3xl
//           border border-black/5 dark:border-white/10
//           bg-white/70 dark:bg-white/5
//           backdrop-blur
//           shadow-2xl
//         "
//       >
//         {/* glow background (อยู่แค่ใน card) */}
//         <div
//           className="
//             absolute inset-0 -z-10
//             bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.15),transparent_60%)]
//             dark:bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.25),transparent_60%)]
//           "
//         />

//         {/* header */}
//         <div className="px-8 md:px-10 pt-12 pb-8">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-500/15">
//               <Leaf className="h-5 w-5 text-green-500 dark:text-green-400" />
//             </div>
//             <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
//               ติดต่อ <span className="text-green-500">DOAG THAI</span>
//             </h1>
//           </div>

//           <p className="max-w-2xl text-sm text-gray-600 dark:text-white/70 leading-relaxed">
//             ศูนย์ดูแลลูกค้า DOAG THAI พร้อมให้คำแนะนำเกี่ยวกับสินค้า โปรโมชั่น
//             และการจัดส่ง
//             <br />
//             เปิดให้บริการทุกวัน{" "}
//             <span className="text-green-600 dark:text-green-400 font-semibold">
//               10:00 – 22:00 น.
//             </span>
//           </p>
//         </div>

//         {/* content cards */}
//         <div className="grid gap-5 px-8 md:px-10 pb-12 md:grid-cols-3">
//           {/* email */}
//           <div className="group rounded-2xl p-5 border border-black/5 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur transition-all hover:-translate-y-1 hover:border-green-400/40">
//             <Mail className="h-5 w-5 text-green-500 mb-3" />
//             <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-white/50">
//               Email
//             </p>
//             <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
//               contact-doagthai@doag-thai.com
//             </p>
//           </div>

//           {/* facebook */}
//           <a
//             href="https://www.facebook.com/profile.php?id=61579149763038"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="group rounded-2xl p-5 border border-black/5 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur transition-all hover:-translate-y-1 hover:border-blue-400/40"
//           >
//             <Facebook className="h-5 w-5 text-blue-500 mb-3" />
//             <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-white/50">
//               Facebook
//             </p>
//             <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
//               DOAG THAI
//             </p>
//           </a>

//           {/* location */}
//           <div className="group rounded-2xl p-5 border border-black/5 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur transition-all hover:-translate-y-1 hover:border-green-400/40">
//             <MapPin className="h-5 w-5 text-green-500 mb-3" />
//             <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-white/50">
//               Location
//             </p>
//             <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
//               กรุงเทพมหานคร, ประเทศไทย
//             </p>
//           </div>
//         </div>

//         {/* CTA */}
//         <div className="flex justify-center px-8 md:px-10 pb-14">
//           <a
//             href="https://line.me"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/30 transition-all hover:scale-105 hover:shadow-green-500/50"
//           >
//             <MessageCircle className="h-5 w-5" />
//             แชทกับแอดมินทาง LINE
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ContactPageContent;

"use client";

import React from "react";
import { Mail, MapPin, MessageCircle, Facebook, Leaf } from "lucide-react";

const ContactPageContent: React.FC = () => {
  return (
    <section className="relative max-w-6xl mx-auto px-3 mt-4 mb-10 rounded-3xl">
      {/* <div
        className="
          relative overflow-hidden rounded-3xl
          border border-black/5 dark:border-white/10
          bg-white/95 dark:bg-[#0b1f17]
          backdrop-blur
          shadow-2xl
        "
      > */}
      <div
        className="
    relative overflow-hidden rounded-3xl
    border border-black/5 dark:border-white/10
    bg-transparent
    backdrop-blur
    shadow-2xl
  "
      >
        {/* glow background */}
        <div
          className="
            absolute inset-0 -z-10
            bg-[radial-gradient(ellipse_at_top,rgba(46,125,50,0.15),transparent_60%)]
            dark:bg-[radial-gradient(ellipse_at_top,rgba(126,219,155,0.18),transparent_60%)]
          "
        />

        {/* header */}
        <div className="px-8 md:px-10 pt-12 pb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E6F4EA] dark:bg-[#1f4d38]">
              <Leaf className="h-5 w-5 text-[#2E7D32] dark:text-[#7edb9b]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-green-50">
              ติดต่อ{" "}
              <span className="text-[#2E7D32] dark:text-[#7edb9b]">
                DOAG THAI
              </span>
            </h1>
          </div>

          <p className="max-w-2xl text-sm text-gray-600 dark:text-green-200 leading-relaxed">
            ศูนย์ดูแลลูกค้า DOAG THAI พร้อมให้คำแนะนำเกี่ยวกับสินค้า โปรโมชั่น
            และการจัดส่ง
            <br />
            เปิดให้บริการทุกวัน{" "}
            <span className="font-semibold text-[#1F5A24] dark:text-[#7edb9b]">
              10:00 – 22:00 น.
            </span>
          </p>
        </div>

        {/* content cards */}
        <div className="grid gap-5 px-8 md:px-10 pb-12 md:grid-cols-3">
          {/* email */}
          {/* <div
            className="
              group rounded-2xl p-5
              border border-black/5 dark:border-[#1f4d38]
              bg-white/80 dark:bg-[#112e22]
              backdrop-blur
              transition-all
              hover:-translate-y-1
            "
          > */}
          <div
            className="
    group rounded-2xl p-5
    border border-black/5 dark:border-[#1f4d38]
    bg-transparent dark:bg-[#112e22]
    backdrop-blur
    transition-all
  "
          >
            <Mail className="h-5 w-5 text-[#2E7D32] dark:text-[#7edb9b] mb-3" />
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-green-300">
              Email
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-green-50">
              contact-doagthai@doag-thai.com
            </p>
          </div>

          {/* facebook */}
          <a
            href="https://www.facebook.com/profile.php?id=61579149763038"
            target="_blank"
            rel="noopener noreferrer"
            className="
    group rounded-2xl p-5
    border border-black/5 dark:border-[#1f4d38]
    bg-transparent dark:bg-[#112e22]
    backdrop-blur
    transition-all
  "
          >
            <Facebook className="h-5 w-5 text-[#2E7D32] dark:text-[#7edb9b] mb-3" />
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-green-300">
              Facebook
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-green-50">
              DOAG THAI
            </p>
          </a>

          {/* location */}
          <div
            className="
    group rounded-2xl p-5
    border border-black/5 dark:border-[#1f4d38]
    bg-transparent dark:bg-[#112e22]
    backdrop-blur
    transition-all
  "
          >
            <MapPin className="h-5 w-5 text-[#2E7D32] dark:text-[#7edb9b] mb-3" />
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-green-300">
              Location
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-green-50">
              กรุงเทพมหานคร, ประเทศไทย
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center px-8 md:px-10 pb-14">
          <a
            href="https://line.me"
            target="_blank"
            rel="noopener noreferrer"
            className="
              group inline-flex items-center gap-3 rounded-full
              bg-[#2E7D32] dark:bg-[#1f7a4a]
              px-8 py-3
              text-sm font-semibold text-white
              shadow-lg shadow-black/10
              transition-all
              hover:scale-105
              hover:bg-[#1F5A24] dark:hover:bg-[#16643c]
            "
          >
            <MessageCircle className="h-5 w-5" />
            แชทกับแอดมินทาง LINE
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactPageContent;
