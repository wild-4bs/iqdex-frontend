// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/global.scss"],
  modules: ["@pinia/nuxt", "shadcn-nuxt", "@nuxtjs/tailwindcss", "@nuxt/icon"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/vars/_sizes.scss" as *;',
        },
      },
    },
  },
  nitro: {
    debug: true
  },
  app: {
    head: {
      title: "IQDEX 2025",
    },
  },
  build: {
    transpile: ['xlsx']
  }
});
