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
        <div class="flex gap-2">
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
            data.transaction_type === 'DEPOSIT' || data.transaction_type === 'CREDIT'
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
        {{ data.reference_type || "-" }}
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
        <div class="flex flex-row gap-2">
          <Button
            icon="pi pi-eye"
            outlined
            rounded
            @click="emit('onView', slotProps.data)"
          />
        </div>
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
import type { IPaginateDto } from "~/types/dto/paginate.dto";

const search = ref("");
const props = defineProps<{
  data: PaginatedResponse<IWalletTransactionEntity>;
  value: IWalletTransactionEntity[];
  title: string;
  loading: boolean;
  query: IPaginateDto;
}>();

const emit = defineEmits([
  "update:value",
  "onChangePage",
  "onSearch",
  "onView",
]);

const selection = ref<IWalletTransactionEntity[]>(props.value);

watch(selection, (val) => {
  emit("update:value", val);
});
</script>

<style scoped></style>
