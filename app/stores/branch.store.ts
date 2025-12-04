import { defineStore } from "pinia";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IBranchEntity } from "~/types/entities/branch.entity";

export const useBranchStore = defineStore("branch", () => {
  const loading = ref(false);
  const branchList = ref<PaginatedResponse<IBranchEntity>>({
    data: [],
    pagination: {
      total: 0,
      count: 0,
      limit: 0,
      totalPages: 0,
      currentPage: 0,
    },
  });

  const branch = ref<IBranchEntity>({
    id: 0,
    name: "",
    address: null,
    village_id: null,
    phone: null,
    facebook: null,
    tiktok: null,
    shifts_id: null,
    is_active: true,
    wallet_balance: 0,
    createdAt: "",
    updatedAt: "",
    deletedAt: null,
  });

  const setBranchList = (value: PaginatedResponse<IBranchEntity>) => {
    branchList.value = value;
  };

  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  const setBranch = (value: IBranchEntity) => {
    branch.value = value;
  };

  return {
    loading,
    branchList,
    branch,
    setLoading,
    setBranchList,
    setBranch,
  };
});
