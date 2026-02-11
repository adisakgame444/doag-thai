// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "นโยบายความเป็นส่วนตัว | TK Flowers",
//   description: "นโยบายความเป็นส่วนตัวของร้าน TK Flowers",
// };

// export default function PrivacyPolicyPage() {
//   return (
//     <div className="container mx-auto py-10 px-4 max-w-3xl">
//       <h1 className="text-3xl font-bold mb-6">นโยบายความเป็นส่วนตัว</h1>
//       <p className="text-muted-foreground mb-4">
//         อัปเดตล่าสุดเมื่อ: {new Date().toLocaleDateString("th-TH")}
//       </p>

//       <div className="space-y-6 text-gray-700 dark:text-gray-300">
//         <section>
//           <h2 className="text-xl font-semibold mb-2 text-foreground">
//             1. การเก็บรวบรวมข้อมูล
//           </h2>
//           <p>
//             ทางร้าน <strong>DOAG THAI</strong> ("เรา")
//             จะเก็บรวบรวมข้อมูลของท่านเท่าที่จำเป็น
//             เพื่อการให้บริการและการดำเนินการตามคำสั่งซื้อเท่านั้น
//             ข้อมูลที่เราเก็บรวบรวมอาจได้แก่:
//           </p>
//           <ul className="list-disc pl-6 mt-2 space-y-1">
//             <li>ชื่อ-นามสกุล</li>
//             <li>ที่อยู่อีเมล (Email Address)</li>
//             <li>เบอร์โทรศัพท์</li>
//             <li>ที่อยู่สำหรับการจัดส่งสินค้า</li>
//           </ul>
//         </section>

//         <section>
//           <h2 className="text-xl font-semibold mb-2 text-foreground">
//             2. วัตถุประสงค์การใช้ข้อมูล
//           </h2>
//           <p>เราใช้ข้อมูลของท่านเพื่อ:</p>
//           <ul className="list-disc pl-6 mt-2 space-y-1">
//             <li>ยืนยันตัวตนในการเข้าสู่ระบบ (ผ่าน Facebook, LINE, Google)</li>
//             <li>ดำเนินการจัดส่งสินค้าตามคำสั่งซื้อ</li>
//             <li>ติดต่อประสานงานกรณีสินค้ามีปัญหา</li>
//           </ul>
//         </section>

//         <section>
//           <h2 className="text-xl font-semibold mb-2 text-foreground">
//             3. การเปิดเผยข้อมูล
//           </h2>
//           <p>
//             เราจะไม่เปิดเผยข้อมูลส่วนบุคคลของท่านต่อบุคคลภายนอก
//             ยกเว้นในกรณีที่จำเป็นต่อการจัดส่งสินค้า (เช่น
//             การให้ข้อมูลที่อยู่แก่บริษัทขนส่ง) หรือตามที่กฎหมายกำหนด
//           </p>
//         </section>

//         <section>
//           <h2 className="text-xl font-semibold mb-2 text-foreground">
//             4. การลบข้อมูล
//           </h2>
//           <p>
//             หากท่านต้องการให้เราลบข้อมูลส่วนบุคคลของท่านออกจากระบบ
//             กรุณาติดต่อเราผ่านช่องทาง LINE Official หรืออีเมลของทางร้าน
//           </p>
//         </section>

//         <section>
//           <h2 className="text-xl font-semibold mb-2 text-foreground">
//             5. ติดต่อเรา
//           </h2>
//           <p>หากมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัว สามารถติดต่อได้ที่:</p>
//           <p className="mt-2 font-medium">ร้าน TK Flowers</p>
//           <p>เบอร์โทรศัพท์: [ใส่เบอร์ร้านของคุณ]</p>
//           <p>อีเมล: [ใส่อีเมลร้านของคุณ]</p>
//         </section>
//       </div>
//     </div>
//   );
// }

// import { Metadata } from "next";
// import {
//   ShieldCheck,
//   Eye,
//   Share2,
//   Trash2,
//   Mail,
//   Store,
//   CheckCircle2,
//   FileText,
//   Facebook, // ✅ เพิ่มไอคอน Facebook
//   MessageCircle,
//   ArrowLeft,
//   ExternalLink, // ✅ เพิ่มไอคอนสำหรับ LINE
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";

// export const metadata: Metadata = {
//   title: "นโยบายความเป็นส่วนตัว | DOAG THAI", // แก้ชื่อให้ตรงกับเนื้อหา
//   description: "นโยบายความเป็นส่วนตัวของร้าน DOAG THAI",
// };

// export default function PrivacyPolicyPage() {
//   return (
//     <div className="min-h-screen w-full bg-[#050505] text-white relative overflow-hidden pb-20 pt-4 px-4">
//       {/* 🟢 Background Glow Effects */}
//       <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none" />
//       <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-500/5 blur-[120px] rounded-full pointer-events-none" />
//       <div className="sticky top-0 z-50 flex items-center justify-between px-3 py-2 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5">
//         <Button
//           variant="ghost"
//           size="icon"
//           className="h-8 w-8 -ml-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
//           asChild
//         >
//           <Link href="/">
//             <ArrowLeft size={20} />
//           </Link>
//         </Button>
//         <h1 className="text-sm font-semibold tracking-wide text-gray-200">
//           นโยบายร้านค้า
//         </h1>
//         <div className="w-8" /> {/* Spacer เพื่อให้ Title อยู่ตรงกลาง */}
//       </div>

//       <div className="max-w-3xl mx-auto relative z-10">
//         {/* Header Section */}
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-green-500/10 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
//             <ShieldCheck size={32} className="text-green-500" />
//           </div>
//           <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3">
//             นโยบายความเป็นส่วนตัว
//           </h1>
//           <p className="text-gray-500 text-sm">
//             อัปเดตล่าสุดเมื่อ:{" "}
//             {new Date().toLocaleDateString("th-TH", {
//               year: "numeric",
//               month: "long",
//               day: "numeric",
//             })}
//           </p>
//         </div>

//         {/* Content Container */}
//         <div className="space-y-6">
//           {/* Section 1: การเก็บรวบรวมข้อมูล */}
//           <section className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/[0.07] transition-colors">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
//                 <FileText size={20} />
//               </div>
//               <h2 className="text-xl font-semibold text-white">
//                 1. การเก็บรวบรวมข้อมูล
//               </h2>
//             </div>
//             <div className="text-gray-300 leading-relaxed text-sm md:text-base pl-1">
//               <p className="mb-3">
//                 ทางร้าน <strong className="text-green-400">DOAG THAI</strong>{" "}
//                 ("เรา") จะเก็บรวบรวมข้อมูลของท่านเท่าที่จำเป็น
//                 เพื่อการให้บริการและการดำเนินการตามคำสั่งซื้อเท่านั้น
//                 ข้อมูลที่เราเก็บรวบรวมอาจได้แก่:
//               </p>
//               <ul className="grid md:grid-cols-2 gap-2 mt-2">
//                 {[
//                   "ชื่อ-นามสกุล",
//                   "ที่อยู่อีเมล (Email Address)",
//                   "เบอร์โทรศัพท์",
//                   "ที่อยู่สำหรับการจัดส่งสินค้า",
//                 ].map((item, i) => (
//                   <li
//                     key={i}
//                     className="flex items-center gap-2 text-gray-400 bg-black/20 p-2 rounded-lg border border-white/5"
//                   >
//                     <CheckCircle2
//                       size={14}
//                       className="text-green-500 flex-shrink-0"
//                     />
//                     <span>{item}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </section>

//           {/* Section 2: วัตถุประสงค์ */}
//           <section className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/[0.07] transition-colors">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
//                 <Eye size={20} />
//               </div>
//               <h2 className="text-xl font-semibold text-white">
//                 2. วัตถุประสงค์การใช้ข้อมูล
//               </h2>
//             </div>
//             <div className="text-gray-300 leading-relaxed text-sm md:text-base pl-1">
//               <p className="mb-3">เราใช้ข้อมูลของท่านเพื่อ:</p>
//               <ul className="space-y-2">
//                 {[
//                   "ยืนยันตัวตนในการเข้าสู่ระบบ (ผ่าน Facebook, LINE, Google)",
//                   "ดำเนินการจัดส่งสินค้าตามคำสั่งซื้อ",
//                   "ติดต่อประสานงานกรณีสินค้ามีปัญหา",
//                 ].map((item, i) => (
//                   <li key={i} className="flex items-start gap-2.5">
//                     <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)] flex-shrink-0" />
//                     <span className="text-gray-400">{item}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </section>

//           {/* Section 3: การเปิดเผยข้อมูล */}
//           <section className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/[0.07] transition-colors">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
//                 <Share2 size={20} />
//               </div>
//               <h2 className="text-xl font-semibold text-white">
//                 3. การเปิดเผยข้อมูล
//               </h2>
//             </div>
//             <p className="text-gray-300 leading-relaxed text-sm md:text-base pl-1">
//               เราจะไม่เปิดเผยข้อมูลส่วนบุคคลของท่านต่อบุคคลภายนอก
//               ยกเว้นในกรณีที่จำเป็นต่อการจัดส่งสินค้า (เช่น
//               การให้ข้อมูลที่อยู่แก่บริษัทขนส่ง) หรือตามที่กฎหมายกำหนด
//             </p>
//           </section>

//           {/* Section 4: การลบข้อมูล */}
//           <section className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/[0.07] transition-colors">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
//                 <Trash2 size={20} />
//               </div>
//               <h2 className="text-xl font-semibold text-white">
//                 4. การลบข้อมูล
//               </h2>
//             </div>
//             <p className="text-gray-300 leading-relaxed text-sm md:text-base pl-1">
//               หากท่านต้องการให้เราลบข้อมูลส่วนบุคคลของท่านออกจากระบบ
//               กรุณาติดต่อเราผ่านช่องทาง LINE Official หรืออีเมลของทางร้าน
//             </p>
//           </section>

//           {/* Section 5: ติดต่อเรา (แก้ไขใหม่) */}
//           <section className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-green-900/20 to-black border border-green-500/20 backdrop-blur-md relative overflow-hidden group">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px] rounded-full group-hover:bg-green-500/20 transition-all" />

//             <div className="flex items-center gap-3 mb-6 relative z-10">
//               <div className="p-2 rounded-lg bg-green-500 text-black shadow-lg shadow-green-900/50">
//                 <Store size={20} />
//               </div>
//               <h2 className="text-xl font-semibold text-white">5. ติดต่อเรา</h2>
//             </div>

//             <div className="space-y-4 relative z-10 pl-1">
//               <p className="text-gray-300 text-sm">
//                 หากมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัว สามารถติดต่อได้ที่:
//               </p>

//               <div className="grid gap-3">
//                 {/* ชื่อร้าน */}
//                 <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center gap-4">
//                   <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-green-400">
//                     <Store size={20} />
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500">ชื่อร้านค้า</p>
//                     <p className="text-white font-medium">ร้าน DOAG THAI</p>
//                   </div>
//                 </div>

//                 {/* ✅ LINE Official (แทนเบอร์โทร) */}
//                 <Link
//                   href="https://line.me/ti/p/@434vnjcv"
//                   target="_blank"
//                   className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between gap-3 group/line hover:bg-[#06C755]/10 hover:border-[#06C755]/30 transition-all cursor-pointer"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-full bg-[#06C755]/10 flex items-center justify-center text-[#06C755] group-hover/line:bg-[#06C755] group-hover/line:text-white transition-colors">
//                       <MessageCircle size={16} />
//                     </div>
//                     <div>
//                       <p className="text-[10px] text-gray-500 group-hover/line:text-[#06C755]">
//                         LINE Official
//                       </p>
//                       <p className="text-white text-sm font-medium group-hover/line:text-[#06C755]">
//                         Doag-thai
//                       </p>
//                     </div>
//                   </div>
//                   <ExternalLink
//                     size={14}
//                     className="text-gray-600 group-hover/line:text-[#06C755]"
//                   />
//                 </Link>

//                 {/* ✅ Facebook (เพิ่มใหม่) */}
//                 <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center gap-4">
//                   <div className="w-10 h-10 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2]">
//                     <Facebook size={20} />
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500">Facebook Page</p>
//                     <p className="text-white font-medium">Doag-thai</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// }

import { Metadata } from "next";
import {
  ShieldCheck,
  Eye,
  Share2,
  Trash2,
  Mail,
  Store,
  CheckCircle2,
  FileText,
  Facebook,
  MessageCircle,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "นโยบายความเป็นส่วนตัว | DOAG THAI",
  description: "นโยบายความเป็นส่วนตัวของร้าน DOAG THAI",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen w-full bg-[#050505] text-white relative overflow-hidden pb-8 pt-0 px-0">
      {/* Background Glow Effects (ปรับให้เล็กลงนิดนึง) */}
      <div className="fixed top-[-10%] left-[-10%] w-[300px] h-[300px] bg-green-500/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-green-500/5 blur-[80px] rounded-full pointer-events-none" />

      {/* Sticky Header: เล็กลง (py-1.5) */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-3 py-1.5 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 -ml-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
          asChild
        >
          <Link href="/">
            <ArrowLeft size={18} />
          </Link>
        </Button>
        <h1 className="text-xs font-semibold tracking-wide text-gray-200">
          นโยบายร้านค้า
        </h1>
        <div className="w-7" />
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-3 relative z-10">
        {/* Header Section: เล็กลง */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center p-2 mb-2 rounded-xl bg-green-500/10 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
            <ShieldCheck size={20} className="text-green-500" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-1">
            นโยบายความเป็นส่วนตัว
          </h1>
          <p className="text-gray-500 text-[10px]">
            อัปเดตล่าสุดเมื่อ:{" "}
            {new Date().toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Content Container: ลด gap เหลือ 3 */}
        <div className="space-y-3">
          {/* Section 1 */}
          <section className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 rounded bg-green-500/10 text-green-400">
                <FileText size={14} />
              </div>
              <h2 className="text-sm font-bold text-white">
                1. การเก็บรวบรวมข้อมูล
              </h2>
            </div>
            {/* เนื้อหาใช้ text-xs (เล็ก) */}
            <div className="text-gray-300 leading-snug text-xs pl-0.5">
              <p className="mb-2 opacity-90">
                ทางร้าน <strong className="text-green-400">DOAG THAI</strong>{" "}
                ("เรา") จะเก็บรวบรวมข้อมูลของท่านเท่าที่จำเป็น
                เพื่อการให้บริการและการดำเนินการตามคำสั่งซื้อเท่านั้น
                ข้อมูลที่เราเก็บรวบรวมอาจได้แก่:
              </p>
              <ul className="grid md:grid-cols-2 gap-1.5 mt-1">
                {[
                  "ชื่อ-นามสกุล",
                  "ที่อยู่อีเมล (Email Address)",
                  "เบอร์โทรศัพท์",
                  "ที่อยู่สำหรับการจัดส่งสินค้า",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-gray-400 bg-black/20 p-1.5 rounded-lg border border-white/5 text-[11px]"
                  >
                    <CheckCircle2
                      size={12}
                      className="text-green-500 flex-shrink-0"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 rounded bg-blue-500/10 text-blue-400">
                <Eye size={14} />
              </div>
              <h2 className="text-sm font-bold text-white">
                2. วัตถุประสงค์การใช้ข้อมูล
              </h2>
            </div>
            <div className="text-gray-300 leading-snug text-xs pl-0.5">
              <p className="mb-2 opacity-90">เราใช้ข้อมูลของท่านเพื่อ:</p>
              <ul className="space-y-1.5">
                {[
                  "ยืนยันตัวตนในการเข้าสู่ระบบ (ผ่าน Facebook, LINE, Google)",
                  "ดำเนินการจัดส่งสินค้าตามคำสั่งซื้อ",
                  "ติดต่อประสานงานกรณีสินค้ามีปัญหา",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.5)] flex-shrink-0" />
                    <span className="text-gray-400 text-[11px]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 rounded bg-purple-500/10 text-purple-400">
                <Share2 size={14} />
              </div>
              <h2 className="text-sm font-bold text-white">
                3. การเปิดเผยข้อมูล
              </h2>
            </div>
            <p className="text-gray-300 leading-snug text-xs pl-0.5 opacity-90">
              เราจะไม่เปิดเผยข้อมูลส่วนบุคคลของท่านต่อบุคคลภายนอก
              ยกเว้นในกรณีที่จำเป็นต่อการจัดส่งสินค้า (เช่น
              การให้ข้อมูลที่อยู่แก่บริษัทขนส่ง) หรือตามที่กฎหมายกำหนด
            </p>
          </section>

          {/* Section 4 */}
          <section className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 rounded bg-red-500/10 text-red-400">
                <Trash2 size={14} />
              </div>
              <h2 className="text-sm font-bold text-white">4. การลบข้อมูล</h2>
            </div>
            <p className="text-gray-300 leading-snug text-xs pl-0.5 opacity-90">
              หากท่านต้องการให้เราลบข้อมูลส่วนบุคคลของท่านออกจากระบบ
              กรุณาติดต่อเราผ่านช่องทาง LINE Official หรืออีเมลของทางร้าน
            </p>
          </section>

          {/* Section 5: ติดต่อเรา (Compact) */}
          <section className="mt-4 p-3.5 rounded-xl bg-gradient-to-br from-green-900/20 to-black border border-green-500/20 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 blur-[40px] rounded-full group-hover:bg-green-500/20 transition-all" />

            <div className="flex items-center gap-2 mb-3 relative z-10">
              <div className="p-1 rounded bg-green-500 text-black shadow-lg shadow-green-900/50">
                <Store size={14} />
              </div>
              <h2 className="text-sm font-bold text-white">5. ติดต่อเรา</h2>
            </div>

            <div className="space-y-2 relative z-10 pl-0.5">
              <p className="text-gray-300 text-[11px]">
                หากมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัว สามารถติดต่อได้ที่:
              </p>

              <div className="grid gap-2 w-full">
                {/* ชื่อร้าน */}
                <div className="w-full p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-green-400 flex-shrink-0">
                    <Store size={14} />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 leading-none mb-0.5">
                      ชื่อร้านค้า
                    </p>
                    <p className="text-white text-xs font-medium leading-none">
                      ร้าน DOAG THAI
                    </p>
                  </div>
                </div>

                {/* LINE Official - Compact */}
                <Link
                  href="https://line.me/ti/p/@434vnjcv"
                  target="_blank"
                  className="w-full p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between gap-2.5 group/line hover:bg-[#06C755]/10 hover:border-[#06C755]/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#06C755]/10 flex items-center justify-center text-[#06C755] group-hover/line:bg-[#06C755] group-hover/line:text-white transition-colors flex-shrink-0">
                      <MessageCircle size={14} />
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-500 group-hover/line:text-[#06C755] leading-none mb-0.5">
                        LINE Official
                      </p>
                      <p className="text-white text-xs font-medium group-hover/line:text-[#06C755] leading-none">
                        Doag-Thai
                      </p>
                    </div>
                  </div>
                  <ExternalLink
                    size={12}
                    className="text-gray-600 group-hover/line:text-[#06C755]"
                  />
                </Link>

                {/* Facebook - Compact */}
                <Link
                  href="https://www.facebook.com/profile.php?id=61569800688256"
                  target="_blank"
                  className="w-full p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center gap-2.5 hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] flex-shrink-0">
                    <Facebook size={14} />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 leading-none mb-0.5">
                      Facebook Page
                    </p>
                    <p className="text-white text-xs font-medium leading-none">
                      Doag-Thai
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
