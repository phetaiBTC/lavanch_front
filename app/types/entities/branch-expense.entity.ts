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
});

export type IBranchExpenseEntity = z.infer<typeof BranchExpenseEntity>;
