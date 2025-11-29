import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import type { IProductUnit } from "~/types/entities/product-unit.entity";

export const useProductUnit = () => {
  const store = useProductUnitStore();
  const { setLoading, setProductUnitList } = store;
  const { run } = useFormHandler();

  const findAll = async (query: IPaginateDto) => {
    return await run(async () => {
      const res = await useApi().get<PaginatedResponse<IProductUnit>>(
        "/product_unit",
        { query }
      );
      setProductUnitList(res);
      return res;
    }, setLoading);
  };

  return { findAll };
};
