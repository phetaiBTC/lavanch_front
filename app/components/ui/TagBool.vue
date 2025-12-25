<template>
  <Tag :severity="value ? 'success' : 'danger'" :value="value ? $t('true') : $t('false')" />
</template>

<script setup lang="ts">
const props = defineProps<{ value: boolean }>();
</script>

<style scoped></style>
