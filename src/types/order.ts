import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  OrderItemStatus,
} from "@/generated/prisma/enums";

export interface OrderItemDTO {
  id: string;
  productId: string | null;
  weightId: string | null;
  productTitle: string;
  productSku: string | null;
  rewardImageUrl?: string | null;
  weightValue: number | null;
  unitPrice: number;
  basePrice: number | null;
  quantity: number;
  subtotal: number;
  codAvailable: boolean;
  status: OrderItemStatus; // 👈 2. เพิ่มบรรทัดนี้
  createdAt: Date;
  updatedAt: Date;
  unitLabel?: string | null;
  variantName?: string | null;
  trackingNumber?: string | null;
  carrier?: string | null;
  spinSlotImage?: {
    imageUrl: string;
  } | null;
  product?: {
    ProductImage: {
      url: string;
      isMain: boolean; // ✅ เพิ่มบรรทัดนี้เข้าไปครับ
    }[];
  } | null;
}

export interface OrderPaymentDTO {
  id: string;
  method: PaymentMethod;
  amount: number;
  slipUrl: string | null;
  slipFileId: string | null;
  status: PaymentStatus;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // ✅ ต้องเพิ่ม 3 ตัวนี้ครับ
  refundBank?: string | null;
  refundAccountName?: string | null;
  refundAccountNo?: string | null;
}

export interface OrderDetailDTO {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingFee: number;
  depositAmount: number;
  totalAmount: number;
  requiresCodDeposit: boolean;
  shippingName: string;
  shippingPhone: string;
  shippingLine1: string;
  shippingLine2: string | null;
  shippingProvince: string;
  shippingDistrict: string;
  shippingSubdistrict: string;
  shippingPostalCode: string;
  trackingNumber: string | null;
  carrier: string | null; // ← เพิ่มบรรทัดนี้
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItemDTO[];
  payments: OrderPaymentDTO[];
}
