<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="$t('delete') + ' ' + $t('branches.sidebar.branch_label')"
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
            {{ $t('delete_message', { name: branch?.name }) }}
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
