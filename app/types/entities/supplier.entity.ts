import { z } from "zod";
import { BaseEntity } from "~/shared/entities/base.entity";
import { VillageEntity } from "./address.entity";

export const SupplierEntity = BaseEntity.extend({
  email: z.string(),
  phone: z.string(),
  contact_person: z.string(),
  address: z.string(),
  is_active: z.boolean(),
  name: z.string(),
  village: VillageEntity.optional(),
});
export type ISupplierEntity = z.infer<typeof SupplierEntity>;
