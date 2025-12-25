import { z } from "zod";

export const OptionEntity = z.object({
  label: z.string(),
  value: z.number(),
});

export type IOptionEntity = z.infer<typeof OptionEntity>;
