import { defineStore } from "pinia";
import type { IOptionEntity } from "~/shared/entities/option.entity";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { ISupplierEntity } from "~/types/entities/supplier.entity";
import { valueEntity } from "~/value-object";

export const useSupplierStore = defineStore("supplier", () => {
  const loading = ref(false);
  const supplierList = ref<PaginatedResponse<ISupplierEntity>>({
    data: [],
    pagination: {
      total: 0,
      count: 0,
      limit: 0,
      totalPages: 0,
      currentPage: 0,
    },
  });
  const supplierOptions = ref<IOptionEntity[]>([]);
  const supplier = ref<ISupplierEntity>({
    name: "",
    email: "",
    phone: "",
    contact_person: "",
    address: "",
    is_active: true,
    ...valueEntity,
  });

  const setSupplierOptions = (value: IOptionEntity[]) => {
    supplierOptions.value = value;
  };
  const setSupplierList = (value: PaginatedResponse<ISupplierEntity>) => {
    supplierList.value = value;
  };
  const setLoading = (value: boolean) => {
    loading.value = value;
  };
  const setSupplier = (value: ISupplierEntity) => {
    supplier.value = value;
  };
  return {
    loading,
    supplierList,
    supplier,
    supplierOptions,
    setLoading,
    setSupplier,
    setSupplierList,
    setSupplierOptions,
  };
});
