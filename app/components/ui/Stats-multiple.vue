<template>
  <div class="col-span-12 sm:col-span-6 lg:col-span-6 xl:col-span-3">
    <div class="card mb-0 hover:shadow-lg transition-shadow duration-300">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <span class="block text-sm sm:text-base font-medium mb-2 sm:mb-3 text-gray-600">{{ $t(title) }}</span>
          <span class="text-blue-600 text-xl sm:text-2xl font-bold mr-2">{{ count }}</span>
          <span v-if="type" class="text-gray-500 text-sm">{{ $t(type) }}</span>
        </div>
         <div class="flex-1">
          <span class="block text-sm sm:text-base font-medium mb-2 sm:mb-3 text-gray-600">{{ $t(title2) }}</span>
          <span class="text-blue-600 text-xl sm:text-2xl font-bold mr-2">{{ count2 }}</span>
          <span v-if="type2" class="text-gray-500 text-sm">{{ $t(type2) }}</span>
        </div>
        <div
          class="flex items-center justify-center rounded-lg border-2 border-blue-500 bg-blue-50 text-blue-600 flex-shrink-0"
          style="width: 2.5rem; height: 2.5rem"
        >
          <i :class="icon"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  title: string;
  title2: string;
  count: number | string;
  count2: number | string;
  type?: string;
  type2?: string;
  icon: string;
  icon2: string;
}>();
</script>
