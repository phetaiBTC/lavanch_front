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
        <BaseTool @add="" @delete-all=""></BaseTool>
        <RoleTable
          title="user"
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
        />
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

useAsyncData("user", () => findAll({ ...query }));
</script>
