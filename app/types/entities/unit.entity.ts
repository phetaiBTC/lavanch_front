import z from "zod";
import { BaseEntity } from "~/shared/entities/base.entity";

export const UnitEntity = BaseEntity.extend({
  name: z.string().nullable().optional(),
  abbreviation: z.string().nullable().optional(),
  is_active: z.boolean(),
});
export type IUnitEntity = z.infer<typeof UnitEntity>;