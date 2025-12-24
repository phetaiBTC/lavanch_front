<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="$t('edit') + ' ' + $t('branches.fields.shift')"
    :modal="true"
    :closable="true"
    :style="{ width: '500px' }"
    
  >
    <div class="flex flex-col gap-4 p-4">
      <!-- Start Time -->
      <div class="flex flex-col gap-2">
        <label for="start_time">{{ $t("branches.fields.start_time") }} *</label>
        <InputText
          id="start_time"
          v-model="form.start_time"
          type="time"
          :placeholder="$t('branches.fields.start_time')"
          class="w-full"
        />
      </div>

      <!-- End Time -->
      <div class="flex flex-col gap-2">
        <label for="end_time">{{ $t("branches.fields.end_time") }} *</label>
        <InputText
          id="end_time"
          v-model="form.end_time"
          type="time"
          :placeholder="$t('branches.fields.end_time')"
          class="w-full"
        />
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
import { ref, watch } from "vue";
import type { IShiftsEntity } from "~/types/entities/shifts.entity";
import { useToast } from "primevue/usetoast";

const toast = useToast();

const props = defineProps<{
  visible: boolean;
  shift: IShiftsEntity;
}>();

const emit = defineEmits(["update:visible", "save"]);

const saving = ref(false);

const form = ref<Partial<IShiftsEntity>>({
  start_time: "",
  end_time: "",
});

watch(
  () => props.shift,
  (newShift) => {
    if (newShift) {
      form.value = {
        start_time: newShift.start_time,
        end_time: newShift.end_time,
      };
    }
  },
  { immediate: true }
);

const handleClose = () => {
  emit("update:visible", false);
};

const handleSave = async () => {
  if (!form.value.start_time || !form.value.end_time) {
    toast.add({
      severity: "warn",
      summary: "Validation Error",
      detail: "Please enter start and end time",
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
