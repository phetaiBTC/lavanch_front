<template>
  <div>
    <div class="grid grid-cols-12 gap-4 mb-6">
      <!-- Summary Stats -->
      <div class="col-span-12 sm:col-span-6 lg:col-span-3">
        <div class="card mb-0">
          <div class="flex justify-between">
            <div>
              <span class="block text-xl font-medium mb-4">{{ $t('branchExpenses.summary.total_amount') }}</span>
              <span class="text-primary text-xl font-medium mr-2">{{ formatCurrency(summary?.total_amount_all || 0) }}</span>
            </div>
            <div
               class="flex items-center justify-center rounded-border border-2 text-primary"
          style="width: 2.5rem; height: 2.5rem"
            >
              <i class="pi pi-wallet text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-span-12 sm:col-span-6 lg:col-span-3">
        <UiStats
          :title="$t('branchExpenses.summary.total_records')"
          :count="summary?.total_count || 0"
          :type="$t('items')"
          icon="pi pi-list text-xl"
        />
      </div>
      
      <div class="col-span-12 sm:col-span-6 lg:col-span-3">
        <UiStats
          :title="$t('branchExpenses.summary.pending')"
          :count="summary?.count_pending || 0"
          :type="$t('items')"
          icon="pi pi-clock text-xl"
        />
      </div>
      
      <div class="col-span-12 sm:col-span-6 lg:col-span-3">
        <UiStats
          :title="$t('branchExpenses.summary.approved')"
          :count="summary?.count_approved || 0"
          :type="$t('items')"
          icon="pi pi-check text-xl"
        />
      </div>
      
      <div class="col-span-12 sm:col-span-6 lg:col-span-3">
        <UiStats
          :title="$t('branchExpenses.summary.rejected')"
          :count="summary?.count_rejected || 0"
          :type="$t('items')"
          icon="pi pi-times text-xl"
        />
      </div>
    </div>

    <!-- Branch Expense Table -->
    <div class="col-span-12">
      <div class="card">
        <Toolbar class="mb-6 flex-col sm:flex-row gap-3">
          <template #start>
            <Button
              :label="$t('add') + ' ' + $t('branches.sidebar.branch_expenses_label')"
              icon="pi pi-plus"
              class="bg-blue-600 hover:bg-blue-700 border-blue-600 w-full sm:w-auto"
              @click="openCreateDialog"
            />
          </template>
          <template #end>
            <Button
              label="Export"
              icon="pi pi-upload"
              outlined
              class="w-full sm:w-auto"
            />
          </template>
        </Toolbar>

        <BranchExpenseTable
          title="branches.sidebar.branch_expenses_label"
          :loading="store.loading"
          :data="store.branchExpenseList"
          :categories="categoryOptions"
          v-model:value="selectedExpenses"
          :query="query"
          @on-search="onQuery.search($event)"
          @on-change-page="onQuery.page($event.page, $event.limit)"
          @on-filter-status="onQuery.filterStatus($event)"
          @on-filter-category="onQuery.filterCategory($event)"
          @on-filter-date-from="onQuery.filterDateFrom($event)"
          @on-filter-date-to="onQuery.filterDateTo($event)"
          @on-view="handleView"
          @on-approve="handleApprove"
          @on-reject="handleReject"
        />
      </div>
    </div>

    <!-- Expense Dialog -->
    <BranchDialogsBranchExpensesCreateDialog
      v-model:visible="dialogVisible"
      :branches="branchOptions"
      :categories="categoryOptions"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive, onMounted } from "vue";
// Explicit component imports to avoid runtime 404 resolution issues
import BranchExpenseTable from "~/components/branch/BranchExpenseTable.vue";
import BranchDialogsBranchExpensesCreateDialog from "~/components/branch/dialogs/branch_expenses/create-dialog.vue";
import { useBranchExpenseStore } from "~/stores/branch-expense.store";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import type { IBranchExpenseEntity, IBranchExpenseSummary } from "~/types/entities/branch-expense.entity";
import type { IBranchEntity } from "~/types/entities/branch.entity";
import type { IExpenseCategoryEntity } from "~/types/entities/expense-category.entity";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import { sortType, Status } from "~/types/enum/paginate.enum";
import { useBranchExpense } from "~/composables/branch-expense";
import { useBranch } from "~/composables/branch";
import { useExpenseCategory } from "~/composables/expense-category";

import { useConfirm } from "primevue/useconfirm";
const route = useRoute();
const router = useRouter();
const store = useBranchExpenseStore();
const { findAll, getSummary, approve, reject, create } = useBranchExpense();
const { showSuccess } = useFormHandler();
const confirm = useConfirm();

const query = reactive<any>({
  page: Number(route.query.page ?? 1),
  limit: Number(route.query.limit ?? 10),
  search: String(route.query.search ?? ""),
  sort: (route.query.sort as sortType) ?? sortType.DESC,
  expenseStatus: route.query.expenseStatus || "ALL",
  branchName: route.query.branchName || undefined,
  expenseCategoryName: route.query.expenseCategoryName || undefined,
  createdFrom: route.query.createdFrom || undefined,
  createdTo: route.query.createdTo || undefined,
});

if (!route.query.page) {
  router.replace({ query: { ...query } });
}

const updateUrl = () => {
  // Clean query before updating URL - remove undefined/empty values
  const cleanQuery = Object.entries(query).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      acc[key] = value;
    }
    return acc;
  }, {} as any);
  
  router.replace({ query: cleanQuery });
};

const load = async () => {
  // Clean query before sending to API - remove undefined/empty values
  const cleanQuery = Object.entries(query).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      acc[key] = value;
    }
    return acc;
  }, {} as any);
  
  await findAll(cleanQuery);
  await loadSummary();
};

const summary = ref<IBranchExpenseSummary | null>(null);

const loadSummary = async () => {
  // Clean query before sending to API
  const cleanQuery = Object.entries(query).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      acc[key] = value;
    }
    return acc;
  }, {} as any);
  
  const res = await getSummary(cleanQuery);
  summary.value = res || null;
};

const onQuery = {
  search: async (value: string) => {
    query.search = value;
    query.page = 1;
    updateUrl();
    await load();
  },
  page: async (page: number, limit: number) => {
    query.page = page;
    query.limit = limit;
    updateUrl();
    await load();
  },
  filterStatus: async (value: string | null) => {
    query.expenseStatus = value || 'ALL';
    query.page = 1;
    updateUrl();
    await load();
  },
  filterCategory: async (value: string | null) => {
    query.expenseCategoryName = value || undefined;
    query.page = 1;
    updateUrl();
    await load();
  },
  filterDateFrom: async (value: string | null) => {
    query.createdFrom = value || undefined;
    query.page = 1;
    updateUrl();
    await load();
  },
  filterDateTo: async (value: string | null) => {
    query.createdTo = value || undefined;
    query.page = 1;
    updateUrl();
    await load();
  },
};

watch(
  () => ({ ...query }),
  () => updateUrl()
);

const selectedExpenses = ref([]);
const dialogVisible = ref(false);

// Options for dropdowns
const branchOptions = ref<IBranchEntity[]>([]);
const categoryOptions = ref<IExpenseCategoryEntity[]>([]);

// Load options on mount
onMounted(async () => {
  // Load initial data
  await load();
  
  // Load branches
  try {
    const { findAll: findAllBranches } = useBranch();
    const branchesRes = await findAllBranches({ page: 1, limit: 100, is_active: Status.ACTIVE });
    branchOptions.value = branchesRes?.data || [];
    console.log('Branches loaded:', branchOptions.value.length);
  } catch (error) {
    console.error('Failed to load branches:', error);
  }

  // Load categories
  try {
    const res = await useApi().get<PaginatedResponse<IExpenseCategoryEntity>>(
      "/expense-categories",
      { 
        query: { 
          page: 1, 
          limit: 100, 
          is_active: Status.ACTIVE 
        } 
      }
    );
    console.log('Categories API response:', res);
    categoryOptions.value = res?.data || [];
    console.log('Categories loaded:', categoryOptions.value.length);
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
});

const formatCurrency = (amount: number) => {
  return `₭ ${amount.toLocaleString()}`;
};

const openCreateDialog = () => {
  dialogVisible.value = true;
};

const handleView = (expense: IBranchExpenseEntity) => {
  // TODO: Implement view dialog
  console.log("View expense:", expense);
};

const handleSave = async (formData: Partial<IBranchExpenseEntity>) => {
  try {
    await create(formData);
    showSuccess("Expense created successfully");
    dialogVisible.value = false;
    await load();
  } catch (error) {
    console.error("Error creating expense:", error);
  }
};

const handleApprove = async (expense: IBranchExpenseEntity) => {
  confirm.require({
    message: `Are you sure you want to approve expense ${expense.expense_no}?`,
    header: 'Confirm Approval',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await approve(expense.id);
        showSuccess("Expense approved successfully");
        await load();
      } catch (error) {
        console.error("Error approving expense:", error);
      }
    },
  });
};

const handleReject = async (expense: IBranchExpenseEntity) => {
  confirm.require({
    message: `Are you sure you want to reject expense ${expense.expense_no}?`,
    header: 'Confirm Rejection',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await reject(expense.id);
        showSuccess("Expense rejected successfully");
        await load();
      } catch (error) {
        console.error("Error rejecting expense:", error);
      }
    },
  });
};
</script>

<style scoped></style>
