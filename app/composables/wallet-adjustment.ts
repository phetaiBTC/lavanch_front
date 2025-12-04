import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import type { IWalletAdjustmentEntity } from "~/types/entities/wallet-adjustment.entity";

export const useWalletAdjustment = () => {
  const store = useWalletAdjustmentStore();
  const { setLoading, setWalletAdjustmentList } = store;
  const { run } = useFormHandler();

  const findAll = async (query: IPaginateDto) => {
    return await run(async () => {
      const res = await useApi().get<PaginatedResponse<IWalletAdjustmentEntity>>(
        "/wallet-adjustments",
        { query }
      );
      setWalletAdjustmentList(res);
      return res;
    }, setLoading);
  };

  const findOne = async (id: number) => {
    return await run(async () => {
      const res = await useApi().get<IWalletAdjustmentEntity>(`/wallet-adjustments/${id}`);
      return res;
    }, setLoading);
  };

  const createDeposit = async (data: { branch_id: number; amount: number; description?: string }) => {
    return await run(async () => {
      const res = await useApi().post<IWalletAdjustmentEntity>("/wallet-adjustments/deposit", data);
      return res;
    }, setLoading);
  };

  const createWithdraw = async (data: { branch_id: number; amount: number; description?: string }) => {
    return await run(async () => {
      const res = await useApi().post<IWalletAdjustmentEntity>("/wallet-adjustments/withdraw", data);
      return res;
    }, setLoading);
  };

  const createFound = async (data: { branch_id: number; amount: number; description?: string }) => {
    return await run(async () => {
      const res = await useApi().post<IWalletAdjustmentEntity>("/wallet-adjustments/found", data);
      return res;
    }, setLoading);
  };

  const createLost = async (data: { branch_id: number; amount: number; description?: string }) => {
    return await run(async () => {
      const res = await useApi().post<IWalletAdjustmentEntity>("/wallet-adjustments/lost", data);
      return res;
    }, setLoading);
  };

  const approve = async (id: number) => {
    return await run(async () => {
      const res = await useApi().patch<IWalletAdjustmentEntity>(
        `/wallet-adjustments/${id}/approve`,
        { action: "APPROVE" }
      );
      return res;
    }, setLoading);
  };

  const reject = async (id: number) => {
    return await run(async () => {
      const res = await useApi().patch<IWalletAdjustmentEntity>(
        `/wallet-adjustments/${id}/approve`,
        { action: "REJECT" }
      );
      return res;
    }, setLoading);
  };

  return { findAll, findOne, createDeposit, createWithdraw, createFound, createLost, approve, reject };
};
