<template>
  <BaseCrudLayout>
    <template #stats>
      <UiStats
        title="currencyRate"
        :count="store.currencyRateList.pagination.count"
        :type="$t('currencyRate')"
        icon="pi pi-fw pi-money-bill text-xl"
      />
    </template>
    <div class="col-span-12">
      <div class="card">
        <BaseTool @add="navigateTo('/role/from')" @delete-all=""></BaseTool>
        <BaseCrud
          title="currencyRate"
          v-model:value="selectedUsers"
          :loading="store.loading"
          :data="store.currencyRateList"
          :sort="query.sort"
          :checked="query.is_active"
          :query="query"
          endpoint="currencyrates"
          @on-search="onQuery.search($event)"
          @on-change-sort="onQuery.sort($event.sort)"
          @on-change-active="onQuery.checked($event.is_active)"
          @on-change-page="onQuery.page($event.page, $event.limit)"
          @on-edit="navigateTo(`/role/from/${$event}`)"

        >
          <template #columns>
            <Column
              style="min-width: 150px"
              field="from_currency.name"
              frozen
              :header="$t('from_currency')"
              :sortable="true"
            ></Column>
            <Column
              style="min-width: 150px"
              field="to_currency.name"
              frozen
              :header="$t('to_currency')"
              :sortable="true"
            >
            </Column>
            <Column
              style="min-width: 150px"
              field="rate"
              frozen
              :header="$t('rate')"
              :sortable="true"
            >
            </Column>
            <Column
              style="min-width: 150px"
              field="rate_date"
              frozen
              :header="$t('rate_date')"
              :sortable="true"
            >
            </Column>
          </template>
        </BaseCrud>
      </div>
    </div>
  </BaseCrudLayout>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import { sortType, Status } from "~/types/enum/paginate.enum";
const route = useRoute();
const router = useRouter();
const store = useCurrencyRateStore();
const { findAll } = useCurrencyRate();
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

useAsyncData("currency-rate", () => findAll({ ...query }));
</script>
