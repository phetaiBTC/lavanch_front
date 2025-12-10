<template>
  <BaseCrudLayout>
    <template #stats>
      <UiStats
        title="roles"
        :count="store.supplierList.pagination.count"
        :type="$t('roles')"
        icon="pi pi-shield text-xl"
      />
    </template>
    <div class="col-span-12">
      <div class="card">
        <BaseTool @add="navigateTo('/role/from')" @delete-all=""></BaseTool>
        <BaseCrud
          title="role"
          :loading="store.loading"
          :data="store.supplierList"
          :sort="query.sort"
          :checked="query.is_active"
          v-model:value="selectedUsers"
          :query="query"
          @on-search="onQuery.search($event)"
          @on-change-sort="onQuery.sort($event.sort)"
          @on-change-active="onQuery.checked($event.is_active)"
          @on-change-page="onQuery.page($event.page, $event.limit)"
          @on-edit="navigateTo(`/role/from/${$event}`)"
          @on-delete=""
        >
          <template #columns>
            <Column
              style="min-width: 150px"
              field="name"
              frozen
              :header="$t('name')"
              :sortable="true"
            />
            <Column
              style="min-width: 150px"
              field="email"
              frozen
              :header="$t('email')"
              :sortable="true"
            />
            <Column
              style="min-width: 150px"
              field="phone"
              :header="$t('phone')"
              :sortable="true"
            />
            <Column
              style="min-width: 150px"
              field="contact_person"
              :header="$t('contact_person')"
              :sortable="true"
            />
            <Column
              style="min-width: 100px"
              field="is_active"
              :header="$t('is_active')"
              :sortable="true"
            >
              <template #body="{ data }">
                <UiTagBool :value="data.is_active"></UiTagBool>
              </template>
            </Column>
            <Column
              style="min-width: 250px"
              field="address"
              :header="$t('address')"
              :sortable="true"
            >
              <template #body="{ data }">
                {{ formatAddress(data.village) }}
              </template>
            </Column>
          </template>
        </BaseCrud>
      </div>
    </div>
  </BaseCrudLayout>
  <UiInput
    label="province"
    type="select"
    :options="provinceOptions"
    v-model="province"
    option-value="value"
    option-label="label"
  ></UiInput>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import { sortType, Status } from "~/types/enum/paginate.enum";
const { findProvince } = useAddress();
const province = ref();
const { provinceList, provinceOptions } = useAddressStore();
const route = useRoute();
const router = useRouter();
const store = useSupplierStore();
const { findAll } = useSupplier();
const selectedUsers = ref([]);
const query = reactive<IPaginateDto>({
  page: Number(route.query.page ?? 1),
  limit: Number(route.query.limit ?? 10),
  search: String(route.query.search ?? ""),
  sort: (route.query.sort as sortType) ?? sortType.ASC,
  is_active: (route.query.is_active as Status) ?? Status.ACTIVE,
});
const onQuery = onQueryUtil({
  query,
  load: async () => await findAll({ ...query }),
  router,
});
watch(
  () => ({ ...query }),
  () => router.replace({ query: { ...query } })
);

useAsyncData("role", async () => {
  await findProvince();
  return await findAll({ ...query });
});
</script>
