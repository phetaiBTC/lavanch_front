import { defineStore } from "pinia";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IWalletTransactionEntity } from "~/types/entities/wallet-transaction.entity";

export const useWalletTransactionStore = defineStore("walletTransaction", () => {
  const loading = ref(false);
  const walletTransactionList = ref<PaginatedResponse<IWalletTransactionEntity>>({
    data: [],
    pagination: {
      total: 0,
      count: 0,
      limit: 0,
      totalPages: 0,
      currentPage: 0,
    },
  });

  const walletTransaction = ref<IWalletTransactionEntity>({
    id: 0,
    branch_id: 0,
    transaction_type: "",
    amount: 0,
    balance_before: 0,
    balance_after: 0,
    reference_type: null,
    reference_id: null,
    reference_no: null,
    related_branch_id: null,
    related_transaction_id: null,
    description: null,
    notes: null,
    created_by: 0,
    approved_by: null,
    status: "COMPLETED",
    transaction_date: "",
    createdAt: "",
    updatedAt: "",
    deletedAt: null,
  });

  const setWalletTransactionList = (value: PaginatedResponse<IWalletTransactionEntity>) => {
    walletTransactionList.value = value;
  };

  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  const setWalletTransaction = (value: IWalletTransactionEntity) => {
    walletTransaction.value = value;
  };

  return {
    loading,
    walletTransactionList,
    walletTransaction,
    setLoading,
    setWalletTransactionList,
    setWalletTransaction,
  };
});
