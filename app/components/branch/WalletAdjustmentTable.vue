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
      field="adjustment_no"
      style="min-width: 150px"
      :header="$t('branches.fields.adjustment_no')"
      sortable
      frozen
    />
    <Column
      field="branch"
      style="min-width: 200px"
      :header="$t('branches.fields.branch')"
      sortable
    >
      <template #body="{ data }">
        {{ data.branch?.name || `Branch #${data.branch_id}` }}
      </template>
    </Column>
    <Column
      field="adjustment_type"
      style="min-width: 150px"
      :header="$t('branches.fields.adjustment_type')"
      sortable
    >
      <template #body="{ data }">
        <Tag
          :severity="data.adjustment_type === 'ADD' ? 'success' : 'danger'"
          :value="$t(`branches.adjustment_type.${data.adjustment_type.toLowerCase()}`)"
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
      field="reason"
      style="min-width: 200px"
      :header="$t('branches.fields.reason')"
    />
    <Column
      field="adjustment_date"
      style="min-width: 150px"
      :header="$t('branches.fields.adjustment_date')"
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
          :severity="
            data.status === 'APPROVED'
              ? 'success'
              : data.status === 'REJECTED'
              ? 'danger'
              : 'warning'
          "
          :value="$t(`branches.status.${data.status.toLowerCase()}`)"
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
            v-if="slotProps.data.status === 'PENDING'"
            icon="pi pi-check"
            outlined
            rounded
            severity="success"
            @click="emit('onApprove', slotProps.data)"
          />
          <Button
            v-if="slotProps.data.status === 'PENDING'"
            icon="pi pi-times"
            outlined
            rounded
            severity="danger"
            @click="emit('onReject', slotProps.data)"
          />
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
import type { IWalletAdjustmentEntity } from "~/types/entities/wallet-adjustment.entity";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IPaginateDto } from "~/types/dto/paginate.dto";

const search = ref("");
const props = defineProps<{
  data: PaginatedResponse<IWalletAdjustmentEntity>;
  value: IWalletAdjustmentEntity[];
  title: string;
  loading: boolean;
  query: IPaginateDto;
}>();

const emit = defineEmits([
  "update:value",
  "onChangePage",
  "onSearch",
  "onView",
  "onApprove",
  "onReject",
]);

const selection = ref<IWalletAdjustmentEntity[]>(props.value);

watch(selection, (val) => {
  emit("update:value", val);
});
</script>

<style scoped></style>
