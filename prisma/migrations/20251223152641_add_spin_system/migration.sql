-- CreateEnum
CREATE TYPE "SpinOrderStatus" AS ENUM ('PENDING_PAYMENT', 'WAITING_VERIFICATION', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SpinPaymentMethod" AS ENUM ('PROMPTPAY', 'MANUAL_TRANSFER');

-- CreateEnum
CREATE TYPE "SpinPackageStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "SpinCampaignStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'ENDED');

-- CreateEnum
CREATE TYPE "SpinSlotStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "SpinPrizeType" AS ENUM ('PRODUCT', 'DISCOUNT', 'POINT', 'NONE');

-- CreateEnum
CREATE TYPE "SpinResultStatus" AS ENUM ('WIN', 'LOSE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SpinQuotaStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "SpinQuotaAction" AS ENUM ('ADD', 'REMOVE', 'RESET');

-- CreateTable
CREATE TABLE "SpinPackage" (
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

    CONSTRAINT "SpinPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpinOrder" (
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

    CONSTRAINT "SpinOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpinOrderPayment" (
    "id" TEXT NOT NULL,
    "spinOrderId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "slipUrl" TEXT,
    "slipFileId" TEXT,
    "status" "SpinOrderStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpinOrderPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpinCampaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "SpinCampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpinCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpinPrize" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "SpinPrizeType" NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "fileId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpinPrize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpinSlot" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "slotIndex" INTEGER NOT NULL,
    "prizeId" TEXT NOT NULL,
    "status" "SpinSlotStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "SpinSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpinQuota" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "total" INTEGER NOT NULL DEFAULT 0,
    "used" INTEGER NOT NULL DEFAULT 0,
    "status" "SpinQuotaStatus" NOT NULL DEFAULT 'ACTIVE',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpinQuota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpinQuotaLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" "SpinQuotaAction" NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpinQuotaLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSpinConfig" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "winRateBoost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "loseRateBoost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "forcePrizeId" TEXT,
    "disabledSpin" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSpinConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpinHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "prizeId" TEXT,
    "slotIndex" INTEGER NOT NULL,
    "result" "SpinResultStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpinHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SpinOrder_orderNumber_key" ON "SpinOrder"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SpinSlot_campaignId_slotIndex_key" ON "SpinSlot"("campaignId", "slotIndex");

-- CreateIndex
CREATE UNIQUE INDEX "SpinQuota_userId_key" ON "SpinQuota"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSpinConfig_userId_key" ON "UserSpinConfig"("userId");

-- AddForeignKey
ALTER TABLE "SpinOrder" ADD CONSTRAINT "SpinOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpinOrder" ADD CONSTRAINT "SpinOrder_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "SpinPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpinOrderPayment" ADD CONSTRAINT "SpinOrderPayment_spinOrderId_fkey" FOREIGN KEY ("spinOrderId") REFERENCES "SpinOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpinSlot" ADD CONSTRAINT "SpinSlot_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "SpinCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpinSlot" ADD CONSTRAINT "SpinSlot_prizeId_fkey" FOREIGN KEY ("prizeId") REFERENCES "SpinPrize"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpinQuota" ADD CONSTRAINT "SpinQuota_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpinQuotaLog" ADD CONSTRAINT "SpinQuotaLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpinQuotaLog" ADD CONSTRAINT "SpinQuotaLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSpinConfig" ADD CONSTRAINT "UserSpinConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSpinConfig" ADD CONSTRAINT "UserSpinConfig_forcePrizeId_fkey" FOREIGN KEY ("forcePrizeId") REFERENCES "SpinPrize"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpinHistory" ADD CONSTRAINT "SpinHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpinHistory" ADD CONSTRAINT "SpinHistory_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "SpinCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpinHistory" ADD CONSTRAINT "SpinHistory_prizeId_fkey" FOREIGN KEY ("prizeId") REFERENCES "SpinPrize"("id") ON DELETE SET NULL ON UPDATE CASCADE;
