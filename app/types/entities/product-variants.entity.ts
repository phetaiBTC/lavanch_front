import z from "zod";
import { BaseEntity } from "~/shared/entities/base.entity";
import { ProductEntity } from "./product.entity";

export const ProductVariantEntity = BaseEntity.extend({
  additional_price: z.number().optional(),
  name : z.string(),
  sku: z.string(),
  barcode: z.string(),
  product: ProductEntity,
  is_active: z.boolean(),
});

export type IProductVariantEntity = z.infer<typeof ProductVariantEntity>;