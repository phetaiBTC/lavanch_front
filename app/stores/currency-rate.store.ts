import { defineStore } from "pinia";
import type { IOptionEntity } from "~/shared/entities/option.entity";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { ICurrencyRateEntity } from "~/types/entities/currency-rate.entity";
// import type ของ PointEntity

export const useCurrencyRateStore = defineStore("currencyRate", () => {
  const loading = ref(false);

  const currencyRateList = ref<PaginatedResponse<ICurrencyRateEntity>>({
    data: [],
    pagination: {
      total: 0,
      count: 0,
      limit: 0,
      totalPages: 0,
      currentPage: 0,
    },
  });

  const currencyRateOptions = ref<IOptionEntity[]>([]);

  const currencyRate = ref<ICurrencyRateEntity>({
    id: 0,
    from_currency:{
      id: 0,
      name: "",
      code: "",
      symbol: "",
      is_active: false,
      createdAt: "",
      updatedAt: "",
      deletedAt: "",
    },
    to_currency: {
      id: 0,
      name: "",
      code: "",
      symbol: "",
      is_active: false,
      createdAt: "",
      updatedAt: "",
      deletedAt: "",
    },
    rate: 0,
    rate_date: "",
    createdAt: "",
    updatedAt: "",
    deletedAt: "",
  });

  const setCurrencyRateOptions = (value: IOptionEntity[]) => {
    currencyRateOptions.value = value;
  };

  const setCurrencyRateList = (value: PaginatedResponse<ICurrencyRateEntity>) => {
    currencyRateList.value = value;
  };

  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  const setCurrencyRate = (value: ICurrencyRateEntity) => {
    currencyRate.value = value;
  };

  return {
    loading,
    currencyRateList,
    currencyRate,
    currencyRateOptions,
    setLoading,
    setCurrencyRateList,
    setCurrencyRate,
    setCurrencyRateOptions,
  };
});
