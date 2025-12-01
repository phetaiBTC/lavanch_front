<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="$t('edit') + ' ' + $t('branches.sidebar.branch_label')"
    :modal="true"
    :closable="true"
    :style="{ width: '600px' }"
    
  >
    <div class="flex flex-col gap-4 p-4">
      <!-- Branch Name -->
      <div class="flex flex-col gap-2">
        <label for="name">{{ $t("branches.fields.name") }} *</label>
        <InputText
          id="name"
          v-model="form.name"
          :placeholder="$t('branches.fields.name')"
          class="w-full"
        />
      </div>

      <!-- Address -->
      <div class="flex flex-col gap-2">
        <label for="address">{{ $t("branches.fields.address") }}</label>
        <Textarea
          id="address"
          v-model="form.address"
          :placeholder="$t('branches.fields.address')"
          rows="2"
          class="w-full"
        />
      </div>

      <!-- Village (Searchable Dropdown) -->
      <div class="flex flex-col gap-2">
        <label for="village">{{ $t("village") }}</label>
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
            <div class="flex flex-col">
              <span class="font-semibold">{{ slotProps.option.village_name }}</span>
              <span class="text-sm text-gray-500">{{ slotProps.option.district_name }}, {{ slotProps.option.province_name }}</span>
            </div>
          </template>
        </Select>
      </div>

      <!-- Phone -->
      <div class="flex flex-col gap-2">
        <label for="phone">{{ $t("branches.fields.phone") }}</label>
        <InputText
          id="phone"
          v-model="form.phone"
          :placeholder="$t('branches.fields.phone')"
          class="w-full"
        />
      </div>

      <!-- Facebook -->
      <div class="flex flex-col gap-2">
        <label for="facebook">Facebook</label>
        <InputText
          id="facebook"
          v-model="form.facebook"
          placeholder="Facebook Page URL"
          class="w-full"
        />
      </div>

      <!-- TikTok -->
      <div class="flex flex-col gap-2">
        <label for="tiktok">TikTok</label>
        <InputText
          id="tiktok"
          v-model="form.tiktok"
          placeholder="TikTok Handle"
          class="w-full"
        />
      </div>

      <!-- Shift Selection -->
      <div class="flex flex-col gap-2" v-if="shifts && shifts.length > 0">
        <label for="shifts_id">{{ $t("branches.fields.shift") }}</label>
        <Select
          id="shifts_id"
          v-model="form.shifts_id"
          :options="shifts"
          optionValue="id"
          :placeholder="$t('select') + ' ' + $t('branches.fields.shift')"
          class="w-full"
        >
          <template #option="slotProps">
            {{ slotProps.option.start_time }} - {{ slotProps.option.end_time }}
          </template>
          <template #value="slotProps">
            <span v-if="slotProps.value">
              {{ shifts.find(s => s.id === slotProps.value)?.start_time }} - 
              {{ shifts.find(s => s.id === slotProps.value)?.end_time }}
            </span>
          </template>
        </Select>
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
import { ref, watch, onMounted } from "vue";
import type { IBranchEntity } from "~/types/entities/branch.entity";
import type { IShiftsEntity } from "~/types/entities/shifts.entity";
import { useAddress, type IAddressOption } from "~/composables/address";
import { useToast } from "primevue/usetoast";

interface Props {
  visible: boolean;
  branch: IBranchEntity;
  shifts?: IShiftsEntity[];
}

const props = defineProps<Props>();
const emit = defineEmits(["update:visible", "save"]);

const { getAllAddresses } = useAddress();
const toast = useToast();

const saving = ref(false);
const loadingAddresses = ref(false);
const addressOptions = ref<IAddressOption[]>([]);

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

// Watch for branch changes
watch(
  () => props.branch,
  (newBranch) => {
    if (newBranch) {
      form.value = {
        name: newBranch.name,
        address: newBranch.address || "",
        village_id: newBranch.village_id || null,
        phone: newBranch.phone || "",
        facebook: newBranch.facebook || "",
        tiktok: newBranch.tiktok || "",
        shifts_id: newBranch.shifts_id || null,
      };
    }
  },
  { immediate: true }
);

const handleClose = () => {
  emit("update:visible", false);
};

const handleSave = async () => {
  if (!form.value.name?.trim()) {
    toast.add({
      severity: "warn",
      summary: "Validation Error",
      detail: "Please enter branch name",
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
