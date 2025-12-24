import { defineStore } from "pinia";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IWalletAdjustmentEntity } from "~/types/entities/wallet-adjustment.entity";

export const useWalletAdjustmentStore = defineStore("walletAdjustment", () => {
  const loading = ref(false);
  const walletAdjustmentList = ref<PaginatedResponse<IWalletAdjustmentEntity>>({
    data: [],
    pagination: {
      total: 0,
      count: 0,
      limit: 0,
      totalPages: 0,
      currentPage: 0,
    },
  });

  const walletAdjustment = ref<IWalletAdjustmentEntity>({
    id: 0,
    adjustment_no: "",
    branch_id: 0,
    adjustment_type: "",
    amount: 0,
    reason: "",
    description: null,
    created_by: 0,
    approved_by: null,
    status: "PENDING",
    wallet_transaction_id: null,
    adjustment_date: "",
    createdAt: "",
    updatedAt: "",
    deletedAt: null,
  });

  const setWalletAdjustmentList = (value: PaginatedResponse<IWalletAdjustmentEntity>) => {
    walletAdjustmentList.value = value;
  };

  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  const setWalletAdjustment = (value: IWalletAdjustmentEntity) => {
    walletAdjustment.value = value;
  };

  return {
    loading,
    walletAdjustmentList,
    walletAdjustment,
    setLoading,
    setWalletAdjustmentList,
    setWalletAdjustment,
  };
});
