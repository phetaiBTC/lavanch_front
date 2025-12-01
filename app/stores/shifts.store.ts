import { defineStore } from "pinia";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IShiftsEntity } from "~/types/entities/shifts.entity";

export const useShiftsStore = defineStore("shifts", () => {
  const loading = ref(false);
  const shiftsList = ref<PaginatedResponse<IShiftsEntity>>({
    data: [],
    pagination: {
      total: 0,
      count: 0,
      limit: 0,
      totalPages: 0,
      currentPage: 0,
    },
  });

  const shifts = ref<IShiftsEntity>({
    id: 0,
    start_time: "",
    end_time: "",
    createdAt: "",
    updatedAt: "",
    deletedAt: null,
  });

  const setShiftsList = (value: PaginatedResponse<IShiftsEntity>) => {
    shiftsList.value = value;
  };

  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  const setShifts = (value: IShiftsEntity) => {
    shifts.value = value;
  };

  return {
    loading,
    shiftsList,
    shifts,
    setLoading,
    setShiftsList,
    setShifts,
  };
});
