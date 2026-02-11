import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { getAllSpinSlotImages } from "@/services/spin-slot-images";
import SpinSlotImagesView from "./spin-slot-images-view";

export const metadata: Metadata = {
  title: "จัดการรูป Slot Machine",
  description: "อัพโหลดและจัดการรูปภาพสำหรับ Slot Machine",
};

export default async function AdminSpinSlotImagesPage() {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/unauthorized");
  }

  const images = await getAllSpinSlotImages();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">จัดการรูป Slot Machine</h1>
        <p className="text-muted-foreground">
          อัพโหลดและจัดการรูปภาพสำหรับตัวหมุนสปิน
        </p>
      </div>

      <SpinSlotImagesView images={images} />
    </div>
  );
}
