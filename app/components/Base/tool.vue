<template>
  <Toolbar class="mb-6">
    <template #start>
      <Button
        :label="$t('add') + $t('new')"
        icon="pi pi-plus"
        severity="secondary"
        class="mr-2"
        @click="emit('add')"
      />
      <Button
        :label="$t('delete')"
        icon="pi pi-trash"
        severity="danger"
      />
      <slot name="start"></slot>
    </template>
    <template #end>
      <!-- <Button label="Export" icon="pi pi-upload" severity="secondary" /> -->
      <slot name="end"></slot>
    </template>
  </Toolbar>
</template>

<script setup lang="ts">
const props = defineProps<{}>();
const emit = defineEmits<{
  (e: "add"): void;
  (e: "deleteAll"): void;
}>();
</script>

<style scoped></style>
