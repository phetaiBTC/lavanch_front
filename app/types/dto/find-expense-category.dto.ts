import z from "zod";
import { PaginateDto } from "./paginate.dto";

// Align with backend PaginationDto which uses `status` ActiveStatus: 'active' | 'inactive' | 'all'
export const FindExpenseCategoryDto = PaginateDto.extend({
  status: z.enum(["active", "inactive", "all"]).optional(),
});

export type IFindExpenseCategoryDto = z.infer<typeof FindExpenseCategoryDto>;
