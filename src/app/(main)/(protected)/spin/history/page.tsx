import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import {
  getSpinHistoryByUserId,
  getSpinHistoryStatsByUserId,
} from "@/services/spins";
import { getActiveSpinSlotImages } from "@/services/spin-slot-images";
import { normalizePagination, createPaginationMeta } from "@/lib/pagination";
import SpinHistoryList from "./spin-history-list";
import { PaginationControls } from "@/components/pagination/pagination-controls";
import { History, ScrollText } from "lucide-react";

export const metadata: Metadata = {
  title: "ประวัติการหมุนสปิน",
  description: "ดูประวัติการหมุนสปินและผลลัพธ์",
};

interface SpinHistoryPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function SpinHistoryPage({
  searchParams,
}: SpinHistoryPageProps) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/sign-in?redirect=/spin/history");
  }

  const pageSize = 50;
  const params = await searchParams;
  const { page, skip, take } = normalizePagination(
    { page: params.page ?? 1 },
    { defaultPageSize: pageSize },
  );

  const [history, stats, slotImages] = await Promise.all([
    getSpinHistoryByUserId(session.user.id, { limit: take, skip }),
    getSpinHistoryStatsByUserId(session.user.id),
    getActiveSpinSlotImages(),
  ]);

  const meta = createPaginationMeta(stats.totalCount, { page, pageSize });

  return (
    <div className="container mx-auto px-3 py-4">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b-4 border-black pb-6">
        {/* Left: Title & Icon */}
        <div className="flex items-center gap-4">
          {/* Icon Box: กล่องเหลืองสไตล์เกม */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center shrink-0 rotate-3 hover:rotate-0 transition-transform">
            <History className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              ประวัติการหมุนสปิน
              {/* จุดกระพริบตกแต่ง */}
              <span className="inline-block w-2 h-2 sm:w-3 sm:h-3 bg-red-500 animate-pulse rounded-none mb-1"></span>
            </h1>
            <p className="text-muted-foreground font-medium flex items-center gap-2 mt-1 text-sm sm:text-base">
              <ScrollText className="w-4 h-4" />
              รายการบันทึกผลลัพธ์ย้อนหลัง
            </p>
          </div>
        </div>

        {/* Right: Count Badge (ป้ายนับจำนวน) */}
        <div className="bg-white border-2 border-black px-3 py-1 sm:px-4 sm:py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 rounded-none self-start sm:self-center">
          <span className="text-[10px] sm:text-xs font-bold uppercase text-slate-500 tracking-wider">
            TOTAL LOGS
          </span>
          <div className="w-px h-4 bg-slate-300 mx-1"></div>
          <span className="text-lg sm:text-xl font-black text-slate-900 leading-none">
            {stats.totalCount.toLocaleString()}
          </span>
        </div>
      </div>

      <SpinHistoryList
        history={history}
        slotImages={slotImages}
        totalCount={stats.totalCount}
        winCount={stats.winCount}
        loseCount={stats.loseCount}
        currentPage={page}
        pageSize={pageSize}
        currentUserId={session.user.id} // ✅ ส่ง ID เข้าไปตรงนี้
      />

      {meta.totalPages > 1 && (
        <div className="mt-6">
          <PaginationControls
            meta={meta}
            pathname="/spin/history"
            query={params.page ? { page: params.page } : undefined}
          />
        </div>
      )}
    </div>
  );
}
