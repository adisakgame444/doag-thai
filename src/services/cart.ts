// import db from '@/lib/db'
// import { CartItemDTO, CartSummaryDTO, CartWithRelations } from '@/types/cart'

// function mapCartItem(record: CartWithRelations): CartItemDTO {
//   const unitPrice = Number(record.weight.price ?? 0)
//   const basePrice = record.weight.basePrice != null ? Number(record.weight.basePrice) : null
//   const weight = Number(record.weight.weight ?? 0)
//   const productStock = Number(record.product.stock ?? 0)

//   const maxQuantity = weight > 0 ? Math.max(0, Math.floor(productStock / weight)) : 0
//   const mainImage =
//     record.product.ProductImage.find((image) => image.isMain) ??
//     record.product.ProductImage[0] ??
//     null

//   const subtotal = unitPrice * record.quantity

//   return {
//     id: record.id,
//     productId: record.productId,
//     weightId: record.weightId,
//     quantity: record.quantity,
//     unitPrice,
//     basePrice,
//     weight,
//     productTitle: record.product.title,
//     productStock,
//     productImageUrl: mainImage?.url ?? null,
//     categoryName: record.product.category?.name ?? null,
//     maxQuantity,
//     subtotal,
//     codAvailable: Boolean(record.product.cod),
//   }
// }

// function mapCartItems(records: CartWithRelations[]): CartItemDTO[] {
//   return records.map(mapCartItem)
// }

// export async function getCartRecords(userId: string) {
//   return db.cart.findMany({
//     where: { userId },
//     include: {
//       product: {
//         include: {
//           category: {
//             select: {
//               id: true,
//               name: true,
//             },
//           },
//           ProductImage: {
//             orderBy: { createdAt: 'asc' },
//           },
//         },
//       },
//       weight: true,
//     },
//     orderBy: {
//       product: {
//         createdAt: 'desc',
//       },
//     },
//   })
// }

// export async function getCartItemsByUser(userId: string): Promise<CartItemDTO[]> {
//   const records = await getCartRecords(userId)
//   return mapCartItems(records)
// }

// export async function getCartItemsByIds(
//   userId: string,
//   cartItemIds: string[]
// ): Promise<CartItemDTO[]> {
//   if (!cartItemIds.length) {
//     return []
//   }

//   const records = await getCartRecords(userId)
//   const filtered = records.filter((record) => cartItemIds.includes(record.id))
//   return mapCartItems(filtered)
// }

// export async function getCartSummary(userId: string): Promise<CartSummaryDTO> {
//   const records = await getCartRecords(userId)
//   const items = mapCartItems(records)

//   const summary = items.reduce(
//     (acc, item) => {
//       acc.totalItems += 1
//       acc.totalQuantity += item.quantity
//       acc.totalPrice += item.subtotal
//       return acc
//     },
//     { totalItems: 0, totalQuantity: 0, totalPrice: 0 }
//   )

//   return summary
// }

// async function getWeightWithProduct(productId: string, weightId: string) {
//   return db.productWeight.findFirst({
//     where: { id: weightId, productId },
//     include: {
//       product: {
//         select: {
//           id: true,
//           title: true,
//           stock: true,
//         },
//       },
//     },
//   })
// }

// function assertQuantity(quantity: number) {
//   if (!Number.isFinite(quantity) || quantity <= 0) {
//     throw new Error('จำนวนสินค้าไม่ถูกต้อง')
//   }
// }

// export async function addCartItem({
//   userId,
//   productId,
//   weightId,
//   quantity,
// }: {
//   userId: string
//   productId: string
//   weightId: string
//   quantity: number
// }): Promise<CartItemDTO[]> {
//   assertQuantity(quantity)

//   const weightRecord = await getWeightWithProduct(productId, weightId)

//   if (!weightRecord) {
//     throw new Error('ไม่พบตัวเลือกน้ำหนักของสินค้า')
//   }

//   const weightValue = Number(weightRecord.weight ?? 0)
//   const stock = Number(weightRecord.product.stock ?? 0)
//   const maxQuantity = weightValue > 0 ? Math.floor(stock / weightValue) : 0

//   if (maxQuantity <= 0) {
//     throw new Error('สินค้าไม่เพียงพอสำหรับน้ำหนักนี้')
//   }

//   const existing = await db.cart.findUnique({
//     where: {
//       userId_productId_weightId: {
//         userId,
//         productId,
//         weightId,
//       },
//     },
//   })

//   const nextQuantity = (existing?.quantity ?? 0) + quantity

//   if (nextQuantity > maxQuantity) {
//     throw new Error('จำนวนเกินกว่าสต็อกที่พร้อมจำหน่าย')
//   }

//   if (existing) {
//     await db.cart.update({
//       where: { id: existing.id },
//       data: {
//         quantity: nextQuantity,
//       },
//     })
//   } else {
//     await db.cart.create({
//       data: {
//         userId,
//         productId,
//         weightId,
//         quantity,
//       },
//     })
//   }

//   return getCartItemsByUser(userId)
// }

// export async function updateCartItemQuantity({
//   userId,
//   cartItemId,
//   quantity,
// }: {
//   userId: string
//   cartItemId: string
//   quantity: number
// }): Promise<CartItemDTO[]> {
//   if (quantity <= 0) {
//     await db.cart.delete({
//       where: { id: cartItemId },
//     })
//     return getCartItemsByUser(userId)
//   }

//   const cartRecord = await db.cart.findUnique({
//     where: { id: cartItemId },
//     include: {
//       weight: {
//         select: {
//           id: true,
//           weight: true,
//           productId: true,
//         },
//       },
//     },
//   })

//   if (!cartRecord) {
//     throw new Error('ไม่พบรายการในตะกร้า')
//   }

//   const weightRecord = await getWeightWithProduct(cartRecord.weight.productId, cartRecord.weight.id)

//   if (!weightRecord) {
//     await db.cart.delete({ where: { id: cartItemId } })
//     throw new Error('ไม่พบข้อมูลน้ำหนักสำหรับสินค้า')
//   }

//   const weightValue = Number(weightRecord.weight ?? 0)
//   const stock = Number(weightRecord.product.stock ?? 0)
//   const maxQuantity = weightValue > 0 ? Math.floor(stock / weightValue) : 0

//   if (maxQuantity <= 0) {
//     await db.cart.delete({ where: { id: cartItemId } })
//     throw new Error('สินค้าไม่เพียงพอสำหรับน้ำหนักนี้')
//   }

//   if (quantity > maxQuantity) {
//     throw new Error('จำนวนเกินกว่าสต็อกที่พร้อมจำหน่าย')
//   }

//   await db.cart.update({
//     where: { id: cartItemId },
//     data: { quantity },
//   })

//   return getCartItemsByUser(userId)
// }

// export async function removeCartItem({
//   userId,
//   cartItemId,
// }: {
//   userId: string
//   cartItemId: string
// }): Promise<CartItemDTO[]> {
//   await db.cart.delete({ where: { id: cartItemId } })
//   return getCartItemsByUser(userId)
// }

// export async function clearCart(userId: string, cartItemIds?: string[]): Promise<CartItemDTO[]> {
//   if (!cartItemIds || cartItemIds.length === 0) {
//     await db.cart.deleteMany({ where: { userId } })
//     return []
//   }

//   await db.cart.deleteMany({
//     where: {
//       userId,
//       id: { in: cartItemIds },
//     },
//   })

//   return getCartItemsByUser(userId)
// }

// export async function setCartItemQuantities({
//   userId,
//   updates,
// }: {
//   userId: string
//   updates: { cartItemId: string; quantity: number }[]
// }): Promise<CartItemDTO[]> {
//   if (!updates || updates.length === 0) {
//     return getCartItemsByUser(userId)
//   }

//   const normalizedUpdates = new Map<string, number>()
//   for (const { cartItemId, quantity } of updates) {
//     if (!cartItemId) continue
//     const safeQuantity = Number.isFinite(quantity) ? Math.floor(quantity) : 0
//     normalizedUpdates.set(cartItemId, safeQuantity)
//   }

//   if (normalizedUpdates.size === 0) {
//     return getCartItemsByUser(userId)
//   }

//   const existingRecords = await getCartRecords(userId)
//   const existingById = new Map(existingRecords.map((record) => [record.id, record]))

//   await db.$transaction(async (tx) => {
//     for (const [cartItemId, quantity] of normalizedUpdates.entries()) {
//       const record = existingById.get(cartItemId)
//       if (!record) continue

//       const weightValue = Number(record.weight.weight ?? 0)
//       const stock = Number(record.product.stock ?? 0)
//       const maxQuantity = weightValue > 0 ? Math.floor(stock / weightValue) : 0

//       if (quantity <= 0 || maxQuantity <= 0) {
//         await tx.cart.delete({
//           where: {
//             id: cartItemId,
//             userId,
//           },
//         })
//         existingById.delete(cartItemId)
//         continue
//       }

//       const safeQuantity = Math.min(quantity, maxQuantity)

//       await tx.cart.update({
//         where: {
//           id: cartItemId,
//           userId,
//         },
//         data: { quantity: safeQuantity },
//       })
//     }
//   })

//   return getCartItemsByUser(userId)
// }

import db from "@/lib/db";
import { CartItemDTO, CartSummaryDTO, CartWithRelations } from "@/types/cart";

// วางไว้ด้านบนสุด ต่อจาก import
function calculateRealMaxQuantity(
  productStock: number,
  weightValue: number,
  productType: string,
  weightName: string | null,
) {
  let consumption = weightValue;

  // ถ้าเป็นสินค้า UNIT (ขวด/ชิ้น) ให้แกะเลขจากชื่อ (เช่น "100 ขวด" -> 100)
  if (productType === "UNIT") {
    const nameVal = parseInt(weightName ?? "0", 10);
    // ถ้าแกะได้เลข และเลขมากกว่า 0 ให้ใช้เลขนี้หารสต็อกแทน
    if (!isNaN(nameVal) && nameVal > 0) {
      consumption = nameVal;
    }
  }

  return consumption > 0 ? Math.floor(productStock / consumption) : 0;
}

// function mapCartItem(record: CartWithRelations): CartItemDTO {
//   const unitPrice = Number(record.weight.price ?? 0);
//   const basePrice =
//     record.weight.basePrice != null ? Number(record.weight.basePrice) : null;
//   const weight = Number(record.weight.weight ?? 0);
//   const productStock = Number(record.product.stock ?? 0);

//   const maxQuantity =
//     weight > 0 ? Math.max(0, Math.floor(productStock / weight)) : 0;
//   const mainImage =
//     record.product.ProductImage.find((image) => image.isMain) ??
//     record.product.ProductImage[0] ??
//     null;

//   const subtotal = unitPrice * record.quantity;

//   return {
//     id: record.id,
//     productId: record.productId,
//     weightId: record.weightId,
//     quantity: record.quantity,
//     unitPrice,
//     basePrice,
//     weight,
//     productTitle: record.product.title,
//     productStock,
//     productImageUrl: mainImage?.url ?? null,
//     categoryName: record.product.category?.name ?? null,
//     maxQuantity,
//     subtotal,
//     codAvailable: Boolean(record.product.cod),
//   };
// }

function mapCartItem(record: CartWithRelations): CartItemDTO {
  const unitPrice = Number(record.weight.price ?? 0);
  const basePrice =
    record.weight.basePrice != null ? Number(record.weight.basePrice) : null;
  const weight = Number(record.weight.weight ?? 0);
  const productStock = Number(record.product.stock ?? 0);

  // 🔴 แก้ไข: ใช้ Helper Function คำนวณ Max Quantity
  const maxQuantity = calculateRealMaxQuantity(
    productStock,
    weight,
    record.product.type, // ต้องมั่นใจว่าใน DB มี field type
    record.weight.name, // ต้องมั่นใจว่าใน DB มี field name
  );

  const mainImage =
    record.product.ProductImage.find((image: any) => image.isMain) ??
    record.product.ProductImage[0] ??
    null;

  const subtotal = unitPrice * record.quantity;
  // const unitLabel =
  //   record.product.unitLabel ||
  //   (record.product.type === "UNIT" ? "ชิ้น" : "กรัม");

  // 1. ให้ลองดึงค่าจาก DB ก่อนเป็นอันดับแรก
  // (ถ้าใน DB คุณบันทึกว่า "กรัม", "ขวด", "ชิ้น" หรือ "กล่อง" มันจะเอาคำนั้นมาใช้เลย)
  let unitLabel = (record.product as any).unitLabel;

  // 2. ถ้าใน DB เป็นค่าว่าง (ลืมกรอก) ให้ระบบช่วยเดาให้ (ค่าสำรอง)
  if (!unitLabel) {
    if (record.product.type === "UNIT") {
      unitLabel = "ชิ้น"; // ค่าสำรอง ถ้าเป็น UNIT แล้วลืมกรอกหน่วย
    } else {
      unitLabel = "กรัม"; // ค่าสำรอง ถ้าเป็น WEIGHT แล้วลืมกรอกหน่วย
    }
  }

  return {
    id: record.id,
    productId: record.productId,
    weightId: record.weightId,
    quantity: record.quantity,
    unitPrice,
    basePrice,
    weight,
    variantName: record.weight.name,
    productTitle: record.product.title,
    productStock,
    productImageUrl: mainImage?.url ?? null,
    categoryName: record.product.category?.name ?? null,
    maxQuantity, // ✅ ค่านี้จะถูกต้องแล้ว (เช่น 9)
    subtotal,
    codAvailable: Boolean(record.product.cod),
    unitLabel, // 🟢 ส่งค่า unitLabel กลับไปด้วย
  };
}

function mapCartItems(records: CartWithRelations[]): CartItemDTO[] {
  return records.map(mapCartItem);
}

export async function getCartRecords(userId: string) {
  return db.cart.findMany({
    where: { userId },
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
    orderBy: {
      product: {
        createdAt: "desc",
      },
    },
  });
}

export async function getCartItemsByUser(
  userId: string,
): Promise<CartItemDTO[]> {
  const records = await getCartRecords(userId);
  return mapCartItems(records);
}

export async function getCartItemsByIds(
  userId: string,
  cartItemIds: string[],
): Promise<CartItemDTO[]> {
  if (!cartItemIds.length) {
    return [];
  }

  const records = await getCartRecords(userId);
  const filtered = records.filter((record) => cartItemIds.includes(record.id));
  return mapCartItems(filtered);
}

export async function getCartSummary(userId: string): Promise<CartSummaryDTO> {
  const records = await getCartRecords(userId);
  const items = mapCartItems(records);

  const summary = items.reduce(
    (acc, item) => {
      acc.totalItems += 1;
      acc.totalQuantity += item.quantity;
      acc.totalPrice += item.subtotal;
      return acc;
    },
    { totalItems: 0, totalQuantity: 0, totalPrice: 0 },
  );

  return summary;
}

async function getWeightWithProduct(productId: string, weightId: string) {
  return db.productWeight.findFirst({
    where: { id: weightId, productId },
    include: {
      product: {
        select: {
          id: true,
          title: true,
          stock: true,
          type: true, // ✅ เพิ่ม field type
        },
      },
    },
  });
}

function assertQuantity(quantity: number) {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error("จำนวนสินค้าไม่ถูกต้อง");
  }
}

export async function addCartItem({
  userId,
  productId,
  weightId,
  quantity,
}: {
  userId: string;
  productId: string;
  weightId: string;
  quantity: number;
}): Promise<CartItemDTO[]> {
  assertQuantity(quantity);

  const weightRecord = await getWeightWithProduct(productId, weightId);

  if (!weightRecord) {
    throw new Error("ไม่พบตัวเลือกน้ำหนักของสินค้า");
  }

  const weightValue = Number(weightRecord.weight ?? 0);
  const stock = Number(weightRecord.product.stock ?? 0);
  // const maxQuantity = weightValue > 0 ? Math.floor(stock / weightValue) : 0;
  const maxQuantity = calculateRealMaxQuantity(
    stock,
    weightValue,
    weightRecord.product.type,
    weightRecord.name,
  );

  if (maxQuantity <= 0) {
    throw new Error("สินค้าไม่เพียงพอสำหรับน้ำหนักนี้");
  }

  const existing = await db.cart.findUnique({
    where: {
      userId_productId_weightId: {
        userId,
        productId,
        weightId,
      },
    },
  });

  const nextQuantity = (existing?.quantity ?? 0) + quantity;

  if (nextQuantity > maxQuantity) {
    throw new Error("จำนวนเกินกว่าสต็อกที่พร้อมจำหน่าย");
  }

  if (existing) {
    await db.cart.update({
      where: { id: existing.id },
      data: {
        quantity: nextQuantity,
      },
    });
  } else {
    await db.cart.create({
      data: {
        userId,
        productId,
        weightId,
        quantity,
      },
    });
  }

  return getCartItemsByUser(userId);
}

export async function updateCartItemQuantity({
  userId,
  cartItemId,
  quantity,
}: {
  userId: string;
  cartItemId: string;
  quantity: number;
}): Promise<CartItemDTO[]> {
  if (quantity <= 0) {
    await db.cart.delete({
      where: { id: cartItemId, userId }, // 🔒 secure
    });
    return getCartItemsByUser(userId);
  }

  const cartRecord = await db.cart.findUnique({
    where: { id: cartItemId, userId }, // 🔒 secure
    include: {
      weight: {
        select: {
          id: true,
          weight: true,
          productId: true,
        },
      },
    },
  });

  if (!cartRecord) {
    throw new Error("ไม่พบรายการในตะกร้า");
  }

  const weightRecord = await getWeightWithProduct(
    cartRecord.weight.productId,
    cartRecord.weight.id,
  );

  if (!weightRecord) {
    await db.cart.delete({ where: { id: cartItemId, userId } }); // 🔒 secure
    throw new Error("ไม่พบข้อมูลน้ำหนักสำหรับสินค้า");
  }

  const weightValue = Number(weightRecord.weight ?? 0);
  const stock = Number(weightRecord.product.stock ?? 0);
  // const maxQuantity = weightValue > 0 ? Math.floor(stock / weightValue) : 0;
  const maxQuantity = calculateRealMaxQuantity(
    stock,
    weightValue,
    weightRecord.product.type,
    weightRecord.name,
  );

  if (maxQuantity <= 0) {
    await db.cart.delete({ where: { id: cartItemId, userId } }); // 🔒 secure
    throw new Error("สินค้าไม่เพียงพอสำหรับน้ำหนักนี้");
  }

  if (quantity > maxQuantity) {
    throw new Error("จำนวนเกินกว่าสต็อกที่พร้อมจำหน่าย");
  }

  await db.cart.update({
    where: { id: cartItemId, userId }, // 🔒 secure
    data: { quantity },
  });

  return getCartItemsByUser(userId);
}

export async function removeCartItem({
  userId,
  cartItemId,
}: {
  userId: string;
  cartItemId: string;
}): Promise<CartItemDTO[]> {
  await db.cart.delete({ where: { id: cartItemId, userId } }); // 🔒 secure
  return getCartItemsByUser(userId);
}

export async function clearCart(
  userId: string,
  cartItemIds?: string[],
): Promise<CartItemDTO[]> {
  if (!cartItemIds || cartItemIds.length === 0) {
    await db.cart.deleteMany({ where: { userId } });
    return [];
  }

  await db.cart.deleteMany({
    where: {
      userId,
      id: { in: cartItemIds },
    },
  });

  return getCartItemsByUser(userId);
}

export async function setCartItemQuantities({
  userId,
  updates,
}: {
  userId: string;
  updates: { cartItemId: string; quantity: number }[];
}): Promise<CartItemDTO[]> {
  if (!updates || updates.length === 0) {
    return getCartItemsByUser(userId);
  }

  const normalizedUpdates = new Map<string, number>();
  for (const { cartItemId, quantity } of updates) {
    if (!cartItemId) continue;
    const safeQuantity = Number.isFinite(quantity) ? Math.floor(quantity) : 0;
    normalizedUpdates.set(cartItemId, safeQuantity);
  }

  if (normalizedUpdates.size === 0) {
    return getCartItemsByUser(userId);
  }

  const existingRecords = await getCartRecords(userId);
  const existingById = new Map(
    existingRecords.map((record) => [record.id, record]),
  );

  await db.$transaction(async (tx) => {
    for (const [cartItemId, quantity] of normalizedUpdates.entries()) {
      const record = existingById.get(cartItemId);
      if (!record) continue;

      const weightValue = Number(record.weight.weight ?? 0);
      const stock = Number(record.product.stock ?? 0);
      // const maxQuantity = weightValue > 0 ? Math.floor(stock / weightValue) : 0;
      // 🔴 แก้ไข: ใช้ Helper คำนวณ
      const maxQuantity = calculateRealMaxQuantity(
        stock,
        weightValue,
        record.product.type,
        record.weight.name,
      );

      if (quantity <= 0 || maxQuantity <= 0) {
        await tx.cart.delete({
          where: {
            id: cartItemId,
            userId,
          },
        });
        existingById.delete(cartItemId);
        continue;
      }

      const safeQuantity = Math.min(quantity, maxQuantity);

      await tx.cart.update({
        where: {
          id: cartItemId,
          userId,
        },
        data: { quantity: safeQuantity },
      });
    }
  });

  return getCartItemsByUser(userId);
}
