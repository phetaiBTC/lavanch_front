import { useToast } from "primevue/usetoast";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import type { IRole } from "~/types/entities/role.entity";
import { GetType } from "~/types/enum/paginate.enum";

export const useRole = () => {
  const store = useRoleStore();
  //   const toast = useToast();
  const { run } = useFormHandler();

  const findAll = async (query: IPaginateDto): Promise<void> => {
    await run(async () => {
      const res = await useApi().get<PaginatedResponse<IRole>>("/role", {
        query,
      });
      store.setRoleList(res);
      return res;
    }, store.setLoading);
  };
  const getOption = async (): Promise<void> => {
    await run(async () => {
      const res = await useApi().get<PaginatedResponse<IRole>>("/role", {
        query: { type: GetType.ALL },
      });
      const mapperOptions = res.data.map((item) => {
        return {
          label: item.code,
          value: item.id,
        };
      });
      store.setRoleOptions(mapperOptions);
      return res;
    }, store.setLoading);
  };

  return { findAll, getOption };
};
