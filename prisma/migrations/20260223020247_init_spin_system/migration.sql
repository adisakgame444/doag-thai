-- AlterTable
ALTER TABLE "order_item" ADD COLUMN     "spinSlotImageId" TEXT;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_spinSlotImageId_fkey" FOREIGN KEY ("spinSlotImageId") REFERENCES "spin_slot_image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
