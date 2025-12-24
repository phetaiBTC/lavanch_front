import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import type { IPointEntity } from "~/types/entities/point.entity";

export const usePoint = () => {
  const store = usePointStore();
  const { setLoading, setPointList } = store;
  const { run } = useFormHandler();

  const findAll = async (query: IPaginateDto) => {
    return await run(async () => {
      const res = await useApi().get<PaginatedResponse<IPointEntity>>(
        "/point",
        { query }
      );
      setPointList(res);
      return res;
    }, setLoading);
  };

  return { findAll };
};
