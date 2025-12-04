import { z } from "zod";
import { BaseEntity } from "~/shared/entities/base.entity";

export const BranchExpenseEntity = BaseEntity.extend({
  expense_no: z.string(),
  branch_id: z.number(),
  expense_category_id: z.number(),
  amount: z.number(),
  currency_id: z.number(),
  expense_date: z.string(),
  description: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  receipt_image: z.string().nullable().optional(),
  created_by: z.number(),
  approved_by: z.number().nullable().optional(),
  status: z.string(),
  wallet_transaction_id: z.number().nullable().optional(),
  // Relations
  branch: z.object({ id: z.number(), name: z.string() }).optional(),
  expense_category: z.object({ id: z.number(), name: z.string() }).optional(),
});

export type IBranchExpenseEntity = z.infer<typeof BranchExpenseEntity>;

export interface IBranchExpenseSummary {
  total_amount_all: number;
  count_pending: number;
  count_approved: number;
  count_rejected: number;
}
