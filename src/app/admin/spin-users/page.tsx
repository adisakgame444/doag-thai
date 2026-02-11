import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { getAllUsersWithSpinQuota } from "@/services/spins";
import SpinUsersView from "./spin-users-view";

export const metadata: Metadata = {
  title: "จัดการผู้ใช้สปิน",
  description: "อนุมัติหรือควบคุมการชนะของผู้ใช้",
};

export default async function AdminSpinUsersPage() {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/unauthorized");
  }

  const users = await getAllUsersWithSpinQuota();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">จัดการผู้ใช้สปิน</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          อนุมัติหรือควบคุมการชนะของผู้ใช้
        </p>
      </div>

      <SpinUsersView users={users} />
    </div>
  );
}
