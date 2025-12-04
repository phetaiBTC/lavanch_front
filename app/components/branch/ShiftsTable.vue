<template>
  <DataTable
    ref="dt"
    v-model:selection="selection"
    :value="props.data.data"
    dataKey="id"
    :paginator="false"
    scrollable
    scrollHeight="300px"
    :loading="loading"
    :rows="5"
  >
    <template #header>
      <div class="flex flex-wrap gap-2 items-center justify-between">
        <h4 class="m-0">{{ $t("branches.shifts.title") }}</h4>
      </div>
    </template>

    <Column header="#" headerStyle="width: 3rem">
      <template #body="slotProps">
        {{ slotProps.index + 1 }}
      </template>
    </Column>
    <Column
      field="start_time"
      style="min-width: 120px"
      :header="$t('branches.fields.start_time')"
      sortable
    />
    <Column
      field="end_time"
      style="min-width: 120px"
      :header="$t('branches.fields.end_time')"
      sortable
    />
    <Column
      field="createdAt"
      style="min-width: 180px"
      :header="$t('createdAt')"
      sortable
    />
    <Column
      field="deletedAt"
      style="min-width: 150px"
      :header="$t('deletedAt')"
      sortable
    >
      <template #body="{ data }">
        {{ data.deletedAt || "-" }}
      </template>
    </Column>
    <Column :exportable="false">
      <template #body="slotProps">
        <div class="flex flex-row gap-2">
          <Button
            icon="pi pi-pencil"
            outlined
            rounded
            size="small"
            @click="emit('onEdit', slotProps.data)"
          />
          <Button
            v-if="!slotProps.data.deletedAt"
            icon="pi pi-trash"
            outlined
            rounded
            size="small"
            severity="danger"
            @click="emit('onDelete', slotProps.data)"
          />
          <Button
            v-else
            icon="pi pi-replay"
            outlined
            rounded
            size="small"
            severity="success"
            @click="emit('onRestore', slotProps.data)"
          />
        </div>
      </template>
    </Column>
  </DataTable>

  <Paginator
    v-if="data.pagination.total > 5"
    :first="(query.page! - 1) * query.limit!"
    :rows="query.limit"
    :totalRecords="data.pagination.total"
    :rowsPerPageOptions="[5, 10, 20]"
    @page="emit('onChangePage', { page: $event.page + 1, limit: $event.rows })"
  />
</template>

<script setup lang="ts">
import type { IShiftsEntity } from "~/types/entities/shifts.entity";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { IPaginateDto } from "~/types/dto/paginate.dto";

const props = defineProps<{
  data: PaginatedResponse<IShiftsEntity>;
  value: IShiftsEntity[];
  loading: boolean;
  query: IPaginateDto;
}>();

const emit = defineEmits([
  "update:value",
  "onChangePage",
  "onEdit",
  "onDelete",
  "onRestore",
]);

const selection = ref<IShiftsEntity[]>(props.value);

watch(selection, (val) => {
  emit("update:value", val);
});
</script>

<style scoped></style>
