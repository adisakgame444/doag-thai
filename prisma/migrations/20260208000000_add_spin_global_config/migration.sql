-- CreateTable
CREATE TABLE "spin_global_config" (
    "id" TEXT NOT NULL,
    "globalCanWin" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spin_global_config_pkey" PRIMARY KEY ("id")
);

-- Insert initial global config
INSERT INTO "spin_global_config" ("id", "globalCanWin", "updatedAt") VALUES ('global', false, NOW());
