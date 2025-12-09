import z from "zod";
import { PaginateDto } from "./paginate.dto";

export enum AdjustmentTypeFilter {
  ADD = "ADD",
  DEDUCT = "DEDUCT",
}

export enum AdjustmentStatusFilter {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export const FindWalletAdjustmentDto = PaginateDto.extend({
  adjustment_type: z.nativeEnum(AdjustmentTypeFilter).optional(),
  adjustment_status: z.nativeEnum(AdjustmentStatusFilter).optional(),
});

export type IFindWalletAdjustmentDto = z.infer<typeof FindWalletAdjustmentDto>;
