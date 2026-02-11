-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('WEIGHT', 'UNIT');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "type" "ProductType" NOT NULL DEFAULT 'WEIGHT',
ADD COLUMN     "unitLabel" TEXT NOT NULL DEFAULT 'กรัม';

-- AlterTable
ALTER TABLE "ProductWeight" ADD COLUMN     "name" TEXT;
