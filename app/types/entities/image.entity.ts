import { z } from "zod";

export const ImageEntity = z.object({
  id: z.number(),
  url: z.string(),
  key: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});

export type IImageEntity = z.infer<typeof ImageEntity>;
