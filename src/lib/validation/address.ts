import { z } from 'zod'

export const addressSchema = z.object({
  label: z
    .string()
    .trim()
    .max(50, 'ป้ายกำกับต้องไม่เกิน 50 ตัวอักษร')
    .optional()
    .nullable(),
  recipient: z
    .string()
    .trim()
    .min(2, 'กรุณากรอกชื่อผู้รับ')
    .max(100, 'ชื่อผู้รับต้องไม่เกิน 100 ตัวอักษร'),
  phone: z
    .string()
    .trim()
    .min(9, 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง')
    .max(15, 'เบอร์โทรศัพท์ต้องไม่เกิน 15 ตัวอักษร'),
  line1: z
    .string()
    .trim()
    .min(5, 'กรุณากรอกที่อยู่')
    .max(200, 'ที่อยู่ต้องไม่เกิน 200 ตัวอักษร'),
  line2: z
    .string()
    .trim()
    .max(200, 'ที่อยู่ต้องไม่เกิน 200 ตัวอักษร')
    .optional()
    .nullable(),
  province: z
    .string()
    .trim()
    .min(2, 'กรุณากรอกจังหวัด')
    .max(100, 'จังหวัดต้องไม่เกิน 100 ตัวอักษร'),
  district: z
    .string()
    .trim()
    .min(2, 'กรุณากรอกอำเภอ/เขต')
    .max(100, 'อำเภอ/เขตต้องไม่เกิน 100 ตัวอักษร'),
  subdistrict: z
    .string()
    .trim()
    .min(2, 'กรุณากรอกตำบล/แขวง')
    .max(100, 'ตำบล/แขวงต้องไม่เกิน 100 ตัวอักษร'),
  postalCode: z
    .string()
    .trim()
    .min(4, 'กรุณากรอกรหัสไปรษณีย์ให้ถูกต้อง')
    .max(10, 'รหัสไปรษณีย์ต้องไม่เกิน 10 ตัวอักษร'),
  isDefault: z.boolean().optional(),
})

export type AddressFormValues = z.infer<typeof addressSchema>
