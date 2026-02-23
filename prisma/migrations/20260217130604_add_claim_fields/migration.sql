-- AlterTable
ALTER TABLE "spin_history" ADD COLUMN     "claimOrderId" TEXT,
ADD COLUMN     "isClaimed" BOOLEAN NOT NULL DEFAULT false;
