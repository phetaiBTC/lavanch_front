import { BaseEntity } from "~/shared/entities/base.entity";
import { Base } from "../../../.nuxt/components";
import z from "zod";
import { ProductVariantEntity } from "./product-variants.entity";
import { UnitEntity } from "./unit.entity";

export const ProductUnitEntity = BaseEntity.extend({
  product_variant: ProductVariantEntity,
  unit: UnitEntity,
  quantity_per_unit: z.number(),
  is_active: z.boolean(),
  is_base_unit: z.boolean(),
});

export type IProductUnit = z.infer<typeof ProductUnitEntity>;
