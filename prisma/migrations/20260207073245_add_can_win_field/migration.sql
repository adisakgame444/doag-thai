-- CreateEnum
CREATE TYPE "SpinOrderStatus" AS ENUM ('PENDING_PAYMENT', 'WAITING_VERIFICATION', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SpinPaymentMethod" AS ENUM ('PROMPTPAY', 'MANUAL_TRANSFER');

-- CreateEnum
CREATE TYPE "SpinPackageStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "SpinResultStatus" AS ENUM ('WIN', 'LOSE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SpinQuotaStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "SpinQuotaAction" AS ENUM ('ADD', 'REMOVE', 'RESET');

-- CreateTable
CREATE TABLE "spin_package" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "spinAmount" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "fileId" TEXT,
    "status" "SpinPackageStatus" NOT NULL DEFAULT 'ACTIVE',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spin_package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spin_order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "spinAmount" INTEGER NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "status" "SpinOrderStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "paymentMethod" "SpinPaymentMethod" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spin_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spin_order_payment" (
    "id" TEXT NOT NULL,
    "spinOrderId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "slipUrl" TEXT,
    "slipFileId" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spin_order_payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spin_quota" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "total" INTEGER NOT NULL DEFAULT 0,
    "used" INTEGER NOT NULL DEFAULT 0,
    "status" "SpinQuotaStatus" NOT NULL DEFAULT 'ACTIVE',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spin_quota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spin_quota_log" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" "SpinQuotaAction" NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spin_quota_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_spin_config" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "winRateBoost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "loseRateBoost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "spinCount" INTEGER NOT NULL DEFAULT 0,
    "winCooldown" INTEGER NOT NULL DEFAULT 0,
    "lastWinAt" TIMESTAMP(3),
    "forceWin" BOOLEAN NOT NULL DEFAULT false,
    "canWin" BOOLEAN NOT NULL DEFAULT false,
    "disabledSpin" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_spin_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spin_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slotIndex" INTEGER NOT NULL,
    "result" "SpinResultStatus" NOT NULL,
    "prizeName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spin_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "spin_order_orderNumber_key" ON "spin_order"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "spin_quota_userId_key" ON "spin_quota"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_spin_config_userId_key" ON "user_spin_config"("userId");

-- AddForeignKey
ALTER TABLE "spin_order" ADD CONSTRAINT "spin_order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spin_order" ADD CONSTRAINT "spin_order_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "spin_package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spin_order_payment" ADD CONSTRAINT "spin_order_payment_spinOrderId_fkey" FOREIGN KEY ("spinOrderId") REFERENCES "spin_order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spin_quota" ADD CONSTRAINT "spin_quota_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spin_quota_log" ADD CONSTRAINT "spin_quota_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spin_quota_log" ADD CONSTRAINT "spin_quota_log_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_spin_config" ADD CONSTRAINT "user_spin_config_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spin_history" ADD CONSTRAINT "spin_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
