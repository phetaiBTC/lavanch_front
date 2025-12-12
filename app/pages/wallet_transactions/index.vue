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
            
          </Toolbar>

          <BranchWalletTransactionTable
            title="branches.sidebar.wallet_transactions_label"
            :loading="store.loading"
            :data="store.walletTransactionList"
            v-model:value="selectedTransactions"
            :query="query"
            :branches="branches"
            @on-search="onQuery.search($event)"
            @on-change-page="onQuery.page($event.page, $event.limit)"
            @on-filter-branch="onQuery.filterBranch($event)"
            @on-filter-type="onQuery.filterType($event)"
            @on-filter-status="onQuery.filterStatus($event)"
            @on-filter-date-from="onQuery.filterDateFrom($event)"
            @on-filter-date-to="onQuery.filterDateTo($event)"
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
import type { IFindWalletTransactionDto, TransactionTypeFilter, TransactionStatusFilter } from "~/types/dto/find-wallet-transaction.dto";
import type { IWalletTransactionEntity } from "~/types/entities/wallet-transaction.entity";
import type { IBranchEntity } from "~/types/entities/branch.entity";
import { sortType, Status } from "~/types/enum/paginate.enum";
import { useWalletTransaction } from "~/composables/wallet-transaction";
import { useBranch } from "~/composables/branch";
const route = useRoute();
const router = useRouter();
const store = useWalletTransactionStore();
console.log("store3333333333333333", store);
const { findAll } = useWalletTransaction();
const { findAll: findAllBranches } = useBranch();

const branches = ref<IBranchEntity[]>([]);

const query = reactive<IFindWalletTransactionDto>({
  page: Number(route.query.page ?? 1),
  limit: Number(route.query.limit ?? 10),
  search: String(route.query.search ?? ""),
  sort: (route.query.sort as sortType) ?? sortType.DESC,
  branch_id: route.query.branch_id ? Number(route.query.branch_id) : undefined,
  transaction_type: route.query.transaction_type as TransactionTypeFilter | undefined,
  transaction_status: route.query.transaction_status as TransactionStatusFilter | undefined,
  date_from: route.query.date_from as string | undefined,
  date_to: route.query.date_to as string | undefined,
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
  filterBranch: async (value: number | null) => {
    query.branch_id = value || undefined;
    query.page = 1;
    updateUrl();
    await load();
  },
  filterType: async (value: TransactionTypeFilter | null) => {
    query.transaction_type = value || undefined;
    query.page = 1;
    updateUrl();
    await load();
  },
  filterStatus: async (value: TransactionStatusFilter | null) => {
    query.transaction_status = value || undefined;
    query.page = 1;
    updateUrl();
    await load();
  },
  filterDateFrom: async (value: string | null) => {
    query.date_from = value || undefined;
    query.page = 1;
    updateUrl();
    await load();
  },
  filterDateTo: async (value: string | null) => {
    query.date_to = value || undefined;
    query.page = 1;
    updateUrl();
    await load();
  },
};

watch(
  () => ({ ...query }),
  () => updateUrl()
);

// Load branches for filter dropdown
const loadBranches = async () => {
  const branchesRes = await findAllBranches({ 
    page: 1, 
    limit: 100, 
    search: "", 
    sort: sortType.ASC, 
    is_active: Status.ACTIVE 
  });
  branches.value = branchesRes?.data || [];
};

await loadBranches();
await load();

const selectedTransactions = ref([]);

const handleView = (transaction: IWalletTransactionEntity) => {
  // TODO: Implement view dialog
  console.log("View transaction:", transaction);
};
</script>

<style scoped></style>
