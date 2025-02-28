<template>
  <main>
    <HomeHeader />
    <div class="message flex flex-col gap-4 justify-center">
      <h1 class="text-6xl font-medium">Thank you</h1>
      <p class="text-lg font-medium">After approving the information..
        We will send you the entry card via email or WhatsApp (as specified)</p>
    </div>
  </main>
</template>

<script setup>
const router = useRouter()
const homeStore = useMyHomeStore()
if (JSON.stringify(homeStore.user) == "{}") {
  router.push("/")
}
</script>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  height: 90dvh;

  .message {
    flex: 1;
    padding-left: 20px;
  }
}
</style>