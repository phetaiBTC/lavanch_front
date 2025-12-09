import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import type { ICurrencyEntity } from "~/types/entities/currency.entity";

export const useCurrency = () => {
  const store = useCurrencyStore();
  const { run } = useFormHandler();

  
    const findAll = async (query: IPaginateDto): Promise<void> => {
      await run(async () => {
        const res = await useApi().get<PaginatedResponse<ICurrencyEntity>>("/currencies", {
          query,
        });
        store.setCurrencyList(res);
        return res;
      }, store.setLoading);
    };

  return { findAll };
};
