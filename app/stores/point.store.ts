import { defineStore } from "pinia";
import type { IOptionEntity } from "~/shared/entities/option.entity";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IPointEntity } from "~/types/entities/point.entity";
 // import type ของ PointEntity

export const usePointStore = defineStore("point", () => {
  const loading = ref(false);

  const pointList = ref<PaginatedResponse<IPointEntity>>({
    data: [],
    pagination: {
      total: 0,
      count: 0,
      limit: 0,
      totalPages: 0,
      currentPage: 0,
    },
  });

  const pointOptions = ref<IOptionEntity[]>([]);

  const point = ref<IPointEntity>({
    id: 0,
    name: "",
    points_multiplier: 0,
    name_code: false,
    createdAt: "",
    updatedAt: "",
    deletedAt: "",
  });

  const setPointOptions = (value: IOptionEntity[]) => {
    pointOptions.value = value;
  };

  const setPointList = (value: PaginatedResponse<IPointEntity>) => {
    pointList.value = value;
  };

  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  const setPoint = (value: IPointEntity) => {
    point.value = value;
  };

  return {
    loading,
    pointList,
    point,
    pointOptions,
    setLoading,
    setPointList,
    setPoint,
    setPointOptions,
  };
});
