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
          <Select
            v-model="statusFilter"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            :placeholder="$t('status')"
            class="w-40"
            @change="emit('onChangeStatus', statusFilter)"
          />
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
      field="name"
      style="min-width: 200px"
      :header="$t('branches.fields.name')"
      sortable
      frozen
    />
    <Column
      field="address"
      style="min-width: 250px"
      :header="$t('branches.fields.address')"
      sortable
    >
      <template #body="{ data }">
        {{ data.address || "-" }}
      </template>
    </Column>
    <Column
      field="village"
      style="min-width: 200px"
      :header="$t('village')"
      sortable
    >
      <template #body="{ data }">
        <span v-if="data.full_address">
          {{ data.full_address.village_name }},
          {{ data.full_address.district_name }},
          {{ data.full_address.province_name }}
        </span>
        <span v-else-if="data.village">
          {{ (data.village.name_en || data.village.name) }},
          {{ (data.village.district?.name_en || data.village.district?.name) }},
          {{ (data.village.district?.province?.name_en || data.village.district?.province?.name) }}
        </span>
        <span v-else>
          {{ console.log('Branch data:', data) }}
          -
        </span>
      </template>
    </Column>
    <Column
      field="phone"
      style="min-width: 150px"
      :header="$t('branches.fields.phone')"
      sortable
    >
      <template #body="{ data }">
        {{ data.phone || "-" }}
      </template>
    </Column>
    <Column
      field="wallet_balance"
      style="min-width: 150px"
      :header="$t('branches.fields.wallet_balance')"
      sortable
    >
      <template #body="{ data }">
        {{ data.wallet_balance?.toLocaleString() }}
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

  <Paginator
    :first="(query.page! - 1) * query.limit!"
    :rows="query.limit"
    :totalRecords="data.pagination.total"
    :rowsPerPageOptions="[5, 10, 20, 30]"
    @page="emit('onChangePage', { page: $event.page + 1, limit: $event.rows })"
  />
</template>

<script setup lang="ts">
import type { IBranchEntity } from "~/types/entities/branch.entity";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import { sortType, Status } from "~/types/enum/paginate.enum";
import type { IPaginateDto } from "~/types/dto/paginate.dto";

const { t } = useI18n();
const search = ref("");
const statusFilter = ref("all");

const statusOptions = [
  { label: t("active"), value: "active" },
  { label: t("inactive"), value: "inactive" },
  { label: t("all"), value: "all" },
];

const props = defineProps<{
  data: PaginatedResponse<IBranchEntity>;
  value: IBranchEntity[];
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
  "onChangeStatus",
  "onChangePage",
  "onSearch",
  "onEdit",
  "onDelete",
  "onRestore",
  "onToggleStatus",
  "onHardDelete",
]);

const selection = ref<IBranchEntity[]>(props.value);

watch(selection, (val) => {
  emit("update:value", val);
});
</script>

<style scoped></style>
