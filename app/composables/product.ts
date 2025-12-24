import { useToast } from "primevue/usetoast";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import { useProductStore } from "~/stores/product.store";
import type { IProductEntity } from "~/types/entities/product.entity";

export const useProduct = () => {
  const store = useProductStore();
  const { setLoading, setProductList } = store;
  const { run } = useFormHandler();

  const findAll = async (query: IPaginateDto) => {
    return await run(async () => {
      const res = await useApi().get<PaginatedResponse<IProductEntity>>(
        "/product",
        { query }
      );
      setProductList(res);
      return res;
    }, setLoading);
  };

  return { findAll };
};
