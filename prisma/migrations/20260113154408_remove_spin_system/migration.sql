/*
  Warnings:

  - You are about to drop the `SpinCampaign` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpinHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpinOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpinOrderPayment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpinPackage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpinPrize` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpinQuota` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpinQuotaLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpinSlot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSpinConfig` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SpinHistory" DROP CONSTRAINT "SpinHistory_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "SpinHistory" DROP CONSTRAINT "SpinHistory_prizeId_fkey";

-- DropForeignKey
ALTER TABLE "SpinHistory" DROP CONSTRAINT "SpinHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "SpinOrder" DROP CONSTRAINT "SpinOrder_packageId_fkey";

-- DropForeignKey
ALTER TABLE "SpinOrder" DROP CONSTRAINT "SpinOrder_userId_fkey";

-- DropForeignKey
ALTER TABLE "SpinOrderPayment" DROP CONSTRAINT "SpinOrderPayment_spinOrderId_fkey";

-- DropForeignKey
ALTER TABLE "SpinQuota" DROP CONSTRAINT "SpinQuota_userId_fkey";

-- DropForeignKey
ALTER TABLE "SpinQuotaLog" DROP CONSTRAINT "SpinQuotaLog_adminId_fkey";

-- DropForeignKey
ALTER TABLE "SpinQuotaLog" DROP CONSTRAINT "SpinQuotaLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "SpinSlot" DROP CONSTRAINT "SpinSlot_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "SpinSlot" DROP CONSTRAINT "SpinSlot_prizeId_fkey";

-- DropForeignKey
ALTER TABLE "UserSpinConfig" DROP CONSTRAINT "UserSpinConfig_forcePrizeId_fkey";

-- DropForeignKey
ALTER TABLE "UserSpinConfig" DROP CONSTRAINT "UserSpinConfig_userId_fkey";

-- DropTable
DROP TABLE "SpinCampaign";

-- DropTable
DROP TABLE "SpinHistory";

-- DropTable
DROP TABLE "SpinOrder";

-- DropTable
DROP TABLE "SpinOrderPayment";

-- DropTable
DROP TABLE "SpinPackage";

-- DropTable
DROP TABLE "SpinPrize";

-- DropTable
DROP TABLE "SpinQuota";

-- DropTable
DROP TABLE "SpinQuotaLog";

-- DropTable
DROP TABLE "SpinSlot";

-- DropTable
DROP TABLE "UserSpinConfig";

-- DropEnum
DROP TYPE "SpinCampaignStatus";

-- DropEnum
DROP TYPE "SpinOrderStatus";

-- DropEnum
DROP TYPE "SpinPackageStatus";

-- DropEnum
DROP TYPE "SpinPaymentMethod";

-- DropEnum
DROP TYPE "SpinPrizeType";

-- DropEnum
DROP TYPE "SpinQuotaAction";

-- DropEnum
DROP TYPE "SpinQuotaStatus";

-- DropEnum
DROP TYPE "SpinResultStatus";

-- DropEnum
DROP TYPE "SpinSlotStatus";
