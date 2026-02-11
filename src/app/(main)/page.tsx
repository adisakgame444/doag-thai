import { Suspense } from "react";

import FeatureProducts from "@/components/home/feature-products";
import Hero from "@/components/home/hero";
// import RecommendedBanner from "@/components/home/recommended-banner";
import { BannerSkeleton } from "@/components/skeletons/banner-skeleton";
import { HomeFeatureSkeleton } from "@/components/skeletons/home-feature-skeleton";
import { Metadata } from "next";

export const metadata: Metadata = {
  // title: "หน้าแรก",
  title: {
    absolute: "Doag Thai",
  },
  description:
    "ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!",
  openGraph: {
    title: "Doag Thai - สมุนไพรครบวงจร",
    description:
      "Green Up ลดสูงสุด 50%! ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!",
    url: "https://www.doag-thai.com",
    siteName: "Doag Thai",
    images: [
      {
        url: "https://www.doag-thai.com/images/TK-image1.webp",
        width: 1200,
        height: 630,
        alt: "Doag Thai โปรโมชั่น Green Up ลดสูงสุด 50%",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Doag Thai - สมุนไพรครบวงจร",
    description:
      "Green Up ลดสูงสุด 50%! ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!",
    images: [
      { url: "https://www.doag-thai.com/images/TK-image1.webp" },
    ],
  },
};

export default function MainPage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Suspense
        fallback={<BannerSkeleton className="container mx-auto px-4 py-6" />}
      >
        {/* <RecommendedBanner /> */}
      </Suspense>
      <Suspense fallback={<HomeFeatureSkeleton />}>
        <FeatureProducts />
      </Suspense>
    </div>
  );
}
