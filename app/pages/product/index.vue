<template>
  <div>
    <div class="grid grid-cols-12 gap-8">
      <!-- UiStats -->
      <UiStats
        title="products"
        :count="store.productList.pagination.count"
        :type="$t('items')"
        icon="pi pi-box text-xl"
      />

      <!-- Product Table -->
      <div class="col-span-12">
        <div class="card">
          <Tabs value="table">
            <TabList>
              <Tab value="table">{{ $t("table") }}</Tab>
              <Tab value="card">{{ $t("card") }}</Tab>
            </TabList>

            <TabPanels>
              <TabPanel value="table">
                <Toolbar class="mb-6">
                  <template #start>
                    <Button
                      :label="$t('add') + $t('new') "
                      icon="pi pi-plus"
                      severity="secondary"
                      class="mr-2"
                    />
                    <Button
                      :label="$t('delete')"
                      icon="pi pi-trash"
                      severity="secondary"
                    />
                  </template>

                  <template #end>
                    <Button
                      label="Export"
                      icon="pi pi-upload"
                      severity="secondary"
                    />
                  </template>
                </Toolbar>

                <ProductTable
                  title="products"
                  :loading="store.loading"
                  :data="store.productList"
                  :sort="query.sort"
                  :checked="query.is_active"
                  v-model:value="selectedProducts"
                  :query="query"
                  @on-search="onQuery.search($event)"
                  @on-change-sort="onQuery.sort($event.sort)"
                  @on-change-active="onQuery.checked($event.is_active)"
                  @on-change-page="onQuery.page($event.page, $event.limit)"
                />
              </TabPanel>

              <TabPanel value="card">
                <p class="m-0">
                  Product card view is under construction…
                </p>
              </TabPanel>

            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import { useProductStore } from "~/stores/product.store";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import { sortType, Status } from "~/types/enum/paginate.enum";

const route = useRoute();
const router = useRouter();
const store = useProductStore();
const { findAll } = useProduct();

/* -----------------------------------
   INITIAL QUERY (from URL)
----------------------------------- */
const query = reactive<IPaginateDto>({
  page: Number(route.query.page ?? 1),
  limit: Number(route.query.limit ?? 10),
  search: String(route.query.search ?? ""),
  sort: (route.query.sort as sortType) ?? sortType.ASC,
  is_active: (route.query.is_active as Status) ?? Status.ACTIVE,
});

if (!route.query.page) {
  router.replace({ query: { ...query } });
}

/* -----------------------------------
   HELPERS
----------------------------------- */
const updateUrl = () => {
  router.replace({ query: { ...query } });
};

const load = async () => {
  await findAll({ ...query });
};

/* -----------------------------------
   QUERY UPDATER
----------------------------------- */
const onQuery = {
  search: async (value: string) => {
    query.search = value;
    query.page = 1;
    updateUrl();
    await load();
  },

  sort: async (value: sortType) => {
    query.sort = value;
    query.page = 1;
    updateUrl();
    await load();
  },

  checked: async (value: Status) => {
    query.is_active = value;
    query.page = 1;
    updateUrl();
    await load();
  },

  page: async (page: number, limit: number) => {
    query.page = page;
    query.limit = limit;
    updateUrl();
    await load();
  },
};

/* -----------------------------------
   SYNC URL WHEN QUERY CHANGES
----------------------------------- */
watch(
  () => ({ ...query }),
  () => updateUrl()
);

/* -----------------------------------
   FIRST LOAD
----------------------------------- */
await load();

/* -----------------------------------
   TABLE SELECTION
----------------------------------- */
const selectedProducts = ref([]);
</script>
