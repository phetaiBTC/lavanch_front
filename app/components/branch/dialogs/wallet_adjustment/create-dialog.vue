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
        <label for="branch">{{ $t('branch') }} *</label>
        <Select
          id="branch"
          v-model="form.branch_id"
          :options="branches"
          optionLabel="name"
          optionValue="id"
          :placeholder="$t('select') + ' ' + $t('branch')"
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="adjustment_type">{{ $t('type') }} *</label>
        <Select
          id="adjustment_type"
          v-model="form.adjustment_type"
          :options="adjustmentTypes"
          optionLabel="label"
          optionValue="value"
          :placeholder="$t('select') + ' ' + $t('type')"
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="amount">{{ $t('amount') }} *</label>
        <InputNumber
          id="amount"
          v-model="form.amount"
          :placeholder="$t('amount')"
          mode="currency"
          currency="USD"
          locale="en-US"
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="description">{{ $t('description') }}</label>
        <Textarea
          id="description"
          v-model="form.description"
          :placeholder="$t('description')"
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
import { ref } from "vue";
import type { IBranchEntity } from "~/types/entities/branch.entity";
import { useToast } from "primevue/usetoast";

const toast = useToast();

interface Props {
  visible: boolean;
  branches: IBranchEntity[];
}

const props = defineProps<Props>();
const emit = defineEmits(["update:visible", "save"]);

const adjustmentTypes = [
  { label: "Deposit", value: "DEPOSIT" },
  { label: "Withdraw", value: "WITHDRAW" },
  { label: "Found", value: "FOUND" },
  { label: "Lost", value: "LOST" },
];

const form = ref<{
  branch_id: number | null;
  adjustment_type: string | null;
  amount: number | null;
  description: string;
}>({
  branch_id: null,
  adjustment_type: null,
  amount: null,
  description: "",
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

  emit("save", {
    branch_id: form.value.branch_id,
    adjustment_type: form.value.adjustment_type,
    amount: form.value.amount,
    description: form.value.description,
  });

  // Reset form
  form.value = {
    branch_id: null,
    adjustment_type: null,
    amount: null,
    description: "",
  };
};
</script>
