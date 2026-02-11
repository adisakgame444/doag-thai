import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { getAllSpinPackages } from "@/services/spin-packages";
import SpinPackagesView from "./spin-packages-view";

export const metadata: Metadata = {
  title: "จัดการแพคเกจสปิน",
  description: "จัดการแพคเกจสปินสำหรับลูกค้า",
};

export default async function AdminSpinPackagesPage() {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/unauthorized");
  }

  const packages = await getAllSpinPackages();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">จัดการแพคเกจสปิน</h1>
        <p className="text-muted-foreground">
          สร้างและจัดการแพคเกจสปินสำหรับลูกค้า
        </p>
      </div>

      <SpinPackagesView packages={packages} />
    </div>
  );
}
