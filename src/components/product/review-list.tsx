// "use client";

// import { Star, User } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { cn } from "@/lib/utils";
// import dayjs from "dayjs"; // หรือใช้ library จัดการวันที่ที่คุณมี
// import "dayjs/locale/th"; // ถ้าต้องการภาษาไทย

// // ใช้ Type ที่เราประกาศไว้ หรือประกาศใหม่ตรงนี้ถ้าหาไม่เจอ
// interface ReviewItem {
//   id: string;
//   rating: number;
//   comment: string | null;
//   createdAt: Date;
//   user: {
//     name: string | null;
//     image: string | null;
//   };
// }

// export function ReviewList({ reviews }: { reviews: ReviewItem[] }) {
//   if (reviews.length === 0) {
//     return (
//       <div className="py-8 text-center text-muted-foreground">
//         ยังไม่มีรีวิวสำหรับสินค้านี้ เป็นคนแรกที่รีวิวเลย!
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 pt-4">
//       {reviews.map((review) => (
//         <div key={review.id} className="flex gap-4 border-b border-border/40 pb-6 last:border-0 last:pb-0">
//           {/* Avatar ของลูกค้า */}
//           <Avatar className="h-10 w-10 border">
//             <AvatarImage src={review.user.image || ""} alt={review.user.name || "User"} />
//             <AvatarFallback className="bg-muted">
//               <User className="h-5 w-5 text-muted-foreground" />
//             </AvatarFallback>
//           </Avatar>

//           <div className="flex-1 space-y-1">
//             {/* ชื่อลูกค้า และ วันที่ */}
//             <div className="flex items-center justify-between">
//               <h4 className="font-semibold text-sm text-foreground">
//                 {review.user.name || "ลูกค้าทั่วไป"}
//               </h4>
//               <span className="text-xs text-muted-foreground">
//                 {dayjs(review.createdAt).locale("th").format("D MMM BBBB")}
//               </span>
//             </div>

//             {/* ดาว */}
//             <div className="flex items-center gap-0.5">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <Star
//                   key={star}
//                   className={cn(
//                     "h-3.5 w-3.5",
//                     star <= review.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
//                   )}
//                 />
//               ))}
//             </div>

//             {/* ข้อความรีวิว */}
//             {review.comment && (
//               <p className="text-sm text-muted-foreground pt-1 leading-relaxed">
//                 {review.comment}
//               </p>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

"use client";

import { Star, User } from "lucide-react";
import Image from "next/image"; // ✅ ใช้ Image ของ Next.js แทน Avatar
import { cn } from "@/lib/utils";

interface ReviewItem {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
}

export function ReviewList({ reviews }: { reviews: ReviewItem[] }) {
  if (reviews.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        ยังไม่มีรีวิวสำหรับสินค้านี้ เป็นคนแรกที่รีวิวเลย!
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="flex gap-4 border-b border-border/40 pb-6 last:border-0 last:pb-0"
        >
          {/* ✅ ส่วนรูปโปรไฟล์ (เขียนเองไม่ง้อ Component Avatar) */}
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-muted flex items-center justify-center">
            {review.user.image ? (
              <Image
                src={review.user.image}
                alt={review.user.name || "User"}
                fill
                className="object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1 space-y-1">
            {/* ชื่อลูกค้า และ วันที่ */}
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm text-foreground">
                {review.user.name || "ลูกค้าทั่วไป"}
              </h4>
              <span className="text-xs text-muted-foreground">
                {/* ✅ ใช้วันที่แบบไม่ต้องลง Dayjs */}
                {new Date(review.createdAt).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* ดาว */}
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-3.5 w-3.5",
                    star <= review.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-muted text-muted-foreground/20"
                  )}
                />
              ))}
            </div>

            {/* ข้อความรีวิว */}
            {review.comment && (
              <p className="text-sm text-muted-foreground pt-1 leading-relaxed">
                {review.comment}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
