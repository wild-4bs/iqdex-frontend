import { defineStore } from "pinia";

export const useMyCompaniesStore = defineStore({
  id: "myCompaniesStore",
  state: () => ({
    companies: [] as any,
    filteredCompanies: [] as any,
    selectedCompany: {},
    canDoActions: true,
  }),
  actions: {
    async getCompanies() {
      const router = useRouter();
      const homeStore = useMyHomeStore();
      const { runErrorToast } = useShadcnHelpers();
      try {
        const response: any = await $fetch(`${homeStore.baseUrl}/api/company`, {
          method: "GET",
          headers: homeStore.headers,
        });
        this.companies = response.companies;
        this.filteredCompanies = response.companies;
      } catch (error: any) {
        homeStore.handleError(error);
        runErrorToast({
          title: "Something went wrong.",
          message: error.statusMessage,
        });
      }
    },
    async deleteCompany(id: any) {
      const dashboardStore = useMyDashboardStore();
      const homeStore = useMyHomeStore();
      const { runErrorToast, runToast } = useShadcnHelpers();
      try {
        if (!this.canDoActions) return;
        this.canDoActions = false;
        dashboardStore.startLoading();
        const response: any = await $fetch(
          `${homeStore.baseUrl}/api/company/${id}`,
          {
            method: "DELETE",
            headers: homeStore.headers,
          }
        );
        this.canDoActions = true;
        dashboardStore.endLoading();
        await this.getCompanies();
        runToast(response.message);
      } catch (error: any) {
        homeStore.handleError(error);
        dashboardStore.errorLoading();
        runErrorToast({
          title: "Company Error",
          message: error.statusMessage,
        });
      } finally {
        this.canDoActions = true;
      }
    },
  },
});
