-- CreateEnum
CREATE TYPE "OrderItemStatus" AS ENUM ('NORMAL', 'OUT_OF_STOCK', 'REPLACED');

-- AlterTable
ALTER TABLE "order_item" ADD COLUMN     "status" "OrderItemStatus" NOT NULL DEFAULT 'NORMAL';
