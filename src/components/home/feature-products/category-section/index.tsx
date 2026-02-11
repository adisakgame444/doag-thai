// "use client";

// import {
//   Dialog,
//   // DialogClose,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { CategorySummary } from "@/types/category";
// import { ProductWithMainImage } from "@/types/product";
// import { useState } from "react";
// import ProductCard from "./product-card";

// interface CategorySectionProps {
//   categories: CategorySummary[];
//   products: ProductWithMainImage[];
// }

// export default function CategorySection({
//   categories,
//   products,
// }: CategorySectionProps) {
//   const [selectedCategoryId, setSelectedCategoryId] = useState("");
//   const [isOpen, setIsOpen] = useState(false);

//   const filtered = selectedCategoryId
//     ? products.filter((p) => p.categoryId === selectedCategoryId)
//     : [];

//   const selectedName =
//     categories.find((c) => c.id === selectedCategoryId)?.name || "หมวดหมู่";

//   const handleCategoryChange = (id: string) => {
//     setSelectedCategoryId(id);
//     if (id) setIsOpen(true);
//   };

//   return (
//     <section>
//       <CategorySelect
//         categories={categories}
//         value={selectedCategoryId}
//         onChange={handleCategoryChange}
//       />

//       <CategoryModal
//         categoryName={selectedName}
//         products={filtered}
//         isOpen={isOpen}
//         onOpenChange={setIsOpen}
//       />
//     </section>
//   );
// }

// interface CategorySelectProps {
//   categories: CategorySummary[];
//   value: string;
//   onChange: (id: string) => void;
// }

// function CategorySelect({ categories, value, onChange }: CategorySelectProps) {
//   return (
//     <Select value={value} onValueChange={onChange}>
//       <SelectTrigger className="custom-select">
//         <SelectValue placeholder="หมวดหมู่สินค้า" />
//       </SelectTrigger>
//       <SelectContent side="bottom" align="end" avoidCollisions={false}>
//         {categories.map((c) => (
//           <SelectItem key={c.id} value={c.id}>
//             {c.name}
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//   );
// }

// interface CategoryModalProps {
//   categoryName: string;
//   products: ProductWithMainImage[];
//   isOpen: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// function CategoryModal({
//   categoryName,
//   products,
//   isOpen,
//   onOpenChange,
// }: CategoryModalProps) {
//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogContent className="!max-w-[700px] w-[95%] max-h-[90vh] overflow-y-auto flex flex-col">
//         <DialogHeader>
//           <DialogTitle>{categoryName}</DialogTitle>
//         </DialogHeader>
//         <div
//           className={`grid gap-4 flex-1 ${
//             products.length > 0 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1"
//           }`}
//         >
//           {products.length > 0 ? (
//             products.map((p) => <ProductCard key={p.id} product={p} />)
//           ) : (
//             <p className="text-muted-foreground">ไม่มีสินค้าภายในหมวดหมู่นี้</p>
//           )}
//         </div>

//         {/* <div className='mt-4 flex justify-end'>
//           <DialogClose asChild>
//             <button className='px-4 py-2 rounded-md bg-primary text-white'>
//               ปิด
//             </button>
//           </DialogClose>
//         </div> */}
//       </DialogContent>
//     </Dialog>
//   );
// }

// "use client";

// import { useState, useMemo } from "react";
// import { CategorySummary } from "@/types/category";
// import { ProductWithMainImage } from "@/types/product";
// import ProductCard from "./product-card";

// interface Props {
//   categories: CategorySummary[];
//   products: ProductWithMainImage[];
// }

// const ALL = "ALL";

// // ไอคอนของหมวดหมู่ (แก้ได้ตามใจ)
// const ICONS: Record<string, string> = {
//   default: "💚",
//   flower: "",
//   oil: "💧",
//   accessory: "🧪",
//   food: "🍪",
// };

// export default function CategorySection({ categories, products }: Props) {
//   const [selected, setSelected] = useState<string>(ALL);

//   // Filter สินค้า
//   const filtered = useMemo(() => {
//     if (selected === ALL) return products;
//     return products.filter((p) => p.categoryId === selected);
//   }, [selected, products]);

//   return (
//     <section className="w-full space-y-6 mt-4">
//       {/* --------------------------- */}
//       {/*    หมวดหมู่แบบเลื่อนแนวนอน  */}
//       {/* --------------------------- */}
//       <div className="flex overflow-x-auto gap-3 no-scrollbar py-2">
//         {/* ปุ่ม All */}
//         <CategoryButton
//           active={selected === ALL}
//           label="ทั้งหมด"
//           icon="🍽"
//           onClick={() => setSelected(ALL)}
//         />

//         {/* ปุ่มจากฐานข้อมูล */}
//         {categories.map((c) => (
//           <CategoryButton
//             key={c.id}
//             label={c.name}
//             icon={ICONS[c.name] || ICONS.default}
//             active={selected === c.id}
//             onClick={() => setSelected(c.id)}
//           />
//         ))}
//       </div>

//       {/* --------------------------- */}
//       {/*       สินค้าตามหมวด          */}
//       {/* --------------------------- */}
//       <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
//         {filtered.length > 0 ? (
//           filtered.map((p) => <ProductCard key={p.id} product={p} />)
//         ) : (
//           <p className="col-span-full text-center text-muted-foreground py-6">
//             ไม่มีสินค้าในหมวดนี้
//           </p>
//         )}
//       </div>
//     </section>
//   );
// }

// interface ButtonProps {
//   label: string;
//   icon: string;
//   active: boolean;
//   onClick: () => void;
// }

// function CategoryButton({ label, icon, active, onClick }: ButtonProps) {
//   return (
//     <button
//       onClick={onClick}
//       className={[
//         "flex flex-col items-center justify-center min-w-[80px] px-3 py-2 rounded-2xl border shadow-sm transition-all",
//         active
//           ? "bg-green-500 border-green-500 text-white shadow-md scale-[1.05]"
//           : "bg-background border-border text-foreground hover:bg-muted",
//       ].join(" ")}
//     >
//       <span className="text-2xl">{icon}</span>
//       <span className="text-xs mt-1 line-clamp-1">{label}</span>
//     </button>
//   );
// }

// "use client";

// import { useRouter } from "next/navigation";
// import { CategorySummary } from "@/types/category";

// interface Props {
//   categories: CategorySummary[];
// }

// const ALL = "ALL";

// // ไอคอนของหมวดหมู่ (แก้ได้ตามจริง)
// const ICONS: Record<string, string> = {
//   ใบทริม: "🌿",
//   น้ำมัน: "💧",
//   แดปนำเข้า: "🧪",
//   เอาท์ดอร์: "💚",
//   เยลลี่นำเข้า: "🍭",
//   Evap: "✨",
//   อินดอร์: "🏆",
//   default: "🥦",
// };

// export default function CategorySection({ categories }: Props) {
//   const router = useRouter();

//   const handleClick = (categoryId: string) => {
//     if (categoryId === ALL) {
//       router.push("/products"); // ไปหน้าสินค้าทั้งหมด
//     } else {
//       router.push(`/products?category=${categoryId}`); // ไปตามหมวด
//     }
//   };

//   return (
//     <div className="w-full flex overflow-x-auto gap-3 no-scrollbar py-2">
//       {/* ปุ่ม: ทั้งหมด */}
//       <CategoryButton
//         label="ทั้งหมด"
//         icon="🏡"
//         onClick={() => handleClick(ALL)}
//       />

//       {/* ปุ่ม: หมวดหมู่จาก DB */}
//       {categories.map((c) => (
//         <CategoryButton
//           key={c.id}
//           label={c.name}
//           icon={ICONS[c.name] || ICONS.default}
//           onClick={() => handleClick(c.id)}
//         />
//       ))}
//     </div>
//   );
// }

// interface CategoryButtonProps {
//   label: string;
//   icon: string;
//   onClick: () => void;
// }

// function CategoryButton({ label, icon, onClick }: CategoryButtonProps) {
//   return (
//     <button
//       onClick={onClick}
//       className="flex flex-col items-center justify-center min-w-[55px] px-1.5 py-1
//       rounded-lg border shadow-sm bg-background border-border text-foreground
//       hover:bg-muted transition-all"
//     >
//       <span className="text-2xl leading-none">{icon}</span>
//       <span className="text-[9px] mt-0.5 line-clamp-1">{label}</span>
//     </button>
//   );
// }

// "use client";

// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { CategorySummary } from "@/types/category";
// import { CATEGORY_ICONS } from "@/lib/categoryIcons";

// interface Props {
//   categories: CategorySummary[];
// }

// const ALL = "ALL";

// export default function CategorySection({ categories }: Props) {
//   const router = useRouter();

//   const handleClick = (categoryId: string) => {
//     if (categoryId === ALL) {
//       router.push("/products");
//     } else {
//       router.push(`/products?category=${categoryId}`);
//     }
//   };

//   return (
//     <div className="w-full flex overflow-x-auto gap-3 no-scrollbar py-2">
//       {/* ALL */}
//       <CategoryButton
//         label="ทั้งหมด"
//         icon={CATEGORY_ICONS.ALL}
//         onClick={() => handleClick(ALL)}
//       />

//       {categories.map((c) => (
//         <CategoryButton
//           key={c.id}
//           label={c.name}
//           icon={CATEGORY_ICONS[c.name] || CATEGORY_ICONS.default}
//           onClick={() => handleClick(c.id)}
//         />
//       ))}
//     </div>
//   );
// }

// interface CategoryButtonProps {
//   label: string;
//   icon: string;
//   onClick: () => void;
// }

// function CategoryButton({ label, icon, onClick }: CategoryButtonProps) {
//   return (
//     <button
//       onClick={onClick}
//       className="
//         flex flex-col items-center justify-center
//         min-w-[55px] px-1.5 py-1.5
//         rounded-md
//         border border-border
//         bg-background
//         hover:bg-muted
//         transition-all
//         active:scale-95
//       "
//     >
//       {/* ขนาดไอคอนเท่าเดิม */}
//       <Image
//         src={icon}
//         alt={label}
//         width={28}
//         height={28}
//         className="object-contain"
//       />

//       {/* ลดระยะห่าง ไม่ลดขนาดฟอนต์ */}
//       {/* <span className="text-[9px] mt-0.5 leading-tight line-clamp-1">
//         {label}
//       </span> */}
//       <span className="text-[9px] mt-0.5 leading-tight line-clamp-1 font-semibold">
//         {label}
//       </span>
//     </button>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import CategoryButton from "./CategoryButton";
import { CATEGORY_ICONS } from "@/lib/categoryIcons";
import { CategorySummary } from "@/types/category";

interface Props {
  categories: CategorySummary[];
}

const ALL = "ALL";

export default function CategorySection({ categories }: Props) {
  const router = useRouter();

  const handleClick = (id: string) => {
    router.push(id === ALL ? "/products" : `/products?category=${id}`);
  };

  return (
    // <div className="w-full flex gap-[21px] overflow-x-auto no-scrollbar">
    <div className="w-full flex overflow-x-auto no-scrollbar category-gap ">
      {" "}
      {/* ALL */}
      <CategoryButton
        label="ทั้งหมด"
        icon={CATEGORY_ICONS.ALL}
        onClick={() => handleClick(ALL)}
      />
      {/* Categories */}
      {categories.map((c) => {
        const icon = CATEGORY_ICONS[c.name] ?? CATEGORY_ICONS.default;

        return (
          <CategoryButton
            key={c.id}
            label={c.name}
            icon={icon}
            onClick={() => handleClick(c.id)}
          />
        );
      })}
    </div>
  );
}
