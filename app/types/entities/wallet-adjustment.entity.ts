import { z } from "zod";
import { BaseEntity } from "~/shared/entities/base.entity";

export const WalletAdjustmentEntity = BaseEntity.extend({
  adjustment_no: z.string(),
  branch_id: z.number(),
  adjustment_type: z.string(),
  amount: z.number(),
  reason: z.string(),
  description: z.string().nullable().optional(),
  created_by: z.number(),
  approved_by: z.number().nullable().optional(),
  status: z.string(),
  wallet_transaction_id: z.number().nullable().optional(),
  adjustment_date: z.string(),
});

export type IWalletAdjustmentEntity = z.infer<typeof WalletAdjustmentEntity>;
