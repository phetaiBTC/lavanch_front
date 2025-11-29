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
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rowsPerPageOptions="[5, 10, 25]"
    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} points"
  >
    <template #header>
      <div class="flex flex-wrap gap-2 items-center justify-between">
        <h4 class="m-0">{{ $t("manage") + " " + $t(title) }}</h4>
        <div class="flex gap-2">
          <!-- SORT -->
          <ToggleButton
            :value="sort"
            @update:value="emit('update:sort', $event)"
            onIcon="pi pi-sort-alpha-down"
            off-label="z-a"
            on-label="a-z"
            offIcon="pi pi-sort-alpha-down-alt"
            aria-label="Toggle Status"
            @change="
              emit('onChangeSort', {
                sort: sort === sortType.DESC ? sortType.ASC : sortType.DESC,
              })
            "
          />
          <!-- ACTIVE / INACTIVE -->
          <ToggleButton
            :value="checked"
            @update:value="emit('update:checked', $event)"
            onIcon="pi pi-trash"
            :off-label="$t('active')"
            :on-label="$t('inactive')"
            offIcon="pi pi-check"
            aria-label="Toggle Status"
            @change="
              emit('onChangeActive', {
                is_active:
                  checked === Status.INACTIVE ? Status.ACTIVE : Status.INACTIVE,
              })
            "
          />

          <!-- SEARCH -->
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

    <!-- Check selection -->
    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
    
    <!-- Index -->
    <Column header="#" headerStyle="width:3rem">
      <template #body="slotProps">
        {{ slotProps.index + 1 }}
      </template>
    </Column>

    <!-- Name -->
    <Column
      style="min-width: 150px"
      field="name"
      frozen
      :header="$t('name')"
      :sortable="true"
    ></Column>

    <!-- Points multiplier -->
    <Column
      style="min-width: 150px"
      field="points_multiplier"
      :header="$t('points_multiplier')"
      :sortable="true"
    ></Column>

    <!-- Name code -->
    <Column
      style="min-width: 150px"
      field="name_code"
      :header="$t('name_code')"
      :sortable="true"
    >
      <template #body="{ data }">
        <Tag
          icon="pi pi-check"
          :severity="data.name_code ? 'success' : 'danger'"
          :value="data.name_code"
        />
      </template>
    </Column>


    <!-- Dates -->
    <Column
      field="createdAt"
      style="min-width: 150px"
      :header="$t('createdAt')"
      :sortable="true"
    />
    <Column
      field="updatedAt"
      style="min-width: 150px"
      :header="$t('updatedAt')"
      :sortable="true"
    />
    <Column
      field="deletedAt"
      style="min-width: 150px"
      :header="$t('deletedAt')"
      :sortable="true"
    >
      <template #body="{ data }">{{ data.deletedAt || "-" }}</template>
    </Column>

    <!-- Actions -->
    <Column :exportable="false" frozen alignFrozen="right">
      <template #body="slotProps">
        <div class="flex flex-row gap-2">
          <Button icon="pi pi-pencil" outlined rounded @click="emit('onEdit', slotProps.data)" />
          <Button icon="pi pi-trash" outlined rounded severity="danger" @click="emit('onDelete', slotProps.data)" />
        </div>
      </template>
    </Column>
  </DataTable>

  <Paginator
    :first="(query.page! - 1) * query.limit!"
    :rows="query.limit"
    :totalRecords="data.pagination.total"
    :rowsPerPageOptions="[1, 5, 10, 20, 30]"
    @page="emit('onChangePage', { page: $event.page + 1, limit: $event.rows })"
  />
</template>

<script setup lang="ts">
import type { IPointEntity } from "~/types/entities/point.entity";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import { sortType, Status } from "~/types/enum/paginate.enum";
import type { IPaginateDto } from "~/types/dto/paginate.dto";

const search = ref("");

const props = defineProps<{
  data: PaginatedResponse<IPointEntity>;
  value: IPointEntity[];
  title: string;
  loading: boolean;
  sort?: sortType;
  checked?: Status;
  query: IPaginateDto;
}>();

const emit = defineEmits([
  "update:value",
  "update:sort",
  "update:checked",
  "onChangeSort",
  "onChangeActive",
  "onChangePage",
  "onSearch",
  "onEdit",
  "onDelete",
]);

const selection = ref<IPointEntity[]>(props.value);

watch(selection, (val) => {
  emit("update:value", val);
});
</script>

<style scoped></style>
