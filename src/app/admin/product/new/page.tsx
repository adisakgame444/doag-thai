import { Suspense } from "react";

import { getCategories } from "../../category/actions";
import ProductForm from "../product-form";
import { DetailPanelSkeleton } from "@/components/skeletons/detail-panel-skeleton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "เพิ่มสินค้าใหม่",
  description:
    "ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!",
};

export default async function NewProductPage() {
  return (
    <Suspense fallback={<DetailPanelSkeleton />}>
      <NewProductContent />
    </Suspense>
  );
}

async function NewProductContent() {
  const { items: categories } = await getCategories({
    status: "active",
    pageSize: 100,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground text-sm">Create a new product</p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
