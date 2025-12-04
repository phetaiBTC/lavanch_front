<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="$t('hardDelete') + ' ' + $t('branches.sidebar.categories_expenses_label')"
    :modal="true"
    :closable="true"
    :dismissableMask="true"
    :draggable="false"
    class="w-full mx-4"
    :style="{ maxWidth: '500px' }"
    :breakpoints="{ '960px': '90vw', '640px': '95vw' }"
  >
    <div class="flex flex-col gap-4 p-2 sm:p-4">
      <div class="flex items-start gap-3">
        <i class="pi pi-exclamation-triangle text-5xl text-red-600 flex-shrink-0"></i>
        <div class="flex-1">
          <p class="font-bold text-lg mb-2 text-red-600">{{ $t('warning') }}!</p>
          <p class="font-semibold text-gray-900 mb-3">{{ $t('confirm_hard_delete') }}</p>
          <p class="text-gray-600 text-sm sm:text-base mb-3">
            {{ $t('hard_delete_message') }}
          </p>
          <div v-if="category" class="bg-red-50 border border-red-200 rounded-lg p-3">
            <div class="flex items-center gap-2">
              <i class="pi pi-tag text-red-600 text-sm"></i>
              <span class="font-semibold text-red-900">{{ category.name }}</span>
            </div>
            <p v-if="category.code" class="text-xs text-red-700 mt-1">Code: {{ category.code }}</p>
          </div>
          <p class="text-red-600 font-medium text-sm mt-3">
            ⚠️ {{ $t('cannot_undo_action') }}
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
          :label="$t('hardDelete')"
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
import type { IExpenseCategoryEntity } from "~/types/entities/expense-category.entity";

const props = defineProps<{
  visible: boolean;
  category: IExpenseCategoryEntity | null;
}>();

const emit = defineEmits(["update:visible", "delete"]);

const deleting = ref(false);

const handleClose = () => {
  emit("update:visible", false);
};

const handleDelete = async () => {
  if (!props.category) return;
  
  deleting.value = true;
  try {
    emit("delete", props.category);
  } finally {
    deleting.value = false;
  }
};
</script>
