<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    modal
    :header="$t('add') + ' ' + $t('branches.sidebar.branch_expenses_label')"
    :style="{ width: '70rem' }"
    :breakpoints="{ '1199px': '85vw', '575px': '95vw' }"
    
  >
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
      <!-- Left: Form Data (8 columns) -->
      <div class="md:col-span-8 space-y-4">
        <h3 class="text-lg font-semibold text-gray-700 border-b pb-2">
          {{ $t('branchExpenses.sections.form_data') }}
        </h3>
        
        <div class="grid grid-cols-1 gap-4">
          <!-- Branch -->
          <div class="flex flex-col gap-2">
            <label class="font-medium text-sm text-gray-700">
              {{ $t('branches.fields.name') }}
              <span class="text-red-500">*</span>
            </label>
            <Select
              v-model="form.branch_id"
              :options="branchOptions"
              :loading="loadingBranches"
              optionLabel="name"
              optionValue="id"
              filter
              :filterFields="['name']"
              :placeholder="loadingBranches ? 'Loading branches...' : $t('branchExpenses.placeholders.search_branch')"
              class="w-full"
            >
              <template #option="slotProps">
                <div class="flex items-center gap-2">
                  <i class="pi pi-building text-blue-600 text-xs"></i>
                  <span>{{ slotProps.option.name }}</span>
                </div>
              </template>
            </Select>
            <small v-if="branchError" class="text-red-500">
              {{ branchError }}
              <a href="#" @click.prevent="loadBranches" class="underline ml-2">{{ $t('retry') }}</a>
            </small>
            <small v-else-if="branchOptions.length === 0 && !loadingBranches" class="text-gray-500">
              No branches available
            </small>
          </div>

          <!-- Expense Category -->
          <div class="flex flex-col gap-2">
            <label class="font-medium text-sm text-gray-700">
              {{ $t('branchExpenses.fields.category') }}
              <span class="text-red-500">*</span>
            </label>
            <Select
              v-model="form.expense_category_id"
              :options="categoryOptions"
              :loading="loadingCategories"
              optionLabel="name"
              optionValue="id"
              filter
              :filterFields="['name']"
              :placeholder="loadingCategories ? $t('branchExpenses.placeholders.loading_categories') : $t('branchExpenses.placeholders.select_category')"
              class="w-full"
            >
              <template #option="slotProps">
                <div class="flex items-center gap-2">
                  <i class="pi pi-tag text-blue-600 text-xs"></i>
                  <span>{{ slotProps.option.name }}</span>
                </div>
              </template>
            </Select>
            <small v-if="categoryError" class="text-red-500">
              {{ categoryError }}
              <a href="#" @click.prevent="loadCategories" class="underline ml-2">{{ $t('retry') }}</a>
            </small>
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

          <!-- Currency -->
          <div class="flex flex-col gap-2">
            <label class="font-medium text-sm text-gray-700">
              {{ $t('branchExpenses.fields.currency') }}
              <span class="text-red-500">*</span>
            </label>
            <Select
              v-model="form.currency_id"
              :options="currencyOptions"
              :loading="loadingCurrencies"
              optionLabel="name"
              optionValue="id"
              filter
              :filterFields="['name', 'code']"
              :placeholder="loadingCurrencies ? $t('branchExpenses.placeholders.loading_currencies') : $t('branchExpenses.placeholders.select_currency')"
              class="w-full"
            >
              <template #option="slotProps">
                <div class="flex items-center gap-2">
                  <i class="pi pi-dollar text-blue-600 text-xs"></i>
                  <span>{{ slotProps.option.code }} - {{ slotProps.option.name }}</span>
                </div>
              </template>
              <template #value="slotProps">
                <span v-if="slotProps.value">
                  {{ currencyOptions.find(c => c.id === slotProps.value)?.code }} - 
                  {{ currencyOptions.find(c => c.id === slotProps.value)?.name }}
                </span>
              </template>
            </Select>
            <small v-if="currencyError" class="text-red-500">
              {{ currencyError }}
              <a href="#" @click.prevent="loadCurrencies" class="underline ml-2">{{ $t('retry') }}</a>
            </small>
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
          <div class="flex flex-col gap-2">
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
          <div class="flex flex-col gap-2">
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

      <!-- Right: Image Upload (4 columns) -->
      <div class="md:col-span-4 space-y-4">
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
            :chooseLabel="$t('branchExpenses.actions.choose_image')"
            class="w-full"
          />
          
          <div v-if="uploading" class="flex items-center gap-2">
            <ProgressSpinner style="width: 20px; height: 20px" strokeWidth="4" />
            <span class="text-sm">{{ $t('branchExpenses.messages.uploading') }}</span>
          </div>
          
          <div v-if="imagePreview" class="relative">
            <img 
              :src="imagePreview" 
              alt="Receipt Preview" 
              class="w-full h-auto rounded border max-h-80 object-contain" 
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
import { ref, computed, watch, onMounted } from "vue";
import type { IBranchEntity } from "~/types/entities/branch.entity";
import type { IExpenseCategoryEntity } from "~/types/entities/expense-category.entity";
import type { IBranchExpenseEntity } from "~/types/entities/branch-expense.entity";
import type { PaginatedResponse } from "~/shared/entities/paginate.entity";
import { useImageUpload } from "~/composables/image-upload";
import { useAddress, type IDistrictEntity, type IVillageEntity } from "~/composables/address";
import { useToast } from "primevue/usetoast";
import { Status } from "~/types/enum/paginate.enum";

interface ICurrencyEntity {
  id: number;
  code: string;
  name: string;
  symbol: string;
  exchange_rate: number;
  is_active: boolean;
}

interface Props {
  visible: boolean;
  branches: IBranchEntity[];
  categories?: IExpenseCategoryEntity[];
}

const props = defineProps<Props>();
const emit = defineEmits(["update:visible", "save"]);

// Debug: Watch branches prop
watch(() => props.branches, (newBranches) => {
  console.log('Branches prop updated:', newBranches?.length, newBranches);
}, { immediate: true });

const { uploadImage } = useImageUpload();
const { getDistricts, getVillages } = useAddress();
const toast = useToast();

const saving = ref(false);
const uploading = ref(false);
const loadingCategories = ref(false);
const loadingCurrencies = ref(false);
const loadingVillages = ref(false);
const loadingBranches = ref(false);
const categoryError = ref("");
const currencyError = ref("");
const branchError = ref("");
const categoryOptions = ref<IExpenseCategoryEntity[]>([]);
const currencyOptions = ref<ICurrencyEntity[]>([]);
const branchOptions = ref<IBranchEntity[]>([]);
const imagePreview = ref("");

// Address selections
const districts = ref<IDistrictEntity[]>([]);
const villages = ref<IVillageEntity[]>([]);
const selectedDistrictId = ref<number | null>(null);
const selectedVillageId = ref<number | null>(null);

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

// Watch dialog visibility to load data when opened
watch(() => props.visible, (isVisible) => {
  if (isVisible) {
    if (categoryOptions.value.length === 0) {
      loadCategories();
    }
    if (currencyOptions.value.length === 0) {
      loadCurrencies();
    }
    // Load branches if not provided via props or if props.branches is empty
    if (!props.branches || props.branches.length === 0) {
      if (branchOptions.value.length === 0) {
        loadBranches();
      }
    } else {
      // Use branches from props
      branchOptions.value = props.branches;
    }
  }
});

// Watch branch selection to load districts
watch(() => form.value.branch_id, async (newBranchId) => {
  if (newBranchId && newBranchId > 0) {
    const selectedBranch = branchOptions.value.find(b => b.id === newBranchId);
    if (selectedBranch?.village?.district?.province?.id) {
      try {
        loadingVillages.value = true;
        districts.value = await getDistricts(selectedBranch.village.district.province.id);
        selectedDistrictId.value = selectedBranch.village.district.id;
      } catch (error) {
        console.error("Failed to load districts:", error);
      } finally {
        loadingVillages.value = false;
      }
    }
  }
});

// Watch district selection to load villages
watch(selectedDistrictId, async (newDistrictId) => {
  selectedVillageId.value = null;
  villages.value = [];
  
  if (newDistrictId) {
    try {
      loadingVillages.value = true;
      villages.value = await getVillages(newDistrictId);
    } catch (error) {
      console.error("Failed to load villages:", error);
    } finally {
      loadingVillages.value = false;
    }
  }
});

// Load categories from API
const loadCategories = async () => {
  loadingCategories.value = true;
  categoryError.value = "";
  
  try {
    const res = await useApi().get<PaginatedResponse<IExpenseCategoryEntity>>(
      "/expense-categories",
      { 
        query: { 
          page: 1, 
          limit: 100, 
          is_active: Status.ACTIVE 
        } 
      }
    );
    console.log('Expense categories API response:', res);
    categoryOptions.value = res?.data || [];
    console.log('Category options loaded:', categoryOptions.value.length);
    
    if (categoryOptions.value.length === 0) {
      categoryError.value = "No active categories found";
    }
  } catch (error) {
    console.error("Failed to load categories:", error);
    categoryError.value = "Failed to load categories";
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to load expense categories",
      life: 3000,
    });
  } finally {
    loadingCategories.value = false;
  }
};

// Load currencies from API
const loadCurrencies = async () => {
  loadingCurrencies.value = true;
  currencyError.value = "";
  
  try {
    const res = await useApi().get<PaginatedResponse<ICurrencyEntity>>(
      "/currencies",
      { 
        query: { 
          page: 1, 
          limit: 100, 
          is_active: Status.ACTIVE 
        } 
      }
    );
    console.log('Currencies API response:', res);
    currencyOptions.value = res?.data || [];
    console.log('Currency options loaded:', currencyOptions.value.length);
    
    if (currencyOptions.value.length === 0) {
      currencyError.value = "No active currencies found";
    } else if (currencyOptions.value.length > 0 && currencyOptions.value[0]) {
      // Set default currency to first option if not set
      if (!form.value.currency_id || form.value.currency_id === 0) {
        form.value.currency_id = currencyOptions.value[0].id;
      }
    }
  } catch (error) {
    console.error("Failed to load currencies:", error);
    currencyError.value = "Failed to load currencies";
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to load currencies",
      life: 3000,
    });
  } finally {
    loadingCurrencies.value = false;
  }
};

// Load branches from API
const loadBranches = async () => {
  loadingBranches.value = true;
  branchError.value = "";
  
  try {
    const res = await useApi().get<PaginatedResponse<IBranchEntity>>(
      "/branches",
      { 
        query: { 
          page: 1, 
          limit: 100, 
          is_active: Status.ACTIVE 
        } 
      }
    );
    console.log('Branches API response:', res);
    branchOptions.value = res?.data || [];
    console.log('Branch options loaded:', branchOptions.value.length);
    
    if (branchOptions.value.length === 0) {
      branchError.value = "No active branches found";
    }
  } catch (error) {
    console.error("Failed to load branches:", error);
    branchError.value = "Failed to load branches";
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to load branches",
      life: 3000,
    });
  } finally {
    loadingBranches.value = false;
  }
};

const handleFileSelect = async (event: { files: File[] }) => {
  const file = event.files[0];
  if (!file) return;

  try {
    uploading.value = true;
    
    // Create preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    
    // Upload image
    const uploadedImages = await uploadImage(file);
    console.log('Uploaded image:', uploadedImages);
    
    // Handle the response - it should be a string URL
    if (typeof uploadedImages === 'string') {
      form.value.receipt_image = uploadedImages;
    } else {
      form.value.receipt_image = uploadedImages;
    }
    
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Image uploaded successfully",
      life: 3000,
    });
  } catch (error) {
    console.error("Failed to upload image:", error);
    imagePreview.value = "";
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to upload image. Please try again.",
      life: 3000,
    });
  } finally {
    uploading.value = false;
  }
};

const removeImage = () => {
  form.value.receipt_image = "";
  imagePreview.value = "";
};

const handleClose = () => {
  emit("update:visible", false);
  resetForm();
};

const resetForm = () => {
  const defaultCurrencyId = currencyOptions.value.length > 0 && currencyOptions.value[0] 
    ? currencyOptions.value[0].id 
    : 1;
    
  form.value = {
    branch_id: 0,
    expense_category_id: 0,
    amount: 0,
    currency_id: defaultCurrencyId,
    expense_date: new Date().toISOString().split("T")[0],
    description: "",
    notes: "",
    receipt_image: "",
  };
  selectedDistrictId.value = null;
  selectedVillageId.value = null;
  districts.value = [];
  villages.value = [];
  imagePreview.value = "";
};

const handleSave = async () => {
  // Validate required fields with specific messages
  if (!form.value.branch_id || form.value.branch_id === 0) {
    toast.add({
      severity: "warn",
      summary: "Validation Error",
      detail: "Branch is required",
      life: 3000,
    });
    return;
  }

  if (!form.value.expense_category_id || form.value.expense_category_id === 0) {
    toast.add({
      severity: "warn",
      summary: "Validation Error",
      detail: "Category is required",
      life: 3000,
    });
    return;
  }

  if (!form.value.amount || form.value.amount <= 0) {
    toast.add({
      severity: "warn",
      summary: "Validation Error",
      detail: "Amount is required and must be greater than 0",
      life: 3000,
    });
    return;
  }

  if (!form.value.currency_id || form.value.currency_id === 0) {
    toast.add({
      severity: "warn",
      summary: "Validation Error",
      detail: "Currency is required",
      life: 3000,
    });
    return;
  }

  if (!form.value.expense_date) {
    toast.add({
      severity: "warn",
      summary: "Validation Error",
      detail: "Expense date is required",
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
