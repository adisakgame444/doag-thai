"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format-price";
import { createSpinOrderAction } from "./actions";
import { SpinPackage } from "@/generated/prisma/client";
import SpinPaymentDialog from "./spin-payment-dialog";
import { toast } from "sonner";

interface SpinPackagesListProps {
  packages: SpinPackage[];
}

export default function SpinPackagesList({ packages }: SpinPackagesListProps) {
  const [selectedPackage, setSelectedPackage] = useState<SpinPackage | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleBuyClick = (pkg: SpinPackage) => {
    setSelectedPackage(pkg);
    setIsDialogOpen(true);
  };

  const handlePaymentComplete = async (data: {
    paymentMethod: "PROMPTPAY" | "MANUAL_TRANSFER";
    slipUrl?: string;
    slipFileId?: string;
    amount: number;
  }) => {
    if (!selectedPackage) return;

    startTransition(async () => {
      const result = await createSpinOrderAction({
        packageId: selectedPackage.id,
        paymentMethod: data.paymentMethod,
        slipUrl: data.slipUrl,
        slipFileId: data.slipFileId,
        amount: data.amount,
      });

      if (result.success) {
        setIsDialogOpen(false);
        setSelectedPackage(null);
        
        // Show success message
        toast.success("ส่งคำสั่งซื้อสำเร็จ!", {
          description: "กรุณารอแอดมินตรวจสอบและอนุมัติ",
          duration: 5000,
        });
        
        // Redirect to orders page
        setTimeout(() => {
          window.location.href = `/spin/orders`;
        }, 1000);
      } else {
        toast.error(result.message || "เกิดข้อผิดพลาด");
      }
    });
  };

  if (packages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">ไม่มีแพคเกจสปินที่พร้อมใช้งาน</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative aspect-video w-full">
              <Image
                src={pkg.imageUrl}
                alt={pkg.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-3 sm:p-4">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{pkg.name}</h3>
              <div className="space-y-2 mb-3 sm:mb-4">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-muted-foreground">จำนวนครั้งที่หมุน:</span>
                  <span className="font-semibold">{pkg.spinAmount} ครั้ง</span>
                </div>
                <div className="flex justify-between text-base sm:text-lg">
                  <span className="text-muted-foreground">ราคา:</span>
                  <span className="font-bold text-primary">
                    {formatPrice(pkg.price)}
                  </span>
                </div>
              </div>
              <Button
                onClick={() => handleBuyClick(pkg)}
                className="w-full text-sm sm:text-base"
                disabled={isPending}
                size="sm"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                ซื้อแพคเกจ
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedPackage && (
        <SpinPaymentDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          spinPackage={selectedPackage}
          onPaymentComplete={handlePaymentComplete}
          isPending={isPending}
        />
      )}
    </>
  );
}
