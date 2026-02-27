// import { Suspense } from "react";
// import { notFound } from "next/navigation";
// import db from "@/lib/db";
// import ProductDetail, { ProductDetailPayload } from "./product-detail";
// import { getProductById } from "@/services/products";
// import { getServerSession } from "@/lib/get-session";
// import { DetailPanelSkeleton } from "@/components/skeletons/detail-panel-skeleton";
// import { Metadata } from "next";

// const FALLBACK_IMAGE = "/images/no-product-image.webp";

// type ProductDescPageParams = Promise<{ id: string }>;

// interface ProductDescPageProps {
//   params: ProductDescPageParams;
// }

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }): Promise<Metadata> {
//   const { id } = await params;
//   const product = await getProductById(id);

//   if (!product) {
//     return {
//       title: "ไม่พบสินค้า",
//       description:
//         "ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!",
//     };
//   }

//   return {
//     title: product.title,
//     description:
//       "ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!",
//   };
// }

// export default async function ProductDescPage({
//   params,
// }: ProductDescPageProps) {
//   const { id } = await params;

//   return (
//     <div className="container mx-auto space-y-8 py-6 md:py-10">
//       <Suspense fallback={<DetailPanelSkeleton />}>
//         <ProductDetailSection id={id} />
//       </Suspense>
//     </div>
//   );
// }

// async function ProductDetailSection({ id }: { id: string }) {
//   const session = await getServerSession();
//   const userId = session?.user?.id ?? null;
//   const product = await getProductById(id);

//   if (!product) {
//     notFound();
//   }

//   // 🟢🟢 [ส่วนที่เพิ่ม] เช็คสิทธิ์การรีวิว (Server-Side Check) 🟢🟢
//   let canReview = false;

//   if (userId) {
//     // 1. เช็คว่า: มีออเดอร์สินค้านี้ ที่สถานะ COMPLETED หรือไม่?
//     const successfulOrder = await db.orderItem.findFirst({
//       where: {
//         productId: id,
//         order: {
//           userId: userId,
//           status: "COMPLETED", // ✅ ต้องได้รับของแล้วเท่านั้น (ตาม Schema คุณ)
//         },
//       },
//     });

//     // 2. เช็คว่า: เคยรีวิวสินค้านี้ไปแล้วหรือยัง?
//     const existingReview = await db.review.findFirst({
//       where: {
//         userId: userId,
//         productId: id,
//       },
//     });

//     // 🔒 สรุป: ต้อง (ซื้อสำเร็จ) และ (ยังไม่มีรีวิว) ถึงจะเป็น True
//     canReview = !!successfulOrder && !existingReview;
//   }
//   // 🟢🟢 ------------------------------------------------ 🟢🟢

//   const sortedImages = [...product.ProductImage]
//     .sort((a, b) => Number(b.isMain) - Number(a.isMain))
//     .map((image) => ({
//       id: image.id,
//       url: image.url,
//       isMain: image.isMain,
//     }));

//   const images = sortedImages.length
//     ? sortedImages
//     : [{ id: "fallback-image", url: FALLBACK_IMAGE, isMain: true }];

//   const mainImageUrl =
//     images.find((image) => image.isMain)?.url ??
//     product.mainImage?.url ??
//     images[0].url;

//   const weights = [...product.ProductWeight]
//     .map((weight) => ({
//       id: weight.id,
//       weight: weight.weight,
//       price: weight.price,
//       basePrice: weight.basePrice,
//     }))
//     .sort((a, b) => a.weight - b.weight);

//   const productDetail: ProductDetailPayload = {
//     id: product.id,
//     title: product.title,
//     description: product.description,
//     cod: product.cod,
//     stock: product.stock,
//     lowStock: product.lowStock,
//     categoryName: product.category?.name ?? null,
//     mainImageUrl: mainImageUrl ?? FALLBACK_IMAGE,
//     images,
//     weights,

//     // ✅✅ เพิ่ม 3 บรรทัดนี้เข้าไปครับ (Error จะหายทันที)
//     averageRating: product.averageRating || 0,
//     totalReviews: product.totalReviews || 0,
//     reviews: product.reviews || [],
//   };

//   return (
//     <ProductDetail
//       product={productDetail}
//       userId={userId}
//       isAuthenticated={Boolean(userId)}
//       canReview={canReview} // ✅ ส่งค่าสิทธิ์ที่เช็คแล้วไปหน้าจอ
//     />
//   );
// }

import { Suspense } from "react";
import { notFound } from "next/navigation";
import db from "@/lib/db";
import ProductDetail, { ProductDetailPayload } from "./product-detail";
import { getProductById } from "@/services/products";
import { getServerSession } from "@/lib/get-session";
import { DetailPanelSkeleton } from "@/components/skeletons/detail-panel-skeleton";
import { Metadata } from "next";
import { PaymentMethod } from "@/generated/prisma/enums";

const FALLBACK_IMAGE = "/images/no-product-image.webp";

type ProductDescPageParams = Promise<{ id: string }>;

interface ProductDescPageProps {
  params: ProductDescPageParams;
  // 🟢 1. เพิ่ม searchParams เพื่อรับใบเคลม
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "ไม่พบสินค้า",
      description:
        "ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!",
    };
  }

  return {
    title: product.title,
    description:
      "ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!",
  };
}

export default async function ProductDescPage({
  params,
  searchParams, // 🟢 2. รับ searchParams เข้ามา
}: ProductDescPageProps) {
  const { id } = await params;

  // 🟢 3. ดึงค่า replacement_for (ใบเคลม)
  const query = await searchParams;
  const replacementTargetId =
    typeof query.replacement_for === "string"
      ? query.replacement_for
      : undefined;

  return (
    <div className="container mx-auto space-y-8 py-6 md:py-10">
      <Suspense fallback={<DetailPanelSkeleton />}>
        {/* 🟢 4. ส่งต่อใบเคลมให้ Section */}
        <ProductDetailSection
          id={id}
          replacementTargetId={replacementTargetId}
        />
      </Suspense>
    </div>
  );
}

// 🟢 5. รับค่าตรงนี้ด้วย
async function ProductDetailSection({
  id,
  replacementTargetId,
}: {
  id: string;
  replacementTargetId?: string;
}) {
  const session = await getServerSession();
  const userId = session?.user?.id ?? null;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  let defaultAddressId: string | null = null;
  if (userId) {
    // หาที่อยู่ที่ถูกตั้งเป็นค่าเริ่มต้น (isDefault: true)
    const address = await db.address.findFirst({
      where: { userId: userId, isDefault: true },
    });

    if (address) {
      defaultAddressId = address.id;
    } else {
      // ถ้าไม่มีที่อยู่ default ให้ลองดึงที่อยู่อันแรกที่เคยเพิ่มไว้มาแทน
      const fallbackAddress = await db.address.findFirst({
        where: { userId: userId },
      });
      defaultAddressId = fallbackAddress?.id ?? null;
    }
  }

  // 🟢🟢 2. เช็ควิธีชำระเงินของออเดอร์เดิม 🟢🟢
  let originalPaymentMethod: PaymentMethod | null = null;
  // 👇👇 [ส่วนที่หายไป] ต้องเพิ่ม Logic นี้กลับเข้ามาครับ! 👇👇
  if (replacementTargetId) {
    const originalItem = await db.orderItem.findUnique({
      where: { id: replacementTargetId },
      select: {
        order: {
          select: { paymentMethod: true },
        },
      },
    });

    // ถ้าเจอข้อมูล ให้เอาค่ามาใส่ตัวแปร
    if (originalItem) {
      originalPaymentMethod = originalItem.order.paymentMethod;
    }
  }
  // ... (Logic เช็คสิทธิ์รีวิวของคุณ ถูกต้องแล้วครับ) ...
  let canReview = false;
  if (userId) {
    const successfulOrder = await db.orderItem.findFirst({
      where: {
        productId: id,
        order: { userId: userId, status: "COMPLETED" },
      },
    });
    const existingReview = await db.review.findFirst({
      where: { userId: userId, productId: id },
    });
    canReview = !!successfulOrder && !existingReview;
  }
  // ... (จบ Logic รีวิว) ...

  const sortedImages = [...product.ProductImage]
    .sort((a, b) => Number(b.isMain) - Number(a.isMain))
    .map((image) => ({
      id: image.id,
      url: image.url,
      isMain: image.isMain,
    }));

  const images = sortedImages.length
    ? sortedImages
    : [{ id: "fallback-image", url: FALLBACK_IMAGE, isMain: true }];

  const mainImageUrl =
    images.find((image) => image.isMain)?.url ??
    product.mainImage?.url ??
    images[0].url;

  const weights = [...product.ProductWeight]
    .map((weight) => ({
      id: weight.id,
      weight: weight.weight,
      price: weight.price,
      basePrice: weight.basePrice,
      name: weight.name, // ✅ เพิ่มชื่อหน่วย
    }))
    .sort((a, b) => a.weight - b.weight);

  const productDetail: ProductDetailPayload = {
    id: product.id,
    title: product.title,
    description: product.description,
    type: product.type as "WEIGHT" | "UNIT", // ✅ กำหนดประเภทสินค้า
    unitLabel: product.unitLabel, // ✅ กำหนดชื่อหน่วย
    cod: product.cod,
    stock: product.stock,
    lowStock: product.lowStock,
    categoryName: product.category?.name ?? null,
    mainImageUrl: mainImageUrl ?? FALLBACK_IMAGE,
    images,
    weights,
    averageRating: product.averageRating || 0,
    totalReviews: product.totalReviews || 0,
    reviews: product.reviews || [],
  };

  return (
    <ProductDetail
      product={productDetail}
      userId={userId}
      isAuthenticated={Boolean(userId)}
      canReview={canReview}
      // 🟢 6. ส่งค่าสุดท้ายเข้า Component หน้าจอ
      replacementTargetId={replacementTargetId}
      // 3. ส่งค่าวิธีชำระเงินเดิมไปหน้าจอ
      originalPaymentMethod={originalPaymentMethod}
      defaultAddressId={defaultAddressId}
    />
  );
}
