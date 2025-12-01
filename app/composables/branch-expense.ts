import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import type { IBranchExpenseEntity } from "~/types/entities/branch-expense.entity";
import { useBranchExpenseStore } from "~/stores/branch-expense.store";
export const useBranchExpense = () => {
  const store = useBranchExpenseStore();
  const { setLoading, setBranchExpenseList } = store;
  const { run } = useFormHandler();

  const findAll = async (query: IPaginateDto) => {
    return await run(async () => {
      const res = await useApi().get<PaginatedResponse<IBranchExpenseEntity>>(
        "/branch-expenses",
        { query }
      );
      setBranchExpenseList(res);
      return res;
    }, setLoading);
  };

  const findOne = async (id: number) => {
    return await run(async () => {
      const res = await useApi().get<IBranchExpenseEntity>(`/branch-expenses/${id}`);
      return res;
    }, setLoading);
  };

  const create = async (data: Partial<IBranchExpenseEntity>) => {
    return await run(async () => {
      const res = await useApi().post<IBranchExpenseEntity>("/branch-expenses", data);
      return res;
    }, setLoading);
  };

  const approve = async (id: number) => {
    return await run(async () => {
      const res = await useApi().patch<IBranchExpenseEntity>(
        `/branch-expenses/${id}/approve`,
        { action: "APPROVE" }
      );
      return res;
    }, setLoading);
  };

  const reject = async (id: number) => {
    return await run(async () => {
      const res = await useApi().patch<IBranchExpenseEntity>(
        `/branch-expenses/${id}/approve`,
        { action: "REJECT" }
      );
      return res;
    }, setLoading);
  };

  return { findAll, findOne, create, approve, reject };
};
