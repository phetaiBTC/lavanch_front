import { defineStore } from "pinia";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IBranchExpenseEntity } from "~/types/entities/branch-expense.entity";

export const useBranchExpenseStore = defineStore("branchExpense", () => {
  const loading = ref(false);
  const branchExpenseList = ref<PaginatedResponse<IBranchExpenseEntity>>({
    data: [],
    pagination: {
      total: 0,
      count: 0,
      limit: 0,
      totalPages: 0,
      currentPage: 0,
    },
  });

  const branchExpense = ref<IBranchExpenseEntity>({
    id: 0,
    expense_no: "",
    branch_id: 0,
    expense_category_id: 0,
    amount: 0,
    currency_id: 1,
    expense_date: "",
    description: null,
    notes: null,
    receipt_image: null,
    created_by: 0,
    approved_by: null,
    status: "PENDING",
    wallet_transaction_id: null,
    createdAt: "",
    updatedAt: "",
    deletedAt: null,
  });

  const setBranchExpenseList = (value: PaginatedResponse<IBranchExpenseEntity>) => {
    branchExpenseList.value = value;
  };

  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  const setBranchExpense = (value: IBranchExpenseEntity) => {
    branchExpense.value = value;
  };

  return {
    loading,
    branchExpenseList,
    branchExpense,
    setLoading,
    setBranchExpenseList,
    setBranchExpense,
  };
});
