import { defineStore } from "pinia";
import Cookies from "universal-cookie";

type usersResponse = {
  ok: boolean;
  message: string;
  users: any;
};

export const useMyDashboardStore = defineStore({
  id: "myDashboardStore",
  state: () => ({
    users: [] as any[],
    cases: [] as any[],
    filteredUsers: [] as any,
    loading: {
      error: false,
      progress: 0,
      show: false,
    },
    companies: [],
  }),
  actions: {
    async getUsers() {
      const homeStore = useMyHomeStore();
      const { runErrorToast } = useShadcnHelpers();
      const cookies = new Cookies()
      try {
        const response = await $fetch<usersResponse>(
          `${homeStore.baseUrl}/api/user`,
          {
            method: "GET",
            headers: homeStore.headers,
          }
        );
        if (response.ok) {
          this.users = response.users;
          this.filteredUsers = response.users;
        }
      } catch (error: any) {
        homeStore.handleError(error);
        runErrorToast({
          title: "Error while fetching users.",
          message: error.statusMessage,
        });
      }
    },
    startLoading() {
      this.loading.show = true;
      setTimeout(() => {
        this.loading.progress = 88;
      }, 300);
    },
    endLoading() {
      this.loading.progress = 100;
      setTimeout(() => {
        this.loading.show = false;
        this.loading.progress = 0;
      }, 1000);
    },
    errorLoading() {
      this.loading.error = true;
      this.loading.progress = 0;
      setTimeout(() => {
        this.loading.show = false;
      }, 1000);
    },
  },
  getters: {},
});
