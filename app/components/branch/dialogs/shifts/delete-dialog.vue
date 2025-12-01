<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="$t('delete') + ' ' + $t('branches.fields.shift')"
    :modal="true"
    :closable="true"
    :style="{ width: '450px' }"
    
  >
    <div class="flex flex-col gap-4 p-4">
      <div class="flex items-center gap-3">
        <i class="pi pi-exclamation-triangle text-4xl text-orange-500"></i>
        <div>
          <p class="font-semibold">{{ $t('confirm_delete') }}</p>
          <p class="text-muted-color">
            {{ $t('delete_shift_message', { time: `${shift?.start_time} - ${shift?.end_time}` }) }}
          </p>
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
        :label="$t('delete')"
        severity="danger"
        :loading="deleting"
        @click="handleDelete"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { IShiftsEntity } from "~/types/entities/shifts.entity";

const props = defineProps<{
  visible: boolean;
  shift: IShiftsEntity | null;
}>();

const emit = defineEmits(["update:visible", "delete"]);

const deleting = ref(false);

const handleClose = () => {
  emit("update:visible", false);
};

const handleDelete = async () => {
  if (!props.shift) return;
  
  deleting.value = true;
  try {
    emit("delete", props.shift);
  } finally {
    deleting.value = false;
  }
};
</script>
