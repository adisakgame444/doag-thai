"use server";

import { assertAdminUser } from "@/lib/admin-auth";
import {
  createSpinSlotImage,
  updateSpinSlotImage,
  deleteSpinSlotImage,
} from "@/services/spin-slot-images";
import { uploadToImageKit } from "@/lib/imagekit";
import { revalidatePath } from "next/cache";

export async function uploadSpinSlotImageAction(formData: FormData) {
  const userId = await assertAdminUser();
  if (!userId) {
    return { success: false, message: "ไม่มีสิทธิ์" };
  }

  const file = formData.get("file") as File | null;
  const label = (formData.get("label") as string) || "Slot Image";

  if (!file) {
    return { success: false, message: "ไม่พบไฟล์" };
  }

  const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (!validTypes.includes(file.type)) {
    return { success: false, message: "รองรับเฉพาะ PNG, JPG, WEBP" };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { success: false, message: "ไฟล์ใหญ่เกิน 5MB" };
  }

  try {
    const res = await uploadToImageKit(file, "weed_store/spin_slots");
    if (!res.url || !res.fileId) {
      return { success: false, message: "อัพโหลดไม่สำเร็จ" };
    }

    const image = await createSpinSlotImage({
      imageUrl: res.url,
      fileId: res.fileId,
      label,
    });

    revalidatePath("/admin/spin-slot-images");
    revalidatePath("/game");

    return { success: true, image, message: "อัพโหลดสำเร็จ" };
  } catch (error) {
    console.error("uploadSpinSlotImageAction error:", error);
    return { success: false, message: "เกิดข้อผิดพลาด" };
  }
}

export async function updateSpinSlotImageAction(
  id: string,
  data: { label?: string; sortOrder?: number; isActive?: boolean }
) {
  try {
    await assertAdminUser();
    await updateSpinSlotImage(id, data);
    revalidatePath("/admin/spin-slot-images");
    revalidatePath("/game");
    return { success: true, message: "อัพเดตสำเร็จ" };
  } catch (error) {
    console.error("updateSpinSlotImageAction error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "เกิดข้อผิดพลาด",
    };
  }
}

export async function deleteSpinSlotImageAction(id: string) {
  try {
    await assertAdminUser();
    await deleteSpinSlotImage(id);
    revalidatePath("/admin/spin-slot-images");
    revalidatePath("/game");
    return { success: true, message: "ลบสำเร็จ" };
  } catch (error) {
    console.error("deleteSpinSlotImageAction error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "เกิดข้อผิดพลาด",
    };
  }
}
