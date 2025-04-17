<template>
  <div class="settings p-4 w-[500px] m-auto">
    <h1 class="text-2xl font-bold mb-4">Settings page</h1>
    <div class="badge settings flex items-center justify-between gap-3">
      <div class="title text-xl">
        <h2>Badge expired?</h2>
      </div>
      <Switch
        :disabled="!canSend"
        :model-value="badge_expired"
        @update:model-value="toggleBadge"
      />
    </div>
  </div>
</template>

<script setup>
const canSend = ref(true);
const badge_expired = ref(false);
const homeStore = useMyHomeStore();
const admin = ref({});
const dashboardStore = useMyDashboardStore();
const { runToast, runErrorToast } = useShadcnHelpers();

const getBadge = async () => {
  try {
    const response = await $fetch(`${homeStore.baseUrl}/api/admin`, {
      method: "GET",
      headers: homeStore.headers,
    });
    admin.value = response.admin;
    badge_expired.value = response.admin.badge_expired;
  } catch (error) {
    runErrorToast({
      title: "Settings error",
      message: error.statusMessage,
    });
  }
};

const toggleBadge = async () => {
  if (!canSend) return;
  canSend.value = false;
  try {
    dashboardStore.startLoading();
    if (badge_expired.value && JSON.stringify(admin.value) != "{}") {
      const response = await $fetch(
        `${homeStore.baseUrl}/api/admin/allowBadge`,
        {
          method: "POST",
          body: {
            id: admin.value.id,
          },
          headers: homeStore.headers,
        }
      );
      badge_expired.value = response.badge_expired;
      runToast(response.message);
    } else if (!badge_expired.value && JSON.stringify(admin.value) != "{}") {
      const response = await $fetch(
        `${homeStore.baseUrl}/api/admin/expireBadge`,
        {
          method: "POST",
          body: {
            id: admin.value.id,
          },
          headers: homeStore.headers,
        }
      );
      badge_expired.value = response.badge_expired;
      runToast(response.message);
    }
    await getBadge();
    dashboardStore.endLoading();
  } catch (error) {
    console.log(error);
    dashboardStore.errorLoading();
    runErrorToast({
      title: "Badge Error",
      message: error.statusMessage,
    });
  } finally {
    canSend.value = true;
  }
};

onMounted(async () => {
  await getBadge();
});

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});
</script>
