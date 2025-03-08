import Cookies from "universal-cookie";
import { defineStore } from "pinia";

export const useMyHomeStore = defineStore({
  id: "HomeStore",
  state: () => ({
    baseUrl: "https://iqdex-api.vercel.app",
    user: {} as any,
    expired: false,
  }),
  actions: {
    handleError(error: any) {
      const cookies = new Cookies()
      if (error.statusCode == 401) {
        cookies.remove('auth_token')
        navigateTo('/login')
      }
      if (!error.statusCode) {
        navigateTo("/login");
      }
    },
  },
  getters: {
    headers() {
      const cookies = new Cookies();
      const token = cookies.get("auth_token");
      return {
        Authorization: `Bearer ${token}`,
      };
    },
  },
});
