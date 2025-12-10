import { useToast } from "primevue/usetoast";
import type { IOptionEntity } from "~/shared/entities/option.entity";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import type { ISupplierEntity } from "~/types/entities/supplier.entity";
import { GetType } from "~/types/enum/paginate.enum";

export const useSupplier = () => {
  const store = useSupplierStore();
  //   const toast = useToast();
  const { run } = useFormHandler();

  const findAll = async (query: IPaginateDto): Promise<void> => {
    await run(async () => {
      const res = await useApi().get<PaginatedResponse<ISupplierEntity>>(
        "/suppliers",
        {
          query,
        }
      );
      store.setSupplierList(res);
      return res;
    }, store.setLoading);
  };
  const getOption = async (): Promise<void> => {
    await run(async () => {
      const res = await useApi().get<PaginatedResponse<ISupplierEntity>>(
        "/suppliers",
        {
          query: { type: GetType.ALL },
        }
      );
      const mapperOptions: IOptionEntity[] = res.data.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      store.setSupplierOptions(mapperOptions);
      return res;
    }, store.setLoading);
  };

  return { findAll, getOption };
};
