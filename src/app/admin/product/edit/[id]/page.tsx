import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getCategories } from "../../../category/actions";
import { getProductById } from "../../actions";
import { getProductById as getProductByIdMetaData } from "@/services/products";
import ProductForm from "../../product-form";
import { DetailPanelSkeleton } from "@/components/skeletons/detail-panel-skeleton";
import { Metadata } from "next";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductByIdMetaData(id);

  if (!product) {
    return {
      title: "ไม่พบสินค้า",
      description:
        "ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!",
    };
  }

  return {
    title: `แก้ไขสินค้า: ${product.title}`,
    description:
      "ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!",
  };
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<DetailPanelSkeleton />}>
      <EditProductContent id={id} />
    </Suspense>
  );
}

async function EditProductContent({ id }: { id: string }) {
  const [product, categoriesResult] = await Promise.all([
    getProductById(id),
    getCategories({ status: "active", pageSize: 100 }),
  ]);

  if (!product || "error" in product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground text-sm">Update product details</p>
      </div>

      <ProductForm categories={categoriesResult.items} product={product} />
    </div>
  );
}
