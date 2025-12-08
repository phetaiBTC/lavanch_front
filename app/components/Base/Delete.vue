<template>
  <Dialog
    :header="$t('delete')"
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
  >
    <SelectButton v-model="value" :options="options" />
    <template #footer>
      <Button
        :label="$t('cancel')"
        severity="secondary"
        @click="emit('update:visible', false)"
      />
      <Button :label="$t('save')" @click="emit('update:visible', false)" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  visible: boolean;
  id: number;
}>();
const emit = defineEmits(["update:visible"]);
const value = ref("Soft Delete");
const options = ref(["Soft Delete", "Hard Delete"]);
</script>

<style scoped></style>
