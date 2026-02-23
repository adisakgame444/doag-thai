"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format-price";
import { SpinPackage } from "@/generated/prisma/client";
import { uploadSpinPaymentSlipAction } from "./actions";
import Image from "next/image";

interface SpinPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spinPackage: SpinPackage;
  onPaymentComplete: (data: {
    paymentMethod: "PROMPTPAY" | "MANUAL_TRANSFER";
    slipUrl?: string;
    slipFileId?: string;
    amount: number;
  }) => void;
  isPending: boolean;
}

export default function SpinPaymentDialog({
  open,
  onOpenChange,
  spinPackage,
  onPaymentComplete,
  isPending,
}: SpinPaymentDialogProps) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<
    "PROMPTPAY" | "MANUAL_TRANSFER"
  >("PROMPTPAY");
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [slipUrl, setSlipUrl] = useState<string | null>(null);
  const [slipFileId, setSlipFileId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      // Reset state when dialog closes
      setSlipFile(null);
      setSlipPreview(null);
      setSlipUrl(null);
      setSlipFileId(null);
      setPaymentMethod("PROMPTPAY");
    }
  }, [open]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("รองรับเฉพาะไฟล์รูปภาพ PNG, JPG หรือ WEBP เท่านั้น");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ไฟล์มีขนาดใหญ่เกิน 5MB");
      return;
    }

    setSlipFile(file);

    // Create preview
    const preview = URL.createObjectURL(file);
    setSlipPreview(preview);

    // Upload to server
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("label", "weed_store/spin_payment");

      const result = await uploadSpinPaymentSlipAction(formData);

      if (result.success && result.url && result.fileId) {
        setSlipUrl(result.url);
        setSlipFileId(result.fileId);
        toast.success("อัปโหลดสลิปสำเร็จ");
      } else {
        toast.error(result.message || "อัปโหลดสลิปไม่สำเร็จ");
        setSlipFile(null);
        setSlipPreview(null);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("เกิดข้อผิดพลาดในการอัปโหลด");
      setSlipFile(null);
      setSlipPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveSlip = () => {
    if (slipPreview) {
      URL.revokeObjectURL(slipPreview);
    }
    setSlipFile(null);
    setSlipPreview(null);
    setSlipUrl(null);
    setSlipFileId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleConfirm = () => {
    if (paymentMethod === "PROMPTPAY" && !slipUrl) {
      toast.error("กรุณาอัปโหลดสลิปการโอนเงิน");
      return;
    }

    onPaymentComplete({
      paymentMethod,
      slipUrl: slipUrl || undefined,
      slipFileId: slipFileId || undefined,
      amount: spinPackage.price,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[500px] md:max-w-[800px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg sm:text-xl">
            ชำระเงินแพคเกจสปิน
          </DialogTitle>
          <DialogDescription className="text-sm">
            {spinPackage.name} - {spinPackage.spinAmount} ครั้ง
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          {/* Package Info */}
          <div className="bg-muted p-3 sm:p-4 rounded-lg text-sm">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-muted-foreground">จำนวนครั้งที่หมุน:</span>
              <span className="font-semibold">
                {spinPackage.spinAmount} ครั้ง
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">ยอดที่ต้องชำระ:</span>
              <span className="font-bold text-primary text-base sm:text-lg">
                {formatPrice(spinPackage.price)}
              </span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">วิธีการชำระเงิน</label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={paymentMethod === "PROMPTPAY" ? "default" : "outline"}
                onClick={() => setPaymentMethod("PROMPTPAY")}
                className="flex-1 text-xs sm:text-sm h-9 sm:h-10"
              >
                PromptPay
              </Button>
              <Button
                type="button"
                variant={
                  paymentMethod === "MANUAL_TRANSFER" ? "default" : "outline"
                }
                onClick={() => setPaymentMethod("MANUAL_TRANSFER")}
                className="flex-1 text-xs sm:text-sm h-9 sm:h-10"
              >
                โอนเงินผ่านธนาคาร
              </Button>
            </div>
          </div>

          {/* Two Column Layout (responsive) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {/* Left Column: Payment Info */}
            <div className="flex flex-col">
              {/* PromptPay QR Code */}
              {paymentMethod === "PROMPTPAY" && (
                <div className="bg-muted p-3 sm:p-4 rounded-lg text-center">
                  <p className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">
                    สแกน QR Code เพื่อชำระเงิน
                  </p>
                  <div className="bg-white p-2 sm:p-3 rounded-lg inline-block mx-auto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/api/payment/promptpay?amount=${spinPackage.price}`}
                      alt="PromptPay QR Code"
                      width={160}
                      height={160}
                      className="mx-auto w-[140px] h-[140px] sm:w-[160px] sm:h-[160px]"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    จำนวนเงิน: {formatPrice(spinPackage.price)}
                  </p>
                </div>
              )}

              {/* Bank Transfer Info */}
              {paymentMethod === "MANUAL_TRANSFER" && (
                <div className="bg-muted p-3 sm:p-4 rounded-lg">
                  <p className="text-xs sm:text-sm font-medium text-center mb-2 sm:mb-3">
                    ข้อมูลบัญชีสำหรับโอนเงิน
                  </p>

                  <div className="bg-white dark:bg-gray-800 p-2.5 sm:p-3 rounded-lg space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-muted-foreground">ธนาคาร:</span>
                      <span className="font-semibold text-right">
                        {process.env.NEXT_PUBLIC_BANK_NAME || "ธนาคารกสิกรไทย"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-muted-foreground">ชื่อบัญชี:</span>
                      <span className="font-semibold text-right">
                        {process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME ||
                          "นาย ตัวอย่าง ทดสอบ"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-muted-foreground">
                        เลขที่บัญชี:
                      </span>
                      <span className="font-semibold">
                        {process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER ||
                          "123-4-56789-0"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-2 pt-1.5 sm:pt-2 border-t">
                      <span className="text-muted-foreground">จำนวนเงิน:</span>
                      <span className="font-bold text-primary">
                        {formatPrice(spinPackage.price)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-2 mt-2 sm:mt-3">
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      💡 โปรดโอนเงินตามจำนวนที่ระบุ และอัปโหลดสลิป
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Slip Upload */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2">
                อัปโหลดสลิปการโอนเงิน
              </label>
              {slipPreview ? (
                <div className="relative border rounded-lg p-2 min-h-[200px] sm:min-h-[240px]">
                  <div className="relative h-[200px] sm:h-[240px] w-full">
                    <Image
                      src={slipPreview}
                      alt="สลิปการโอนเงิน"
                      fill
                      className="object-contain rounded"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveSlip}
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background h-8 w-8 p-0"
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-4 sm:p-6 text-center min-h-[200px] sm:min-h-[240px] flex flex-col items-center justify-center">
                  <Upload className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-2 sm:mb-3 text-muted-foreground" />
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                    อัปโหลดสลิปการโอนเงิน
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || isPending}
                    className="text-xs sm:text-sm h-8 sm:h-9"
                  >
                    <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                    เลือกไฟล์
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    PNG, JPG, WEBP (สูงสุด 5MB)
                  </p>
                </div>
              )}
              <input
                type="file"
                aria-label="อัปโหลดสลิปการโอนเงิน"
                ref={fileInputRef}
                className="hidden"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileChange}
                disabled={isUploading || isPending}
              />
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-2.5 sm:p-3">
            <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ หลังจากอัปโหลดสลิปแล้ว
              กรุณารอแอดมินอนุมัติก่อนจึงจะสามารถเล่นสปินได้
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isPending || isUploading}
            className="w-full sm:w-auto text-sm h-9 sm:h-10"
          >
            ยกเลิก
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!slipUrl || isPending || isUploading}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-sm h-9 sm:h-10"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                กำลังบันทึก...
              </>
            ) : (
              "ยืนยันการชำระเงิน"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
