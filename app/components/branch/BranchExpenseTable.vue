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
      class="branch-expense-table"
    >
      <template #header>
        <div class="flex flex-col gap-3 p-2">
          <h4 class="m-0 text-lg font-semibold text-gray-800">{{ $t("manage") + " " + $t(title) }}</h4>
          
          <!-- Filters Row -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <!-- Status Filter -->
            <Select
              v-model="statusFilter"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="$t('status')"
              @change="handleFilterChange"
            />
            
            <!-- Branch Name Search -->
            <InputText
              v-model="branchNameFilter"
              :placeholder="$t('branches.fields.name')"
              @keydown.enter="handleFilterChange"
            />
            
            <!-- Category Filter -->
            <Select
              v-model="categoryFilter"
              :options="categoryOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="$t('branchExpenses.fields.category')"
              @change="handleFilterChange"
            />
            
            <!-- Date Range From -->
            <Calendar
              v-model="dateFrom"
              :placeholder="$t('date_from')"
              dateFormat="yy-mm-dd"
              @date-select="handleFilterChange"
            />
            
            <!-- Date Range To -->
            <Calendar
              v-model="dateTo"
              :placeholder="$t('date_to')"
              dateFormat="yy-mm-dd"
              @date-select="handleFilterChange"
            />
            
            <!-- Search -->
            <div class="flex gap-2">
              <IconField class="flex-1">
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText
                  v-model="search"
                  :placeholder="$t('search') + '...'"
                  @keydown.enter="emit('onSearch', search)"
                />
              </IconField>
              <Button 
                icon="pi pi-search" 
                @click="emit('onSearch', search)"
                class="bg-blue-600 hover:bg-blue-700 border-blue-600"
              />
            </div>
            
            <!-- Clear Filters -->
            <Button
              icon="pi pi-filter-slash"
              :label="$t('clear_filters')"
              outlined
              @click="clearFilters"
            />
          </div>
        </div>
      </template>

      <Column selectionMode="multiple" headerStyle="width: 3rem" />
      <Column header="#" headerStyle="width: 3rem">
        <template #body="slotProps">
          {{ (query.page - 1) * query.limit + slotProps.index + 1 }}
        </template>
      </Column>
      
      <Column
        field="expense_no"
        style="min-width: 150px"
        :header="$t('branchExpenses.fields.expense_no')"
        sortable
        frozen
      />
      
      <Column
        field="branch"
        style="min-width: 200px"
        :header="$t('branches.fields.name')"
        sortable
      >
        <template #body="{ data }">
          {{ data.branch?.name || '-' }}
        </template>
      </Column>
      
      <Column
        field="expense_category"
        style="min-width: 180px"
        :header="$t('branchExpenses.fields.category')"
        sortable
      >
        <template #body="{ data }">
          {{ data.expense_category?.name || '-' }}
        </template>
      </Column>
      
      <Column
        field="amount"
        style="min-width: 150px"
        :header="$t('branchExpenses.fields.amount')"
        sortable
      >
        <template #body="{ data }">
          <span class="font-semibold">{{ formatCurrency(data.amount) }}</span>
        </template>
      </Column>
      
      <Column
        field="expense_date"
        style="min-width: 150px"
        :header="$t('branchExpenses.fields.expense_date')"
        sortable
      />
      
      <Column
        field="description"
        style="min-width: 250px"
        :header="$t('branchExpenses.fields.description')"
      >
        <template #body="{ data }">
          {{ data.description || '-' }}
        </template>
      </Column>
      
      <Column
        field="status"
        style="min-width: 120px"
        :header="$t('status')"
        sortable
      >
        <template #body="{ data }">
          <Tag
            :severity="getStatusSeverity(data.status)"
            :value="data.status"
          />
        </template>
      </Column>
      
      <Column
        field="createdAt"
        style="min-width: 180px"
        :header="$t('createdAt')"
        sortable
      />
      
      <Column :exportable="false" frozen alignFrozen="right">
        <template #body="slotProps">
          <div class="flex flex-row gap-2">
            <Button
              icon="pi pi-eye"
              outlined
              rounded
              class="text-blue-600 border-blue-600 hover:bg-blue-50"
              @click="emit('onView', slotProps.data)"
            />
            <Button
              v-if="slotProps.data.status === 'PENDING'"
              icon="pi pi-check"
              outlined
              rounded
              class="text-green-600 border-green-600 hover:bg-green-50"
              @click="emit('onApprove', slotProps.data)"
            />
            <Button
              v-if="slotProps.data.status === 'PENDING'"
              icon="pi pi-times"
              outlined
              rounded
              class="text-red-600 border-red-600 hover:bg-red-50"
              @click="emit('onReject', slotProps.data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>

  <!-- Mobile Card View -->
  <div class="md:hidden">
    <div class="mb-4 space-y-3">
      <h4 class="text-lg font-semibold text-gray-800">{{ $t("manage") + " " + $t(title) }}</h4>
      
      <!-- Mobile Filters -->
      <Select
        v-model="statusFilter"
        :options="statusOptions"
        optionLabel="label"
        optionValue="value"
        :placeholder="$t('status')"
        class="w-full"
        @change="handleFilterChange"
      />
      
      <InputText
        v-model="branchNameFilter"
        :placeholder="$t('branches.fields.name')"
        class="w-full"
        @keydown.enter="handleFilterChange"
      />
      
      <Select
        v-model="categoryFilter"
        :options="categoryOptions"
        optionLabel="label"
        optionValue="value"
        :placeholder="$t('branchExpenses.fields.category')"
        class="w-full"
        @change="handleFilterChange"
      />
      
      <div class="grid grid-cols-2 gap-2">
        <Calendar
          v-model="dateFrom"
          :placeholder="$t('date_from')"
          dateFormat="yy-mm-dd"
          class="w-full"
          @date-select="handleFilterChange"
        />
        <Calendar
          v-model="dateTo"
          :placeholder="$t('date_to')"
          dateFormat="yy-mm-dd"
          class="w-full"
          @date-select="handleFilterChange"
        />
      </div>
      
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
      
      <Button
        icon="pi pi-filter-slash"
        :label="$t('clear_filters')"
        outlined
        class="w-full"
        @click="clearFilters"
      />
    </div>

    <!-- Mobile Cards -->
    <div v-if="props.data.data && props.data.data.length > 0" class="space-y-3">
      <div
        v-for="(item, index) in props.data.data"
        :key="item.id"
        class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
      >
        <!-- Card Header -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-2">
            <Checkbox
              :model-value="selection.some((s: any) => s.id === item.id)"
              @update:model-value="toggleSelection(item)"
              binary
            />
            <span class="text-sm text-gray-500">#{{ (query.page - 1) * query.limit + index + 1 }}</span>
          </div>
          <Tag
            :severity="getStatusSeverity(item.status)"
            :value="item.status"
          />
        </div>

        <!-- Card Content -->
        <div class="space-y-2 text-sm">
          <div class="flex items-start gap-2">
            <i class="pi pi-hashtag text-blue-600 mt-0.5"></i>
            <div class="flex-1">
              <div class="text-gray-500 text-xs">{{ $t('branchExpenses.fields.expense_no') }}</div>
              <div class="font-semibold">{{ item.expense_no }}</div>
            </div>
          </div>
          
          <div class="flex items-start gap-2">
            <i class="pi pi-building text-blue-600 mt-0.5"></i>
            <div class="flex-1">
              <div class="text-gray-500 text-xs">{{ $t('branches.fields.name') }}</div>
              <div>{{ item.branch?.name || '-' }}</div>
            </div>
          </div>
          
          <div class="flex items-start gap-2">
            <i class="pi pi-tag text-blue-600 mt-0.5"></i>
            <div class="flex-1">
              <div class="text-gray-500 text-xs">{{ $t('branchExpenses.fields.category') }}</div>
              <div>{{ item.expense_category?.name || '-' }}</div>
            </div>
          </div>
          
          <div class="flex items-start gap-2">
            <i class="pi pi-wallet text-blue-600 mt-0.5"></i>
            <div class="flex-1">
              <div class="text-gray-500 text-xs">{{ $t('branchExpenses.fields.amount') }}</div>
              <div class="font-semibold text-lg text-blue-600">{{ formatCurrency(item.amount) }}</div>
            </div>
          </div>
          
          <div class="flex items-start gap-2">
            <i class="pi pi-calendar text-blue-600 mt-0.5"></i>
            <div class="flex-1">
              <div class="text-gray-500 text-xs">{{ $t('branchExpenses.fields.expense_date') }}</div>
              <div>{{ item.expense_date }}</div>
            </div>
          </div>
          
          <div v-if="item.description" class="flex items-start gap-2">
            <i class="pi pi-align-left text-blue-600 mt-0.5"></i>
            <div class="flex-1">
              <div class="text-gray-500 text-xs">{{ $t('branchExpenses.fields.description') }}</div>
              <div class="text-gray-700">{{ item.description }}</div>
            </div>
          </div>
          
          <div class="flex items-start gap-2">
            <i class="pi pi-clock text-blue-600 mt-0.5"></i>
            <div class="flex-1">
              <div class="text-gray-500 text-xs">{{ $t('createdAt') }}</div>
              <div>{{ item.createdAt }}</div>
            </div>
          </div>
        </div>

        <!-- Card Actions -->
        <div class="flex gap-2 mt-4 pt-3 border-t border-gray-100">
          <Button
            icon="pi pi-eye"
            :label="$t('view')"
            outlined
            size="small"
            class="flex-1 text-blue-600 border-blue-600"
            @click="emit('onView', item)"
          />
          <Button
            v-if="item.status === 'PENDING'"
            icon="pi pi-check"
            :label="$t('approve')"
            outlined
            size="small"
            class="flex-1 text-green-600 border-green-600"
            @click="emit('onApprove', item)"
          />
          <Button
            v-if="item.status === 'PENDING'"
            icon="pi pi-times"
            :label="$t('reject')"
            outlined
            size="small"
            class="flex-1 text-red-600 border-red-600"
            @click="emit('onReject', item)"
          />
        </div>
      </div>
    </div>
    <div v-else class="text-center py-8 text-gray-500">
      {{ $t('no_data') }}
    </div>
  </div>

  <!-- Pagination -->
  <Paginator
    :rows="query.limit"
    :totalRecords="props.data.pagination.total"
    :rowsPerPageOptions="[5, 10, 20, 30, 50]"
    @page="onPageChange($event)"
    class="mt-4"
  />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import type { IBranchExpenseEntity } from "~/types/entities/branch-expense.entity";
import type { IExpenseCategoryEntity } from "~/types/entities/expense-category.entity";
import { sortType } from "~/types/enum/paginate.enum";

const props = defineProps<{
  title: string;
  loading: boolean;
  data: {
    data: IBranchExpenseEntity[];
    pagination: any;
  };
  query: IPaginateDto;
  categories?: IExpenseCategoryEntity[];
}>();

const selection = defineModel<IBranchExpenseEntity[]>("value", { default: [] });
const emit = defineEmits<{
  onSearch: [value: string];
  onChangePage: [value: { page: number; limit: number }];
  onView: [value: IBranchExpenseEntity];
  onApprove: [value: IBranchExpenseEntity];
  onReject: [value: IBranchExpenseEntity];
  onFilterChange: [filters: any];
}>();

const dt = ref();
const search = ref("");
const statusFilter = ref("ALL");
const branchNameFilter = ref("");
const categoryFilter = ref("");
const dateFrom = ref<Date | null>(null);
const dateTo = ref<Date | null>(null);

const statusOptions = ref([
  { label: "All", value: "ALL" },
  { label: "PENDING", value: "PENDING" },
  { label: "APPROVED", value: "APPROVED" },
  { label: "REJECTED", value: "REJECTED" },
]);

const categoryOptions = computed(() => {
  const categories = props.categories || [];
  return [
    { label: "All Categories", value: "" },
    ...categories.map((cat) => ({ label: cat.name, value: cat.name })),
  ];
});

const formatCurrency = (amount: number) => {
  return `₭ ${amount.toLocaleString()}`;
};

const getStatusSeverity = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'warning';
    case 'APPROVED':
      return 'success';
    case 'REJECTED':
      return 'danger';
    default:
      return 'info';
  }
};

const toggleSelection = (item: IBranchExpenseEntity) => {
  const index = selection.value.findIndex((s: any) => s.id === item.id);
  if (index > -1) {
    selection.value.splice(index, 1);
  } else {
    selection.value.push(item);
  }
};

const handleFilterChange = () => {
  const filters: any = {
    expenseStatus: statusFilter.value,
    branchName: branchNameFilter.value,
    expenseCategoryName: categoryFilter.value,
  };
  
  if (dateFrom.value) {
    filters.createdFrom = dateFrom.value.toISOString().split('T')[0];
  }
  
  if (dateTo.value) {
    filters.createdTo = dateTo.value.toISOString().split('T')[0];
  }
  
  // Remove empty string values
  Object.keys(filters).forEach(key => {
    if (filters[key] === '' || filters[key] === null || filters[key] === undefined) {
      delete filters[key];
    }
  });
  
  emit('onFilterChange', filters);
};

const clearFilters = () => {
  statusFilter.value = "ALL";
  branchNameFilter.value = "";
  categoryFilter.value = "";
  dateFrom.value = null;
  dateTo.value = null;
  search.value = "";
  handleFilterChange();
};

const onPageChange = (event: any) => {
  emit("onChangePage", {
    page: event.page + 1,
    limit: event.rows,
  });
};
</script>

<style scoped>
.branch-expense-table {
  font-size: 14px;
}
</style>
