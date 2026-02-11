import { randomUUID } from "node:crypto";
// import {
//   PrismaClient,
//   OrderStatus,
//   PaymentMethod,
//   PaymentStatus,
// } from "../src/generated/prisma";
import { PrismaClient } from "../src/generated/prisma/client";
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "../src/generated/prisma/enums";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function resetDatabase() {
  await prisma.orderPayment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productWeight.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();
  await prisma.recommendedBanner.deleteMany();
  // Spin system
  await prisma.spinHistory.deleteMany();
  await prisma.userSpinConfig.deleteMany();
  await prisma.spinQuota.deleteMany();
  await prisma.spinOrderPayment.deleteMany();
  await prisma.spinOrder.deleteMany();
  await prisma.spinPackage.deleteMany();
  await prisma.spinSlotImage.deleteMany();
}

async function seedCategories() {
  const categoryPayload = Array.from({ length: 14 }, (_, index) => ({
    name: `QA Category ${index + 1}`,
    status: index % 5 === 0 ? "inactive" : "active",
  }));

  const categories = await Promise.all(
    categoryPayload.map((category) =>
      prisma.category.create({ data: category }),
    ),
  );

  return categories;
}

async function seedProducts(
  categories: Awaited<ReturnType<typeof seedCategories>>,
) {
  const titles = [
    "Blue Dream",
    "White Widow",
    "OG Kush",
    "Pineapple Express",
    "Northern Lights",
    "Girl Scout Cookies",
    "Purple Haze",
    "Mango Kush",
    "Lemon Skunk",
    "Granddaddy Purple",
    "Sour Diesel",
    "Sunset Sherbet",
    "Trainwreck",
    "AK-47",
    "Strawberry Cough",
    "Jack Herer",
    "Bubblegum",
    "Gelato",
    "Zkittlez",
    "Do-Si-Dos",
  ];

  const products = [];

  for (let index = 0; index < titles.length; index += 1) {
    const title = titles[index];
    const category = categories[index % categories.length];
    const basePrice = 250 + index * 15;
    const status = index % 6 === 0 ? "inactive" : "active";

    const product = await prisma.product.create({
      data: {
        title,
        lowStock: 5,
        sku: `QA-SKU-${String(index + 1).padStart(4, "0")}`,
        description: `${title} seeded for QA pagination scenarios.`,
        cod: index % 3 === 0,
        cost: basePrice - 70,
        stock: 40 + index * 3,
        status,
        categoryId: category.id,
        ProductImage: {
          create: [
            {
              url: `https://placehold.co/600x600?text=${encodeURIComponent(title)}`,
              fileId: `seed-${index + 1}-main`,
              isMain: true,
            },
            {
              url: `https://placehold.co/600x600?text=${encodeURIComponent(title)}+Alt`,
              fileId: `seed-${index + 1}-alt`,
              isMain: false,
            },
          ],
        },
        ProductWeight: {
          create: [
            {
              weight: 1,
              basePrice,
              price: basePrice + 40,
            },
            {
              weight: 3.5,
              basePrice: basePrice * 3,
              price: basePrice * 3 + 90,
            },
            {
              weight: 7,
              basePrice: basePrice * 5.5,
              price: basePrice * 5.5 + 160,
            },
          ],
        },
      },
      include: {
        ProductWeight: true,
        ProductImage: true,
      },
    });

    products.push(product);
  }

  return products;
}

async function seedUsers() {
  const admin = await prisma.user.create({
    data: {
      id: randomUUID(),
      name: "QA Admin",
      email: "qa-admin@example.com",
      role: "admin",
      emailVerified: true,
      image: null,
    },
  });

  const customer = await prisma.user.create({
    data: {
      id: randomUUID(),
      name: "QA Customer",
      email: "qa-customer@example.com",
      role: "customer",
      emailVerified: true,
      image: null,
    },
  });

  const address = await prisma.address.create({
    data: {
      userId: customer.id,
      label: "QA Home",
      recipient: "QA Customer",
      phone: "0890000000",
      line1: "123 QA Street",
      line2: "Floor 12",
      province: "Bangkok",
      district: "Pathum Wan",
      subdistrict: "Lumphini",
      postalCode: "10330",
      isDefault: true,
    },
  });

  return { admin, customer, address };
}

async function seedOrders(
  customer: Awaited<ReturnType<typeof seedUsers>>["customer"],
  address: Awaited<ReturnType<typeof seedUsers>>["address"],
  products: Awaited<ReturnType<typeof seedProducts>>,
) {
  const activeProducts = products.filter(
    (product) => product.status === "active",
  );

  if (activeProducts.length === 0) {
    console.warn("No active products available for order seeding.");
    return;
  }

  const orderStatuses = [
    OrderStatus.PENDING_PAYMENT,
    OrderStatus.PENDING_VERIFICATION,
    OrderStatus.PROCESSING,
    OrderStatus.SHIPPED,
    OrderStatus.COMPLETED,
    OrderStatus.CANCELLED,
  ];

  const ordersToCreate = 16;

  for (let index = 0; index < ordersToCreate; index += 1) {
    const product = activeProducts[index % activeProducts.length];
    const weight = product.ProductWeight[0];
    const quantity = (index % 3) + 1;
    const unitPrice = weight.price;
    const subtotal = unitPrice * quantity;
    const method =
      index % 2 === 0 ? PaymentMethod.PROMPTPAY : PaymentMethod.COD;
    const shippingFee = method === PaymentMethod.COD ? 100 : 60;
    const depositAmount =
      method === PaymentMethod.COD ? Math.round(subtotal * 0.3) : 0;
    const paymentStatus =
      method === PaymentMethod.COD && index % 4 === 1
        ? PaymentStatus.PENDING
        : PaymentStatus.APPROVED;
    const status = orderStatuses[index % orderStatuses.length];

    await prisma.order.create({
      data: {
        orderNumber: `ORD-QA-${String(index + 1).padStart(4, "0")}`,
        userId: customer.id,
        addressId: address.id,
        status,
        paymentMethod: method,
        paymentStatus,
        subtotal,
        shippingFee,
        depositAmount,
        totalAmount: subtotal + shippingFee,
        requiresCodDeposit: method === PaymentMethod.COD,
        shippingName: address.recipient,
        shippingPhone: address.phone,
        shippingLine1: address.line1,
        shippingLine2: address.line2,
        shippingProvince: address.province,
        shippingDistrict: address.district,
        shippingSubdistrict: address.subdistrict,
        shippingPostalCode: address.postalCode,
        trackingNumber:
          status === OrderStatus.SHIPPED || status === OrderStatus.COMPLETED
            ? `TRACK${1000 + index}`
            : null,
        notes: index % 3 === 0 ? "Seeded order for QA scenarios." : null,
        items: {
          create: [
            {
              productId: product.id,
              weightId: weight.id,
              productTitle: product.title,
              productSku: product.sku,
              weightValue: weight.weight,
              unitPrice,
              basePrice: weight.basePrice,
              quantity,
              subtotal,
              codAvailable: product.cod,
            },
          ],
        },
        payments: {
          create: [
            {
              method,
              amount:
                method === PaymentMethod.COD
                  ? depositAmount
                  : subtotal + shippingFee,
              status: paymentStatus,
              paidAt:
                paymentStatus === PaymentStatus.APPROVED ? new Date() : null,
            },
          ],
        },
      },
    });
  }
}

async function seedBanners() {
  await prisma.recommendedBanner.createMany({
    data: [
      {
        id: randomUUID(),
        name: "QA Banner 1",
        imageUrl: "https://placehold.co/1200x400?text=QA+Banner+1",
        fileId: "qa-banner-1",
      },
      {
        id: randomUUID(),
        name: "QA Banner 2",
        imageUrl: "https://placehold.co/1200x400?text=QA+Banner+2",
        fileId: "qa-banner-2",
      },
    ],
  });
}

async function seedSpinPackages() {
  await prisma.spinPackage.createMany({
    data: [
      {
        id: randomUUID(),
        name: "แพคเกจ 10 ครั้ง",
        spinAmount: 10,
        price: 10, // 1:1 ratio
        imageUrl: "https://placehold.co/600x400?text=10+Spins",
        fileId: "spin-pkg-10",
        status: "ACTIVE",
        sortOrder: 1,
      },
      {
        id: randomUUID(),
        name: "แพคเกจ 50 ครั้ง",
        spinAmount: 50,
        price: 50, // 1:1 ratio
        imageUrl: "https://placehold.co/600x400?text=50+Spins",
        fileId: "spin-pkg-50",
        status: "ACTIVE",
        sortOrder: 2,
      },
      {
        id: randomUUID(),
        name: "แพคเกจ 100 ครั้ง",
        spinAmount: 100,
        price: 100, // 1:1 ratio
        imageUrl: "https://placehold.co/600x400?text=100+Spins",
        fileId: "spin-pkg-100",
        status: "ACTIVE",
        sortOrder: 3,
      },
      {
        id: randomUUID(),
        name: "แพคเกจ 500 ครั้ง",
        spinAmount: 500,
        price: 500, // 1:1 ratio
        imageUrl: "https://placehold.co/600x400?text=500+Spins",
        fileId: "spin-pkg-500",
        status: "ACTIVE",
        sortOrder: 4,
      },
    ],
  });
}

async function seedSpinSlotImages() {
  await prisma.spinSlotImage.createMany({
    data: [
      {
        id: randomUUID(),
        imageUrl: "https://placehold.co/200x200?text=🎰",
        fileId: "slot-emoji-1",
        label: "🎰",
        sortOrder: 1,
        isActive: true,
      },
      {
        id: randomUUID(),
        imageUrl: "https://placehold.co/200x200?text=💎",
        fileId: "slot-emoji-2",
        label: "💎",
        sortOrder: 2,
        isActive: true,
      },
      {
        id: randomUUID(),
        imageUrl: "https://placehold.co/200x200?text=🍀",
        fileId: "slot-emoji-3",
        label: "🍀",
        sortOrder: 3,
        isActive: true,
      },
      {
        id: randomUUID(),
        imageUrl: "https://placehold.co/200x200?text=⭐",
        fileId: "slot-emoji-4",
        label: "⭐",
        sortOrder: 4,
        isActive: true,
      },
      {
        id: randomUUID(),
        imageUrl: "https://placehold.co/200x200?text=🎁",
        fileId: "slot-emoji-5",
        label: "🎁",
        sortOrder: 5,
        isActive: true,
      },
      {
        id: randomUUID(),
        imageUrl: "https://placehold.co/200x200?text=🏆",
        fileId: "slot-emoji-6",
        label: "🏆",
        sortOrder: 6,
        isActive: true,
      },
      {
        id: randomUUID(),
        imageUrl: "https://placehold.co/200x200?text=💰",
        fileId: "slot-emoji-7",
        label: "💰",
        sortOrder: 7,
        isActive: true,
      },
      {
        id: randomUUID(),
        imageUrl: "https://placehold.co/200x200?text=🎉",
        fileId: "slot-emoji-8",
        label: "🎉",
        sortOrder: 8,
        isActive: true,
      },
    ],
  });
}

async function main() {
  console.info("🧼 Resetting database...");
  await resetDatabase();

  console.info("🌱 Seeding categories...");
  const categories = await seedCategories();

  console.info("🌱 Seeding products...");
  const products = await seedProducts(categories);

  console.info("🌱 Seeding users & addresses...");
  const { customer, address } = await seedUsers();

  console.info("🌱 Seeding orders...");
  await seedOrders(customer, address, products);

  console.info("🌱 Seeding recommended banners...");
  await seedBanners();

  console.info("🌱 Seeding spin packages...");
  await seedSpinPackages();

  console.info("🌱 Seeding spin slot images...");
  await seedSpinSlotImages();

  console.info("✅ Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
