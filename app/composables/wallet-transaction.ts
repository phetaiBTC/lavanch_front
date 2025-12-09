import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IFindWalletTransactionDto } from "~/types/dto/find-wallet-transaction.dto";
import type { IWalletTransactionEntity } from "~/types/entities/wallet-transaction.entity";
import { useWalletTransactionStore } from "~/stores/wallet-transaction.store";
export const useWalletTransaction = () => {
  const store = useWalletTransactionStore();
  const { setLoading, setWalletTransactionList } = store;
  const { run } = useFormHandler();

  const findAll = async (query: IFindWalletTransactionDto) => {
    return await run(async () => {
      const res = await useApi().get<PaginatedResponse<IWalletTransactionEntity>>(
        "/wallet-transactions",
        { query }
      );
      setWalletTransactionList(res);
      return res;
    }, setLoading);
  };

  const findOne = async (id: number) => {
    return await run(async () => {
      const res = await useApi().get<IWalletTransactionEntity>(`/wallet-transactions/${id}`);
      return res;
    }, setLoading);
  };

  return { findAll, findOne };
};
