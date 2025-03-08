<template>
  <header class="flex items-center justify-between">
    <div class="search">
      <input type="text" placeholder="Search...">
    </div>
    <div class="logo-options flex items-center gap-4">
      <div class="support flex items-center justify-center">
        <a href="https://google.com" target="_blank">
          <Icon name="ic:twotone-support-agent" class="flex items-center justify-center" />
        </a>
      </div>
      <NuxtLink to="/dashboard">
        <img src="/logo.png" alt="">
      </NuxtLink>
    </div>
  </header>
</template>

<script setup>
</script>

<style scoped lang="scss">
header {
  height: theme("sizes.headerHeight");

  .search {
    input {
      padding: 5px 10px;
      border: 1px solid lightgray;
      border-radius: 5px;
      width: 400px;
    }
  }

  .logo-options {
    img {
      width: 80px;
    }

    .support {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      font-size: 35px;
      transition: .1s;
      cursor: pointer;

      &:hover {
        background-color: rgb(221, 221, 221);
      }
    }
  }
}
</style>