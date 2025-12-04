<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="isEdit ? $t('edit') + ' ' + $t('branches.sidebar.branch_expenses_label') : $t('add') + ' ' + $t('branches.sidebar.branch_expenses_label')"
    :modal="true"
    :closable="true"
    :style="{ width: '600px' }"
    
  >
    <div class="flex flex-col gap-4 p-4">
      <!-- Branch Selection -->
      <div class="flex flex-col gap-2">
        <label for="branch_id">{{ $t("branches.fields.branch") }} *</label>
        <Select
          id="branch_id"
          v-model="form.branch_id"
          :options="branches"
          optionLabel="name"
          optionValue="id"
          :placeholder="$t('select') + ' ' + $t('branches.fields.branch')"
          class="w-full"
        />
      </div>

      <!-- Expense Category -->
      <div class="flex flex-col gap-2">
        <label for="expense_category_id">{{ $t("branches.fields.expense_category") }} *</label>
        <Select
          id="expense_category_id"
          v-model="form.expense_category_id"
          :options="categories"
          optionLabel="name"
          optionValue="id"
          :placeholder="$t('select') + ' ' + $t('branches.fields.expense_category')"
          class="w-full"
        />
      </div>

      <!-- Amount -->
      <div class="flex flex-col gap-2">
        <label for="amount">{{ $t("branches.fields.amount") }} *</label>
        <InputNumber
          id="amount"
          v-model="form.amount"
          :placeholder="$t('branches.fields.amount')"
          mode="decimal"
          :minFractionDigits="2"
          :maxFractionDigits="2"
          class="w-full"
        />
      </div>

      <!-- Expense Date -->
      <div class="flex flex-col gap-2">
        <label for="expense_date">{{ $t("branches.fields.expense_date") }} *</label>
        <DatePicker
          id="expense_date"
          v-model="expenseDate"
          dateFormat="yy-mm-dd"
          :placeholder="$t('branches.fields.expense_date')"
          class="w-full"
        />
      </div>

      <!-- Description -->
      <div class="flex flex-col gap-2">
        <label for="description">{{ $t("branches.fields.description") }}</label>
        <Textarea
          id="description"
          v-model="form.description"
          :placeholder="$t('branches.fields.description')"
          rows="3"
          class="w-full"
        />
      </div>

      <!-- Notes -->
      <div class="flex flex-col gap-2">
        <label for="notes">{{ $t("branches.fields.notes") }}</label>
        <Textarea
          id="notes"
          v-model="form.notes"
          :placeholder="$t('branches.fields.notes')"
          rows="2"
          class="w-full"
        />
      </div>

      <!-- Receipt Image Upload -->
      <div class="flex flex-col gap-2">
        <label for="receipt_image">{{ $t("branches.fields.receipt_image") }}</label>
        <div class="flex flex-col gap-2">
          <!-- Preview existing image -->
          <div v-if="form.receipt_image" class="relative">
            <img
              :src="form.receipt_image"
              alt="Receipt"
              class="max-w-full h-auto max-h-48 rounded border"
            />
            <Button
              icon="pi pi-times"
              severity="danger"
              rounded
              size="small"
              class="absolute top-2 right-2"
              @click="removeImage"
            />
          </div>

          <!-- File upload -->
          <FileUpload
            mode="basic"
            accept="image/*"
            :maxFileSize="5000000"
            :auto="false"
            chooseLabel="Choose Image"
            :disabled="uploading"
            @select="handleFileSelect"
          />
          <small class="text-muted-color">Max file size: 5MB</small>
          
          <!-- Upload progress -->
          <ProgressBar v-if="uploading" mode="indeterminate" style="height: 6px" />
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        :label="$t('cancel')"
        severity="secondary"
        @click="handleClose"
      />
      <Button
        :label="$t('save')"
        :loading="saving"
        @click="handleSave"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { IBranchExpenseEntity } from "~/types/entities/branch-expense.entity";
import type { IBranchEntity } from "~/types/entities/branch.entity";
import type { IExpenseCategoryEntity } from "~/types/entities/expense-category.entity";
import { useImageUpload } from "~/composables/image-upload";
import { useToast } from "primevue/usetoast";

const toast = useToast();

const props = defineProps<{
  visible: boolean;
  expense?: IBranchExpenseEntity | null;
  branches: IBranchEntity[];
  categories: IExpenseCategoryEntity[];
}>();

const emit = defineEmits(["update:visible", "save"]);

const isEdit = computed(() => !!props.expense);
const saving = ref(false);
const uploading = ref(false);
const selectedFile = ref<File | null>(null);

const { uploadImage } = useImageUpload();

const form = ref<Partial<IBranchExpenseEntity>>({
  branch_id: 0,
  expense_category_id: 0,
  amount: 0,
  expense_date: new Date().toISOString().split('T')[0],
  description: "",
  notes: "",
  receipt_image: "",
});

// Bridge DatePicker (Date) to form string (YYYY-MM-DD)
const expenseDate = computed<Date | null>({
  get() {
    return form.value.expense_date ? new Date(form.value.expense_date) : null;
  },
  set(value) {
    form.value.expense_date = value ? value.toISOString().split("T")[0] : "";
  },
});

// Watch for expense changes (edit mode)
watch(
  () => props.expense,
  (newExpense) => {
    if (newExpense) {
      form.value = {
        branch_id: newExpense.branch_id,
        expense_category_id: newExpense.expense_category_id,
        amount: newExpense.amount,
        expense_date: newExpense.expense_date,
        description: newExpense.description || "",
        notes: newExpense.notes || "",
        receipt_image: newExpense.receipt_image || "",
      };
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

const resetForm = () => {
  form.value = {
    branch_id: 0,
    expense_category_id: 0,
    amount: 0,
    expense_date: new Date().toISOString().split('T')[0],
    description: "",
    notes: "",
    receipt_image: "",
  };
  selectedFile.value = null;
};

const handleFileSelect = async (event: { files: File[] }) => {
  const file = event.files[0];
  if (!file) return;

  selectedFile.value = file;
  
  // Auto-upload the image
  try {
    uploading.value = true;
    const imageUrl = await uploadImage(file);
    form.value.receipt_image = imageUrl;
  } catch (error) {
    console.error("Failed to upload image:", error);
  } finally {
    uploading.value = false;
  }
};

const removeImage = () => {
  form.value.receipt_image = "";
  selectedFile.value = null;
};

const handleClose = () => {
  emit("update:visible", false);
  resetForm();
};

const handleSave = async () => {
  // Validation
  if (!form.value.branch_id || !form.value.expense_category_id || !form.value.amount) {
    toast.add({
      severity: "warn",
      summary: "Validation Error",
      detail: "Please fill in all required fields",
      life: 3000,
    });
    return;
  }

  saving.value = true;
  try {
    emit("save", form.value);
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped></style>
