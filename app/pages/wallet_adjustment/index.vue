<template>
  <div>
    <div class="grid grid-cols-12 gap-8">
      <!-- Stats -->
      <UiStats
        title="branches.sidebar.wallet_adjustment_label"
        :count="store.walletAdjustmentList.pagination.count"
        :type="$t('items')"
        icon="pi pi-sync text-xl"
      />

      <!-- Wallet Adjustment Table -->
      <div class="col-span-12">
        <div class="card">
          <Toolbar class="mb-6">
            <template #start>
              <Button
                :label="$t('add') + ' ' + $t('branches.sidebar.wallet_adjustment_label')"
                icon="pi pi-plus"
                severity="secondary"
                class="mr-2"
                @click="openCreateDialog"
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

          <BranchWalletAdjustmentTable
            title="branches.sidebar.wallet_adjustment_label"
            :loading="store.loading"
            :data="store.walletAdjustmentList"
            v-model:value="selectedAdjustments"
            :query="query"
            @on-search="onQuery.search($event)"
            @on-change-page="onQuery.page($event.page, $event.limit)"
            @on-view="handleView"
            @on-approve="handleApprove"
            @on-reject="handleReject"
          />
        </div>
      </div>
    </div>

    <!-- Wallet Adjustment Dialog -->
    <BranchDialogsWalletAdjustmentCreateDialog
      v-model:visible="adjustmentDialogVisible"
      :branches="branchOptions"
      @save="handleSaveAdjustment"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import { useWalletAdjustmentStore } from "~/stores/wallet-adjustment.store";
import type { IPaginateDto } from "~/types/dto/paginate.dto";
import type { IWalletAdjustmentEntity } from "~/types/entities/wallet-adjustment.entity";
import type { IBranchEntity } from "~/types/entities/branch.entity";
import { sortType, Status } from "~/types/enum/paginate.enum";
import { useWalletAdjustment } from "~/composables/wallet-adjustment";
import { useBranch } from "~/composables/branch";
const route = useRoute();
const router = useRouter();
const store = useWalletAdjustmentStore();
const { findAll, createDeposit, createWithdraw, createFound, createLost, approve, reject } = useWalletAdjustment();
const { findAll: findAllBranches } = useBranch();
const { showSuccess } = useFormHandler();

// Dialog state
const adjustmentDialogVisible = ref(false);
const branchOptions = ref<IBranchEntity[]>([]);

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

// Load branch options for dialog
const branchesRes = await findAllBranches({ page: 1, limit: 100, search: "", sort: sortType.ASC, is_active: Status.ACTIVE });
branchOptions.value = branchesRes?.data || [];

const selectedAdjustments = ref([]);

const openCreateDialog = () => {
  adjustmentDialogVisible.value = true;
};

const handleSaveAdjustment = async (data: any) => {
  const { branch_id, amount, description, adjustment_type } = data;
  const payload = { branch_id, amount, description };
  
  // Call the appropriate method based on adjustment_type
  switch (adjustment_type) {
    case "DEPOSIT":
      await createDeposit(payload);
      showSuccess("Deposit adjustment created successfully");
      break;
    case "WITHDRAW":
      await createWithdraw(payload);
      showSuccess("Withdraw adjustment created successfully");
      break;
    case "FOUND":
      await createFound(payload);
      showSuccess("Found money adjustment created successfully");
      break;
    case "LOST":
      await createLost(payload);
      showSuccess("Lost money adjustment created successfully");
      break;
  }
  
  adjustmentDialogVisible.value = false;
  await load();
};

const handleView = (adjustment: IWalletAdjustmentEntity) => {
  // TODO: Implement view dialog
  console.log("View adjustment:", adjustment);
};

const handleApprove = async (adjustment: IWalletAdjustmentEntity) => {
  await approve(adjustment.id);
  showSuccess(`${adjustment.reason} adjustment approved successfully`);
  await load();
};

const handleReject = async (adjustment: IWalletAdjustmentEntity) => {
  await reject(adjustment.id);
  showSuccess(`${adjustment.reason} adjustment rejected successfully`);
  await load();
};
</script>

<style scoped></style>
