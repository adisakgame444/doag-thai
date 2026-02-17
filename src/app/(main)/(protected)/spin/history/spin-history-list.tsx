// "use client";

// import Link from "next/link";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Trophy, X, RotateCw } from "lucide-react";
// import dayjs from "@/lib/dayjs";
// import { useMemo } from "react";

// type SpinHistory = {
//   id: string;
//   slotIndex: number;
//   result: string;
//   prizeName: string | null;
//   createdAt: string; // ISO string from server
// };

// interface SpinHistoryListProps {
//   history: SpinHistory[];
//   slotImages: Array<{ id: string; imageUrl: string; label: string }>;
//   totalCount: number;
//   winCount: number;
//   loseCount: number;
//   currentPage?: number;
//   pageSize?: number;
// }

// export default function SpinHistoryList({
//   history,
//   totalCount,
//   winCount,
//   loseCount,
//   currentPage = 1,
//   pageSize = 20,
// }: SpinHistoryListProps) {
//   const winRate = totalCount > 0 ? ((winCount / totalCount) * 100).toFixed(1) : "0";
//   const getPrizeImage = (slotIndex: number) => {
//     // ต้องมั่นใจว่า logic การเรียง slotImages ตรงกับตอนหมุน (sortOrder)
//     return slotImages[slotIndex]?.imageUrl || null;
//   };
//   const winningHistory = useMemo(() =>
//     history.filter(h => h.result === "WIN"),
//   [history]);

//   if (history.length === 0) {
//     return (
//       <Card>
//         <CardContent className="py-12 text-center">
//           <RotateCw className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
//           <p className="text-muted-foreground mb-4">
//             คุณยังไม่มีประวัติการหมุนสปิน
//           </p>
//           <Link href="/game">
//             <Button>
//               <RotateCw className="w-4 h-4 mr-2" />
//               เล่นเกมสปิน
//             </Button>
//           </Link>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <Card>
//           <CardContent className="p-4">
//             <div className="text-center">
//               <p className="text-sm text-muted-foreground">ทั้งหมด</p>
//               <p className="text-3xl font-bold">{totalCount}</p>
//               <p className="text-xs text-muted-foreground">ครั้ง</p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-green-500 bg-green-50 dark:bg-green-950">
//           <CardContent className="p-4">
//             <div className="text-center">
//               <p className="text-sm text-muted-foreground">ชนะ</p>
//               <p className="text-3xl font-bold text-green-600 dark:text-green-400">
//                 {winCount}
//               </p>
//               <p className="text-xs text-muted-foreground">
//                 อัตราชนะ {winRate}%
//               </p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-gray-500 bg-gray-50 dark:bg-gray-950">
//           <CardContent className="p-4">
//             <div className="text-center">
//               <p className="text-sm text-muted-foreground">แพ้</p>
//               <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">
//                 {loseCount}
//               </p>
//               <p className="text-xs text-muted-foreground">ครั้ง</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* History Table */}
//       <Card>
//         <CardContent className="p-0">
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="w-[25%] text-center">ลำดับ</TableHead>
//                   <TableHead className="w-[25%] text-center">ผลลัพธ์</TableHead>
//                   <TableHead className="w-[25%] text-center">รางวัล</TableHead>
//                   <TableHead className="w-[25%] text-center">วันที่</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {history.map((item, index) => {
//                   // หน้าแรก: 1, 2, 3... 20
//                   // หน้าสอง: 21, 22, 23... 40
//                   const displayIndex = (currentPage - 1) * pageSize + index + 1;

//                   return (
//                     <TableRow key={item.id}>
//                       <TableCell className="font-medium text-center">
//                         #{displayIndex}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {item.result === "WIN" ? (
//                           <Badge className="bg-green-500">
//                             <Trophy className="w-3 h-3 mr-1" />
//                             ชนะ
//                           </Badge>
//                         ) : (
//                           <Badge variant="secondary" className="bg-gray-500">
//                             <X className="w-3 h-3 mr-1" />
//                             ไม่ชนะ
//                           </Badge>
//                         )}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {item.prizeName || (
//                           <span className="text-muted-foreground">-</span>
//                         )}
//                       </TableCell>
//                       <TableCell className="text-sm text-muted-foreground text-center">
//                         {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm:ss")}
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Trophy,
  X,
  RotateCw,
  PackageOpen,
  History as HistoryIcon,
  Skull,
  Zap,
  Gamepad2,
} from "lucide-react";
import dayjs from "@/lib/dayjs";
import { ClaimRewardDialog } from "../claim-reward-dialog"; // ✅ import เข้ามา

type SpinHistory = {
  id: string;
  slotIndex: number;
  result: string;
  prizeName: string | null;
  createdAt: string;
  isClaimed?: boolean; // ✅ ใส่ ? เพื่อให้เป็น Optional (ไม่ต้องมีก็ได้)
  claimOrderId?: string | null; // ✅ ใส่ ? ไว้ด้วยเพื่อความปลอดภัย
};

// ✅ รับ Prop slotImages เพิ่ม
interface SpinHistoryListProps {
  history: SpinHistory[];
  slotImages: Array<{ id: string; imageUrl: string; label: string }>;
  totalCount: number;
  winCount: number;
  loseCount: number;
  currentPage?: number;
  pageSize?: number;
  currentUserId: string; // ✅ 1. เพิ่มบรรทัดนี้เพื่อรับ ID ของคนเล่น
}

export default function SpinHistoryList({
  history,
  slotImages,
  totalCount,
  winCount,
  loseCount,
  currentPage = 1,
  pageSize = 20,
  currentUserId, // ✅ 2. ดึงออกมาใช้งาน
}: SpinHistoryListProps) {
  const winRate =
    totalCount > 0 ? ((winCount / totalCount) * 100).toFixed(1) : "0";

  // ฟังก์ชันหา Image URL จาก slotIndex
  const getPrizeImage = (slotIndex: number) => {
    // ต้องมั่นใจว่า logic การเรียง slotImages ตรงกับตอนหมุน (sortOrder)
    return slotImages[slotIndex]?.imageUrl || null;
  };

  // กรองเฉพาะรายการที่ชนะเพื่อโชว์ในแท็บ Inventory
  const winningHistory = useMemo(
    () => history.filter((h) => h.result === "WIN"),
    [history],
  );

  if (history.length === 0) {
    return (
      // <Card>
      //   <CardContent className="py-12 text-center">
      //     <RotateCw className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
      //     <p className="text-muted-foreground mb-4">
      //       คุณยังไม่มีประวัติการหมุนสปิน
      //     </p>
      //     <Link href="/game">
      //       <Button>
      //         <RotateCw className="w-4 h-4 mr-2" />
      //         เล่นเกมสปิน
      //       </Button>
      //     </Link>
      //   </CardContent>
      // </Card>
      <Card className="border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-[#f8fafc] overflow-hidden relative">
        {/* ลวดลายตกแต่งพื้นหลัง (Pixel Pattern) */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        ></div>

        <CardContent className="py-16 text-center flex flex-col items-center justify-center relative z-10">
          {/* ไอคอนในกล่องพิกเซล */}
          <div className="w-24 h-24 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-6 rotate-3 hover:rotate-6 transition-transform duration-300">
            <Gamepad2 className="w-12 h-12 text-slate-400" />
          </div>

          <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-2">
            NO HISTORY FOUND
          </h3>

          <p className="text-muted-foreground font-medium mb-8 bg-white border-2 border-slate-200 px-4 py-1 rounded-full shadow-sm">
            คุณยังไม่มีประวัติการหมุนสปิน
          </p>

          <Link href="/game">
            <Button className="h-14 px-8 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xl border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:shadow-none active:translate-y-1 transition-all uppercase">
              <RotateCw className="w-6 h-6 mr-3 animate-spin-slow" />
              PRESS START
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards (คงเดิมไว้ สวยแล้ว) */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* --- Card 1: รางวัลที่ได้ (Small Box - Top Left) --- */}
        <Card className="col-span-1 border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-green-50 relative overflow-hidden group hover:-translate-y-1 transition-all">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-green-600" />
          </div>
          <CardContent className="p-3 sm:p-4 flex flex-col items-center justify-center relative z-10 h-full">
            <div className="flex items-center gap-1 sm:gap-2 mb-1">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" />
              <p className="text-[10px] sm:text-sm font-bold uppercase tracking-widest text-green-700">
                VICTORY
              </p>
            </div>
            <p className="text-3xl sm:text-5xl font-black text-green-600 tracking-tighter drop-shadow-sm">
              {winCount}
            </p>
            <div className="mt-1 flex flex-col sm:flex-row items-center gap-1 bg-green-200 px-2 py-0.5 rounded-sm border border-green-700/50">
              <span className="text-[9px] sm:text-[10px] font-black text-green-800 uppercase">
                Win Rate
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-green-900">
                {winRate}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* --- Card 2: เกลือ (Small Box - Top Right) --- */}
        <Card className="col-span-1 border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-slate-50 relative overflow-hidden group hover:-translate-y-1 transition-all">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Skull className="w-12 h-12 sm:w-16 sm:h-16 text-slate-600" />
          </div>
          <CardContent className="p-3 sm:p-4 flex flex-col items-center justify-center relative z-10 h-full">
            <div className="flex items-center gap-1 sm:gap-2 mb-1">
              <p className="text-[10px] sm:text-sm font-bold uppercase tracking-widest text-slate-500">
                SALT / FAIL
              </p>
            </div>
            <p className="text-3xl sm:text-5xl font-black text-slate-500 tracking-tighter">
              {loseCount}
            </p>
            <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1 font-bold bg-slate-200 px-2 py-0.5 rounded-sm border border-slate-300">
              เกลือล้วนๆ
            </p>
          </CardContent>
        </Card>

        {/* --- Card 3: หมุนทั้งหมด (Large Box - Bottom Full Width) --- */}
        <Card className="col-span-2 border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white relative overflow-hidden group hover:-translate-y-1 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Gamepad2 className="w-24 h-24 sm:w-32 sm:h-32" />
          </div>
          {/* จัด Layout แนวนอนสำหรับกล่องใหญ่ */}
          <CardContent className="p-4 sm:p-6 flex flex-row items-center justify-between relative z-10">
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-black animate-pulse"></div>
                <p className="text-sm sm:text-lg font-bold uppercase tracking-widest text-muted-foreground">
                  TOTAL SPINS HISTORY
                </p>
              </div>
              <p className="text-xs text-muted-foreground bg-slate-100 px-2 py-1 rounded-sm border border-slate-300">
                สถิติการหมุนทั้งหมดของคุณ
              </p>
            </div>

            <div className="text-right">
              <p className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tighter leading-none">
                {totalCount}
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-400 uppercase mr-1">
                Times
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ✅ ส่วน Tab แยกมุมมอง */}
      <Tabs defaultValue="rewards" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 h-16 bg-slate-200 border-4 border-black p-1.5 rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          {/* ปุ่ม 1: รางวัลของฉัน */}
          <TabsTrigger
            value="rewards"
            className="group flex items-center justify-center gap-2 h-full font-black text-sm sm:text-base uppercase text-slate-500 rounded-none transition-all 
          border-2 border-transparent  /* ✅ เพิ่มตรงนี้: จองพื้นที่ขอบไว้ก่อนกันกระตุก */
          data-[state=active]:bg-yellow-400 
          data-[state=active]:text-black 
          data-[state=active]:border-black /* เปลี่ยนแค่สี ไม่เปลี่ยนขนาด */
          data-[state=active]:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] 
          data-[state=active]:-translate-y-1"
          >
            <PackageOpen className="w-5 h-5 group-data-[state=active]:animate-bounce" />
            รางวัลของฉัน
          </TabsTrigger>

          {/* ปุ่ม 2: ประวัติทั้งหมด */}
          <TabsTrigger
            value="history"
            className="group flex items-center justify-center gap-2 h-full font-black text-sm sm:text-base uppercase text-slate-500 rounded-none transition-all 
          border-2 border-transparent /* ✅ เพิ่มตรงนี้: จองพื้นที่ขอบไว้ก่อนกันกระตุก */
          data-[state=active]:bg-white 
          data-[state=active]:text-black 
          data-[state=active]:border-black /* เปลี่ยนแค่สี ไม่เปลี่ยนขนาด */
          data-[state=active]:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] 
          data-[state=active]:-translate-y-1"
          >
            <HistoryIcon className="w-5 h-5 group-data-[state=active]:animate-spin-slow" />
            ประวัติทั้งหมด
          </TabsTrigger>
        </TabsList>

        {/* 🟢 Tab 1: Rewards Grid (สินค้าที่หมุนได้) */}
        {/* 🟢 Tab 1: Rewards Grid (Style: เหมือนรูป Reference แต่เป็น Pixel) */}
        {/* 🟢 Tab 1: Rewards Grid (แก้ไข: ปุ่มรับแล้วให้เป็นสีแดง) */}
        <TabsContent value="rewards">
          {winningHistory.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {winningHistory.map((item) => {
                const imgUrl = getPrizeImage(item.slotIndex);
                const isClaimed = !!item.isClaimed;

                return (
                  <div
                    key={item.id}
                    className="group relative flex flex-col bg-white border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 overflow-hidden"
                  >
                    {/* --- 1. Image Section --- */}
                    <div className="relative aspect-square w-full bg-slate-100 border-b-4 border-black">
                      {/* ป้าย WIN สีแดง (โชว์ตลอด) */}
                      <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-black px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-6">
                        WIN!
                      </div>

                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt={item.prizeName || "Reward"}
                          fill
                          className={`object-contain p-4 transition-transform duration-300 ${!isClaimed ? "group-hover:scale-110" : ""}`}
                          style={{ imageRendering: "pixelated" }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          🎁
                        </div>
                      )}

                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[9px] px-2 py-0.5 rounded-full font-mono backdrop-blur-sm">
                        {dayjs(item.createdAt).format("HH:mm")}
                      </div>
                    </div>

                    {/* --- 2. Content Section --- */}
                    <div className="p-3 flex flex-col gap-1 flex-1">
                      <div className="flex justify-start">
                        {/* Tag สถานะ: ถ้าเคลมแล้วเป็นสีแดง */}
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-bold border rounded-md ${isClaimed ? "bg-red-100 text-red-700 border-red-500" : "bg-emerald-100 text-emerald-700 border-emerald-500"}`}
                        >
                          {isClaimed ? "Used / Claimed" : "Item Drop"}
                        </span>
                      </div>

                      <h3
                        className="font-black text-sm sm:text-base truncate uppercase mt-1 text-slate-900"
                        title={item.prizeName || ""}
                      >
                        {item.prizeName || "Mystery Item"}
                      </h3>

                      <div className="flex items-center gap-1 mt-auto pt-2">
                        {/* จุดสี: ถ้าเคลมแล้วเป็นสีแดง */}
                        <div
                          className={`w-1 h-3 rounded-full ${isClaimed ? "bg-red-500" : "bg-emerald-500"}`}
                        ></div>
                        <p className="text-[10px] text-muted-foreground font-bold">
                          {dayjs(item.createdAt).format("D MMM YYYY")}
                        </p>
                      </div>
                    </div>

                    {/* --- 3. Button Section --- */}
                    <div className="p-3 pt-0 mt-auto">
                      <div className="w-full">
                        {isClaimed ? (
                          // 🟥 Case 1: รับไปแล้ว (ปุ่มสีแดง ตามสั่ง)
                          <div className="relative group/btn cursor-not-allowed opacity-90">
                            <div className="absolute inset-0 bg-black rounded-lg translate-y-0.5 translate-x-0.5"></div>
                            <div className="relative bg-red-500 border-2 border-black rounded-lg p-2 text-center text-white font-black text-xs uppercase flex items-center justify-center gap-1">
                              <X className="w-4 h-4" />{" "}
                              {/* อย่าลืม import X จาก lucide-react */}
                              รับรางวัลแล้ว
                            </div>
                          </div>
                        ) : (
                          // 🟩 Case 2: ยังไม่รับ (ปุ่มสีเขียว)
                          <div className="relative group/btn">
                            <div className="absolute inset-0 bg-black rounded-lg translate-y-1 translate-x-1"></div>
                            <div className="relative bg-emerald-500 hover:bg-emerald-400 border-2 border-black rounded-lg p-0 text-center transition-transform active:translate-y-1 active:translate-x-1 cursor-pointer">
                              <ClaimRewardDialog
                                historyId={item.id}
                                prizeName={item.prizeName || "ของรางวัล"}
                                userId={currentUserId}
                                isClaimed={isClaimed}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 border-4 border-dashed border-slate-300 rounded-xl">
              <PackageOpen className="w-12 h-12 text-slate-400 opacity-50 mx-auto mb-2" />
              <p className="text-muted-foreground font-bold">
                ยังไม่มีของรางวัลในกระเป๋า
              </p>
            </div>
          )}
        </TabsContent>

        {/* ⚪ Tab 2: All History Table (ตารางเดิมของคุณ) */}
        {/* <TabsContent value="history">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[15%] text-center">
                        เวลา
                      </TableHead>
                      <TableHead className="w-[15%] text-center">
                        รูปที่ออก
                      </TableHead>
                      <TableHead className="w-[20%] text-center">
                        ผลลัพธ์
                      </TableHead>
                      <TableHead className="w-[50%]">รางวัล</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((item) => {
                      const imgUrl = getPrizeImage(item.slotIndex);
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="text-center text-xs text-muted-foreground">
                            <div>
                              {dayjs(item.createdAt).format("DD/MM/YY")}
                            </div>
                            <div>{dayjs(item.createdAt).format("HH:mm")}</div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="w-10 h-10 relative mx-auto bg-slate-100 dark:bg-slate-800 rounded-md">
                              {imgUrl && (
                                <Image
                                  src={imgUrl}
                                  alt="result"
                                  fill
                                  className="object-contain p-1"
                                />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {item.result === "WIN" ? (
                              <Badge className="bg-green-500 hover:bg-green-600">
                                ชนะ
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-muted-foreground"
                              >
                                แพ้
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <span
                              className={
                                item.result === "WIN"
                                  ? "font-bold text-green-600"
                                  : "text-muted-foreground"
                              }
                            >
                              {item.prizeName || "-"}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
        {/* ⚪ Tab 2: All History Table (Retro Leaderboard Style) */}
        <TabsContent value="history">
          {/* ✅ 1. Card Container: เปลี่ยน rounded-none เป็น rounded-xl (มุมมน) */}
          <Card className="border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  {/* Header สีดำ */}
                  <TableHeader className="bg-black border-b-4 border-black">
                    <TableRow className="hover:bg-black">
                      <TableHead className="w-[20%] text-center text-white font-black uppercase tracking-wider py-4">
                        TIME
                      </TableHead>
                      <TableHead className="w-[15%] text-center text-white font-black uppercase tracking-wider">
                        ICON
                      </TableHead>
                      <TableHead className="w-[20%] text-center text-white font-black uppercase tracking-wider">
                        RESULT
                      </TableHead>
                      <TableHead className="w-[45%] text-white font-black uppercase tracking-wider pl-4">
                        REWARD ITEM
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {history.map((item, index) => {
                      const imgUrl = getPrizeImage(item.slotIndex);
                      // สลับสีพื้นหลังแถว (Zebra Striping)
                      const rowClass =
                        index % 2 === 0 ? "bg-white" : "bg-yellow-50";

                      return (
                        <TableRow
                          key={item.id}
                          className={`${rowClass} border-b-2 border-slate-200 hover:bg-blue-50 transition-colors font-medium`}
                        >
                          {/* 1. Time Column */}
                          <TableCell className="text-center">
                            <div className="font-bold text-slate-900 text-xs sm:text-sm font-mono">
                              {dayjs(item.createdAt).format("DD/MM/YY")}
                            </div>
                            <div className="text-[10px] text-muted-foreground font-mono">
                              {dayjs(item.createdAt).format("HH:mm:ss")}
                            </div>
                          </TableCell>

                          {/* 2. Icon Column */}
                          <TableCell className="text-center">
                            {/* ✅ 3. Icon Box: เปลี่ยน rounded-sm เป็น rounded-md */}
                            <div className="w-8 h-8 sm:w-10 sm:h-10 relative mx-auto bg-white border-2 border-black rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] overflow-hidden">
                              {imgUrl && (
                                <Image
                                  src={imgUrl}
                                  alt="result"
                                  fill
                                  className="object-contain p-1"
                                  style={{ imageRendering: "pixelated" }}
                                />
                              )}
                            </div>
                          </TableCell>

                          {/* 3. Result Column */}
                          <TableCell className="text-center">
                            {item.result === "WIN" ? (
                              // ✅ 2. Badge WIN: เปลี่ยน rounded-none เป็น rounded-md
                              <Badge className="bg-green-500 hover:bg-green-600 text-[10px] sm:text-xs border-2 border-black text-white rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
                                WIN
                              </Badge>
                            ) : (
                              // ✅ 2. Badge LOSE: เปลี่ยน rounded-none เป็น rounded-md
                              <Badge
                                variant="outline"
                                className="text-slate-500 bg-slate-100 text-[10px] sm:text-xs border-2 border-slate-300 rounded-md uppercase"
                              >
                                LOSE
                              </Badge>
                            )}
                          </TableCell>

                          {/* 4. Reward Name Column */}
                          <TableCell className="pl-4">
                            <span
                              className={`text-xs sm:text-sm uppercase tracking-tight ${item.result === "WIN" ? "font-black text-green-700" : "font-bold text-slate-400"}`}
                            >
                              {item.prizeName || "-"}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
