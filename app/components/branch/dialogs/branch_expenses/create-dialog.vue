<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    modal
    :header="$t('add') + ' ' + $t('branches.sidebar.branch_expenses_label')"
    :style="{ width: '30rem' }"
  >
    <div class="flex flex-col gap-4">
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
        <label for="expense_category_id">{{ $t('category') }} *</label>
        <Select
          id="expense_category_id"
          v-model="form.expense_category_id"
          :options="categories"
          optionLabel="name"
          optionValue="id"
          :placeholder="$t('select') + ' ' + $t('category')"
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
          :min="0"
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="expense_date">{{ $t('expense_date') }} *</label>
        <DatePicker
          id="expense_date"
          v-model="expenseDate"
          dateFormat="yy-mm-dd"
          :placeholder="$t('expense_date')"
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="description">{{ $t('description') }}</label>
        <Textarea
          id="description"
          v-model="form.description"
          :placeholder="$t('description')"
          rows="2"
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="notes">{{ $t('notes') }}</label>
        <Textarea
          id="notes"
          v-model="form.notes"
          :placeholder="$t('notes')"
          rows="2"
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="receipt_image">{{ $t('receipt_image') }}</label>
        <div class="flex flex-col gap-2">
          <FileUpload
            mode="basic"
            accept="image/*"
            :maxFileSize="5000000"
            @select="handleFileSelect"
            :auto="false"
            chooseLabel="Choose Image"
            class="w-full"
          />
          <div v-if="uploading" class="flex items-center gap-2">
            <ProgressSpinner style="width: 20px; height: 20px" strokeWidth="4" />
            <span class="text-sm">Uploading...</span>
          </div>
          <div v-if="form.receipt_image" class="relative">
            <img 
              :src="form.receipt_image" 
              alt="Receipt" 
              class="max-w-full h-auto rounded border max-h-64 object-contain" 
              @error="handleImageError"
            />
            <Button
              icon="pi pi-times"
              severity="danger"
              size="small"
              rounded
              class="absolute top-2 right-2"
              @click="removeImage"
            />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        :label="$t('cancel')"
        severity="secondary"
        @click="handleClose"
        :disabled="uploading"
      />
      <Button
        :label="$t('save')"
        :loading="saving"
        :disabled="uploading"
        @click="handleSave"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { IBranchEntity } from "~/types/entities/branch.entity";
import type { IExpenseCategoryEntity } from "~/types/entities/expense-category.entity";
import type { IBranchExpenseEntity } from "~/types/entities/branch-expense.entity";
import { useImageUpload } from "~/composables/image-upload";
import { useToast } from "primevue/usetoast";

interface Props {
  visible: boolean;
  branches: IBranchEntity[];
  categories: IExpenseCategoryEntity[];
}

const props = defineProps<Props>();
const emit = defineEmits(["update:visible", "save"]);

const { uploadImage } = useImageUpload();
const toast = useToast();

const saving = ref(false);
const uploading = ref(false);

const form = ref<Partial<IBranchExpenseEntity>>({
  branch_id: 0,
  expense_category_id: 0,
  amount: 0,
  currency_id: 1,
  expense_date: new Date().toISOString().split("T")[0],
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

const handleFileSelect = async (event: { files: File[] }) => {
  const file = event.files[0];
  if (!file) return;

  try {
    uploading.value = true;
    const imageUrl = await uploadImage(file);
    console.log('Uploaded image URL:', imageUrl);
    form.value.receipt_image = imageUrl;
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Image uploaded successfully",
      life: 3000,
    });
  } catch (error) {
    console.error("Failed to upload image:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to upload image",
      life: 3000,
    });
  } finally {
    uploading.value = false;
  }
};

const removeImage = () => {
  form.value.receipt_image = "";
};

const handleImageError = (event: Event) => {
  console.error("Image failed to load:", form.value.receipt_image);
  console.error("Error event:", event);
};

const handleClose = () => {
  emit("update:visible", false);
  resetForm();
};

const resetForm = () => {
  form.value = {
    branch_id: 0,
    expense_category_id: 0,
    amount: 0,
    currency_id: 1,
    expense_date: new Date().toISOString().split("T")[0],
    description: "",
    notes: "",
    receipt_image: "",
  };
};

const handleSave = async () => {
  if (!form.value.branch_id || !form.value.expense_category_id || !form.value.amount || !form.value.expense_date) {
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
    resetForm();
  } finally {
    saving.value = false;
  }
};
</script>
