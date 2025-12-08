import { defineStore } from "pinia";
import type { IOptionEntity } from "~/shared/entities/option.entity";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IRole } from "~/types/entities/role.entity";
import { valueEntity } from "~/value-object";

export const useRoleStore = defineStore("role", () => {
  const loading = ref(false);
  const roleList = ref<PaginatedResponse<IRole>>({
    data: [],
    pagination: {
      total: 0,
      count: 0,
      limit: 0,
      totalPages: 0,
      currentPage: 0,
    },
  });
  const roleOptions = ref<IOptionEntity[]>([]);
  const role = ref<IRole>({
    code: "",
    permissions: [],
    ...valueEntity,
  });

  const setRoleOptions = (value: IOptionEntity[]) => {
    roleOptions.value = value;
  };
  const setRoleList = (value: PaginatedResponse<IRole>) => {
    roleList.value = value;
  };
  const setLoading = (value: boolean) => {
    loading.value = value;
  };
  const setRole = (value: IRole) => {
    role.value = value;
  };
  return {
    loading,
    roleList,
    role,
    roleOptions,
    setLoading,
    setRoleList,
    setRole,
    setRoleOptions,
  };
});
