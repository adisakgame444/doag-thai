import db from "@/lib/db";
import { SpinPackageStatus } from "@/generated/prisma/enums";

export async function getAllSpinPackages() {
  return db.spinPackage.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function getActiveSpinPackages() {
  return db.spinPackage.findMany({
    where: { status: SpinPackageStatus.ACTIVE },
    orderBy: { sortOrder: "asc" },
  });
}

export async function createSpinPackage(data: {
  name: string;
  spinAmount: number;
  price: number;
  imageUrl: string;
  fileId: string;
  status?: SpinPackageStatus;
  sortOrder?: number;
}) {
  return db.spinPackage.create({
    data: {
      name: data.name,
      spinAmount: data.spinAmount,
      price: data.price,
      imageUrl: data.imageUrl,
      fileId: data.fileId,
      status: data.status ?? SpinPackageStatus.ACTIVE,
      sortOrder: data.sortOrder ?? 0,
    },
  });
}

export async function updateSpinPackage(
  id: string,
  data: {
    name?: string;
    spinAmount?: number;
    price?: number;
    imageUrl?: string;
    fileId?: string;
    status?: SpinPackageStatus;
    sortOrder?: number;
  }
) {
  return db.spinPackage.update({
    where: { id },
    data,
  });
}

export async function deleteSpinPackage(id: string) {
  return db.spinPackage.delete({
    where: { id },
  });
}
