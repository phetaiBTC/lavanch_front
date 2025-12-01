import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import type { IExpenseCategoryEntity } from "~/types/entities/expense-category.entity";
import { useExpenseCategoryStore } from "~/stores/expense-category.store";
export const useExpenseCategory = () => {
  const store = useExpenseCategoryStore();
  const { setLoading, setExpenseCategoryList } = store;
  const { run } = useFormHandler();

  const findAll = async (query: IPaginateDto) => {
    return await run(async () => {
      const res = await useApi().get<PaginatedResponse<IExpenseCategoryEntity>>(
        "/expense-categories",
        { query }
      );
      setExpenseCategoryList(res);
      return res;
    }, setLoading);
  };

  const findOne = async (id: number) => {
    return await run(async () => {
      const res = await useApi().get<IExpenseCategoryEntity>(`/expense-categories/${id}`);
      return res;
    }, setLoading);
  };

  const create = async (data: Partial<IExpenseCategoryEntity>) => {
    return await run(async () => {
      const res = await useApi().post<IExpenseCategoryEntity>("/expense-categories", data);
      return res;
    }, setLoading);
  };

  const update = async (id: number, data: Partial<IExpenseCategoryEntity>) => {
    return await run(async () => {
      const res = await useApi().patch<IExpenseCategoryEntity>(`/expense-categories/${id}`, data);
      return res;
    }, setLoading);
  };

  const softDelete = async (id: number) => {
    return await run(async () => {
      const res = await useApi().delete<IExpenseCategoryEntity>(`/expense-categories/soft/${id}`);
      return res;
    }, setLoading);
  };

  const restore = async (id: number) => {
    return await run(async () => {
      const res = await useApi().patch<IExpenseCategoryEntity>(
        `/expense-categories/restore/${id}`,
        {}
      );
      return res;
    }, setLoading);
  };

  return { findAll, findOne, create, update, softDelete, restore };
};
