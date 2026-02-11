-- AlterTable
ALTER TABLE "UserSpinConfig" ADD COLUMN     "lastWinAt" TIMESTAMP(3),
ADD COLUMN     "winCooldown" INTEGER NOT NULL DEFAULT 0;
