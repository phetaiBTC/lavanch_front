import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import type { IBranchExpenseEntity, IBranchExpenseSummary } from "~/types/entities/branch-expense.entity";
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

  const getSummary = async (query: IPaginateDto) => {
    return await run(async () => {
      const res = await useApi().get<IBranchExpenseSummary>(
        "/branch-expenses/summary",
        { query }
      );
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
        `/branch-expenses/${id}/reject`,
        {}
      );
      return res;
    }, setLoading);
  };

  const getReceiptImages = async (id: number) => {
    return await run(async () => {
      const res = await useApi().get<{ id: number; receipt_images: string[] }>(
        `/branch-expenses/${id}/receipt-images`
      );
      return res;
    }, setLoading);
  };

  return { findAll, getSummary, findOne, create, approve, reject, getReceiptImages };
};
