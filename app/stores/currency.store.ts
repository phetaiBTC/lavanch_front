import { defineStore } from "pinia";
import type { IOptionEntity } from "~/shared/entities/option.entity";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { ICurrencyEntity } from "~/types/entities/currency.entity";
// import type ของ PointEntity

export const useCurrencyStore = defineStore("currency", () => {
  const loading = ref(false);

  const currencyList = ref<PaginatedResponse<ICurrencyEntity>>({
    data: [],
    pagination: {
      total: 0,
      count: 0,
      limit: 0,
      totalPages: 0,
      currentPage: 0,
    },
  });

  const currencyOptions = ref<IOptionEntity[]>([]);

  const currency = ref<ICurrencyEntity>({
    id: 0,
    name: "",
    code: "",
    symbol: "",
    is_active: false,
    createdAt: "",
    updatedAt: "",
    deletedAt: "",
  });

  const setCurrencyOptions = (value: IOptionEntity[]) => {
    currencyOptions.value = value;
  };

  const setCurrencyList = (value: PaginatedResponse<ICurrencyEntity>) => {
    currencyList.value = value;
  };

  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  const setCurrency = (value: ICurrencyEntity) => {
    currency.value = value;
  };

  return {
    loading,
    currencyList,
    currency,
    currencyOptions,
    setLoading,
    setCurrencyList,
    setCurrency,
    setCurrencyOptions,
  };
});
