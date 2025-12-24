<script setup lang="ts">
const confirm = useConfirm();
const toast = useToast();
const { logout } = useAuth();
const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();
const confirmLogout = () => {
  confirm.require({
    message: "Do you want to logout?",
    header: "Logout Confirmation",
    icon: "pi pi-info-circle",
    rejectLabel: "Cancel",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Logout",
      severity: "danger",
    },
    accept: async () => {
      logout();
      toast.add({
        severity: "success",
        summary: "Confirmed",
        detail: "Logout success",
        life: 3000,
      });
    },
  });
};
</script>

<template>
  <div class="layout-topbar">
    <div class="layout-topbar-logo-container">
      <button
        class="layout-menu-button layout-topbar-action"
        @click="toggleMenu"
      >
        <i class="pi pi-bars"></i>
      </button>
      <router-link to="/" class="layout-topbar-logo">
        <Button icon="pi pi-shop" outlined rounded />
        <span>Paj xiong Px shop</span>
      </router-link>
    </div>

    <div class="layout-topbar-actions">
      <div class="layout-config-menu">
        <button
          type="button"
          class="layout-topbar-action"
          @click="toggleDarkMode"
        >
          <i
            :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"
          ></i>
        </button>
        <div class="relative">
          <button
            v-styleclass="{
              selector: '@next',
              enterFromClass: 'hidden',
              enterActiveClass: 'animate-scalein',
              leaveToClass: 'hidden',
              leaveActiveClass: 'animate-fadeout',
              hideOnOutsideClick: true,
            }"
            type="button"
            class="layout-topbar-action layout-topbar-action-highlight"
          >
            <i class="pi pi-palette"></i>
          </button>
          <LayoutsAppConfigurator />
        </div>
      </div>

      <button
        class="layout-topbar-menu-button layout-topbar-action"
        v-styleclass="{
          selector: '@next',
          enterFromClass: 'hidden',
          enterActiveClass: 'animate-scalein',
          leaveToClass: 'hidden',
          leaveActiveClass: 'animate-fadeout',
          hideOnOutsideClick: true,
        }"
      >
        <i class="pi pi-ellipsis-v"></i>
      </button>

      <div class="layout-topbar-menu hidden lg:block">
        <div class="layout-topbar-menu-content">
          <button type="button" class="layout-topbar-action">
            <i class="pi pi-calendar"></i>
            <span>Calendar</span>
          </button>
          <OverlayBadge severity="danger" value="4">
            <button type="button" class="layout-topbar-action">
              <i class="pi pi-inbox"></i>
              <span>Messages</span>
            </button>
          </OverlayBadge>
          <button
            type="button"
            class="layout-topbar-action"
            @click="navigateTo('/profile')"
          >
            <i class="pi pi-user"></i>
            <span>Profile</span>
          </button>
          <button
            type="button"
            @click="confirmLogout"
            class="layout-topbar-action"
          >
            <i class="pi pi-sign-out"></i>
            <span>{{ $t("logout") }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
