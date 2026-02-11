// import dayjs from "@/lib/dayjs";

// import { getRecommendedBanners } from "@/lib/recommended-banners";
// import { Card, CardContent } from "@/components/ui/card";
// import { UpdateBannerDialog } from "./dialogs/update-banner-dialog";
// import { DeleteBannerDialog } from "./dialogs/delete-banner-dialog";
// import { ReorderBannerDialog } from "./dialogs/reorder-banner-dialog";
// import { CreateBannerDialog } from "./dialogs/create-banner-dialog";

// export default async function BannerList() {
//   const banners = await getRecommendedBanners();

//   if (!banners.length) {
//     return (
//       <Card className="border-dashed">
//         <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
//           <div className="space-y-2">
//             <h2 className="text-lg font-semibold text-foreground">
//               ยังไม่มีแบนเนอร์
//             </h2>
//             <p className="text-sm text-muted-foreground">
//               เพิ่มแบนเนอร์แรกเพื่อดึงดูดลูกค้าบนหน้าแรก
//             </p>
//           </div>
//           <CreateBannerDialog />
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-end">
//         <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
//           <ReorderBannerDialog />
//           <CreateBannerDialog />
//         </div>
//       </div>

//       <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
//         {/* ห่อ table ด้วย div เลื่อนแนวนอน */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-border/70 text-sm">
//             <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
//               <tr>
//                 <th className="px-4 py-3 text-left">ภาพ</th>
//                 <th className="px-4 py-3 text-left">ชื่อ</th>
//                 <th className="px-4 py-3 text-left">สร้างเมื่อ</th>
//                 <th className="px-4 py-3 text-right">จัดการ</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-border/60 bg-card">
//               {banners.map((banner) => (
//                 <tr key={banner.id}>
//                   <td className="px-4 py-3">
//                     <div className="h-16 w-28 overflow-hidden rounded-lg border border-border/60 bg-muted/40">
//                       {/* eslint-disable-next-line @next/next/no-img-element */}
//                       <img
//                         src={banner.imageUrl}
//                         alt={banner.name ?? "banner"}
//                         className="h-full w-full object-cover"
//                       />
//                     </div>
//                   </td>
//                   <td className="px-4 py-3 align-top">
//                     <div className="flex flex-col gap-1">
//                       <span className="font-medium text-foreground">
//                         {banner.name ?? "ไม่ระบุชื่อ"}
//                       </span>
//                       <span className="text-xs text-muted-foreground">
//                         ID: {banner.id}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="px-4 py-3 text-muted-foreground">
//                     {dayjs(banner.createdAt).format("LLL")}
//                   </td>
//                   <td className="px-4 py-3 text-right">
//                     <div className="flex justify-end gap-2">
//                       <UpdateBannerDialog banner={banner} />
//                       <DeleteBannerDialog
//                         bannerId={banner.id}
//                         bannerName={banner.name}
//                       />
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

import dayjs from "@/lib/dayjs";

import { getRecommendedBanners } from "@/lib/recommended-banners";
import { Card, CardContent } from "@/components/ui/card";
import { UpdateBannerDialog } from "./dialogs/update-banner-dialog";
import { DeleteBannerDialog } from "./dialogs/delete-banner-dialog";
import { ReorderBannerDialog } from "./dialogs/reorder-banner-dialog";
import { CreateBannerDialog } from "./dialogs/create-banner-dialog";

export default async function BannerList() {
  const banners = await getRecommendedBanners();

  if (!banners.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">
              ยังไม่มีแบนเนอร์
            </h2>
            <p className="text-sm text-muted-foreground">
              เพิ่มแบนเนอร์แรกเพื่อดึงดูดลูกค้าบนหน้าแรก
            </p>
          </div>
          <CreateBannerDialog />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <ReorderBannerDialog />
          <CreateBannerDialog />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border/70 text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">ภาพ</th>
                <th className="px-4 py-3 text-left">ชื่อ</th>
                <th className="px-4 py-3 text-left">สร้างเมื่อ</th>
                <th className="px-4 py-3 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 bg-card">
              {banners.map((banner: (typeof banners)[0]) => (
                <tr key={banner.id}>
                  <td className="px-4 py-3">
                    <div className="h-16 w-28 overflow-hidden rounded-lg border border-border/60 bg-muted/40">
                      <img
                        src={banner.imageUrl}
                        alt={banner.name ?? "banner"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-foreground">
                        {banner.name ?? "ไม่ระบุชื่อ"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ID: {banner.id}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {dayjs(banner.createdAt).format("LLL")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <UpdateBannerDialog banner={banner} />
                      <DeleteBannerDialog
                        bannerId={banner.id}
                        bannerName={banner.name}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
