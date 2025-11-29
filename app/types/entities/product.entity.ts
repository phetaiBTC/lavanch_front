import { z } from "zod";
import { BaseEntity } from "~/shared/entities/base.entity";
import { CategoryEntity } from "./category.entity";

export const ProductEntity = BaseEntity.extend({
  name: z.string(),
  brand: z.string(),
  category: CategoryEntity,
  description: z.string(),
  barcode: z.string(),
  is_active: z.boolean(),
});

export type IProductEntity = z.infer<typeof ProductEntity>;
