import z from "zod";
import { PaginateDto } from "./paginate.dto";

export enum TransactionTypeFilter {
  DEPOSIT = "DEPOSIT",
  WITHDRAW = "WITHDRAW",
  TRANSFER_IN = "TRANSFER_IN",
  TRANSFER_OUT = "TRANSFER_OUT",
  ADJUSTMENT = "ADJUSTMENT",
  SALE = "SALE",
  EXPENSE = "EXPENSE",
  REFUND = "REFUND",
}

export enum TransactionStatusFilter {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export const FindWalletTransactionDto = PaginateDto.extend({
  branch_id: z.number().optional(),
  transaction_type: z.nativeEnum(TransactionTypeFilter).optional(),
  transaction_status: z.nativeEnum(TransactionStatusFilter).optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
});

export type IFindWalletTransactionDto = z.infer<typeof FindWalletTransactionDto>;
