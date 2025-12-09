<template>
  <BaseCrudLayout>
    <template #stats>
      <UiStats
        title="roles"
        :count="store.roleList.pagination.count"
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
          :data="store.roleList"
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
              field="code"
              frozen
              :header="$t('name')"
              :sortable="true"
            ></Column>
            <Column
              style="min-width: 150px"
              field="code"
              frozen
              :header="$t('permission')"
              :sortable="true"
            >
              <template #body="{ data }">
                <i class="pi pi-user-edit mr-1"></i
                >{{ data.permissions.length }}
              </template>
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
const store = useRoleStore();
const { findAll } = useRole();
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

useAsyncData("role", () => findAll({ ...query }));
</script>
