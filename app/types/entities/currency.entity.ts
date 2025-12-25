import z from "zod";
import { BaseEntity } from "~/shared/entities/base.entity";

export const CurrencyEntity = BaseEntity.extend({
  code: z.string(),
  name: z.string(),
  symbol: z.string(),
  is_active: z.boolean(),
});

export type ICurrencyEntity = z.infer<typeof CurrencyEntity>;
