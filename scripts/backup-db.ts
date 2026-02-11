import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs/promises';
import path from 'path';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// List of all models in the schema
// Note: We use the property names as they appear on the PrismaClient instance (usually camelCase)
const models = [
  'user',
  'session',
  'account',
  'verification',
  'category',
  'product',
  'productWeight',
  'productImage',
  'recommendedBanner',
  'cart',
  'address',
  'order',
  'orderItem',
  'orderPayment',
  'review',
  'spinPackage',
  'spinOrder',
  'spinOrderPayment',
  'spinQuota',
  'userSpinConfig',
  'spinHistory',
  'spinSlotImage',
];

async function backup() {
  const backupDir = path.join(process.cwd(), 'backup_database');

  console.log(`📂 Creating backup directory at ${backupDir}...`);
  try {
    await fs.mkdir(backupDir, { recursive: true });
  } catch (error) {
    // Ignore error if directory already exists
  }

  console.log('🚀 Starting database backup...');

  for (const model of models) {
    try {
      console.log(`   ⏳ Backing up ${model}...`);
      // @ts-ignore - Dynamic access to prisma models
      const data = await prisma[model].findMany();
      
      const filePath = path.join(backupDir, `${model}.json`);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      
      console.log(`   ✅ ${model}: ${data.length} records saved.`);
    } catch (error) {
      console.error(`   ❌ Failed to backup ${model}:`, error);
    }
  }

  console.log('✨ Database backup completed successfully!');
}

backup()
  .catch((e) => {
    console.error('❌ Backup failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
