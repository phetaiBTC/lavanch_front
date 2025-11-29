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
    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} variants"
  >
    <template #header>
      <div class="flex flex-wrap gap-2 items-center justify-between">
        <h4 class="m-0">{{ $t("manage") + " " + $t(title) }}</h4>
        <div class="flex gap-2">
          <ToggleButton
            :value="sort"
            @update:value="emit('update:sort', $event)"
            onIcon="pi pi-sort-alpha-down"
            off-label="z-a"
            on-label="a-z"
            offIcon="pi pi-sort-alpha-down-alt"
            aria-label="Toggle Sort"
            @change="
              emit('onChangeSort', {
                sort: sort === sortType.DESC ? sortType.ASC : sortType.DESC,
              })
            "
          />
          <ToggleButton
            :value="checked"
            @update:value="emit('update:checked', $event)"
            onIcon="pi pi-trash"
            :off-label="$t('active')"
            :on-label="$t('inactive')"
            offIcon="pi pi-check"
            aria-label="Toggle Active"
            @change="
              emit('onChangeActive', {
                is_active:
                  checked === Status.INACTIVE ? Status.ACTIVE : Status.INACTIVE,
              })
            "
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

    <!-- Selection -->
    <Column selectionMode="multiple" headerStyle="width: 3rem" />

    <!-- Index -->
    <Column header="#" headerStyle="width:3rem">
      <template #body="slotProps">
        {{ slotProps.index + 1 }}
      </template>
    </Column>

    <!-- Name -->
    <Column
      field="name"
      :header="$t('name')"
      :sortable="true"
      style="min-width: 150px"
    />

    <!-- SKU -->
    <Column
      field="sku"
      :header="$t('sku')"
      :sortable="true"
      style="min-width: 150px"
    />

    <!-- Barcode -->
    <Column
      field="barcode"
      :header="$t('barcode')"
      :sortable="true"
      style="min-width: 150px"
    />

    <!-- Product -->
    <Column :header="$t('product')" style="min-width: 180px">
      <template #body="{ data }">
        {{ data.product?.name || "-" }}
      </template>
    </Column>

    <!-- Active Status -->
    <Column field="is_active" :header="$t('status')" style="min-width: 120px">
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
      :header="$t('createdAt')"
      :sortable="true"
      style="min-width: 150px"
    />
    <Column
      field="updatedAt"
      :header="$t('updatedAt')"
      :sortable="true"
      style="min-width: 150px"
    />
    <Column
      field="deletedAt"
      :header="$t('deletedAt')"
      :sortable="true"
      style="min-width: 150px"
    >
      <template #body="{ data }">
        {{ data.deletedAt || "-" }}
      </template>
    </Column>

    <!-- Actions -->
    <Column frozen alignFrozen="right" :exportable="false">
      <template #body="{ data }">
        <div class="flex flex-row gap-2">
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
    :rowsPerPageOptions="[1, 5, 10, 20, 30]"
    @page="emit('onChangePage', { page: $event.page + 1, limit: $event.rows })"
  />
</template>

<script setup lang="ts">
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import { sortType, Status } from "~/types/enum/paginate.enum";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import type { IProductVariantEntity } from "~/types/entities/product-variants.entity";

const search = ref("");

const props = defineProps<{
  data: PaginatedResponse<IProductVariantEntity>;
  value: IProductVariantEntity[];
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

const selection = ref<IProductVariantEntity[]>(props.value);

watch(selection, (val) => {
  emit("update:value", val);
});
</script>

<style scoped></style>
