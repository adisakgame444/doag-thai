// "use client";
// import { usePWA } from "@/context/PWAContext";
// import Link from "next/link";
// import { useEffect, useState } from "react"; // เพิ่ม import

// export default function InstallPage() {
//   const { installApp, isInstallable } = usePWA();
//   const [isIOS, setIsIOS] = useState(false); // เพิ่ม State เช็ค iOS

//   useEffect(() => {
//     // เช็คว่าเป็น iOS ไหมตอนโหลดหน้า
//     setIsIOS(/iPhone|iPad|iPod/i.test(navigator.userAgent));
//   }, []);

//   return (
//     <div className="min-h-screen bg-black text-white flex flex-col items-center pt-10 px-4 relative overflow-hidden">
//       {/* Background Glow */}
//       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-green-500/20 blur-[100px] rounded-full pointer-events-none" />

//       <h1 className="text-3xl font-bold text-green-400 mb-2 z-10">
//         WEED STORE
//       </h1>
//       <p className="text-gray-400 mb-8 text-center z-10">
//         ประสบการณ์ที่ดีกว่า บนแอปพลิเคชัน
//       </p>

//       {/* Mockup รูปภาพหน้าจอ (Placeholder) */}
//       <div className="w-full max-w-xs aspect-[9/16] bg-gray-900 border border-gray-800 rounded-2xl mb-8 flex items-center justify-center relative shadow-2xl">
//         <span className="text-gray-600">รูปตัวอย่างแอป</span>
//       </div>

//       {/* Card ติดตั้ง */}
//       <div className="bg-gray-900/80 backdrop-blur border border-gray-800 p-5 w-full max-w-sm rounded-2xl shadow-xl flex items-center justify-between z-10">
//         <div className="flex items-center gap-4">
//           <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
//             <span className="text-2xl">🌿</span>
//           </div>
//           <div>
//             <h3 className="font-bold text-white">Weed Store App</h3>
//             <Link
//               href="/"
//               className="text-xs text-green-400 underline cursor-pointer"
//             >
//               กลับหน้าหลัก
//             </Link>
//           </div>
//         </div>

//         {/* <button
//           onClick={installApp}
//           disabled={!isInstallable}
//           className={`px-5 py-2.5 rounded-full font-bold shadow-lg transition-all ${
//             isInstallable
//               ? "bg-green-500 hover:bg-green-400 text-black shadow-[0_0_15px_rgba(34,197,94,0.4)]"
//               : "bg-gray-700 text-gray-400 cursor-not-allowed"
//           }`}
//         >
//           {isInstallable ? "ติดตั้ง" : "เรียบร้อย"}
//         </button> */}

//         {!isIOS && (
//           <button
//             onClick={installApp}
//             disabled={!isInstallable}
//             className={`px-5 py-2.5 rounded-full font-bold ... ${
//               isInstallable ? "bg-green-500 ..." : "bg-gray-700 ..."
//             }`}
//           >
//             {isInstallable ? "ติดตั้ง" : "เรียบร้อย"}
//           </button>
//         )}
//       </div>

//       {/* iOS Instructions */}
//       {isIOS && (
//         <div className="mt-8 mb-3 p-6 bg-gray-900/80 border border-gray-800 rounded-2xl max-w-sm w-full backdrop-blur-sm">
//           <h3 className="text-green-400 font-bold text-lg mb-4 text-center">
//             วิธีติดตั้งบน iPhone / iPad
//           </h3>

//           <div className="space-y-4 text-sm text-gray-300">
//             {/* Step 1 */}
//             <div className="flex items-start gap-3">
//               <span className="flex-shrink-0 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-green-400 font-bold text-xs">
//                 1
//               </span>
//               <div>
//                 <p>
//                   มองหาแถบเมนูด้านล่างสุด แล้วกดปุ่ม{" "}
//                   <span className="text-white font-bold">"แชร์"</span>
//                 </p>
//                 {/* ไอคอน Share แบบ iOS */}
//                 <div className="mt-2 inline-flex items-center justify-center w-8 h-8 bg-gray-800 rounded-lg border border-gray-700">
//                   <svg
//                     width="18"
//                     height="18"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="text-blue-500"
//                   >
//                     <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
//                     <polyline points="16 6 12 2 8 6" />
//                     <line x1="12" y1="2" x2="12" y2="15" />
//                   </svg>
//                 </div>
//               </div>
//             </div>

//             {/* Step 2 */}
//             <div className="flex items-start gap-3">
//               <span className="flex-shrink-0 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-green-400 font-bold text-xs">
//                 2
//               </span>
//               <div>
//                 <p>เลื่อนลงมา แล้วเลือกเมนู</p>
//                 <div className="mt-1 flex items-center gap-2 text-white font-medium bg-gray-800 px-2 py-1 rounded w-fit">
//                   <svg
//                     width="16"
//                     height="16"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
//                     <line x1="12" y1="8" x2="12" y2="16" />
//                     <line x1="8" y1="12" x2="16" y2="12" />
//                   </svg>
//                   เพิ่มไปยังหน้าจอหลัก
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">
//                   (Add to Home Screen)
//                 </p>
//               </div>
//             </div>

//             {/* Step 3 */}
//             <div className="flex items-start gap-3">
//               <span className="flex-shrink-0 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-green-400 font-bold text-xs">
//                 3
//               </span>
//               <div>
//                 <p>
//                   กดปุ่ม{" "}
//                   <span className="text-blue-400 font-bold">"เพิ่ม" (Add)</span>{" "}
//                   ที่มุมขวาบนของหน้าจอ
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

'use client'
import { usePWA } from '@/context/PWAContext'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Kanit } from 'next/font/google' // 1. นำเข้าฟอนต์สวยๆ

// ตั้งค่าฟอนต์ Kanit
const kanit = Kanit({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '600'],
})

export default function InstallPage() {
  const { installApp, isInstallable } = usePWA()
  const [os, setOS] = useState({ isIOS: false, isAndroid: false })

  useEffect(() => {
    const ua = navigator.userAgent
    setOS({
      isIOS: /iPhone|iPad|iPod/i.test(ua),
      isAndroid: /Android/i.test(ua),
    })
  }, [])

  return (
    <div
      className={`min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 relative overflow-hidden ${kanit.className}`}
    >
      {/* 🟢 Background Glow */}
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-900/20 blur-[120px] rounded-full pointer-events-none' />

      {/* 🌿 Header Section */}
      <div className='z-10 text-center mb-8 animate-in slide-in-from-bottom-5 duration-700'>
        <div className='relative w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden border-2 border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.3)] group'>
          <Image
            src='/icons/icon-192.png'
            alt='Logo'
            width={192}
            height={192}
            className='object-cover w-full h-full scale-105 group-hover:scale-110 transition-transform duration-500'
            priority
          />
        </div>
        <h1 className='text-3xl font-black text-white mb-2 tracking-tight drop-shadow-lg uppercase'>
          Weed Store App
        </h1>
        <p className='text-gray-400 text-sm max-w-xs mx-auto font-light'>
          ติดตั้งแอปเพื่อประสบการณ์การใช้งานที่เหนือกว่า
        </p>
      </div>

      <div className='w-full max-w-md z-10 space-y-6'>
        {/* 🤖 Android / PC Section */}
        {!os.isIOS && (
          <div className='bg-gray-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl text-center shadow-2xl'>
            <h3 className='text-white font-bold text-lg mb-1 flex justify-center gap-2 items-center'>
              <Icons.Android /> สำหรับ Android
            </h3>
            <p className='text-gray-400 text-sm mb-6 font-light'>
              กดปุ่มด้านล่างเพื่อติดตั้งทันที
            </p>

            <button
              onClick={installApp}
              disabled={!isInstallable}
              className={`w-full py-3.5 rounded-xl font-bold text-md shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                isInstallable
                  ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-500/20'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isInstallable ? (
                <>
                  <Icons.Download /> ติดตั้งแอปพลิเคชัน
                </>
              ) : (
                'ติดตั้งเรียบร้อยแล้ว'
              )}
            </button>

            {!isInstallable && !os.isAndroid && (
              <p className='text-[10px] text-gray-500 mt-4'>
                *หากปุ่มกดไม่ได้ ให้มองหาไอคอนติดตั้ง 🖥️ ที่แถบ URL
              </p>
            )}
          </div>
        )}

        {/* 🍎 iOS Section */}
        {os.isIOS && (
          <div className='bg-[#1c1c1e]/90 backdrop-blur-xl border border-gray-700/50 p-6 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-10 duration-700'>
            <div className='flex items-center justify-between mb-6 border-b border-gray-700 pb-4'>
              <h3 className='text-white font-bold text-lg flex items-center gap-2'>
                <span className='text-2xl'></span> วิธีติดตั้งบน iOS
              </h3>
              <div className='bg-blue-600/20 text-blue-400 text-[10px] px-2 py-1 rounded border border-blue-500/30 font-medium'>
                Safari เท่านั้น
              </div>
            </div>

            <div className='space-y-5'>
              <StepItem
                num='1'
                title={
                  <span>
                    กดปุ่ม{' '}
                    <span className='text-blue-400 font-bold'>"แชร์"</span>
                  </span>
                }
                desc='แถบเมนูตรงกลางด้านล่าง'
              >
                <div className='w-full bg-gray-800/50 rounded-lg p-2 flex justify-center border border-dashed border-gray-700'>
                  <Icons.Share />
                </div>
              </StepItem>

              <StepItem
                num='2'
                title={
                  <span>
                    เลือก{' '}
                    <span className='text-white font-bold'>
                      "เพิ่มไปยังหน้าจอหลัก"
                    </span>
                  </span>
                }
                desc='ต้องเลื่อนลงมานิดหน่อยถึงจะเจอ'
              >
                <div className='w-full bg-[#2c2c2e] rounded-lg p-2 border border-gray-700 flex items-center justify-between px-3'>
                  <span className='text-white text-xs'>
                    เพิ่มไปยังหน้าจอหลัก
                  </span>
                  <Icons.PlusSquare />
                </div>
              </StepItem>

              <StepItem
                num='3'
                title={
                  <span>
                    กดปุ่ม{' '}
                    <span className='text-blue-500 font-bold'>
                      "เพิ่ม" (Add)
                    </span>
                  </span>
                }
                desc='ที่มุมขวาบนของหน้าจอ'
              />
            </div>
          </div>
        )}

        <div className='text-center mt-12'>
          <Link
            href='/'
            className='text-gray-500 hover:text-green-400 text-xs transition-colors underline decoration-gray-700 underline-offset-4 font-light'
          >
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  )
}

// ✨ Component ย่อยสำหรับขั้นตอน (ทำให้โค้ดสั้นลง)
const StepItem = ({ num, title, desc, children }: any) => (
  <div className='flex gap-4 items-start group'>
    <div className='shrink-0 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-blue-400 font-bold border border-gray-700 group-hover:bg-blue-600 group-hover:text-white transition-colors'>
      {num}
    </div>
    <div className='flex-1'>
      <p className='text-gray-200 text-sm font-medium mb-1'>{title}</p>
      <p className='text-xs text-gray-500 mb-2'>{desc}</p>
      {children}
    </div>
  </div>
)

// 🎨 รวมไอคอนไว้ตรงนี้ (ลดความรก)
const Icons = {
  Android: () => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='h-6 w-6 text-green-400'
      fill='currentColor'
      viewBox='0 0 24 24'
    >
      <path d='M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.4213 13.8533 8.0804 12 8.0804c-1.8533 0-3.5902.3409-5.1367.9205L4.8409 5.4979a.416.416 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396' />
    </svg>
  ),
  Download: () => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
      <polyline points='7 10 12 15 17 10' />
      <line x1='12' y1='15' x2='12' y2='3' />
    </svg>
  ),
  Share: () => (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='#3b82f6'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8' />
      <polyline points='16 6 12 2 8 6' />
      <line x1='12' y1='2' x2='12' y2='15' />
    </svg>
  ),
  PlusSquare: () => (
    <svg
      width='18'
      height='18'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='text-gray-400'
    >
      <rect x='3' y='3' width='18' height='18' rx='2' ry='2' />
      <line x1='12' y1='8' x2='12' y2='16' />
      <line x1='8' y1='12' x2='16' y2='12' />
    </svg>
  ),
}
