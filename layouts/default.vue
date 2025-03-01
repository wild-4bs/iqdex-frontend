<template>
  <Toaster />
  <div class="layout">
    <div class="wrapper">
      <slot />
      <Sponsors />
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style scoped lang="scss">
.layout {
  width: 100%;
  min-height: 100dvh;
  background-image: url("@/assets/home/background.png");
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  &::before {
    content: '';
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, #002277, #0b40c9);
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    opacity: .7;
    z-index: -1;
  }
  @media (max-width: 1080px) {
    background: white;
  }
  .wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 96%;

    @media (max-width: 1080px) {
      flex-direction: column;
      align-items: start;
      justify-content: start;
      width: 99%;
    }
  }

  * {
    z-index: 1;
    position: relative;
  }

  
}
</style>