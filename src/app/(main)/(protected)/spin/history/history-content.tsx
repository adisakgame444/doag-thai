import {
  getSpinHistoryByUserId,
  getSpinHistoryStatsByUserId,
} from "@/services/spins";
import { normalizePagination, createPaginationMeta } from "@/lib/pagination";
import SpinHistoryList from "./spin-history-list";
import { PaginationControls } from "@/components/pagination/pagination-controls";
import { getActiveSpinSlotImages } from "@/services/spin-slot-images"; // ✅ เพิ่มอันนี้

interface HistoryContentProps {
  userId: string;
  page?: string;
}

export async function HistoryContent({ userId, page }: HistoryContentProps) {
  const {
    page: currentPage,
    skip,
    take,
  } = normalizePagination({ page }, { defaultPageSize: 20 });

  // Query data
  const [history, stats, slotImages] = await Promise.all([
    getSpinHistoryByUserId(userId, { limit: take, skip }),
    getSpinHistoryStatsByUserId(userId),
    getActiveSpinSlotImages(), // เอาไว้ map รูปภาพ
  ]);

  const meta = createPaginationMeta(stats.totalCount, {
    page: currentPage,
    pageSize: take,
  });

  return (
    <>
      <SpinHistoryList
        history={history}
        slotImages={slotImages} // ✅ ส่งรูปภาพเข้าไป
        totalCount={stats.totalCount}
        winCount={stats.winCount}
        loseCount={stats.loseCount}
        currentPage={currentPage}
        pageSize={take}
        currentUserId={userId}
      />

      {meta.totalPages > 1 && (
        <div className="mt-6">
          <PaginationControls
            meta={meta}
            pathname="/spin/history"
            query={page ? { page } : undefined}
          />
        </div>
      )}
    </>
  );
}
