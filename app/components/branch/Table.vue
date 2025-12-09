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
      class="branch-table"
    >
      <template #header>
        <div class="flex flex-col sm:flex-row gap-3 sm:gap-2 items-start sm:items-center justify-between p-2">
          <h4 class="m-0 text-lg font-semibold text-gray-800">{{ $t("manage") + " " + $t(title) }}</h4>
          <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Select
              v-model="statusFilter"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="$t('status')"
              class="w-full sm:w-40"
              @update:modelValue="(value) => emit('onChangeStatus', value)"
            />
            <ToggleButton
              :value="sort"
              @update:value="emit('update:sort', $event)"
              off-label="z-a"
              on-label="a-z"
              onIcon="pi pi-sort-alpha-down"
              offIcon="pi pi-sort-alpha-down-alt"
              class="w-full sm:w-auto"
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
              :off-label="$t('inactive')"
              :on-label="$t('active')"
              offIcon="pi pi-check"
              class="w-full sm:w-auto"
              @change="
                emit('onChangeActive', {
                  is_active:
                    checked === Status.INACTIVE ? Status.ACTIVE : Status.INACTIVE,
                })
              "
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
        field="facebook"
        style="min-width: 250px"
        :header="$t('branches.fields.facebook')"
        sortable
      >
        <template #body="{ data }">
          <a class="text-blue-700" :href="data.facebook || '#'" target="_blank">{{ data.facebook || "-" }}</a>
        </template>
      </Column>
      <Column
        field="tiktok"
        style="min-width: 250px"
        :header="$t('branches.fields.tiktok')"
        sortable
      >
        <template #body="{ data }">
          <a class="text-blue-700" :href="data.tiktok || '#'" target="_blank">{{ data.tiktok || "-" }}</a>
        </template>
      </Column>
      <Column
        field="village"
        style="min-width: 200px"
        :header="$t('branches.fields.village')"
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
          <span v-else>-</span>
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
  </div>

  <!-- Mobile Card View -->
  <div class="md:hidden">
    <!-- Mobile Header -->
    <div class="bg-white p-4 rounded-lg shadow-sm mb-4">
      <h4 class="text-lg font-semibold text-gray-800 mb-3">{{ $t("manage") + " " + $t(title) }}</h4>
      
      <!-- Filters -->
      <div class="flex flex-col gap-2">
        <Select
          v-model="statusFilter"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          :placeholder="$t('status')"
          class="w-full"
          @update:modelValue="(value) => emit('onChangeStatus', value)"
        />
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
            :value="checked"
            @update:value="emit('update:checked', $event)"
            onIcon="pi pi-trash"
            :off-label="$t('inactive')"
            :on-label="$t('active')"
            offIcon="pi pi-check"
            class="flex-1"
            @change="
              emit('onChangeActive', {
                is_active:
                  checked === Status.INACTIVE ? Status.ACTIVE : Status.INACTIVE,
              })
            "
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
        <!-- Header with selection and number -->
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

        <!-- Branch Name -->
        <div class="mb-3">
          <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
            <i class="pi pi-building text-blue-600 text-sm"></i>
            {{ item.name }}
          </h3>
        </div>

        <!-- Details Grid -->
        <div class="space-y-2 mb-4">
          <!-- Address -->
          <div v-if="item.address" class="flex items-start gap-2">
            <i class="pi pi-map-marker text-gray-400 text-xs mt-1 flex-shrink-0"></i>
            <div class="flex-1">
              <span class="text-xs text-gray-500 block">{{ $t('branches.fields.address') }}</span>
              <span class="text-sm text-gray-700">{{ item.address }}</span>
            </div>
          </div>

          <!-- Village -->
          <div class="flex items-start gap-2">
            <i class="pi pi-home text-gray-400 text-xs mt-1 flex-shrink-0"></i>
            <div class="flex-1">
              <span class="text-xs text-gray-500 block">{{ $t('village') }}</span>
              <span class="text-sm text-gray-700" v-if="item.full_address">
                {{ item.full_address.village_name }}, {{ item.full_address.district_name }}, {{ item.full_address.province_name }}
              </span>
              <span class="text-sm text-gray-700" v-else-if="item.village">
                {{ (item.village.name_en || item.village.name) }}, {{ (item.village.district?.name_en || item.village.district?.name) }}, {{ (item.village.district?.province?.name_en || item.village.district?.province?.name) }}
              </span>
              <span class="text-sm text-gray-400" v-else>-</span>
            </div>
          </div>

          <!-- Phone -->
          <div v-if="item.phone" class="flex items-center gap-2">
            <i class="pi pi-phone text-gray-400 text-xs flex-shrink-0"></i>
            <div class="flex-1">
              <span class="text-xs text-gray-500 block">{{ $t('branches.fields.phone') }}</span>
              <a :href="'tel:' + item.phone" class="text-sm text-blue-600">{{ item.phone }}</a>
            </div>
          </div>

          <!-- Wallet Balance -->
          <div class="flex items-center gap-2">
            <i class="pi pi-wallet text-gray-400 text-xs flex-shrink-0"></i>
            <div class="flex-1">
              <span class="text-xs text-gray-500 block">{{ $t('branches.fields.wallet_balance') }}</span>
              <span class="text-sm font-semibold text-blue-600">₭{{ item.wallet_balance?.toLocaleString() || 0 }}</span>
            </div>
          </div>

          <!-- Facebook -->
          <div v-if="item.facebook" class="flex items-center gap-2">
            <i class="pi pi-facebook text-gray-400 text-xs flex-shrink-0"></i>
            <div class="flex-1">
              <span class="text-xs text-gray-500 block">Facebook</span>
              <a :href="item.facebook" target="_blank" class="text-sm text-blue-600 truncate block">{{ item.facebook }}</a>
            </div>
          </div>

          <!-- TikTok -->
          <div v-if="item.tiktok" class="flex items-center gap-2">
            <i class="pi pi-video text-gray-400 text-xs flex-shrink-0"></i>
            <div class="flex-1">
              <span class="text-xs text-gray-500 block">TikTok</span>
              <a :href="item.tiktok" target="_blank" class="text-sm text-blue-600 truncate block">{{ item.tiktok }}</a>
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
  </div>

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

const toggleSelection = (item: IBranchEntity) => {
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
</script>

<style scoped>
/* Blue theme overrides */
:deep(.p-tag.p-tag-success) {
  background-color: #dbeafe;
  color: #1e40af;
}

:deep(.p-button.bg-blue-600) {
  background-color: #2563eb;
  border-color: #2563eb;
}

:deep(.p-button.bg-blue-600:hover) {
  background-color: #1d4ed8;
  border-color: #1d4ed8;
}
</style>
