<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="$t('delete') + ' ' + $t('branches.sidebar.branch_label')"
    :modal="true"
    :closable="true"
    :dismissableMask="true"
    :draggable="false"
    class="w-full mx-4"
    :style="{ maxWidth: '450px' }"
    :breakpoints="{ '960px': '90vw', '640px': '95vw' }"
  >
    <div class="flex flex-col gap-4 p-2 sm:p-4">
      <div class="flex items-start gap-3">
        <i class="pi pi-exclamation-triangle text-3xl sm:text-4xl text-orange-500 flex-shrink-0"></i>
        <div class="flex-1">
          <p class="font-semibold text-base sm:text-lg">{{ $t('confirm_delete') }}</p>
          <p class="text-gray-600 mt-2 text-sm sm:text-base">
            {{ $t('delete_message', { name: branch?.name }) }}
          </p>
        </div>
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
          :label="$t('delete')"
          severity="danger"
          :loading="deleting"
          @click="handleDelete"
          class="w-full sm:w-auto"
          icon="pi pi-trash"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { IBranchEntity } from "~/types/entities/branch.entity";

const props = defineProps<{
  visible: boolean;
  branch: IBranchEntity | null;
}>();

const emit = defineEmits(["update:visible", "delete"]);

const deleting = ref(false);

const handleClose = () => {
  emit("update:visible", false);
};

const handleDelete = async () => {
  if (!props.branch) return;
  
  deleting.value = true;
  try {
    emit("delete", props.branch);
  } finally {
    deleting.value = false;
  }
};
</script>
