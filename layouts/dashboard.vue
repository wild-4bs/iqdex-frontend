<template>
  <div class="dashboard-layout">
    <DashboardLoading />
    <DashboardSidebar />
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style scoped lang="scss">
.dashboard-layout {
  display: grid;
  grid-template-columns: theme("sizes.sidebarWidth") auto;
  min-height: 100vh;
  gap: 1rem;

  aside {
    grid-row: 1 / 3;
  }
}
</style>