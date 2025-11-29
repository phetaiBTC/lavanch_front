import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import type { IProductEntity } from "~/types/entities/product.entity";

export const useCategory = () => {
  const store = useCategoryStore();
  const { setLoading, setCategoryList } = store;
  const { run } = useFormHandler();

  const findAll = async (query: IPaginateDto) => {
    return await run(async () => {
      const res = await useApi().get<PaginatedResponse<IProductEntity>>(
        "/category",
        { query }
      );
      setCategoryList(res);
      return res;
    }, setLoading);
  };

  return { findAll };
};
