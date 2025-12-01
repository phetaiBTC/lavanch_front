import { defineStore } from "pinia";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IExpenseCategoryEntity } from "~/types/entities/expense-category.entity";

export const useExpenseCategoryStore = defineStore("expenseCategory", () => {
  const loading = ref(false);
  const expenseCategoryList = ref<PaginatedResponse<IExpenseCategoryEntity>>({
    data: [],
    pagination: {
      total: 0,
      count: 0,
      limit: 0,
      totalPages: 0,
      currentPage: 0,
    },
  });

  const expenseCategory = ref<IExpenseCategoryEntity>({
    id: 0,
    name: "",
    code: null,
    description: null,
    is_active: true,
    createdAt: "",
    updatedAt: "",
    deletedAt: null,
  });

  const setExpenseCategoryList = (value: PaginatedResponse<IExpenseCategoryEntity>) => {
    expenseCategoryList.value = value;
  };

  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  const setExpenseCategory = (value: IExpenseCategoryEntity) => {
    expenseCategory.value = value;
  };

  return {
    loading,
    expenseCategoryList,
    expenseCategory,
    setLoading,
    setExpenseCategoryList,
    setExpenseCategory,
  };
});
