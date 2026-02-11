"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react";

export function AddressSection({ order }: { order: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const showShippingLine2 = Boolean(order.shippingLine2);

  return (
    <div className="rounded-lg border border-border/50 bg-muted/20">
      {/* 🟢 ส่วนหัว (Header): คลิกเพื่อเปิด/ปิด */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>ที่อยู่จัดส่ง</span>
        </div>

        {/* ปุ่มลูกศร */}
        <div
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* 🔴 ส่วนเนื้อหา (Content): ใช้ Grid Trick เพื่ออนิเมชั่นที่ลื่นไหล */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        {/* ⚠️ สำคัญมาก: ต้องมี overflow-hidden ตรงนี้เพื่อตัดส่วนเกินตอนพับ */}
        <div className="overflow-hidden min-h-0">
          {/* ✅ ย้าย Padding มาใส่ตรงนี้แทน! (ข้างในสุด) */}
          <div className="p-4 pt-0 text-sm text-muted-foreground space-y-1">
            <div className="w-full h-px bg-border/50 mb-3" />{" "}
            {/* เส้นคั่นบางๆ ให้ดูเป็นสัดส่วน */}
            <p className="font-medium text-foreground">{order.shippingName}</p>
            <p>เบอร์ {order.shippingPhone}</p>
            <p>{order.shippingLine1}</p>
            {showShippingLine2 && <p>{order.shippingLine2}</p>}
            <p>
              {order.shippingSubdistrict}, {order.shippingDistrict},{" "}
              {order.shippingProvince} {order.shippingPostalCode}
            </p>
            {order.notes && (
              <div className="mt-2 pt-2 border-t border-border/50 text-xs italic bg-yellow-50/50 p-2 rounded text-yellow-700">
                หมายเหตุ: {order.notes}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}