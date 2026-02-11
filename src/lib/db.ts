import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const shouldUseAccelerate = (() => {
  const url = process.env.DATABASE_URL ?? "";
  return url.startsWith("prisma://") || url.startsWith("prisma+");
})();

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const client = new PrismaClient({ adapter });

  if (shouldUseAccelerate) {
    const { withAccelerate } =
      require("@prisma/extension-accelerate") as typeof import("@prisma/extension-accelerate");
    // บังคับ cast กลับเป็น PrismaClient ปกติสำหรับ TS
    return client.$extends(withAccelerate()) as unknown as PrismaClient;
  }

  // อันนี้ก็ cast เหมือนกัน เพราะ $extends({}) ก็ยังเปลี่ยน type
  return client.$extends({}) as unknown as PrismaClient;
}

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
};

const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

export default db;
