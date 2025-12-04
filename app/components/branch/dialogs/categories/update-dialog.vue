<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="$t('edit') + ' ' + $t('branches.sidebar.expense_categories_label')"
    :modal="true"
    :closable="true"
    :style="{ width: '500px' }"
    
  >
    <div class="flex flex-col gap-4 p-4">
      <!-- Category Name -->
      <div class="flex flex-col gap-2">
        <label for="name">{{ $t("branches.fields.category_name") }} *</label>
        <InputText
          id="name"
          v-model="form.name"
          :placeholder="$t('branches.fields.category_name')"
          class="w-full"
        />
      </div>

      <!-- Code -->
      <div class="flex flex-col gap-2">
        <label for="code">{{ $t("branches.fields.code") }}</label>
        <InputText
          id="code"
          v-model="form.code"
          :placeholder="$t('branches.fields.code')"
          class="w-full"
        />
      </div>

      <!-- Description -->
      <div class="flex flex-col gap-2">
        <label for="description">{{ $t("branches.fields.description") }}</label>
        <Textarea
          id="description"
          v-model="form.description"
          :placeholder="$t('branches.fields.description')"
          rows="3"
          class="w-full"
        />
      </div>

      <!-- Status -->
      <div class="flex flex-col gap-2">
        <label for="is_active">{{ $t("branches.fields.status") }}</label>
        <div class="flex items-center gap-2">
          <Checkbox
            id="is_active"
            v-model="form.is_active"
            :binary="true"
          />
          <label for="is_active">{{ $t("branches.fields.active") }}</label>
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
        :label="$t('save')"
        :loading="saving"
        @click="handleSave"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { IExpenseCategoryEntity } from "~/types/entities/expense-category.entity";
import { useToast } from "primevue/usetoast";

const toast = useToast();

const props = defineProps<{
  visible: boolean;
  category: IExpenseCategoryEntity;
}>();

const emit = defineEmits(["update:visible", "save"]);

const saving = ref(false);

const form = ref<Partial<IExpenseCategoryEntity>>({
  name: "",
  code: "",
  description: "",
  is_active: true,
});

watch(
  () => props.category,
  (newCategory) => {
    if (newCategory) {
      form.value = {
        name: newCategory.name,
        code: newCategory.code || "",
        description: newCategory.description || "",
        is_active: newCategory.is_active ?? true,
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
      detail: "Please enter category name",
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
