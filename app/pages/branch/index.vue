<template>
  <div>
    <div class="grid grid-cols-12 gap-8">
      <!-- Stats -->
      <UiStats
        title="branches.branch"
        :count="store.branchList.pagination.count"
        :type="$t('items')"
        icon="pi pi-sitemap text-xl"
      />

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
                <Toolbar class="mb-6">
                  <template #start>
                    <Button
                      :label="$t('add') + ' ' + $t('branches.branch')"
                      icon="pi pi-plus"
                      severity="secondary"
                      class="mr-2"
                      @click="openCreateDialog"
                    />
                    <Button
                      :label="$t('delete')"
                      icon="pi pi-trash"
                      severity="secondary"
                      :disabled="selectedBranches.length === 0"
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
                  @on-change-page="onQuery.page($event.page, $event.limit)"
                  @on-edit="openEditDialog"
                  @on-delete="handleDelete"
                  @on-restore="handleRestore"
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
import { ref, watch, reactive } from "vue";
import { useBranchStore } from "~/stores/branch.store";
import { useShiftsStore } from "~/stores/shifts.store";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import type { IBranchEntity } from "~/types/entities/branch.entity";
import type { IShiftsEntity } from "~/types/entities/shifts.entity";
import { sortType, Status } from "~/types/enum/paginate.enum";
import { useBranch } from "~/composables/branch";
import { useShifts } from "~/composables/shifts";
const route = useRoute();
const router = useRouter();
const store = useBranchStore();
console.log('Branch store:', store.branchList);
const shiftsStore = useShiftsStore();
const { findAll, create, update, softDelete, restore } = useBranch();
const { findAll: findAllShifts, create: createShift, update: updateShift, softDelete: deleteShift, restore: restoreShift } = useShifts();
const { showSuccess } = useFormHandler();

// Dialog states for branches
const createBranchDialogVisible = ref(false);
const updateBranchDialogVisible = ref(false);
const deleteBranchDialogVisible = ref(false);
const selectedBranch = ref<IBranchEntity | null>(null);
const selectedBranchForDelete = ref<IBranchEntity | null>(null);

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
await loadShifts();

const selectedBranches = ref([]);
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
  await create(data);
  createBranchDialogVisible.value = false;
  showSuccess("Branch created successfully");
  await load();
};

const handleUpdateBranch = async (data: Partial<IBranchEntity>) => {
  if (selectedBranch.value?.id) {
    await update(selectedBranch.value.id, data);
    updateBranchDialogVisible.value = false;
    showSuccess("Branch updated successfully");
    await load();
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
};

const handleRestore = async (branch: IBranchEntity) => {
  await restore(branch.id);
  showSuccess("Branch restored successfully");
  await load();
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
