/*
  Warnings:

  - You are about to drop the `spin_prize` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `spin_quota_log` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "spin_quota_log" DROP CONSTRAINT "spin_quota_log_adminId_fkey";

-- DropForeignKey
ALTER TABLE "spin_quota_log" DROP CONSTRAINT "spin_quota_log_userId_fkey";

-- DropTable
DROP TABLE "spin_prize";

-- DropTable
DROP TABLE "spin_quota_log";
