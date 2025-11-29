import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import type { IProductVariantEntity } from "~/types/entities/product-variants.entity";

export const useProductVariant = () => {
  const store = useProductVariantStore();
  const { setLoading, setProductVariantList } = store;
  const { run } = useFormHandler();

  const findAll = async (query: IPaginateDto) => {
    return await run(async () => {
      const res = await useApi().get<PaginatedResponse<IProductVariantEntity>>(
        "/product_variant",
        { query }
      );
      setProductVariantList(res);
      return res;
    }, setLoading);
  };

  return { findAll };
};
