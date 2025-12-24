<template>
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
  >
    <template #header>
      <div class="flex flex-wrap gap-2 items-center justify-between">
        <h4 class="m-0">{{ $t("manage") + " " + $t(title) }}</h4>
         
 <div>
   <DatePicker
    v-model="dateFrom"
    :placeholder="$t('start_date')"
    dateFormat="yy-mm-dd"
    :showClear="true"
    @update:modelValue="handleDateFromChange"
    class="w-44 rounded-r-none border-r-0"
  />
 </div>
  


 <DatePicker
      v-model="dateTo"
      :placeholder="$t('end_date')"
      dateFormat="yy-mm-dd"
      :showClear="true"
      @update:modelValue="handleDateToChange"
      class="w-44 rounded-l-none"
    />
        <div class="flex flex-wrap gap-2">
            
          <Select
            v-model="selectedBranch"
            :options="branches"
            optionLabel="name"
            optionValue="id"
            :placeholder="$t('branches.fields.branch')"
            :showClear="true"
            @update:modelValue="(value) => emit('onFilterBranch', value)"
            class="w-44"
          />
          <Select
            v-model="selectedTransactionType"
            :options="transactionTypeOptions"
            optionLabel="label"
            optionValue="value"
            :placeholder="$t('branches.fields.transaction_type')"
            :showClear="true"
            @update:modelValue="(value) => emit('onFilterType', value)"
            class="w-48"
          />
          <Select
            v-model="selectedStatus"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            :placeholder="$t('status')"
            :showClear="true"
            @update:modelValue="(value) => emit('onFilterStatus', value)"
            class="w-40"
          />
     
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText
              v-model="search"
              :placeholder="$t('search') + '...'"
              @keydown.enter="emit('onSearch', search)"
            />
          </IconField>
          <Button icon="pi pi-search" @click="emit('onSearch', search)" />
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
      field="transaction_type"
      style="min-width: 150px"
      :header="$t('branches.fields.transaction_type')"
      sortable
      frozen
    >
      <template #body="{ data }">
        <Tag
          :severity="
            data.transaction_type === 'DEPOSIT' || data.transaction_type === 'LOST'
              ? 'success'
              : 'danger'
          "
          :value="$t(`branches.transaction_type.${data.transaction_type.toLowerCase()}`)"
        />
      </template>
    </Column>
    <Column
      field="amount"
      style="min-width: 150px"
      :header="$t('branches.fields.amount')"
      sortable
    >
      <template #body="{ data }">
        {{ data.amount?.toLocaleString() }}
      </template>
    </Column>
    <Column
      field="balance_before"
      style="min-width: 150px"
      :header="$t('branches.fields.balance_before')"
      sortable
    >
      <template #body="{ data }">
        {{ data.balance_before?.toLocaleString() }}
      </template>
    </Column>
    <Column
      field="balance_after"
      style="min-width: 150px"
      :header="$t('branches.fields.balance_after')"
      sortable
    >
      <template #body="{ data }">
        {{ data.balance_after?.toLocaleString() }}
      </template>
    </Column>
    <Column
      field="reference_type"
      style="min-width: 150px"
      :header="$t('branches.fields.reference_type')"
      sortable
    >
      <template #body="{ data }">
        <span v-if="data.reference_type">
          {{ $t(`branches.reference_type.${data.reference_type.toLowerCase()}`) }}
        </span>
        <span v-else>-</span>
      </template>
    </Column>
    <Column
      field="reference_no"
      style="min-width: 150px"
      :header="$t('branches.fields.reference_no')"
      sortable
    >
      <template #body="{ data }">
        {{ data.reference_no || "-" }}
      </template>
    </Column>
    <Column
      field="transaction_date"
      style="min-width: 180px"
      :header="$t('branches.fields.transaction_date')"
      sortable
    />
    <Column
      field="status"
      style="min-width: 120px"
      :header="$t('status')"
      sortable
    >
      <template #body="{ data }">
        <Tag
          :severity="data.status === 'COMPLETED' ? 'success' : 'warning'"
          :value="$t(`branches.status.${data.status.toLowerCase()}`)"
        />
      </template>
    </Column>
    <Column
      field="description"
      style="min-width: 200px"
      :header="$t('branches.fields.description')"
    >
      <template #body="{ data }">
        {{ data.description || "-" }}
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
        <!-- <div class="flex flex-row gap-2"> -->
          <!-- <Button
            icon="pi pi-eye"
            outlined
            rounded
            @click="emit('onView', slotProps.data)"
          />
        </div> -->
      </template>
    </Column>
  </DataTable>

  <Paginator
    :first="(query.page! - 1) * query.limit!"
    :rows="query.limit"
    :totalRecords="data.pagination.total"
    :rowsPerPageOptions="[5, 10, 20, 30]"
    @page="emit('onChangePage', { page: $event.page + 1, limit: $event.rows })"
  />
</template>

<script setup lang="ts">
import type { IWalletTransactionEntity } from "~/types/entities/wallet-transaction.entity";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IFindWalletTransactionDto } from "~/types/dto/find-wallet-transaction.dto";
import { TransactionTypeFilter, TransactionStatusFilter } from "~/types/dto/find-wallet-transaction.dto";
import type { IBranchEntity } from "~/types/entities/branch.entity";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const search = ref("");
const selectedBranch = ref<number | null>(null);
const selectedTransactionType = ref<TransactionTypeFilter | null>(null);
const selectedStatus = ref<TransactionStatusFilter | null>(null);
const dateFrom = ref<Date | null>(null);
const dateTo = ref<Date | null>(null);

const props = defineProps<{
  data: PaginatedResponse<IWalletTransactionEntity>;
  value: IWalletTransactionEntity[];
  title: string;
  loading: boolean;
  query: IFindWalletTransactionDto;
  branches: IBranchEntity[];
}>();

const emit = defineEmits([
  "update:value",
  "onChangePage",
  "onSearch",
  "onView",
  "onFilterBranch",
  "onFilterType",
  "onFilterStatus",
  "onFilterDateFrom",
  "onFilterDateTo",
]);

const selection = ref<IWalletTransactionEntity[]>(props.value);

const transactionTypeOptions = [
  { label: t("transaction_type.deposit"), value: TransactionTypeFilter.DEPOSIT },
  { label: t("transaction_type.withdraw"), value: TransactionTypeFilter.WITHDRAW },
  { label: t("transaction_type.transfer_in"), value: TransactionTypeFilter.TRANSFER_IN },
  { label: t("transaction_type.transfer_out"), value: TransactionTypeFilter.TRANSFER_OUT },
  { label: t("transaction_type.adjustment"), value: TransactionTypeFilter.ADJUSTMENT },
  { label: t("transaction_type.sale"), value: TransactionTypeFilter.SALE },
  { label: t("transaction_type.expense"), value: TransactionTypeFilter.EXPENSE },
  { label: t("transaction_type.found"), value: TransactionTypeFilter.REFUND },
];

const statusOptions = [
  { label: t("walletTransactions.status.pending"), value: TransactionStatusFilter.PENDING },
  { label: t("walletTransactions.status.completed"), value: TransactionStatusFilter.COMPLETED },
  { label: t("walletTransactions.status.cancelled"), value: TransactionStatusFilter.CANCELLED },
];

const formatDate = (date: Date | Date[] | (Date | null)[] | null | undefined): string | null => {
  if (!date || Array.isArray(date)) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const handleDateFromChange = (value: Date | Date[] | (Date | null)[] | null | undefined) => {
  emit('onFilterDateFrom', formatDate(value));
};

const handleDateToChange = (value: Date | Date[] | (Date | null)[] | null | undefined) => {
  emit('onFilterDateTo', formatDate(value));
};

watch(selection, (val) => {
  emit("update:value", val);
});

// Initialize filters from query
watch(() => props.query.branch_id, (val) => {
  selectedBranch.value = val || null;
}, { immediate: true });

watch(() => props.query.transaction_type, (val) => {
  selectedTransactionType.value = val || null;
}, { immediate: true });

watch(() => props.query.transaction_status, (val) => {
  selectedStatus.value = val || null;
}, { immediate: true });

watch(() => props.query.date_from, (val) => {
  dateFrom.value = val ? new Date(val) : null;
}, { immediate: true });

watch(() => props.query.date_to, (val) => {
  dateTo.value = val ? new Date(val) : null;
}, { immediate: true });
</script>

<style scoped></style>
