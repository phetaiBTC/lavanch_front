<template>
  <div class="grid grid-cols-12">
    <div class="card col-span-12">
      <Form><UiInput label="name"></UiInput></Form>
    </div>
    <div class="col-span-12 lg:col-span-3">
      <SelectButton
        v-model="value"
        :options="permissions"
        optionLabel="name"
        optionValue="id"
        multiple
        aria-labelledby="multiple"
      >
        <template #option="slotProps">
          <div class="flex align-items-center">
            <i :class="['pi', getMethodNamePermission(slotProps.option)]"></i>
          </div>
        </template>
      </SelectButton>
      <!-- <Button
        icon="pi pi-bookmark"
        severity="secondary"
        rounded
        aria-label="Bookmark"
      />
      <Button
        icon="pi pi-plus"
        severity="success"
        rounded
        aria-label="Search"
      />
      <Button icon="pi pi-pencil" severity="info" rounded aria-label="User" />
      <Button
        icon="pi pi-times"
        severity="danger"
        rounded
        aria-label="Cancel"
      /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { group } from "console";
import { ref } from "vue";
import type { IPermissionEntity } from "~/types/entities/permission.entity";
const checked = ref(false);
const formState = ref({
  code: "",
  permissions: [],
});
const value = ref(null);
const options = ref([
  { name: "Option 1", value: 1 },
  { name: "Option 2", value: 2 },
  { name: "Option 3", value: 3 },
]);
const getMethodNamePermission = (permissions: IPermissionEntity) => {
  const method = permissions.code.split("-")[1];
  if (method === "findOne") return "pi-bookmark";
  if (method === "findAll") return "pi-bookmark";
  if (method === "update") return "pi-user-edit";
  if (method === "softDelete") return "pi-trash";
  if (method === "hardDelete") return "pi-trash";
  if (method === "restore") return "pi-undo";
  if (method === "create") return "pi-plus";
  return "pi-bookmark";
};

const permissions = ref([
  {
    id: 9,
    code: "user-create",
    createdAt: "ພຸດ 29-10-2025",
    updatedAt: "ພຸດ 29-10-2025",
    deletedAt: null,
  },
  {
    id: 7,
    code: "user-restore",
    createdAt: "ອັງຄານ 21-10-2025",
    updatedAt: "ອັງຄານ 21-10-2025",
    deletedAt: null,
  },
  {
    id: 6,
    code: "user-hardDelete",
    createdAt: "ອັງຄານ 21-10-2025",
    updatedAt: "ອັງຄານ 21-10-2025",
    deletedAt: null,
  },
  {
    id: 5,
    code: "user-softDelete",
    createdAt: "ອັງຄານ 21-10-2025",
    updatedAt: "ອັງຄານ 21-10-2025",
    deletedAt: null,
  },
  {
    id: 4,
    code: "user-update",
    createdAt: "ອັງຄານ 21-10-2025",
    updatedAt: "ອັງຄານ 21-10-2025",
    deletedAt: null,
  },
  {
    id: 3,
    code: "user-changePassword",
    createdAt: "ອັງຄານ 21-10-2025",
    updatedAt: "ອັງຄານ 21-10-2025",
    deletedAt: null,
  },
  {
    id: 2,
    code: "user-findOne",
    createdAt: "ອັງຄານ 21-10-2025",
    updatedAt: "ອັງຄານ 21-10-2025",
    deletedAt: null,
  },
  {
    id: 1,
    code: "user-findAll",
    createdAt: "ອັງຄານ 21-10-2025",
    updatedAt: "ອັງຄານ 21-10-2025",
    deletedAt: null,
  },
  {
    id: 20,
    code: "category-restore",
    createdAt: "ພຸດ 29-10-2025",
    updatedAt: "ພຸດ 29-10-2025",
    deletedAt: null,
  },
  {
    id: 19,
    code: "category-hardDelete",
    createdAt: "ພຸດ 29-10-2025",
    updatedAt: "ພຸດ 29-10-2025",
    deletedAt: null,
  },
  {
    id: 18,
    code: "category-softDelete",
    createdAt: "ພຸດ 29-10-2025",
    updatedAt: "ພຸດ 29-10-2025",
    deletedAt: null,
  },
  {
    id: 17,
    code: "category-update",
    createdAt: "ພຸດ 29-10-2025",
    updatedAt: "ພຸດ 29-10-2025",
    deletedAt: null,
  },
  {
    id: 16,
    code: "category-findOne",
    createdAt: "ພຸດ 29-10-2025",
    updatedAt: "ພຸດ 29-10-2025",
    deletedAt: null,
  },
  {
    id: 15,
    code: "category-findAll",
    createdAt: "ພຸດ 29-10-2025",
    updatedAt: "ພຸດ 29-10-2025",
    deletedAt: null,
  },
  {
    id: 14,
    code: "category-create",
    createdAt: "ພຸດ 29-10-2025",
    updatedAt: "ພຸດ 29-10-2025",
    deletedAt: null,
  },
]);

</script>

<style scoped></style>
