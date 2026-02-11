"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import dayjs from "@/lib/dayjs";
import { toast } from "sonner";
// 1. import action และ formatPrice
import {
  markItemOutOfStockAction,
  approveSpecificPaymentAction,
  rejectSpecificPaymentAction,
  updateOrderItemTrackingAction,
} from "./actions";
import { OrderDetailDTO } from "@/types/order";
import { formatPrice } from "@/lib/format-price";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { OrderStatus, PaymentMethod, PaymentStatus } from "@/generated/prisma/enums";
import {
  approvePaymentAction,
  rejectPaymentAction,
  updateOrderStatusAction,
} from "./actions";
import Image from "next/image";
import OrdersSearchForm from "./search-form";
import { Input } from "@/components/ui/input";
import { PaginationMeta } from "@/lib/pagination";
import { PaginationControls } from "@/components/pagination/pagination-controls";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

interface OrdersAdminViewProps {
  orders: OrderDetailDTO[];
  search?: string;
  meta: PaginationMeta;
}

function getOrderStatusLabel(status: OrderStatus) {
  switch (status) {
    case "PENDING_PAYMENT":
      return "รอการชำระเงิน";
    case "PENDING_VERIFICATION":
      return "รอตรวจสอบ";
    case "PROCESSING":
      return "กำลังเตรียมจัดส่ง";
    case "SHIPPED":
      return "จัดส่งแล้ว";
    case "COMPLETED":
      return "สำเร็จ";
    case "CANCELLED":
      return "ยกเลิก";
    default:
      return status;
  }
}

function getOrderStatusClass(status: OrderStatus) {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30";
    case "SHIPPED":
      return "bg-sky-500/10 text-sky-600 border-sky-500/30";
    case "PROCESSING":
      return "bg-blue-500/10 text-blue-600 border-blue-500/30";
    case "PENDING_VERIFICATION":
      return "bg-amber-500/10 text-amber-600 border-amber-500/30";
    case "PENDING_PAYMENT":
      return "bg-amber-500/10 text-amber-600 border-amber-500/30";
    case "CANCELLED":
      return "bg-destructive/10 text-destructive border-destructive/30";
    default:
      return "";
  }
}

function getPaymentStatusLabel(status: PaymentStatus) {
  switch (status) {
    case "PENDING":
      return "รอการชำระ";
    case "WAITING_VERIFICATION":
      return "รอตรวจสอบ";
    case "APPROVED":
      return "ชำระแล้ว";
    case "REJECTED":
      return "ชำระไม่สำเร็จ";
    default:
      return status;
  }
}

function getPaymentStatusClass(status: PaymentStatus) {
  switch (status) {
    case "APPROVED":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30";
    case "WAITING_VERIFICATION":
      return "bg-blue-500/10 text-blue-600 border-blue-500/30";
    case "PENDING":
      return "bg-amber-500/10 text-amber-600 border-amber-500/30";
    case "REJECTED":
      return "bg-destructive/10 text-destructive border-destructive/30";
    default:
      return "";
  }
}

function getPaymentMethodLabel(method: PaymentMethod) {
  switch (method) {
    case "PROMPTPAY":
      return "PromptPay";
    case "COD":
      return "เก็บเงินปลายทาง";
    default:
      return method;
  }
}

function canApprovePayment(order: OrderDetailDTO) {
  return (
    (order.paymentStatus === PaymentStatus.PENDING ||
      order.paymentStatus === PaymentStatus.WAITING_VERIFICATION) &&
    (order.status === OrderStatus.PENDING_PAYMENT ||
      order.status === OrderStatus.PENDING_VERIFICATION)
  );
}

function canRejectPayment(order: OrderDetailDTO) {
  return order.paymentStatus === PaymentStatus.WAITING_VERIFICATION;
}

function canMarkShipped(order: OrderDetailDTO) {
  return order.status === OrderStatus.PROCESSING;
}

function canMarkCompleted(order: OrderDetailDTO) {
  return order.status === OrderStatus.SHIPPED;
}

function canCancelOrder(order: OrderDetailDTO) {
  if (
    order.status === OrderStatus.CANCELLED ||
    order.status === OrderStatus.COMPLETED
  ) {
    return false;
  }

  if (order.status === OrderStatus.SHIPPED) {
    return false;
  }

  if (order.status === OrderStatus.PROCESSING) {
    return order.paymentStatus === PaymentStatus.APPROVED;
  }

  return true;
}

export default function OrdersAdminView({
  orders,
  search = "",
  meta,
}: OrdersAdminViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  // const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
  // const [trackingValue, setTrackingValue] = useState("");
  // const [trackingTargetId, setTrackingTargetId] = useState<string | null>(null);
  // const [carrierValue, setCarrierValue] = useState("");
  const [editingItems, setEditingItems] = useState<Record<string, boolean>>({});

  // useEffect(() => {
  //   // สั่งให้สะกิด Server เพื่อดึงข้อมูลใหม่ทุกๆ 30 วินาที
  //   // ทำให้แอดมินเห็นออเดอร์ที่ลูกค้าแก้เสร็จแล้วเด้งขึ้นมาเองโดยไม่ต้องกด F5
  //   const interval = setInterval(() => {
  //     // ตรวจสอบก่อนว่าไม่ได้กำลังรัน Transition อื่นอยู่ (เช่น กำลังกดอนุมัติสลิป)
  //     if (!isPending) {
  //       router.refresh();
  //     }
  //   }, 30000); // 30 วินาที (ปรับเพิ่ม/ลดได้ตามความเหมาะสม)

  //   return () => clearInterval(interval);
  // }, [router, isPending]);

  useEffect(() => {
    const interval = setInterval(() => {
      // ✅ Logic การสั่งหยุดชั่วคราว:
      // 1. document.hidden -> ถ้าแอดมินพับจอ ให้หยุด
      // 2. isPending -> ถ้าระบบกำลังโหลดหมุนๆ อยู่ ให้หยุด (อย่าสั่งซ้อน)

      if (!document.hidden && !isPending) {
        router.refresh();
      }
    }, 300000); // 5นาที

    return () => clearInterval(interval);
  }, [router, isPending]);

  const paginationQuery = useMemo(() => {
    const query: Record<string, string> = {};
    const paramSearch = searchParams.get("search") ?? search ?? "";
    if (paramSearch) {
      query.search = paramSearch;
    }
    const pageSizeParam = searchParams.get("pageSize");
    if (pageSizeParam) {
      query.pageSize = pageSizeParam;
    }
    return query;
  }, [searchParams, search]);

  const handleApprovePayment = (orderId: string) => {
    setPendingOrderId(orderId);
    startTransition(async () => {
      const result = await approvePaymentAction(orderId);
      if (!result?.success) {
        toast.error(result?.message ?? "อนุมัติการชำระเงินไม่สำเร็จ");
      } else {
        toast.success("อนุมัติการชำระเงินเรียบร้อยแล้ว");
      }
      setPendingOrderId(null);
    });
  };

  const handleApproveSpecificPayment = (paymentId: string, orderId: string) => {
    setPendingOrderId(orderId); // ล็อคปุ่มในออเดอร์นั้น
    startTransition(async () => {
      const result = await approveSpecificPaymentAction(paymentId);
      if (!result?.success) {
        toast.error(result?.message ?? "อนุมัติสลิปไม่สำเร็จ");
      } else {
        toast.success("อนุมัติสลิปเรียบร้อยแล้ว");
      }
      setPendingOrderId(null); // ปลดล็อคปุ่ม
    });
  };

  // ✅ เพิ่มฟังก์ชันสำหรับปฏิเสธสลิปแยกเป็นใบๆ
  const handleRejectSpecificPayment = (paymentId: string, orderId: string) => {
    setPendingOrderId(orderId);
    startTransition(async () => {
      // เรียกใช้ Action สำหรับ Reject (ต้อง import มาจากไฟล์ actions ด้วย)
      const result = await rejectSpecificPaymentAction(paymentId);
      if (!result?.success) {
        toast.error(result?.message ?? "ปฏิเสธสลิปไม่สำเร็จ");
      } else {
        toast.success("ปฏิเสธสลิปเรียบร้อยแล้ว");
      }
      setPendingOrderId(null);
    });
  };

  const handleRejectPayment = (orderId: string) => {
    setPendingOrderId(orderId);
    startTransition(async () => {
      const result = await rejectPaymentAction(orderId);
      if (!result?.success) {
        toast.error(result?.message ?? "ปฏิเสธการชำระเงินไม่สำเร็จ");
      } else {
        toast.success("ปฏิเสธการชำระเงินแล้ว");
      }
      setPendingOrderId(null);
    });
  };

  const handleUpdateStatus = (
    orderId: string,
    status: OrderStatus,
    successMessage: string,
    trackingNumber?: string,
    carrier?: string,
  ) => {
    setPendingOrderId(orderId);
    startTransition(async () => {
      const result = await updateOrderStatusAction(
        orderId,
        status,
        trackingNumber,
        carrier,
      );
      if (!result?.success) {
        toast.error(result?.message ?? "อัปเดตสถานะไม่สำเร็จ");
      } else {
        toast.success(successMessage);
      }
      setPendingOrderId(null);
    });
  };

  // const handleUpdateItemTracking = (
  //   orderItemId: string,
  //   orderId: string,
  //   carrier: string,
  //   tracking: string,
  // ) => {
  //   // if (!carrier || !tracking) {
  //   //   toast.error("กรุณาระบุบริษัทขนส่งและเลขพัสดุ");
  //   //   return;
  //   // }

  //   setPendingOrderId(orderId);
  //   startTransition(async () => {
  //     const result = await updateOrderItemTrackingAction(
  //       orderItemId,
  //       carrier,
  //       tracking,
  //     );
  //     if (!result?.success) {
  //       toast.error(result?.message ?? "บันทึกเลขพัสดุไม่สำเร็จ");
  //     } else {
  //       toast.success("บันทึกเลขพัสดุของรายการนี้เรียบร้อยแล้ว");
  //     }
  //     setPendingOrderId(null);
  //   });
  // };

  const handleUpdateItemTracking = (
    orderItemId: string,
    orderId: string,
    carrier: string,
    tracking: string,
  ) => {
    // 🟢 1. เช็คเงื่อนไข: ถ้าเป็นการ "บันทึกใหม่" (ไม่ใช่การกดแก้ไขเพื่อล้างค่า)
    // และไม่ได้กรอกข้อมูลมา ให้โชว์ Toast สีดำแจ้งเตือนแบบในรูปที่พี่ต้องการ
    if (carrier === "" && tracking === "") {
      // กรณีนี้คือการกด "แก้ไขเลข" เพื่อล้างค่า ไม่ต้องโชว์ Error ให้รันต่อเลย
    } else if (!carrier || !tracking) {
      // 🔴 นี่คือจุดที่ทำให้ขึ้นแจ้งเตือนแบบในรูปที่พี่ส่งมา
      toast.error("กรุณาระบุบริษัทขนส่งและเลขพัสดุ");
      return;
    }

    setPendingOrderId(orderId);
    startTransition(async () => {
      const result = await updateOrderItemTrackingAction(
        orderItemId,
        carrier,
        tracking,
      );

      if (!result?.success) {
        // 🔴 แจ้งเตือนเมื่อบันทึกไม่สำเร็จ (แถบสีดำด้านล่าง)
        toast.error(result?.message ?? "บันทึกเลขพัสดุไม่สำเร็จ");
      } else {
        // 🟢 แจ้งเตือนเมื่อสำเร็จ (แถบสีดำด้านล่าง)
        toast.success("อัปเดตข้อมูลเรียบร้อยแล้ว");
      }
      setPendingOrderId(null);
    });
  };

  const toggleEditItem = (itemId: string, isEditing: boolean) => {
    setEditingItems((prev) => ({ ...prev, [itemId]: isEditing }));
  };

  return (
    <div className="space-y-6">
      <OrdersSearchForm initialValue={search} />

      {orders.length === 0 ? (
        <Card className="border border-dashed border-border/60 bg-card">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center text-muted-foreground">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                {search
                  ? "ไม่พบคำสั่งซื้อที่ค้นหา"
                  : "ยังไม่มีคำสั่งซื้อเข้ามา"}
              </h2>
              <p className="text-sm">
                {search
                  ? "ตรวจสอบเลขคำสั่งซื้อหรือเคลียร์ช่องค้นหาเพื่อดูคำสั่งซื้อทั้งหมด"
                  : "คำสั่งซื้อใหม่จะปรากฏที่นี่เพื่อให้ทีมงานตรวจสอบและจัดการ"}
              </p>
            </div>
            {search && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  router.push(pathname);
                }}
              >
                ล้างการค้นหา
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        orders.map((order) => {
          const createdAt = dayjs(order.createdAt);
          const updatedAt = dayjs(order.updatedAt);
          const showShippingLine2 = Boolean(order.shippingLine2);
          const disableButtons = isPending && pendingOrderId === order.id;

          // 1. ยอดที่ลูกค้าโอนมาจริง (เฉพาะที่อนุมัติแล้ว)
          const totalPaid = order.payments
            .filter((p) => p.status === "APPROVED")
            .reduce((sum, p) => sum + (p.amount || 0), 0);

          // 2. ยอดที่ระบบรอคืนเงิน (Pending Refund)
          const refundPending = order.payments
            .filter((p) => p.status === "PENDING_REFUND")
            .reduce((sum, p) => sum + (p.amount || 0), 0);

          // 3. ยอดที่คืนไปแล้ว (Refunded)
          const totalRefunded = order.payments
            .filter((p) => p.status === "REFUNDED")
            .reduce((sum, p) => sum + (p.amount || 0), 0);

          // 4. Net Balance (ยอดสุทธิที่ค้างอยู่ในระบบ)
          // สูตร: จ่ายมา - ราคาของ - คืนไปแล้ว
          const netBalance = totalPaid - order.totalAmount - totalRefunded;

          return (
            <Card key={order.id} className="border border-border/60 shadow-sm">
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg md:text-xl">
                    คำสั่งซื้อ {order.orderNumber}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    สร้างเมื่อ {createdAt.format("LLL")} • อัปเดตล่าสุด{" "}
                    {updatedAt.fromNow()}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={getOrderStatusClass(order.status)}
                  >
                    {getOrderStatusLabel(order.status)}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={getPaymentStatusClass(order.paymentStatus)}
                  >
                    {getPaymentStatusLabel(order.paymentStatus)}
                  </Badge>
                  <Badge variant="outline">
                    {getPaymentMethodLabel(order.paymentMethod)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-2 mt-2">
                  {canApprovePayment(order) && (
                    <Button
                      size="sm"
                      onClick={() => handleApprovePayment(order.id)}
                      disabled={disableButtons}
                    >
                      อนุมัติการชำระเงิน
                    </Button>
                  )}

                  {canRejectPayment(order) && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRejectPayment(order.id)}
                      disabled={disableButtons}
                    >
                      ปฏิเสธสลิป
                    </Button>
                  )}

                  {/* {canMarkShipped(order) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setTrackingTargetId(order.id);
                        setTrackingValue(order.trackingNumber ?? "");
                        setTrackingDialogOpen(true);
                      }}
                      disabled={disableButtons}
                    >
                      ทำเครื่องหมายว่าจัดส่งแล้ว
                    </Button>
                  )} */}

                  {canMarkShipped(order) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // 🟢 ลบ confirm ออก เพื่อให้บันทึกทันทีและแสดงผลแจ้งเตือนแบบ Toast ด้านล่าง
                        handleUpdateStatus(
                          order.id,
                          OrderStatus.SHIPPED,
                          "อัปเดตสถานะเป็นจัดส่งแล้วเรียบร้อย",
                        );
                      }}
                      disabled={disableButtons}
                    >
                      ทำเครื่องหมายว่าจัดส่งแล้ว
                    </Button>
                  )}

                  {canMarkCompleted(order) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleUpdateStatus(
                          order.id,
                          OrderStatus.COMPLETED,
                          "อัปเดตสถานะเป็นสำเร็จแล้ว",
                        )
                      }
                      disabled={disableButtons}
                    >
                      ปิดงานคำสั่งซื้อ
                    </Button>
                  )}

                  {canCancelOrder(order) && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() =>
                        handleUpdateStatus(
                          order.id,
                          OrderStatus.CANCELLED,
                          "ยกเลิกคำสั่งซื้อแล้ว",
                        )
                      }
                      disabled={disableButtons}
                    >
                      ยกเลิกคำสั่งซื้อ
                    </Button>
                  )}
                </div>
                <div className="space-y-3">
                  {order.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 rounded-lg border border-border/40 bg-muted/30 px-3 py-3"
                    >
                      {/* --- ส่วนบน: ข้อมูลสินค้าและราคา (เหมือนเดิม) --- */}
                      <div className="flex flex-row items-start justify-between gap-3">
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium text-foreground md:text-base">
                            {item.productTitle}
                          </p>
                          <p className="text-xs text-muted-foreground md:text-sm">
                            จำนวน {item.quantity.toLocaleString()} ชิ้น
                            {(item.variantName ||
                              Number(item.weightValue || 0) > 0) && (
                              <>
                                {" • "}
                                {item.variantName
                                  ? `ตัวเลือก ${item.variantName} ${item.unitLabel || ""}`
                                  : `น้ำหนัก ${Number(item.weightValue || 0).toLocaleString()} กรัม`}
                              </>
                            )}
                          </p>

                          {item.status === "OUT_OF_STOCK" && (
                            <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 mt-1">
                              แจ้งสินค้าหมดแล้ว
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <div className="text-sm font-semibold text-foreground md:text-base">
                            {formatPrice(item.subtotal)}
                          </div>
                          {item.status === "NORMAL" &&
                            !order.trackingNumber &&
                            order.status !== "COMPLETED" && // 👈 เพิ่ม: ถ้าสำเร็จแล้วไม่ต้องโชว์ปุ่ม
                            order.status !== "CANCELLED" && ( // 👈 เพิ่ม: ถ้าถูกยกเลิกแล้วก็ไม่ต้องโชว์ปุ่
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-7 text-[10px] px-2"
                                disabled={isPending}
                                onClick={() => {
                                  startTransition(async () => {
                                    const res = await markItemOutOfStockAction(
                                      item.id,
                                    );
                                    if (res.success)
                                      toast.success("แจ้งเตือนลูกค้าแล้ว");
                                    else toast.error(res.message);
                                  });
                                }}
                              >
                                แจ้งสินค้าหมด
                              </Button>
                            )}
                        </div>
                      </div>

                      {/* --- ✅ ส่วนล่าง: การจัดการขนส่งรายชิ้น --- */}

                      {/* 🟢 เงื่อนไขใหม่: แสดงช่องกรอกเฉพาะเมื่อออเดอร์ยังไม่สำเร็จ และ ยังไม่มีเลขพัสดุบันทึกไว้ */}
                      {order.status !== "COMPLETED" &&
                        order.status !== "CANCELLED" &&
                        !item.trackingNumber && (
                          <div className="mt-1 pt-3 border-t border-dashed border-border/60">
                            <div className="flex flex-wrap items-end gap-2">
                              <div className="flex-1 min-w-[130px] space-y-1">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                                  บริษัทขนส่ง
                                </p>
                                <Select
                                  defaultValue={item.carrier || ""}
                                  onValueChange={(val) =>
                                    (item._tempCarrier = val)
                                  }
                                >
                                  <SelectTrigger className="h-8 text-[11px] bg-background">
                                    <SelectValue placeholder="เลือกขนส่ง" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Flash Express">
                                      Flash Express
                                    </SelectItem>
                                    <SelectItem value="Kerry Express">
                                      Kerry Express
                                    </SelectItem>
                                    <SelectItem value="J&T Express">
                                      J&T Express
                                    </SelectItem>
                                    <SelectItem value="ThaiPost">
                                      ไปรษณีย์ไทย
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="flex-[2] min-w-[180px] space-y-1">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                                  เลขพัสดุสำหรับชิ้นนี้
                                </p>
                                <Input
                                  placeholder="Tracking Number"
                                  className="h-8 text-[11px] bg-background"
                                  defaultValue={item.trackingNumber || ""}
                                  onChange={(e) =>
                                    (item._tempTracking = e.target.value)
                                  }
                                />
                              </div>

                              <Button
                                size="sm"
                                className="h-8 px-4 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={
                                  isPending && pendingOrderId === order.id
                                }
                                onClick={() => {
                                  handleUpdateItemTracking(
                                    item.id,
                                    order.id,
                                    item._tempCarrier || item.carrier || "",
                                    item._tempTracking || "", // 🔴 แก้ตรงนี้: ถ้าว่างให้ส่งค่าว่างไปเลย
                                  );
                                }}
                              >
                                {isPending && pendingOrderId === order.id
                                  ? "..."
                                  : "บันทึกเลข"}
                              </Button>
                            </div>
                          </div>
                        )}

                      {/* 🔵 แสดงผลเมื่อมีเลขพัสดุแล้ว (แสดงตลอดเพื่อให้ตรวจสอบได้) */}
                      {item.trackingNumber && (
                        <div
                          className={`mt-2 flex items-center justify-between gap-1.5 p-2 rounded-md ${
                            order.status === "COMPLETED"
                              ? "bg-gray-100 text-muted-foreground"
                              : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-[11px] font-medium">
                            {order.status !== "COMPLETED" && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            )}
                            ส่งโดย {item.carrier}: {item.trackingNumber}
                          </div>

                          {/* 🔘 ปุ่มสำหรับแก้ไข (Optional): ถ้าพี่อยากให้แอดมินแก้เลขได้หลังจากบันทึกไปแล้ว ให้ใส่ปุ่ม Reset ค่าได้ที่นี่ */}
                          {order.status !== "COMPLETED" && (
                            <Button
                              variant="ghost"
                              className="h-6 px-2 text-[10px] hover:bg-emerald-100"
                              onClick={() => {
                                // Logic สำหรับล้างค่าเพื่อกลับไปแก้ไขใหม่ (ถ้าต้องการ)
                                handleUpdateItemTracking(
                                  item.id,
                                  order.id,
                                  "",
                                  "",
                                );
                              }}
                            >
                              แก้ไขเลข
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <h3 className="text-sm font-semibold text-foreground">
                      ที่อยู่จัดส่ง
                    </h3>
                    <p className="font-medium text-foreground">
                      {order.shippingName}
                    </p>
                    <p>เบอร์ {order.shippingPhone}</p>
                    <p>{order.shippingLine1}</p>
                    {showShippingLine2 && <p>{order.shippingLine2}</p>}
                    <p>
                      {order.shippingSubdistrict}, {order.shippingDistrict},{" "}
                      {order.shippingProvince} {order.shippingPostalCode}
                    </p>
                    {order.notes && (
                      <p className="text-xs text-muted-foreground/80">
                        หมายเหตุ: {order.notes}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-lg border border-border/50 bg-muted/20 p-4 text-sm">
                      <div className="flex items-center justify-between">
                        <span>ยอดรวมสินค้า</span>
                        <span>{formatPrice(order.subtotal)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>ค่าจัดส่ง</span>
                        <span>{formatPrice(order.shippingFee)}</span>
                      </div>
                      {order.depositAmount > 0 && (
                        <div className="flex items-center justify-between">
                          <span>ชำระมัดจำ (COD)</span>
                          <span>{formatPrice(order.depositAmount)}</span>
                        </div>
                      )}
                      <Separator className="my-3" />
                      <div className="flex items-center justify-between text-base font-semibold text-foreground">
                        <span>ยอดสุทธิ</span>
                        <span>{formatPrice(order.totalAmount)}</span>
                      </div>

                      {(refundPending > 0 ||
                        totalRefunded > 0 ||
                        Math.abs(netBalance) > 1) && (
                        <div className="mt-4 rounded-md bg-white p-3 border border-border/60 shadow-sm space-y-2">
                          {/* 1. สรุปยอดจ่ายจริง */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>ลูกค้าชำระแล้ว (รวม):</span>
                            <span className="font-medium text-emerald-600">
                              {formatPrice(totalPaid)}
                            </span>
                          </div>

                          {/* 2. กรณีมีรอคืนเงิน (สำคัญ!) */}
                          {refundPending > 0 && (
                            <div className="flex items-center justify-between text-xs font-bold text-amber-600 bg-amber-50 p-2 rounded border border-amber-100">
                              <span className="flex items-center gap-1">
                                <Info className="w-3 h-3" /> รอคืนเงินส่วนต่าง:
                              </span>
                              <span>{formatPrice(refundPending)}</span>
                            </div>
                          )}

                          {/* 3. กรณีคืนเงินไปแล้ว */}
                          {totalRefunded > 0 && (
                            <div className="flex items-center justify-between text-xs text-muted-foreground bg-gray-50 p-1.5 rounded">
                              <span>คืนเงินแล้ว:</span>
                              <span>-{formatPrice(totalRefunded)}</span>
                            </div>
                          )}

                          <Separator className="border-dashed" />

                          {/* 4. สรุปสถานะ Balance สุดท้าย */}
                          <div className="flex items-center justify-between text-xs pt-1">
                            <span>สถานะคงเหลือ:</span>
                            {refundPending > 0 ? (
                              <span className="text-amber-600 font-bold">
                                รอแอดมินดำเนินการ
                              </span>
                            ) : Math.abs(netBalance) < 1 ? ( // ถ้าเหลือเศษน้อยกว่า 1 บาทถือว่าครบ
                              <span className="text-emerald-600 font-bold flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> ครบถ้วน
                              </span>
                            ) : netBalance > 0 ? (
                              <span className="text-blue-600 font-bold flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> จ่ายเกิน{" "}
                                {formatPrice(netBalance)}
                              </span>
                            ) : (
                              <span className="text-red-600 font-bold">
                                ขาดอีก {formatPrice(Math.abs(netBalance))}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* {order.trackingNumber && (
                      <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 px-3 py-2 text-sm">
                        หมายเลขติดตามพัสดุ:{" "}
                        <span className="font-medium text-foreground">
                          {order.trackingNumber}
                        </span>
                      </div>
                    )} */}

                    {(order.trackingNumber || order.carrier) && (
                      <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 px-3 py-2 text-sm space-y-1">
                        {order.carrier && (
                          <p>
                            ขนส่ง:{" "}
                            <span className="font-medium text-foreground">
                              {order.carrier}
                            </span>
                          </p>
                        )}

                        {order.trackingNumber && (
                          <p>
                            หมายเลขติดตามพัสดุ:{" "}
                            <span className="font-medium text-foreground">
                              {order.trackingNumber}
                            </span>
                          </p>
                        )}
                      </div>
                    )}

                    {/* {order.payments.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-foreground">
                          การชำระเงิน
                        </h3>
                        <div className="space-y-2">
                          {order.payments.map((payment) => (
                            <div
                              key={payment.id}
                              className="rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-sm"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">
                                  {payment.method === "COD"
                                    ? "โอนค่าส่งล่วงหน้า"
                                    : "โอนเต็มจำนวน"}
                                </span>
                                <span className="font-semibold text-foreground">
                                  {formatPrice(payment.amount)}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground md:text-sm">
                                <span>
                                  สถานะ: {getPaymentStatusLabel(payment.status)}
                                </span>
                                {payment.paidAt && (
                                  <span>
                                    เมื่อ {dayjs(payment.paidAt).format("LLL")}
                                  </span>
                                )}
                                {payment.slipUrl && (
                                  <Link
                                    href={payment.slipUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary underline"
                                  >
                                    ดูสลิป
                                  </Link>
                                )}
                              </div>
                              {payment.slipUrl && (
                                <div className="relative mt-2 h-80 overflow-hidden rounded-lg border border-border/50 bg-background">
                                  <Image
                                    src={payment.slipUrl}
                                    alt={`หลักฐานการชำระเงิน ${payment.method}`}
                                    fill
                                    className="object-contain"
                                    sizes="(min-width:768px) 400px, 100vw"
                                    unoptimized
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )} */}

                    {order.payments.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-foreground">
                          การชำระเงิน ({order.payments.length} รายการ)
                        </h3>
                        <div className="space-y-3">
                          {order.payments.map((payment, index) => (
                            <div
                              key={payment.id}
                              className="rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-sm space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">
                                  ใบที่ {index + 1}:{" "}
                                  {payment.method === "COD"
                                    ? "มัดจำ (COD)"
                                    : "โอนชำระ"}
                                </span>
                                <div className="flex items-center gap-2">
                                  {/* แสดงสถานะแยกใบเพื่อให้แอดมินรู้ว่าใบไหนตรวจแล้วหรือยังไม่ได้ตรวจ */}
                                  <Badge
                                    variant="outline"
                                    className={getPaymentStatusClass(
                                      payment.status,
                                    )}
                                  >
                                    {getPaymentStatusLabel(payment.status)}
                                  </Badge>
                                  <span className="font-semibold text-foreground">
                                    {formatPrice(payment.amount)}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground md:text-sm">
                                {payment.paidAt && (
                                  <span>
                                    ส่งเมื่อ:{" "}
                                    {dayjs(payment.paidAt).format("LLL")}
                                  </span>
                                )}
                                {payment.slipUrl && (
                                  <Link
                                    href={payment.slipUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary underline font-medium"
                                  >
                                    ดูรูปสลิปเต็ม
                                  </Link>
                                )}
                              </div>

                              {payment.status === "PENDING_REFUND" && (
                                <div className="mt-2 p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                                  <p className="font-semibold mb-1 flex items-center gap-1">
                                    <Info className="w-3 h-3" />{" "}
                                    ข้อมูลสำหรับโอนคืน:
                                  </p>
                                  <div className="grid grid-cols-[70px_1fr] gap-1">
                                    <span className="text-muted-foreground">
                                      ธนาคาร:
                                    </span>
                                    <span className="font-medium">
                                      {payment.refundBank || "-"}
                                    </span>

                                    <span className="text-muted-foreground">
                                      เลขบัญชี:
                                    </span>
                                    <span className="font-mono font-bold select-all">
                                      {payment.refundAccountNo || "-"}
                                    </span>

                                    <span className="text-muted-foreground">
                                      ชื่อบัญชี:
                                    </span>
                                    <span className="font-medium">
                                      {payment.refundAccountName || "-"}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {payment.slipUrl && (
                                <div className="relative mt-2 h-80 overflow-hidden rounded-lg border border-border/50 bg-background group">
                                  <Image
                                    src={payment.slipUrl}
                                    alt={`สลิปใบที่ ${index + 1}`}
                                    fill
                                    className="object-contain"
                                    sizes="(min-width:768px) 400px, 100vw"
                                    unoptimized
                                  />
                                </div>
                              )}

                              {/* 🔘 ปรับเงื่อนไข: แสดงปุ่มเฉพาะสลิปใบที่ 2 เป็นต้นไป และต้องรอตรวจสอบอยู่ */}
                              {payment.status === "WAITING_VERIFICATION" &&
                                index > 0 && (
                                  <div className="pt-3 flex items-center gap-2">
                                    {" "}
                                    {/* ใช้ items-center เพื่อให้ความสูงเท่ากัน */}
                                    <Button
                                      size="sm"
                                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-10 text-xs md:text-sm shadow-sm"
                                      disabled={
                                        isPending && pendingOrderId === order.id
                                      }
                                      onClick={() =>
                                        handleApproveSpecificPayment(
                                          payment.id,
                                          order.id,
                                        )
                                      }
                                    >
                                      {isPending && pendingOrderId === order.id
                                        ? "กำลังบันทึก..."
                                        : "อนุมัติสลิปส่วนต่างนี้"}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      className="h-10 px-4 text-xs md:text-sm shadow-sm" // เพิ่มความสูง h-10 ให้เท่ากับปุ่มอนุมัติ
                                      disabled={
                                        isPending && pendingOrderId === order.id
                                      }
                                      onClick={() => {
                                        if (
                                          confirm(
                                            "ยืนยันการปฏิเสธสลิปส่วนต่างใบนี้?",
                                          )
                                        ) {
                                          handleRejectSpecificPayment(
                                            payment.id,
                                            order.id,
                                          );
                                        }
                                      }}
                                    >
                                      ปฏิเสธ
                                    </Button>
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}

      {/* <Dialog
        open={trackingDialogOpen}
        onOpenChange={(open) => {
          setTrackingDialogOpen(open);
          if (!open) {
            setTrackingTargetId(null);
            setTrackingValue("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เพิ่มหมายเลขติดตามพัสดุ</DialogTitle>
            <DialogDescription>
              กรอกหมายเลขติดตามเพื่อแจ้งลูกค้าว่าสินค้าได้จัดส่งแล้ว
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                บริษัทขนส่ง
              </label>

              <Select value={carrierValue} onValueChange={setCarrierValue}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="เลือกบริษัทขนส่ง" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Flash Express">Flash Express</SelectItem>
                  <SelectItem value="Kerry Express">Kerry Express</SelectItem>
                  <SelectItem value="J&T Express">J&T Express</SelectItem>
                  <SelectItem value="ThaiPost">ไปรษณีย์ไทย</SelectItem>
                  <SelectItem value="NinjaVan">Ninja Van</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                หมายเลขติดตามพัสดุ
              </label>
              <Input
                value={trackingValue}
                onChange={(e) => setTrackingValue(e.target.value)}
                placeholder="Tracking Number"
                className="bg-muted/30 border-border"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setTrackingDialogOpen(false);
                setTrackingTargetId(null);
                setTrackingValue("");
              }}
            >
              ยกเลิก
            </Button>
            <Button
              onClick={() => {
                if (!trackingTargetId) {
                  return;
                }
                handleUpdateStatus(
                  trackingTargetId,
                  OrderStatus.SHIPPED,
                  "อัปเดตสถานะเป็นจัดส่งแล้ว",
                  trackingValue.trim() || undefined,
                  carrierValue, // 👈 เพิ่มตรงนี้!
                );
                setTrackingDialogOpen(false);
                setTrackingTargetId(null);
                setTrackingValue("");
              }}
              disabled={isPending && pendingOrderId === trackingTargetId}
            >
              บันทึกและอัปเดตสถานะ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      <div className="flex justify-end">
        <PaginationControls
          meta={meta}
          pathname={pathname}
          query={paginationQuery}
        />
      </div>
    </div>
  );
}
