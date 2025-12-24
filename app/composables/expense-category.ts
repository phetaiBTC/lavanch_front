import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IFindExpenseCategoryDto } from "~/types/dto/find-expense-category.dto";
import type { IExpenseCategoryEntity } from "~/types/entities/expense-category.entity";
import { useExpenseCategoryStore } from "~/stores/expense-category.store";

export const useExpenseCategory = () => {
  const store = useExpenseCategoryStore();
  const { setLoading, setExpenseCategoryList } = store;
  
  const findAll = async (query: IFindExpenseCategoryDto) => {
    try {
      setLoading(true);
      // Clean query to remove undefined/null and ensure proper serialization
      const cleanQuery = Object.entries(query).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {} as any);
      
      const res = await useApi().get<PaginatedResponse<IExpenseCategoryEntity>>(
        "/expense-categories",
        { query: cleanQuery }
      );
      console.log('Expense categories findAll response:', res);
      setExpenseCategoryList(res);
      return res;
    } catch (error) {
      console.error('Failed to fetch expense categories:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const findOne = async (id: number) => {
    try {
      const res = await useApi().get<IExpenseCategoryEntity>(`/expense-categories/${id}`);
      return res;
    } catch (error) {
      console.error('Failed to fetch expense category:', error);
      throw error;
    }
  };

  const create = async (data: Partial<IExpenseCategoryEntity>) => {
    try {
      const res = await useApi().post<IExpenseCategoryEntity>("/expense-categories", data);
      return res;
    } catch (error) {
      console.error('Failed to create expense category:', error);
      throw error;
    }
  };

  const update = async (id: number, data: Partial<IExpenseCategoryEntity>) => {
    try {
      const res = await useApi().patch<IExpenseCategoryEntity>(`/expense-categories/${id}`, data);
      return res;
    } catch (error) {
      console.error('Failed to update expense category:', error);
      throw error;
    }
  };

  const softDelete = async (id: number) => {
    try {
      const res = await useApi().delete<IExpenseCategoryEntity>(`/expense-categories/soft/${id}`);
      return res;
    } catch (error) {
      console.error('Failed to delete expense category:', error);
      throw error;
    }
  };

  const restore = async (id: number) => {
    try {
      const res = await useApi().patch<IExpenseCategoryEntity>(
        `/expense-categories/restore/${id}`,
        {}
      );
      return res;
    } catch (error) {
      console.error('Failed to restore expense category:', error);
      throw error;
    }
  };

  const toggleStatus = async (id: number) => {
    try {
      const res = await useApi().patch<{ message: string; is_active: boolean }>(
        `/expense-categories/${id}/status`,
        {}
      );
      return res;
    } catch (error) {
      console.error('Failed to toggle expense category status:', error);
      throw error;
    }
  };

  const deleteMultiple = async (ids: number[]) => {
    try {
      const res = await useApi().delete<{ message: string; deletedIds: number[] }>(
        "/expense-categories/multiple",
        { body: { ids } }
      );
      return res;
    } catch (error) {
      console.error('Failed to delete multiple expense categories:', error);
      throw error;
    }
  };

  const hardDelete = async (id: number) => {
    try {
      const res = await useApi().delete<{ message: string }>(
        `/expense-categories/hard/${id}`
      );
      return res;
    } catch (error) {
      console.error('Failed to hard delete expense category:', error);
      throw error;
    }
  };

  return { 
    findAll, 
    findOne, 
    create, 
    update, 
    softDelete, 
    hardDelete,
    restore, 
    toggleStatus, 
    deleteMultiple 
  };
};
