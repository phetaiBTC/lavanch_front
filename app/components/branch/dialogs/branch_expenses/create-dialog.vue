<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    modal
    :header="$t('add') + ' ' + $t('branches.sidebar.branch_expenses_label')"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '95vw' }"
    :pt="{
      root: { class: 'rounded-lg' },
      header: { class: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6' },
      content: { class: 'p-6' },
    }"
  >
    <div class="space-y-6">
      <!-- Section 1: Form Data -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-700 border-b pb-2">
          {{ $t('branchExpenses.sections.form_data') }}
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Branch -->
          <div class="flex flex-col gap-2">
            <label class="font-medium text-sm text-gray-700">
              {{ $t('branches.fields.name') }}
              <span class="text-red-500">*</span>
            </label>
            <AutoComplete
              v-model="selectedBranch"
              :suggestions="filteredBranches"
              @complete="searchBranches"
              optionLabel="name"
              :placeholder="$t('branchExpenses.placeholders.search_branch')"
              class="w-full"
            />
          </div>

          <!-- Expense Category -->
          <div class="flex flex-col gap-2">
            <label class="font-medium text-sm text-gray-700">
              {{ $t('branchExpenses.fields.category') }}
              <span class="text-red-500">*</span>
            </label>
            <Select
              v-model="form.expense_category_id"
              :options="categories"
              optionLabel="name"
              optionValue="id"
              :placeholder="$t('branchExpenses.placeholders.select_category')"
              class="w-full"
            />
          </div>

          <!-- Amount -->
          <div class="flex flex-col gap-2">
            <label class="font-medium text-sm text-gray-700">
              {{ $t('branchExpenses.fields.amount') }}
              <span class="text-red-500">*</span>
            </label>
            <InputNumber
              v-model="form.amount"
              :placeholder="$t('branchExpenses.placeholders.enter_amount')"
              mode="decimal"
              :min="0"
              :minFractionDigits="2"
              :maxFractionDigits="2"
              class="w-full"
            />
          </div>

          <!-- Expense Date -->
          <div class="flex flex-col gap-2">
            <label class="font-medium text-sm text-gray-700">
              {{ $t('branchExpenses.fields.expense_date') }}
              <span class="text-red-500">*</span>
            </label>
            <DatePicker
              v-model="expenseDate"
              dateFormat="yy-mm-dd"
              :placeholder="$t('branchExpenses.placeholders.select_date')"
              class="w-full"
            />
          </div>

          <!-- Description -->
          <div class="flex flex-col gap-2 md:col-span-2">
            <label class="font-medium text-sm text-gray-700">
              {{ $t('branchExpenses.fields.description') }}
            </label>
            <InputText
              v-model="form.description"
              :placeholder="$t('branchExpenses.placeholders.enter_description')"
              class="w-full"
            />
          </div>

          <!-- Notes -->
          <div class="flex flex-col gap-2 md:col-span-2">
            <label class="font-medium text-sm text-gray-700">
              {{ $t('branchExpenses.fields.notes') }}
            </label>
            <Textarea
              v-model="form.notes"
              :placeholder="$t('branchExpenses.placeholders.enter_notes')"
              rows="3"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Section 2: Image Upload -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-700 border-b pb-2">
          {{ $t('branchExpenses.sections.receipt_images') }}
        </h3>
        
        <div class="flex flex-col gap-4">
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
      <div class="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
        <Button
          :label="$t('cancel')"
          icon="pi pi-times"
          outlined
          @click="handleClose"
          :disabled="uploading"
          class="w-full sm:w-auto"
        />
        <Button
          :label="$t('save')"
          icon="pi pi-check"
          @click="handleSave"
          :loading="saving"
          :disabled="uploading"
          class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 border-blue-600"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
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
const selectedBranch = ref<IBranchEntity | null>(null);
const filteredBranches = ref<IBranchEntity[]>([]);

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

const expenseDate = computed<Date | null>({
  get() {
    return form.value.expense_date ? new Date(form.value.expense_date) : null;
  },
  set(value) {
    form.value.expense_date = value ? value.toISOString().split("T")[0] : "";
  },
});

watch(selectedBranch, (newBranch) => {
  if (newBranch) {
    form.value.branch_id = newBranch.id;
  }
});

const searchBranches = (event: any) => {
  const query = event.query.toLowerCase();
  filteredBranches.value = props.branches.filter((branch) =>
    branch.name.toLowerCase().includes(query)
  );
};

const handleFileSelect = async (event: { files: File[] }) => {
  const file = event.files[0];
  if (!file) return;

  try {
    uploading.value = true;
    const imageUrl = await uploadImage(file);
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
  selectedBranch.value = null;
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
  } catch (error) {
    console.error("Error saving:", error);
  } finally {
    saving.value = false;
  }
};
</script>
