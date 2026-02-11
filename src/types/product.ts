import { Prisma } from "@/generated/prisma/client";

export const productWithRelations = {
  include: {
    category: {
      select: {
        id: true,
        name: true,
        status: true,
      },
    },
    ProductImage: true,
    ProductWeight: true,
  },
} satisfies Prisma.ProductDefaultArgs;

export type ProductWithRelations = Prisma.ProductGetPayload<
  typeof productWithRelations
>;

// สร้าง Type สำหรับ Review ที่จะส่งไปหน้าบ้าน
export type ReviewItem = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
};

export type ProductWithMainImage = ProductWithRelations & {
  mainImage: ProductWithRelations["ProductImage"][number] | null;

  // ✅ เพิ่ม 2 บรรทัดนี้
  averageRating?: number;
  totalReviews?: number;
  reviews?: ReviewItem[];
};

export type ProductImageInput = {
  url: string;
  fileId: string;
};

export type ProductWeightInput = {
  name?: string;
  weight: number;
  basePrice: number;
  price: number;
};

export type ProductVariant = ProductWithRelations["ProductWeight"][number];
export type ProductImage = ProductWithRelations["ProductImage"][number];

export interface ProductInputBase {
  title: string;
  type: "WEIGHT" | "UNIT";
  unitLabel?: string;
  lowStock: number;
  description: string;
  cod: boolean;
  cost: number;
  stock: number;
  categoryId: string;
  mainImageIndex: number;
  images: ProductImageInput[];
  weights: ProductWeightInput[];
}

export type ProductCreateInput = ProductInputBase;

export interface ProductUpdateInput extends ProductInputBase {
  id: string;
  deletedImageIds: string[];
}
