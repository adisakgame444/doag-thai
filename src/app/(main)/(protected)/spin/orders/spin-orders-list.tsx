"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format-price";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, CheckCircle, XCircle, Eye, Package } from "lucide-react";
import dayjs from "@/lib/dayjs";

type SpinOrder = {
  id: string;
  orderNumber: string;
  spinAmount: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: Date;
  package: {
    name: string;
    imageUrl: string;
  };
  payments: {
    slipUrl: string | null;
    status: string;
  }[];
};

interface SpinOrdersListProps {
  orders: SpinOrder[];
}

export default function SpinOrdersList({ orders }: SpinOrdersListProps) {
  const [selectedOrder, setSelectedOrder] = useState<SpinOrder | null>(null);
  const [slipDialogOpen, setSlipDialogOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return (
          <Badge variant="secondary" className="bg-gray-500">
            <Clock className="w-3 h-3 mr-1" />
            รอชำระเงิน
          </Badge>
        );
      case "WAITING_VERIFICATION":
        return (
          <Badge variant="secondary" className="bg-yellow-500">
            <Clock className="w-3 h-3 mr-1" />
            รอการตรวจสอบ
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge variant="secondary" className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            อนุมัติแล้ว
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            ปฏิเสธ
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="secondary" className="bg-gray-500">
            <XCircle className="w-3 h-3 mr-1" />
            ยกเลิก
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleViewSlip = (order: SpinOrder) => {
    setSelectedOrder(order);
    setSlipDialogOpen(true);
  };

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">
            คุณยังไม่มีประวัติการซื้อแพคเกจสปิน
          </p>
          <Link href="/spin">
            <Button>
              <Package className="w-4 h-4 mr-2" />
              ซื้อแพคเกจสปิน
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {order.package.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    เลขที่: {order.orderNumber}
                  </p>
                </div>
                {getStatusBadge(order.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Package Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={order.package.imageUrl}
                        alt={order.package.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        จำนวนครั้งที่หมุน
                      </p>
                      <p className="text-lg font-semibold">
                        {order.spinAmount} ครั้ง
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ยอดชำระ:</span>
                    <span className="font-semibold">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">วิธีชำระเงิน:</span>
                    <span>
                      {order.paymentMethod === "PROMPTPAY"
                        ? "PromptPay"
                        : "โอนเงินธนาคาร"}
                    </span>
                  </div>
                </div>

                {/* Right: Status & Actions */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">วันที่สั่งซื้อ:</span>
                    <span>{dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}</span>
                  </div>

                  {/* View Slip Button */}
                  {order.payments.length > 0 && order.payments[0].slipUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleViewSlip(order)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      ดูสลิปการโอนเงิน
                    </Button>
                  )}

                  {/* Status Message */}
                  {order.status === "WAITING_VERIFICATION" && (
                    <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                      <p className="text-xs text-yellow-800 dark:text-yellow-200">
                        กรุณารอแอดมินตรวจสอบและอนุมัติ
                      </p>
                    </div>
                  )}

                  {order.status === "APPROVED" && (
                    <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
                      <p className="text-xs text-green-800 dark:text-green-200">
                        ✅ อนุมัติแล้ว สามารถเล่นเกมได้
                      </p>
                      <Link href="/game">
                        <Button size="sm" className="w-full mt-2 bg-green-600 hover:bg-green-700">
                          เล่นเกมเลย
                        </Button>
                      </Link>
                    </div>
                  )}

                  {order.status === "REJECTED" && (
                    <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3">
                      <p className="text-xs text-red-800 dark:text-red-200">
                        ❌ คำสั่งซื้อถูกปฏิเสธ กรุณาติดต่อแอดมิน
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Slip Dialog */}
      <Dialog open={slipDialogOpen} onOpenChange={setSlipDialogOpen}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>สลิปการโอนเงิน</DialogTitle>
          </DialogHeader>
          {selectedOrder && selectedOrder.payments[0]?.slipUrl && (
            <div className="relative w-full min-h-[400px] sm:min-h-[500px] max-h-[70vh] sm:max-h-[100vh]">
              <Image
                src={selectedOrder.payments[0].slipUrl}
                alt="สลิปการโอนเงิน"
                fill
                className="object-contain rounded"
                sizes="(max-width: 640px) 95vw, (max-width: 1024px) 80vw, 1024px"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
