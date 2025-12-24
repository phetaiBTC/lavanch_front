import { z } from "zod";
import { BaseEntity } from "~/shared/entities/base.entity";

export const ShiftsEntity = BaseEntity.extend({
  start_time: z.string(),
  end_time: z.string(),
});

export type IShiftsEntity = z.infer<typeof ShiftsEntity>;
