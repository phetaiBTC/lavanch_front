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
                severity="secondary"
                :disabled="selectedCategories.length === 0"
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
            @on-change-page="onQuery.page($event.page, $event.limit)"
            @on-edit="openEditDialog"
            @on-delete="handleDelete"
            @on-restore="handleRestore"
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
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import { useExpenseCategoryStore } from "~/stores/expense-category.store";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import type { IExpenseCategoryEntity } from "~/types/entities/expense-category.entity";
import { sortType, Status } from "~/types/enum/paginate.enum";
import { useExpenseCategory } from "~/composables/expense-category";
const route = useRoute();
const router = useRouter();
const store = useExpenseCategoryStore();
const { findAll, create, update, softDelete, restore } = useExpenseCategory();
const { showSuccess } = useFormHandler();

// Dialog states
const createCategoryDialogVisible = ref(false);
const updateCategoryDialogVisible = ref(false);
const deleteCategoryDialogVisible = ref(false);
const selectedCategory = ref<IExpenseCategoryEntity | null>(null);
const selectedCategoryForDelete = ref<IExpenseCategoryEntity | null>(null);

const query = reactive<IPaginateDto>({
  page: Number(route.query.page ?? 1),
  limit: Number(route.query.limit ?? 10),
  search: String(route.query.search ?? ""),
  sort: (route.query.sort as sortType) ?? sortType.ASC,
  is_active: (route.query.is_active as Status) ?? Status.ACTIVE,
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
</script>

<style scoped></style>
