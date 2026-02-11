"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Upload, Trash2, Edit2, Loader2 } from "lucide-react";
import {
  uploadSpinSlotImageAction,
  updateSpinSlotImageAction,
  deleteSpinSlotImageAction,
} from "./actions";

type SpinSlotImage = {
  id: string;
  imageUrl: string;
  label: string;
  sortOrder: number;
  isActive: boolean;
};

interface SpinSlotImagesViewProps {
  images: SpinSlotImage[];
}

export default function SpinSlotImagesView({
  images: initialImages,
}: SpinSlotImagesViewProps) {
  const [images, setImages] = useState(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editSortOrder, setEditSortOrder] = useState(0);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("label", file.name.split(".")[0]);

      const result = await uploadSpinSlotImageAction(formData);

      if (result.success && result.image) {
        setImages([...images, result.image]);
        toast.success("อัพโหลดสำเร็จ");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        toast.error(result.message || "อัพโหลดไม่สำเร็จ");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (image: SpinSlotImage) => {
    setEditingId(image.id);
    setEditLabel(image.label);
    setEditSortOrder(image.sortOrder);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      const result = await updateSpinSlotImageAction(editingId, {
        label: editLabel,
        sortOrder: editSortOrder,
      });

      if (result.success) {
        setImages(
          images.map((img) =>
            img.id === editingId
              ? { ...img, label: editLabel, sortOrder: editSortOrder }
              : img
          )
        );
        setEditingId(null);
        toast.success("อัพเดตสำเร็จ");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Edit error:", error);
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบรูปนี้หรือไม่?")) return;

    setIsDeleting(id);
    try {
      const result = await deleteSpinSlotImageAction(id);

      if (result.success) {
        setImages(images.filter((img) => img.id !== id));
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
      {/* Upload Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">
              อัพโหลดรูปภาพสำหรับ Slot Machine
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  กำลังอัพโหลด...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  เลือกไฟล์
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              PNG, JPG, WEBP (สูงสุด 5MB)
            </p>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Images Grid */}
      {images.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">ยังไม่มีรูป Slot</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <Card key={image.id}>
              <CardContent className="pt-4">
                <div className="relative aspect-square w-full mb-4 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={image.imageUrl}
                    alt={image.label}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-sm truncate">{image.label}</p>
                  <p className="text-xs text-muted-foreground">
                    ลำดับ: {image.sortOrder}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(image)}
                      className="flex-1"
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      แก้ไข
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(image.id)}
                      disabled={isDeleting === image.id}
                      className="flex-1"
                    >
                      {isDeleting === image.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-1" />
                          ลบ
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingId} onOpenChange={() => setEditingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>แก้ไขรูป Slot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="label">ชื่อ/ป้ายกำกับ</Label>
              <Input
                id="label"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                placeholder="เช่น 💎, 🍀, ⭐"
              />
            </div>
            <div>
              <Label htmlFor="sortOrder">ลำดับ</Label>
              <Input
                id="sortOrder"
                type="number"
                value={editSortOrder}
                onChange={(e) => setEditSortOrder(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingId(null)}
            >
              ยกเลิก
            </Button>
            <Button onClick={handleSaveEdit}>
              บันทึก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
