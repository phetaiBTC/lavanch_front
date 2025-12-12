<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    modal
    :header="$t('add') + ' ' + $t('branches.sidebar.wallet_adjustment_label')"
    :style="{ width: '30rem' }"
  >
    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-2">
        <label for="branch">{{ $t('wallet_adjustments.dialog.create.branch') }} *</label>
        <Select
          id="branch"
          v-model="form.branch_id"
          :options="branches"
          optionLabel="name"
          optionValue="id"
          :placeholder="$t('wallet_adjustments.dialog.create.placeholder_branch')"
          class="w-full"
        />
      </div>
<!-- Show receiver branch only for TRANSFER type -->
      <div v-if="form.adjustment_type === 'TRANSFER'" class="flex flex-col gap-2">
        <label for="receiver_branch">{{ $t('wallet_adjustments.dialog.create.to_branch') }} *</label>
        <Select
          id="receiver_branch"
          v-model="form.receiver_branch_id"
          :options="availableReceiverBranches"
          optionLabel="name"
          optionValue="id"
          :placeholder="$t('wallet_adjustments.dialog.create.placeholder_branch')"
          class="w-full"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="adjustment_type">{{ $t('wallet_adjustments.dialog.create.type_name') }} *</label>
        <Select
          id="adjustment_type"
          v-model="form.adjustment_type"
          :options="adjustmentTypes"
          optionLabel="label"
          optionValue="value"
          :placeholder="$t('wallet_adjustments.dialog.create.placeholder_type')"
          class="w-full"
        />
      </div>

      

      <div class="flex flex-col gap-2">
        <label for="amount">{{ $t('wallet_adjustments.dialog.create.amount') }} *</label>
        <InputNumber
          id="amount"
          v-model="form.amount"
          :placeholder="$t('wallet_adjustments.dialog.create.amount')"
          mode="currency"
          currency="LAK"
          locale="lo-LA"
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="description">{{ $t('wallet_adjustments.dialog.create.description') }}</label>
        <Textarea
          id="description"
          v-model="form.description"
          :placeholder="$t('wallet_adjustments.dialog.create.description') + '...'"
          rows="3"
          class="w-full"
        />
      </div>
    </div>

    <template #footer>
      <Button
        :label="$t('cancel')"
        severity="secondary"
        @click="$emit('update:visible', false)"
      />
      <Button :label="$t('save')" @click="handleSave" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { IBranchEntity } from "~/types/entities/branch.entity";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const toast = useToast();

interface Props {
  visible: boolean;
  branches: IBranchEntity[];
}

const props = defineProps<Props>();
const emit = defineEmits(["update:visible", "save"]);

const adjustmentTypes = [
  { label: t("wallet_adjustments.dialog.create.type.deposit"), value: "DEPOSIT" },
  { label: t("wallet_adjustments.dialog.create.type.withdraw"), value: "WITHDRAW" },
  { label: t("wallet_adjustments.dialog.create.type.found"), value: "FOUND" },
  { label: t("wallet_adjustments.dialog.create.type.lost"), value: "LOST" },
  { label: t("wallet_adjustments.dialog.create.type.transfer"), value: "TRANSFER" },
];

const form = ref<{
  branch_id: number | null;
  adjustment_type: string | null;
  receiver_branch_id: number | null;
  amount: number | null;
  description: string;
}>({
  branch_id: null,
  adjustment_type: null,
  receiver_branch_id: null,
  amount: null,
  description: "",
});

// Filter out the selected sender branch from receiver options
const availableReceiverBranches = computed(() => {
  if (!form.value.branch_id) return props.branches;
  return props.branches.filter(branch => branch.id !== form.value.branch_id);
});

const handleSave = () => {
  if (!form.value.branch_id || !form.value.adjustment_type || !form.value.amount) {
    toast.add({
      severity: "warn",
      summary: "Validation Error",
      detail: "Please fill all required fields",
      life: 3000,
    });
    return;
  }

  // Validate receiver branch for TRANSFER type
  if (form.value.adjustment_type === 'TRANSFER' && !form.value.receiver_branch_id) {
    toast.add({
      severity: "warn",
      summary: "Validation Error",
      detail: "Please select receiver branch for transfer",
      life: 3000,
    });
    return;
  }

  // Prevent transfer to same branch
  if (form.value.adjustment_type === 'TRANSFER' && form.value.branch_id === form.value.receiver_branch_id) {
    toast.add({
      severity: "warn",
      summary: "Validation Error",
      detail: "Cannot transfer to the same branch",
      life: 3000,
    });
    return;
  }

  const payload: any = {
    branch_id: form.value.branch_id,
    adjustment_type: form.value.adjustment_type,
    amount: form.value.amount,
    description: form.value.description,
  };

  // Add receiver_branch_id for TRANSFER type
  if (form.value.adjustment_type === 'TRANSFER') {
    payload.receiver_branch_id = form.value.receiver_branch_id;
  }

  emit("save", payload);

  // Reset form
  form.value = {
    branch_id: null,
    adjustment_type: null,
    receiver_branch_id: null,
    amount: null,
    description: "",
  };
};
</script>
