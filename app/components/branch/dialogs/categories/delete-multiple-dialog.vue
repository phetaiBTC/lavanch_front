<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="$t('delete') + ' ' + $t('branches.sidebar.categories_expenses_label')"
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
        <i class="pi pi-exclamation-triangle text-4xl text-orange-500 flex-shrink-0"></i>
        <div class="flex-1">
          <p class="font-semibold text-lg mb-2">{{ $t('confirm_delete') }}</p>
          <p class="text-gray-600 text-sm sm:text-base">
            {{ $t('delete_multiple_message', { count: categories?.length || 0 }) }}
          </p>
          <div v-if="categories && categories.length > 0" class="mt-4">
            <p class="font-medium mb-2 text-sm text-gray-700">{{ $t('selected_items') }}:</p>
            <ul class="list-none pl-0 space-y-2 max-h-48 overflow-y-auto bg-gray-50 rounded-lg p-3">
              <li v-for="category in categories" :key="category.id" class="flex items-center gap-2 text-sm">
                <i class="pi pi-tag text-blue-600 text-xs"></i>
                <span class="font-medium">{{ category.name }}</span>
              </li>
            </ul>
          </div>
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
import type { IExpenseCategoryEntity } from "~/types/entities/expense-category.entity";

const props = defineProps<{
  visible: boolean;
  categories: IExpenseCategoryEntity[] | null;
}>();

const emit = defineEmits(["update:visible", "delete"]);

const deleting = ref(false);

const handleClose = () => {
  emit("update:visible", false);
};

const handleDelete = async () => {
  if (!props.categories || props.categories.length === 0) return;
  
  deleting.value = true;
  try {
    emit("delete", props.categories);
  } finally {
    deleting.value = false;
  }
};
</script>
