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
        v-show="props.is_active == Status.ACTIVE"
        :label="$t('delete')"
        icon="pi pi-trash"
        class="mr-2"
        severity="danger"
        @click="emit('deleteAll')"
      />
      <Button
        v-show="props.is_active == Status.INACTIVE"
        :label="$t('restore')"
        icon="pi pi-replay"
        severity=""
        @click=""
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
import { Status } from "~/types/enum/paginate.enum";

const props = defineProps<{
  is_active?: Status;
}>();
const emit = defineEmits<{
  (e: "add"): void;
  (e: "deleteAll"): void;
}>();
</script>

<style scoped></style>
