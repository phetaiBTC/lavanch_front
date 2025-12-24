import { z } from "zod";
import { BaseEntity } from "~/shared/entities/base.entity";

export const WalletTransactionEntity = BaseEntity.extend({
  branch_id: z.number(),
  transaction_type: z.string(),
  amount: z.number(),
  balance_before: z.number(),
  balance_after: z.number(),
  reference_type: z.string().nullable().optional(),
  reference_id: z.number().nullable().optional(),
  reference_no: z.string().nullable().optional(),
  related_branch_id: z.number().nullable().optional(),
  related_transaction_id: z.number().nullable().optional(),
  description: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  created_by: z.number(),
  approved_by: z.number().nullable().optional(),
  status: z.string(),
  transaction_date: z.string(),
});

export type IWalletTransactionEntity = z.infer<typeof WalletTransactionEntity>;
