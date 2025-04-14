<template>
  <aside class="flex flex-col gap-4">
    <div class="logo">
      <img src="/dashboard/sidebar/malamihLogo.png" alt="" />
    </div>
    <ul class="links flex flex-col gap-2">
      <li v-for="(link, i) in links" :key="i">
        <NuxtLink :to="link.path" class="flex items-center gap-3">
          <div class="icon flex items-center justify-center">
            <Icon :name="link.icon" />
          </div>
          <span>{{ link.name }}</span>
        </NuxtLink>
      </li>
    </ul>
  </aside>
</template>

<script setup>
const links = [
  {
    name: "Users",
    icon: "ic:outline-supervisor-account",
    path: "/dashboard",
  },
  {
    name: "Settings",
    icon: "ic:outline-settings",
    path: "/dashboard/settings",
  },
  {
    name: "Companies",
    icon: "ic:outline-home-work",
    path: "/dashboard/companies",
  },
];
</script>

<style scoped lang="scss">
aside {
  width: theme("sizes.sidebarWidth");
  border-right: 1px solid lightgray;
  position: sticky;
  left: 0;
  top: 0;
  height: 100dvh;
  .logo {
    padding: 1rem;

    img {
      width: 140px;
    }
  }

  .links {
    li {
      a {
        padding: 10px 1rem;
        transition: 0.2s;

        &.router-link-active {
          background-color: rgb(235, 235, 235);
        }

        .icon {
          font-size: 23px;
        }
      }
    }
  }
}
</style>
