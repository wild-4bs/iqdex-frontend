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
    debug: true,
  },
  app: {
    head: {
      title: "IQDEX 2025 | Badge Request - طلب شارة الدخول",
      meta: [
        {
          name: "title",
          content: "IQDEX 2025 | Badge Request - طلب شارة الدخول",
        },
        {
          name: "description",
          content:
            "IQDEX 2025 - المعرض الدولي للدفاع في العراق. أحد أبرز معارض الدفاع في منطقة الشرق الأوسط وشمال إفريقيا، يعرض أحدث التقنيات في مجالات الدفاع البرية، البحرية والجوية. IQDEX 2025 is a premier defense exhibition in the MENA region, showcasing cutting-edge technology across land, sea, and air defense sectors.",
        },
        {
          name: "keywords",
          content:
            "IQDEX 2025, International Defense Exhibition, Iraq, MENA, Defense Technology, Security, Military, Badge Request, معرض الدفاع الدولي, العراق, تقنيات الدفاع, الأمن, شارة الدخول",
        },
        { name: "author", content: "Malamih Creative" },
        // Open Graph / Facebook
        {
          property: "og:title",
          content: "IQDEX 2025 | Badge Request - طلب شارة الدخول",
        },
        {
          property: "og:description",
          content:
            "المعرض الدولي للدفاع في العراق - أحد أبرز معارض الدفاع في المنطقة، يعرض أحدث تقنيات الدفاع. IQDEX 2025 is a premier defense exhibition in the MENA region, showcasing cutting-edge technology.",
        },
        { property: "og:image", content: "/image.png" },
        { property: "og:url", content: "http://iqdex.expo-badge.com" }, // استبدل بالرابط الفعلي
        { property: "og:type", content: "website" },
        // Twitter
        {
          name: "twitter:title",
          content: "IQDEX 2025 | Badge Request - طلب شارة الدخول",
        },
        {
          name: "twitter:description",
          content:
            "IQDEX 2025 - المعرض الدولي للدفاع في العراق، يعرض أحدث التقنيات الدفاعية في القطاعات البرية، البحرية والجوية. A leading defense exhibition showcasing cutting-edge technology.",
        },
        { name: "twitter:image", content: "/image.png" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    },
  },
  build: {
    transpile: ["xlsx"],
  },
});
