import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import type { IBranchEntity } from "~/types/entities/branch.entity";
import { useBranchStore } from "~/stores/branch.store";
export const useBranch = () => {
  const store = useBranchStore();
  const { setLoading, setBranchList } = store;
  const { run } = useFormHandler();

  const findAll = async (query: IPaginateDto) => {
    return await run(async () => {
      console.log('Branch findAll query:', query);
      const res = await useApi().get<PaginatedResponse<IBranchEntity>>(
        "/branches",
        { query }
      );
      console.log('Branch findAll response:', res);
      setBranchList(res);
      return res;
    }, setLoading);
  };

  const findOne = async (id: number) => {
    return await run(async () => {
      const res = await useApi().get<IBranchEntity>(`/branches/${id}`);
      return res;
    }, setLoading);
  };

  const create = async (data: Partial<IBranchEntity>) => {
    return await run(async () => {
      const res = await useApi().post<IBranchEntity>("/branches", data);
      return res;
    }, setLoading);
  };

  const update = async (id: number, data: Partial<IBranchEntity>) => {
    return await run(async () => {
      const res = await useApi().patch<IBranchEntity>(`/branches/${id}`, data);
      return res;
    }, setLoading);
  };

  const softDelete = async (id: number) => {
    return await run(async () => {
      const res = await useApi().delete<IBranchEntity>(`/branches/soft/${id}`);
      return res;
    }, setLoading);
  };

  const restore = async (id: number) => {
    return await run(async () => {
      const res = await useApi().patch<IBranchEntity>(`/branches/restore/${id}`, {});
      return res;
    }, setLoading);
  };

  return { findAll, findOne, create, update, softDelete, restore };
};
