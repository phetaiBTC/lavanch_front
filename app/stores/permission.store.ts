import { defineStore } from "pinia";
import type { IOptionEntity } from "~/shared/entities/option.entity";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IPermissionEntity } from "~/types/entities/permission.entity";
import { valueEntity } from "~/value-object";

export const usePermissionStore = defineStore("Permission", () => {
  const loading = ref(false);
  const PermissionList = ref<PaginatedResponse<IPermissionEntity>>({
    data: [],
    pagination: {
      total: 0,
      count: 0,
      limit: 0,
      totalPages: 0,
      currentPage: 0,
    },
  });
  const Permission = ref<IPermissionEntity>({
    code: "",
    ...valueEntity,
  });
  const PermissionOptions = ref<IOptionEntity[]>([]);

  const setPermissionOptions = (value: IOptionEntity[]) => {
    PermissionOptions.value = value;
  };
  const setPermissionList = (value: PaginatedResponse<IPermissionEntity>) => {
    PermissionList.value = value;
  };
  const setLoading = (value: boolean) => {
    loading.value = value;
  };
  return {
    loading,
    PermissionList,
    Permission,
    PermissionOptions,
    setLoading,
    setPermissionList,
    setPermissionOptions,
  };
});
