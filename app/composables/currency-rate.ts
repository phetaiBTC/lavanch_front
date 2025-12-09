import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import type { ICurrencyRateEntity } from "~/types/entities/currency-rate.entity";
export const useCurrencyRate = () => {
  const store = useCurrencyRateStore();
  const { run } = useFormHandler();

  
    const findAll = async (query: IPaginateDto): Promise<void> => {
      await run(async () => {
        const res = await useApi().get<PaginatedResponse<ICurrencyRateEntity>>("/currencyrates", {
          query,
        });
        store.setCurrencyRateList(res);
        return res;
      }, store.setLoading);
    };

  return { findAll };
};
