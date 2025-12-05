<template>
  <FormField
    v-slot="$field"
    :name="name"
    class="flex flex-col gap-1 flex-1"
    style="width: 100%"
  >
    <div v-if="resolvedType === 'boolean'" class="flex items-center gap-2 py-2">
      <Checkbox
        v-bind="$field"
        v-model="innerValue"
        :inputId="name"
        binary
      />
      <label :for="name" class="cursor-pointer select-none">{{ $t(label) }}</label>
    </div>

    <FloatLabel v-else variant="on" class="w-full">
      
      <IconField v-if="resolvedType !== 'textarea'" class="w-full">
        <InputIcon :class="icon" v-if="icon" style="z-index: 1" />

        <Password
          v-if="resolvedType === 'password'"
          v-bind="$field"
          v-model="innerValue"
          :feedback="false"
          toggleMask
          class="w-full"
          :inputClass="'w-full ' + (icon ? 'pl-10' : '')"
        />

        <Dropdown
          v-else-if="resolvedType === 'select'"
          v-bind="$field"
          v-model="innerValue"
          :options="options"
          :optionLabel="optionLabel"
          :optionValue="optionValue"
          class="w-full"
          :class="{ 'pl-10': icon }" 
          showClear
          filter
        />

        <InputNumber
          v-else-if="resolvedType === 'number'"
          v-bind="$field"
          v-model="innerValue"
          class="w-full"
          :inputClass="'w-full ' + (icon ? 'pl-10' : '')"
          mode="decimal"
          :useGrouping="false"
        />

        <InputText
          v-else
          v-bind="$field"
          :type="resolvedType"
          v-model="innerValue"
          class="w-full rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
          :class="{ 'pl-10': icon }"
        />
      </IconField>

      <Textarea
        v-else
        v-bind="$field"
        v-model="innerValue"
        class="w-full rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
        rows="3"
        autoResize
      />

      <label v-if="typeof resolvedType !== 'boolean'">{{ $t(label) }}</label>
    </FloatLabel>

    <Message v-if="$field.invalid" severity="error" size="small" class="mt-1">
      {{ $t($field.error?.message || "Invalid") }}
    </Message>
  </FormField>
</template>

<script setup lang="ts">
import { computed } from "vue";

// อย่าลืม import Dropdown จาก primevue ด้วยนะครับ
// import Dropdown from 'primevue/dropdown';

const props = withDefaults(
  defineProps<{
    modelValue?: any;
    name?: string;
    label?: string;
    icon?: string;
    
    // Props สำหรับ Dropdown
    options?: any[];       // รายการตัวเลือก
    optionLabel?: string;  // ชื่อ Key ที่จะแสดงผล (เช่น 'name')
    optionValue?: string;  // ชื่อ Key ที่จะเป็นค่า value (เช่น 'id')

    type?: "text" | "password" | "email" | "number" | "boolean" | "object" | "array" | "textarea" | "select"; 
  }>(),
  {
    modelValue: "",
    name: "",
    label: "",
    icon: undefined,
    type: "text",
    options: () => [],    // Default เป็น array ว่าง
    optionLabel: undefined,
    optionValue: undefined
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
}>();

const resolvedType = computed(() => {
  if (typeof props.modelValue === 'boolean') return 'boolean';
  return props.type || "text";
});

const innerValue = computed({
  get: () => {
    // Logic เดิมสำหรับแปลง Object/Array เป็น String ใน Textarea
    if (props.type === 'object' || props.type === 'array' || (typeof props.modelValue === 'object' && props.modelValue !== null && props.type !== 'select')) {
       try { return JSON.stringify(props.modelValue, null, 2); } catch (e) { return props.modelValue; }
    }
    return props.modelValue;
  },
  set: (val) => {
    if (props.type === 'object' || props.type === 'array') {
      try {
        const parsed = JSON.parse(val);
        emit("update:modelValue", parsed);
      } catch (e) {
        emit("update:modelValue", val); 
      }
    } else {
      emit("update:modelValue", val);
    }
  },
});
</script>

<style scoped>
/* CSS ปรับแต่งให้ input เต็มความกว้าง */
:deep(.p-inputnumber-input),
:deep(.p-password-input),
:deep(.p-dropdown) {
  width: 100%;
}

/* ปรับ Dropdown กรณีมี Icon */
:deep(.p-dropdown.pl-10 .p-dropdown-label) {
  padding-left: 2.5rem; /* เว้นที่ให้ Icon */
}
</style>