<template>
  <div>
    <div class="grid grid-cols-12 gap-8">
      <slot name="stats"></slot>
      <div class="col-span-12">
        <div class="card">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
