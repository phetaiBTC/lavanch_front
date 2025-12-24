import z from "zod";
import { PaginateDto } from "./paginate.dto";

// Match backend FindExpenseCategoryDto which extends PaginationDto
// Backend uses: status (ActiveStatus: 'active' | 'inactive' | 'all') for is_active filter
// Backend uses: deleted ('true' | 'false') for deletedAt filter
export const FindExpenseCategoryDto = PaginateDto.extend({
  // Override to ensure status is properly typed for API
  status: z.enum(["active", "inactive", "all"]).optional(),
  // deleted: 'true' => show only soft-deleted (deletedAt IS NOT NULL)
  // deleted: 'false' => show only active (deletedAt IS NULL)
  // deleted: undefined => show all
  deleted: z.enum(["true", "false"]).optional(),
});

export type IFindExpenseCategoryDto = z.infer<typeof FindExpenseCategoryDto>;
