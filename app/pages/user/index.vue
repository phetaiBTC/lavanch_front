<template>
  <BaseCrudLayout>
    <template #stats>
      <UiStats
        title="users"
        :count="store.userList.pagination.count"
        :type="$t('people')"
        icon="pi pi-users text-xl"
      />
    </template>
    <div class="col-span-12">
      <div class="card">
        <Tabs value="table">
          <TabList>
            <Tab value="table">{{ $t("table") }}</Tab>
            <Tab value="card">{{ $t("card") }}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="table">
              <BaseTool
                @add="navigateTo('/user/from')"
                @delete-all=""
              ></BaseTool>
              <BaseCrud
                title="user"
                :loading="store.loading"
                :data="store.userList"
                :sort="query.sort"
                :checked="query.is_active"
                v-model:value="selectedUsers"
                :query="query"
                @on-search="onQuery.search($event)"
                @on-change-sort="onQuery.sort($event.sort)"
                @on-change-active="onQuery.checked($event.is_active)"
                @on-change-page="onQuery.page($event.page, $event.limit)"
              >
                <template #columns>
                  <Column
                    style="min-width: 150px"
                    field="username"
                    frozen
                    :header="$t('username')"
                    :sortable="true"
                  ></Column>
                  <Column
                    style="min-width: 150px"
                    field="email"
                    :header="$t('email')"
                    :sortable="true"
                  >
                  </Column>
                  <Column
                    style="min-width: 150px"
                    field="is_verified"
                    :header="$t('is_verified')"
                    :sortable="true"
                  >
                    <template #body="{ data }">
                      <Tag
                        icon="pi pi-check"
                        :severity="data.is_verified ? 'success' : 'danger'"
                        :value="
                          data.is_verified ? $t('verified') : $t('unverified')
                        "
                      ></Tag>
                    </template>
                  </Column>
                </template>
              </BaseCrud>
            </TabPanel>
            <TabPanel value="card"> </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  </BaseCrudLayout>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import { useUserStore } from "~/stores/user.store";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import { sortType, Status } from "~/types/enum/paginate.enum";
const route = useRoute();
const router = useRouter();
const store = useUserStore();
const { findAll } = useUser();
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

useAsyncData("user", () => findAll({ ...query }));
</script>
