import { defineStore } from "pinia";
import Cookies from "universal-cookie";

type usersResponse = {
  ok: boolean;
  message: string;
  users: any;
  count: number;
};

export const useMyDashboardStore = defineStore({
  id: "myDashboardStore",
  state: () => ({
    users: [] as any[],
    page: 1,
    cases: [] as any[],
    usersCount: 0,
    search: "",
    loading: {
      error: false,
      progress: 0,
      show: false,
    },
    canGetUsers: true,
    companies: [],
  }),
  actions: {
    async getUsers() {
      const homeStore = useMyHomeStore();
      const { runErrorToast } = useShadcnHelpers();
      console.log(this.page);
      try {
        // 1. تحقق من الإمكانية قبل البدء
        if (!this.canGetUsers) return;

        // 2. إعداد حالة التحميل
        this.startLoading();
        this.canGetUsers = false;

        // 3. تنفيذ الطلب
        const response = await $fetch<usersResponse>(
          `${homeStore.baseUrl}/api/user?page=${this.page}&search=${this.search}`,
          {
            method: "GET",
            headers: homeStore.headers,
          }
        );

        this.usersCount = response.count;
        this.users = response.users;
        this.endLoading();
      } catch (error: any) {
        // 6. معالجة الأخطاء
        this.errorLoading();

        if (error.statusCode === 401) {
          useCookie("auth_token").value = null;
          return navigateTo("/login");
        }

        runErrorToast({
          title: "Error while fetching users.",
          message: error.data?.message || "Unknown error",
        });
      } finally {
        // 7. إعادة تعيين الإمكانية
        this.canGetUsers = true;
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
