import z from "zod";
import { Status, sortType, GetType, ActiveStatus } from "../enum/paginate.enum";
export const PaginateDto = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  is_active: z.nativeEnum(Status).optional(),
  status: z.nativeEnum(ActiveStatus).optional(),
  sort: z.nativeEnum(sortType).optional(),
  type: z.nativeEnum(GetType).optional(),
});

export type IPaginateDto = z.infer<typeof PaginateDto>;
