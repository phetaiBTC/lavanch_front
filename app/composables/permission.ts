import { useToast } from "primevue/usetoast";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import type { IPermissionEntity } from "~/types/entities/permission.entity";
import { GetType } from "~/types/enum/paginate.enum";

export const usePermission = () => {
  const store = usePermissionStore();
  //   const toast = useToast();
  const { run } = useFormHandler();

  const findAll = async (query: IPaginateDto): Promise<void> => {
    await run(async () => {
      const res = await useApi().get<PaginatedResponse<IPermissionEntity>>(
        "/permission",
        { query }
      );
      store.setPermissionList(res);
      return res;
    }, store.setLoading);
  };
  const getOption = async (): Promise<void> => {
    await run(async () => {
      const res = await useApi().get<PaginatedResponse<IPermissionEntity>>(
        "/permission",
        { query: { type: GetType.ALL } }
      );
      const mapperOptions = res.data.map((item) => {
        return {
          label: item.code,
          value: item.id,
        };
      });
      store.setPermissionOptions(mapperOptions);
      return res;
    }, store.setLoading);
  };

  return { findAll, getOption };
};
