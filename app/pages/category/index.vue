<template>
  <div>
    <div class="grid grid-cols-12 gap-8">
      <!-- UiStats -->
      <UiStats
        title="categories"
        :count="store.categoryList.pagination.count"
        :type="$t('items')"
        icon="pi pi-tags text-xl"
      />

      <!-- Category Table -->
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
                      :label="$t('add') + $t('new')"
                      icon="pi pi-plus"                      
                      class="mr-2"
                      @click="is_manage()"
                    />
                    <Button
                      :label="$t('delete')"
                      :disabled="selectedCategories.length === 0"
                      icon="pi pi-trash"
                      severity="danger"
                    />
                  </template>

                 
                </Toolbar>

                <CategoryTable
                  title="categories"
                  :loading="store.loading"
                  :data="store.categoryList"
                  :sort="query.sort"
                  :checked="query.is_active"
                  v-model:value="selectedCategories"
                  :query="query"
                  @on-search="onQuery.search($event)"
                  @on-change-sort="onQuery.sort($event.sort)"
                  @on-change-active="onQuery.checked($event.is_active)"
                  @on-change-page="onQuery.page($event.page, $event.limit)"
                  @on-edit="is_manage"
                  @on-delete="async (id: number) => {
                    await deleteOne(id!);
                  }"
                />
              </TabPanel>

              <TabPanel value="card">
                <p class="m-0">Category card view is under construction…</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>
  </div>

  <CategoryManage
    :visible="visible"
    :category="categoryData"
    @update:visible="visible = $event"
  />
</template>

<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import { sortType, Status } from "~/types/enum/paginate.enum";
import type { ICategoryEntity } from "~/types/entities/category.entity";
import type {
  ICreateCategoriesDto,
  IUpdateCategoriesDto,
} from "~/types/dto/categories.dto";
// import { useCategory } from "~/composables/category/comman/categories";

const route = useRoute();
const router = useRouter();
const store = useCategoryStore();
const { findAll, deleteOne } = useCategory(); // composable สำหรับ fetch categories
const categoryData = ref<ICreateCategoriesDto | IUpdateCategoriesDto>({
  id: 0,
  name: "",
  description: "",
  parent: 0,
  children: [],
});
const visible = ref<boolean>(false);
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

const { data, pending, error } = useAsyncData("categories", () =>
  findAll({ ...query })
);

/* -----------------------------------
   FIRST LOAD
----------------------------------- */
// await load();

/* -----------------------------------
   TABLE SELECTION
----------------------------------- */
const selectedCategories = ref([]);

const is_manage = (data?: ICategoryEntity) => {
  categoryData.value = data ? { ...data } : {};

  console.log("git", categoryData.value);
  visible.value = true;
};





</script>
