<template>
  <div class="loading fixed top-0 left-0 h-1 bg-black" v-show="dashboardStore.loading.show"
    :style="{ width: dashboardStore.loading.progress + '%' }">
  </div>
</template>

<script setup>
const dashboardStore = useMyDashboardStore()
</script>

<style scoped lang="scss">
.loading {
  transition: 1s;
  z-index: 99;
}
</style>