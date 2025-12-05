<template>
  <Dialog
    v-model:visible="visible"
    modals
    :header="isUpdate ? 'Update Category' : 'Create Category'"
    :style="{ width: '25rem' }"
  >
    <Form
      :resolver="validate"
      class="flex flex-col gap-5 mt-3"
      :initialValues="form"
      @submit="submitForm"
    >
      <ui-input name="name" label="name" v-model="form.name!"></ui-input>

      <ui-input
        name="description"
        label="description"
        v-model="form.description!"
      ></ui-input>

      <ui-input
        label="parent"
        type="select"
        :options="store.categoryList.data"
        optionLabel="name"
        optionValue="id"
        v-model="form.parent"
      />

      <!-- <ui-input
        name="children"
        type="select"
        label="children"
        :option-label="'name'"
        :option-value="'id'"
        v-model="childrenInput"
      /> -->
      <div class="flex justify-end gap-3">
        <Button
          label="Cancel"
          severity="danger"
          @click="() => emit('update:visible', false)"
        />
        <Button label="Save" severity="success" type="submit" />
      </div>
    </Form>
  </Dialog>
</template>

<script setup lang="ts">
import { UiInput } from "#components";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { ref, computed, watch } from "vue";
import {
  type ICreateCategoriesDto,
  type IUpdateCategoriesDto,
} from "~/types/dto/categories.dto";

import {
  CreateCategoriesDto,
  UpdateCategoriesDto,
} from "~/types/dto/categories.dto";
const store = useCategoryStore();
const { create, update } = useCategory();
const props = defineProps<{
  visible: boolean;
  category?: IUpdateCategoriesDto;
}>();

const visible = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value),
});
const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "save", data: ICreateCategoriesDto | IUpdateCategoriesDto): void;
}>();

const isUpdate = computed(() => !!props.category?.id);

const validate = computed(() =>
  zodResolver(isUpdate.value ? CreateCategoriesDto : UpdateCategoriesDto)
);
const form = ref<ICreateCategoriesDto | IUpdateCategoriesDto>({
  id: props.category?.id,
  name: props.category?.name || "",
  description: props.category?.description || "",
  parent: props.category?.parent || null,
  children: props.category?.children || [],
});

watch(
  () => props.visible,
  (visible) => {
    if (props.category) {
      form.value = {
        id: props.category?.id,
        name: props.category?.name || "",
        description: props.category?.description || "",
        parent: props.category?.parent || null,
        children: props.category?.children || [],
      };
    }
  },

  {
    immediate: true,
  }
);

const childrenInput = ref(form.value.children?.join(",") || "");

watch(childrenInput, (val) => {
  form.value.children = val
    .split(",")
    .map((v: string) => Number(v.trim()))
    .filter((v: number) => !isNaN(v));
});

const submitForm = () => {
  if (isUpdate.value && (form.value as IUpdateCategoriesDto).id) {
    update(
      (form.value as IUpdateCategoriesDto).id!,
      form.value as IUpdateCategoriesDto
    );
  } else {
    create(form.value as ICreateCategoriesDto);
  }
  emit("update:visible", false);
};
</script>

<style scoped></style>
