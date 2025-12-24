<template>
  <div class="flex justify-center items-center p-6">
    <div class="max-w-xl w-full">
      <div class="bg-white p-10 rounded-2xl shadow-md border border-gray-100">
        <h1
          class="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6"
        >
          ເວບໄຊທ໌ນີ້ໃຊ້ ddd
        </h1>

        <div class="text-center mb-10">
          <p class="text-xl font-medium text-gray-700 mb-1">
            ຫນ້ານີ້ກໍາລັງພັດທະນາ
          </p>
          <p class="text-gray-500">ກະລຸນາລໍຖ້າການອັບເດດຈາກທີມພັດທະນາ</p>
        </div>

        <!-- Status -->
        <div class="flex justify-center mb-10">
          <span
            class="inline-flex items-center px-5 py-2.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium"
          >
            <span
              class="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-ping"
            ></span>
            Development in Progress
          </span>
        </div>

        <!-- Clean Progress Bar -->
        <div>
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-blue-500 rounded-full transition-all"
              style="width: 50%"
            ></div>
          </div>
          <p class="text-center text-xs text-gray-500 mt-2">50% Completed</p>
        </div>
      </div>

      <p class="text-center text-gray-400 mt-6 text-xs">Lavanch POS © 2025</p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
