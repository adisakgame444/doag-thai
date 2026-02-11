// import db from '@/lib/db'
// import { AddressInput, AddressDTO } from '@/types/address'

// function mapAddress(address: {
//   id: string
//   label: string | null
//   recipient: string
//   phone: string
//   line1: string
//   line2: string | null
//   province: string
//   district: string
//   subdistrict: string
//   postalCode: string
//   isDefault: boolean
//   createdAt: Date
//   updatedAt: Date
// }): AddressDTO {
//   return { ...address }
// }

// export async function listAddresses(userId: string): Promise<AddressDTO[]> {
//   const addresses = await db.address.findMany({
//     where: { userId },
//     orderBy: [
//       { isDefault: 'desc' },
//       { createdAt: 'desc' },
//     ],
//   })

//   return addresses.map(mapAddress)
// }

// export async function getAddress(userId: string, addressId: string) {
//   const address = await db.address.findFirst({
//     where: {
//       id: addressId,
//       userId,
//     },
//   })

//   return address ? mapAddress(address) : null
// }

// export async function createAddress(
//   userId: string,
//   input: AddressInput
// ): Promise<AddressDTO> {
//   return db.$transaction(async (tx) => {
//     if (input.isDefault) {
//       await tx.address.updateMany({
//         where: { userId },
//         data: { isDefault: false },
//       })
//     }

//     const address = await tx.address.create({
//       data: {
//         userId,
//         label: input.label?.trim() || null,
//         recipient: input.recipient.trim(),
//         phone: input.phone.trim(),
//         line1: input.line1.trim(),
//         line2: input.line2?.trim() || null,
//         province: input.province.trim(),
//         district: input.district.trim(),
//         subdistrict: input.subdistrict.trim(),
//         postalCode: input.postalCode.trim(),
//         isDefault: Boolean(input.isDefault),
//       },
//     })

//     return mapAddress(address)
//   })
// }

// export async function updateAddress(
//   userId: string,
//   addressId: string,
//   input: AddressInput
// ): Promise<AddressDTO | null> {
//   return db.$transaction(async (tx) => {
//     const existing = await tx.address.findFirst({
//       where: { id: addressId, userId },
//     })

//     if (!existing) {
//       return null
//     }

//     if (input.isDefault) {
//       await tx.address.updateMany({
//         where: { userId },
//         data: { isDefault: false },
//       })
//     }

//     const address = await tx.address.update({
//       where: { id: existing.id },
//       data: {
//         label: input.label?.trim() || null,
//         recipient: input.recipient.trim(),
//         phone: input.phone.trim(),
//         line1: input.line1.trim(),
//         line2: input.line2?.trim() || null,
//         province: input.province.trim(),
//         district: input.district.trim(),
//         subdistrict: input.subdistrict.trim(),
//         postalCode: input.postalCode.trim(),
//         isDefault: Boolean(input.isDefault),
//       },
//     })

//     return mapAddress(address)
//   })
// }

// export async function deleteAddress(userId: string, addressId: string): Promise<boolean> {
//   return db.$transaction(async (tx) => {
//     const address = await tx.address.findFirst({
//       where: { id: addressId, userId },
//     })

//     if (!address) {
//       return false
//     }

//     await tx.address.delete({ where: { id: address.id } })

//     if (address.isDefault) {
//       const fallback = await tx.address.findFirst({
//         where: { userId },
//         orderBy: { createdAt: 'asc' },
//       })

//       if (fallback) {
//         await tx.address.update({
//           where: { id: fallback.id },
//           data: { isDefault: true },
//         })
//       }
//     }

//     return true
//   })
// }

// export async function setDefaultAddress(userId: string, addressId: string): Promise<boolean> {
//   return db.$transaction(async (tx) => {
//     const address = await tx.address.findFirst({ where: { id: addressId, userId } })
//     if (!address) {
//       return false
//     }

//     await tx.address.updateMany({ where: { userId }, data: { isDefault: false } })
//     await tx.address.update({ where: { id: address.id }, data: { isDefault: true } })

//     return true
//   })
// }

// export async function ensureDefaultAddress(userId: string) {
//   const hasDefault = await db.address.findFirst({ where: { userId, isDefault: true } })

//   if (!hasDefault) {
//     const first = await db.address.findFirst({
//       where: { userId },
//       orderBy: { createdAt: 'asc' },
//     })

//     if (first) {
//       await db.address.update({
//         where: { id: first.id },
//         data: { isDefault: true },
//       })
//     }
//   }
// }

import db from "@/lib/db";
import sanitize from "sanitize-html";
import { z } from "zod";
import { AddressDTO, AddressInput } from "@/types/address";

// --- Centralized Logger (Better Formatting) ---
const log = (message: string, meta: Record<string, any> = {}) =>
  console.log("[AddressService]", message, JSON.stringify(meta));

// ---------- ZOD VALIDATION (Improved) ----------
export const AddressInputSchema = z.object({
  label: z.string().max(50).trim().nullable().optional(),
  recipient: z.string().min(1).max(100).trim(),
  phone: z
    .string()
    .min(8)
    .max(15)
    .regex(/^[0-9()+\- ]+$/)
    .trim(),
  line1: z.string().min(1).max(200).trim(),
  line2: z.string().max(200).trim().nullable().optional(),
  province: z.string().min(1).max(100).trim(),
  district: z.string().min(1).max(100).trim(),
  subdistrict: z.string().min(1).max(100).trim(),
  postalCode: z
    .string()
    .regex(/^[0-9]{5}$/)
    .trim(),
  isDefault: z.boolean().optional(),
});

// ---------- SANITIZER (More strict) ----------
function clean(value?: string | null) {
  if (!value) return null;
  return sanitize(value, {
    allowedTags: [],
    allowedAttributes: {},
    textFilter: (text) => text.replace(/​/g, "").trim(), // remove zero‑width chars
  });
}

// ---------- NORMALIZER ----------
function normalize(input: AddressInput) {
  return {
    label: clean(input.label),
    recipient: clean(input.recipient)!,
    phone: clean(input.phone)!,
    line1: clean(input.line1)!,
    line2: clean(input.line2),
    province: clean(input.province)!,
    district: clean(input.district)!,
    subdistrict: clean(input.subdistrict)!,
    postalCode: clean(input.postalCode)!,
    isDefault: Boolean(input.isDefault),
  };
}

// ---------- DTO MAPPER (Safe) ----------
function mapAddress(a: any): AddressDTO {
  return {
    id: a.id,
    label: a.label,
    recipient: a.recipient,
    phone: a.phone,
    line1: a.line1,
    line2: a.line2,
    province: a.province,
    district: a.district,
    subdistrict: a.subdistrict,
    postalCode: a.postalCode,
    isDefault: a.isDefault,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  };
}

// ---------- LIST ----------
export async function listAddresses(userId: string): Promise<AddressDTO[]> {
  log("Listing addresses", { userId });

  const rows = await db.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  log("List complete", { count: rows.length, userId });
  return rows.map(mapAddress);
}

// ---------- GET ----------
export async function getAddress(userId: string, addressId: string) {
  log("Get address", { userId, addressId });

  const row = await db.address.findFirst({ where: { id: addressId, userId } });

  if (!row) log("Address not found", { userId, addressId });
  return row ? mapAddress(row) : null;
}

// ---------- CREATE ----------
export async function createAddress(
  userId: string,
  input: AddressInput
): Promise<AddressDTO> {
  log("Create address start", { userId });

  const parsed = AddressInputSchema.parse(input);
  const data = normalize(parsed);

  return db.$transaction(async (tx) => {
    if (data.isDefault) {
      log("Clearing existing defaults", { userId });
      await tx.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const row = await tx.address.create({ data: { ...data, userId } });
    log("Create address success", { userId, addressId: row.id });

    return mapAddress(row);
  });
}

// ---------- UPDATE ----------
export async function updateAddress(
  userId: string,
  addressId: string,
  input: AddressInput
): Promise<AddressDTO | null> {
  log("Update address start", { userId, addressId });

  const parsed = AddressInputSchema.parse(input);
  const data = normalize(parsed);

  return db.$transaction(async (tx) => {
    const existing = await tx.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) {
      log("Address not found for update", { userId, addressId });
      return null;
    }

    if (data.isDefault) {
      log("Clearing old defaults for update", { userId });
      await tx.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const row = await tx.address.update({ where: { id: existing.id }, data });

    log("Update address success", { userId, addressId });
    return mapAddress(row);
  });
}

// ---------- DELETE ----------
export async function deleteAddress(
  userId: string,
  addressId: string
): Promise<boolean> {
  log("Delete address start", { userId, addressId });

  return db.$transaction(async (tx) => {
    const target = await tx.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!target) {
      log("Delete failed: not found", { userId, addressId });
      return false;
    }

    await tx.address.delete({ where: { id: target.id } });
    log("Delete success", { userId, addressId });

    if (target.isDefault) {
      log("Deleted was default: selecting fallback", { userId });

      const fallback = await tx.address.findFirst({
        where: { userId },
        orderBy: { createdAt: "asc" },
      });

      if (fallback) {
        await tx.address.update({
          where: { id: fallback.id },
          data: { isDefault: true },
        });
        log("Fallback promoted to default", { fallback: fallback.id, userId });
      }
    }

    return true;
  });
}

// ---------- SET DEFAULT ----------
export async function setDefaultAddress(
  userId: string,
  addressId: string
): Promise<boolean> {
  log("Set default start", { userId, addressId });

  return db.$transaction(async (tx) => {
    const row = await tx.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!row) {
      log("Set default failed: not found", { userId, addressId });
      return false;
    }

    await tx.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
    await tx.address.update({
      where: { id: row.id },
      data: { isDefault: true },
    });

    log("Set default success", { userId, addressId });
    return true;
  });
}

// ---------- ENSURE DEFAULT ----------
export async function ensureDefaultAddress(userId: string) {
  log("Ensure default start", { userId });

  const hasDefault = await db.address.findFirst({
    where: { userId, isDefault: true },
  });
  if (hasDefault) {
    log("Already has default", { userId, defaultId: hasDefault.id });
    return;
  }

  const first = await db.address.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  if (!first) {
    log("Cannot ensure default: no addresses", { userId });
    return;
  }

  await db.address.update({
    where: { id: first.id },
    data: { isDefault: true },
  });
  log("Auto-set first address as default", { userId, defaultId: first.id });
}
