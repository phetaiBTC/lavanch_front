import { z } from "zod";
import { BaseEntity } from "~/shared/entities/base.entity";

export const CategoryEntity = BaseEntity.extend({
  name: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  parent: z.number().nullable().optional(),
  children: z.array(z.any()).optional(), // or better: z.array(CategoryEntity)
  is_active: z.boolean(),
});

export type ICategoryEntity = z.infer<typeof CategoryEntity>;
