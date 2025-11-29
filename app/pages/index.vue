<template>
  <div
    class="flex justify-center items-center bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6"
  >
    <div class="max-w-2xl w-full">
      <div
        class="bg-white/80 backdrop-blur-lg p-8 md:p-12 rounded-lg shadow-lg"
      >
        <h1
          class="text-4xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4"
        >
          Welcome to Lavanch POS
        </h1>

        <div class="text-center mb-8">
          <p class="text-2xl md:text-3xl font-semibold text-gray-700 mb-2">
            ຫນ້ານີ້ຍັງບໍ່ພ້ອມໃຊ້ງານ
          </p>
          <p class="text-lg text-gray-600">ກະລຸນາລໍຖ້າທີມພັດທະນາອັບເດດ</p>
        </div>

        <div class="flex justify-center mb-8">
          <span
            class="inline-flex items-center px-6 py-3 rounded-full bg-blue-100 text-blue-700 font-medium"
          >
            <span
              class="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"
            ></span>
            Under Development
          </span>
        </div>

        <!-- Progress Bar -->
        <div class="mb-8">
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-blue-600 to-pink-600 rounded-full animate-pulse"
              style="width: 50%"
            ></div>
          </div>
          <p class="text-center text-sm text-gray-500 mt-2">
            Development in progress... 50%
          </p>
        </div>
      </div>

      <p class="text-center text-gray-500 mt-6 text-sm">
        Thank you for your patience | ຂອບໃຈສໍາລັບຄວາມອົດທົນຂອງທ່ານ
      </p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
