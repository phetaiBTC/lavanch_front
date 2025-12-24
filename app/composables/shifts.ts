import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import type { IShiftsEntity } from "~/types/entities/shifts.entity";
import { useShiftsStore } from "~/stores/shifts.store";
export const useShifts = () => {
  const store = useShiftsStore();
  const { setLoading, setShiftsList } = store;
  const { run } = useFormHandler();

  const findAll = async (query: IPaginateDto) => {
    return await run(async () => {
      const res = await useApi().get<PaginatedResponse<IShiftsEntity>>(
        "/shifts",
        { query }
      );
      setShiftsList(res);
      return res;
    }, setLoading);
  };

  const findOne = async (id: number) => {
    return await run(async () => {
      const res = await useApi().get<IShiftsEntity>(`/shifts/${id}`);
      return res;
    }, setLoading);
  };

  const create = async (data: Partial<IShiftsEntity>) => {
    return await run(async () => {
      const res = await useApi().post<IShiftsEntity>("/shifts", data);
      return res;
    }, setLoading);
  };

  const update = async (id: number, data: Partial<IShiftsEntity>) => {
    return await run(async () => {
      const res = await useApi().patch<IShiftsEntity>(`/shifts/${id}`, data);
      return res;
    }, setLoading);
  };

  const softDelete = async (id: number) => {
    return await run(async () => {
      const res = await useApi().delete<IShiftsEntity>(`/shifts/soft/${id}`);
      return res;
    }, setLoading);
  };

  const restore = async (id: number) => {
    return await run(async () => {
      const res = await useApi().patch<IShiftsEntity>(`/shifts/restore/${id}`, {});
      return res;
    }, setLoading);
  };

  return { findAll, findOne, create, update, softDelete, restore };
};
