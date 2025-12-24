<template>
  <!-- Desktop Table View -->
  <div class="hidden md:block">
    <DataTable
      ref="dt"
      v-model:selection="selection"
      :value="props.data.data"
      dataKey="id"
      :paginator="false"
      scrollable
      scrollHeight="400px"
      :loading="loading"
      :rows="10"
      class="expense-category-table"
    >
      <template #header>
        <div class="flex flex-col sm:flex-row gap-3 sm:gap-2 items-start sm:items-center justify-between p-2">
          <h4 class="m-0 text-lg font-semibold text-gray-800">{{ $t("manage") + " " + $t(title) }}</h4>
          <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <ToggleButton
              :value="sort"
              off-label="z-a"
              on-label="a-z"
              onIcon="pi pi-sort-alpha-down"
              offIcon="pi pi-sort-alpha-down-alt"
              class="w-full sm:w-auto"
              @update:value="(val: sortType) => emit('onChangeSort', { sort: val })"
            />
            <ToggleButton
              v-model="toggleDeleted"
              @update:modelValue="(val: boolean) => {
                emit('onChangeActive', { deleted: val });
              }"
              onIcon="pi pi-trash"
              :off-label="$t('active')"
              :on-label="$t('inactive')"
              offIcon="pi pi-check"
              class="w-full sm:w-auto"
            />
            <Select
              v-model="selectedActiveFilter"
              :options="activeFilterOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="$t('expense_categories.status.label')"
              :showClear="true"
              @update:modelValue="(value) => emit('onFilterActiveStatus', value ?? 'all')"
              class="w-full sm:w-44"
            />
            <div class="flex gap-2 w-full sm:w-auto">
              <IconField class="flex-1 sm:flex-initial">
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText
                  v-model="search"
                  :placeholder="$t('search') + '...'"
                  class="w-full"
                  @keydown.enter="emit('onSearch', search)"
                />
              </IconField>
              <Button 
                icon="pi pi-search" 
                @click="emit('onSearch', search)"
                class="bg-blue-600 hover:bg-blue-700 border-blue-600"
              />
            </div>
          </div>
        </div>
      </template>

    <Column selectionMode="multiple" headerStyle="width: 3rem" />
    <Column header="#" headerStyle="width: 3rem">
      <template #body="slotProps">
        {{ slotProps.index + 1 }}
      </template>
    </Column>
    <Column
      field="name"
      style="min-width: 200px"
      :header="$t('branches.fields.name')"
      sortable
      frozen
    />
    <Column
      field="code"
      style="min-width: 120px"
      :header="$t('branches.fields.code')"
      sortable
    >
      <template #body="{ data }">
        {{ data.code || "-" }}
      </template>
    </Column>
    <Column
      field="description"
      style="min-width: 250px"
      :header="$t('branches.fields.description')"
    >
      <template #body="{ data }">
        {{ data.description || "-" }}
      </template>
    </Column>
    <Column
      field="is_active"
      style="min-width: 120px"
      :header="$t('status')"
      sortable
    >
      <template #body="{ data }">
        <Tag
          :severity="data.is_active ? 'success' : 'danger'"
          :value="data.is_active ? $t('active') : $t('inactive')"
        />
      </template>
    </Column>
    <Column
      field="createdAt"
      style="min-width: 180px"
      :header="$t('createdAt')"
      sortable
    />
    <Column
      field="updatedAt"
      style="min-width: 180px"
      :header="$t('updatedAt')"
      sortable
    />
    <Column
      field="deletedAt"
      style="min-width: 180px"
      :header="$t('deletedAt')"
      sortable
    >
      <template #body="{ data }">
        {{ data.deletedAt || "-" }}
      </template>
    </Column>
      <Column :exportable="false" frozen alignFrozen="right">
        <template #body="slotProps">
          <div class="flex flex-row gap-2">
            <Button
              v-if="!slotProps.data.deletedAt"
              :icon="slotProps.data.is_active ? 'pi pi-check-circle' : 'pi pi-times-circle'"
              outlined
              rounded
              :severity="slotProps.data.is_active ? 'success' : 'warning'"
              v-tooltip.top="slotProps.data.is_active ? $t('deactivate') : $t('activate')"
              @click="emit('onToggleStatus', slotProps.data)"
            />
            <Button
              v-if="!slotProps.data.deletedAt"
              icon="pi pi-pencil"
              outlined
              rounded
              @click="emit('onEdit', slotProps.data)"
            />
            <Button
              v-if="!slotProps.data.deletedAt"
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="emit('onDelete', slotProps.data)"
            />
            <template v-else>
              <Button
                icon="pi pi-replay"
                outlined
                rounded
                severity="success"
                v-tooltip.top="$t('restore')"
                @click="emit('onRestore', slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                outlined
                rounded
                severity="danger"
                v-tooltip.top="$t('hardDelete')"
                @click="emit('onHardDelete', slotProps.data)"
              />
            </template>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>

  <!-- Mobile Card View -->
  <div class="md:hidden">
    <!-- Mobile Header -->
    <div class="bg-white p-4 rounded-lg shadow-sm mb-4">
      <h4 class="text-lg font-semibold text-gray-800 mb-3">{{ $t("manage") + " " + $t(title) }}</h4>
      
      <!-- Filters -->
      <div class="flex flex-col gap-2">
        <div class="flex gap-2">
          <ToggleButton
            :value="sort"
            @update:value="emit('update:sort', $event)"
            off-label="z-a"
            on-label="a-z"
            onIcon="pi pi-sort-alpha-down"
            offIcon="pi pi-sort-alpha-down-alt"
            class="flex-1"
            @change="
              emit('onChangeSort', {
                sort: sort === sortType.DESC ? sortType.ASC : sortType.DESC,
              })
            "
          />
          <ToggleButton
            v-model="toggleDeleted"
            @update:modelValue="(val: boolean) => {
              emit('onChangeActive', { deleted: val });
            }"
            onIcon="pi pi-trash"
            :off-label="$t('active')"
            :on-label="$t('inactive')"
            offIcon="pi pi-check"
            class="flex-1"
          />
        </div>
        <Select
          v-model="selectedActiveFilter"
          :options="activeFilterOptions"
          optionLabel="label"
          optionValue="value"
          :placeholder="$t('expense_categories.status.label')"
          :showClear="true"
          @update:modelValue="(value) => emit('onFilterActiveStatus', value ?? 'all')"
          class="w-full"
        />
        <div class="flex gap-2">
          <IconField class="flex-1">
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText
              v-model="search"
              :placeholder="$t('search') + '...'"
              class="w-full"
              @keydown.enter="emit('onSearch', search)"
            />
          </IconField>
          <Button 
            icon="pi pi-search" 
            @click="emit('onSearch', search)"
            class="bg-blue-600 hover:bg-blue-700 border-blue-600"
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <i class="pi pi-spin pi-spinner text-blue-600 text-3xl"></i>
    </div>

    <!-- Mobile Cards -->
    <div v-else class="space-y-3">
      <div
        v-for="(item, index) in props.data.data"
        :key="item.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
      >
        <!-- Header with selection and status -->
        <div class="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <Checkbox
              :modelValue="selection.some(s => s.id === item.id)"
              @update:modelValue="toggleSelection(item)"
              :binary="true"
            />
            <span class="text-sm font-semibold text-gray-500">#{{ index + 1 }}</span>
          </div>
          <Tag
            :severity="item.is_active ? 'success' : 'danger'"
            :value="item.is_active ? $t('active') : $t('inactive')"
            class="text-xs"
          />
        </div>

        <!-- Category Name -->
        <div class="mb-3">
          <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
            <i class="pi pi-tag text-blue-600 text-sm"></i>
            {{ item.name }}
          </h3>
        </div>

        <!-- Details Grid -->
        <div class="space-y-2 mb-4">
          <!-- Code -->
          <div v-if="item.code" class="flex items-center gap-2">
            <i class="pi pi-hashtag text-gray-400 text-xs shrink-0"></i>
            <div class="flex-1">
              <span class="text-xs text-gray-500 block">{{ $t('branches.fields.code') }}</span>
              <span class="text-sm text-gray-700">{{ item.code }}</span>
            </div>
          </div>

          <!-- Description -->
          <div v-if="item.description" class="flex items-start gap-2">
            <i class="pi pi-align-left text-gray-400 text-xs mt-1 shrink-0"></i>
            <div class="flex-1">
              <span class="text-xs text-gray-500 block">{{ $t('branches.fields.description') }}</span>
              <span class="text-sm text-gray-700">{{ item.description }}</span>
            </div>
          </div>

          <!-- Timestamps -->
          <div class="pt-2 border-t border-gray-100">
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span class="text-gray-500 block">{{ $t('createdAt') }}</span>
                <span class="text-gray-700">{{ item.createdAt }}</span>
              </div>
              <div>
                <span class="text-gray-500 block">{{ $t('updatedAt') }}</span>
                <span class="text-gray-700">{{ item.updatedAt }}</span>
              </div>
            </div>
            <div v-if="item.deletedAt" class="mt-2">
              <span class="text-gray-500 block">{{ $t('deletedAt') }}</span>
              <span class="text-red-600">{{ item.deletedAt }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 pt-3 border-t border-gray-200">
          <template v-if="!item.deletedAt">
            <Button
              :icon="item.is_active ? 'pi pi-check-circle' : 'pi pi-times-circle'"
              :label="item.is_active ? $t('deactivate') : $t('activate')"
              outlined
              size="small"
              :severity="item.is_active ? 'success' : 'warning'"
              class="flex-1 text-xs"
              @click="emit('onToggleStatus', item)"
            />
            <Button
              icon="pi pi-pencil"
              outlined
              size="small"
              class="text-xs"
              @click="emit('onEdit', item)"
            />
            <Button
              icon="pi pi-trash"
              outlined
              size="small"
              severity="danger"
              class="text-xs"
              @click="emit('onDelete', item)"
            />
          </template>
          <template v-else>
            <Button
              icon="pi pi-replay"
              :label="$t('restore')"
              outlined
              size="small"
              severity="success"
              class="flex-1 text-xs"
              @click="emit('onRestore', item)"
            />
            <Button
              icon="pi pi-trash"
              :label="$t('hardDelete')"
              outlined
              size="small"
              severity="danger"
              class="flex-1 text-xs"
              @click="emit('onHardDelete', item)"
            />
          </template>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="props.data.data.length === 0" class="text-center py-8">
        <i class="pi pi-inbox text-gray-300 text-5xl mb-3"></i>
        <p class="text-gray-500">No data available</p>
      </div>
    </div>
  </div>  <Paginator
    :first="(query.page! - 1) * query.limit!"
    :rows="query.limit"
    :totalRecords="data.pagination.total"
    :rowsPerPageOptions="[5, 10, 20, 30]"
    @page="emit('onChangePage', { page: $event.page + 1, limit: $event.rows })"
  />
</template>

<script setup lang="ts">
import type { IExpenseCategoryEntity } from "~/types/entities/expense-category.entity";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import { sortType, Status } from "~/types/enum/paginate.enum";
import type { IFindExpenseCategoryDto } from "~/types/dto/find-expense-category.dto";
import {useI18n} from "vue-i18n";

const { t } = useI18n();
const search = ref("");
// Matches backend `status` filter: 'active' | 'inactive' | 'all'
const selectedActiveFilter = ref<'active' | 'inactive' | 'all' | null>(null);
// Toggle for soft-delete filter: false = active records, true = deleted records
const toggleDeleted = ref<boolean>(false);

const props = defineProps<{
  data: PaginatedResponse<IExpenseCategoryEntity>;
  value: IExpenseCategoryEntity[];
  title: string;
  loading: boolean;
  sort?: sortType;
  query: IFindExpenseCategoryDto;
}>();

const emit = defineEmits([
  "update:value",
  "update:sort",
  "update:checked",
  "onChangeSort",
  "onChangeActive",
  "onChangePage",
  "onSearch",
  "onFilterActiveStatus",
  "onEdit",
  "onDelete",
  "onRestore",
  "onToggleStatus",
  "onHardDelete",
]);

const selection = ref<IExpenseCategoryEntity[]>(props.value);

const activeFilterOptions = [
  { label: t("expense_categories.status.active"), value: 'active' },
  { label: t("expense_categories.status.inactive"), value: 'inactive' },
  { label: t("expense_categories.status.all"), value: 'all' },
];

const toggleSelection = (item: IExpenseCategoryEntity) => {
  const index = selection.value.findIndex(s => s.id === item.id);
  if (index > -1) {
    selection.value.splice(index, 1);
  } else {
    selection.value.push(item);
  }
};

watch(selection, (val) => {
  emit("update:value", val);
});

// Initialize filter from query using `status`
watch(() => props.query.status, (val) => {
  selectedActiveFilter.value = val === undefined ? null : val;
}, { immediate: true });

// Initialize toggleDeleted from query
watch(() => props.query.deleted, (val) => {
  toggleDeleted.value = val === 'true';
}, { immediate: true });
</script>

<style scoped>
.expense-category-table {
  font-size: 14px;
}
</style>
