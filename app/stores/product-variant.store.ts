import { defineStore } from "pinia";
import type { IOptionEntity } from "~/shared/entities/option.entity";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IProductVariantEntity } from "~/types/entities/product-variants.entity";

export const useProductVariantStore = defineStore("productVariant", () => {
  const loading = ref(false);

  const productVariantList = ref<PaginatedResponse<IProductVariantEntity>>({
    data: [],
    pagination: {
      total: 0,
      count: 0,
      limit: 0,
      totalPages: 0,
      currentPage: 0,
    },
  });

  const productVariantOptions = ref<IOptionEntity[]>([]);

  const productVariant = ref<IProductVariantEntity>({
    id: 0,
    name: "",
    sku: "",
    barcode: "",
    product: {
      id: 0,
      name: "",
      brand: "",
      description: "",
      barcode: "",
      category: {
        id: 0,
        name: "",
        description: "",
        parent: null,
        children: [],
        is_active: true,
        createdAt: "",
        updatedAt: "",
        deletedAt: "",
      },
      is_active: false,
      createdAt: "",
      updatedAt: "",
      deletedAt: "",
    },
    additional_price: 0,
    is_active: true,
    createdAt: "",
    updatedAt: "",
    deletedAt: "",
  });

  const setProductVariantOptions = (value: IOptionEntity[]) => {
    productVariantOptions.value = value;
  };

  const setProductVariantList = (
    value: PaginatedResponse<IProductVariantEntity>
  ) => {
    productVariantList.value = value;
  };

  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  const setProductVariant = (value: IProductVariantEntity) => {
    productVariant.value = value;
  };

  return {
    loading,
    productVariantList,
    productVariant,
    productVariantOptions,
    setLoading,
    setProductVariantList,
    setProductVariant,
    setProductVariantOptions,
  };
});
