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
          <!-- SORT -->
          <ToggleButton
            :value="sort"
            @update:value="emit('update:sort', $event)"
                        off-label="z-a"
            on-label="a-z"
            onIcon="pi pi-sort-alpha-down"
            offIcon="pi pi-sort-alpha-down-alt"
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
    <Column selectionMode="multiple" headerStyle="width: 3rem" />

    <!-- Index -->
    <Column header="#" headerStyle="width: 3rem">
      <template #body="slotProps">
        {{ slotProps.index + 1 }}
      </template>
    </Column>

    <!-- Name -->
    <Column
      field="name"
      style="min-width: 150px"
      :header="$t('name')"
      sortable
      frozen
    />

    <!-- Parent -->
    <Column
      style="min-width: 180px"
      :header="$t('parent')"
      sortable
    >
      <template #body="{ data }">
        {{ data.parent || "-" }}
      </template>
    </Column>

    <!-- Children count -->
    <Column
      style="min-width: 120px"
      :header="$t('children')"
      sortable
    >
      <template #body="{ data }">
        {{ data.children?.length || 0 }}
      </template>
    </Column>

    <!-- Active status -->
    <Column
      style="min-width: 120px"
      field="is_active"
      :header="$t('status')"
    >
      <template #body="{ data }">
        <Tag
          :value="data.is_active ? $t('active') : $t('inactive')"
          :severity="data.is_active ? 'success' : 'danger'"
        />
      </template>
    </Column>

    <!-- Dates -->
    <Column
      field="createdAt"
      style="min-width: 150px"
      :header="$t('createdAt')"
      sortable
    />

    <Column
      field="updatedAt"
      style="min-width: 150px"
      :header="$t('updatedAt')"
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

    <!-- Actions -->
    <Column frozen alignFrozen="right" :exportable="false">
      <template #body="{ data }">
        <div class="flex gap-2">
          <Button
            icon="pi pi-pencil"
            outlined
            rounded
            @click="emit('onEdit', data)"
          />
          <Button
            icon="pi pi-trash"
            outlined
            rounded
            severity="danger"
            @click="emit('onDelete', data)"
          />
        </div>
      </template>
    </Column>
  </DataTable>

  <!-- Pagination -->
  <Paginator
    :first="(query.page! - 1) * query.limit!"
    :rows="query.limit"
    :totalRecords="data.pagination.total"
    :rowsPerPageOptions="[5, 10, 20, 30]"
    @page="emit('onChangePage', { page: $event.page + 1, limit: $event.rows })"
  />
</template>

<script setup lang="ts">
import { sortType, Status } from "~/types/enum/paginate.enum";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import type { ICategoryEntity } from "~/types/entities/category.entity";

const search = ref("");

const props = defineProps<{
  data: PaginatedResponse<ICategoryEntity>;
  value: ICategoryEntity[];
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

const selection = ref<ICategoryEntity[]>(props.value);

watch(selection, (val) => {
  emit("update:value", val);
});
</script>

<style scoped></style>
