<template>
  <div class="grid grid-cols-12 gap-8">
    <slot name="stats"></slot>
    <div class="col-span-12">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
