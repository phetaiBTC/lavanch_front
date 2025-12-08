<template>
  <Button
    :label="$t('back')"
    severity="secondary"
    @click="goBack"
    icon="pi pi-arrow-left"
    variant="outlined"
  ></Button>
</template>

<script setup lang="ts">
const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<style scoped></style>
