// import db from "@/lib/db";
// import {
//   OrderStatus,
//   PaymentMethod,
//   PaymentStatus,
//   Prisma,
// } from "@/generated/prisma";
// import { OrderDetailDTO, OrderItemDTO, OrderPaymentDTO } from "@/types/order";
// import {
//   normalizePagination,
//   createPaginationMeta,
//   ADMIN_DEFAULT_PAGE_SIZE,
//   PaginationMeta,
// } from "@/lib/pagination";

// type OrderWithRelations = Prisma.OrderGetPayload<{
//   include: {
//     items: true;
//     payments: true;
//   };
// }>;

// interface CreateOrderInput {
//   userId: string;
//   addressId: string;
//   paymentMethod: PaymentMethod;
//   paymentStatus: PaymentStatus;
//   subtotal: number;
//   shippingFee: number;
//   depositAmount: number;
//   totalAmount: number;
//   requiresCodDeposit: boolean;
//   shippingName: string;
//   shippingPhone: string;
//   shippingLine1: string;
//   shippingLine2?: string | null;
//   shippingProvince: string;
//   shippingDistrict: string;
//   shippingSubdistrict: string;
//   shippingPostalCode: string;
//   notes?: string | null;
//   items: Array<{
//     productId: string | null;
//     weightId: string | null;
//     productTitle: string;
//     productSku: string | null;
//     weightValue: number | null;
//     unitPrice: number;
//     basePrice: number | null;
//     quantity: number;
//     subtotal: number;
//     codAvailable: boolean;
//   }>;
//   payments: Array<{
//     method: PaymentMethod;
//     amount: number;
//     slipUrl?: string | null;
//     slipFileId?: string | null;
//     status?: PaymentStatus;
//     paidAt?: Date | null;
//   }>;
// }

// function mapOrderDetail(order: OrderWithRelations): OrderDetailDTO {
//   const items: OrderItemDTO[] = order.items.map((item) => ({
//     id: item.id,
//     productId: item.productId,
//     weightId: item.weightId,
//     productTitle: item.productTitle,
//     productSku: item.productSku,
//     weightValue: item.weightValue,
//     unitPrice: item.unitPrice,
//     basePrice: item.basePrice,
//     quantity: item.quantity,
//     subtotal: item.subtotal,
//     codAvailable: item.codAvailable,
//     createdAt: item.createdAt,
//     updatedAt: item.updatedAt,
//   }));

//   const payments: OrderPaymentDTO[] = order.payments.map((payment) => ({
//     id: payment.id,
//     method: payment.method,
//     amount: payment.amount,
//     slipUrl: payment.slipUrl,
//     slipFileId: payment.slipFileId,
//     status: payment.status,
//     paidAt: payment.paidAt,
//     createdAt: payment.createdAt,
//     updatedAt: payment.updatedAt,
//   }));

//   return {
//     id: order.id,
//     orderNumber: order.orderNumber,
//     status: order.status,
//     paymentStatus: order.paymentStatus,
//     paymentMethod: order.paymentMethod,
//     subtotal: order.subtotal,
//     shippingFee: order.shippingFee,
//     depositAmount: order.depositAmount,
//     totalAmount: order.totalAmount,
//     requiresCodDeposit: order.requiresCodDeposit,
//     shippingName: order.shippingName,
//     shippingPhone: order.shippingPhone,
//     shippingLine1: order.shippingLine1,
//     shippingLine2: order.shippingLine2,
//     shippingProvince: order.shippingProvince,
//     shippingDistrict: order.shippingDistrict,
//     shippingSubdistrict: order.shippingSubdistrict,
//     shippingPostalCode: order.shippingPostalCode,
//     trackingNumber: order.trackingNumber,
//     carrier: order.carrier, // ← เพิ่มตรงนี้
//     notes: order.notes,
//     createdAt: order.createdAt,
//     updatedAt: order.updatedAt,
//     items,
//     payments,
//   };
// }

// export async function createOrder(data: CreateOrderInput) {
//   let orderNumber = "";

//   await db.$transaction(async (tx) => {
//     const order = await tx.order.create({
//       data: {
//         orderNumber: "",
//         userId: data.userId,
//         addressId: data.addressId,
//         status: OrderStatus.PENDING_PAYMENT,
//         paymentMethod: data.paymentMethod,
//         paymentStatus: data.paymentStatus,
//         subtotal: data.subtotal,
//         shippingFee: data.shippingFee,
//         depositAmount: data.depositAmount,
//         totalAmount: data.totalAmount,
//         requiresCodDeposit: data.requiresCodDeposit,
//         shippingName: data.shippingName,
//         shippingPhone: data.shippingPhone,
//         shippingLine1: data.shippingLine1,
//         shippingLine2: data.shippingLine2 ?? null,
//         shippingProvince: data.shippingProvince,
//         shippingDistrict: data.shippingDistrict,
//         shippingSubdistrict: data.shippingSubdistrict,
//         shippingPostalCode: data.shippingPostalCode,
//         notes: data.notes ?? null,
//       },
//     });

//     orderNumber = `ORD${order.id
//       .replace(/[^A-Za-z0-9]/g, "")
//       .slice(0, 8)
//       .toUpperCase()}`;

//     await tx.order.update({
//       where: { id: order.id },
//       data: { orderNumber },
//     });

//     await tx.orderItem.createMany({
//       data: data.items.map((item) => ({
//         orderId: order.id,
//         productId: item.productId,
//         weightId: item.weightId,
//         productTitle: item.productTitle,
//         productSku: item.productSku,
//         weightValue: item.weightValue,
//         unitPrice: item.unitPrice,
//         basePrice: item.basePrice,
//         quantity: item.quantity,
//         subtotal: item.subtotal,
//         codAvailable: item.codAvailable,
//       })),
//     });

//     await Promise.all(
//       data.payments.map((payment) =>
//         tx.orderPayment.create({
//           data: {
//             orderId: order.id,
//             method: payment.method,
//             amount: payment.amount,
//             slipUrl: payment.slipUrl ?? null,
//             slipFileId: payment.slipFileId ?? null,
//             status: payment.status ?? PaymentStatus.PENDING,
//             paidAt: payment.paidAt ?? null,
//           },
//         })
//       )
//     );
//   });

//   return orderNumber;
// }

// export async function listOrdersByUser(
//   userId: string
// ): Promise<OrderDetailDTO[]> {
//   const orders = await db.order.findMany({
//     where: { userId },
//     orderBy: { createdAt: "desc" },
//     include: {
//       items: {
//         orderBy: { createdAt: "asc" },
//       },
//       payments: {
//         orderBy: { createdAt: "asc" },
//       },
//     },
//   });

//   return orders.map(mapOrderDetail);
// }

// export interface ListOrdersOptions {
//   statuses?: OrderStatus[];
//   search?: string | null;
//   page?: number | string | null;
//   pageSize?: number | string | null;
// }

// export interface ListOrdersResult {
//   items: OrderDetailDTO[];
//   total: number;
//   meta: PaginationMeta;
// }

// export async function listOrders(
//   options: ListOrdersOptions = {}
// ): Promise<ListOrdersResult> {
//   const { statuses, search, page, pageSize } = options;

//   const pagination = normalizePagination(
//     { page, pageSize },
//     { defaultPageSize: ADMIN_DEFAULT_PAGE_SIZE }
//   );

//   const where: Prisma.OrderWhereInput = {
//     ...(statuses && statuses.length ? { status: { in: statuses } } : {}),
//     ...(search
//       ? {
//           orderNumber: {
//             contains: search.trim(),
//             mode: "insensitive",
//           },
//         }
//       : {}),
//   };

//   const [orders, total] = await db.$transaction([
//     db.order.findMany({
//       where,
//       orderBy: { createdAt: "desc" },
//       include: {
//         items: {
//           orderBy: { createdAt: "asc" },
//         },
//         payments: {
//           orderBy: { createdAt: "asc" },
//         },
//       },
//       skip: pagination.skip,
//       take: pagination.take,
//     }),
//     db.order.count({ where }),
//   ]);

//   const meta = createPaginationMeta(total, {
//     page: pagination.page,
//     pageSize: pagination.pageSize,
//   });

//   return { items: orders.map(mapOrderDetail), total, meta };
// }

// export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
//   [OrderStatus.PENDING_PAYMENT]: [
//     OrderStatus.PENDING_VERIFICATION,
//     OrderStatus.PROCESSING,
//     OrderStatus.CANCELLED,
//   ],
//   [OrderStatus.PENDING_VERIFICATION]: [
//     OrderStatus.PROCESSING,
//     OrderStatus.CANCELLED,
//   ],
//   [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
//   [OrderStatus.SHIPPED]: [OrderStatus.COMPLETED],
//   [OrderStatus.COMPLETED]: [],
//   [OrderStatus.CANCELLED]: [],
// };

// export async function approveOrderPayment(orderId: string) {
//   await db.$transaction(async (tx) => {
//     const order = await tx.order.findUnique({
//       where: { id: orderId },
//       include: {
//         items: true,
//         payments: true,
//       },
//     });

//     if (!order) {
//       throw new Error("ไม่พบคำสั่งซื้อที่ต้องการอนุมัติ");
//     }

//     if (order.paymentStatus === PaymentStatus.APPROVED) {
//       return;
//     }

//     if (
//       order.status !== OrderStatus.PENDING_PAYMENT &&
//       order.status !== OrderStatus.PENDING_VERIFICATION
//     ) {
//       throw new Error("ไม่สามารถอนุมัติการชำระเงินสำหรับสถานะปัจจุบันได้");
//     }

//     if (!order.items.length) {
//       throw new Error("คำสั่งซื้อไม่มีสินค้า จึงไม่สามารถอนุมัติได้");
//     }

//     const weightIds = order.items
//       .map((item) => item.weightId)
//       .filter(Boolean) as string[];
//     const productIds = order.items
//       .map((item) => item.productId)
//       .filter(Boolean) as string[];

//     const weightMap = weightIds.length
//       ? new Map(
//           (
//             await tx.productWeight.findMany({
//               where: { id: { in: weightIds } },
//               select: { id: true, weight: true, productId: true },
//             })
//           ).map((weight) => [weight.id, weight])
//         )
//       : new Map<string, { id: string; weight: number; productId: string }>();

//     const productMap = productIds.length
//       ? new Map(
//           (
//             await tx.product.findMany({
//               where: { id: { in: productIds } },
//               select: { id: true, stock: true },
//             })
//           ).map((product) => [product.id, product])
//         )
//       : new Map<string, { id: string; stock: number }>();

//     for (const item of order.items) {
//       if (!item.productId) {
//         continue;
//       }

//       const product = productMap.get(item.productId);
//       if (!product) {
//         throw new Error(`ไม่พบข้อมูลสินค้า ${item.productTitle}`);
//       }

//       const weightRecord = item.weightId
//         ? weightMap.get(item.weightId)
//         : undefined;

//       const unitWeight = Number(item.weightValue ?? weightRecord?.weight ?? 0);
//       const quantity = Number(item.quantity);
//       const deduction = unitWeight * quantity;

//       if (deduction > 0) {
//         const remainingStock = Number(product.stock) - deduction;
//         if (remainingStock < 0) {
//           throw new Error(`สต็อกของสินค้า ${item.productTitle} ไม่เพียงพอ`);
//         }

//         await tx.product.update({
//           where: { id: item.productId },
//           data: { stock: remainingStock },
//         });

//         productMap.set(item.productId, {
//           ...product,
//           stock: remainingStock,
//         });
//       }

//       if (item.weightId && weightRecord) {
//         await tx.productWeight.update({
//           where: { id: item.weightId },
//           data: {
//             sold: { increment: quantity },
//           },
//         });
//       }
//     }

//     if (order.payments.length) {
//       await tx.orderPayment.updateMany({
//         where: { orderId: order.id },
//         data: {
//           status: PaymentStatus.APPROVED,
//           paidAt: new Date(),
//         },
//       });
//     }

//     await tx.order.update({
//       where: { id: order.id },
//       data: {
//         status: OrderStatus.PROCESSING,
//         paymentStatus: PaymentStatus.APPROVED,
//       },
//     });
//   });
// }

// export async function rejectOrderPayment(orderId: string) {
//   await db.$transaction(async (tx) => {
//     const order = await tx.order.findUnique({
//       where: { id: orderId },
//       include: {
//         payments: true,
//       },
//     });

//     if (!order) {
//       throw new Error("ไม่พบคำสั่งซื้อที่ต้องการปฏิเสธ");
//     }

//     if (order.paymentStatus === PaymentStatus.APPROVED) {
//       throw new Error("ไม่สามารถปฏิเสธคำสั่งซื้อที่อนุมัติแล้วได้");
//     }

//     if (order.payments.length) {
//       await tx.orderPayment.updateMany({
//         where: { orderId: order.id },
//         data: {
//           status: PaymentStatus.REJECTED,
//           paidAt: null,
//         },
//       });
//     }

//     await tx.order.update({
//       where: { id: order.id },
//       data: {
//         paymentStatus: PaymentStatus.REJECTED,
//         status: OrderStatus.PENDING_PAYMENT,
//       },
//     });
//   });
// }

// export async function updateOrderStatus(
//   orderId: string,
//   nextStatus: OrderStatus,
//   options?: { trackingNumber?: string | null; carrier?: string | null }
// ) {
//   await db.$transaction(async (tx) => {
//     const order = await tx.order.findUnique({
//       where: { id: orderId },
//       select: {
//         status: true,
//         paymentStatus: true,
//       },
//     });

//     if (!order) {
//       throw new Error("ไม่พบคำสั่งซื้อที่ต้องการอัปเดตสถานะ");
//     }

//     if (order.status === nextStatus) {
//       return;
//     }

//     const allowed = ORDER_STATUS_TRANSITIONS[order.status] ?? [];
//     if (!allowed.includes(nextStatus)) {
//       throw new Error("ไม่สามารถเปลี่ยนไปยังสถานะที่เลือกได้");
//     }

//     if (
//       nextStatus === OrderStatus.PROCESSING &&
//       order.paymentStatus !== PaymentStatus.APPROVED
//     ) {
//       throw new Error(
//         "ต้องอนุมัติการชำระเงินก่อนเข้าสู่สถานะกำลังเตรียมจัดส่ง"
//       );
//     }

//     if (
//       (nextStatus === OrderStatus.SHIPPED ||
//         nextStatus === OrderStatus.COMPLETED) &&
//       order.paymentStatus !== PaymentStatus.APPROVED
//     ) {
//       throw new Error("ต้องอนุมัติการชำระเงินก่อนดำเนินการขั้นถัดไป");
//     }

//     const data: Prisma.OrderUpdateInput = { status: nextStatus };

//     if (nextStatus === OrderStatus.SHIPPED) {
//       data.trackingNumber = options?.trackingNumber?.trim() || null;
//       data.carrier = options?.carrier?.trim() || null; // ← เพิ่มตรงนี้
//     }

//     await tx.order.update({
//       where: { id: orderId },
//       data,
//     });
//   });
// }

// export interface DashboardMetrics {
//   totalSales: number;
//   totalOrders: number;
//   pendingVerificationOrders: number;
//   pendingVerificationAmount: number;
//   codDepositsAwaiting: number;
//   totalCustomers: number;
//   totalProducts: number;
//   lowStockCount: number;
// }

// export async function getDashboardMetrics(): Promise<DashboardMetrics> {
//   const now = new Date();
//   const sevenDaysAgo = new Date(now);
//   sevenDaysAgo.setDate(now.getDate() - 7);

//   const [orders, customers, productStocks] = await Promise.all([
//     db.order.findMany({
//       where: {
//         createdAt: {
//           gte: sevenDaysAgo,
//         },
//       },
//       select: {
//         paymentStatus: true,
//         paymentMethod: true,
//         status: true,
//         totalAmount: true,
//         depositAmount: true,
//       },
//     }),
//     db.user.count(),
//     db.product.findMany({
//       select: {
//         id: true,
//         stock: true,
//         lowStock: true,
//       },
//     }),
//   ]);

//   let totalSales = 0;
//   let totalOrders = 0;
//   let pendingVerificationOrders = 0;
//   let pendingVerificationAmount = 0;
//   let codDepositsAwaiting = 0;

//   let lowStockCount = 0;

//   const totalProducts = productStocks.length;

//   for (const product of productStocks) {
//     const stockValue = Number(product.stock);
//     const lowStockValue =
//       product.lowStock != null ? Number(product.lowStock) : null;

//     const isLowStock =
//       stockValue <= 0 || (lowStockValue != null && stockValue <= lowStockValue);

//     if (isLowStock) {
//       lowStockCount += 1;
//     }
//   }

//   for (const order of orders) {
//     totalOrders += 1;

//     if (order.paymentStatus === PaymentStatus.APPROVED) {
//       totalSales += Number(order.totalAmount ?? 0);
//     }

//     if (order.status === OrderStatus.PENDING_VERIFICATION) {
//       pendingVerificationOrders += 1;
//       pendingVerificationAmount += Number(order.totalAmount ?? 0);
//     }

//     if (
//       order.paymentMethod === PaymentMethod.COD &&
//       order.paymentStatus !== PaymentStatus.APPROVED
//     ) {
//       codDepositsAwaiting += Number(order.depositAmount ?? 0);
//     }
//   }

//   return {
//     totalSales,
//     totalOrders,
//     pendingVerificationOrders,
//     pendingVerificationAmount,
//     codDepositsAwaiting,
//     totalCustomers: customers,
//     totalProducts,
//     lowStockCount,
//   };
// }

// export interface DashboardTrendPoint {
//   date: string;
//   totalSales: number;
//   orderCount: number;
// }

// export async function getDashboardTrends(
//   days = 14
// ): Promise<DashboardTrendPoint[]> {
//   const now = new Date();
//   const startDate = new Date(now);
//   startDate.setHours(0, 0, 0, 0);
//   startDate.setDate(now.getDate() - (days - 1));

//   const rows = await db.$queryRaw<
//     Array<{
//       date: Date;
//       totalSales: Prisma.Decimal | null;
//       orderCount: bigint;
//     }>
//   >`
//     SELECT
//       DATE("createdAt") AS date,
//       SUM(
//         CASE
//           WHEN "paymentStatus" = CAST(${PaymentStatus.APPROVED} AS "PaymentStatus")
//           THEN "totalAmount"
//           ELSE 0
//         END
//       ) AS "totalSales",
//       COUNT(*)::bigint AS "orderCount"
//     FROM "order"
//     WHERE "createdAt" >= ${startDate}
//     GROUP BY DATE("createdAt")
//     ORDER BY DATE("createdAt")
//   `;

//   const trendMap = new Map<
//     string,
//     { totalSales: number; orderCount: number }
//   >();
//   for (const row of rows) {
//     const key = row.date.toISOString().slice(0, 10);
//     trendMap.set(key, {
//       totalSales: Number(row.totalSales ?? 0),
//       orderCount: Number(row.orderCount),
//     });
//   }

//   const data: DashboardTrendPoint[] = [];
//   for (let index = 0; index < days; index += 1) {
//     const current = new Date(startDate);
//     current.setDate(startDate.getDate() + index);
//     const key = current.toISOString().slice(0, 10);
//     const trend = trendMap.get(key) ?? { totalSales: 0, orderCount: 0 };

//     data.push({
//       date: key,
//       totalSales: trend.totalSales,
//       orderCount: trend.orderCount,
//     });
//   }

//   return data;
// }

// export interface DashboardRecentOrder {
//   id: string;
//   orderNumber: string;
//   customerName: string;
//   status: OrderStatus;
//   paymentStatus: PaymentStatus;
//   totalAmount: number;
//   createdAt: Date;
// }

// export async function getRecentOrders(
//   limit = 5
// ): Promise<DashboardRecentOrder[]> {
//   const orders = await db.order.findMany({
//     orderBy: { createdAt: "desc" },
//     take: limit,
//     include: {
//       user: {
//         select: {
//           name: true,
//           email: true,
//         },
//       },
//     },
//   });

//   return orders.map((order) => ({
//     id: order.id,
//     orderNumber: order.orderNumber,
//     customerName: order.user?.name ?? order.shippingName,
//     status: order.status,
//     paymentStatus: order.paymentStatus,
//     totalAmount: order.totalAmount,
//     createdAt: order.createdAt,
//   }));
// }

// services/order.service.ts
// import db from "@/lib/db";
// import { nanoid } from "nanoid";
// import {
//   OrderStatus,
//   PaymentMethod,
//   PaymentStatus,
//   Prisma,
// } from "@/generated/prisma";
// import { OrderDetailDTO, OrderItemDTO, OrderPaymentDTO } from "@/types/order";
// import {
//   normalizePagination,
//   createPaginationMeta,
//   ADMIN_DEFAULT_PAGE_SIZE,
//   PaginationMeta,
// } from "@/lib/pagination";

// type OrderWithRelations = Prisma.OrderGetPayload<{
//   include: {
//     items: true;
//     payments: true;
//   };
// }>;

// interface CreateOrderInput {
//   userId: string;
//   addressId: string;
//   paymentMethod: PaymentMethod;
//   paymentStatus: PaymentStatus;
//   subtotal: number;
//   shippingFee: number;
//   depositAmount: number;
//   totalAmount: number;
//   requiresCodDeposit: boolean;
//   shippingName: string;
//   shippingPhone: string;
//   shippingLine1: string;
//   shippingLine2?: string | null;
//   shippingProvince: string;
//   shippingDistrict: string;
//   shippingSubdistrict: string;
//   shippingPostalCode: string;
//   notes?: string | null;
//   items: Array<{
//     productId: string | null;
//     weightId: string | null;
//     productTitle: string;
//     productSku: string | null;
//     weightValue: number | null;
//     unitPrice: number;
//     basePrice: number | null;
//     quantity: number;
//     subtotal: number;
//     codAvailable: boolean;
//   }>;
//   payments: Array<{
//     method: PaymentMethod;
//     amount: number;
//     slipUrl?: string | null;
//     slipFileId?: string | null;
//     status?: PaymentStatus;
//     paidAt?: Date | null;
//   }>;
// }

// /**
//  * Minimal sanitizer: strip HTML tags from strings.
//  * Replace/extend with DOMPurify or similar if you need stronger sanitization.
//  */
// function stripTags(input?: string | null): string | null {
//   if (input == null) return null;
//   return input.replace(/<[^>]*>?/gm, "");
// }

// function mapOrderDetail(order: OrderWithRelations): OrderDetailDTO {
//   const items: OrderItemDTO[] = order.items.map((item) => ({
//     id: item.id,
//     productId: item.productId,
//     weightId: item.weightId,
//     productTitle: item.productTitle,
//     productSku: item.productSku,
//     weightValue: item.weightValue,
//     unitPrice: item.unitPrice,
//     basePrice: item.basePrice,
//     quantity: item.quantity,
//     subtotal: item.subtotal,
//     codAvailable: item.codAvailable,
//     createdAt: item.createdAt,
//     updatedAt: item.updatedAt,
//   }));

//   const payments: OrderPaymentDTO[] = order.payments.map((payment) => ({
//     id: payment.id,
//     method: payment.method,
//     amount: payment.amount,
//     slipUrl: payment.slipUrl,
//     slipFileId: payment.slipFileId,
//     status: payment.status,
//     paidAt: payment.paidAt,
//     createdAt: payment.createdAt,
//     updatedAt: payment.updatedAt,
//   }));

//   return {
//     id: order.id,
//     orderNumber: order.orderNumber,
//     status: order.status,
//     paymentStatus: order.paymentStatus,
//     paymentMethod: order.paymentMethod,
//     subtotal: order.subtotal,
//     shippingFee: order.shippingFee,
//     depositAmount: order.depositAmount,
//     totalAmount: order.totalAmount,
//     requiresCodDeposit: order.requiresCodDeposit,
//     shippingName: order.shippingName,
//     shippingPhone: order.shippingPhone,
//     shippingLine1: order.shippingLine1,
//     shippingLine2: order.shippingLine2,
//     shippingProvince: order.shippingProvince,
//     shippingDistrict: order.shippingDistrict,
//     shippingSubdistrict: order.shippingSubdistrict,
//     shippingPostalCode: order.shippingPostalCode,
//     trackingNumber: order.trackingNumber,
//     carrier: order.carrier, // ← เพิ่มตรงนี้
//     notes: order.notes,
//     createdAt: order.createdAt,
//     updatedAt: order.updatedAt,
//     items,
//     payments,
//   };
// }

// /**
//  * createOrder
//  * - Basic validation + sanitization
//  * - Generate safer orderNumber via nanoid
//  * - Use transaction to create order, items, payments
//  *
//  * Signature unchanged.
//  */
// export async function createOrder(data: CreateOrderInput) {
//   // Basic validations (fail fast)
//   if (!data || typeof data !== "object") {
//     throw new Error("Invalid payload");
//   }

//   if (!Array.isArray(data.items) || data.items.length === 0) {
//     throw new Error("Order must contain at least one item");
//   }

//   // numeric fields must be numbers and non-negative
//   const numericChecks: Array<[string, number]> = [
//     ["subtotal", data.subtotal ?? NaN],
//     ["shippingFee", data.shippingFee ?? NaN],
//     ["depositAmount", data.depositAmount ?? NaN],
//     ["totalAmount", data.totalAmount ?? NaN],
//   ];
//   for (const [name, value] of numericChecks) {
//     if (typeof value !== "number" || Number.isNaN(value) || value < 0) {
//       throw new Error(`Invalid numeric field: ${name}`);
//     }
//   }

//   // item-level checks
//   for (const item of data.items) {
//     if (typeof item.quantity !== "number" || item.quantity <= 0) {
//       throw new Error("Invalid item quantity");
//     }
//     if (typeof item.unitPrice !== "number" || item.unitPrice < 0) {
//       throw new Error("Invalid item unitPrice");
//     }
//     if (typeof item.subtotal !== "number" || item.subtotal < 0) {
//       throw new Error("Invalid item subtotal");
//     }
//   }

//   // Sanitization for text fields (preserve Thai strings where present)
//   const sanitizedItems = data.items.map((item) => ({
//     ...item,
//     productTitle: stripTags(item.productTitle) ?? item.productTitle,
//     productSku: stripTags(item.productSku ?? null) ?? null,
//     // keep weightValue but do not trust it later for stock deduction
//     weightValue: item.weightValue ?? null,
//   }));

//   const sanitizedPayload = {
//     ...data,
//     shippingName: stripTags(data.shippingName) ?? data.shippingName,
//     shippingPhone: stripTags(data.shippingPhone) ?? data.shippingPhone,
//     shippingLine1: stripTags(data.shippingLine1) ?? data.shippingLine1,
//     shippingLine2: stripTags(data.shippingLine2 ?? null) ?? null,
//     shippingProvince: stripTags(data.shippingProvince) ?? data.shippingProvince,
//     shippingDistrict: stripTags(data.shippingDistrict) ?? data.shippingDistrict,
//     shippingSubdistrict:
//       stripTags(data.shippingSubdistrict) ?? data.shippingSubdistrict,
//     shippingPostalCode:
//       stripTags(data.shippingPostalCode) ?? data.shippingPostalCode,
//     notes: stripTags(data.notes ?? null) ?? null,
//     items: sanitizedItems,
//     payments: Array.isArray(data.payments) ? data.payments : [],
//   };

//   let orderNumber = `ORD${nanoid(10).toUpperCase()}`;

//   await db.$transaction(async (tx) => {
//     const order = await tx.order.create({
//       data: {
//         orderNumber,
//         userId: sanitizedPayload.userId,
//         addressId: sanitizedPayload.addressId,
//         status: OrderStatus.PENDING_PAYMENT,
//         paymentMethod: sanitizedPayload.paymentMethod,
//         paymentStatus: sanitizedPayload.paymentStatus,
//         subtotal: sanitizedPayload.subtotal,
//         shippingFee: sanitizedPayload.shippingFee,
//         depositAmount: sanitizedPayload.depositAmount,
//         totalAmount: sanitizedPayload.totalAmount,
//         requiresCodDeposit: sanitizedPayload.requiresCodDeposit,
//         shippingName: sanitizedPayload.shippingName,
//         shippingPhone: sanitizedPayload.shippingPhone,
//         shippingLine1: sanitizedPayload.shippingLine1,
//         shippingLine2: sanitizedPayload.shippingLine2 ?? null,
//         shippingProvince: sanitizedPayload.shippingProvince,
//         shippingDistrict: sanitizedPayload.shippingDistrict,
//         shippingSubdistrict: sanitizedPayload.shippingSubdistrict,
//         shippingPostalCode: sanitizedPayload.shippingPostalCode,
//         notes: sanitizedPayload.notes ?? null,
//       },
//     });

//     // If you prefer to derive orderNumber from DB id, you can compute and update here.
//     // Current approach uses nanoid pre-generated orderNumber (safer than predictable IDs).

//     await tx.orderItem.createMany({
//       data: sanitizedPayload.items.map((item) => ({
//         orderId: order.id,
//         productId: item.productId,
//         weightId: item.weightId,
//         productTitle: item.productTitle,
//         productSku: item.productSku,
//         weightValue: item.weightValue,
//         unitPrice: item.unitPrice,
//         basePrice: item.basePrice,
//         quantity: item.quantity,
//         subtotal: item.subtotal,
//         codAvailable: item.codAvailable,
//       })),
//     });

//     // create payments sequentially within transaction
//     for (const payment of sanitizedPayload.payments) {
//       await tx.orderPayment.create({
//         data: {
//           orderId: order.id,
//           method: payment.method,
//           amount: payment.amount,
//           slipUrl: payment.slipUrl ?? null,
//           slipFileId: payment.slipFileId ?? null,
//           status: payment.status ?? PaymentStatus.PENDING,
//           paidAt: payment.paidAt ?? null,
//         },
//       });
//     }
//   });

//   return orderNumber;
// }

// export async function listOrdersByUser(
//   userId: string
// ): Promise<OrderDetailDTO[]> {
//   const orders = await db.order.findMany({
//     where: { userId },
//     orderBy: { createdAt: "desc" },
//     include: {
//       items: {
//         orderBy: { createdAt: "asc" },
//       },
//       payments: {
//         orderBy: { createdAt: "asc" },
//       },
//     },
//   });

//   return orders.map(mapOrderDetail);
// }

// export interface ListOrdersOptions {
//   statuses?: OrderStatus[];
//   search?: string | null;
//   page?: number | string | null;
//   pageSize?: number | string | null;
// }

// export interface ListOrdersResult {
//   items: OrderDetailDTO[];
//   total: number;
//   meta: PaginationMeta;
// }

// export async function listOrders(
//   options: ListOrdersOptions = {}
// ): Promise<ListOrdersResult> {
//   const { statuses, search, page, pageSize } = options;

//   const pagination = normalizePagination(
//     { page, pageSize },
//     { defaultPageSize: ADMIN_DEFAULT_PAGE_SIZE }
//   );

//   const where: Prisma.OrderWhereInput = {
//     ...(statuses && statuses.length ? { status: { in: statuses } } : {}),
//     ...(search
//       ? {
//           orderNumber: {
//             contains: search.trim(),
//             mode: "insensitive",
//           },
//         }
//       : {}),
//   };

//   const [orders, total] = await db.$transaction([
//     db.order.findMany({
//       where,
//       orderBy: { createdAt: "desc" },
//       include: {
//         items: {
//           orderBy: { createdAt: "asc" },
//         },
//         payments: {
//           orderBy: { createdAt: "asc" },
//         },
//       },
//       skip: pagination.skip,
//       take: pagination.take,
//     }),
//     db.order.count({ where }),
//   ]);

//   const meta = createPaginationMeta(total, {
//     page: pagination.page,
//     pageSize: pagination.pageSize,
//   });

//   return { items: orders.map(mapOrderDetail), total, meta };
// }

// export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
//   [OrderStatus.PENDING_PAYMENT]: [
//     OrderStatus.PENDING_VERIFICATION,
//     OrderStatus.PROCESSING,
//     OrderStatus.CANCELLED,
//   ],
//   [OrderStatus.PENDING_VERIFICATION]: [
//     OrderStatus.PROCESSING,
//     OrderStatus.CANCELLED,
//   ],
//   [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
//   [OrderStatus.SHIPPED]: [OrderStatus.COMPLETED],
//   [OrderStatus.COMPLETED]: [],
//   [OrderStatus.CANCELLED]: [],
// };

// /**
//  * approveOrderPayment
//  * - Uses server-side weight (productWeight) first; falls back to stored item.weightValue only if DB lacks weight record.
//  * - Keeps Thai error messages as in original.
//  */
// export async function approveOrderPayment(orderId: string) {
//   await db.$transaction(async (tx) => {
//     const order = await tx.order.findUnique({
//       where: { id: orderId },
//       include: {
//         items: true,
//         payments: true,
//       },
//     });

//     if (!order) {
//       throw new Error("ไม่พบคำสั่งซื้อที่ต้องการอนุมัติ");
//     }

//     if (order.paymentStatus === PaymentStatus.APPROVED) {
//       return;
//     }

//     if (
//       order.status !== OrderStatus.PENDING_PAYMENT &&
//       order.status !== OrderStatus.PENDING_VERIFICATION
//     ) {
//       throw new Error("ไม่สามารถอนุมัติการชำระเงินสำหรับสถานะปัจจุบันได้");
//     }

//     if (!order.items.length) {
//       throw new Error("คำสั่งซื้อไม่มีสินค้า จึงไม่สามารถอนุมัติได้");
//     }

//     const weightIds = order.items
//       .map((item) => item.weightId)
//       .filter(Boolean) as string[];
//     const productIds = order.items
//       .map((item) => item.productId)
//       .filter(Boolean) as string[];

//     const weightMap = weightIds.length
//       ? new Map(
//           (
//             await tx.productWeight.findMany({
//               where: { id: { in: weightIds } },
//               select: { id: true, weight: true, productId: true },
//             })
//           ).map((weight) => [weight.id, weight])
//         )
//       : new Map<string, { id: string; weight: number; productId: string }>();

//     const productMap = productIds.length
//       ? new Map(
//           (
//             await tx.product.findMany({
//               where: { id: { in: productIds } },
//               select: { id: true, stock: true },
//             })
//           ).map((product) => [product.id, product])
//         )
//       : new Map<string, { id: string; stock: number }>();

//     for (const item of order.items) {
//       if (!item.productId) {
//         continue;
//       }

//       const product = productMap.get(item.productId);
//       if (!product) {
//         throw new Error(`ไม่พบข้อมูลสินค้า ${item.productTitle}`);
//       }

//       const weightRecord = item.weightId
//         ? weightMap.get(item.weightId)
//         : undefined;

//       // Use server-side weight first to prevent client manipulation
//       const unitWeight = Number(weightRecord?.weight ?? item.weightValue ?? 0);
//       const quantity = Number(item.quantity);
//       const deduction = unitWeight * quantity;

//       if (deduction > 0) {
//         const remainingStock = Number(product.stock) - deduction;
//         if (remainingStock < 0) {
//           throw new Error(`สต็อกของสินค้า ${item.productTitle} ไม่เพียงพอ`);
//         }

//         await tx.product.update({
//           where: { id: item.productId },
//           data: { stock: remainingStock },
//         });

//         productMap.set(item.productId, {
//           ...product,
//           stock: remainingStock,
//         });
//       }

//       if (item.weightId && weightRecord) {
//         await tx.productWeight.update({
//           where: { id: item.weightId },
//           data: {
//             sold: { increment: quantity },
//           },
//         });
//       }
//     }

//     if (order.payments.length) {
//       await tx.orderPayment.updateMany({
//         where: { orderId: order.id },
//         data: {
//           status: PaymentStatus.APPROVED,
//           paidAt: new Date(),
//         },
//       });
//     }

//     await tx.order.update({
//       where: { id: order.id },
//       data: {
//         status: OrderStatus.PROCESSING,
//         paymentStatus: PaymentStatus.APPROVED,
//       },
//     });
//   });
// }

// export async function rejectOrderPayment(orderId: string) {
//   await db.$transaction(async (tx) => {
//     const order = await tx.order.findUnique({
//       where: { id: orderId },
//       include: {
//         payments: true,
//       },
//     });

//     if (!order) {
//       throw new Error("ไม่พบคำสั่งซื้อที่ต้องการปฏิเสธ");
//     }

//     if (order.paymentStatus === PaymentStatus.APPROVED) {
//       throw new Error("ไม่สามารถปฏิเสธคำสั่งซื้อที่อนุมัติแล้วได้");
//     }

//     if (order.payments.length) {
//       await tx.orderPayment.updateMany({
//         where: { orderId: order.id },
//         data: {
//           status: PaymentStatus.REJECTED,
//           paidAt: null,
//         },
//       });
//     }

//     await tx.order.update({
//       where: { id: order.id },
//       data: {
//         paymentStatus: PaymentStatus.REJECTED,
//         status: OrderStatus.PENDING_PAYMENT,
//       },
//     });
//   });
// }

// export async function updateOrderStatus(
//   orderId: string,
//   nextStatus: OrderStatus,
//   options?: { trackingNumber?: string | null; carrier?: string | null }
// ) {
//   await db.$transaction(async (tx) => {
//     const order = await tx.order.findUnique({
//       where: { id: orderId },
//       select: {
//         status: true,
//         paymentStatus: true,
//       },
//     });

//     if (!order) {
//       throw new Error("ไม่พบคำสั่งซื้อที่ต้องการอัปเดตสถานะ");
//     }

//     if (order.status === nextStatus) {
//       return;
//     }

//     const allowed = ORDER_STATUS_TRANSITIONS[order.status] ?? [];
//     if (!allowed.includes(nextStatus)) {
//       throw new Error("ไม่สามารถเปลี่ยนไปยังสถานะที่เลือกได้");
//     }

//     if (
//       nextStatus === OrderStatus.PROCESSING &&
//       order.paymentStatus !== PaymentStatus.APPROVED
//     ) {
//       throw new Error(
//         "ต้องอนุมัติการชำระเงินก่อนเข้าสู่สถานะกำลังเตรียมจัดส่ง"
//       );
//     }

//     if (
//       (nextStatus === OrderStatus.SHIPPED ||
//         nextStatus === OrderStatus.COMPLETED) &&
//       order.paymentStatus !== PaymentStatus.APPROVED
//     ) {
//       throw new Error("ต้องอนุมัติการชำระเงินก่อนดำเนินการขั้นถัดไป");
//     }

//     const data: Prisma.OrderUpdateInput = { status: nextStatus };

//     if (nextStatus === OrderStatus.SHIPPED) {
//       data.trackingNumber = options?.trackingNumber?.trim() || null;
//       data.carrier = options?.carrier?.trim() || null; // ← เพิ่มตรงนี้
//     }

//     await tx.order.update({
//       where: { id: orderId },
//       data,
//     });
//   });
// }

// export interface DashboardMetrics {
//   totalSales: number;
//   totalOrders: number;
//   pendingVerificationOrders: number;
//   pendingVerificationAmount: number;
//   codDepositsAwaiting: number;
//   totalCustomers: number;
//   totalProducts: number;
//   lowStockCount: number;
// }

// export async function getDashboardMetrics(): Promise<DashboardMetrics> {
//   const now = new Date();
//   const sevenDaysAgo = new Date(now);
//   sevenDaysAgo.setDate(now.getDate() - 7);

//   const [orders, customers, productStocks] = await Promise.all([
//     db.order.findMany({
//       where: {
//         createdAt: {
//           gte: sevenDaysAgo,
//         },
//       },
//       select: {
//         paymentStatus: true,
//         paymentMethod: true,
//         status: true,
//         totalAmount: true,
//         depositAmount: true,
//       },
//     }),
//     db.user.count(),
//     db.product.findMany({
//       select: {
//         id: true,
//         stock: true,
//         lowStock: true,
//       },
//     }),
//   ]);

//   let totalSales = 0;
//   let totalOrders = 0;
//   let pendingVerificationOrders = 0;
//   let pendingVerificationAmount = 0;
//   let codDepositsAwaiting = 0;

//   let lowStockCount = 0;

//   const totalProducts = productStocks.length;

//   for (const product of productStocks) {
//     const stockValue = Number(product.stock);
//     const lowStockValue =
//       product.lowStock != null ? Number(product.lowStock) : null;

//     const isLowStock =
//       stockValue <= 0 || (lowStockValue != null && stockValue <= lowStockValue);

//     if (isLowStock) {
//       lowStockCount += 1;
//     }
//   }

//   for (const order of orders) {
//     totalOrders += 1;

//     if (order.paymentStatus === PaymentStatus.APPROVED) {
//       totalSales += Number(order.totalAmount ?? 0);
//     }

//     if (order.status === OrderStatus.PENDING_VERIFICATION) {
//       pendingVerificationOrders += 1;
//       pendingVerificationAmount += Number(order.totalAmount ?? 0);
//     }

//     if (
//       order.paymentMethod === PaymentMethod.COD &&
//       order.paymentStatus !== PaymentStatus.APPROVED
//     ) {
//       codDepositsAwaiting += Number(order.depositAmount ?? 0);
//     }
//   }

//   return {
//     totalSales,
//     totalOrders,
//     pendingVerificationOrders,
//     pendingVerificationAmount,
//     codDepositsAwaiting,
//     totalCustomers: customers,
//     totalProducts,
//     lowStockCount,
//   };
// }

// export interface DashboardTrendPoint {
//   date: string;
//   totalSales: number;
//   orderCount: number;
// }

// export async function getDashboardTrends(
//   days = 14
// ): Promise<DashboardTrendPoint[]> {
//   const now = new Date();
//   const startDate = new Date(now);
//   startDate.setHours(0, 0, 0, 0);
//   startDate.setDate(now.getDate() - (days - 1));

//   const rows = await db.$queryRaw<
//     Array<{
//       date: Date;
//       totalSales: Prisma.Decimal | null;
//       orderCount: bigint;
//     }>
//   >`
//     SELECT
//       DATE("createdAt") AS date,
//       SUM(
//         CASE
//           WHEN "paymentStatus" = CAST(${PaymentStatus.APPROVED} AS "PaymentStatus")
//           THEN "totalAmount"
//           ELSE 0
//         END
//       ) AS "totalSales",
//       COUNT(*)::bigint AS "orderCount"
//     FROM "order"
//     WHERE "createdAt" >= ${startDate}
//     GROUP BY DATE("createdAt")
//     ORDER BY DATE("createdAt")
//   `;

//   const trendMap = new Map<
//     string,
//     { totalSales: number; orderCount: number }
//   >();
//   for (const row of rows) {
//     const key = row.date.toISOString().slice(0, 10);
//     trendMap.set(key, {
//       totalSales: Number(row.totalSales ?? 0),
//       orderCount: Number(row.orderCount),
//     });
//   }

//   const data: DashboardTrendPoint[] = [];
//   for (let index = 0; index < days; index += 1) {
//     const current = new Date(startDate);
//     current.setDate(startDate.getDate() + index);
//     const key = current.toISOString().slice(0, 10);
//     const trend = trendMap.get(key) ?? { totalSales: 0, orderCount: 0 };

//     data.push({
//       date: key,
//       totalSales: trend.totalSales,
//       orderCount: trend.orderCount,
//     });
//   }

//   return data;
// }

// export interface DashboardRecentOrder {
//   id: string;
//   orderNumber: string;
//   customerName: string;
//   status: OrderStatus;
//   paymentStatus: PaymentStatus;
//   totalAmount: number;
//   createdAt: Date;
// }

// export async function getRecentOrders(
//   limit = 5
// ): Promise<DashboardRecentOrder[]> {
//   const orders = await db.order.findMany({
//     orderBy: { createdAt: "desc" },
//     take: limit,
//     include: {
//       user: {
//         select: {
//           name: true,
//           email: true,
//         },
//       },
//     },
//   });

//   return orders.map((order) => ({
//     id: order.id,
//     orderNumber: order.orderNumber,
//     customerName: order.user?.name ?? order.shippingName,
//     status: order.status,
//     paymentStatus: order.paymentStatus,
//     totalAmount: order.totalAmount,
//     createdAt: order.createdAt,
//   }));
// }

// import db from "@/lib/db";
// import { nanoid } from "nanoid";
// import sanitizeHtml from "sanitize-html";
// import {
//   OrderStatus,
//   PaymentMethod,
//   PaymentStatus,
//   Prisma,
// } from "@/generated/prisma";
// import { OrderDetailDTO, OrderItemDTO, OrderPaymentDTO } from "@/types/order";
// import {
//   normalizePagination,
//   createPaginationMeta,
//   ADMIN_DEFAULT_PAGE_SIZE,
//   PaginationMeta,
// } from "@/lib/pagination";

// /**
//  * Improved but minimal changes:
//  * - keep function names & signatures
//  * - strengthen validations and sanitization
//  * - avoid passing `null` into Prisma filters
//  */

// /* -------------------------
//    Helper: stripTags (improved)
//    ------------------------- */
// function stripTags(input?: string | null): string | null {
//   if (input == null) return null;
//   const out = sanitizeHtml(input, {
//     allowedTags: [],
//     allowedAttributes: {},
//     textFilter: (text) => text.trim(),
//   });
//   return out === "" ? null : out;
// }

// /* -------------------------
//    Mapper
//    ------------------------- */
// type OrderWithRelations = Prisma.OrderGetPayload<{
//   include: {
//     items: true;
//     payments: true;
//   };
// }>;

// function mapOrderDetail(order: OrderWithRelations): OrderDetailDTO {
//   const items: OrderItemDTO[] = order.items.map((item) => ({
//     id: item.id,
//     productId: item.productId,
//     weightId: item.weightId,
//     productTitle: item.productTitle,
//     productSku: item.productSku,
//     weightValue: item.weightValue,
//     unitPrice: item.unitPrice,
//     basePrice: item.basePrice,
//     quantity: item.quantity,
//     subtotal: item.subtotal,
//     codAvailable: item.codAvailable,
//     createdAt: item.createdAt,
//     updatedAt: item.updatedAt,
//   }));

//   const payments: OrderPaymentDTO[] = order.payments.map((payment) => ({
//     id: payment.id,
//     method: payment.method,
//     amount: payment.amount,
//     slipUrl: payment.slipUrl,
//     slipFileId: payment.slipFileId,
//     status: payment.status,
//     paidAt: payment.paidAt,
//     createdAt: payment.createdAt,
//     updatedAt: payment.updatedAt,
//   }));

//   return {
//     id: order.id,
//     orderNumber: order.orderNumber,
//     status: order.status,
//     paymentStatus: order.paymentStatus,
//     paymentMethod: order.paymentMethod,
//     subtotal: order.subtotal,
//     shippingFee: order.shippingFee,
//     depositAmount: order.depositAmount,
//     totalAmount: order.totalAmount,
//     requiresCodDeposit: order.requiresCodDeposit,
//     shippingName: order.shippingName,
//     shippingPhone: order.shippingPhone,
//     shippingLine1: order.shippingLine1,
//     shippingLine2: order.shippingLine2,
//     shippingProvince: order.shippingProvince,
//     shippingDistrict: order.shippingDistrict,
//     shippingSubdistrict: order.shippingSubdistrict,
//     shippingPostalCode: order.shippingPostalCode,
//     trackingNumber: order.trackingNumber,
//     carrier: order.carrier,
//     notes: order.notes,
//     createdAt: order.createdAt,
//     updatedAt: order.updatedAt,
//     items,
//     payments,
//   };
// }

// /* -------------------------
//    createOrder
//    ------------------------- */

// interface CreateOrderInput {
//   userId: string;
//   addressId: string;
//   paymentMethod: PaymentMethod;
//   paymentStatus: PaymentStatus;
//   subtotal: number;
//   shippingFee: number;
//   depositAmount: number;
//   totalAmount: number;
//   requiresCodDeposit: boolean;
//   shippingName: string;
//   shippingPhone: string;
//   shippingLine1: string;
//   shippingLine2?: string | null;
//   shippingProvince: string;
//   shippingDistrict: string;
//   shippingSubdistrict: string;
//   shippingPostalCode: string;
//   notes?: string | null;
//   items: Array<{
//     productId: string | null;
//     weightId: string | null;
//     productTitle: string;
//     productSku: string | null;
//     weightValue: number | null;
//     unitPrice: number;
//     basePrice: number | null;
//     quantity: number;
//     subtotal: number;
//     codAvailable: boolean;
//   }>;
//   payments: Array<{
//     method: PaymentMethod;
//     amount: number;
//     slipUrl?: string | null;
//     slipFileId?: string | null;
//     status?: PaymentStatus;
//     paidAt?: Date | null;
//   }>;
// }

// function isNonEmptyString(v?: unknown): v is string {
//   return typeof v === "string" && v.trim() !== "";
// }

// export async function createOrder(data: CreateOrderInput) {
//   if (!data || typeof data !== "object") {
//     throw new Error("Invalid payload");
//   }

//   if (!Array.isArray(data.items) || data.items.length === 0) {
//     throw new Error("Order must contain at least one item");
//   }

//   // numeric fields must be numbers and non-negative
//   const numericChecks: Array<[string, number]> = [
//     ["subtotal", data.subtotal ?? NaN],
//     ["shippingFee", data.shippingFee ?? NaN],
//     ["depositAmount", data.depositAmount ?? NaN],
//     ["totalAmount", data.totalAmount ?? NaN],
//   ];
//   for (const [name, value] of numericChecks) {
//     if (typeof value !== "number" || Number.isNaN(value) || value < 0) {
//       throw new Error(`Invalid numeric field: ${name}`);
//     }
//   }

//   // item-level checks & sanitize
//   const sanitizedItems = data.items.map((item, idx) => {
//     if (typeof item.quantity !== "number" || item.quantity <= 0) {
//       throw new Error(`Invalid item quantity at index ${idx}`);
//     }
//     if (typeof item.unitPrice !== "number" || item.unitPrice < 0) {
//       throw new Error(`Invalid item unitPrice at index ${idx}`);
//     }
//     if (typeof item.subtotal !== "number" || item.subtotal < 0) {
//       throw new Error(`Invalid item subtotal at index ${idx}`);
//     }

//     return {
//       ...item,
//       productTitle: stripTags(item.productTitle) ?? item.productTitle,
//       productSku: stripTags(item.productSku ?? null) ?? null,
//       weightValue:
//         typeof item.weightValue === "number" ? item.weightValue : null,
//     };
//   });

//   // sanitize shipping fields
//   const sanitizedPayload = {
//     ...data,
//     shippingName: stripTags(data.shippingName) ?? data.shippingName,
//     shippingPhone: stripTags(data.shippingPhone) ?? data.shippingPhone,
//     shippingLine1: stripTags(data.shippingLine1) ?? data.shippingLine1,
//     shippingLine2: stripTags(data.shippingLine2 ?? null) ?? null,
//     shippingProvince: stripTags(data.shippingProvince) ?? data.shippingProvince,
//     shippingDistrict: stripTags(data.shippingDistrict) ?? data.shippingDistrict,
//     shippingSubdistrict:
//       stripTags(data.shippingSubdistrict) ?? data.shippingSubdistrict,
//     shippingPostalCode:
//       stripTags(data.shippingPostalCode) ?? data.shippingPostalCode,
//     notes: stripTags(data.notes ?? null) ?? null,
//     items: sanitizedItems,
//     payments: Array.isArray(data.payments) ? data.payments : [],
//   };

//   // Server-side subtotal check (prevent client tampering)
//   const computedSubtotal = sanitizedItems.reduce(
//     (sum, it) => sum + Number(it.subtotal ?? 0),
//     0
//   );
//   // rounding-safe comparison (2 decimals)
//   const clientSubtotal = Number(
//     Number(sanitizedPayload.subtotal ?? 0).toFixed(2)
//   );
//   if (Number(computedSubtotal.toFixed(2)) !== clientSubtotal) {
//     throw new Error("Subtotal mismatch");
//   }

//   // Basic total rule (subtotal + shippingFee)
//   const computedTotal = Number(
//     (computedSubtotal + Number(sanitizedPayload.shippingFee ?? 0)).toFixed(2)
//   );
//   const clientTotal = Number(
//     Number(sanitizedPayload.totalAmount ?? 0).toFixed(2)
//   );
//   if (clientTotal !== computedTotal) {
//     throw new Error("Total amount mismatch");
//   }

//   // payments sum should not exceed total (allow equal)
//   const payments = Array.isArray(sanitizedPayload.payments)
//     ? sanitizedPayload.payments
//     : [];
//   const paymentsSum = payments.reduce((s, p) => s + Number(p?.amount ?? 0), 0);
//   if (paymentsSum > clientTotal + 0.0001) {
//     throw new Error("Payments sum exceeds total amount");
//   }

//   const orderNumber = `ORD${nanoid(10).toUpperCase()}`;

//   await db.$transaction(async (tx) => {
//     const order = await tx.order.create({
//       data: {
//         orderNumber,
//         userId: sanitizedPayload.userId,
//         addressId: sanitizedPayload.addressId,
//         status: OrderStatus.PENDING_PAYMENT,
//         paymentMethod: sanitizedPayload.paymentMethod,
//         paymentStatus: sanitizedPayload.paymentStatus,
//         subtotal: sanitizedPayload.subtotal,
//         shippingFee: sanitizedPayload.shippingFee,
//         depositAmount: sanitizedPayload.depositAmount,
//         totalAmount: sanitizedPayload.totalAmount,
//         requiresCodDeposit: sanitizedPayload.requiresCodDeposit,
//         shippingName: sanitizedPayload.shippingName,
//         shippingPhone: sanitizedPayload.shippingPhone,
//         shippingLine1: sanitizedPayload.shippingLine1,
//         shippingLine2: sanitizedPayload.shippingLine2 ?? null,
//         shippingProvince: sanitizedPayload.shippingProvince,
//         shippingDistrict: sanitizedPayload.shippingDistrict,
//         shippingSubdistrict: sanitizedPayload.shippingSubdistrict,
//         shippingPostalCode: sanitizedPayload.shippingPostalCode,
//         notes: sanitizedPayload.notes ?? null,
//       },
//     });

//     await tx.orderItem.createMany({
//       data: sanitizedPayload.items.map((item) => ({
//         orderId: order.id,
//         productId: item.productId,
//         weightId: item.weightId,
//         productTitle: item.productTitle,
//         productSku: item.productSku,
//         weightValue: item.weightValue,
//         unitPrice: item.unitPrice,
//         basePrice: item.basePrice,
//         quantity: item.quantity,
//         subtotal: item.subtotal,
//         codAvailable: item.codAvailable,
//       })),
//     });

//     for (const payment of sanitizedPayload.payments) {
//       await tx.orderPayment.create({
//         data: {
//           orderId: order.id,
//           method: payment.method,
//           amount: payment.amount,
//           slipUrl: payment.slipUrl ?? null,
//           slipFileId: payment.slipFileId ?? null,
//           status: payment.status ?? PaymentStatus.PENDING,
//           paidAt: payment.paidAt ?? null,
//         },
//       });
//     }
//   });

//   return orderNumber;
// }

// /* -------------------------
//    listOrdersByUser
//    ------------------------- */
// export async function listOrdersByUser(
//   userId: string
// ): Promise<OrderDetailDTO[]> {
//   if (!isNonEmptyString(userId)) {
//     throw new Error("Invalid userId");
//   }

//   const orders = await db.order.findMany({
//     where: { userId },
//     orderBy: { createdAt: "desc" },
//     include: {
//       items: {
//         orderBy: { createdAt: "asc" },
//       },
//       payments: {
//         orderBy: { createdAt: "asc" },
//       },
//     },
//   });

//   return orders.map(mapOrderDetail);
// }

// /* -------------------------
//    listOrders (safe search)
//    ------------------------- */

// export interface ListOrdersOptions {
//   statuses?: OrderStatus[];
//   search?: string | null;
//   page?: number | string | null;
//   pageSize?: number | string | null;
// }

// export interface ListOrdersResult {
//   items: OrderDetailDTO[];
//   total: number;
//   meta: PaginationMeta;
// }

// export async function listOrders(
//   options: ListOrdersOptions = {}
// ): Promise<ListOrdersResult> {
//   const { statuses, search, page, pageSize } = options;

//   const pagination = normalizePagination(
//     { page, pageSize },
//     { defaultPageSize: ADMIN_DEFAULT_PAGE_SIZE }
//   );

//   const searchTerm =
//     typeof search === "string" && search.trim() !== ""
//       ? stripTags(search) ?? search.trim()
//       : undefined;

//   const where: Prisma.OrderWhereInput = {
//     ...(statuses && statuses.length ? { status: { in: statuses } } : {}),
//     ...(searchTerm
//       ? {
//           orderNumber: {
//             contains: searchTerm,
//             mode: "insensitive",
//           },
//         }
//       : {}),
//   };

//   const [orders, total] = await db.$transaction([
//     db.order.findMany({
//       where,
//       orderBy: { createdAt: "desc" },
//       include: {
//         items: {
//           orderBy: { createdAt: "asc" },
//         },
//         payments: {
//           orderBy: { createdAt: "asc" },
//         },
//       },
//       skip: pagination.skip,
//       take: pagination.take,
//     }),
//     db.order.count({ where }),
//   ]);

//   const meta = createPaginationMeta(total, {
//     page: pagination.page,
//     pageSize: pagination.pageSize,
//   });

//   return { items: orders.map(mapOrderDetail), total, meta };
// }

// /* -------------------------
//    ORDER_STATUS_TRANSITIONS
//    ------------------------- */

// export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
//   [OrderStatus.PENDING_PAYMENT]: [
//     OrderStatus.PENDING_VERIFICATION,
//     OrderStatus.PROCESSING,
//     OrderStatus.CANCELLED,
//   ],
//   [OrderStatus.PENDING_VERIFICATION]: [
//     OrderStatus.PROCESSING,
//     OrderStatus.CANCELLED,
//   ],
//   [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
//   [OrderStatus.SHIPPED]: [OrderStatus.COMPLETED],
//   [OrderStatus.COMPLETED]: [],
//   [OrderStatus.CANCELLED]: [],
// };

// /* -------------------------
//    approveOrderPayment (atomic stock updates)
//    ------------------------- */

// export async function approveOrderPayment(orderId: string) {
//   if (!isNonEmptyString(orderId)) throw new Error("Invalid orderId");

//   await db.$transaction(async (tx) => {
//     const order = await tx.order.findUnique({
//       where: { id: orderId },
//       include: {
//         items: true,
//         payments: true,
//       },
//     });

//     if (!order) {
//       throw new Error("ไม่พบคำสั่งซื้อที่ต้องการอนุมัติ");
//     }

//     if (order.paymentStatus === PaymentStatus.APPROVED) {
//       return;
//     }

//     if (
//       order.status !== OrderStatus.PENDING_PAYMENT &&
//       order.status !== OrderStatus.PENDING_VERIFICATION
//     ) {
//       throw new Error("ไม่สามารถอนุมัติการชำระเงินสำหรับสถานะปัจจุบันได้");
//     }

//     if (!order.items.length) {
//       throw new Error("คำสั่งซื้อไม่มีสินค้า จึงไม่สามารถอนุมัติได้");
//     }

//     const weightIds = order.items
//       .map((item) => item.weightId)
//       .filter(Boolean) as string[];
//     const productIds = order.items
//       .map((item) => item.productId)
//       .filter(Boolean) as string[];

//     const weightMap = weightIds.length
//       ? new Map(
//           (
//             await tx.productWeight.findMany({
//               where: { id: { in: weightIds } },
//               select: { id: true, weight: true, productId: true },
//             })
//           ).map((w) => [w.id, w])
//         )
//       : new Map<string, { id: string; weight: number; productId: string }>();

//     const productMap = productIds.length
//       ? new Map(
//           (
//             await tx.product.findMany({
//               where: { id: { in: productIds } },
//               select: { id: true, stock: true },
//             })
//           ).map((p) => [p.id, p])
//         )
//       : new Map<string, { id: string; stock: number }>();

//     for (const item of order.items) {
//       if (!item.productId) {
//         continue;
//       }

//       const product = productMap.get(item.productId);
//       if (!product) {
//         throw new Error(`ไม่พบข้อมูลสินค้า ${item.productTitle}`);
//       }

//       const weightRecord = item.weightId
//         ? weightMap.get(item.weightId)
//         : undefined;

//       const unitWeight = Number(weightRecord?.weight ?? item.weightValue ?? 0);
//       const quantity = Number(item.quantity);
//       const deduction = unitWeight * quantity;

//       if (deduction > 0) {
//         const updated = await tx.product.updateMany({
//           where: { id: item.productId, stock: { gte: deduction } },
//           data: { stock: { decrement: deduction } },
//         });

//         if (updated.count === 0) {
//           throw new Error(`สต็อกของสินค้า ${item.productTitle} ไม่เพียงพอ`);
//         }
//       }

//       if (item.weightId && weightRecord) {
//         await tx.productWeight.update({
//           where: { id: item.weightId },
//           data: {
//             sold: { increment: quantity },
//           },
//         });
//       }
//     }

//     if (order.payments.length) {
//       await tx.orderPayment.updateMany({
//         where: { orderId: order.id },
//         data: {
//           status: PaymentStatus.APPROVED,
//           paidAt: new Date(),
//         },
//       });
//     }

//     await tx.order.update({
//       where: { id: order.id },
//       data: {
//         status: OrderStatus.PROCESSING,
//         paymentStatus: PaymentStatus.APPROVED,
//       },
//     });
//   });
// }

// /* -------------------------
//    rejectOrderPayment
//    ------------------------- */

// export async function rejectOrderPayment(orderId: string) {
//   if (!isNonEmptyString(orderId)) throw new Error("Invalid orderId");

//   await db.$transaction(async (tx) => {
//     const order = await tx.order.findUnique({
//       where: { id: orderId },
//       include: {
//         payments: true,
//       },
//     });

//     if (!order) {
//       throw new Error("ไม่พบคำสั่งซื้อที่ต้องการปฏิเสธ");
//     }

//     if (order.paymentStatus === PaymentStatus.APPROVED) {
//       throw new Error("ไม่สามารถปฏิเสธคำสั่งซื้อที่อนุมัติแล้วได้");
//     }

//     if (order.payments.length) {
//       await tx.orderPayment.updateMany({
//         where: { orderId: order.id },
//         data: {
//           status: PaymentStatus.REJECTED,
//           paidAt: null,
//         },
//       });
//     }

//     await tx.order.update({
//       where: { id: order.id },
//       data: {
//         paymentStatus: PaymentStatus.REJECTED,
//         status: OrderStatus.PENDING_PAYMENT,
//       },
//     });
//   });
// }

// /* -------------------------
//    updateOrderStatus
//    ------------------------- */

// export async function updateOrderStatus(
//   orderId: string,
//   nextStatus: OrderStatus,
//   options?: { trackingNumber?: string | null; carrier?: string | null }
// ) {
//   if (!isNonEmptyString(orderId)) throw new Error("Invalid orderId");

//   await db.$transaction(async (tx) => {
//     const order = await tx.order.findUnique({
//       where: { id: orderId },
//       select: {
//         status: true,
//         paymentStatus: true,
//       },
//     });

//     if (!order) {
//       throw new Error("ไม่พบคำสั่งซื้อที่ต้องการอัปเดตสถานะ");
//     }

//     if (order.status === nextStatus) {
//       return;
//     }

//     const allowed = (ORDER_STATUS_TRANSITIONS[order.status] ??
//       []) as OrderStatus[];
//     if (!allowed.includes(nextStatus)) {
//       throw new Error("ไม่สามารถเปลี่ยนไปยังสถานะที่เลือกได้");
//     }

//     if (
//       nextStatus === OrderStatus.PROCESSING &&
//       order.paymentStatus !== PaymentStatus.APPROVED
//     ) {
//       throw new Error(
//         "ต้องอนุมัติการชำระเงินก่อนเข้าสู่สถานะกำลังเตรียมจัดส่ง"
//       );
//     }

//     if (
//       (nextStatus === OrderStatus.SHIPPED ||
//         nextStatus === OrderStatus.COMPLETED) &&
//       order.paymentStatus !== PaymentStatus.APPROVED
//     ) {
//       throw new Error("ต้องอนุมัติการชำระเงินก่อนดำเนินการขั้นถัดไป");
//     }

//     const data: Prisma.OrderUpdateInput = { status: nextStatus };

//     if (nextStatus === OrderStatus.SHIPPED) {
//       data.trackingNumber = stripTags(options?.trackingNumber ?? null) ?? null;
//       data.carrier = stripTags(options?.carrier ?? null) ?? null;
//     }

//     await tx.order.update({
//       where: { id: orderId },
//       data,
//     });
//   });
// }

// /* -------------------------
//    Dashboard metrics & trends
//    ------------------------- */

// export interface DashboardMetrics {
//   totalSales: number;
//   totalOrders: number;
//   pendingVerificationOrders: number;
//   pendingVerificationAmount: number;
//   codDepositsAwaiting: number;
//   totalCustomers: number;
//   totalProducts: number;
//   lowStockCount: number;
// }

// export async function getDashboardMetrics(): Promise<DashboardMetrics> {
//   const now = new Date();
//   const sevenDaysAgo = new Date(now);
//   sevenDaysAgo.setDate(now.getDate() - 7);

//   const [orders, customers, productStocks] = await Promise.all([
//     db.order.findMany({
//       where: {
//         createdAt: {
//           gte: sevenDaysAgo,
//         },
//       },
//       select: {
//         paymentStatus: true,
//         paymentMethod: true,
//         status: true,
//         totalAmount: true,
//         depositAmount: true,
//       },
//     }),
//     db.user.count(),
//     db.product.findMany({
//       select: {
//         id: true,
//         stock: true,
//         lowStock: true,
//       },
//     }),
//   ]);

//   let totalSales = 0;
//   let totalOrders = 0;
//   let pendingVerificationOrders = 0;
//   let pendingVerificationAmount = 0;
//   let codDepositsAwaiting = 0;

//   let lowStockCount = 0;

//   const totalProducts = productStocks.length;

//   for (const product of productStocks) {
//     const stockValue = Number(product.stock);
//     const lowStockValue =
//       product.lowStock != null ? Number(product.lowStock) : null;

//     const isLowStock =
//       stockValue <= 0 || (lowStockValue != null && stockValue <= lowStockValue);

//     if (isLowStock) {
//       lowStockCount += 1;
//     }
//   }

//   for (const order of orders) {
//     totalOrders += 1;

//     if (order.paymentStatus === PaymentStatus.APPROVED) {
//       totalSales += Number(order.totalAmount ?? 0);
//     }

//     if (order.status === OrderStatus.PENDING_VERIFICATION) {
//       pendingVerificationOrders += 1;
//       pendingVerificationAmount += Number(order.totalAmount ?? 0);
//     }

//     if (
//       order.paymentMethod === PaymentMethod.COD &&
//       order.paymentStatus !== PaymentStatus.APPROVED
//     ) {
//       codDepositsAwaiting += Number(order.depositAmount ?? 0);
//     }
//   }

//   return {
//     totalSales,
//     totalOrders,
//     pendingVerificationOrders,
//     pendingVerificationAmount,
//     codDepositsAwaiting,
//     totalCustomers: customers,
//     totalProducts,
//     lowStockCount,
//   };
// }

// export interface DashboardTrendPoint {
//   date: string;
//   totalSales: number;
//   orderCount: number;
// }

// export async function getDashboardTrends(
//   days = 14
// ): Promise<DashboardTrendPoint[]> {
//   const now = new Date();
//   const startDate = new Date(now);
//   startDate.setHours(0, 0, 0, 0);
//   startDate.setDate(now.getDate() - (days - 1));

//   const rows = await db.$queryRaw<
//     Array<{
//       date: Date;
//       totalSales: Prisma.Decimal | null;
//       orderCount: bigint;
//     }>
//   >`
//     SELECT
//       DATE("createdAt") AS date,
//       SUM(
//         CASE
//           WHEN "paymentStatus" = CAST(${PaymentStatus.APPROVED} AS "PaymentStatus")
//           THEN "totalAmount"
//           ELSE 0
//         END
//       ) AS "totalSales",
//       COUNT(*)::bigint AS "orderCount"
//     FROM "order"
//     WHERE "createdAt" >= ${startDate}
//     GROUP BY DATE("createdAt")
//     ORDER BY DATE("createdAt")
//   `;

//   const trendMap = new Map<
//     string,
//     { totalSales: number; orderCount: number }
//   >();
//   for (const row of rows) {
//     const key = row.date.toISOString().slice(0, 10);
//     trendMap.set(key, {
//       totalSales: Number(row.totalSales ?? 0),
//       orderCount: Number(row.orderCount),
//     });
//   }

//   const data: DashboardTrendPoint[] = [];
//   for (let index = 0; index < days; index += 1) {
//     const current = new Date(startDate);
//     current.setDate(startDate.getDate() + index);
//     const key = current.toISOString().slice(0, 10);
//     const trend = trendMap.get(key) ?? { totalSales: 0, orderCount: 0 };

//     data.push({
//       date: key,
//       totalSales: trend.totalSales,
//       orderCount: trend.orderCount,
//     });
//   }

//   return data;
// }

// export interface DashboardRecentOrder {
//   id: string;
//   orderNumber: string;
//   customerName: string;
//   status: OrderStatus;
//   paymentStatus: PaymentStatus;
//   totalAmount: number;
//   createdAt: Date;
// }

// export async function getRecentOrders(
//   limit = 5
// ): Promise<DashboardRecentOrder[]> {
//   const orders = await db.order.findMany({
//     orderBy: { createdAt: "desc" },
//     take: limit,
//     include: {
//       user: {
//         select: {
//           name: true,
//           email: true,
//         },
//       },
//     },
//   });

//   return orders.map((order) => ({
//     id: order.id,
//     orderNumber: order.orderNumber,
//     customerName: order.user?.name ?? order.shippingName,
//     status: order.status,
//     paymentStatus: order.paymentStatus,
//     totalAmount: order.totalAmount,
//     createdAt: order.createdAt,
//   }));
// }

import db from "@/lib/db";
import { nanoid } from "nanoid";
import { Prisma } from "@/generated/prisma/client";
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "@/generated/prisma/enums";
import { OrderDetailDTO, OrderItemDTO, OrderPaymentDTO } from "@/types/order";
import {
  normalizePagination,
  createPaginationMeta,
  ADMIN_DEFAULT_PAGE_SIZE,
  PaginationMeta,
} from "@/lib/pagination";

/**
 * Hardened patches applied:
 * - sanitize-html for text fields
 * - strict non-empty string checks for IDs
 * - rounding-safe numeric comparisons
 * - atomic stock decrement with retry/backoff (approveOrderPayment)
 * - product-weight consistency check
 * - length limits for textual fields (tracking/carrier/notes)
 * - avoid passing null into Prisma filters
 * - minimal logging via console (replaceable by pino/etc.)
 * - friendly error messages (internal details logged)
 */

/* -------------------------
   Helpers
   ------------------------- */

function stripTags(input?: string | null, maxLen = 2000): string | null {
  if (input == null) return null;

  // ลบ HTML tags โดยไม่แตะต้อง &, "
  const out = input.replace(/<[^>]*>/g, "").trim();

  if (out === "") return null;

  return out.length > maxLen ? out.slice(0, maxLen) : out;
}

function isNonEmptyString(v?: unknown): v is string {
  return typeof v === "string" && v.trim() !== "";
}

function safeNumber(n: unknown, defaultVal = 0): number {
  if (typeof n === "number" && Number.isFinite(n)) return n;
  const parsed = Number(n as any);
  return Number.isFinite(parsed) ? parsed : defaultVal;
}

function round2(n: number) {
  return Number(n.toFixed(2));
}

function friendlyError(msg = "เกิดข้อผิดพลาด") {
  // Keep user-facing errors generic; internal details logged separately
  return new Error(msg);
}

/* -------------------------
   Mapper
   ------------------------- */

const orderWithRelations = {
  include: {
    items: {
      include: {
        weight: true,
        product: {
          include: {
            ProductImage: true,
          },
        },
      },
    },
    payments: true,
  },
} satisfies Prisma.OrderDefaultArgs;

export type OrderWithRelations = Prisma.OrderGetPayload<
  typeof orderWithRelations
>;

function mapOrderDetail(order: OrderWithRelations): OrderDetailDTO {
  const items: OrderItemDTO[] = order.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    weightId: item.weightId,
    productTitle: item.productTitle,
    productSku: item.productSku,
    weightValue: item.weightValue,
    variantName: (item as any).weight?.name || null,
    unitLabel: (item as any).product?.unitLabel || "ชิ้น",
    unitPrice: item.unitPrice,
    basePrice: item.basePrice,
    quantity: item.quantity,
    subtotal: item.subtotal,
    codAvailable: item.codAvailable,
    status: item.status, // 👈 เพิ่มบรรทัดนี้ (สำคัญ! ไม่งั้นหน้าเว็บไม่รู้ว่าของหมด)
    trackingNumber: (item as any).trackingNumber || null,
    carrier: (item as any).carrier || null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    product: item.product
      ? { ProductImage: item.product.ProductImage || [] }
      : null,
  }));

  const payments: OrderPaymentDTO[] = order.payments.map((payment) => ({
    id: payment.id,
    method: payment.method,
    amount: payment.amount,
    slipUrl: payment.slipUrl,
    slipFileId: payment.slipFileId,
    status: payment.status,
    paidAt: payment.paidAt,
    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt,

    // ✅ ต้องเพิ่มตรงนี้ด้วยครับ (ถ้าใน Prisma schema มีแล้ว)
    refundBank: payment.refundBank,
    refundAccountName: payment.refundAccountName,
    refundAccountNo: payment.refundAccountNo,
  }));

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    subtotal: order.subtotal,
    shippingFee: order.shippingFee,
    depositAmount: order.depositAmount,
    totalAmount: order.totalAmount,
    requiresCodDeposit: order.requiresCodDeposit,
    shippingName: order.shippingName,
    shippingPhone: order.shippingPhone,
    shippingLine1: order.shippingLine1,
    shippingLine2: order.shippingLine2,
    shippingProvince: order.shippingProvince,
    shippingDistrict: order.shippingDistrict,
    shippingSubdistrict: order.shippingSubdistrict,
    shippingPostalCode: order.shippingPostalCode,
    trackingNumber: order.trackingNumber,
    carrier: order.carrier,
    notes: order.notes,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    items,
    payments,
  };
}

/* -------------------------
   createOrder
   ------------------------- */

interface CreateOrderInput {
  userId: string;
  addressId: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: number;
  shippingFee: number;
  depositAmount: number;
  totalAmount: number;
  requiresCodDeposit: boolean;
  shippingName: string;
  shippingPhone: string;
  shippingLine1: string;
  shippingLine2?: string | null;
  shippingProvince: string;
  shippingDistrict: string;
  shippingSubdistrict: string;
  shippingPostalCode: string;
  notes?: string | null;
  items: Array<{
    productId: string | null;
    weightId: string | null;
    productTitle: string;
    productSku: string | null;
    weightValue: number | null;
    unitPrice: number;
    basePrice: number | null;
    quantity: number;
    subtotal: number;
    codAvailable: boolean;
  }>;
  payments: Array<{
    method: PaymentMethod;
    amount: number;
    slipUrl?: string | null;
    slipFileId?: string | null;
    status?: PaymentStatus;
    paidAt?: Date | null;
  }>;
}

export async function createOrder(data: CreateOrderInput) {
  try {
    if (!data || typeof data !== "object")
      throw friendlyError("Invalid payload");

    if (!Array.isArray(data.items) || data.items.length === 0)
      throw friendlyError("Order must contain at least one item");

    if (!isNonEmptyString(data.userId) || !isNonEmptyString(data.addressId)) {
      throw friendlyError("Invalid user or address");
    }

    // numeric sanity checks
    const numericChecks: Array<[string, number]> = [
      ["subtotal", safeNumber(data.subtotal, NaN)],
      ["shippingFee", safeNumber(data.shippingFee, NaN)],
      ["depositAmount", safeNumber(data.depositAmount, NaN)],
      ["totalAmount", safeNumber(data.totalAmount, NaN)],
    ];
    for (const [name, value] of numericChecks) {
      if (typeof value !== "number" || Number.isNaN(value) || value < 0) {
        throw friendlyError(`Invalid numeric field: ${name}`);
      }
    }

    // item-level checks & sanitize
    const sanitizedItems = data.items.map((item, idx) => {
      if (typeof item.quantity !== "number" || item.quantity <= 0) {
        throw friendlyError(`Invalid item quantity at index ${idx}`);
      }
      if (typeof item.unitPrice !== "number" || item.unitPrice < 0) {
        throw friendlyError(`Invalid item unitPrice at index ${idx}`);
      }
      if (typeof item.subtotal !== "number" || item.subtotal < 0) {
        throw friendlyError(`Invalid item subtotal at index ${idx}`);
      }

      // productId/weightId may be null (virtual items), just ensure type is string when present
      if (
        item.productId !== null &&
        item.productId !== undefined &&
        typeof item.productId !== "string"
      ) {
        throw friendlyError(`Invalid productId at index ${idx}`);
      }
      if (
        item.weightId !== null &&
        item.weightId !== undefined &&
        typeof item.weightId !== "string"
      ) {
        throw friendlyError(`Invalid weightId at index ${idx}`);
      }

      return {
        ...item,
        productTitle: stripTags(item.productTitle, 400) ?? item.productTitle,
        productSku: stripTags(item.productSku ?? null, 100) ?? null,
        weightValue:
          typeof item.weightValue === "number" ? item.weightValue : null,
      };
    });

    // sanitize shipping fields with reasonable limits
    const sanitizedPayload = {
      ...data,
      shippingName: stripTags(data.shippingName, 200) ?? data.shippingName,
      shippingPhone: stripTags(data.shippingPhone, 30) ?? data.shippingPhone,
      shippingLine1: stripTags(data.shippingLine1, 400) ?? data.shippingLine1,
      shippingLine2: stripTags(data.shippingLine2 ?? null, 400) ?? null,
      shippingProvince:
        stripTags(data.shippingProvince, 100) ?? data.shippingProvince,
      shippingDistrict:
        stripTags(data.shippingDistrict, 100) ?? data.shippingDistrict,
      shippingSubdistrict:
        stripTags(data.shippingSubdistrict, 100) ?? data.shippingSubdistrict,
      shippingPostalCode:
        stripTags(data.shippingPostalCode, 20) ?? data.shippingPostalCode,
      notes: stripTags(data.notes ?? null, 1000) ?? null,
      items: sanitizedItems,
      payments: Array.isArray(data.payments) ? data.payments : [],
    };

    // Server-side subtotal check (prevent client tampering)
    const computedSubtotal = sanitizedItems.reduce(
      (sum, it) => sum + Number(it.subtotal ?? 0),
      0,
    );
    const clientSubtotal = round2(Number(sanitizedPayload.subtotal ?? 0));
    if (round2(computedSubtotal) !== clientSubtotal) {
      console.warn("[createOrder] subtotal mismatch", {
        computedSubtotal,
        clientSubtotal,
        userId: data.userId,
      });
      throw friendlyError("Subtotal mismatch");
    }

    // Basic total rule (subtotal + shippingFee)
    const shippingFee = round2(Number(sanitizedPayload.shippingFee ?? 0));
    const computedTotal = round2(computedSubtotal + shippingFee);
    const clientTotal = round2(Number(sanitizedPayload.totalAmount ?? 0));
    if (clientTotal !== computedTotal) {
      console.warn("[createOrder] total mismatch", {
        computedTotal,
        clientTotal,
        userId: data.userId,
      });
      throw friendlyError("Total amount mismatch");
    }

    // payments sum should not exceed total
    const payments = Array.isArray(sanitizedPayload.payments)
      ? sanitizedPayload.payments
      : [];
    const paymentsSum = payments.reduce(
      (s, p) => s + Number(p?.amount ?? 0),
      0,
    );
    if (paymentsSum > clientTotal + 0.0001) {
      console.warn("[createOrder] payments exceed total", {
        paymentsSum,
        clientTotal,
        userId: data.userId,
      });
      throw friendlyError("Payments sum exceeds total amount");
    }

    const orderNumber = `ORD${nanoid(10).toUpperCase()}`;

    // Persist within transaction
    await db.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: sanitizedPayload.userId,
          addressId: sanitizedPayload.addressId,
          status: OrderStatus.PENDING_PAYMENT,
          paymentMethod: sanitizedPayload.paymentMethod,
          paymentStatus: sanitizedPayload.paymentStatus,
          subtotal: sanitizedPayload.subtotal,
          shippingFee: sanitizedPayload.shippingFee,
          depositAmount: sanitizedPayload.depositAmount,
          totalAmount: sanitizedPayload.totalAmount,
          requiresCodDeposit: sanitizedPayload.requiresCodDeposit,
          shippingName: sanitizedPayload.shippingName,
          shippingPhone: sanitizedPayload.shippingPhone,
          shippingLine1: sanitizedPayload.shippingLine1,
          shippingLine2: sanitizedPayload.shippingLine2 ?? null,
          shippingProvince: sanitizedPayload.shippingProvince,
          shippingDistrict: sanitizedPayload.shippingDistrict,
          shippingSubdistrict: sanitizedPayload.shippingSubdistrict,
          shippingPostalCode: sanitizedPayload.shippingPostalCode,
          notes: sanitizedPayload.notes ?? null,
        },
      });

      await tx.orderItem.createMany({
        data: sanitizedPayload.items.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          weightId: item.weightId,
          productTitle: item.productTitle,
          productSku: item.productSku,
          weightValue: item.weightValue,
          unitPrice: item.unitPrice,
          basePrice: item.basePrice,
          quantity: item.quantity,
          subtotal: item.subtotal,
          codAvailable: item.codAvailable,
        })),
      });

      for (const payment of sanitizedPayload.payments) {
        await tx.orderPayment.create({
          data: {
            orderId: order.id,
            method: payment.method,
            amount: payment.amount,
            slipUrl: payment.slipUrl ?? null,
            slipFileId: payment.slipFileId ?? null,
            status: payment.status ?? PaymentStatus.PENDING,
            paidAt: payment.paidAt ?? null,
          },
        });
      }
    });

    return orderNumber;
  } catch (err) {
    // internal logging for diagnostics (do not leak raw error to client)
    console.error("[createOrder] failed:", err);
    throw friendlyError("ไม่สามารถสร้างคำสั่งซื้อได้ในขณะนี้");
  }
}

/* -------------------------
   listOrdersByUser
   ------------------------- */

export async function listOrdersByUser(
  userId: string,
): Promise<OrderDetailDTO[]> {
  try {
    if (!isNonEmptyString(userId)) throw friendlyError("Invalid userId");

    const orders = await db.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },

      include: {
        items: {
          orderBy: { createdAt: "asc" },
          include: {
            weight: true,
            product: {
              include: {
                // ✅✅✅ แก้ไข: ใช้ชื่อ "ProductImage" ตามที่ประกาศใน Schema ครับ
                ProductImage: true,
              },
            },
          },
        },
        payments: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    // ✅ ใช้ as any เพื่อผ่าน Type Check ไปก่อน
    return orders.map((order) => mapOrderDetail(order as any));
  } catch (err) {
    console.error("[listOrdersByUser] failed:", err);
    throw friendlyError("ไม่สามารถดึงคำสั่งซื้อได้");
  }
}

/* -------------------------
   listOrders
   ------------------------- */

export interface ListOrdersOptions {
  statuses?: OrderStatus[];
  search?: string | null;
  page?: number | string | null;
  pageSize?: number | string | null;
}

export interface ListOrdersResult {
  items: OrderDetailDTO[];
  total: number;
  meta: PaginationMeta;
}

export async function listOrders(
  options: ListOrdersOptions = {},
): Promise<ListOrdersResult> {
  try {
    const { statuses, search, page, pageSize } = options;

    const pagination = normalizePagination(
      { page, pageSize },
      { defaultPageSize: ADMIN_DEFAULT_PAGE_SIZE },
    );

    const searchTerm =
      typeof search === "string" && search.trim() !== ""
        ? (stripTags(search, 200) ?? search.trim())
        : undefined;

    const where: Prisma.OrderWhereInput = {
      ...(statuses && statuses.length ? { status: { in: statuses } } : {}),
      ...(searchTerm
        ? {
            orderNumber: {
              contains: searchTerm,
              mode: "insensitive",
            },
          }
        : {}),
    };

    const [orders, total] = await db.$transaction([
      db.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            orderBy: { createdAt: "asc" },
            include: {
              weight: true, // เพื่อเอาเลข 100 มาใส่ใน variantName
              product: true, // เพื่อเอาหน่วย เช่น "ขวด" มาใส่ใน unitLabel
            },
          },
          payments: {
            orderBy: { createdAt: "asc" },
          },
        },
        skip: pagination.skip,
        take: pagination.take,
      }),
      db.order.count({ where }),
    ]);

    console.log("--- DEBUG ORDERS DATA ---");
    console.log(JSON.stringify(orders[0]?.items[0], null, 2));

    const meta = createPaginationMeta(total, {
      page: pagination.page,
      pageSize: pagination.pageSize,
    });

    return { items: orders.map(mapOrderDetail), total, meta };
  } catch (err) {
    console.error("[listOrders] failed:", err);
    throw friendlyError("ไม่สามารถดึงรายการคำสั่งซื้อได้");
  }
}

/* -------------------------
   ORDER_STATUS_TRANSITIONS
   ------------------------- */

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING_PAYMENT]: [
    OrderStatus.PENDING_VERIFICATION,
    OrderStatus.PROCESSING,
    OrderStatus.CANCELLED,
  ],
  [OrderStatus.PENDING_VERIFICATION]: [
    OrderStatus.PROCESSING,
    OrderStatus.CANCELLED,
  ],
  [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPED]: [OrderStatus.COMPLETED],
  [OrderStatus.COMPLETED]: [],
  [OrderStatus.CANCELLED]: [],
};

/* -------------------------
   approveOrderPayment (with retry/backoff)
   ------------------------- */

const STOCK_UPDATE_RETRIES = 3;
const STOCK_UPDATE_BACKOFF_MS = 100;

async function atomicDecrementWithRetry(
  tx: Prisma.TransactionClient,
  productId: string,
  deduction: number,
) {
  for (let attempt = 0; attempt < STOCK_UPDATE_RETRIES; attempt++) {
    try {
      const res = await tx.product.updateMany({
        where: { id: productId, stock: { gte: deduction } },
        data: { stock: { decrement: deduction } },
      });
      if (res.count === 0) {
        return false;
      }
      return true;
    } catch (err) {
      // If last attempt, rethrow to caller
      if (attempt === STOCK_UPDATE_RETRIES - 1) throw err;
      // otherwise small backoff
      await new Promise((r) =>
        setTimeout(r, STOCK_UPDATE_BACKOFF_MS * (attempt + 1)),
      );
    }
  }
  return false;
}

// export async function approveOrderPayment(orderId: string) {
//   if (!isNonEmptyString(orderId)) throw friendlyError("Invalid orderId");

//   try {
//     await db.$transaction(async (tx) => {
//       const order = await tx.order.findUnique({
//         where: { id: orderId },
//         include: {
//           items: true,
//           payments: true,
//         },
//       });

//       if (!order) {
//         throw friendlyError("ไม่พบคำสั่งซื้อที่ต้องการอนุมัติ");
//       }

//       if (order.paymentStatus === PaymentStatus.APPROVED) {
//         return;
//       }

//       if (
//         order.status !== OrderStatus.PENDING_PAYMENT &&
//         order.status !== OrderStatus.PENDING_VERIFICATION
//       ) {
//         throw friendlyError(
//           "ไม่สามารถอนุมัติการชำระเงินสำหรับสถานะปัจจุบันได้",
//         );
//       }

//       if (!order.items.length) {
//         throw friendlyError("คำสั่งซื้อไม่มีสินค้า จึงไม่สามารถอนุมัติได้");
//       }

//       const weightIds = order.items
//         .map((i) => i.weightId)
//         .filter(Boolean) as string[];
//       const productIds = order.items
//         .map((i) => i.productId)
//         .filter(Boolean) as string[];

//       // ------------------------------------------------------------------
//       // 🛠️ แก้ไขจุดที่ 1: เพิ่ม name: true เพื่อให้ดึงชื่อ "100 ขวด" มาได้
//       // ------------------------------------------------------------------
//       const weightMap = weightIds.length
//         ? new Map(
//             (
//               await tx.productWeight.findMany({
//                 where: { id: { in: weightIds } },
//                 select: {
//                   id: true,
//                   weight: true,
//                   productId: true,
//                   name: true, // ✅ สำคัญมาก! ต้องใส่ตรงนี้
//                 },
//               })
//             ).map((w) => [w.id, w]),
//           )
//         : new Map<
//             string,
//             {
//               id: string;
//               weight: number;
//               productId: string;
//               name?: string | null;
//             }
//           >();

//       const productMap = productIds.length
//         ? new Map(
//             (
//               await tx.product.findMany({
//                 where: { id: { in: productIds } },
//                 select: { id: true, stock: true },
//               })
//             ).map((p) => [p.id, p]),
//           )
//         : new Map<string, { id: string; stock: number }>();
//         console.log(`\n========== 🔍 เริ่มตรวจสอบออเดอร์: ${order.orderNumber} ==========`);

//       // ensure weight records belong to same product when provided
//       for (const item of order.items) {
//         if (item.weightId && weightMap.has(item.weightId) && item.productId) {
//           const w = weightMap.get(item.weightId) as
//             | { productId: string }
//             | undefined;
//           if (w && w.productId !== item.productId) {
//             console.warn("[approveOrderPayment] weightId-productId mismatch", {
//               orderId,
//               itemId: item.id,
//               itemProductId: item.productId,
//               weightProductId: w.productId,
//             });
//             throw friendlyError("ข้อมูลน้ำหนักสินค้าไม่ตรงกับสินค้า");
//           }
//         }
//       }

//       for (const item of order.items) {
//         if (!item.productId) continue;

//         if (item.status !== "NORMAL") {
//           continue;
//         }

//         const product = productMap.get(item.productId);
//         if (!product) {
//           console.warn("[approveOrderPayment] missing product", {
//             orderId,
//             productId: item.productId,
//           });
//           throw friendlyError(`ไม่พบข้อมูลสินค้า ${item.productTitle}`);
//         }

//         const weightRecord = item.weightId
//           ? weightMap.get(item.weightId)
//           : undefined;

//         // ------------------------------------------------------------------
//         // ✅ แก้ไขจุดที่ 2: Logic คำนวณตัดสต็อก (แบบฉลาด)
//         // ------------------------------------------------------------------

//         // 1. ดึงชื่อทั้งหมดมาต่อกัน เพื่อหาคำว่า "100 ขวด"
//         // เราเช็คทั้ง name จาก DB และ variantName ที่บันทึกไว้ตอนสั่งซื้อ
//         const fullTextToCheck = [
//           weightRecord?.name, // ชื่อจาก DB (เช่น "100 ขวด")
//           item.productTitle, // ชื่อสินค้าหลัก
//         ]
//           .filter(Boolean)
//           .join(" ");

//         // 2. ใช้ Regex ค้นหาตัวเลขที่อยู่หน้าหน่วยนับ
//         // รองรับ: "100 ขวด", "100ขวด", "50 ชิ้น", "Box of 12"
//         const packMatch = fullTextToCheck.match(
//           /(\d+)\s*(ขวด|ชิ้น|box|pack|set|กระปุก|ลัง|โหล)/i,
//         );

//         let unitMultiplier = 1;

//         if (packMatch && packMatch[1]) {
//           // ✅ เจอแล้ว! เช่นเจอ "100 ขวด" -> ใช้ 100 เป็นตัวคูณ
//           unitMultiplier = parseInt(packMatch[1], 10);
//         } else {
//           // ❌ ไม่เจอ (สินค้าสมุนไพร/กรัม) -> ใช้น้ำหนักจาก DB
//           // แต่ถ้า DB เป็น 0 ให้ใช้ 1 กันเหนียว
//           const dbWeight = Number(
//             weightRecord?.weight ?? item.weightValue ?? 0,
//           );
//           unitMultiplier = dbWeight > 0 ? dbWeight : 1;
//         }

//         const quantity = Number(item.quantity);
//         // คำนวณยอดตัดสต็อกจริง: (100 x 3 = 300)
//         const deduction = unitMultiplier * quantity;

//         // ------------------------------------------------------------------
//         // จบการแก้ไข
//         // ------------------------------------------------------------------

//         if (deduction > 0) {
//           const ok = await atomicDecrementWithRetry(
//             tx,
//             item.productId,
//             deduction,
//           );
//           if (!ok) {
//             console.warn(
//               "[approveOrderPayment] insufficient stock after atomic decrement",
//               {
//                 orderId,
//                 productId: item.productId,
//                 deduction,
//               },
//             );
//             throw friendlyError(
//               `สต็อกของสินค้า ${item.productTitle} ไม่เพียงพอ (ต้องการ ${deduction})`,
//             );
//           }
//         }

//         if (item.weightId && weightRecord) {
//           await tx.productWeight.update({
//             where: { id: item.weightId },
//             data: {
//               sold: { increment: quantity },
//             },
//           });
//         }
//       }

//       if (order.payments.length) {
//         await tx.orderPayment.updateMany({
//           where: { orderId: order.id },
//           data: {
//             status: PaymentStatus.APPROVED,
//             paidAt: new Date(),
//           },
//         });
//       }

//       await tx.order.update({
//         where: { id: order.id },
//         data: {
//           status: OrderStatus.PROCESSING,
//           paymentStatus: PaymentStatus.APPROVED,
//         },
//       });
//     });
//   } catch (err) {
//     console.error("[approveOrderPayment] failed:", err);
//     throw friendlyError("ไม่สามารถอนุมัติการชำระเงินได้ขณะนี้");
//   }
// }

// export async function approveOrderPayment(orderId: string) {
//   if (!isNonEmptyString(orderId)) throw friendlyError("Invalid orderId");

//   try {
//     await db.$transaction(async (tx) => {
//       const order = await tx.order.findUnique({
//         where: { id: orderId },
//         include: {
//           items: true,
//           payments: true,
//         },
//       });

//       if (!order) {
//         throw friendlyError("ไม่พบคำสั่งซื้อที่ต้องการอนุมัติ");
//       }

//       if (order.paymentStatus === PaymentStatus.APPROVED) {
//         return;
//       }

//       if (
//         order.status !== OrderStatus.PENDING_PAYMENT &&
//         order.status !== OrderStatus.PENDING_VERIFICATION
//       ) {
//         throw friendlyError(
//           "ไม่สามารถอนุมัติการชำระเงินสำหรับสถานะปัจจุบันได้",
//         );
//       }

//       if (!order.items.length) {
//         throw friendlyError("คำสั่งซื้อไม่มีสินค้า จึงไม่สามารถอนุมัติได้");
//       }

//       const weightIds = order.items
//         .map((i) => i.weightId)
//         .filter(Boolean) as string[];
//       const productIds = order.items
//         .map((i) => i.productId)
//         .filter(Boolean) as string[];

//       // ------------------------------------------------------------------
//       // 🛠️ แก้ไขจุดที่ 1: เพิ่ม name: true เพื่อดึงชื่อตัวเลือกมาเช็ค
//       // ------------------------------------------------------------------
//       const weightMap = weightIds.length
//         ? new Map(
//             (
//               await tx.productWeight.findMany({
//                 where: { id: { in: weightIds } },
//                 select: {
//                   id: true,
//                   weight: true,
//                   productId: true,
//                   name: true, // ✅ สำคัญมาก! ต้องดึงชื่อมาเพื่อเช็คว่าเป็น "100" หรือไม่
//                 },
//               })
//             ).map((w) => [w.id, w]),
//           )
//         : new Map<
//             string,
//             {
//               id: string;
//               weight: number;
//               productId: string;
//               name?: string | null;
//             }
//           >();

//       const productMap = productIds.length
//         ? new Map(
//             (
//               await tx.product.findMany({
//                 where: { id: { in: productIds } },
//                 select: { id: true, stock: true },
//               })
//             ).map((p) => [p.id, p]),
//           )
//         : new Map<string, { id: string; stock: number }>();

//       // ensure weight records belong to same product when provided
//       for (const item of order.items) {
//         if (item.weightId && weightMap.has(item.weightId) && item.productId) {
//           const w = weightMap.get(item.weightId) as
//             | { productId: string }
//             | undefined;
//           if (w && w.productId !== item.productId) {
//             console.warn("[approveOrderPayment] weightId-productId mismatch", {
//               orderId,
//               itemId: item.id,
//               itemProductId: item.productId,
//               weightProductId: w.productId,
//             });
//             throw friendlyError("ข้อมูลน้ำหนักสินค้าไม่ตรงกับสินค้า");
//           }
//         }
//       }

//       for (const item of order.items) {
//         if (!item.productId) continue;

//         // ถ้าสินค้าสถานะไม่ใช่ NORMAL (เช่น หมด หรือ เปลี่ยนของแล้ว) ไม่ต้องตัดสต็อก
//         if (item.status !== "NORMAL") {
//           continue;
//         }

//         const product = productMap.get(item.productId);
//         if (!product) {
//           console.warn("[approveOrderPayment] missing product", {
//             orderId,
//             productId: item.productId,
//           });
//           throw friendlyError(`ไม่พบข้อมูลสินค้า ${item.productTitle}`);
//         }

//         const weightRecord = item.weightId
//           ? weightMap.get(item.weightId)
//           : undefined;

//         // ------------------------------------------------------------------
//         // ✅ แก้ไขจุดที่ 2: Logic คำนวณตัดสต็อก (ฉบับสมบูรณ์)
//         // ------------------------------------------------------------------

//         // 1. ดึงชื่อตัวเลือกมาทำความสะอาด (เช่น "100", "50 ขวด")
//         const variantNameRaw = (weightRecord?.name || "").toString().trim();

//         // 2. เตรียมข้อความรวมเพื่อค้นหา (สำรองจากชื่อสินค้า ถ้าชื่อตัวเลือกไม่มี)
//         const fullTextToCheck = [variantNameRaw, item.productTitle].filter(Boolean).join(" ");

//         let unitMultiplier = 1;

//         // 🟢 กรณีที่ 1: เช็คว่าชื่อตัวเลือกเป็น "ตัวเลขล้วนๆ" หรือไม่? (เช่น "100", "50")
//         // เคสนี้จะแก้ปัญหาน้ำส้มของคุณ ที่ชื่อเป็น "100" เฉยๆ
//        if (/^\d+$/.test(variantNameRaw)) {
//             unitMultiplier = parseInt(variantNameRaw, 10);
//             console.log(`   ✅ เจอชื่อเป็นตัวเลขล้วน "${variantNameRaw}" -> ใช้ตัวคูณ: ${unitMultiplier}`);
//         }
//         // 🟢 กรณีที่ 2: ถ้าไม่ใช่ตัวเลขล้วน ให้หา Pattern "ตัวเลข + หน่วย" (เช่น "100 ขวด")
//         else {
//             const packMatch = fullTextToCheck.match(/(\d+)\s*(ขวด|ชิ้น|box|pack|set|กระปุก|ลัง|โหล|g|kg|กรัม)/i);

//             if (packMatch && packMatch[1]) {
//                 // เจอคำว่า "100 ขวด"
//                 unitMultiplier = parseInt(packMatch[1], 10);
//                 console.log(`   ✅ เจอคำว่า "${packMatch[0]}" -> ใช้ตัวคูณ: ${unitMultiplier}`);
//             } else {
//                 // ❌ ไม่เจออะไรเลย ให้ใช้ค่าจาก DB
//                 const dbWeight = Number(weightRecord?.weight ?? item.weightValue ?? 0);
//                 unitMultiplier = dbWeight > 0 ? dbWeight : 1;
//                 console.log(`   ❌ ไม่เจอ Pattern -> ใช้ค่าจาก DB: ${unitMultiplier}`);
//             }
//         }

//         const quantity = Number(item.quantity);

//         // คำนวณยอดตัดสต็อกสุทธิ: (ตัวคูณ x จำนวนที่สั่ง)
//         // เช่น (100 x 3 = 300)
//         const deduction = unitMultiplier * quantity;

//         // ------------------------------------------------------------------
//         // จบการแก้ไข
//         // ------------------------------------------------------------------

//         if (deduction > 0) {
//           const ok = await atomicDecrementWithRetry(
//             tx,
//             item.productId,
//             deduction,
//           );
//           if (!ok) {
//             console.warn(
//               "[approveOrderPayment] insufficient stock after atomic decrement",
//               {
//                 orderId,
//                 productId: item.productId,
//                 deduction,
//               },
//             );
//             throw friendlyError(
//               `สต็อกของสินค้า ${item.productTitle} ไม่เพียงพอ (ต้องการ ${deduction})`,
//             );
//           }
//         }

//         if (item.weightId && weightRecord) {
//           await tx.productWeight.update({
//             where: { id: item.weightId },
//             data: {
//               sold: { increment: quantity },
//             },
//           });
//         }
//       }

//       if (order.payments.length) {
//         await tx.orderPayment.updateMany({
//           where: { orderId: order.id },
//           data: {
//             status: PaymentStatus.APPROVED,
//             paidAt: new Date(),
//           },
//         });
//       }

//       await tx.order.update({
//         where: { id: order.id },
//         data: {
//           status: OrderStatus.PROCESSING,
//           paymentStatus: PaymentStatus.APPROVED,
//         },
//       });
//     });
//   } catch (err) {
//     console.error("[approveOrderPayment] failed:", err);
//     throw friendlyError("ไม่สามารถอนุมัติการชำระเงินได้ขณะนี้");
//   }
// }

export async function approveOrderPayment(orderId: string) {
  if (!isNonEmptyString(orderId)) throw friendlyError("Invalid orderId");

  try {
    await db.$transaction(async (tx) => {
      // 1. ดึงข้อมูล Order ล่าสุด (รวม items และ payments) เพื่อให้ได้ข้อมูลที่ Real-time ที่สุด
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          items: true,
          payments: true,
        },
      });

      if (!order) {
        throw friendlyError("ไม่พบคำสั่งซื้อที่ต้องการอนุมัติ");
      }

      // ป้องกันการกดซ้ำ
      // if (order.paymentStatus === PaymentStatus.APPROVED) {
      //   return;
      // }

      // เช็คสถานะว่าอนุมัติได้ไหม (ต้องรอชำระเงิน หรือ รอตรวจสอบ)
      if (
        order.status !== OrderStatus.PENDING_PAYMENT &&
        order.status !== OrderStatus.PENDING_VERIFICATION &&
        order.status !== OrderStatus.PROCESSING
      ) {
        throw friendlyError(
          "ไม่สามารถอนุมัติการชำระเงินสำหรับสถานะปัจจุบันได้",
        );
      }

      if (!order.items.length) {
        throw friendlyError("คำสั่งซื้อไม่มีสินค้า จึงไม่สามารถอนุมัติได้");
      }

      // 2. เตรียมข้อมูลสินค้าและตัวเลือก (Weight) เพื่อใช้คำนวณสต็อก
      const weightIds = order.items
        .map((i) => i.weightId)
        .filter(Boolean) as string[];
      const productIds = order.items
        .map((i) => i.productId)
        .filter(Boolean) as string[];

      const weightMap = weightIds.length
        ? new Map(
            (
              await tx.productWeight.findMany({
                where: { id: { in: weightIds } },
                select: { id: true, weight: true, productId: true, name: true },
              })
            ).map((w) => [w.id, w]),
          )
        : new Map();

      const productMap = productIds.length
        ? new Map(
            (
              await tx.product.findMany({
                where: { id: { in: productIds } },
                select: { id: true, stock: true },
              })
            ).map((p) => [p.id, p]),
          )
        : new Map();

      // 3. เริ่มวนลูปรายการสินค้าเพื่อตัดสต็อกและเพิ่มยอดขาย
      for (const item of order.items) {
        if (!item.productId) continue;

        // ข้ามสินค้าที่สถานะไม่ปกติ (เช่น ถูกเปลี่ยนออก หรือ ยกเลิก)
        // จุดนี้สำคัญ: ทำให้ถ้ารายการสินค้าเปลี่ยนไปแล้ว รายการเก่าจะไม่ถูกคำนวณ
        if (item.status !== "NORMAL") continue;

        const product = productMap.get(item.productId);
        if (!product) {
          throw friendlyError(`ไม่พบข้อมูลสินค้า ${item.productTitle}`);
        }

        const weightRecord = item.weightId
          ? weightMap.get(item.weightId)
          : undefined;

        // --- Logic คำนวณตัวคูณ (Unit Multiplier) ---
        // ใช้ Regex เพื่อหาหน่วยนับ (ขวด, ชิ้น, กรัม) จากชื่อตัวเลือก
        const variantNameRaw = (weightRecord?.name || "").toString().trim();
        const fullTextToCheck = [variantNameRaw, item.productTitle]
          .filter(Boolean)
          .join(" ");

        let unitMultiplier = 1;

        if (/^\d+$/.test(variantNameRaw)) {
          // กรณีชื่อเป็นตัวเลขล้วน เช่น "100"
          unitMultiplier = parseInt(variantNameRaw, 10);
        } else {
          // กรณีชื่อมีหน่วย เช่น "100 ขวด"
          const packMatch = fullTextToCheck.match(
            /(\d+)\s*(ขวด|ชิ้น|box|pack|set|กระปุก|ลัง|โหล|g|kg|กรัม)/i,
          );
          if (packMatch && packMatch[1]) {
            unitMultiplier = parseInt(packMatch[1], 10);
          } else {
            // กรณีไม่เจอ Pattern ใช้ค่าจาก DB
            const dbWeight = Number(
              weightRecord?.weight ?? item.weightValue ?? 0,
            );
            unitMultiplier = dbWeight > 0 ? dbWeight : 1;
          }
        }

        const quantity = Number(item.quantity);
        // deduction คือยอดที่จะนำไปตัดออกจาก stock (เช่น 100 ขวด x 3 = 300)
        const deduction = unitMultiplier * quantity;

        // 3.1 ตัดสต็อก (Stock Decrement)
        if (deduction > 0) {
          const ok = await atomicDecrementWithRetry(
            tx,
            item.productId,
            deduction,
          );
          if (!ok) {
            throw friendlyError(
              `สต็อกของสินค้า ${item.productTitle} ไม่เพียงพอ (ต้องการ ${deduction})`,
            );
          }
        }

        // =========================================================
        // 🚀 ส่วนที่แก้ไขเพิ่ม: บันทึกยอดขายลงสินค้าหลัก (Product.totalSold)
        // =========================================================
        // ตรงนี้จะทำให้หน้า RecommendedProducts เห็นยอดขายทันที
        // if (quantity > 0) {
        //   await tx.product.update({
        //     where: { id: item.productId },
        //     data: {
        //       // increment: quantity คือนับตามจำนวนชิ้นที่หยิบใส่ตะกร้า
        //       // (ถ้าคุณอยากนับตาม deduction ให้เปลี่ยน quantity เป็น deduction)
        //       totalSold: { increment: quantity },
        //     },
        //   });
        // }

        console.log(
          `🔍 DEBUG: สินค้า ${item.productTitle} | Quantity: ${quantity} | Multiplier: ${unitMultiplier} | Deduction: ${deduction}`,
        );

        if (deduction > 0) {
          // ✅ เปลี่ยนเงื่อนไขเช็คจาก quantity เป็น deduction (กันเหนียว)
          await tx.product.update({
            where: { id: item.productId },
            data: {
              // ❌ ของเดิม: quantity (คือจำนวนแพ็คที่ลูกค้ากดสั่ง เช่น 2)
              // totalSold: { increment: quantity },

              // ✅ แก้ไขเป็น: deduction (คือจำนวนหน่วยย่อยที่คำนวณแล้ว เช่น 200)
              totalSold: { increment: deduction },
            },
          });
        }
        // =========================================================
        // จบส่วนแก้ไข
        // =========================================================

        // 3.2 บันทึกยอดขายลงตัวเลือกย่อย (ProductWeight) - ถ้ามี
        if (item.weightId && weightRecord) {
          await tx.productWeight.update({
            where: { id: item.weightId },
            data: {
              sold: { increment: quantity },
            },
          });
        }
      }

      // 4. อัปเดตสถานะการชำระเงินของ Order
      if (order.payments.length) {
        await tx.orderPayment.updateMany({
          where: { orderId: order.id },
          data: {
            status: PaymentStatus.APPROVED,
            paidAt: new Date(),
          },
        });
      }

      // 5. อัปเดตสถานะ Order เป็น PROCESSING (กำลังเตรียมจัดส่ง)
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.PROCESSING,
          paymentStatus: PaymentStatus.APPROVED,
        },
      });
    });
  } catch (err) {
    console.error("[approveOrderPayment] failed:", err);
    throw friendlyError("ไม่สามารถอนุมัติการชำระเงินได้ขณะนี้");
  }
}

/* -------------------------
   rejectOrderPayment
   ------------------------- */

export async function rejectOrderPayment(orderId: string) {
  if (!isNonEmptyString(orderId)) throw friendlyError("Invalid orderId");

  try {
    await db.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          payments: true,
        },
      });

      if (!order) {
        throw friendlyError("ไม่พบคำสั่งซื้อที่ต้องการปฏิเสธ");
      }

      if (order.paymentStatus === PaymentStatus.APPROVED) {
        throw friendlyError("ไม่สามารถปฏิเสธคำสั่งซื้อที่อนุมัติแล้วได้");
      }

      if (order.payments.length) {
        await tx.orderPayment.updateMany({
          where: { orderId: order.id },
          data: {
            status: PaymentStatus.REJECTED,
            paidAt: null,
          },
        });
        // ดึงรายการสินค้าเพื่อคืนสต็อก
        const items = await tx.orderItem.findMany({
          where: { orderId },
          select: {
            productId: true,
            weightId: true,
            quantity: true,
            weightValue: true,
          },
        });

        for (const item of items) {
          if (!item.productId) continue;

          const unitWeight = Number(item.weightValue ?? 0);
          const qty = Number(item.quantity);
          const inc = unitWeight * qty;

          if (inc > 0) {
            await tx.product.updateMany({
              where: { id: item.productId },
              data: { stock: { increment: inc } },
            });
          }

          if (item.weightId) {
            await tx.productWeight.update({
              where: { id: item.weightId },
              data: { sold: { decrement: qty } },
            });
          }
        }

        // คืนสต็อกเสมอ (วางก่อนการอัพเดต orderPayment)
        // const items = await tx.orderItem.findMany({
        //   where: { orderId },
        //   select: {
        //     productId: true,
        //     weightId: true,
        //     quantity: true,
        //     weightValue: true,
        //   },
        // });

        // for (const item of items) {
        //   if (!item.productId) continue;
        //   const unitWeight = Number(item.weightValue ?? 0);
        //   const qty = Number(item.quantity);
        //   const inc = unitWeight * qty;
        //   if (inc > 0) {
        //     await tx.product.updateMany({
        //       where: { id: item.productId },
        //       data: { stock: { increment: inc } },
        //     });
        //   }
        //   if (item.weightId) {
        //     await tx.productWeight.update({
        //       where: { id: item.weightId },
        //       data: { sold: { decrement: qty } },
        //     });
        //   }
        // }
      }

      await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: PaymentStatus.REJECTED,
          status: OrderStatus.PENDING_PAYMENT,
        },
      });
    });
  } catch (err) {
    console.error("[rejectOrderPayment] failed:", err);
    throw friendlyError("ไม่สามารถปฏิเสธการชำระเงินได้ขณะนี้");
  }
}

/* -------------------------
   updateOrderStatus
   ------------------------- */

export async function updateOrderStatus(
  orderId: string,
  nextStatus: OrderStatus,
  options?: { trackingNumber?: string | null; carrier?: string | null },
) {
  if (!isNonEmptyString(orderId)) throw friendlyError("Invalid orderId");

  try {
    await db.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        select: {
          status: true,
          paymentStatus: true,
        },
      });

      if (!order) throw friendlyError("ไม่พบคำสั่งซื้อที่ต้องการอัปเดตสถานะ");

      if (order.status === nextStatus) return;

      const allowed = (ORDER_STATUS_TRANSITIONS[order.status] ??
        []) as OrderStatus[];
      if (!allowed.includes(nextStatus))
        throw friendlyError("ไม่สามารถเปลี่ยนไปยังสถานะที่เลือกได้");

      if (
        nextStatus === OrderStatus.PROCESSING &&
        order.paymentStatus !== PaymentStatus.APPROVED
      ) {
        throw friendlyError(
          "ต้องอนุมัติการชำระเงินก่อนเข้าสู่สถานะกำลังเตรียมจัดส่ง",
        );
      }

      if (
        (nextStatus === OrderStatus.SHIPPED ||
          nextStatus === OrderStatus.COMPLETED) &&
        order.paymentStatus !== PaymentStatus.APPROVED
      ) {
        throw friendlyError("ต้องอนุมัติการชำระเงินก่อนดำเนินการขั้นถัดไป");
      }

      const data: Prisma.OrderUpdateInput = { status: nextStatus };

      if (nextStatus === OrderStatus.SHIPPED) {
        // limit lengths
        data.trackingNumber =
          stripTags(options?.trackingNumber ?? null, 200) ?? null;
        data.carrier = stripTags(options?.carrier ?? null, 100) ?? null;
      }

      await tx.order.update({
        where: { id: orderId },
        data,
      });
    });
  } catch (err) {
    console.error("[updateOrderStatus] failed:", err);
    throw friendlyError("ไม่สามารถอัปเดตสถานะคำสั่งซื้อได้ขณะนี้");
  }
}

/* -------------------------
   Dashboard metrics & trends
   ------------------------- */

export interface DashboardMetrics {
  totalSales: number;
  totalOrders: number;
  pendingVerificationOrders: number;
  pendingVerificationAmount: number;
  codDepositsAwaiting: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockCount: number;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const [orders, customers, productStocks] = await Promise.all([
      db.order.findMany({
        where: {
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
        select: {
          paymentStatus: true,
          paymentMethod: true,
          status: true,
          totalAmount: true,
          depositAmount: true,
        },
      }),
      db.user.count(),
      db.product.findMany({
        select: {
          id: true,
          stock: true,
          lowStock: true,
        },
      }),
    ]);

    let totalSales = 0;
    let totalOrders = 0;
    let pendingVerificationOrders = 0;
    let pendingVerificationAmount = 0;
    let codDepositsAwaiting = 0;

    let lowStockCount = 0;

    const totalProducts = productStocks.length;

    for (const product of productStocks) {
      const stockValue = Number(product.stock);
      const lowStockValue =
        product.lowStock != null ? Number(product.lowStock) : null;

      const isLowStock =
        stockValue <= 0 ||
        (lowStockValue != null && stockValue <= lowStockValue);

      if (isLowStock) lowStockCount += 1;
    }

    for (const order of orders) {
      totalOrders += 1;

      if (order.paymentStatus === PaymentStatus.APPROVED) {
        totalSales += Number(order.totalAmount ?? 0);
      }

      if (order.status === OrderStatus.PENDING_VERIFICATION) {
        pendingVerificationOrders += 1;
        pendingVerificationAmount += Number(order.totalAmount ?? 0);
      }

      if (
        order.paymentMethod === PaymentMethod.COD &&
        order.paymentStatus !== PaymentStatus.APPROVED
      ) {
        codDepositsAwaiting += Number(order.depositAmount ?? 0);
      }
    }

    return {
      totalSales,
      totalOrders,
      pendingVerificationOrders,
      pendingVerificationAmount,
      codDepositsAwaiting,
      totalCustomers: customers,
      totalProducts,
      lowStockCount,
    };
  } catch (err) {
    console.error("[getDashboardMetrics] failed:", err);
    throw friendlyError("ไม่สามารถดึงข้อมูลสถิติได้ขณะนี้");
  }
}

export interface DashboardTrendPoint {
  date: string;
  totalSales: number;
  orderCount: number;
}

export async function getDashboardTrends(
  days = 14,
): Promise<DashboardTrendPoint[]> {
  try {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(now.getDate() - (days - 1));

    const rows = await db.$queryRaw<
      Array<{
        date: Date;
        totalSales: Prisma.Decimal | null;
        orderCount: bigint;
      }>
    >`
      SELECT
        DATE("createdAt") AS date,
        SUM(
          CASE
            WHEN "paymentStatus" = CAST(${PaymentStatus.APPROVED} AS "PaymentStatus")
            THEN "totalAmount"
            ELSE 0
          END
        ) AS "totalSales",
        COUNT(*)::bigint AS "orderCount"
      FROM "order"
      WHERE "createdAt" >= ${startDate}
      GROUP BY DATE("createdAt")
      ORDER BY DATE("createdAt")
    `;

    const trendMap = new Map<
      string,
      { totalSales: number; orderCount: number }
    >();
    for (const row of rows) {
      const key = row.date.toISOString().slice(0, 10);
      trendMap.set(key, {
        totalSales: Number(row.totalSales ?? 0),
        orderCount: Number(row.orderCount),
      });
    }

    const data: DashboardTrendPoint[] = [];
    for (let index = 0; index < days; index += 1) {
      const current = new Date(startDate);
      current.setDate(startDate.getDate() + index);
      const key = current.toISOString().slice(0, 10);
      const trend = trendMap.get(key) ?? { totalSales: 0, orderCount: 0 };

      data.push({
        date: key,
        totalSales: trend.totalSales,
        orderCount: trend.orderCount,
      });
    }

    return data;
  } catch (err) {
    console.error("[getDashboardTrends] failed:", err);
    throw friendlyError("ไม่สามารถดึงข้อมูลแนวโน้มได้ขณะนี้");
  }
}

/* -------------------------
   getRecentOrders
   ------------------------- */

export interface DashboardRecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  createdAt: Date;
}

export async function getRecentOrders(
  limit = 5,
): Promise<DashboardRecentOrder[]> {
  try {
    const take = Math.max(1, Math.min(100, Number(limit ?? 5)));
    const orders = await db.order.findMany({
      orderBy: { createdAt: "desc" },
      take,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.user?.name ?? order.shippingName,
      status: order.status,
      paymentStatus: order.paymentStatus,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
    }));
  } catch (err) {
    console.error("[getRecentOrders] failed:", err);
    throw friendlyError("ไม่สามารถดึงคำสั่งซื้อล่าสุดได้ขณะนี้");
  }
}

export async function updateOrderItemTracking(
  orderItemId: string,
  data: { trackingNumber?: string | null; carrier?: string | null },
) {
  if (!orderItemId) throw new Error("Invalid orderItemId");
  return await db.orderItem.update({
    where: { id: orderItemId },
    data: {
      trackingNumber: data.trackingNumber?.trim() || null,
      carrier: data.carrier?.trim() || null,
    },
  });
}
