import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import {
  type ICreateCategoriesDto,
  type IUpdateCategoriesDto,
} from "../types/dto/categories.dto";
import type { ICategoryEntity } from "~/types/entities/category.entity";

export const useCategory = () => {
  const store = useCategoryStore();
  const { setLoading, setCategoryList } = store;
  const toast = useToast();
  const { run } = useFormHandler();

  const findAll = async (query: IPaginateDto) => {
    return await run(async () => {
      const res = await useApi().get<PaginatedResponse<ICategoryEntity>>(
        "/category",
        { query }
      );
      setCategoryList(res);
      return res;
    }, setLoading);
  };

  const create = async (data: ICreateCategoriesDto) => {
    const res = await run(async () => {
      const res = await useApi().post<ICategoryEntity>("/category", data);
      return res;
    }, setLoading);

    toast.add({
      severity: "success",
      summary: useI18n().t("success"),
      detail: useI18n().t("category_create_success"),
      life: 3000,
    });
    await findAll({ page: 1, limit: 10 });
    return res;
  };

  const update = async (id: number, data: IUpdateCategoriesDto) => {
    const res = await run(async () => {
      const res = await useApi().patch<ICategoryEntity>(
        `/category/${id}`,
        data
      );
      return res;
    }, setLoading);

    toast.add({
      severity: "success",
      summary: useI18n().t("success"),
      detail: useI18n().t("category_update_success"),
      life: 3000,
    });
    await findAll({ page: 1, limit: 10 });
    return res;
  };

  const finedOne = async (id: number) => {
    const res = await run(async () => {
      const res = await useApi().get<ICategoryEntity>(`/category/${id}`);
      return res;
    }, setLoading);

    return res;
  };

  const deleteOne = async (id: number) => {
    const res = await run(async () => {
      const res = await useApi().delete<void>(`/category/${id}`);
      return res;
    }, setLoading);

    toast.add({
      severity: "success",
      summary: useI18n().t("success"),
      detail: useI18n().t("category_delete_success"),
      life: 3000,
    });
    await findAll({ page: 1, limit: 10 });
    return res;
  };

  const deleteMany = async (ids: number[]) => {
    const res = await run(async () => {
      const res = await useApi().post<void>(`/category/delete-many`, { ids });
      return res;
    }, setLoading);
    toast.add({
      severity: "success",
      summary: useI18n().t("success"),
      detail: useI18n().t("category_delete_success"),
      life: 3000,
    });
    await findAll({ page: 1, limit: 10 });
    return res;
  };

  return { findAll, create, update, finedOne, deleteMany, deleteOne };
};
