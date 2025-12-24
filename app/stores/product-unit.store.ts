import { defineStore } from "pinia";
import type { IProductUnit } from "~/types/entities/product-unit.entity";
import type { IOptionEntity } from "~/shared/entities/option.entity";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";

export const useProductUnitStore = defineStore("productUnit", () => {
  const loading = ref(false);
  const store_product_variant = useProductVariantStore();
  const store_unit = useUnitStore();
  const productUnitList = ref<PaginatedResponse<IProductUnit>>({
    data: [],
    pagination: {
      total: 0,
      count: 0,
      limit: 0,
      totalPages: 0,
      currentPage: 0,
    },
  });

  const productUnitOptions = ref<IOptionEntity[]>([]);

  const productUnit = ref<IProductUnit>({
    id: 0,
    product_variant: { ...store_product_variant.productVariant },
    unit: { ...store_unit.unit },
    quantity_per_unit: 0,
    is_active: false,
    is_base_unit: false,
    createdAt: "",
    updatedAt: "",
    deletedAt: "",
  });

  const setProductUnitOptions = (value: IOptionEntity[]) => {
    productUnitOptions.value = value;
  };

  const setProductUnitList = (value: PaginatedResponse<IProductUnit>) => {
    productUnitList.value = value;
  };

  const setProductUnit = (value: IProductUnit) => {
    productUnit.value = value;
  };

  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  return {
    loading,
    productUnitList,
    productUnit,
    productUnitOptions,
    setLoading,
    setProductUnitList,
    setProductUnit,
    setProductUnitOptions,
  };
});
