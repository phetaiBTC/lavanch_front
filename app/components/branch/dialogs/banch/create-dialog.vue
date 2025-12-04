<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="$t('add') + ' ' + $t('branches.sidebar.branch_label')"
    :modal="true"
    :closable="true"
    :dismissableMask="true"
    :draggable="false"
    class="w-full mx-4"
    :style="{ maxWidth: '600px' }"
    :breakpoints="{ '960px': '90vw', '640px': '95vw' }"
  >
    <div class="flex flex-col gap-4 sm:gap-5 p-2 sm:p-4">
      <!-- Branch Name -->
      <div class="flex flex-col gap-2">
        <label for="name" class="font-semibold text-gray-700 text-sm sm:text-base">
          {{ $t("branches.fields.name") }} <span class="text-red-500">*</span>
        </label>
        <InputText
          id="name"
          v-model="form.name"
          :placeholder="$t('branches.fields.name')"
          class="w-full"
          :class="{ 'p-invalid': errors.name }"
        />
        <small v-if="errors.name" class="text-red-500">{{ errors.name }}</small>
      </div>

      <!-- Address -->
      <div class="flex flex-col gap-2">
        <label for="address" class="font-semibold text-gray-700 text-sm sm:text-base">
          {{ $t("branches.fields.address") }}
        </label>
        <Textarea
          id="address"
          v-model="form.address"
          :placeholder="$t('branches.fields.address')"
          rows="3"
          class="w-full"
          autoResize
        />
      </div>

      <!-- Village (Searchable Dropdown) -->
      <div class="flex flex-col gap-2">
        <label for="village" class="font-semibold text-gray-700 text-sm sm:text-base">
          {{ $t("village") }}
        </label>
        <Select
          id="village"
          v-model="form.village_id"
          :options="addressOptions"
          optionLabel="full_address"
          optionValue="village_id"
          :placeholder="$t('select') + ' ' + $t('village')"
          filter
          :filterFields="['village_name', 'district_name', 'province_name', 'full_address']"
          class="w-full"
          :loading="loadingAddresses"
          :emptyFilterMessage="$t('No results found')"
          :emptyMessage="loadingAddresses ? $t('Loading...') : $t('No addresses available')"
        >
          <template #option="slotProps">
            <div class="flex flex-col py-1">
              <span class="font-semibold text-sm">{{ slotProps.option.village_name }}</span>
              <span class="text-xs text-gray-500">{{ slotProps.option.district_name }}, {{ slotProps.option.province_name }}</span>
            </div>
          </template>
        </Select>
      </div>

      <!-- Phone -->
      <div class="flex flex-col gap-2">
        <label for="phone" class="font-semibold text-gray-700 text-sm sm:text-base">
          {{ $t("branches.fields.phone") }}
        </label>
        <InputText
          id="phone"
          v-model="form.phone"
          :placeholder="$t('branches.fields.phone')"
          class="w-full"
          :class="{ 'p-invalid': errors.phone }"
          maxlength="11"
        />
        <small v-if="errors.phone" class="text-red-500">{{ errors.phone }}</small>
        <small class="text-gray-500 text-xs">{{ $t('branches.fields.phone_hint') }}</small>
      </div>

      <!-- Social Media - Collapsible on Mobile -->
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2">
          <i class="pi pi-users text-blue-600"></i>
          <span class="font-semibold text-gray-700 text-sm sm:text-base">{{ $t('branches.fields.social_media') }}</span>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Facebook -->
          <div class="flex flex-col gap-2">
            <label for="facebook" class="text-sm text-gray-600">Facebook</label>
            <InputText
              id="facebook"
              v-model="form.facebook"
              placeholder="Facebook Page URL"
              class="w-full text-sm"
            />
          </div>

          <!-- TikTok -->
          <div class="flex flex-col gap-2">
            <label for="tiktok" class="text-sm text-gray-600">TikTok</label>
            <InputText
              id="tiktok"
              v-model="form.tiktok"
              placeholder="TikTok Handle"
              class="w-full text-sm"
            />
          </div>
        </div>
      </div>

      <!-- Shift Selection -->
      <div class="flex flex-col gap-2" v-if="shifts && shifts.length > 0">
        <label for="shifts_id" class="font-semibold text-gray-700 text-sm sm:text-base">
          {{ $t("branches.fields.shift") }}
        </label>
        <Select
          id="shifts_id"
          v-model="form.shifts_id"
          :options="shifts"
          optionValue="id"
          :placeholder="$t('select') + ' ' + $t('branches.fields.shift')"
          class="w-full"
        >
          <template #option="slotProps">
            <div class="flex items-center gap-2">
              <i class="pi pi-clock text-blue-600 text-sm"></i>
              <span class="text-sm">{{ slotProps.option.start_time }} - {{ slotProps.option.end_time }}</span>
            </div>
          </template>
          <template #value="slotProps">
            <span v-if="slotProps.value" class="text-sm">
              {{ shifts.find(s => s.id === slotProps.value)?.start_time }} - 
              {{ shifts.find(s => s.id === slotProps.value)?.end_time }}
            </span>
          </template>
        </Select>
      </div>
    </div>

    <template #footer>
      <div class="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
        <Button
          :label="$t('cancel')"
          severity="secondary"
          @click="handleClose"
          class="w-full sm:w-auto"
          outlined
        />
        <Button
          :label="$t('save')"
          :loading="saving"
          @click="handleSave"
          class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          icon="pi pi-check"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { IBranchEntity } from "~/types/entities/branch.entity";
import type { IShiftsEntity } from "~/types/entities/shifts.entity";
import { useAddress, type IAddressOption } from "~/composables/address";
import { useToast } from "primevue/usetoast";

interface Props {
  visible: boolean;
  shifts?: IShiftsEntity[];
}

const props = defineProps<Props>();
const emit = defineEmits(["update:visible", "save"]);

const { getAllAddresses } = useAddress();
const toast = useToast();

const saving = ref(false);
const loadingAddresses = ref(false);
const addressOptions = ref<IAddressOption[]>([]);
const errors = ref<Record<string, string>>({});

const form = ref<Partial<IBranchEntity>>({
  name: "",
  address: "",
  village_id: null,
  phone: "",
  facebook: "",
  tiktok: "",
  shifts_id: null,
});

onMounted(async () => {
  loadingAddresses.value = true;
  try {
    addressOptions.value = await getAllAddresses();
    console.log('Loaded addresses:', addressOptions.value.length);
  } catch (error) {
    console.error('Error loading addresses:', error);
  } finally {
    loadingAddresses.value = false;
  }
});

const handleClose = () => {
  emit("update:visible", false);
  resetForm();
};

const resetForm = () => {
  form.value = {
    name: "",
    address: "",
    village_id: null,
    phone: "",
    facebook: "",
    tiktok: "",
    shifts_id: null,
  };
  errors.value = {};
};

const validateForm = () => {
  errors.value = {};
  
  if (!form.value.name?.trim()) {
    errors.value.name = "Branch name is required";
    return false;
  }
  
  if (form.value.phone && !/^\d{10,11}$/.test(form.value.phone)) {
    errors.value.phone = "Phone must be 10-11 digits";
    return false;
  }
  
  return true;
};

const handleSave = async () => {
  if (!validateForm()) {
    toast.add({
      severity: "warn",
      summary: "Validation Error",
      detail: "Please fix the errors before saving",
      life: 3000,
    });
    return;
  }

  saving.value = true;
  try {
    emit("save", form.value);
    // Only reset form if save was successful
    // The parent component will close the dialog
  } catch (error) {
    // Error is already handled by useFormHandler
    // Don't reset form so user can fix errors
  } finally {
    saving.value = false;
  }
};
</script>
