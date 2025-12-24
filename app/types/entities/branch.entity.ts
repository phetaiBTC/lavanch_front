import { z } from "zod";
import { BaseEntity } from "~/shared/entities/base.entity";

export const BranchEntity = BaseEntity.extend({
  name: z.string(),
  address: z.string().nullable().optional(),
  village_id: z.number().nullable().optional(),
  // Backend supplies nested village object with district & province
  village: z
    .object({
      id: z.number(),
      name: z.string().optional(),
      name_en: z.string().optional(),
      district: z
        .object({
          id: z.number(),
          name: z.string().optional(),
          name_en: z.string().optional(),
          province: z
            .object({
              id: z.number(),
              name: z.string().optional(),
              name_en: z.string().optional(),
            })
            .optional(),
        })
        .optional(),
    })
    .optional(),
  full_address: z
    .object({
      village_name: z.string().nullable(),
      district_name: z.string().nullable(),
      province_name: z.string().nullable(),
    })
    .optional(),
  phone: z.string().nullable().optional(),
  facebook: z.string().nullable().optional(),
  tiktok: z.string().nullable().optional(),
  shifts_id: z.number().nullable().optional(),
  is_active: z.boolean(),
  wallet_balance: z.number(),
}).passthrough();

export type IBranchEntity = z.infer<typeof BranchEntity>;
