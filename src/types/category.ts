import { Prisma } from "@/generated/prisma/client";

export const categoryWithProducts = {
  select: {
    id: true,
    name: true,
    status: true,
    Product: {
      select: {
        id: true,
      },
    },
  },
} satisfies Prisma.CategoryDefaultArgs;

export type CategoryWithProducts = Prisma.CategoryGetPayload<
  typeof categoryWithProducts
>;

export const categorySummary = {
  select: {
    id: true,
    name: true,
    status: true,
  },
} satisfies Prisma.CategoryDefaultArgs;

export type CategorySummary = Prisma.CategoryGetPayload<typeof categorySummary>;
