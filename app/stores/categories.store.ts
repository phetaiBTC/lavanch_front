import { defineStore } from "pinia";
import type { ICategoryEntity } from "~/types/entities/category.entity";
import type { IOptionEntity } from "~/shared/entities/option.entity";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";

export const useCategoryStore = defineStore("category", () => {
  const loading = ref(false);

  const categoryList = ref<PaginatedResponse<ICategoryEntity>>({
    data: [],
    pagination: {
      total: 0,
      count: 0,
      limit: 0,
      totalPages: 0,
      currentPage: 0,
    },
  });

  const categoryOptions = ref<IOptionEntity[]>([]);

  const category = ref<ICategoryEntity>({
    id: 0,
    name: "",
    description: "",
    parent: null,
    children: [],
    is_active: false,
    createdAt: "",
    updatedAt: "",
    deletedAt: "",
  });

  const setCategoryOptions = (value: IOptionEntity[]) => {
    categoryOptions.value = value;
  };

  const setCategoryList = (value: PaginatedResponse<ICategoryEntity>) => {
    categoryList.value = value;
  };

  const setCategory = (value: ICategoryEntity) => {
    category.value = value;
  };

  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  return {
    loading,
    categoryList,
    category,
    categoryOptions,
    setLoading,
    setCategoryList,
    setCategory,
    setCategoryOptions,
  };
});
