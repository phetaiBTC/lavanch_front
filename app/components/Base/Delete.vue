<template>
  <Dialog
    :header="$t('delete')"
    :visible="visible"
    modal
    @update:visible="emit('update:visible', $event)"
  >
    <SelectButton
      v-model="value"
      :options="options"
      optionLabel="label"
      optionValue="value"
    />
    <template #footer>
      <Button
        :label="$t('cancel')"
        severity="secondary"
        @click="emit('update:visible', false)"
      />
      <Button
        :loading="loading"
        :label="$t('delete')"
        severity="danger"
        @click="handleDelete"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  visible: boolean;
  id: number[];
  endpoint: string;
}>();
const emit = defineEmits(["update:visible", "fetchData"]);
const value = ref("soft");
const options = ref([
  { label: "Soft Delete", value: "soft" },
  { label: "Hard Delete", value: "hard" },
]);
const loading = ref(false);
const toast = useToast();
const { t } = useI18n();
const { run } = useFormHandler();
const setLoading = (value: boolean) => {
  loading.value = value;
};
const handleDelete = async () => {
  await run(async () => {
    await Promise.all(
      props.id.map(async (id) => {
        return await useApi().delete<{ message: string }>(
          `/${props.endpoint}/${value.value}/${id}`
        );
      })
    );
    toast.add({
      severity: "success",
      summary: t("success"),
      detail: t("success"),
      life: 3000,
    });
  }, setLoading);
  emit("update:visible", false);
  emit("fetchData");
};
</script>

<style scoped></style>
