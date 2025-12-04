<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="$t('add') + ' ' + $t('branches.sidebar.categories_expenses_label')"
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
import { ref } from "vue";
import type { IExpenseCategoryEntity } from "~/types/entities/expense-category.entity";
import { useToast } from "primevue/usetoast";

const toast = useToast();

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits(["update:visible", "save"]);

const saving = ref(false);

const form = ref<Partial<IExpenseCategoryEntity>>({
  name: "",
  code: "",
  description: "",
});

const handleClose = () => {
  emit("update:visible", false);
  form.value = {
    name: "",
    code: "",
    description: "",
  };
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
