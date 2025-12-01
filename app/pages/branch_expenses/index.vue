<template>
  <div>
    <div class="grid grid-cols-12 gap-8">
      <!-- Stats -->
      <UiStats
        title="branches.sidebar.branch_expenses_label"
        :count="store.branchExpenseList.pagination.count"
        :type="$t('items')"
        icon="pi pi-money-bill text-xl"
      />

      <!-- Branch Expense Table -->
      <div class="col-span-12">
        <div class="card">
          <Toolbar class="mb-6">
            <template #start>
              <Button
                :label="$t('add') + ' ' + $t('branches.sidebar.branch_expenses_label')"
                icon="pi pi-plus"
                severity="secondary"
                class="mr-2"
                @click="openCreateDialog"
              />
            </template>
            <template #end>
              <Button
                label="Export"
                icon="pi pi-upload"
                severity="secondary"
              />
            </template>
          </Toolbar>

          <BranchExpenseTable
            title="branches.sidebar.branch_expenses_label"
            :loading="store.loading"
            :data="store.branchExpenseList"
            v-model:value="selectedExpenses"
            :query="query"
            @on-search="onQuery.search($event)"
            @on-change-page="onQuery.page($event.page, $event.limit)"
            @on-view="handleView"
            @on-approve="handleApprove"
            @on-reject="handleReject"
          />
        </div>
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
import { useBranchExpenseStore } from "~/stores/branch-expense.store";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import type { IBranchExpenseEntity } from "~/types/entities/branch-expense.entity";
import type { IBranchEntity } from "~/types/entities/branch.entity";
import type { IExpenseCategoryEntity } from "~/types/entities/expense-category.entity";
import { sortType, Status } from "~/types/enum/paginate.enum";
import { useBranchExpense } from "~/composables/branch-expense";
import { useBranch } from "~/composables/branch";
import { useExpenseCategory } from "~/composables/expense-category";
const route = useRoute();
const router = useRouter();
const store = useBranchExpenseStore();
const { findAll, approve, reject, create } = useBranchExpense();
const { showSuccess } = useFormHandler();

const query = reactive<IPaginateDto>({
  page: Number(route.query.page ?? 1),
  limit: Number(route.query.limit ?? 10),
  search: String(route.query.search ?? ""),
  sort: (route.query.sort as sortType) ?? sortType.DESC,
});

if (!route.query.page) {
  router.replace({ query: { ...query } });
}

const updateUrl = () => {
  router.replace({ query: { ...query } });
};

const load = async () => {
  await findAll({ ...query });
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
};

watch(
  () => ({ ...query }),
  () => updateUrl()
);

await load();

const selectedExpenses = ref([]);
const dialogVisible = ref(false);

// Options for dropdowns
const branchOptions = ref<IBranchEntity[]>([]);
const categoryOptions = ref<IExpenseCategoryEntity[]>([]);

// Load options on mount
onMounted(async () => {
  // Load branches
  const { findAll: findAllBranches } = useBranch();
  const branchesRes = await findAllBranches({ page: 1, limit: 100, is_active: Status.ACTIVE });
  branchOptions.value = branchesRes?.data || [];
  console.log('Loaded branches:', branchOptions.value.length);

  // Load categories
  const { findAll: findAllCategories } = useExpenseCategory();
  const categoriesRes = await findAllCategories({ page: 1, limit: 100, is_active: Status.ACTIVE });
  categoryOptions.value = categoriesRes?.data || [];
  console.log('Loaded categories:', categoryOptions.value.length, categoryOptions.value);
});

const openCreateDialog = () => {
  dialogVisible.value = true;
};

const handleView = (expense: IBranchExpenseEntity) => {
  // TODO: Implement view dialog
  console.log("View expense:", expense);
};

const handleSave = async (formData: Partial<IBranchExpenseEntity>) => {
  await create(formData);
  showSuccess("Expense created successfully");
  dialogVisible.value = false;
  await load();
};

const handleApprove = async (expense: IBranchExpenseEntity) => {
  await approve(expense.id);
  showSuccess("Expense approved successfully");
  await load();
};

const handleReject = async (expense: IBranchExpenseEntity) => {
  await reject(expense.id);
  showSuccess("Expense rejected successfully");
  await load();
};
</script>

<style scoped></style>
