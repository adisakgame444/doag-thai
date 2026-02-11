import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs/promises';
import path from 'path';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Defined order for restoration to satisfy foreign key constraints (Parent -> Child)
const restoreOrder = [
  'user',
  'category',
  'spinPackage',
  'spinSlotImage',
  'recommendedBanner',
  'verification',
  'product',            // depends on Category
  'productWeight',      // depends on Product
  'productImage',       // depends on Product
  'account',            // depends on User
  'session',            // depends on User
  'spinQuota',          // depends on User
  'userSpinConfig',     // depends on User
  'address',            // depends on User
  'order',              // depends on User, Address
  'cart',               // depends on User, Product, ProductWeight
  'review',             // depends on User, Product
  'spinOrder',          // depends on User, SpinPackage
  'orderItem',          // depends on Order, Product, ProductWeight
  'orderPayment',       // depends on Order
  'spinOrderPayment',   // depends on SpinOrder
  'spinHistory',        // depends on User
];

async function restore() {
  const backupDir = path.join(process.cwd(), 'backup_database');
  console.log(`📂 Reading backup from ${backupDir}...`);

  try {
    await fs.access(backupDir);
  } catch {
    console.error(`❌ Backup directory not found at ${backupDir}`);
    process.exit(1);
  }

  console.log('⚠️  WARNING: This will overwrite existing data. Starting restoration in 5 seconds...');
  await new Promise((resolve) => setTimeout(resolve, 5000));

  console.log('🧹 Cleaning up existing data (in reverse dependency order)...');
  
  // Delete in reverse order to avoid FK constraint violations
  const deleteOrder = [...restoreOrder].reverse();
  for (const model of deleteOrder) {
    try {
        // @ts-ignore
        await prisma[model].deleteMany();
        console.log(`   🗑️  Cleared ${model}`);
    } catch (error) {
        console.log(`   ⚠️  Could not clear ${model} (might be empty or have restrictive constraints):`, error);
    }
  }

  console.log('🚀 Starting data restoration...');

  for (const model of restoreOrder) {
    const filePath = path.join(backupDir, `${model}.json`);
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(fileContent);

      if (data.length > 0) {
        // Prisma createMany is faster for bulk inserts
        // @ts-ignore
        await prisma[model].createMany({
          data,
          skipDuplicates: true, // Optional: skip if ID conflicts (though we cleared data)
        });
        console.log(`   ✅ Restored ${model}: ${data.length} records.`);
      } else {
        console.log(`   ℹ️  ${model}: No data to restore.`);
      }
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`   ℹ️  Skipping ${model} (backup file not found).`);
      } else {
        console.error(`   ❌ Failed to restore ${model}:`, error);
        // We continue to next model even if one fails, to try to restore as much as possible
      }
    }
  }

  console.log('✨ Database restoration completed!');
}

restore()
  .catch((e) => {
    console.error('❌ Restore failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
