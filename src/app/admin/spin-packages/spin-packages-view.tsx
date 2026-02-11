"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Loader2, Upload } from "lucide-react";
import {
  createSpinPackageAction,
  updateSpinPackageAction,
  uploadPackageImageAction,
  deleteSpinPackageAction,
} from "./actions";
import { SpinPackage } from "@/generated/prisma/client";
import { SpinPackageStatus } from "@/generated/prisma/enums";
import { formatPrice } from "@/lib/format-price";

interface SpinPackagesViewProps {
  packages: SpinPackage[];
}

export default function SpinPackagesView({
  packages: initialPackages,
}: SpinPackagesViewProps) {
  const [packages, setPackages] = useState(initialPackages);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<SpinPackage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Create form state
  const [createName, setCreateName] = useState("");
  const [createSpinAmount, setCreateSpinAmount] = useState("");
  const [createPrice, setCreatePrice] = useState("");
  const [createSortOrder, setCreateSortOrder] = useState("0");
  const [createStatus, setCreateStatus] = useState<SpinPackageStatus>(
    SpinPackageStatus.ACTIVE
  );
  const createFileRef = useRef<HTMLInputElement>(null);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editSpinAmount, setEditSpinAmount] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editSortOrder, setEditSortOrder] = useState("");
  const [editStatus, setEditStatus] = useState<SpinPackageStatus>(
    SpinPackageStatus.ACTIVE
  );

  // Image upload state
  const imageFileRef = useRef<HTMLInputElement>(null);

  const resetCreateForm = () => {
    setCreateName("");
    setCreateSpinAmount("");
    setCreatePrice("");
    setCreateSortOrder("0");
    setCreateStatus(SpinPackageStatus.ACTIVE);
    if (createFileRef.current) {
      createFileRef.current.value = "";
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = createFileRef.current?.files?.[0];
    if (!file) {
      toast.error("กรุณาเลือกรูปภาพ");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", createName);
      formData.append("spinAmount", createSpinAmount);
      formData.append("price", createPrice);
      formData.append("sortOrder", createSortOrder);
      formData.append("status", createStatus);

      const result = await createSpinPackageAction(formData);

      if (result.success && result.package) {
        setPackages([...packages, result.package]);
        toast.success("สร้างแพคเกจสำเร็จ");
        setIsCreateDialogOpen(false);
        resetCreateForm();
      } else {
        toast.error(result.message || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error("Create error:", error);
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (pkg: SpinPackage) => {
    setCurrentPackage(pkg);
    setEditName(pkg.name);
    setEditSpinAmount(pkg.spinAmount.toString());
    setEditPrice(pkg.price.toString());
    setEditSortOrder(pkg.sortOrder.toString());
    setEditStatus(pkg.status);
    setIsEditDialogOpen(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPackage) return;

    setIsLoading(true);
    try {
      const result = await updateSpinPackageAction(currentPackage.id, {
        name: editName,
        spinAmount: parseInt(editSpinAmount),
        price: parseFloat(editPrice),
        sortOrder: parseInt(editSortOrder),
        status: editStatus,
      });

      if (result.success) {
        setPackages(
          packages.map((pkg) =>
            pkg.id === currentPackage.id
              ? {
                  ...pkg,
                  name: editName,
                  spinAmount: parseInt(editSpinAmount),
                  price: parseFloat(editPrice),
                  sortOrder: parseInt(editSortOrder),
                  status: editStatus,
                }
              : pkg
          )
        );
        toast.success("อัพเดตสำเร็จ");
        setIsEditDialogOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Edit error:", error);
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUploadClick = (pkg: SpinPackage) => {
    setCurrentPackage(pkg);
    setIsImageDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentPackage) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadPackageImageAction(currentPackage.id, formData);

      if (result.success) {
        // Refresh the page to get new image
        window.location.reload();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (pkg: SpinPackage) => {
    if (!confirm(`ต้องการลบแพคเกจ "${pkg.name}" หรือไม่?`)) return;

    setIsDeleting(pkg.id);
    try {
      const result = await deleteSpinPackageAction(pkg.id);

      if (result.success) {
        setPackages(packages.filter((p) => p.id !== pkg.id));
        toast.success("ลบสำเร็จ");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Button */}
      <div className="flex justify-end">
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          สร้างแพคเกจใหม่
        </Button>
      </div>

      {/* Packages Table */}
      {packages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">ยังไม่มีแพคเกจสปิน</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>รูปภาพ</TableHead>
                  <TableHead>ชื่อแพคเกจ</TableHead>
                  <TableHead>จำนวนครั้ง</TableHead>
                  <TableHead>ราคา</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>ลำดับ</TableHead>
                  <TableHead className="text-right">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell>
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={pkg.imageUrl}
                          alt={pkg.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{pkg.name}</TableCell>
                    <TableCell>{pkg.spinAmount} ครั้ง</TableCell>
                    <TableCell>{formatPrice(pkg.price)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          pkg.status === SpinPackageStatus.ACTIVE
                            ? "default"
                            : "secondary"
                        }
                      >
                        {pkg.status === SpinPackageStatus.ACTIVE
                          ? "เปิดใช้งาน"
                          : "ปิดใช้งาน"}
                      </Badge>
                    </TableCell>
                    <TableCell>{pkg.sortOrder}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleImageUploadClick(pkg)}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClick(pkg)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(pkg)}
                          disabled={isDeleting === pkg.id}
                        >
                          {isDeleting === pkg.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>สร้างแพคเกจใหม่</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="create-file">รูปภาพ *</Label>
                <Input
                  id="create-file"
                  ref={createFileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, WEBP (สูงสุด 5MB)
                </p>
              </div>
              <div>
                <Label htmlFor="create-name">ชื่อแพคเกจ *</Label>
                <Input
                  id="create-name"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="เช่น แพคเกจ 100 ครั้ง"
                  required
                />
              </div>
              <div>
                <Label htmlFor="create-spinAmount">จำนวนครั้งที่หมุน *</Label>
                <Input
                  id="create-spinAmount"
                  type="number"
                  min="1"
                  value={createSpinAmount}
                  onChange={(e) => setCreateSpinAmount(e.target.value)}
                  placeholder="100"
                  required
                />
              </div>
              <div>
                <Label htmlFor="create-price">ราคา *</Label>
                <Input
                  id="create-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={createPrice}
                  onChange={(e) => setCreatePrice(e.target.value)}
                  placeholder="100.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="create-sortOrder">ลำดับ</Label>
                <Input
                  id="create-sortOrder"
                  type="number"
                  value={createSortOrder}
                  onChange={(e) => setCreateSortOrder(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="create-status">สถานะ</Label>
                <Select
                  value={createStatus}
                  onValueChange={(value) =>
                    setCreateStatus(value as SpinPackageStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SpinPackageStatus.ACTIVE}>
                      เปิดใช้งาน
                    </SelectItem>
                    <SelectItem value={SpinPackageStatus.INACTIVE}>
                      ปิดใช้งาน
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={isLoading}
              >
                ยกเลิก
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    กำลังสร้าง...
                  </>
                ) : (
                  "สร้าง"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>แก้ไขแพคเกจ</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">ชื่อแพคเกจ *</Label>
                <Input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-spinAmount">จำนวนครั้งที่หมุน *</Label>
                <Input
                  id="edit-spinAmount"
                  type="number"
                  min="1"
                  value={editSpinAmount}
                  onChange={(e) => setEditSpinAmount(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-price">ราคา *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-sortOrder">ลำดับ</Label>
                <Input
                  id="edit-sortOrder"
                  type="number"
                  value={editSortOrder}
                  onChange={(e) => setEditSortOrder(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">สถานะ</Label>
                <Select
                  value={editStatus}
                  onValueChange={(value) =>
                    setEditStatus(value as SpinPackageStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SpinPackageStatus.ACTIVE}>
                      เปิดใช้งาน
                    </SelectItem>
                    <SelectItem value={SpinPackageStatus.INACTIVE}>
                      ปิดใช้งาน
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isLoading}
              >
                ยกเลิก
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    กำลังบันทึก...
                  </>
                ) : (
                  "บันทึก"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Image Upload Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>เปลี่ยนรูปภาพ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {currentPackage && (
              <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted">
                <Image
                  src={currentPackage.imageUrl}
                  alt={currentPackage.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <Label htmlFor="image-file">เลือกรูปใหม่</Label>
              <Input
                id="image-file"
                ref={imageFileRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleImageUpload}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, WEBP (สูงสุด 5MB)
              </p>
            </div>
            {isLoading && (
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">กำลังอัพโหลด...</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsImageDialogOpen(false)}
              disabled={isLoading}
            >
              ปิด
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
