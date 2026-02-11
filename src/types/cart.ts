import { Prisma } from "@/generated/prisma/client";

export const cartWithRelations = {
  include: {
    product: {
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        ProductImage: {
          orderBy: { createdAt: "asc" },
        },
      },
    },
    weight: true,
  },
} satisfies Prisma.CartDefaultArgs;

export type CartWithRelations = Prisma.CartGetPayload<typeof cartWithRelations>;

export interface CartItemDTO {
  id: string;
  productId: string;
  weightId: string;
  unitLabel?: string | null;
  variantName?: string | null;
  quantity: number;
  unitPrice: number;
  basePrice: number | null;
  weight: number;
  productTitle: string;
  productStock: number;
  productImageUrl: string | null;
  categoryName: string | null;
  maxQuantity: number;
  subtotal: number;
  codAvailable: boolean;
}

export interface CartSummaryDTO {
  totalItems: number;
  totalQuantity: number;
  totalPrice: number;
}
