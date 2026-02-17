import db from "@/lib/db";
import { mapProductsWithMainImage, withMainImage } from "@/lib/products";
import {
  ProductCreateInput,
  ProductUpdateInput,
  productWithRelations,
  ProductWithMainImage,
} from "@/types/product";
import {
  normalizePagination,
  createPaginationMeta,
  ADMIN_DEFAULT_PAGE_SIZE,
  PUBLIC_DEFAULT_PAGE_SIZE,
  PaginationMeta,
} from "@/lib/pagination";

export interface ListProductsOptions {
  page?: number | string | null;
  pageSize?: number | string | null;
  status?: "all" | "active" | "inactive";
  search?: string | null;
}

export interface ListProductsResult {
  items: ProductWithMainImage[];
  total: number;
  meta: PaginationMeta;
}

export async function listProducts(
  options: ListProductsOptions = {},
): Promise<ListProductsResult> {
  const {
    page,
    pageSize = ADMIN_DEFAULT_PAGE_SIZE,
    status = "all",
    search,
  } = options;

  const pagination = normalizePagination(
    { page, pageSize },
    { defaultPageSize: ADMIN_DEFAULT_PAGE_SIZE },
  );

  const where = {
    ...(status !== "all" ? { status } : {}),
    ...(search
      ? {
          OR: [
            {
              title: {
                contains: search.trim(),
                mode: "insensitive" as const,
              },
            },
            {
              sku: {
                contains: search.trim(),
                mode: "insensitive" as const,
              },
            },
            {
              category: {
                name: {
                  contains: search.trim(),
                  mode: "insensitive" as const,
                },
              },
            },
          ],
        }
      : {}),
  };

  const [records, total] = await db.$transaction([
    db.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: productWithRelations.include,
      skip: pagination.skip,
      take: pagination.take,
    }),
    db.product.count({ where }),
  ]);

  const products = mapProductsWithMainImage(records) as ProductWithMainImage[];
  const meta = createPaginationMeta(total, {
    page: pagination.page,
    pageSize: pagination.pageSize,
  });

  return { items: products, total, meta };
}

export interface ListProductsActiveOptions {
  search?: string | null;
  page?: number | string | null;
  pageSize?: number | string | null;
  orderBy?: "asc" | "desc";
  category?: string | null; // ✅ เพิ่ม
}

export interface ListProductsActiveResult {
  items: ProductWithMainImage[];
  total: number;
  meta: PaginationMeta;
}

export async function listProductsActive(
  options: ListProductsActiveOptions = {},
): Promise<ListProductsActiveResult> {
  const { search, category, page, pageSize, orderBy = "asc" } = options;

  const pagination = normalizePagination(
    { page, pageSize },
    { defaultPageSize: PUBLIC_DEFAULT_PAGE_SIZE },
  );

  const where = {
    status: "active" as const,

    // ✅ filter ตามหมวดหมู่ ถ้ามี category
    ...(category ? { categoryId: category } : {}),

    ...(search?.trim()
      ? {
          OR: [
            {
              title: {
                contains: search.trim(),
                mode: "insensitive" as const,
              },
            },
            {
              sku: {
                contains: search.trim(),
                mode: "insensitive" as const,
              },
            },
            {
              category: {
                name: {
                  contains: search.trim(),
                  mode: "insensitive" as const,
                },
              },
            },
          ],
        }
      : {}),
  };

  // const [products, total] = await db.$transaction([
  //   db.product.findMany({
  //     where,
  //     orderBy: { createdAt: orderBy },
  //     include: productWithRelations.include,
  //     skip: pagination.skip,
  //     take: pagination.take,
  //   }),
  //   db.product.count({ where }),
  // ]);

  const [products, total] = await db.$transaction([
    db.product.findMany({
      where,
      orderBy: [{ stock: "desc" }, { createdAt: orderBy }],
      include: productWithRelations.include,
      skip: pagination.skip,
      take: pagination.take,
    }),
    db.product.count({ where }),
  ]);

  const items = mapProductsWithMainImage(products) as ProductWithMainImage[];
  const meta = createPaginationMeta(total, {
    page: pagination.page,
    pageSize: pagination.pageSize,
  });

  return { items, total, meta };
}

export async function listFeaturedProducts(options?: {
  search?: string;
  take?: number;
}): Promise<ProductWithMainImage[]> {
  const { search, take } = options || {};

  const products = await db.product.findMany({
    where: {
      status: "active",
      ...(search
        ? {
            OR: [
              {
                title: {
                  contains: search.trim(),
                  mode: "insensitive",
                },
              },
              {
                sku: {
                  contains: search.trim(),
                  mode: "insensitive",
                },
              },
              {
                category: {
                  name: {
                    contains: search.trim(),
                    mode: "insensitive",
                  },
                },
              },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: productWithRelations.include,
    take,
  });

  return mapProductsWithMainImage(products) as ProductWithMainImage[];
}

// export async function getProductById(
//   id: string
// ): Promise<ProductWithMainImage | null> {
//   const product = await db.product.findFirst({
//     where: { id },
//     include: {
//       ...productWithRelations.include,
//       ProductImage: {
//         orderBy: { createdAt: "asc" },
//       },
//     },
//   });

//   if (!product) return null;

//   return withMainImage(product);
// }

// ... imports เดิม ...

// export async function getProductById( // อันใหม่
//   id: string
// ): Promise<ProductWithMainImage | null> {
//   const product = await db.product.findFirst({
//     where: { id },
//     include: {
//       ...productWithRelations.include,
//       ProductImage: {
//         orderBy: { createdAt: "asc" },
//       },
//       // ✅ 1. ดึง rating ผ่าน relation 'reviews'
//       // reviews: {
//       //   select: { rating: true },
//       // },
//       reviews: {
//         orderBy: { createdAt: "desc" },
//         include: {
//           user: {
//             select: {
//               name: true,
//               image: true
//             }
//           }
//         }
//       }
//     },
//   });

//   if (!product) return null;

//   // ✅ 2. คำนวณคะแนนเฉลี่ย
//   const totalReviews = product.reviews.length;
//   const averageRating =
//     totalReviews > 0
//       ? product.reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews
//       : 0;

//   // ✅ 3. Return ข้อมูลกลับไป
//   return {
//     ...withMainImage(product),
//     averageRating,
//     totalReviews,
//   };
// }

export async function getProductById(
  id: string,
): Promise<ProductWithMainImage | null> {
  const product = await db.product.findFirst({
    where: { id },
    include: {
      category: true,
      ProductImage: {
        orderBy: { createdAt: "asc" },
      },
      ProductWeight: true, // ✅ ดึงข้อมูลน้ำหนัก/ชื่อตัวเลือกมาด้วย
      reviews: {
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!product) return null;

  // 1. คำนวณคะแนนเฉลี่ย
  const totalReviews = product.reviews.length;
  const averageRating =
    totalReviews > 0
      ? product.reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews
      : 0;

  // 2. 🔍 หาภาพหลักด้วยตัวเอง เพื่อแก้ปัญหา Type Mismatch
  // เราหาภาพที่ isMain เป็น true ถ้าไม่เจอเอาภาพแรก ถ้าไม่มีเลยให้เป็น null
  const mainImage =
    product.ProductImage.find((img) => img.isMain) ||
    product.ProductImage[0] ||
    null;

  // 3. ✅ Return ข้อมูลกลับไปพร้อม Type Casting ที่ถูกต้อง

  return {
    ...product,
    mainImage, // ใส่ภาพหลักที่เราหาเอง
    averageRating,
    totalReviews,
    // บังคับข้อมูลใหม่ติดไปด้วย
    type: product.type,
    unitLabel: product.unitLabel,
  } as ProductWithMainImage; // ใช้ 'as' เพื่อยืนยันกับ TypeScript
}

async function ensureActiveCategory(categoryId: string) {
  const category = await db.category.findUnique({
    where: { id: categoryId, status: "active" },
  });

  if (!category) {
    throw new Error("Selected category not found or inactive");
  }
}

export async function createProduct(input: ProductCreateInput) {
  const {
    title,
    type,
    unitLabel,
    lowStock,
    description,
    cod,
    cost,
    stock,
    categoryId,
    mainImageIndex,
    images,
    weights,
  } = input;

  await ensureActiveCategory(categoryId);

  return db.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        title,
        type,
        unitLabel,
        lowStock,
        description,
        cod,
        cost,
        stock,
        categoryId,
      },
    });

    await tx.product.update({
      where: { id: product.id },
      data: {
        sku: product.id.substring(0, 8).toUpperCase(),
      },
    });

    if (images && images.length > 0) {
      await Promise.all(
        images.map((img, index) =>
          tx.productImage.create({
            data: {
              url: img.url,
              fileId: img.fileId,
              isMain: mainImageIndex === index,
              productId: product.id,
            },
          }),
        ),
      );
    }

    if (weights && weights.length > 0) {
      await Promise.all(
        weights.map((w) =>
          tx.productWeight.create({
            data: {
              name: w.name,
              weight: w.weight,
              basePrice: w.basePrice,
              price: w.price,
              productId: product.id,
            },
          }),
        ),
      );
    }

    return product;
  });
}

export async function updateProduct(input: ProductUpdateInput) {
  const {
    id,
    title,
    type,
    unitLabel,
    lowStock,
    description,
    cod,
    cost,
    stock,
    categoryId,
    mainImageIndex,
    images,
    weights,
    deletedImageIds,
  } = input;

  const existingProduct = await db.product.findFirst({
    where: { id },
    include: {
      ProductImage: true,
    },
  });

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  await ensureActiveCategory(categoryId);

  return db.$transaction(async (tx) => {
    const product = await tx.product.update({
      where: { id },
      data: {
        title,
        type,
        unitLabel,
        lowStock,
        description,
        cod,
        cost,
        stock,
        categoryId,
      },
    });

    if (deletedImageIds && deletedImageIds.length > 0) {
      await tx.productImage.deleteMany({
        where: {
          id: { in: deletedImageIds },
          productId: product.id,
        },
      });
    }

    await tx.productImage.updateMany({
      where: { productId: product.id },
      data: { isMain: false },
    });

    if (images && images.length > 0) {
      await Promise.all(
        images.map((img) =>
          tx.productImage.create({
            data: {
              url: img.url,
              fileId: img.fileId,
              isMain: false,
              productId: product.id,
            },
          }),
        ),
      );
    }

    const allImages = await tx.productImage.findMany({
      where: { productId: product.id },
      orderBy: { createdAt: "asc" },
    });

    if (allImages.length > 0) {
      const boundedIndex = Math.max(
        0,
        Math.min(mainImageIndex, allImages.length - 1),
      );
      await tx.productImage.update({
        where: { id: allImages[boundedIndex].id },
        data: { isMain: true },
      });
    }

    if (weights) {
      await tx.productWeight.deleteMany({ where: { productId: product.id } });

      if (weights.length > 0) {
        await Promise.all(
          weights.map((w) =>
            tx.productWeight.create({
              data: {
                name: w.name,
                weight: w.weight,
                basePrice: w.basePrice,
                price: w.price,
                productId: product.id,
              },
            }),
          ),
        );
      }
    }

    return product;
  });
}

export async function updateProductStatus(id: string, status: string) {
  if (!["active", "inactive"].includes(status)) {
    throw new Error("Invalid product status");
  }

  return db.product.update({
    where: { id },
    data: { status },
  });
}

export async function getProductStats() {
  const [total, active, inactive] = await Promise.all([
    db.product.count(),
    db.product.count({ where: { status: "active" } }),
    db.product.count({ where: { status: "inactive" } }),
  ]);

  return { total, active, inactive };
}

export type ProductList = Awaited<ReturnType<typeof listProducts>>;
export type FeaturedProductList = Awaited<
  ReturnType<typeof listFeaturedProducts>
>;

export interface LowStockProductSummary {
  id: string;
  title: string;
  stock: number;
  lowStock: number | null;
  mainImageUrl: string | null;
}

export interface TopSellerSummary {
  id: string;
  title: string;
  totalSold: number;
  mainImageUrl: string | null;
  unitLabel: string | null; // ✅ เพิ่มตรงนี้
  price: number;
  originalPrice: number;
  status: string;
  stock: number;
}

export async function getLowStockProducts(
  limit = 5,
): Promise<LowStockProductSummary[]> {
  const products = await db.product.findMany({
    where: {
      status: "active",
    },
    orderBy: {
      stock: "asc",
    },
    take: limit,
    include: {
      ProductImage: {
        where: { isMain: true },
        take: 1,
      },
    },
  });

  return products.map((product) => ({
    id: product.id,
    title: product.title,
    stock: Number(product.stock),
    lowStock: product.lowStock != null ? Number(product.lowStock) : null,
    mainImageUrl: product.ProductImage[0]?.url ?? null,
  }));
}

// export async function getTopSellerProducts(
//   limit = 5,
// ): Promise<TopSellerSummary[]> {
//   const products = await db.product.findMany({
//     where: {
//       status: "active",
//     },
//     include: {
//       ProductImage: {
//         where: { isMain: true },
//         take: 1,
//       },
//       ProductWeight: {
//         select: {
//           sold: true,
//         },
//       },
//     },
//   });

//   return products
//     .map((product) => ({
//       id: product.id,
//       title: product.title,
//       totalSold: product.ProductWeight.reduce(
//         (sum, weight) => sum + (weight.sold ?? 0),
//         0,
//       ),
//       mainImageUrl: product.ProductImage[0]?.url ?? null,
//     }))
//     .sort((a, b) => b.totalSold - a.totalSold)
//     .slice(0, limit);
// }

export async function getTopSellerProducts(
  limit = 5,
): Promise<TopSellerSummary[]> {
  const products = await db.product.findMany({
    where: {
      status: "active",
    },
    // ✅ 1. เปลี่ยนมาใช้การเรียงลำดับจาก Database โดยตรง (เร็วกว่าและถูกต้องกว่า)
    orderBy: {
      totalSold: "desc",
    },
    take: limit,
    select: {
      id: true,
      title: true,
      totalSold: true, // ✅ 2. ดึงค่าจากฟิลด์ใหม่โดยตรง (ไม่ต้องวนลูปบวกเองแล้ว)
      unitLabel: true, // ✅ 3. ดึงหน่วยนับ (กรัม/ขวด/ชิ้น)
      status: true,
      stock: true,
      ProductImage: {
        where: { isMain: true },
        take: 1,
        select: { url: true },
      },
      ProductWeight: {
        take: 1,
        orderBy: { price: "asc" },
        select: {
          price: true,
          basePrice: true,
        },
      },
    },
  });

  // return products.map((product) => ({
  //   id: product.id,
  //   title: product.title,
  //   // ใช้ค่าจาก DB เลย หรือถ้าเป็น null ให้เป็น 0
  //   totalSold: product.totalSold ?? 0,
  //   unitLabel: product.unitLabel, // ✅ ส่งค่าออกไป
  //   mainImageUrl: product.ProductImage[0]?.url ?? null,
  // }));
  return products.map((product) => {
    // ✅ 1. ต้องประกาศข้างในนี้ (ตอนที่ product เกิดขึ้นแล้ว)
    const firstOption = product.ProductWeight[0];

    // ✅ 2. แล้วค่อย return ค่าออกไป
    return {
      id: product.id,
      title: product.title,
      totalSold: product.totalSold ?? 0,
      unitLabel: product.unitLabel,
      mainImageUrl: product.ProductImage[0]?.url ?? null,

      // ตอนนี้เรียกใช้ได้แล้ว ไม่แดงแน่นอน
      price: firstOption?.price ?? 0,
      originalPrice: firstOption?.basePrice ?? 0,
      status: product.status,
      stock: Number(product.stock), // แปลงเป็นตัวเลขให้ชัวร์
    };
  });
}

export async function listRecommendedProducts(limit = 8) {
  const topSellers = await getTopSellerProducts(limit);
  return topSellers;
}
