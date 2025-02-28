<template>
  <main>
    <HomeHeader />
    <div class="message flex flex-col gap-1 justify-center">
      <h1 class="text-5xl mb-4 font-medium">Thank you for your interest.</h1>
      <p class="text-lg font-medium">Applications for this year have ended.</p>
      <p class="font-medium" @click="openToast">See you next year.</p>
    </div>
  </main>
</template>

<script setup>
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