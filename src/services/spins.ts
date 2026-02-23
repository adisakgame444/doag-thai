import db from "@/lib/db";
import {
  SpinOrderStatus,
  SpinPaymentMethod,
  PaymentStatus,
  SpinQuotaStatus,
  SpinResultStatus,
} from "@/generated/prisma/enums";
import { nanoid } from "nanoid";

// ===== SPIN PACKAGE =====
export async function getActiveSpinPackages() {
  return db.spinPackage.findMany({
    where: {
      status: "ACTIVE",
    },
    orderBy: {
      sortOrder: "asc",
    },
  });
}

export async function getSpinPackageById(id: string) {
  return db.spinPackage.findUnique({
    where: { id },
  });
}

// ===== SPIN ORDER =====
export async function createSpinOrder(data: {
  userId: string;
  packageId: string;
  paymentMethod: SpinPaymentMethod;
  note?: string | null;
}) {
  const spinPackage = await db.spinPackage.findUnique({
    where: { id: data.packageId },
  });

  if (!spinPackage) {
    throw new Error("ไม่พบแพคเกจสปิน");
  }

  if (spinPackage.status !== "ACTIVE") {
    throw new Error("แพคเกจสปินไม่พร้อมใช้งาน");
  }

  const orderNumber = `SPIN${nanoid(10).toUpperCase()}`;

  const spinOrder = await db.spinOrder.create({
    data: {
      orderNumber,
      userId: data.userId,
      packageId: data.packageId,
      spinAmount: spinPackage.spinAmount, // จำนวนครั้ง
      totalAmount: spinPackage.price, // ราคา (ต้องเท่ากับ spinAmount)
      status: SpinOrderStatus.PENDING_PAYMENT,
      paymentMethod: data.paymentMethod,
      note: data.note,
    },
  });

  return spinOrder;
}

export async function getSpinOrderById(id: string) {
  return db.spinOrder.findUnique({
    where: { id },
    include: {
      package: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      payments: true,
    },
  });
}

export async function getSpinOrderByOrderNumber(orderNumber: string) {
  return db.spinOrder.findUnique({
    where: { orderNumber },
    include: {
      package: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      payments: true,
    },
  });
}

export async function getSpinOrdersByUserId(userId: string) {
  return db.spinOrder.findMany({
    where: { userId },
    include: {
      package: true,
      payments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// ===== SPIN ORDER PAYMENT =====
export async function addSpinOrderPayment(data: {
  spinOrderId: string;
  amount: number;
  slipUrl?: string | null;
  slipFileId?: string | null;
}) {
  const spinOrder = await db.spinOrder.findUnique({
    where: { id: data.spinOrderId },
    include: { payments: true },
  });

  if (!spinOrder) {
    throw new Error("ไม่พบคำสั่งซื้อสปิน");
  }

  // คำนวณยอดที่จ่ายไปแล้ว
  const totalPaid = spinOrder.payments.reduce(
    (sum, p) => sum + (p.amount || 0),
    0,
  );

  // ตรวจสอบว่ายอดรวมไม่เกินยอดที่ต้องจ่าย
  if (totalPaid + data.amount > spinOrder.totalAmount + 0.01) {
    throw new Error("ยอดชำระเกินยอดที่ต้องจ่าย");
  }

  const payment = await db.spinOrderPayment.create({
    data: {
      spinOrderId: data.spinOrderId,
      amount: data.amount,
      slipUrl: data.slipUrl,
      slipFileId: data.slipFileId,
      status: data.slipUrl
        ? PaymentStatus.WAITING_VERIFICATION
        : PaymentStatus.PENDING,
    },
  });

  // อัปเดตสถานะออเดอร์
  const newTotalPaid = totalPaid + data.amount;
  let newStatus = spinOrder.status;

  if (data.slipUrl) {
    newStatus = SpinOrderStatus.WAITING_VERIFICATION;
  } else if (newTotalPaid >= spinOrder.totalAmount - 0.01) {
    newStatus = SpinOrderStatus.WAITING_VERIFICATION;
  }

  await db.spinOrder.update({
    where: { id: data.spinOrderId },
    data: { status: newStatus },
  });

  return payment;
}

// ===== APPROVE SPIN ORDER =====
export async function approveSpinOrderPayment(spinOrderId: string) {
  return db.$transaction(async (tx) => {
    const spinOrder = await tx.spinOrder.findUnique({
      where: { id: spinOrderId },
      include: {
        payments: true,
        package: true,
      },
    });

    if (!spinOrder) {
      throw new Error("ไม่พบคำสั่งซื้อสปิน");
    }

    if (spinOrder.status !== SpinOrderStatus.WAITING_VERIFICATION) {
      throw new Error("สถานะคำสั่งซื้อไม่ถูกต้อง");
    }

    // อัปเดตสถานะสลิปทั้งหมดเป็น APPROVED
    await tx.spinOrderPayment.updateMany({
      where: {
        spinOrderId: spinOrder.id,
        status: PaymentStatus.WAITING_VERIFICATION,
      },
      data: {
        status: PaymentStatus.APPROVED,
        paidAt: new Date(),
      },
    });

    // อัปเดตสถานะออเดอร์
    await tx.spinOrder.update({
      where: { id: spinOrderId },
      data: {
        status: SpinOrderStatus.APPROVED,
      },
    });

    // เพิ่ม SpinQuota ให้ผู้ใช้
    const existingQuota = await tx.spinQuota.findUnique({
      where: { userId: spinOrder.userId },
    });

    if (existingQuota) {
      await tx.spinQuota.update({
        where: { userId: spinOrder.userId },
        data: {
          total: existingQuota.total + spinOrder.spinAmount,
        },
      });
    } else {
      await tx.spinQuota.create({
        data: {
          userId: spinOrder.userId,
          total: spinOrder.spinAmount,
          used: 0,
          status: SpinQuotaStatus.ACTIVE,
        },
      });
    }

    return spinOrder;
  });
}

export async function rejectSpinOrderPayment(spinOrderId: string) {
  const spinOrder = await db.spinOrder.findUnique({
    where: { id: spinOrderId },
  });

  if (!spinOrder) {
    throw new Error("ไม่พบคำสั่งซื้อสปิน");
  }

  await db.spinOrder.update({
    where: { id: spinOrderId },
    data: {
      status: SpinOrderStatus.REJECTED,
    },
  });

  // อัปเดตสถานะสลิปทั้งหมดเป็น REJECTED
  await db.spinOrderPayment.updateMany({
    where: {
      spinOrderId: spinOrder.id,
      status: PaymentStatus.WAITING_VERIFICATION,
    },
    data: {
      status: PaymentStatus.REJECTED,
    },
  });
}

// ===== SPIN QUOTA =====
export async function getSpinQuotaByUserId(userId: string) {
  return db.spinQuota.findUnique({
    where: { userId },
  });
}

export async function useSpinQuota(userId: string, amount: number = 1) {
  return db.$transaction(async (tx) => {
    const quota = await tx.spinQuota.findUnique({
      where: { userId },
    });

    if (!quota) {
      throw new Error("คุณไม่มีสิทธิ์หมุนสปิน");
    }

    if (quota.status !== SpinQuotaStatus.ACTIVE) {
      throw new Error("สิทธิ์หมุนสปินถูกระงับ");
    }

    if (quota.used + amount > quota.total) {
      throw new Error("สิทธิ์หมุนสปินไม่พอ");
    }

    return tx.spinQuota.update({
      where: { userId },
      data: {
        used: quota.used + amount,
      },
    });
  });
}

// ===== USER SPIN CONFIG =====
export async function getUserSpinConfig(userId: string) {
  let config = await db.userSpinConfig.findUnique({
    where: { userId },
  });

  if (!config) {
    config = await db.userSpinConfig.create({
      data: {
        userId,
        winRateBoost: 0,
        loseRateBoost: 0,
        spinCount: 0,
        winCooldown: 0,
        forceWin: false,
        canWin: false, // ไม่อนุมัติให้ชนะโดยอัตโนมัติ
        disabledSpin: false,
      },
    });
  }

  return config;
}

export async function updateUserSpinConfig(
  userId: string,
  data: {
    winRateBoost?: number;
    loseRateBoost?: number;
    winCooldown?: number;
    forceWin?: boolean;
    canWin?: boolean;
    disabledSpin?: boolean;
  },
) {
  return db.userSpinConfig.upsert({
    where: { userId },
    create: {
      userId,
      ...data,
    },
    update: data,
  });
}

export async function deleteUserSpinConfig(userId: string) {
  return db.userSpinConfig.delete({
    where: { userId },
  });
}

// ===== SPIN GAME =====
export async function performSpin(userId: string) {
  const maxRetries = 3;
  let lastError: Error | null = null;

  // Fetch active slot images before transaction
  const slotImages = await db.spinSlotImage.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: { label: true, imageUrl: true },
  });

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await db.$transaction(
        async (tx) => {
          // ตรวจสอบสิทธิ์ - ใช้ select for update เพื่อป้องกัน race condition
          const quota = await tx.spinQuota.findUnique({
            where: { userId },
          });

          if (!quota || quota.status !== SpinQuotaStatus.ACTIVE) {
            throw new Error("คุณไม่มีสิทธิ์หมุนสปิน");
          }

          // ตรวจสอบ quota อีกครั้งก่อนใช้ (ป้องกัน race condition)
          if (quota.used >= quota.total) {
            throw new Error("สิทธิ์หมุนสปินหมดแล้ว");
          }

          // ดึง config - ใช้ transaction client เพื่อให้อยู่ใน transaction เดียวกัน
          let config = await tx.userSpinConfig.findUnique({
            where: { userId },
          });

          // ถ้าไม่มี config ให้สร้างใหม่ใน transaction เดียวกัน
          if (!config) {
            config = await tx.userSpinConfig.create({
              data: {
                userId,
                winRateBoost: 0,
                loseRateBoost: 0,
                spinCount: 0,
                winCooldown: 0,
                forceWin: false,
                canWin: false,
                disabledSpin: false,
              },
            });
          }

          if (config.disabledSpin) {
            throw new Error("การหมุนสปินถูกปิดใช้งาน");
          }

          // ตรวจสอบการอนุมัติจากแอดมิน (per-user only)
          // อัตราชนะ 1:1 - เมื่อแอดมินอนุมัติแล้ว หมุนครั้งถัดไปจะชนะทันที
          const canWin = config.canWin;

          // ถ้าไม่ได้รับอนุมัติ = แพ้
          const result: SpinResultStatus = canWin ? "WIN" : "LOSE";

          // อัปเดต config และเก็บค่าที่อัพเดทแล้ว
          const updatedConfig = await tx.userSpinConfig.update({
            where: { userId },
            data: {
              spinCount: result === "WIN" ? 0 : config.spinCount + 1, // รีเซ็ตเมื่อชนะ
              canWin: config.canWin, // ไม่รีเซ็ต (ชนะต่อเนื่องจนกว่าแอดมินจะปิด)
              lastWinAt: result === "WIN" ? new Date() : config.lastWinAt,
            },
          });

          // ใช้ quota - ใช้ increment เพื่อป้องกัน race condition
          const updatedQuota = await tx.spinQuota.update({
            where: { userId },
            data: {
              used: {
                increment: 1,
              },
            },
          });

          // ตรวจสอบอีกครั้งหลังอัปเดต
          if (updatedQuota.used > updatedQuota.total) {
            throw new Error("สิทธิ์หมุนสปินไม่พอ");
          }

          // Generate random slot index
          const slotIndex = Math.floor(Math.random() * 8); // 0-7
          
          // Get prize name and image from slot images
          let prizeName: string | null = null;
          let prizeImageUrl: string | null = null;
          if (result === "WIN") {
            // Use slotIndex to get the corresponding prize label
            if (slotImages.length > 0) {
              const prizeImage = slotImages[slotIndex % slotImages.length];
              prizeName = prizeImage?.label || "รางวัลพิเศษ";
              prizeImageUrl = prizeImage?.imageUrl || null;
            } else {
              // Fallback if no slot images configured
              prizeName = "รางวัลพิเศษ";
            }
          }

          // บันทึกประวัติ
          const history = await tx.spinHistory.create({
            data: {
              userId,
              slotIndex,
              result,
              prizeName,
            },
          });

          return {
            result,
            prizeName,
            prizeImageUrl,
            history,
            remainingSpins: updatedQuota.total - updatedQuota.used,
            updatedConfig, // Return updated config so client can sync
          };
        },
        {
          maxWait: 5000, // รอ transaction ได้สูงสุด 5 วินาที
          timeout: 10000, // timeout หลังจาก 10 วินาที
        },
      );
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // ถ้าเป็น error ที่ไม่ควร retry (เช่น quota หมด, disabled) ให้ throw ทันที
      if (
        lastError.message.includes("สิทธิ์หมุนสปินหมดแล้ว") ||
        lastError.message.includes("คุณไม่มีสิทธิ์หมุนสปิน") ||
        lastError.message.includes("การหมุนสปินถูกปิดใช้งาน") ||
        lastError.message.includes("ไม่พบการตั้งค่าสปิน")
      ) {
        throw lastError;
      }

      // ถ้าเป็น attempt สุดท้าย ให้ throw error
      if (attempt === maxRetries) {
        throw lastError;
      }

      // รอสักครู่ก่อน retry (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, 100 * attempt));
    }
  }

  // Fallback (ไม่ควรมาถึงจุดนี้)
  throw lastError || new Error("ไม่สามารถหมุนสปินได้");
}

export async function voidSpin(spinHistoryId: string) {
  return db.spinHistory.update({
    where: { id: spinHistoryId },
    data: {
      result: "LOSE",
      prizeName: null,
    },
  });
}

export async function getSpinHistoryByUserId(
  userId: string,
  options?: {
    limit?: number;
    skip?: number;
  },
) {
  const limit = options?.limit ?? 20;
  const skip = options?.skip ?? 0;

  // ใช้ select เฉพาะ fields ที่จำเป็นเพื่อลดขนาดข้อมูล
  const results = await db.spinHistory.findMany({
    where: { userId },
    select: {
      id: true,
      slotIndex: true,
      result: true,
      prizeName: true,
      createdAt: true,
      isClaimed: true, // ✅ ต้องเช็คว่ามีบรรทัดนี้ไหม!
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: skip,
  });

  // Serialize Date objects เป็น ISO string เพื่อป้องกันปัญหา hydration
  return results.map((item) => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
  }));
}

export async function getSpinHistoryCountByUserId(userId: string) {
  // ใช้ count แทน findMany + length เพื่อประสิทธิภาพที่ดีกว่า
  return db.spinHistory.count({
    where: { userId },
  });
}

export async function getSpinHistoryStatsByUserId(userId: string) {
  const [totalCount, winCount] = await Promise.all([
    db.spinHistory.count({
      where: { userId },
    }),
    db.spinHistory.count({
      where: { userId, result: "WIN" },
    }),
  ]);

  return {
    totalCount,
    winCount,
    loseCount: totalCount - winCount,
  };
}



// ===== ADMIN =====
export async function getAllSpinHistory(filters?: {
  userId?: string;
  result?: SpinResultStatus;
  search?: string;
  limit?: number;
}) {
  const where: any = {};

  if (filters?.userId) {
    where.userId = filters.userId;
  }

  if (filters?.result) {
    where.result = filters.result;
  }

  if (filters?.search) {
    where.OR = [
      { user: { name: { contains: filters.search, mode: "insensitive" } } },
      { user: { email: { contains: filters.search, mode: "insensitive" } } },
      { prizeName: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return db.spinHistory.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: filters?.limit || 100,
  });
}
export async function getAllSpinOrders(filters?: {
  status?: SpinOrderStatus;
  search?: string;
}) {
  const where: any = {};

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.search) {
    where.OR = [
      { orderNumber: { contains: filters.search, mode: "insensitive" } },
      { user: { name: { contains: filters.search, mode: "insensitive" } } },
      { user: { email: { contains: filters.search, mode: "insensitive" } } },
    ];
  }

  return db.spinOrder.findMany({
    where,
    include: {
      package: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      payments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAllUsersWithSpinQuota() {
  return db.user.findMany({
    where: {
      spinQuota: {
        isNot: null,
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      spinQuota: true,
      spinConfig: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function approveUserToWin(userId: string) {
  return db.userSpinConfig.upsert({
    where: { userId },
    create: {
      userId,
      canWin: true,
      forceWin: false,
    },
    update: {
      canWin: true,
    },
  });
}

export async function forceUserToWin(userId: string) {
  return db.userSpinConfig.upsert({
    where: { userId },
    create: {
      userId,
      forceWin: true,
      canWin: true,
    },
    update: {
      forceWin: true,
      canWin: true,
    },
  });
}

export async function revokeUserWinPermission(userId: string) {
  return db.userSpinConfig.upsert({
    where: { userId },
    create: {
      userId,
      canWin: false,
      forceWin: false,
    },
    update: {
      canWin: false,
      forceWin: false,
    },
  });
}
