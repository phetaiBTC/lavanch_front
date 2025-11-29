import { defineStore } from "pinia";
import type { IProductEntity } from "~/types/entities/product.entity";
import type { IOptionEntity } from "~/shared/entities/option.entity";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";

export const useProductStore = defineStore("product", () => {
  const loading = ref(false);

  const productList = ref<PaginatedResponse<IProductEntity>>({
    data: [],
    pagination: {
      total: 0,
      count: 0,
      limit: 0,
      totalPages: 0,
      currentPage: 0,
    },
  });

  const productOptions = ref<IOptionEntity[]>([]);

  const product = ref<IProductEntity>({
    id: 0,
    name: "",
    brand: "",
    description: "",
    barcode: "",
    is_active: false,
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
    createdAt: "",
    updatedAt: "",
    deletedAt: "",
  });

  const setProductOptions = (value: IOptionEntity[]) => {
    productOptions.value = value;
  };

  const setProductList = (value: PaginatedResponse<IProductEntity>) => {
    productList.value = value;
  };

  const setProduct = (value: IProductEntity) => {
    product.value = value;
  };

  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  return {
    loading,
    productList,
    product,
    productOptions,
    setLoading,
    setProductList,
    setProduct,
    setProductOptions,
  };
});
