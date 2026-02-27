// components/product/product-detail/payment-dialog.tsx
import Image from "next/image";
import { X, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format-price";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isRefundMode: boolean;
  refundAmount: number;
  extraAmount: number;
  qrCodeUrl: string;
  slipImage: string | null;
  setSlipImage: (val: string | null) => void;
  refundBank: string;
  setRefundBank: (val: string) => void;
  refundAccountNo: string;
  setRefundAccountNo: (val: string) => void;
  refundAccountName: string;
  setRefundAccountName: (val: string) => void;
  isPending: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleConfirmPayment: () => void;
  handleConfirmRefund: () => void;
}

export function PaymentDialog({
  open,
  onOpenChange,
  isRefundMode,
  refundAmount,
  extraAmount,
  qrCodeUrl,
  slipImage,
  setSlipImage,
  refundBank,
  setRefundBank,
  refundAccountNo,
  setRefundAccountNo,
  refundAccountName,
  setRefundAccountName,
  isPending,
  fileInputRef,
  handleFileChange,
  handleConfirmPayment,
  handleConfirmRefund,
}: PaymentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !isPending && onOpenChange(o)}>
      <DialogContent className="w-[90vw] max-w-[400px] max-h-[80vh] overflow-y-auto rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {isRefundMode ? "แจ้งรับเงินคืนส่วนต่าง" : "ชำระยอดส่วนต่าง"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isRefundMode
              ? "ยอดสินค้าใหม่ต่ำกว่าเดิม ทางร้านจะโอนเงินคืนให้คุณ"
              : "สินค้าใหม่มีราคาสูงกว่าเดิม"}
          </DialogDescription>
        </DialogHeader>

        {isRefundMode ? (
          <div className="flex flex-col space-y-4 py-2">
            <div className="text-center mb-2">
              <div className="text-sm text-muted-foreground">
                ยอดเงินคืนสุทธิ
              </div>
              <div className="text-3xl font-bold text-emerald-600">
                {formatPrice(refundAmount)}
              </div>
            </div>
            <div className="space-y-3 px-1">
              <div className="space-y-1">
                <label className="text-xs font-medium ml-1">
                  ช่องทางรับเงิน
                </label>
                <Select value={refundBank} onValueChange={setRefundBank}>
                  <SelectTrigger
                    className="w-full rounded-xl"
                    aria-label="เลือกช่องทางรับเงิน"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PROMPTPAY">
                      พร้อมเพย์ (PromptPay)
                    </SelectItem>
                    <SelectItem value="KBANK">กสิกรไทย (KBANK)</SelectItem>
                    <SelectItem value="SCB">ไทยพาณิชย์ (SCB)</SelectItem>
                    <SelectItem value="KTB">กรุงไทย (KTB)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium ml-1">
                  เลขที่บัญชี / เบอร์พร้อมเพย์
                </label>
                <Input
                  value={refundAccountNo}
                  onChange={(e) =>
                    setRefundAccountNo(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  placeholder="กรอกเฉพาะตัวเลข"
                  className="rounded-xl"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium ml-1">ชื่อบัญชี</label>
                <Input
                  value={refundAccountName}
                  onChange={(e) => setRefundAccountName(e.target.value)}
                  placeholder="ชื่อ-นามสกุล เจ้าของบัญชี"
                  className="rounded-xl"
                  disabled={isPending}
                />
              </div>
            </div>
            <DialogFooter className="pt-2 sm:justify-between gap-2">
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                ยกเลิก
              </Button>
              <Button
                onClick={handleConfirmRefund}
                disabled={isPending || !refundAccountNo || !refundAccountName}
                className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
              >
                {isPending ? "กำลังบันทึก..." : "ยืนยันข้อมูลรับเงิน"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-5">
            <div className="text-center mb-1">
              <div className="text-sm text-muted-foreground">
                ยอดที่ต้องชำระเพิ่ม
              </div>
              <div className="text-3xl font-bold text-emerald-600">
                {formatPrice(extraAmount)}
              </div>
            </div>
            {qrCodeUrl && (
              <div className="relative h-56 w-56 overflow-hidden rounded-xl border shadow-sm bg-white">
                <Image
                  src={qrCodeUrl}
                  alt="QR Code"
                  fill
                  className="object-contain p-2"
                  unoptimized
                />
              </div>
            )}
            <Separator />
            <div className="w-full">
              <label className="text-sm font-medium mb-2 block">
                หลักฐานการโอน (รูปภาพเท่านั้น)
              </label>
              <div
                className="relative flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/25 hover:bg-muted/50 transition-all group"
                onClick={() => !isPending && fileInputRef.current?.click()}
              >
                {slipImage ? (
                  <div className="relative h-full w-full p-2">
                    <Image
                      src={slipImage}
                      alt="Slip"
                      fill
                      className="object-contain rounded-lg"
                    />
                    <div
                      className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 cursor-pointer hover:bg-red-500 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSlipImage(null);
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                    >
                      <X size={16} />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
                    <Upload className="mb-2 h-8 w-8 group-hover:scale-110 transition-transform" />
                    <p className="text-sm">แตะเพื่ออัปโหลดสลิป</p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isPending}
                  aria-label="อัปโหลดหลักฐานการโอนเงิน"
                />
              </div>
            </div>
            <DialogFooter className="sm:justify-between gap-2 w-full">
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                ยกเลิก
              </Button>
              <Button
                onClick={handleConfirmPayment}
                disabled={!slipImage || isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
              >
                {isPending ? "กำลังบันทึก..." : "ยืนยันการโอนเงิน"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
