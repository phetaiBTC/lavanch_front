import z from "zod";
import { BaseEntity } from "~/shared/entities/base.entity";


export const PointEntity = BaseEntity.extend({
  name: z.string(),
  points_multiplier: z.number(),
  name_code: z.boolean(),
});

export type IPointEntity = z.infer<typeof PointEntity>;