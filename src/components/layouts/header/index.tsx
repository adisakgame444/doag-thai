// import { Cannabis } from 'lucide-react'
// import Link from 'next/link'
// import { Navigation } from './navigation'

// export default async function Header() {
//   const navigation = await Navigation()

//   return (
//     <header className='fixed top-0 inset-x-0 z-40 h-16 bg-card border-b border-b-border shadow-sm'>
//       <div className='max-w-7xl mx-auto flex h-16 items-center justify-between px-4 xl:px-0'>
//         <Link href='/' className='flex items-center gap-2 text-primary'>
//           <Cannabis size={40} aria-hidden focusable={false} />
//           <h2 className='text-xl font-bold'>DOAG THAI</h2>
//         </Link>

//         {navigation}
//       </div>
//     </header>
//   )
// }

// import { Cannabis } from "lucide-react";
// import Link from "next/link";
// import { Navigation } from "./navigation";
// import { vina } from "@/app/fonts"; // ⬅ เพิ่มฟอนต์

// export default async function Header() {
//   const navigation = await Navigation();

//   return (
//     <header className="fixed top-0 inset-x-0 z-40 h-16 bg-card border-b border-b-border shadow-sm">
//       <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 xl:px-0">
//         <Link href="/" className="flex items-center gap-2 text-primary">
//           <Cannabis size={40} />

//           {/* ⭐ ฟอนต์ Manufacturing Consent เฉพาะ DOAG THAI */}
//           <h2
//             className={`${vina.className} text-2xl md:text-2xl tracking-wider`}
//           >
//             DOAG THAI
//           </h2>
//         </Link>

//         {navigation}
//       </div>
//     </header>
//   );
// }

import Link from "next/link";
import Image from "next/image"; // ✅ 1. เปลี่ยนจาก Cannabis เป็น Image
import { Navigation } from "./navigation";
import { vina } from "@/app/fonts";

export default async function Header() {
  const navigation = await Navigation();

  return (
    <header className="fixed top-0 inset-x-0 z-40 h-16 bg-card border-b border-b-border shadow-sm">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 xl:px-0">
        <Link href="/" className="flex items-center gap-2 text-primary">
          <div className="relative h-10 w-10 rounded-full overflow-hidden bg-white/10 border-2 border-emerald-500">
            {/* <Image
              src="/doag-thai.png"
              alt="DOAG THAI Logo"
              // ✅ 1. ไม่ใช้ fill แต่กำหนด Width/Height ให้ "ใหญ่กว่ากรอบ" (High Res)
              // กรอบเรา 40px แต่เราสั่งโหลด 200px ไปเลย เพื่อความคมกริบ
              width={500} // ใส่เลขเยอะๆ ไว้ก่อน (เช่น 500)
              height={500}
              // ✅ 2. ใช้ CSS บีบรูปลงมาให้พอดีกรอบแทน (w-full h-full)
              className="object-contain w-full h-full scale-[1.2] translate-y-[1px]"
              // ✅ 3. เร่งคุณภาพสูงสุด
              // quality={100}
              unoptimized
              priority
            /> */}
            <Image
              src="/doag-thai.png"
              alt="DOAG THAI Logo"
              // ✅ 1. ใช้ fill เพื่อให้รูปขยายเต็มพื้นที่ container (40x40) เสมอ
              fill
              // ✅ 2. กำหนดขนาดที่เบราว์เซอร์ควรโหลดจริง (Retina 3x)
              // ช่วยให้ Next.js เลือกรูปที่คมแต่ไม่หนักเครื่องเกินไป
              sizes="120px"
              // ✅ 3. ใช้ scale เพื่อดันให้โลโก้ "ชิด" ขอบเส้นวงกลมมากขึ้น
              // ปรับเลข 1.15 หรือ 1.2 จนกว่าเส้นจะชิดกันตามที่คุณต้องการ
              className="object-contain scale-[1.2] translate-y-[0.5px] transition-transform"
              // ✅ 4. เร่งคุณภาพรูป
              quality={100}
              priority
            />
          </div>

          {/* ชื่อร้าน */}
          <h2
            className={`${vina.className} text-2xl md:text-2xl tracking-wider`}
          >
            DOAG THAI
          </h2>
        </Link>

        {navigation}
      </div>
    </header>
  );
}
