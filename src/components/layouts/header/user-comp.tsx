// "use client";

// import { LoadingButton } from "@/components/loading-button";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { SheetClose } from "@/components/ui/sheet";
// import { useSignOut } from "@/hooks/use-sign-out";
// import { User } from "@/lib/auth";
// import Link from "next/link";
// import Image from "next/image";
// import { Mail, UserIcon } from "lucide-react";

// export function SignOutButton({ isMobile = false }) {
//   const { signOut } = useSignOut();

//   if (!isMobile) {
//     return (
//       <LoadingButton
//         variant="destructive"
//         className="w-full mt-4"
//         loading={false}
//         onClick={signOut}
//       >
//         ออกจากระบบ
//       </LoadingButton>
//     );
//   }

//   return (
//     <SheetClose asChild>
//       <LoadingButton
//         loading={false}
//         variant="destructive"
//         size="lg"
//         onClick={signOut}
//       >
//         ออกจากระบบ
//       </LoadingButton>
//     </SheetClose>
//   );
// }

// export function AuthButtons() {
//   return (
//     <div className="flex justify-center gap-3">
//       <Button size="lg" asChild>
//         <SheetClose asChild>
//           <Link href="/sign-in">เข้าสู่ระบบ</Link>
//         </SheetClose>
//       </Button>

//       <Button variant="outline" size="lg" asChild>
//         <SheetClose asChild>
//           <Link href="/sign-up">สมัครสมาชิก</Link>
//         </SheetClose>
//       </Button>
//     </div>
//   );
// }

// interface UserAvatarProps {
//   user: User;
// }

// export function UserAvatar({ user }: UserAvatarProps) {
//   return (
//     <div>
//       <Card className="relative overflow-hidden rounded-md">
//         {/* ✅ แบคกราวเป็นรูป */}
//         <Image
//           src="/images/game-image.jpg" // ใส่ path รูปแบคกราวของคุณ
//           alt="Background"
//           fill
//           className="absolute inset-0 object-cover"
//         />

//         <CardContent className="relative z-10 flex flex-col items-center gap-2 p-4">
//           <Image
//             alt={user.name || "Profile"}
//             src={user.image || "/images/Nouser-image.webp"}
//             width={128}
//             height={128}
//             priority
//             className="rounded-full object-cover shadow-md"
//           />
//           <h2 className="text-sm font-semibold text-primary bg-green-100/70 px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
//             <UserIcon size={16} className="text-green-500" />
//             {user.name}
//           </h2>
//           {user.email && (
//             <p className="text-sm text-gray-700 bg-gray-100/70 px-2 py-1 rounded-lg shadow-sm flex items-center gap-2 mt-1">
//               <Mail size={16} />
//               {user.email}
//             </p>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SheetClose } from "@/components/ui/sheet";
import { useSignOut } from "@/hooks/use-sign-out";
import { User } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import { Mail, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function SignOutButton({ isMobile = false }) {
  const { signOut } = useSignOut();

  if (!isMobile) {
    return (
      <LoadingButton
        variant="destructive"
        className="w-full mt-4"
        loading={false}
        onClick={signOut}
      >
        ออกจากระบบ
      </LoadingButton>
    );
  }

  return (
    <SheetClose asChild>
      <LoadingButton
        loading={false}
        variant="destructive"
        size="lg"
        onClick={signOut}
      >
        ออกจากระบบ
      </LoadingButton>
    </SheetClose>
  );
}

export function AuthButtons() {
  return (
    <div className="flex justify-center gap-3">
      <Button size="lg" asChild>
        <SheetClose asChild>
          <Link href="/sign-in">เข้าสู่ระบบ</Link>
        </SheetClose>
      </Button>

      <Button variant="outline" size="lg" asChild>
        <SheetClose asChild>
          <Link href="/sign-up">สมัครสมาชิก</Link>
        </SheetClose>
      </Button>
    </div>
  );
}

interface UserAvatarProps {
  user: User;
}

// export function UserAvatar({ user }: UserAvatarProps) {
//   return (
//     <div>
//       <Card className="rounded-xl border border-border/60 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 shadow-sm">
//         <CardContent className="flex flex-col items-center gap-3 p-5">
//           {/* Avatar with glow */}
//           <div className="relative">
//             <div className="absolute inset-0 rounded-full bg-green-400/40 blur-xl" />
//             <Image
//               alt={user.name || "Profile"}
//               src={user.image || "/images/Nouser-image.webp"}
//               width={128}
//               height={128}
//               priority
//               placeholder="blur"
//               blurDataURL="/images/avatar-blur.webp"
//               className="rounded-full object-cover shadow-lg relative z-10 border-2 border-white dark:border-zinc-700"
//             />
//           </div>

//           {/* Name */}
//           <div className="px-3 py-1 rounded-lg flex items-center gap-1 bg-white/70 dark:bg-zinc-700/40 backdrop-blur-sm shadow-sm">
//             <UserIcon size={16} className="text-green-500" />
//             <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
//               {user.name}
//             </span>
//           </div>

//           {/* Email */}
//           {user.email && (
//             <div className="px-3 py-1 rounded-lg flex items-center gap-2 bg-white/50 dark:bg-zinc-600/30 backdrop-blur-sm shadow-sm">
//               <Mail size={16} className="text-gray-600 dark:text-gray-300" />
//               <span className="text-sm text-gray-700 dark:text-gray-200">
//                 {user.email}
//               </span>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

export function UserAvatar({ user }: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);

  // ✅ Reset Error ทุกครั้งที่เปลี่ยน User (แก้ปัญหารูปค้าง)
  useEffect(() => {
    setImageError(false);
  }, [user.image]);

  return (
    <div>
      <Card className="rounded-xl border border-border/60 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 shadow-sm">
        <CardContent className="flex flex-col items-center gap-3 p-5">
          {/* Avatar Glow */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-green-400/40 blur-xl" />
            <Image
              alt={user.name || "Profile"}
              key={user.image}
              src={user.image || "/images/Nouser-image.webp"}
              width={128}
              height={128}
              priority
              // ✅ 1. ใส่ unoptimized เพื่อไม่ให้กินโควตา Vercel
              // ผลลัพธ์: ถ้าเป็นรูปจาก Google มันจะดึง link ตรงมาแสดงเลย (เร็วและฟรี)
              unoptimized={true}
              className="
                rounded-full object-cover shadow-lg
                relative z-10 border-2 border-white dark:border-zinc-700
              "
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
            />
          </div>

          {/* Name */}
          <div className="px-3 py-1 rounded-lg flex items-center gap-1 bg-white/70 dark:bg-zinc-700/40 backdrop-blur-sm shadow-sm">
            <UserIcon size={16} className="text-green-500" />
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {user.name}
            </span>
          </div>

          {/* Email */}
          {user.email && (
            <div className="px-3 py-1 rounded-lg flex items-center gap-2 bg-white/50 dark:bg-zinc-600/30 backdrop-blur-sm shadow-sm">
              <Mail size={16} className="text-gray-600 dark:text-gray-300" />
              <span className="text-sm text-gray-700 dark:text-gray-200">
                {user.email}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
