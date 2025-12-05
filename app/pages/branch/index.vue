<template>
  <div>

      <!-- Summary Cards using UiStats -->
    <div class="grid grid-cols-12 gap-6 mb-8">
      <!-- Total Wallet Balance -->
      <UiStats
        :title="$t('branches.summary.total_wallet_balance')"
        :count="Number(summaryTotalWalletBalance) || 0" 
        icon="pi pi-wallet text-xl"
      />
      
      <!-- Active Branches -->
      <UiStats
        :title="$t('branches.summary.active_branches')"
        :count="summary?.active_count || 0"
        type="active"
        icon="pi pi-check-circle text-xl"
      />
      
      <!-- Inactive Branches -->
      <UiStats
        :title="$t('branches.summary.inactive_branches')"
        :count="summary?.inactive_count || 0"
        type="inactive"
        icon="pi pi-times-circle text-xl"
      />
      
      <!-- Total Branches -->
      <UiStats
        :title="$t('branches.summary.total_branches')"
        :count="(summary?.active_count || 0) + (summary?.inactive_count || 0)"
        type="total"
        icon="pi pi-sitemap text-xl"
      />
    </div>

    <div class="grid grid-cols-12 gap-8">
      <!-- Stats -->
      <!-- <UiStats
        title="branches.branch"
        :count="store.branchList.pagination.count"
        :type="$t('items')"
        icon="pi pi-sitemap text-xl"
      /> -->

      <!-- Branch Table -->
      <div class="col-span-12">
        <div class="card">
          <Tabs value="table">
            <TabList>
              <Tab value="table">{{ $t("table") }}</Tab>
              <Tab value="shifts">{{ $t("branches.shifts.title") }}</Tab>
            </TabList>
            <TabPanels>
              <TabPanel value="table">
                <Toolbar class="mb-4 sm:mb-6">
                  <template #start>
                    <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <Button
                        :label="$t('add') + ' ' + $t('branches.branch')"
                        icon="pi pi-plus"
                        severity="secondary"
                        class="bg-blue-600 hover:bg-blue-700 border-blue-600 text-white w-full sm:w-auto"
                        @click="openCreateDialog"
                      />
                      <Button
                        :label="$t('delete')"
                        icon="pi pi-trash"
                        severity="danger"
                        :disabled="selectedBranches.length === 0"
                        class="w-full sm:w-auto"
                        @click="handleDeleteMultiple"
                      />
                    </div>
                  </template>
                  <template #end>
                    <Button
                      label="Export"
                      icon="pi pi-upload"
                      severity="secondary"
                      outlined
                      class="w-full sm:w-auto"
                    />
                  </template>
                </Toolbar>

                <BranchTable
                  title="branches.branch"
                  :loading="store.loading"
                  :data="store.branchList"
                  :sort="query.sort"
                  :checked="query.is_active"
                  v-model:value="selectedBranches"
                  :query="query"
                  @on-search="onQuery.search($event)"
                  @on-change-sort="onQuery.sort($event.sort)"
                  @on-change-active="onQuery.checked($event.is_active)"
                  @on-change-status="onQuery.status($event)"
                  @on-change-page="onQuery.page($event.page, $event.limit)"
                  @on-edit="openEditDialog"
                  @on-delete="handleDelete"
                  @on-restore="handleRestore"
                  @on-toggle-status="handleToggleStatus"
                  @on-hard-delete="handleHardDelete"
                />
              </TabPanel>
              
              <TabPanel value="shifts">
                <Toolbar class="mb-6">
                  <template #start>
                    <Button
                      :label="$t('add') + ' ' + $t('branches.shifts.title')"
                      icon="pi pi-plus"
                      severity="secondary"
                      @click="openShiftDialog"
                    />
                  </template>
                </Toolbar>

                <BranchShiftsTable
                  :loading="shiftsStore.loading"
                  :data="shiftsStore.shiftsList"
                  v-model:value="selectedShifts"
                  :query="shiftsQuery"
                  @on-change-page="onShiftsQuery.page($event.page, $event.limit)"
                  @on-edit="openEditShiftDialog"
                  @on-delete="handleDeleteShift"
                  @on-restore="handleRestoreShift"
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>

    <!-- Branch Dialogs -->
    <BranchDialogsBanchCreateDialog
      v-model:visible="createBranchDialogVisible"
      :shifts="shiftsStore.shiftsList.data"
      @save="handleCreateBranch"
    />
    <BranchDialogsBanchUpdateDialog
      v-model:visible="updateBranchDialogVisible"
      :branch="selectedBranch!"
      :shifts="shiftsStore.shiftsList.data"
      @save="handleUpdateBranch"
    />
    <BranchDialogsBanchDeleteDialog
      v-model:visible="deleteBranchDialogVisible"
      :branch="selectedBranchForDelete"
      @delete="handleConfirmDeleteBranch"
    />
    <BranchDialogsBanchDeleteMultipleDialog
      v-model:visible="deleteMultipleBranchDialogVisible"
      :branches="selectedBranchesForDelete"
      @delete="handleConfirmDeleteMultiple"
    />

    <!-- Shifts Dialogs -->
    <BranchDialogsShiftsCreateDialog
      v-model:visible="createShiftDialogVisible"
      @save="handleCreateShift"
    />
    <BranchDialogsShiftsUpdateDialog
      v-model:visible="updateShiftDialogVisible"
      :shift="selectedShift!"
      @save="handleUpdateShift"
    />
    <BranchDialogsShiftsDeleteDialog
      v-model:visible="deleteShiftDialogVisible"
      :shift="selectedShiftForDelete"
      @delete="handleConfirmDeleteShift"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive, computed } from "vue";
import { useBranchStore } from "~/stores/branch.store";
import { useShiftsStore } from "~/stores/shifts.store";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import type { IBranchEntity } from "~/types/entities/branch.entity";
import type { IShiftsEntity } from "~/types/entities/shifts.entity";
import { sortType, Status } from "~/types/enum/paginate.enum";
import { useBranch, type IBranchSummaryResponse } from "~/composables/branch";
import { useShifts } from "~/composables/shifts";
import {formatCurrency} from '~/utils/formatCurrencyUtil';
const route = useRoute();
const router = useRouter();
const store = useBranchStore();
console.log('Branch store:', store.branchList);
const shiftsStore = useShiftsStore();
const { findAll, create, update, softDelete, hardDelete, restore, getSummary, toggleStatus, deleteMultiple } = useBranch();
const { findAll: findAllShifts, create: createShift, update: updateShift, softDelete: deleteShift, restore: restoreShift } = useShifts();
const { showSuccess } = useFormHandler();

// Summary data
const summary = ref<IBranchSummaryResponse | null>(null);
const summaryTotalWalletBalance = computed(() => 
  formatCurrency(summary.value?.total_wallet_balance_all_branches || 0)
);
// Dialog states for branches
const createBranchDialogVisible = ref(false);
const updateBranchDialogVisible = ref(false);
const deleteBranchDialogVisible = ref(false);
const deleteMultipleBranchDialogVisible = ref(false);
const selectedBranch = ref<IBranchEntity | null>(null);
const selectedBranchForDelete = ref<IBranchEntity | null>(null);
const selectedBranchesForDelete = ref<IBranchEntity[]>([]);

// Dialog states for shifts
const createShiftDialogVisible = ref(false);
const updateShiftDialogVisible = ref(false);
const deleteShiftDialogVisible = ref(false);
const selectedShift = ref<IShiftsEntity | null>(null);
const selectedShiftForDelete = ref<IShiftsEntity | null>(null);

/* Query for branches */
const query = reactive<IPaginateDto>({
  page: Number(route.query.page ?? 1),
  limit: Number(route.query.limit ?? 10),
  search: String(route.query.search ?? ""),
  sort: (route.query.sort as sortType) ?? sortType.ASC,
  is_active: (route.query.is_active as Status) ?? Status.ACTIVE,
  status: (route.query.status as any) ?? "all",
});

/* Query for shifts */
const shiftsQuery = reactive<IPaginateDto>({
  page: 1,
  limit: 5,
  search: "",
  sort: sortType.ASC,
  is_active: Status.ACTIVE,
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

const loadSummary = async () => {
  const result = await getSummary();
  summary.value = result || null;
};

const loadShifts = async () => {
  await findAllShifts({ ...shiftsQuery });
};

const onQuery = {
  search: async (value: string) => {
    query.search = value;
    query.page = 1;
    updateUrl();
    await load();
  },
  sort: async (value: sortType) => {
    query.sort = value;
    query.page = 1;
    updateUrl();
    await load();
  },
  checked: async (value: Status) => {
    query.is_active = value;
    query.page = 1;
    updateUrl();
    await load();
  },
  status: async (value: string) => {
    query.status = value as any;
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

const onShiftsQuery = {
  page: async (page: number, limit: number) => {
    shiftsQuery.page = page;
    shiftsQuery.limit = limit;
    await loadShifts();
  },
};

watch(
  () => ({ ...query }),
  () => updateUrl()
);

await load();
await loadSummary();
await loadShifts();

const selectedBranches = ref<IBranchEntity[]>([]);
const selectedShifts = ref([]);

// Branch CRUD handlers
const openCreateDialog = () => {
  createBranchDialogVisible.value = true;
};

const openEditDialog = (branch: IBranchEntity) => {
  selectedBranch.value = branch;
  updateBranchDialogVisible.value = true;
};

const handleCreateBranch = async (data: Partial<IBranchEntity>) => {
  try {
    await create(data);
    createBranchDialogVisible.value = false;
    showSuccess("Branch created successfully");
    await load();
    await loadSummary();
  } catch (error) {
    // Error is already shown by useFormHandler
    // Keep dialog open so user can fix errors
  }
};

const handleUpdateBranch = async (data: Partial<IBranchEntity>) => {
  if (selectedBranch.value?.id) {
    try {
      await update(selectedBranch.value.id, data);
      updateBranchDialogVisible.value = false;
      showSuccess("Branch updated successfully");
      await load();
      await loadSummary();
    } catch (error) {
      // Error is already shown by useFormHandler
      // Keep dialog open so user can fix errors
    }
  }
};

const handleDelete = async (branch: IBranchEntity) => {
  selectedBranchForDelete.value = branch;
  deleteBranchDialogVisible.value = true;
};

const handleConfirmDeleteBranch = async (branch: IBranchEntity) => {
  await softDelete(branch.id);
  deleteBranchDialogVisible.value = false;
  showSuccess("Branch deleted successfully");
  await load();
  await loadSummary();
};

const handleRestore = async (branch: IBranchEntity) => {
  await restore(branch.id);
  showSuccess("Branch restored successfully");
  await load();
  await loadSummary();
};

const handleToggleStatus = async (branch: IBranchEntity) => {
  try {
    const result = await toggleStatus(branch.id);
    showSuccess(result?.message || "Branch status toggled successfully");
    await load();
    await loadSummary();
  } catch (error) {
    console.error('Failed to toggle branch status:', error);
  }
};

const handleDeleteMultiple = async () => {
  if (selectedBranches.value.length === 0) return;
  
  selectedBranchesForDelete.value = selectedBranches.value;
  deleteMultipleBranchDialogVisible.value = true;
};

const handleConfirmDeleteMultiple = async (branches: IBranchEntity[]) => {
  try {
    const ids = branches.map((branch: IBranchEntity) => branch.id);
    const result = await deleteMultiple(ids);
    deleteMultipleBranchDialogVisible.value = false;
    selectedBranches.value = []; // Clear selection
    showSuccess(result?.message || `Successfully deleted ${branches.length} branches`);
    await load();
    await loadSummary();
  } catch (error: any) {
    console.error('Failed to delete multiple branches:', error);
    useToast().add({
      severity: 'error',
      summary: 'Error',
      detail: error?.message || 'Failed to delete branches',
      life: 3000,
    });
  }
};

const handleHardDelete = async (branch: IBranchEntity) => {
  const confirmed = confirm(`Are you sure you want to permanently delete "${branch.name}"? This action cannot be undone.`);
  if (!confirmed) return;
  
  try {
    await hardDelete(branch.id);
    showSuccess("Branch permanently deleted successfully");
    await load();
    await loadSummary();
  } catch (error: any) {
    console.error('Failed to permanently delete branch:', error);
    useToast().add({
      severity: 'error',
      summary: 'Error',
      detail: error?.message || 'Failed to permanently delete branch',
      life: 3000,
    });
  }
};

// Shift CRUD handlers
const openShiftDialog = () => {
  createShiftDialogVisible.value = true;
};

const openEditShiftDialog = (shift: IShiftsEntity) => {
  selectedShift.value = shift;
  updateShiftDialogVisible.value = true;
};

const handleCreateShift = async (data: Partial<IShiftsEntity>) => {
  await createShift(data);
  createShiftDialogVisible.value = false;
  showSuccess("Shift created successfully");
  await loadShifts();
};

const handleUpdateShift = async (data: Partial<IShiftsEntity>) => {
  if (selectedShift.value?.id) {
    await updateShift(selectedShift.value.id, data);
    updateShiftDialogVisible.value = false;
    showSuccess("Shift updated successfully");
    await loadShifts();
  }
};

const handleDeleteShift = async (shift: IShiftsEntity) => {
  selectedShiftForDelete.value = shift;
  deleteShiftDialogVisible.value = true;
};

const handleConfirmDeleteShift = async (shift: IShiftsEntity) => {
  await deleteShift(shift.id);
  deleteShiftDialogVisible.value = false;
  showSuccess("Shift deleted successfully");
  await loadShifts();
};

const handleRestoreShift = async (shift: IShiftsEntity) => {
  await restoreShift(shift.id);
  showSuccess("Shift restored successfully");
  await loadShifts();
};
</script>

<style scoped></style>
