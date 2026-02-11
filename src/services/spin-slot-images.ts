import db from "@/lib/db";

export async function getActiveSpinSlotImages() {
  return db.spinSlotImage.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getAllSpinSlotImages() {
  return db.spinSlotImage.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function createSpinSlotImage(data: {
  imageUrl: string;
  fileId: string;
  label: string;
  sortOrder?: number;
}) {
  return db.spinSlotImage.create({
    data: {
      imageUrl: data.imageUrl,
      fileId: data.fileId,
      label: data.label,
      sortOrder: data.sortOrder ?? 0,
      isActive: true,
    },
  });
}

export async function updateSpinSlotImage(
  id: string,
  data: {
    label?: string;
    sortOrder?: number;
    isActive?: boolean;
  }
) {
  return db.spinSlotImage.update({
    where: { id },
    data,
  });
}

export async function deleteSpinSlotImage(id: string) {
  return db.spinSlotImage.delete({
    where: { id },
  });
}
