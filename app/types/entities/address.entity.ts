import { z } from "zod";
export const ProvinceEntity = z.object({
  id: z.number(),
  name: z.string(),
  name_en: z.string(),
});

export const DistrictEntity = z.object({
  id: z.number(),
  name: z.string(),
  name_en: z.string(),
  province: ProvinceEntity,
});

export const VillageEntity = z.object({
  id: z.number(),
  name: z.string(),
  name_en: z.string(),
  district: DistrictEntity,
});

export type IProvinceEntity = z.infer<typeof ProvinceEntity>;
export type IDistrictEntity = z.infer<typeof DistrictEntity>;
export type IVillageEntity = z.infer<typeof VillageEntity>;
