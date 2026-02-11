"use client";

import { useState, useTransition } from "react";
import { formatPrice } from "@/lib/format-price";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Check, X, Eye } from "lucide-react";
import { approveSpinOrderAction, rejectSpinOrderAction } from "./actions";
import { SpinOrder } from "@/generated/prisma/client";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SpinOrdersAdminViewProps {
  orders: (SpinOrder & {
    package: { name: string; imageUrl: string };
    user: { id: string; name: string; email: string };
    payments: Array<{
      id: string;
      amount: number;
      slipUrl: string | null;
      status: string;
      createdAt: Date;
    }>;
  })[];
}

function getStatusBadge(status: string) {
  switch (status) {
    case "PENDING_PAYMENT":
      return <Badge variant="outline">รอชำระเงิน</Badge>;
    case "WAITING_VERIFICATION":
      return <Badge variant="default" className="bg-yellow-500">รอตรวจสอบ</Badge>;
    case "APPROVED":
      return <Badge variant="default" className="bg-green-500">อนุมัติแล้ว</Badge>;
    case "REJECTED":
      return <Badge variant="destructive">ปฏิเสธ</Badge>;
    case "CANCELLED":
      return <Badge variant="secondary">ยกเลิก</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

export default function SpinOrdersAdminView({
  orders,
}: SpinOrdersAdminViewProps) {
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<
    SpinOrdersAdminViewProps["orders"][0] | null
  >(null);
  const [isPending, startTransition] = useTransition();

  const handleApprove = (orderId: string) => {
    setPendingOrderId(orderId);
    startTransition(async () => {
      const result = await approveSpinOrderAction(orderId);
      if (!result.success) {
        toast.error(result.message || "อนุมัติไม่สำเร็จ");
      } else {
        toast.success("อนุมัติคำสั่งซื้อสปินเรียบร้อยแล้ว");
      }
      setPendingOrderId(null);
    });
  };

  const handleReject = (orderId: string) => {
    setPendingOrderId(orderId);
    startTransition(async () => {
      const result = await rejectSpinOrderAction(orderId);
      if (!result.success) {
        toast.error(result.message || "ปฏิเสธไม่สำเร็จ");
      } else {
        toast.success("ปฏิเสธคำสั่งซื้อสปินเรียบร้อยแล้ว");
      }
      setPendingOrderId(null);
    });
  };

  const canApprove = (order: SpinOrdersAdminViewProps["orders"][0]) => {
    return order.status === "WAITING_VERIFICATION";
  };

  const canReject = (order: SpinOrdersAdminViewProps["orders"][0]) => {
    return (
      order.status === "WAITING_VERIFICATION" ||
      order.status === "PENDING_PAYMENT"
    );
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">ไม่มีคำสั่งซื้อสปิน</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 sm:space-y-4">
        {orders.map((order) => {
          const isLoading = pendingOrderId === order.id && isPending;

          return (
            <Card key={order.id}>
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base sm:text-lg truncate">
                      {order.orderNumber}
                    </CardTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                      {order.user.name} ({order.user.email})
                    </p>
                  </div>
                  <div className="self-start sm:self-auto">
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={order.package.imageUrl}
                          alt={order.package.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm sm:text-base truncate">{order.package.name}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {order.spinAmount} ครั้ง
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ยอดรวม:</span>
                        <span className="font-semibold">
                          {formatPrice(order.totalAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">วันที่สั่งซื้อ:</span>
                        <span>
                          {new Date(order.createdAt).toLocaleDateString("th-TH")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs sm:text-sm font-medium mb-2">สลิปการโอนเงิน:</p>
                    <div className="space-y-2">
                      {order.payments.map((payment) => (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between p-2 bg-muted rounded"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-medium truncate">
                              {formatPrice(payment.amount)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {payment.status === "WAITING_VERIFICATION"
                                ? "รอตรวจสอบ"
                                : payment.status === "APPROVED"
                                  ? "อนุมัติแล้ว"
                                  : payment.status}
                            </p>
                          </div>
                          {payment.slipUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                              className="ml-2 flex-shrink-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {order.note && (
                  <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-muted rounded">
                    <p className="text-xs sm:text-sm break-words">
                      <span className="font-medium">หมายเหตุ:</span> {order.note}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
                  {canApprove(order) && (
                    <Button
                      onClick={() => handleApprove(order.id)}
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
                      size="sm"
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="mr-2 h-4 w-4" />
                      )}
                      อนุมัติ
                    </Button>
                  )}
                  {canReject(order) && (
                    <Button
                      onClick={() => handleReject(order.id)}
                      disabled={isLoading}
                      variant="destructive"
                      size="sm"
                      className="text-xs sm:text-sm"
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <X className="mr-2 h-4 w-4" />
                      )}
                      ปฏิเสธ
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">
                สลิปการโอนเงิน - {selectedOrder.orderNumber}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedOrder.payments
                .filter((p) => p.slipUrl)
                .map((payment) => (
                  <div key={payment.id}>
                    <p className="text-xs sm:text-sm font-medium mb-2">
                      จำนวนเงิน: {formatPrice(payment.amount)}
                    </p>
                    <div className="relative aspect-video w-full border rounded">
                      <Image
                        src={payment.slipUrl!}
                        alt="สลิปการโอนเงิน"
                        fill
                        className="object-contain rounded"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
