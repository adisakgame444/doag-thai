import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import {
  getSpinHistoryByUserId,
  getSpinHistoryStatsByUserId,
} from "@/services/spins";
import { normalizePagination, createPaginationMeta } from "@/lib/pagination";
import SpinHistoryList from "./spin-history-list";
import { PaginationControls } from "@/components/pagination/pagination-controls";

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
    { defaultPageSize: pageSize }
  );

  const [history, stats] = await Promise.all([
    getSpinHistoryByUserId(session.user.id, { limit: take, skip }),
    getSpinHistoryStatsByUserId(session.user.id),
  ]);

  const meta = createPaginationMeta(stats.totalCount, { page, pageSize });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">ประวัติการหมุนสปิน</h1>
        <p className="text-muted-foreground">
          ดูประวัติการหมุนสปินและผลลัพธ์ทั้งหมด ({stats.totalCount.toLocaleString()} รายการ)
        </p>
      </div>

      <SpinHistoryList
        history={history}
        totalCount={stats.totalCount}
        winCount={stats.winCount}
        loseCount={stats.loseCount}
        currentPage={page}
        pageSize={pageSize}
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
