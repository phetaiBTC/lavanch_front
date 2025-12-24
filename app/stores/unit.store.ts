import { defineStore } from "pinia";
import type { IOptionEntity } from "~/shared/entities/option.entity";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IUnitEntity } from "~/types/entities/unit.entity";

export const useUnitStore = defineStore("unit", () => {
  const loading = ref(false);

  const unitList = ref<PaginatedResponse<IUnitEntity>>({
    data: [],
    pagination: {
      total: 0,
      count: 0,
      limit: 0,
      totalPages: 0,
      currentPage: 0,
    },
  });

  const unitOptions = ref<IOptionEntity[]>([]);

  const unit = ref<IUnitEntity>({
    id: 0,
    name: "",
    abbreviation: "",
    is_active: false,
    createdAt: "",
    updatedAt: "",
    deletedAt: "",
  });

  const setUnitOptions = (value: IOptionEntity[]) => {
    unitOptions.value = value;
  };

  const setUnitList = (value: PaginatedResponse<IUnitEntity>) => {
    unitList.value = value;
  };

  const setUnit = (value: IUnitEntity) => {
    unit.value = value;
  };

  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  return {
    loading,
    unitList,
    unit,
    unitOptions,
    setLoading,
    setUnitList,
    setUnit,
    setUnitOptions,
  };
});
