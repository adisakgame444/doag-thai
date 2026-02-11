-- CreateTable
CREATE TABLE "spin_prize" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "fileId" TEXT,
    "emoji" TEXT,
    "color" TEXT NOT NULL DEFAULT 'text-yellow-500',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spin_prize_pkey" PRIMARY KEY ("id")
);
