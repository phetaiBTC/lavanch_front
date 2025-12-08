import type { IPaginateDto } from "~/types/dto/paginate.dto";
import type { sortType, Status } from "~/types/enum/paginate.enum";

type QueryUtilArgs = {
  query: IPaginateDto;
  load: () => Promise<void>;
  updateUrl: () => void;
};

export const onQueryUtil = (data: QueryUtilArgs) => {
  const reload = async (resetPage: boolean = true): Promise<void> => {
    if (resetPage) data.query.page = 1;
    data.updateUrl();
    await data.load();
  };

  const search = (value: string) => {
    data.query.search = value;
    return reload();
  };

  const sort = (value: sortType) => {
    data.query.sort = value;
    return reload();
  };

  const checked = (value: Status) => {
    data.query.is_active = value;
    return reload();
  };

  const page = (page: number, limit: number) => {
    data.query.page = page;
    data.query.limit = limit;
    return reload(false);
  };

  return {
    search,
    sort,
    checked,
    page,
  };
};
