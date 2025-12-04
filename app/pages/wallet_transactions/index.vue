<template>
  <div>
    <div class="grid grid-cols-12 gap-8">
      <!-- Stats -->
      <UiStats
        title="branches.sidebar.wallet_transactions_label"
        :count="store.walletTransactionList.pagination.count"
        :type="$t('items')"
        icon="pi pi-history text-xl"
      />

      <!-- Wallet Transaction Table -->
      <div class="col-span-12">
        <div class="card">
          <Toolbar class="mb-6">
            <template #start>
              <h4 class="m-0">{{ $t("branches.sidebar.wallet_transactions_label") }}</h4>
            </template>
            <template #end>
              <Button
                label="Export"
                icon="pi pi-upload"
                severity="secondary"
              />
            </template>
          </Toolbar>

          <BranchWalletTransactionTable
            title="branches.sidebar.wallet_transactions_label"
            :loading="store.loading"
            :data="store.walletTransactionList"
            v-model:value="selectedTransactions"
            :query="query"
            @on-search="onQuery.search($event)"
            @on-change-page="onQuery.page($event.page, $event.limit)"
            @on-view="handleView"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import { useWalletTransactionStore } from "~/stores/wallet-transaction.store";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import type { IWalletTransactionEntity } from "~/types/entities/wallet-transaction.entity";
import { sortType } from "~/types/enum/paginate.enum";
import { useWalletTransaction } from "~/composables/wallet-transaction";
const route = useRoute();
const router = useRouter();
const store = useWalletTransactionStore();
const { findAll } = useWalletTransaction();

const query = reactive<IPaginateDto>({
  page: Number(route.query.page ?? 1),
  limit: Number(route.query.limit ?? 10),
  search: String(route.query.search ?? ""),
  sort: (route.query.sort as sortType) ?? sortType.DESC,
});

if (!route.query.page) {
  router.replace({ query: { ...query } });
}

const updateUrl = () => {
  router.replace({ query: { ...query } });
};

const load = async () => {
  await findAll({ ...query });
};

const onQuery = {
  search: async (value: string) => {
    query.search = value;
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

watch(
  () => ({ ...query }),
  () => updateUrl()
);

await load();

const selectedTransactions = ref([]);

const handleView = (transaction: IWalletTransactionEntity) => {
  // TODO: Implement view dialog
  console.log("View transaction:", transaction);
};
</script>

<style scoped></style>
