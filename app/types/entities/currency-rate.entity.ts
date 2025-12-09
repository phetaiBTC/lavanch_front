import z from "zod";
import { BaseEntity } from "~/shared/entities/base.entity";
import { CurrencyEntity } from "./currency.entity";

export const CurrencyRateEntity = BaseEntity.extend({
  from_currency: CurrencyEntity,
  to_currency: CurrencyEntity,
  rate: z.number(),
  rate_date: z.string(),
});

export type ICurrencyRateEntity = z.infer<typeof CurrencyRateEntity>;
