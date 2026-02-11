"use server";

import { assertAdminUser } from "@/lib/admin-auth";
import {
  createSpinPackage,
  updateSpinPackage,
  deleteSpinPackage,
} from "@/services/spin-packages";
import { uploadToImageKit } from "@/lib/imagekit";
import { revalidatePath } from "next/cache";
import { SpinPackageStatus } from "@/generated/prisma/enums";

export async function createSpinPackageAction(formData: FormData) {
  const userId = await assertAdminUser();
  if (!userId) {
    return { success: false, message: "ไม่มีสิทธิ์" };
  }

  const file = formData.get("file") as File | null;
  const name = (formData.get("name") as string) || "";
  const spinAmount = parseInt(formData.get("spinAmount") as string) || 0;
  const price = parseFloat(formData.get("price") as string) || 0;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  const status = (formData.get("status") as SpinPackageStatus) || SpinPackageStatus.ACTIVE;

  // Validation
  if (!file) {
    return { success: false, message: "กรุณาเลือกรูปภาพ" };
  }

  if (!name.trim()) {
    return { success: false, message: "กรุณากรอกชื่อแพคเกจ" };
  }

  if (spinAmount <= 0) {
    return { success: false, message: "จำนวนครั้งต้องมากกว่า 0" };
  }

  if (price <= 0) {
    return { success: false, message: "ราคาต้องมากกว่า 0" };
  }

  const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (!validTypes.includes(file.type)) {
    return { success: false, message: "รองรับเฉพาะ PNG, JPG, WEBP" };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { success: false, message: "ไฟล์ใหญ่เกิน 5MB" };
  }

  try {
    const res = await uploadToImageKit(file, "weed_store/spin_packages");
    if (!res.url || !res.fileId) {
      return { success: false, message: "อัพโหลดไม่สำเร็จ" };
    }

    const spinPackage = await createSpinPackage({
      name,
      spinAmount,
      price,
      imageUrl: res.url,
      fileId: res.fileId,
      status,
      sortOrder,
    });

    revalidatePath("/admin/spin-packages");
    revalidatePath("/spin");

    return { success: true, package: spinPackage, message: "สร้างสำเร็จ" };
  } catch (error) {
    console.error("createSpinPackageAction error:", error);
    return { success: false, message: "เกิดข้อผิดพลาด" };
  }
}

export async function updateSpinPackageAction(
  id: string,
  data: {
    name?: string;
    spinAmount?: number;
    price?: number;
    status?: SpinPackageStatus;
    sortOrder?: number;
  }
) {
  try {
    await assertAdminUser();

    // Validation
    if (data.spinAmount !== undefined && data.spinAmount <= 0) {
      return { success: false, message: "จำนวนครั้งต้องมากกว่า 0" };
    }

    if (data.price !== undefined && data.price <= 0) {
      return { success: false, message: "ราคาต้องมากกว่า 0" };
    }

    await updateSpinPackage(id, data);

    revalidatePath("/admin/spin-packages");
    revalidatePath("/spin");

    return { success: true, message: "อัพเดตสำเร็จ" };
  } catch (error) {
    console.error("updateSpinPackageAction error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "เกิดข้อผิดพลาด",
    };
  }
}

export async function uploadPackageImageAction(id: string, formData: FormData) {
  const userId = await assertAdminUser();
  if (!userId) {
    return { success: false, message: "ไม่มีสิทธิ์" };
  }

  const file = formData.get("file") as File | null;

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
    const res = await uploadToImageKit(file, "weed_store/spin_packages");
    if (!res.url || !res.fileId) {
      return { success: false, message: "อัพโหลดไม่สำเร็จ" };
    }

    await updateSpinPackage(id, {
      imageUrl: res.url,
      fileId: res.fileId,
    });

    revalidatePath("/admin/spin-packages");
    revalidatePath("/spin");

    return { success: true, message: "อัพโหลดสำเร็จ" };
  } catch (error) {
    console.error("uploadPackageImageAction error:", error);
    return { success: false, message: "เกิดข้อผิดพลาด" };
  }
}

export async function deleteSpinPackageAction(id: string) {
  try {
    await assertAdminUser();

    // Delete package from database
    await deleteSpinPackage(id);

    // Note: ImageKit images are not automatically deleted
    // They can be manually cleaned up from ImageKit dashboard if needed

    revalidatePath("/admin/spin-packages");
    revalidatePath("/spin");

    return { success: true, message: "ลบสำเร็จ" };
  } catch (error) {
    console.error("deleteSpinPackageAction error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "เกิดข้อผิดพลาด",
    };
  }
}
