import { z } from "zod";
import { BaseEntity } from "~/shared/entities/base.entity";

export const ExpenseCategoryEntity = BaseEntity.extend({
  name: z.string(),
  code: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  is_active: z.boolean(),
});

export type IExpenseCategoryEntity = z.infer<typeof ExpenseCategoryEntity>;
