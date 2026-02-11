import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { listOrdersByUser } from "@/services/orders";
import { formatPrice } from "@/lib/format-price";
import dayjs from "@/lib/dayjs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OrderStatus, PaymentMethod, PaymentStatus } from "@/generated/prisma/enums";
import { OrdersHistorySkeleton } from "@/components/skeletons/orders-history-skeleton";
import { Metadata } from "next";
import {
  MessageSquarePlus,
  AlertCircle,
  ShoppingBag,
  MessageCircle,
} from "lucide-react";

import TrackingInfo from "./TrackingInfo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "คำสั่งซื้อของฉัน",
  description:
    "ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!",
};

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

export default async function OrdersPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    redirect("/sign-in?redirect=/orders");
  }

  const orders = await listOrdersByUser(user.id);

  return (
    <div className="container mx-auto space-y-2 py-4 md:py-12 md:px-0 px-[15px]">
      <div className="space-y-2">
        <h1 className="text-[20px] font-semibold text-foreground md:text-3xl">
          คำสั่งซื้อของฉัน
        </h1>
        <p className="text-[10px] text-muted-foreground md:text-base">
          ติดตามสถานะคำสั่งซื้อ ตรวจสอบรายละเอียดการชำระเงิน
          และดูยอดรวมได้ในที่เดียว
        </p>
      </div>

      <Suspense fallback={<OrdersHistorySkeleton />}>
        <OrdersHistory orders={orders} />
      </Suspense>
    </div>
  );
}

export function OrdersHistory({
  orders,
}: {
  orders: Awaited<ReturnType<typeof listOrdersByUser>>;
}) {
  // 🔹 กรองคำสั่งซื้อที่ยังไม่เกิน 3 วัน
  const validOrders = orders.filter((order) => {
    const createdAt = dayjs(order.createdAt);
    const now = dayjs();
    const diffDays = now.diff(createdAt, "day");
    return diffDays < 7; // แสดงเฉพาะที่อายุน้อยกว่า 3 วัน
  });

  if (validOrders.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              ยังไม่มีคำสั่งซื้อ
            </h2>
            <p className="text-sm text-muted-foreground">
              เลือกชมสินค้าแล้วเริ่มต้นสั่งซื้อได้เลย
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/products">เลือกซื้อสินค้า</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {validOrders.map((order) => {
        const createdAt = dayjs(order.createdAt);
        const updatedAt = dayjs(order.updatedAt);
        const showShippingLine2 = Boolean(order.shippingLine2);

        return (
          <Card
            key={order.id}
            id={order.id} // ✅ เพิ่ม ID ตรงนี้ เพื่อให้ link /orders#id ใช้งานได้
            className="border border-border/60 shadow-sm scroll-mt-24 target:border-red-500 target:ring-2 target:ring-red-500/20 transition-all"
          >
            {" "}
            <CardHeader className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-[15px] md:text-xl">
                  คำสั่งซื้อ {order.orderNumber}
                </CardTitle>
                <p className="text-[10px] text-muted-foreground">
                  สั่งเมื่อ {createdAt.format("LLL")} • อัปเดตล่าสุด{" "}
                  {updatedAt.fromNow()}
                </p>
              </div>
              <div className="flex flex-wrap gap-1">
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
              {/* <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground mt-1">
                  รายการสินค้า
                </h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-2 rounded-lg border border-border/40 bg-muted/30 px-3 py-2 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground md:text-base">
                          {item.productTitle}
                        </p>
                        <p className="text-xs text-muted-foreground md:text-sm">
                          จำนวน {item.quantity.toLocaleString()} ชิ้น
                          {item.weightValue
                            ? ` • น้ำหนัก ${item.weightValue.toLocaleString()} กรัม`
                            : ""}
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-foreground md:text-base">
                        {formatPrice(item.subtotal)}
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}

              <div className="space-y-3 mt-2">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  รายการสินค้า
                </h3>
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    // ✅ 1. ปรับ Container หลัก: เปลี่ยนเป็น flex-col เพื่อรองรับกล่องแจ้งเตือนด้านล่าง
                    // และเพิ่ม logic เปลี่ยนสีพื้นหลังเป็นแดงอ่อนๆ เมื่อของหมด
                    className={`flex flex-col gap-3 rounded-lg border px-3 py-3 transition-colors ${
                      item.status === "OUT_OF_STOCK"
                        ? "border-red-200 bg-red-50/40"
                        : "border-border/40 bg-muted/30"
                    }`}
                  >
                    {/* ✅ 2. Wrapper ชั้นใน: ใช้ flex-row เพื่อคง Layout ซ้าย-ขวา เดิมของคุณไว้ */}
                    <div className="flex flex-row items-start justify-between gap-3 w-full">
                      {/* 🟢 ส่วนซ้าย: ข้อมูลสินค้า (Original Code ของคุณ) */}
                      <div className="flex-1 space-y-1 pr-2">
                        {/* ส่วนชื่อสินค้า: เปลี่ยนเป็นสีแดงถ้าของหมด */}
                        <p
                          className={`text-sm font-medium md:text-base line-clamp-2 ${
                            item.status === "OUT_OF_STOCK"
                              ? "text-red-700"
                              : "text-foreground"
                          }`}
                        >
                          {item.productTitle}
                        </p>

                        {/* ส่วนรายละเอียดสินค้า: จำนวนชิ้น และ ตัวเลือก/น้ำหนัก */}
                        <p className="text-xs text-muted-foreground md:text-sm">
                          {/* 1. แสดงจำนวนและคำว่า "ชิ้น" ตายตัวตามที่พี่สั่ง */}
                          จำนวน {item.quantity.toLocaleString()} ชิ้น
                          {/* 2. แสดงตัวเลือก (เช่น 100 ขวด) หรือ น้ำหนัก (เช่น 1 กรัม) */}
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
                      </div>

                      {/* 🟢 ส่วนขวา: ราคา + ปุ่มรีวิว (Original Code ของคุณ) */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        {/* 1. ราคา */}
                        <div className="text-sm font-semibold text-foreground md:text-base">
                          {formatPrice(item.subtotal)}
                        </div>

                        {/* 2. ปุ่มรีวิว (คง logic เดิมของคุณไว้ 100%) */}
                        {order.status === "COMPLETED" && item.productId && (
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            // Style เดิมที่คุณเขียนมา
                            className="h-7 px-2.5 gap-1.5 border-yellow-500/50 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 dark:text-yellow-400 dark:hover:bg-yellow-950/30"
                          >
                            <Link href={`/products/${item.productId}`}>
                              <MessageSquarePlus className="size-3.5" />
                              <span className="text-xs">รีวิว</span>
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* {item.trackingNumber && (
                      <div className="mt-2 flex flex-col gap-1.5 p-2 rounded-md bg-emerald-50 border border-emerald-100 shadow-sm animate-in fade-in slide-in-from-top-1">
                        <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-emerald-700">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          รายการนี้จัดส่งแล้ว
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[10px] md:text-[11px] text-emerald-600 px-1">
                          <p>
                            <span className="opacity-70">ขนส่ง:</span>{" "}
                            <span className="font-semibold">
                              {item.carrier}
                            </span>
                          </p>
                          <p>
                            <span className="opacity-70">เลขพัสดุ:</span>{" "}
                            <span className="font-mono font-bold bg-white/50 px-1.5 py-0.5 rounded border border-emerald-200">
                              {item.trackingNumber}
                            </span>
                          </p>
                        </div>
                      </div>
                    )} */}

                    {/* 📂 ค้นหาจุดที่แสดงเลขพัสดุในหน้าฝั่งลูกค้า (OrdersPage.tsx) */}

                    {/* 🟢 แก้ไขเงื่อนไข: เพิ่มการเช็คสถานะออเดอร์ก่อนแสดงเลข */}
                    {item.trackingNumber &&
                      (order.status === "SHIPPED" ||
                        order.status === "COMPLETED") && (
                        // <div className="mt-2 flex flex-col gap-1.5 p-2 rounded-md bg-emerald-50 border border-emerald-100 shadow-sm">
                        //   <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-emerald-700">
                        //     <span className="relative flex h-2 w-2">
                        //       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        //       <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        //     </span>
                        //     รายการนี้จัดส่งแล้ว
                        //   </div>
                        //   <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[12px] md:text-[11px] text-emerald-600 px-1">
                        //     <p>ขนส่ง: {item.carrier}</p>
                        //     <p>หมายเลขติดตามพัสดุ: {item.trackingNumber}</p>
                        //   </div>
                        // </div>
                        
                        <TrackingInfo
                          carrier={item.carrier}
                          trackingNumber={item.trackingNumber}
                        />
                      )}

                    {/* ✅ 3. ส่วนที่เพิ่ม (Step 6): กล่องแจ้งเตือนเมื่อสินค้าหมด (อยู่ด้านล่าง) */}
                    {item.status === "OUT_OF_STOCK" && (
                      <div className="mt-1 rounded-md bg-white p-3 border border-red-100 shadow-sm animate-in fade-in zoom-in-95">
                        <div className="flex items-center gap-2 text-red-600 mb-2">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm font-semibold">
                            สินค้าหมดกะทันหัน
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          ทางร้านต้องขออภัย สินค้ารายการนี้หมดสต็อก
                          คุณลูกค้าสามารถเลือกเปลี่ยนสินค้าใหม่
                          หรือติดต่อแอดมินได้เลยครับ
                        </p>

                        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                          {/* ปุ่ม 1: เลือกสินค้าใหม่ (ส่ง ID เดิมไปเพื่ออ้างอิง) */}
                          <Button
                            size="sm"
                            className="h-8 text-xs flex-1 bg-red-600 hover:bg-red-700 text-white"
                            asChild
                          >
                            <Link href={`/products?replacement_for=${item.id}`}>
                              <ShoppingBag className="mr-1.5 h-3 w-3" />
                              เลือกสินค้าใหม่
                            </Link>
                          </Button>

                          {/* ปุ่ม 2: ติดต่อแอดมิน */}
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs flex-1 border-red-200 text-red-600 hover:bg-red-50"
                            asChild
                          >
                            {/* ⚠️ อย่าลืมใส่ Link ร้านคุณตรงนี้ */}
                            <Link
                              href="https://line.me/ti/p/@YOUR_ID"
                              target="_blank"
                            >
                              <MessageCircle className="mr-1.5 h-3 w-3" />
                              ติดต่อแอดมิน
                            </Link>
                          </Button>
                        </div>
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
                  {/* {order.trackingNumber && (
                    <p className="text-xs text-muted-foreground/80">
                      หมายเลขติดตามพัสดุ:{" "}
                      <span className="font-medium text-foreground underline text-sm md:text-base">
                        {order.trackingNumber}
                      </span>
                    </p>
                  )}
                  {order.carrier && (
                    <p className="text-xs text-muted-foreground/80">
                      ขนส่ง:{" "}
                      <span className="font-medium text-foreground text-sm md:text-base">
                        {order.carrier}
                      </span>
                    </p>
                  )} */}
                </div>

                <div className="space-y-3">
                  <div className="rounded-lg border border-border/50 bg-muted/20 p-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span>ยอดรวมสินค้า</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    {/* <div className="flex items-center justify-between">
                      <span>ค่าจัดส่ง</span>
                      <span>{formatPrice(order.shippingFee)}</span>
                    </div> */}
                    {order.paymentMethod !== "COD" && (
                      <div className="flex items-center justify-between">
                        <span>ค่าจัดส่ง</span>
                        <span>{formatPrice(order.shippingFee)}</span>
                      </div>
                    )}

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
                  </div>

                  {order.payments.length > 0 && (
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
                                ขั้นตอนที่{" "}
                                {payment.method === "COD"
                                  ? "ชำระมัดจำ"
                                  : "ชำระเต็มจำนวน"}
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
      })}
    </div>
  );
}
