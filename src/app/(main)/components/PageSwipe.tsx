// "use client";

// import { useRef } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// interface PageSwipeProps {
//   totalPages: number;
//   children: React.ReactNode;
// }

// export default function PageSwipe({ totalPages, children }: PageSwipeProps) {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const startX = useRef<number | null>(null);

//   const currentPage = Number(searchParams.get("page") ?? 1);

//   const goToPage = (page: number) => {
//     if (page < 1 || page > totalPages) return;

//     const params = new URLSearchParams(searchParams.toString());
//     if (page === 1) {
//       params.delete("page");
//     } else {
//       params.set("page", String(page));
//     }

//     router.push(`/products?${params.toString()}`);
//   };

//   const onTouchStart = (e: React.TouchEvent) => {
//     startX.current = e.touches[0].clientX;
//   };

//   const onTouchEnd = (e: React.TouchEvent) => {
//     if (startX.current === null) return;

//     const endX = e.changedTouches[0].clientX;
//     const diff = startX.current - endX;

//     // ต้องปัดเกิน 80px ถึงจะเปลี่ยนหน้า (กันปัดพลาด)
//     if (Math.abs(diff) > 80) {
//       if (diff > 0) {
//         // ปัดซ้าย → หน้าถัดไป
//         goToPage(currentPage + 1);
//       } else {
//         // ปัดขวา → หน้าก่อนหน้า
//         goToPage(currentPage - 1);
//       }
//     }

//     startX.current = null;
//   };

//   return (
//     <div
//       onTouchStart={onTouchStart}
//       onTouchEnd={onTouchEnd}
//       className="touch-pan-y px-[15px] md:px-0"
//     >
//       {children}
//     </div>
//   );
// }

// "use client";

// import { useRef } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// interface PageSwipeProps {
//   totalPages: number;
//   children: React.ReactNode;
// }

// export default function PageSwipe({ totalPages, children }: PageSwipeProps) {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const startX = useRef<number | null>(null);

//   const currentPage = Number(searchParams.get("page") ?? 1);

//   const goToPage = (page: number) => {
//     if (page < 1 || page > totalPages) return;

//     const params = new URLSearchParams(searchParams.toString());
//     if (page === 1) {
//       params.delete("page");
//     } else {
//       params.set("page", String(page));
//     }

//     const query = params.toString();
//     router.push(query ? `/products?${query}` : "/products");
//   };

//   const onTouchStart = (e: React.TouchEvent) => {
//     startX.current = e.touches[0].clientX;
//   };

//   const onTouchEnd = (e: React.TouchEvent) => {
//     if (startX.current === null) return;

//     const diffX = startX.current - e.changedTouches[0].clientX;

//     if (Math.abs(diffX) > 80) {
//       diffX > 0 ? goToPage(currentPage + 1) : goToPage(currentPage - 1);
//     }

//     startX.current = null;
//   };

//   return (
//     <div
//       onTouchStart={onTouchStart}
//       onTouchEnd={onTouchEnd}
//       className="touch-pan-y"
//     >
//       {children}
//     </div>
//   );
// }
