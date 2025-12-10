import z from "zod";
import { PaginateDto } from "./paginate.dto";

// Align with backend PaginationDto which uses `status` ActiveStatus: 'active' | 'inactive' | 'all'
export const FindExpenseCategoryDto = PaginateDto.extend({
  status: z.enum(["active", "inactive", "all"]).optional(),
  // deleted: true => show only soft-deleted (deletedAt IS NOT NULL)
  // deleted: false => show only active (deletedAt IS NULL)
  deleted: z.boolean().optional(),
});

export type IFindExpenseCategoryDto = z.infer<typeof FindExpenseCategoryDto>;
