<template>
  <aside class="flex flex-col gap-4">
    <div class="logo">
      <img src="/dashboard/sidebar/malamihLogo.png" alt="">
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
    name: "Dashboard",
    icon: "ic:baseline-space-dashboard",
    path: "/dashboard"
  },
  {
    name: "Settings",
    icon: "ic:outline-settings",
    path: "/dashboard/settings"
  },
  {
    name: "Companies",
    icon: "ic:outline-home-work",
    path: "/dashboard/companies"
  },
]

</script>

<style scoped lang="scss">
aside {
  width: theme("sizes.sidebarWidth");
  border-right: 1px solid lightgray;

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
        transition: .2s;

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