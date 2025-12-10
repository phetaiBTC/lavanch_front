<script setup lang="ts">
import type { MenuItem } from "~/shared/interface/MenuItem";
const { t } = useI18n();
const model = ref<MenuItem[]>([
  {
    label: t("home"),
    items: [
      { label: t("Dashboard"), icon: "pi pi-fw pi-home", to: "/" }, // หน้าแรก
    ],
  },
  {
    label: t("users"),
    items: [
      { label: t("users"), icon: "pi pi-fw pi-users", to: "/user" }, // คนหลายคน
      { label: t("roles"), icon: "pi pi-fw pi-shield", to: "/role" }, // บทบาท / Role
    ],
  },{
    label: t("branches.branch"),
    items: [
      { label: t("branches.sidebar.branch_label"), icon: "pi pi-fw pi-sitemap", to: "/branch" }, // คนหลายคน
      { label: t("branches.sidebar.branch_expenses_label"), icon: "pi pi-money-bill", to: "/branch_expenses" }, // คนหลายคน
      { label: t("branches.sidebar.categories_expenses_label"), icon: "pi pi-tags", to: "/categories_expenses" }, // คนหลายคน
      { label: t("branches.sidebar.wallet_adjustment_label"), icon: "pi pi-sync", to: "/wallet_adjustment" }, // คนหลายคน
      { label: t("branches.sidebar.wallet_transactions_label"), icon: "pi pi-history", to: "/wallet_transactions" }, // คนหลายคน
    ],
  },
  {
    label: t("products"),
    items: [
      { label: t("products"), icon: "pi pi-fw pi-box", to: "/product" }, // สินค้า
      { label: t("categories"), icon: "pi pi-fw pi-tags", to: "/category" }, // หมวดหมู่
      { label: t("units"), icon: "pi pi-fw pi-align-justify", to: "/unit" }, // หน่วย
      {
        label: t("products") + " " + t("units"),
        icon: "pi pi-fw pi-clone", // ตัวคูณ / combo
        to: "/product-unit",
      },
      {
        label: t("products") + " " + t("variants"),
        icon: "pi pi-fw pi-sliders-h", // ตัวเลือก / variant
        to: "/product-variant",
      },
      {
        label: t("products") + " " + t("points"),
        icon: "pi pi-fw pi-star", // คะแนน / points
        // to: "/product-point",
      },
      {
        label: t("products") + " " + t("log"),
        icon: "pi pi-fw pi-history", // log / history
        // to: "/product-log",
      },
    ],
  },
  {
    label: t("point"),
    items: [
      { label: t("point"), icon: "pi pi-asterisk", to: "/point" }, // คะแนนหลัก
      {
        label: t("point") + " " + t("products"),
        icon: "pi pi-fw pi-box", // สินค้า
   
      },
      {
        label: t("point") + " " + t("customer"),
        icon: "pi pi-fw pi-user-plus", // ลูกค้า / add user
       
      },
    ],
  },
  {
    label: t("currency"),
    items: [
      { label: t("currency"), icon: "pi pi-fw pi-money-bill", to: "/currency" },
      { label: t("currencyRate") ,icon: "pi pi-fw pi-sync", to: "/currency-rate" },
    ]
  },
  {
    label:t("procurement"),
    items:[
      {label:t("supplier"),icon:"pi pi-fw pi-user-plus",to:"/supplier"},
    ]
  }
  // {
  //   label: "UI Components",
  //   items: [
  //     {
  //       label: "Form Layout",
  //       icon: "pi pi-fw pi-id-card",
  //       to: "/uikit/formlayout",
  //     },
  //     { label: "Input", icon: "pi pi-fw pi-check-square", to: "/uikit/input" },
  //     {
  //       label: "Button",
  //       icon: "pi pi-fw pi-mobile",
  //       to: "/uikit/button",
  //       class: "rotated-icon",
  //     },
  //     { label: "Table", icon: "pi pi-fw pi-table", to: "/uikit/table" },
  //     { label: "List", icon: "pi pi-fw pi-list", to: "/uikit/list" },
  //     { label: "Tree", icon: "pi pi-fw pi-share-alt", to: "/uikit/tree" },
  //     { label: "Panel", icon: "pi pi-fw pi-tablet", to: "/uikit/panel" },
  //     { label: "Overlay", icon: "pi pi-fw pi-clone", to: "/uikit/overlay" },
  //     { label: "Media", icon: "pi pi-fw pi-image", to: "/uikit/media" },
  //     { label: "Menu", icon: "pi pi-fw pi-bars", to: "/uikit/menu" },
  //     { label: "Message", icon: "pi pi-fw pi-comment", to: "/uikit/message" },
  //     { label: "File", icon: "pi pi-fw pi-file", to: "/uikit/file" },
  //     { label: "Chart", icon: "pi pi-fw pi-chart-bar", to: "/uikit/charts" },
  //     {
  //       label: "Timeline",
  //       icon: "pi pi-fw pi-calendar",
  //       to: "/uikit/timeline",
  //     },
  //     { label: "Misc", icon: "pi pi-fw pi-circle", to: "/uikit/misc" },
  //   ],
  // },
  // {
  //   label: "Pages",
  //   icon: "pi pi-fw pi-briefcase",
  //   to: "/pages",
  //   items: [
  //     {
  //       label: "Landing",
  //       icon: "pi pi-fw pi-globe",
  //       to: "/landing",
  //     },
  //     {
  //       label: "Auth",
  //       icon: "pi pi-fw pi-user",
  //       items: [
  //         {
  //           label: "Login",
  //           icon: "pi pi-fw pi-sign-in",
  //           to: "/auth/login",
  //         },
  //         {
  //           label: "Error",
  //           icon: "pi pi-fw pi-times-circle",
  //           to: "/auth/error",
  //         },
  //         {
  //           label: "Access Denied",
  //           icon: "pi pi-fw pi-lock",
  //           to: "/auth/access",
  //         },
  //       ],
  //     },
  //     {
  //       label: "Crud",
  //       icon: "pi pi-fw pi-pencil",
  //       to: "/pages/crud",
  //     },
  //     {
  //       label: "Not Found",
  //       icon: "pi pi-fw pi-exclamation-circle",
  //       to: "/pages/notfound",
  //     },
  //     {
  //       label: "Empty",
  //       icon: "pi pi-fw pi-circle-off",
  //       to: "/pages/empty",
  //     },
  //   ],
  // },
  // {
  //   label: "Hierarchy",
  //   items: [
  //     {
  //       label: "Submenu 1",
  //       icon: "pi pi-fw pi-bookmark",
  //       items: [
  //         {
  //           label: "Submenu 1.1",
  //           icon: "pi pi-fw pi-bookmark",
  //           items: [
  //             { label: "Submenu 1.1.1", icon: "pi pi-fw pi-bookmark" },
  //             { label: "Submenu 1.1.2", icon: "pi pi-fw pi-bookmark" },
  //             { label: "Submenu 1.1.3", icon: "pi pi-fw pi-bookmark" },
  //           ],
  //         },
  //         {
  //           label: "Submenu 1.2",
  //           icon: "pi pi-fw pi-bookmark",
  //           items: [{ label: "Submenu 1.2.1", icon: "pi pi-fw pi-bookmark" }],
  //         },
  //       ],
  //     },
  //     {
  //       label: "Submenu 2",
  //       icon: "pi pi-fw pi-bookmark",
  //       items: [
  //         {
  //           label: "Submenu 2.1",
  //           icon: "pi pi-fw pi-bookmark",
  //           items: [
  //             { label: "Submenu 2.1.1", icon: "pi pi-fw pi-bookmark" },
  //             { label: "Submenu 2.1.2", icon: "pi pi-fw pi-bookmark" },
  //           ],
  //         },
  //         {
  //           label: "Submenu 2.2",
  //           icon: "pi pi-fw pi-bookmark",
  //           items: [{ label: "Submenu 2.2.1", icon: "pi pi-fw pi-bookmark" }],
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   label: "Get Started",
  //   items: [
  //     {
  //       label: "Documentation",
  //       icon: "pi pi-fw pi-book",
  //       to: "/documentation",
  //     },
  //     {
  //       label: "View Source",
  //       icon: "pi pi-fw pi-github",
  //       url: "https://github.com/primefaces/sakai-vue",
  //       target: "_blank",
  //     },
  //   ],
  // },
]);
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <layouts-app-menu-item
        v-if="!item.separator"
        :item="item"
        :index="i"
        :root="true"
      ></layouts-app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
