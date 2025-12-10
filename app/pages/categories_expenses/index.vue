<template>
  <div>
    <div class="grid grid-cols-12 gap-8">
      <!-- Stats -->
      <UiStats
        title="branches.sidebar.categories_expenses_label"
        :count="store.expenseCategoryList.pagination.count"
        :type="$t('items')"
        icon="pi pi-tags text-xl"
      />

      <!-- Expense Category Table -->
      <div class="col-span-12">
        <div class="card">
          <Toolbar class="mb-6">
            <template #start>
              <Button
                :label="$t('add') + ' ' + $t('branches.sidebar.categories_expenses_label')"
                icon="pi pi-plus"
                severity="secondary"
                class="mr-2"
                @click="openCreateDialog"
              />
              <Button
                :label="$t('delete')"
                icon="pi pi-trash"
                severity="danger"
                :disabled="selectedCategories.length === 0"
                @click="handleDeleteMultiple"
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

            <BranchExpenseCategoryTable
            title="branches.sidebar.categories_expenses_label"
            :loading="store.loading"
            :data="store.expenseCategoryList"
            :sort="query.sort"
            :checked="query.is_active"
            v-model:value="selectedCategories"
            :query="query"
            @on-search="onQuery.search($event)"
            @on-change-sort="onQuery.sort($event.sort)"
            @on-change-active="onQuery.checked($event.is_active)"
            @on-filter-active-status="onQuery.filterActiveStatus($event)"
            @on-change-page="onQuery.page($event.page, $event.limit)"
            @on-edit="openEditDialog"
            @on-delete="handleDelete"
            @on-restore="handleRestore"
            @on-toggle-status="handleToggleStatus"
            @on-hard-delete="handleHardDelete"
          />
        </div>
      </div>
    </div>

    <!-- Category Dialogs -->
    <BranchDialogsCategoriesCreateDialog
      v-model:visible="createCategoryDialogVisible"
      @save="handleCreateCategory"
    />
    <BranchDialogsCategoriesUpdateDialog
      v-model:visible="updateCategoryDialogVisible"
      :category="selectedCategory!"
      @save="handleUpdateCategory"
    />
    <BranchDialogsCategoriesDeleteDialog
      v-model:visible="deleteCategoryDialogVisible"
      :category="selectedCategoryForDelete"
      @delete="handleConfirmDeleteCategory"
    />
    <BranchDialogsCategoriesDeleteMultipleDialog
      v-model:visible="deleteMultipleCategoryDialogVisible"
      :categories="selectedCategoriesForDelete"
      @delete="handleConfirmDeleteMultiple"
    />
    <BranchDialogsCategoriesHardDeleteDialog
      v-model:visible="hardDeleteCategoryDialogVisible"
      :category="selectedCategoryForHardDelete"
      @delete="handleConfirmHardDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import { useExpenseCategoryStore } from "~/stores/expense-category.store";
import type { IFindExpenseCategoryDto } from "~/types/dto/find-expense-category.dto";
import type { IExpenseCategoryEntity } from "~/types/entities/expense-category.entity";
import { sortType, Status } from "~/types/enum/paginate.enum";
import { useExpenseCategory } from "~/composables/expense-category";
const route = useRoute();
const router = useRouter();
const store = useExpenseCategoryStore();
const { findAll, create, update, softDelete, hardDelete, restore, toggleStatus, deleteMultiple } = useExpenseCategory();
const { showSuccess } = useFormHandler();

// Dialog states
const createCategoryDialogVisible = ref(false);
const updateCategoryDialogVisible = ref(false);
const deleteCategoryDialogVisible = ref(false);
const deleteMultipleCategoryDialogVisible = ref(false);
const hardDeleteCategoryDialogVisible = ref(false);
const selectedCategory = ref<IExpenseCategoryEntity | null>(null);
const selectedCategoryForDelete = ref<IExpenseCategoryEntity | null>(null);
const selectedCategoriesForDelete = ref<IExpenseCategoryEntity[]>([]);
const selectedCategoryForHardDelete = ref<IExpenseCategoryEntity | null>(null);

const query = reactive<IFindExpenseCategoryDto>({
  page: Number(route.query.page ?? 1),
  limit: Number(route.query.limit ?? 10),
  search: String(route.query.search ?? ""),
  sort: (route.query.sort as sortType) ?? sortType.ASC,
  is_active: route.query.is_active === 'active' ? Status.ACTIVE : route.query.is_active === 'inactive' ? Status.INACTIVE : Status.ACTIVE,
  status: route.query.status === 'active' || route.query.status === 'inactive' || route.query.status === 'all' ? route.query.status : undefined,
  deleted: route.query.deleted === 'true' ? true : route.query.deleted === 'false' ? false : false,
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
  await findAll({ ...query });
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
  checked: async (value: { deleted: boolean }) => {
    // Map toggle to backend soft-delete filter `deleted`
    // deleted: true => show deleted records, deleted: false => show active records
    query.deleted = value.deleted;
    query.page = 1;
    updateUrl();
    await load();
  },
  filterActiveStatus: async (value: 'active' | 'inactive' | 'all' | null) => {
    // Map status select to backend `status` (is_active boolean grouping)
    query.status = value === null ? undefined : value;
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

const selectedCategories = ref([]);

const openCreateDialog = () => {
  createCategoryDialogVisible.value = true;
};

const openEditDialog = (category: IExpenseCategoryEntity) => {
  selectedCategory.value = category;
  updateCategoryDialogVisible.value = true;
};

const handleCreateCategory = async (data: Partial<IExpenseCategoryEntity>) => {
  await create(data);
  createCategoryDialogVisible.value = false;
  showSuccess("Category created successfully");
  await load();
};

const handleUpdateCategory = async (data: Partial<IExpenseCategoryEntity>) => {
  if (selectedCategory.value?.id) {
    await update(selectedCategory.value.id, data);
    updateCategoryDialogVisible.value = false;
    showSuccess("Category updated successfully");
    await load();
  }
};

const handleDelete = async (category: IExpenseCategoryEntity) => {
  selectedCategoryForDelete.value = category;
  deleteCategoryDialogVisible.value = true;
};

const handleConfirmDeleteCategory = async (category: IExpenseCategoryEntity) => {
  await softDelete(category.id);
  deleteCategoryDialogVisible.value = false;
  showSuccess("Category deleted successfully");
  await load();
};

const handleRestore = async (category: IExpenseCategoryEntity) => {
  await restore(category.id);
  showSuccess("Category restored successfully");
  await load();
};

const handleToggleStatus = async (category: IExpenseCategoryEntity) => {
  try {
    const result = await toggleStatus(category.id);
    showSuccess(result?.message || "Category status toggled successfully");
    await load();
  } catch (error) {
    console.error('Failed to toggle category status:', error);
  }
};

const handleDeleteMultiple = async () => {
  if (selectedCategories.value.length === 0) return;
  
  selectedCategoriesForDelete.value = selectedCategories.value;
  deleteMultipleCategoryDialogVisible.value = true;
};

const handleConfirmDeleteMultiple = async (categories: IExpenseCategoryEntity[]) => {
  try {
    const ids = categories.map((category: IExpenseCategoryEntity) => category.id);
    const result = await deleteMultiple(ids);
    deleteMultipleCategoryDialogVisible.value = false;
    selectedCategories.value = []; // Clear selection
    showSuccess(result?.message || `Successfully deleted ${categories.length} categories`);
    await load();
  } catch (error: any) {
    console.error('Failed to delete multiple categories:', error);
    useToast().add({
      severity: 'error',
      summary: 'Error',
      detail: error?.message || 'Failed to delete categories',
      life: 3000,
    });
  }
};

const handleHardDelete = async (category: IExpenseCategoryEntity) => {
  selectedCategoryForHardDelete.value = category;
  hardDeleteCategoryDialogVisible.value = true;
};

const handleConfirmHardDelete = async (category: IExpenseCategoryEntity) => {
  try {
    await hardDelete(category.id);
    hardDeleteCategoryDialogVisible.value = false;
    showSuccess("Category permanently deleted successfully");
    await load();
  } catch (error: any) {
    console.error('Failed to permanently delete category:', error);
    useToast().add({
      severity: 'error',
      summary: 'Error',
      detail: error?.message || 'Failed to permanently delete category',
      life: 3000,
    });
  }
};
</script>

<style scoped></style>
