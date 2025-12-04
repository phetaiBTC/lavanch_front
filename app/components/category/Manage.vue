<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="isUpdate ? 'Update Category' : 'Create Category'"
    :style="{ width: '25rem' }"
  >
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-4">
        <label for="name" class="font-semibold w-24">Name</label>
        <InputText
          id="name"
          v-model="form.name"
          class="flex-auto"
          autocomplete="off"
        />
      </div>

      <div class="flex items-center gap-4">
        <label for="description" class="font-semibold w-24">Description</label>
        <InputText
          id="description"
          v-model="form.description"
          class="flex-auto"
          autocomplete="off"
        />
      </div>

      <div class="flex items-center gap-4">
        <label for="parent" class="font-semibold w-24">Parent ID</label>
        <InputNumber
          id="parent"
          v-model="form.parent"
          class="flex-auto"
          :show-buttons="true"
        />
      </div>

      <div class="flex items-center gap-4">
        <label for="children" class="font-semibold w-24">Children IDs</label>
        <InputText
          id="children"
          v-model="childrenInput"
          class="flex-auto"
          placeholder="Comma separated IDs"
        />
      </div>
    </div>

    <template #footer>
      <Button
        label="Cancel"
        text
        severity="secondary"
        @click="visible = false"
      />
      <Button
        label="Save"
        severity="secondary"
        @click="submitForm"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { CreateCategoriesDto, UpdateCategoriesDto } from "~/types/dto/categories.dto";


const props = defineProps<{
  visible: boolean;
  category?: UpdateCategoriesDto;
}>();
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'save', data: CreateCategoriesDto | UpdateCategoriesDto): void;
}>();

const visible = ref(props.visible);


const form = ref<CreateCategoriesDto | UpdateCategoriesDto>({
  id: props.category?.id,
  name: props.category?.name || "",
  description: props.category?.description || "",
  parent: props.category?.parent || null,
  children: props.category?.children || [],
});

const childrenInput = ref(form.value.children?.join(",") || "");

watch(childrenInput, (val) => {
  form.value.children = val
    .split(",")
    .map((v : string) => Number(v.trim()))
    .filter((v : number) => !isNaN(v));
});

const isUpdate = computed(() => !!props.category?.id);

function submitForm() {
  emit('save', form.value);
  emit('update:visible', false);
}
</script>

<style scoped></style>
