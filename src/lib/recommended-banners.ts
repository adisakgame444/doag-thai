// import db from "@/lib/db";
// import { revalidateTag, unstable_cache } from "next/cache";

// export const getRecommendedBanners = unstable_cache(
//   async () => {
//     try {
//       return await db.recommendedBanner.findMany({
//         orderBy: { createdAt: "desc" },
//       });
//     } catch (error) {
//       console.error("[GET_RECOMMENDED_BANNERS]", error);
//       return [];
//     }
//   },
//   ["get-recommended-banners"],
//   { tags: ["recommended-banners"], revalidate: 60 * 30 }
// );

// export async function getRecommendedBannerById(id: string) {
//   try {
//     return await db.recommendedBanner.findUnique({
//       where: { id },
//     });
//   } catch (error) {
//     console.error("[GET_RECOMMENDED_BANNER_BY_ID]", error);
//     return null;
//   }
// }

// export function revalidateRecommendedBanners() {
//   revalidateTag("recommended-banners");
// }

import db from "@/lib/db";
import { updateTag } from "next/cache";

/**
 * ดึงรายการ Recommended Banners
 * - ใช้ฟังก์ชันปกติแทน unstable_cache
 * - ระบบแคชยังทำงานผ่าน revalidateTag("recommended-banners")
 */
export async function getRecommendedBanners() {
  try {
    return await db.recommendedBanner.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("[GET_RECOMMENDED_BANNERS]", error);
    return [];
  }
}

/**
 * ดึงข้อมูล Banner ตาม ID
 */
export async function getRecommendedBannerById(id: string) {
  try {
    return await db.recommendedBanner.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("[GET_RECOMMENDED_BANNER_BY_ID]", error);
    return null;
  }
}

/**
 * ฟังก์ชันสำหรับ Trigger Revalidate หลังจากมีการแก้ไขข้อมูล Banner
 */
export function revalidateRecommendedBanners() {
  updateTag("recommended-banners");
}
